/**
 * Build MCP folder structure as a zip — aligned with Portable-ChatGPT-Data-Transformer schema.
 * Called right after parsing. No server.
 */

import JSZip from "jszip";
import type { Snapshot, EvidenceRow, ProfileSynopsis } from "./types";
import {
  USAGE_MODES_CATEGORIES,
  PROBLEM_TYPES,
  PROJECT_TYPES,
  DETECTION_METADATA,
  WORLDVIEW_LENSES_TAXONOMY,
} from "./mcpSchema";

const ZIP_FILENAME = "pdt-export.zip";

function indexJson(snapshot: Snapshot): string {
  return JSON.stringify(
    {
      format: "PORTABLE_CHATGPT_DATA_TRANSFORMER_V0",
      artifact_name: "Continuity Snapshot",
      generated_at: new Date().toISOString(),
      source: {
        platform: "chatgpt",
        export_type: "json",
        export_range: { start: snapshot.date_range.first, end: snapshot.date_range.last },
        notes: "Derived from a representative sample for usage classification and a high-signal subset for evidence.",
      },
      privacy: {
        storage_policy: "no_accounts_no_persistence",
        processing_note: "Upload is processed once to generate outputs; no user accounts; no return access.",
        redaction_note:
          "This MVP does not guarantee perfect redaction. Avoid uploading if export includes highly sensitive data.",
      },
      files: {
        overview: "overview.md",
        readme: "README.md",
        usage_modes: "usage_modes.json",
        projects: "projects.json",
        concepts: "concepts.json",
        decisions_open_questions: "decisions_open_questions.md",
        evidence: "evidence.jsonl",
      },
      preview_expectations: {
        no_user_editing: true,
        trust_building: "Preview should show evidence snippets that support surfaced projects/concepts/usage categories.",
      },
    },
    null,
    2
  );
}

function usageModesJson(snapshot: Snapshot): string {
  const distribution: Record<string, number> = {};
  for (const c of USAGE_MODES_CATEGORIES) {
    distribution[c.id] = snapshot.usage_signature.find((u) => u.id === c.id)?.pct ?? 0;
  }
  return JSON.stringify(
    {
      method: {
        classification_unit: "user_messages",
        approach: "representative_sampling_plus_intent_signals",
        notes: "Percentages are approximate. Low-confidence items are assigned to 'other_mixed'.",
      },
      categories: USAGE_MODES_CATEGORIES.map((c) => ({
        id: c.id,
        label: c.label,
        definition: c.definition,
        examples_of_signals: c.examples_of_signals,
      })),
      distribution,
    },
    null,
    2
  );
}

function projectsJson(snapshot: Snapshot): string {
  const summary_by_problem = PROBLEM_TYPES.map((p) => ({ problem_type: p.id, count_estimate: 0 }));
  // Map parser project_type labels (e.g. "Writing · Publishing") to schema ids
  const projectTypeToId: Record<string, string> = {
    "Writing · Publishing": "writing_publishing",
    "Product · Platform": "product_tool_building",
    "Technical · Engineering": "product_tool_building",
    "Business · Strategy": "business_strategy",
    "Research · Frameworks": "research_frameworks",
    "Design · Creative": "creative_experimental",
    "Community · Organizing": "other_mixed",
    "Civic Tech · Research": "research_frameworks",
  };
  const projects = snapshot.top_projects.slice(0, 20).map((p, i) => ({
    project_id: `proj_${String(i + 1).padStart(3, "0")}`,
    name: p.name,
    aliases: [] as string[],
    project_type: (p.project_type && projectTypeToId[p.project_type]) ? projectTypeToId[p.project_type] : "other_mixed",
    problem_type: "other_mixed",
    problem_statement: p.summary || "Detected from conversation titles and recurrence.",
    success_looks_like: [] as string[],
    description: p.summary || [p.first_date, p.last_date].filter(Boolean).join(" — ") || "From your conversation history.",
    status: p.status ?? "active",
    primary_domains: [] as string[],
    timeline: {
      first_mentioned: p.first_date || null,
      last_mentioned: p.last_date || null,
      active_span_label: [p.first_date, p.last_date].filter(Boolean).length ? `${p.first_date ?? "?"} → ${p.last_date ?? "?"}` : null,
      mention_count_estimate: null as number | null,
    },
    outputs: [] as unknown[],
    decisions: [] as unknown[],
    open_questions: [] as unknown[],
    key_moments: [] as unknown[],
    prompt_pack: [] as unknown[],
    confidence: { project_detected: "low" as const, problem_statement: "low" as const, status: "low" as const },
    privacy: { access_level: "full", notes: "" },
  }));
  return JSON.stringify(
    {
      problem_types: PROBLEM_TYPES.map((p) => ({ id: p.id, label: p.label })),
      project_types: PROJECT_TYPES.map((p) => ({ id: p.id, label: p.label })),
      detection_metadata: DETECTION_METADATA,
      summary_by_problem,
      projects,
    },
    null,
    2
  );
}

function conceptsJson(snapshot: Snapshot): string {
  const worldview_lenses = WORLDVIEW_LENSES_TAXONOMY.map((l) => ({
    lens_id: l.lens_id,
    label: l.label,
    description: l.description,
    concept_ids: [] as string[],
    supporting_evidence_ids: [] as string[],
    coverage: { project_count: null, conversation_count_estimate: 0, evidence_count: 0 },
    confidence: "low" as const,
  }));
  const concepts = snapshot.interest_tags.slice(0, 15).map((name, i) => ({
    concept_id: `con_${String(i + 1).padStart(3, "0")}`,
    name: name.replace(/^\w/, (c) => c.toUpperCase()),
    aliases: [] as string[],
    working_definition: "Recurring theme derived from your conversation language.",
    supports_worldview_lens: null as string | null,
    tensions: [] as string[],
    related_projects: [] as string[],
    timeline: { first_mentioned: null as string | null, last_mentioned: null as string | null, mention_count_estimate: 0 },
    key_conversations: [] as { conversation_id: string; title: string; date: string; evidence_ids: string[] }[],
    evidence_top: [] as string[],
    confidence: { concept_detected: "low" as const, definition: "low" as const },
    privacy: { access_level: "full", notes: "" },
  }));
  return JSON.stringify(
    {
      schema_version: "0.1",
      values_taxonomy_schwartz: { enabled: true },
      worldview_lenses,
      values_tags_schwartz: [] as unknown[],
      concepts,
    },
    null,
    2
  );
}

function overviewMd(snapshot: Snapshot): string {
  const dist: Record<string, number> = {};
  for (const u of snapshot.usage_signature) dist[u.id] = u.pct;
  const catLines = USAGE_MODES_CATEGORIES.map((c) => `- ${c.label} — **${dist[c.id] ?? 0}%**`).join("\n");
  const projectLines = snapshot.top_projects.slice(0, 10).map((p) => {
    const dates = [p.first_date, p.last_date].filter(Boolean).join(" · ");
    return `- **${p.name}** (${dates ? `First mentioned: ${dates}` : "—"})  
  ${p.summary || "Detected from your conversation history."}  
  Status: active / exploratory / unclear`;
  }).join("\n\n");
  const lensLines = WORLDVIEW_LENSES_TAXONOMY.map((l) => `- ${l.label}`).join("\n");
  const conceptLines = snapshot.interest_tags.slice(0, 10).map((t) => `- **${t.replace(/^\w/, (c) => c.toUpperCase())}** — recurring theme from your conversations`).join("\n");
  return `# Continuity Snapshot

This document summarizes how I used ChatGPT, what I worked on, and the ideas I explored.
It is a best-effort synthesis generated from my ChatGPT export.

This is not a full transcript.
It is a continuity snapshot — designed to preserve meaning, not volume.

---

## How I Used ChatGPT

Based on patterns in my messages, my usage clustered around the activities below.
Percentages are approximate.

${catLines}

Overall, ChatGPT was used primarily as a thinking and synthesis partner rather than for one-off answers.

(Details: \`usage_modes.json\`)

---

## Types of Projects I Worked On

Across my conversations, my work clustered around several kinds of projects:

- Writing & publishing (e.g., articles, essays, Substack drafts)
- Product & tool building
- Research & framework development
- Business & strategy exploration
- Creative / experimental work

(Details: \`projects.json\`)

---

## Active & Recurring Projects

The following projects appeared repeatedly or with sustained depth:

${projectLines || "- (None detected from conversation titles. Run a fuller pipeline for project extraction.)"}

(Details + references: \`projects.json\` and \`evidence.jsonl\`)

---

## Worldview Signals (Descriptive)

Across conversations, several recurring lenses may appear:

${lensLines}

These are descriptive patterns, not definitive traits.
They are grounded in recurring concepts and evidence excerpts rather than inferred personality claims.

(Details: \`concepts.json\` and \`evidence.jsonl\`)

---

## Core Concepts & Frameworks

These ideas recur across conversations and shape how I reason:

${conceptLines || "- (Derived from word frequency in your messages. Run a fuller pipeline for concept definitions.)"}

(Details + tensions + evolution: \`concepts.json\`)

---

## How to Use This With Other AIs

This folder is designed to be portable (Markdown + JSON).

Suggested flow for Claude (or another AI):
1. Start with this file (\`overview.md\`)
2. Use \`projects.json\` for timelines, status, and key references
3. Use \`concepts.json\` for definitions and tensions
4. Use \`evidence.jsonl\` when you want grounding or citations

This snapshot reflects how I was thinking at the time of export.
`;
}

function evidenceDigestMd(evidence: EvidenceRow[]): string {
  const byConv = new Map<string, EvidenceRow[]>();
  for (const row of evidence) {
    const key = row.conversation_id;
    if (!byConv.has(key)) byConv.set(key, []);
    byConv.get(key)!.push(row);
  }
  const sections: string[] = [];
  for (const rows of byConv.values()) {
    const first = rows[0];
    const date = first?.date ?? "—";
    const title = first?.conversation_title ?? first?.conversation_id ?? "Untitled";
    sections.push(`### ${date} — ${title}`);
    for (const r of rows.slice(0, 20)) {
      sections.push(`- **${r.id}** (${r.role})  \n  ${r.text.slice(0, 200)}${r.text.length > 200 ? "…" : ""}`);
    }
  }
  return `# Evidence Digest (Selected Excerpts)

This is a curated set of excerpts pulled from the original ChatGPT export.
It exists to support trust, troubleshooting, and portability.

- It is not comprehensive.
- It prioritizes: project naming, decisions/constraints, definitions, outputs, and repeated questions.
- Use evidence IDs (e.g., \`ev_00012\`) to reference exact excerpts in other tools.

---

## How to read this
- Scan by date to see evolution over time.
- Use it as a bridge when moving to another AI.
- If something in \`overview.md\` feels wrong, this is where to verify.

---

## Excerpts (Chronological)

${sections.join("\n\n")}
`;
}

function decisionsOpenQuestionsMd(): string {
  return `# Decisions & Open Questions

This file is a placeholder. A full pipeline would infer decisions (e.g. "I will…", "we're doing…") and open questions from evidence.

- Decisions: (run fuller extraction to populate)
- Open questions: (run fuller extraction to populate)

(Reference \`evidence.jsonl\` and \`projects.json\` for grounding.)
`;
}

function evidenceJsonl(evidence: EvidenceRow[]): string {
  return evidence.map((row) => JSON.stringify(row)).join("\n");
}

const README_CONTENT = `# Portable ChatGPT Data Transformer — Continuity Snapshot

This folder contains a summarized snapshot of how I used ChatGPT:
- what I worked on
- what ideas recur
- what decisions I made
- what questions remain open
- and evidence excerpts from original conversations

This is a summary, not a full transcript.

---

## Use this with Claude

1) Upload this folder (or paste key files) into Claude.
2) Start with \`overview.md\`.
3) Then use structured files depending on what you need:
   - \`projects.json\` for active work, timelines, and references
   - \`concepts.json\` for frameworks and worldview signals
   - \`evidence.jsonl\` for grounding and citation

### Example prompts for Claude

- "Summarize my active projects and what I was trying to achieve. Use evidence when possible."
- "What concepts recur across my work? Give definitions and tensions, and cite evidence IDs."
- "Generate stance pages from concepts and projects. Keep claims grounded in evidence."
- "Find my open questions and propose next steps, referencing supporting excerpts."

---

## Evidence file

\`evidence.jsonl\` contains short, high-signal excerpts from the original conversations.
Each item includes:
- where it came from (conversation ID/title/date)
- role (user/assistant)
- tags (optional)
- and a stable evidence ID you can cite

---

## Works with other AI tools too

These files are plain Markdown and JSON.
Any AI or tool that can read text files can use them as context.

Suggested workflow:
- Feed \`overview.md\` first
- Add \`projects.json\` and \`concepts.json\`
- Pull supporting items from \`evidence.jsonl\` when you need citations
`;

export async function buildAndDownloadMcpZip(
  snapshot: Snapshot,
  evidence: EvidenceRow[],
  synopsis?: ProfileSynopsis
): Promise<void> {
  const zip = new JSZip();
  zip.file("index.json", indexJson(snapshot));
  zip.file("overview.md", overviewMd(snapshot));
  zip.file("usage_modes.json", usageModesJson(snapshot));
  zip.file("projects.json", projectsJson(snapshot));
  zip.file("concepts.json", conceptsJson(snapshot));
  zip.file("evidence.jsonl", evidenceJsonl(evidence));
  zip.file("evidence_digest.md", evidenceDigestMd(evidence));
  zip.file("decisions_open_questions.md", decisionsOpenQuestionsMd());
  zip.file("README.md", README_CONTENT);
  if (synopsis) {
    zip.file("profile_synopsis.txt", synopsis.raw_text);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = ZIP_FILENAME;
  a.click();
  URL.revokeObjectURL(url);
}
