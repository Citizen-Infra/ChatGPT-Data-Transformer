/**
 * Client-side parser: conversations.json (ChatGPT export) → snapshot + evidence.
 * All processing in browser; no server.
 *
 * v5 — Imports directly from mcpSchema.ts (single source of truth).
 *
 * KEY DESIGN:
 * 1. Usage classification uses USAGE_MODES_CATEGORIES signals + expanded keywords + structural fallback
 * 2. Evidence scoring uses DETECTION_METADATA markers (project markers, artifact terms, problem markers)
 * 3. Theme extraction requires cross-conversation spread (≥3 convos) + proper noun filtering
 * 4. "Other/mixed" stays honest but structural fallback reduces it to ~20-25%
 */

import type { EvidenceRow, Snapshot, UsageCategory, ProjectSummary, MonthlyActivity } from "./types";
import {
  USAGE_MODES_CATEGORIES,
  DETECTION_METADATA,
} from "./mcpSchema";


/* ═══════════════════════════════════════════════════════════════════
   USAGE CLASSIFICATION
   Base signals from mcpSchema + expanded keywords + structural fallback
   ═══════════════════════════════════════════════════════════════════ */

// Extended signals per category — starts from mcpSchema examples_of_signals,
// then adds natural phrasings people actually use.
const EXTENDED_SIGNALS: Record<string, string[]> = {
  idea_sensemaking: [
    // From mcpSchema.examples_of_signals:
    "what if", "help me think", "pressure test", "does this make sense", "map out",
    // Extended:
    "brainstorm", "think through", "make sense of", "how would you approach",
    "trade-off", "tradeoff", "pros and cons", "mental model", "framework",
    "thought experiment", "hypothetically", "synthesize", "gut check",
    "sanity check", "stress test", "poke holes", "explore the idea",
    "weigh the options", "rethink", "riff on", "unpack", "disentangle",
    "i'm torn", "on the one hand", "thoughts on", "wondering if",
    "would it work", "figure out", "wrap my head", "thinking about",
    "consider", "evaluate", "alternative", "perspective", "angle",
    "implications", "what do you think", "your take", "feedback on",
    "react to", "push back", "devil's advocate", "play out",
  ],
  writing_editing: [
    // From mcpSchema:
    "rewrite", "edit", "tighten", "make this clearer", "tone", "draft",
    // Extended:
    "rephrase", "shorten", "write me", "write a", "proofread", "revise",
    "polish", "summarize", "blog post", "article", "essay", "headline",
    "caption", "bio", "blurb", "outline", "script", "newsletter",
    "tweet", "copy for", "draft a", "word choice", "more concise",
    "substack", "email draft", "subject line", "talking points",
    "flow", "structure", "paragraph", "sentence", "wording", "phrasing",
    "narrative", "voice", "audience", "reader", "iteration",
    "punch up", "tighten up", "wordsmith", "messaging",
  ],
  business_planning: [
    // From mcpSchema:
    "mvp", "roadmap", "strategy", "positioning", "launch plan", "next steps",
    // Extended:
    "priorit", "milestone", "timeline", "scope", "pricing", "revenue",
    "market", "competitor", "go-to-market", "business model", "pitch",
    "investor", "funnel", "growth", "onboarding", "user journey",
    "okr", "kpi", "deliverable", "sprint", "project plan",
    "product strategy", "value prop", "pricing model",
    "target audience", "user persona", "competitive", "differentiation",
    "cost", "budget", "forecast", "metrics", "conversion", "retention",
    "churn", "segment", "stakeholder", "deadline", "backlog",
  ],
  research_explanation: [
    // From mcpSchema:
    "what is", "why does", "explain", "compare", "definition", "research",
    // Extended:
    "how does", "tell me about", "difference between", "history of",
    "overview of", "example of", "define", "clarify", "meaning of",
    "literature", "study", "paper", "reference", "citation", "evidence",
    "according to", "can you explain", "in simple terms",
    "background on", "context for", "elaborate", "instance",
    "specifically", "dig into", "walk me through", "break down",
    "layman", "simplified", "detail", "nuance", "source", "fact check",
  ],
  technical_coding: [
    // From mcpSchema:
    "error", "stack trace", "function", "api", "schema", "python", "javascript",
    // Extended:
    "typescript", "code", "debug", "bug", "fix this",
    "compile", "runtime", "syntax", "import", "module", "npm",
    "docker", "deploy", "endpoint", "database", "query", "sql",
    "json", "html", "css", "react", "component", "refactor", "git",
    "commit", "server", "backend", "frontend", "localhost", "async",
    "implementation", "algorithm", "regex", "parse", "render", "state",
    "hook", "middleware", "route", "migration", "test", "spec", "lint",
    "build", "package", "dependency", "config", "environment",
    "loop", "array", "map", "filter", "reduce",
  ],
  personal_reflection: [
    // From mcpSchema:
    "i feel", "i'm struggling", "what does it mean", "relationship", "values",
    // Extended:
    "emotional", "overwhelmed", "anxious", "excited about",
    "grateful", "frustrated", "burned out", "self-care", "boundary",
    "identity", "purpose", "calling", "passion", "fear",
    "personal growth", "healing", "therapy", "self-reflection",
    "who am i", "what matters to me", "processing", "sitting with",
    "bothered", "inspired", "motivated", "unmotivated", "stuck",
    "breakthrough", "clarity", "confused", "conflicted", "proud",
    "disappointed", "hopeful", "worried", "uncertain", "vulnerable",
    "authentic", "meaningful",
  ],
};

/** Estimate how much of a message is code vs. natural language. */
function estimateCodeRatio(text: string): number {
  const lines = text.split("\n");
  if (lines.length === 0) return 0;
  const codeLines = lines.filter((l) =>
    /^\s*[{}\[\]();=<>\/]/.test(l) ||
    /^\s*(import|export|const|let|var|function|class|def|return|if|else|for|while)\b/.test(l) ||
    /^\s*[a-zA-Z_]\w*\(/.test(l) ||
    /^\s*\/\//.test(l) ||
    /^\s*#/.test(l)
  ).length;
  return codeLines / lines.length;
}

/** Structural fallback when keyword matching produces no result. */
function classifyByStructure(text: string): string | null {
  const hasCodeBlock = text.includes("```");
  const codeRatio = estimateCodeRatio(text);
  const isShort = text.length < 120;
  const isQuestion = text.trim().endsWith("?");

  // Heavy code content
  if (hasCodeBlock || codeRatio > 0.4) return "technical_coding";

  // Short question
  if (isShort && isQuestion) return "research_explanation";

  // Long prose without code → likely writing
  if (text.length > 500 && codeRatio < 0.1 && !hasCodeBlock) return "writing_editing";

  return null;
}

/**
 * Three-pass classifier:
 * 1. Keyword matching from MCP schema signals
 * 2. Structural analysis fallback
 * 3. Conversation title hint
 */
function classifyUserMessage(text: string, conversationTitle?: string | null): string {
  const lower = text.toLowerCase().slice(0, 1500);

  // Pass 1: keyword matching
  let bestId = "other_mixed";
  let bestScore = 0;

  for (const cat of USAGE_MODES_CATEGORIES) {
    if (cat.id === "other_mixed") continue;
    const signals = EXTENDED_SIGNALS[cat.id] ?? [...cat.examples_of_signals];
    let score = 0;
    for (const s of signals) {
      if (lower.includes(s)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestId = cat.id;
    }
  }

  if (bestScore >= 1) return bestId;

  // Pass 2: structural analysis
  const structural = classifyByStructure(text);
  if (structural) return structural;

  // Pass 3: conversation title hint
  if (conversationTitle) {
    const titleLower = conversationTitle.toLowerCase();
    for (const cat of USAGE_MODES_CATEGORIES) {
      if (cat.id === "other_mixed") continue;
      const signals = EXTENDED_SIGNALS[cat.id] ?? [...cat.examples_of_signals];
      for (const s of signals) {
        if (titleLower.includes(s)) return cat.id;
      }
    }
  }

  return "other_mixed";
}


/* ═══════════════════════════════════════════════════════════════════
   EVIDENCE SCORING — directly from DETECTION_METADATA (mcpSchema)
   ═══════════════════════════════════════════════════════════════════ */

function scoreEvidence(role: string, text: string): number {
  const t = text.toLowerCase();
  let score = 0;
  if (role === "user") score += 0.8;

  for (const p of DETECTION_METADATA.explicit_project_markers) {
    if (t.includes(p.toLowerCase())) score += 3.0;
  }
  for (const a of DETECTION_METADATA.artifact_terms) {
    if (t.includes(a.toLowerCase())) score += 1.0;
  }
  for (const d of DETECTION_METADATA.problem_markers) {
    if (t.includes(d.toLowerCase())) score += 2.0;
  }

  if (t.includes("?") && role === "user") score += 0.6;
  if (text.includes("```")) score += 1.2;
  if (text.length > 500) score += 0.4;
  return score;
}


/* ═══════════════════════════════════════════════════════════════════
   TIMESTAMP HELPERS
   ═══════════════════════════════════════════════════════════════════ */

const MIN_VALID_EPOCH = new Date("2022-01-01").getTime() / 1000;
const MAX_VALID_EPOCH = (Date.now() / 1000) + 86400 * 30;

function isValidTimestamp(ts: number): boolean {
  return ts > MIN_VALID_EPOCH && ts < MAX_VALID_EPOCH;
}

function extractMessageText(node: Record<string, unknown>): string {
  const msg = (node?.message as Record<string, unknown>) ?? {};
  const content = (msg?.content as Record<string, unknown>) ?? {};
  const parts = (content?.parts as unknown[]) ?? [];
  if (!Array.isArray(parts)) return "";
  return parts.filter((p): p is string => typeof p === "string").join("\n").trim();
}

function extractMessageRole(node: Record<string, unknown>): string | null {
  const msg = (node?.message as Record<string, unknown>) ?? {};
  const author = (msg?.author as Record<string, unknown>) ?? {};
  const role = author?.role as string | undefined;
  return role === "user" || role === "assistant" || role === "system" ? role : null;
}

function getCreateTime(node: Record<string, unknown>): number {
  const msg = (node?.message as Record<string, unknown>) ?? {};
  const ct = msg?.create_time;
  if (ct == null) return 0;
  const n = Number(ct);
  return Number.isFinite(n) ? n : 0;
}

function parseTimestampToDate(ts: number | null): string | null {
  if (ts == null || !Number.isFinite(ts) || !isValidTimestamp(ts)) return null;
  try {
    return new Date(ts * 1000).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function linearizeMapping(mapping: Record<string, unknown>): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  for (const node of Object.values(mapping)) {
    if (!node || typeof node !== "object") continue;
    const msg = (node as Record<string, unknown>).message;
    if (!msg) continue;
    const role = extractMessageRole(node as Record<string, unknown>);
    const text = extractMessageText(node as Record<string, unknown>);
    if (!role || !text) continue;
    nodes.push(node as Record<string, unknown>);
  }
  nodes.sort((a, b) => getCreateTime(a) - getCreateTime(b));
  return nodes;
}

function stableId(prefix: string, ...parts: (string | undefined | null)[]): string {
  const base = parts.filter(Boolean).join("|");
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h << 5) - h + base.charCodeAt(i);
  return `${prefix}_${Math.abs(h).toString(16).slice(0, 10)}`;
}


/* ═══════════════════════════════════════════════════════════════════
   THEME EXTRACTION — cross-conversation spread + proper noun filter

   Instead of hardcoded concept lenses, extract recurring bigrams
   that appear across MULTIPLE conversations. Filter out proper nouns.
   ═══════════════════════════════════════════════════════════════════ */

const THEME_STOPWORDS = new Set([
  // Function words
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to", "of", "in", "on", "for",
  "with", "this", "that", "it", "i", "my", "me", "we", "you", "can", "could", "would", "should",
  "have", "has", "do", "does", "what", "how", "why", "when", "if", "about", "just", "like", "also",
  "some", "from", "been", "more", "they", "them", "your", "will", "each", "make", "than", "here",
  "want", "need", "into", "over", "only", "very", "much", "well", "then", "there", "these", "those",
  "where", "thing", "things", "something", "being", "other", "which", "their", "our", "its", "not",
  "all", "any", "had", "did", "get", "got", "give", "take", "say", "said", "tell", "know", "think",
  "come", "go", "see", "look", "use", "used", "try", "keep", "let", "put", "set", "seem", "help",
  "show", "turn", "call", "work", "may", "might", "still", "way", "own", "most", "too", "even",
  "back", "now", "long", "great", "little", "good", "new", "first", "last", "next", "same", "few",
  "right", "big", "high", "old", "different", "small", "large", "important", "enough",
  // Conversational fillers
  "yeah", "yes", "okay", "sure", "thanks", "thank", "please", "sorry", "actually", "basically",
  "really", "probably", "maybe", "definitely", "already", "always", "never", "often",
  // Generic pronouns/quantifiers
  "everything", "anything", "nothing", "everyone", "anyone", "someone", "people", "person",
  "time", "times", "part", "kind", "sort", "type", "able", "based", "specific", "general",
  // Gerunds of common verbs
  "going", "looking", "doing", "making", "getting", "coming", "taking", "working", "writing",
  "reading", "running", "trying", "saying", "talking", "feeling", "thinking", "using",
  // Common verbs/contractions
  "start", "create", "don't", "doesn", "didn", "that's", "it's", "let's", "i'm", "he's",
  "she's", "we're", "they're", "i've", "we've", "i'll", "we'll", "won't", "can't",
  // ChatGPT/AI-specific noise
  "chatgpt", "chat", "gpt", "openai", "message", "response", "conversation", "prompt",
  "context", "output", "input", "text", "content", "information", "version", "model",
  "assistant", "user", "system", "token", "tokens", "claude",
  // Code/design noise
  "code", "page", "section", "header", "card", "button", "component", "style", "color",
  "layout", "function", "file", "data", "list", "form", "table", "image", "link", "error",
  "debug", "config", "class", "method", "variable", "array", "string", "number", "object",
  "null", "undefined", "true", "false", "return", "const", "import", "export",
  // Generic title noise
  "help", "question", "issue", "problem", "update", "review", "discuss",
  "plan", "idea", "draft", "notes", "meeting", "title", "name",
  "build", "test", "check", "fix", "setup", "configure", "quick",
]);

/**
 * Simple proper noun heuristic: if a word appears capitalized mid-sentence
 * consistently, it's likely a proper noun (name, place, organization).
 */
function looksLikeProperNoun(word: string, originalTexts: string[]): boolean {
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
  let midSentenceCapitalized = 0;
  let totalAppearances = 0;

  for (const text of originalTexts.slice(0, 50)) {
    const midPattern = new RegExp(`[a-z]\\s+${capitalized}\\b`, "g");
    midSentenceCapitalized += (text.match(midPattern) || []).length;
    const totalPattern = new RegExp(`\\b${word}\\b`, "gi");
    totalAppearances += (text.match(totalPattern) || []).length;
  }

  return totalAppearances > 2 && midSentenceCapitalized / totalAppearances > 0.4;
}

interface HighSignalItem {
  text: string;
  convId: string;
}

/**
 * Extract themes from high-signal evidence and conversation titles.
 * Requires bigrams to appear across ≥3 distinct conversations.
 * Filters out proper nouns.
 */
function extractThemes(
  highSignalItems: HighSignalItem[],
  titles: string[],
  count: number,
): string[] {
  const phraseData: Record<string, { count: number; convIds: Set<string> }> = {};
  const allOriginalTexts = highSignalItems.map((item) => item.text);

  for (const item of highSignalItems.slice(0, 500)) {
    const words = item.text
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !THEME_STOPWORDS.has(w));

    for (let j = 0; j < words.length - 1; j++) {
      const bg = words[j] + " " + words[j + 1];
      if (bg.length > 7) {
        if (!phraseData[bg]) phraseData[bg] = { count: 0, convIds: new Set() };
        phraseData[bg].count++;
        phraseData[bg].convIds.add(item.convId);
      }
    }
  }

  for (let i = 0; i < titles.length; i++) {
    const words = titles[i]
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !THEME_STOPWORDS.has(w));

    for (let j = 0; j < words.length - 1; j++) {
      const bg = words[j] + " " + words[j + 1];
      if (bg.length > 7) {
        if (!phraseData[bg]) phraseData[bg] = { count: 0, convIds: new Set() };
        phraseData[bg].count++;
        phraseData[bg].convIds.add(`title_${i}`);
      }
    }
  }

  // Filter: ≥3 occurrences AND ≥3 distinct conversations
  const topPhrases = Object.entries(phraseData)
    .filter(([, data]) => data.count >= 3 && data.convIds.size >= 3)
    .sort((a, b) => b[1].convIds.size - a[1].convIds.size || b[1].count - a[1].count)
    .slice(0, 20);

  const results: string[] = [];
  const used = new Set<string>();

  for (const [phrase] of topPhrases) {
    if (results.length >= count) break;
    const words = phrase.split(" ");
    const hasProperNoun = words.some((w) => looksLikeProperNoun(w, allOriginalTexts));
    if (hasProperNoun) continue;

    const nice = words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
    results.push(nice);
    for (const w of words) used.add(w);
  }

  // Fill with distinctive title words
  const titleWordCounts: Record<string, { count: number; convIds: Set<number> }> = {};
  for (let i = 0; i < titles.length; i++) {
    const words = titles[i]
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !THEME_STOPWORDS.has(w));
    const unique = new Set(words);
    for (const w of unique) {
      if (!titleWordCounts[w]) titleWordCounts[w] = { count: 0, convIds: new Set() };
      titleWordCounts[w].count++;
      titleWordCounts[w].convIds.add(i);
    }
  }

  const totalTitles = titles.length || 1;
  const distinctiveWords = Object.entries(titleWordCounts)
    .filter(([w, data]) => {
      const pct = data.count / totalTitles;
      return pct >= 0.01 && pct <= 0.15 && data.convIds.size >= 3 && !used.has(w);
    })
    .filter(([w]) => !looksLikeProperNoun(w, allOriginalTexts))
    .sort((a, b) => b[1].count - a[1].count);

  for (const [w] of distinctiveWords) {
    if (results.length >= count) break;
    results.push(w[0].toUpperCase() + w.slice(1));
    used.add(w);
  }

  return results;
}


/* ═══════════════════════════════════════════════════════════════════
   PROJECT DETECTION — cluster similar titles, filter junk, infer type
   ═══════════════════════════════════════════════════════════════════ */

const JUNK_TITLE_PATTERNS = [
  /^new chat$/i, /^untitled$/i, /^chat$/i, /^test$/i,
  /^(hi|hello|hey|yo|sup)$/i, /^.{0,3}$/, /^\d+$/,
  /^(continue|continued|part \d|follow up)$/i,
];

function isJunkTitle(title: string): boolean {
  return JUNK_TITLE_PATTERNS.some((p) => p.test(title.trim()));
}

function normalizeForClustering(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s*[-–—:]\s*(continued|cont|part\s*\d+|v\d+|draft|revised|updated|final)\s*$/i, "")
    .replace(/^\s*(re|fwd|fw|continued|updated)[\s:]+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titlesSimilar(a: string, b: string): boolean {
  const SW = new Set(["the","a","an","and","or","but","is","are","was","for","with","this","that","my","your","how","to","of","in","on","help","me","can","you","about","from","what","i","do","it"]);
  const wordsA = a.split(/\s+/).filter((w) => w.length > 2 && !SW.has(w));
  const wordsB = b.split(/\s+/).filter((w) => w.length > 2 && !SW.has(w));
  if (wordsA.length === 0 || wordsB.length === 0) return false;
  const setA = new Set(wordsA);
  const shared = wordsB.filter((w) => setA.has(w)).length;
  return shared / Math.min(wordsA.length, wordsB.length) >= 0.5 && shared >= 1;
}

const PROJECT_TYPE_RULES: { pattern: RegExp; type: string }[] = [
  { pattern: /\b(api|code|debug|script|function|component|deploy|server|database|schema|typescript|react|python|css|html|webpack|docker|kubernetes|aws|lambda|endpoint|repo|github)\b/i, type: "Technical · Engineering" },
  { pattern: /\b(mvp|product|feature|roadmap|launch|platform|saas|app|prototype|mockup|wireframe|onboarding)\b/i, type: "Product · Platform" },
  { pattern: /\b(article|essay|blog|write|draft|substack|book|publish|edit|newsletter|manuscript|chapter)\b/i, type: "Writing · Publishing" },
  { pattern: /\b(strategy|business|pricing|market|revenue|growth|positioning|pitch|investor|funding)\b/i, type: "Business · Strategy" },
  { pattern: /\b(community|network|chapter|organizing|collective|meetup|event|volunteer|coalition)\b/i, type: "Community · Organizing" },
  { pattern: /\b(research|framework|methodology|theory|analysis|study|literature|taxonomy)\b/i, type: "Research · Frameworks" },
  { pattern: /\b(design|visual|ui|ux|layout|brand|logo|style|figma|illustration)\b/i, type: "Design · Creative" },
];

function inferProjectType(name: string, userMessages?: string[]): string {
  const lower = name.toLowerCase();
  for (const rule of PROJECT_TYPE_RULES) { if (rule.pattern.test(lower)) return rule.type; }
  if (userMessages) {
    const sample = userMessages.slice(0, 8).join(" ").toLowerCase();
    for (const rule of PROJECT_TYPE_RULES) { if (rule.pattern.test(sample)) return rule.type; }
  }
  return "Project";
}

function inferProjectStatus(meta: { lastDate?: string }): "active" | "ongoing" | "complete" {
  if (!meta.lastDate) return "ongoing";
  const daysSince = (Date.now() - new Date(meta.lastDate).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 60) return "active";
  if (daysSince < 180) return "ongoing";
  return "complete";
}


/* ═══════════════════════════════════════════════════════════════════
   MAIN PARSER
   ═══════════════════════════════════════════════════════════════════ */

export function parseConversationsJson(data: unknown): { evidence: EvidenceRow[]; snapshot: Snapshot } {
  if (!Array.isArray(data)) {
    throw new Error("Expected conversations.json to be a list of conversations.");
  }

  const evidence: EvidenceRow[] = [];
  const userMsgs: { text: string; title: string | null }[] = [];
  const allDates: string[] = [];
  const monthCounts: Record<string, number> = {};
  const allTitles: string[] = [];
  const highSignalItems: HighSignalItem[] = [];

  const titleMeta: Record<string, {
    count: number; firstDate?: string; lastDate?: string;
    messageCount: number; sampleUserMessages: string[];
  }> = {};
  let evIndex = 0;

  for (let i = 0; i < data.length; i++) {
    const conv = data[i] as Record<string, unknown>;
    const mapping = (conv?.mapping as Record<string, unknown>) ?? {};
    if (typeof mapping !== "object") continue;

    const title = (conv?.title as string) ?? null;
    const convIdRaw = (conv?.id as string) ?? `conv_index_${i}`;
    const convId = stableId("conv", String(convIdRaw), title ?? "");

    if (title?.trim()) allTitles.push(title.trim());

    const nodes = linearizeMapping(mapping);
    const convUserMsgs: string[] = [];
    let convEarliestDate: string | null = null;

    for (let t = 0; t < nodes.length; t++) {
      const node = nodes[t];
      const role = extractMessageRole(node);
      const text = extractMessageText(node);
      if (!role || !text) continue;

      const createTime = getCreateTime(node);
      const date = parseTimestampToDate(createTime);
      if (date) {
        allDates.push(date);
        if (!convEarliestDate || date < convEarliestDate) convEarliestDate = date;
      }

      const nodeId = (node as Record<string, unknown>).id as string | undefined;
      evidence.push({
        id: `ev_${String(evIndex).padStart(5, "0")}`,
        date, role, text,
        conversation_id: convId,
        conversation_title: title,
        turn_index: t,
        source: {
          platform: "chatgpt",
          export_format: "openai_export",
          conversation_ref: String(convIdRaw),
          ...(nodeId != null && { node_id: nodeId }),
        },
      });

      if (role === "user") {
        userMsgs.push({ text, title });
        convUserMsgs.push(text);
        const evScore = scoreEvidence(role, text);
        if (evScore >= 2.0) highSignalItems.push({ text, convId });
      }
      evIndex++;
    }

    if (title?.trim() && !isJunkTitle(title)) {
      const key = title.trim().slice(0, 80);
      const convDates = nodes.map((n) => parseTimestampToDate(getCreateTime(n))).filter((d): d is string => d != null).sort();
      const firstDate = convDates[0];
      const lastDate = convDates[convDates.length - 1];
      if (!titleMeta[key]) {
        titleMeta[key] = { count: 1, firstDate, lastDate, messageCount: nodes.length, sampleUserMessages: convUserMsgs.slice(0, 3) };
      } else {
        titleMeta[key].count++;
        titleMeta[key].messageCount += nodes.length;
        if (titleMeta[key].sampleUserMessages.length < 8) titleMeta[key].sampleUserMessages.push(...convUserMsgs.slice(0, 2));
        if (firstDate && (!titleMeta[key].firstDate || firstDate < titleMeta[key].firstDate!)) titleMeta[key].firstDate = firstDate;
        if (lastDate && (!titleMeta[key].lastDate || lastDate > titleMeta[key].lastDate!)) titleMeta[key].lastDate = lastDate;
      }
    }

    /* Count one conversation per month based on its earliest message date */
    if (convEarliestDate) {
      const ym = convEarliestDate.slice(0, 7);
      monthCounts[ym] = (monthCounts[ym] ?? 0) + 1;
    }
  }

  /* ── Usage distribution ──────────────────────────────────────── */
  const sampleSize = Math.min(1000, userMsgs.length);
  const step = userMsgs.length > 0 ? Math.max(1, Math.floor(userMsgs.length / sampleSize)) : 1;
  const sample: { text: string; title: string | null }[] = [];
  for (let i = 0; i < userMsgs.length && sample.length < sampleSize; i += step) sample.push(userMsgs[i]);

  const catCounts: Record<string, number> = {};
  for (const cat of USAGE_MODES_CATEGORIES) catCounts[cat.id] = 0;
  for (const item of sample) {
    const id = classifyUserMessage(item.text, item.title);
    catCounts[id] = (catCounts[id] ?? 0) + 1;
  }
  const total = sample.length || 1;

  let usage_signature: UsageCategory[] = USAGE_MODES_CATEGORIES.map((c) => ({
    id: c.id, label: c.label,
    count: catCounts[c.id] ?? 0,
    pct: Math.round(((catCounts[c.id] ?? 0) / total) * 100),
  }));

  const pctSum = usage_signature.reduce((s, u) => s + u.pct, 0);
  if (pctSum !== 100 && pctSum > 0) {
    const diff = 100 - pctSum;
    const largest = usage_signature.reduce((max, u) => (u.pct > max.pct ? u : max), usage_signature[0]);
    largest.pct += diff;
  }

  usage_signature.sort((a, b) => b.pct - a.pct);
  usage_signature = usage_signature.filter((u) => u.pct > 0);

  /* ── Top projects — cluster similar titles ────────────────────── */
  const clusters: { name: string; titles: string[]; totalCount: number; totalMessages: number; firstDate?: string; lastDate?: string; sampleUserMessages: string[] }[] = [];
  const assignedTitles = new Set<string>();
  const titleKeys = Object.keys(titleMeta);

  for (const key of titleKeys) {
    if (assignedTitles.has(key)) continue;
    const normalized = normalizeForClustering(key);
    const cluster = { name: key, titles: [key], totalCount: titleMeta[key].count, totalMessages: titleMeta[key].messageCount, firstDate: titleMeta[key].firstDate, lastDate: titleMeta[key].lastDate, sampleUserMessages: [...titleMeta[key].sampleUserMessages] };
    assignedTitles.add(key);

    for (const otherKey of titleKeys) {
      if (assignedTitles.has(otherKey)) continue;
      const otherNorm = normalizeForClustering(otherKey);
      if (otherNorm === normalized || titlesSimilar(normalized, otherNorm)) {
        cluster.titles.push(otherKey);
        cluster.totalCount += titleMeta[otherKey].count;
        cluster.totalMessages += titleMeta[otherKey].messageCount;
        if (titleMeta[otherKey].firstDate && (!cluster.firstDate || titleMeta[otherKey].firstDate < cluster.firstDate)) cluster.firstDate = titleMeta[otherKey].firstDate;
        if (titleMeta[otherKey].lastDate && (!cluster.lastDate || titleMeta[otherKey].lastDate > cluster.lastDate)) cluster.lastDate = titleMeta[otherKey].lastDate;
        if (cluster.sampleUserMessages.length < 8) cluster.sampleUserMessages.push(...titleMeta[otherKey].sampleUserMessages.slice(0, 2));
        assignedTitles.add(otherKey);
      }
    }

    if (cluster.titles.length > 1) {
      const best = cluster.titles.filter((t) => !isJunkTitle(t)).sort((a, b) => a.length - b.length)[0];
      if (best) cluster.name = best;
    }
    clusters.push(cluster);
  }

  clusters.sort((a, b) => {
    const sa = a.totalCount * 3 + a.totalMessages;
    const sb = b.totalCount * 3 + b.totalMessages;
    return sb !== sa ? sb - sa : (b.lastDate ?? "").localeCompare(a.lastDate ?? "");
  });

  const top_projects: ProjectSummary[] = clusters.slice(0, 6).map((c) => ({
    name: c.name, first_date: c.firstDate, last_date: c.lastDate,
    project_type: inferProjectType(c.name, c.sampleUserMessages),
    status: inferProjectStatus({ lastDate: c.lastDate }),
    conversation_count: c.totalCount,
  }));

  /* ── Themes ────────────────────────────────────────────────────── */
  const interest_tags = extractThemes(highSignalItems, allTitles, 10);

  /* ── Activity by month ──────────────────────────────────────── */
  const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const activity_by_month: MonthlyActivity[] = Object.entries(monthCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([ym, count]) => {
      const [year, month] = ym.split("-");
      return { label: `${MN[parseInt(month, 10) - 1]} ${year}`, yearMonth: ym, count };
    });

  /* ── Date range ──────────────────────────────────────────────── */
  const sortedDates = [...allDates].sort();

  const snapshot: Snapshot = {
    conversation_count: data.length,
    message_count: evidence.length,
    date_range: { first: sortedDates[0] ?? "", last: sortedDates[sortedDates.length - 1] ?? "" },
    usage_signature,
    top_projects,
    interest_tags,
    primary_lens: interest_tags[0] ?? usage_signature[0]?.label,
    activity_by_month,
  };

  return { evidence, snapshot };
}
