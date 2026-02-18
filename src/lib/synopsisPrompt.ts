/**
 * Build the system + user message pair for Claude API to generate a profile synopsis.
 * This is consumed by whatever proxy endpoint handles the Claude call.
 */

import type { Snapshot, EvidenceRow } from "./types";

export interface SynopsisPromptMessages {
  system: string;
  user: string;
}

const SYSTEM_PROMPT = `You are a profile synthesizer. Given someone's ChatGPT usage data — their conversation patterns, project names, usage breakdown, and high-signal message excerpts — you generate a networking profile that captures their worldview, not their resume.

Your output should feel like a friend who really gets them wrote their bio. Lead with how they think, not what they've done. The profile should make the right people want to talk to them.

Return your response as valid JSON matching this exact structure:
{
  "headline": "3-5 word identity (e.g. 'Designer · Community Builder · Systems Thinker')",
  "bio": "1-2 sentences capturing how they approach the world and what drives them",
  "thinks_about": ["4-6 bullet strings about what occupies their mind — worldview, not tasks"],
  "energized_by": ["4-5 bullet strings about what excites them and who they want to work with"],
  "background_signal": "2-3 sentences of context that explain where they're coming from without listing credentials",
  "cta": "1 sentence invitation — 'If you're building X, I want to know about it'"
}

Rules:
- No credentials-bragging. No "experienced professional" language.
- Lead with worldview and values, not job titles.
- Keep each bullet to 1-2 sentences max.
- The headline should be identity labels separated by dots or slashes.
- Background signal should feel like a friend explaining who you are at a party, not a LinkedIn summary.
- Omit specific personal/family details.
- Omit specific project names — keep it thematic.`;

export function buildSynopsisPrompt(
  snapshot: Snapshot,
  evidence: EvidenceRow[]
): SynopsisPromptMessages {
  // Build the user message with snapshot data + evidence excerpts
  const usageLines = snapshot.usage_signature
    .filter((u) => u.pct > 0)
    .map((u) => `- ${u.label}: ${u.pct}%`)
    .join("\n");

  const projectLines = snapshot.top_projects
    .slice(0, 10)
    .map((p) => {
      const parts = [p.name];
      if (p.project_type) parts.push(`(${p.project_type})`);
      if (p.status) parts.push(`[${p.status}]`);
      return `- ${parts.join(" ")}`;
    })
    .join("\n");

  const tagLines = snapshot.interest_tags
    .map((t) => `- ${t}`)
    .join("\n");

  // Select high-signal user messages, trim to 200 chars each
  const userEvidence = evidence
    .filter((e) => e.role === "user" && e.text.length > 40)
    .slice(0, 30)
    .map((e, i) => `[${i + 1}] ${e.text.slice(0, 200)}${e.text.length > 200 ? "..." : ""}`)
    .join("\n\n");

  const dateRange = snapshot.date_range.first && snapshot.date_range.last
    ? `${snapshot.date_range.first} to ${snapshot.date_range.last}`
    : "unknown";

  const user = `Here is someone's ChatGPT usage data. Synthesize a networking profile.

## Stats
- ${snapshot.conversation_count.toLocaleString()} conversations
- ${snapshot.message_count.toLocaleString()} messages
- Date range: ${dateRange}

## How they use AI
${usageLines}

## Detected projects
${projectLines || "(none detected)"}

## Recurring themes
${tagLines || "(none detected)"}

## High-signal message excerpts (user messages only)
${userEvidence || "(no excerpts available)"}

Generate the profile synopsis JSON now.`;

  return { system: SYSTEM_PROMPT, user };
}
