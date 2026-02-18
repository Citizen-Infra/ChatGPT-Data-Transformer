/**
 * Parse Claude's response text into a ProfileSynopsis.
 * Handles both JSON responses and freeform text with section headers.
 */

import type { ProfileSynopsis } from "./types";

/**
 * Attempt to extract a ProfileSynopsis from Claude's response.
 * Tries JSON first, falls back to section-based parsing.
 */
export function parseSynopsisResponse(text: string): ProfileSynopsis {
  const raw = text.trim();

  // Try JSON parse first (Claude may return clean JSON or JSON in a code block)
  const jsonResult = tryParseJson(raw);
  if (jsonResult) {
    return { ...jsonResult, raw_text: raw };
  }

  // Fall back to section-based extraction
  return parseSections(raw);
}

function tryParseJson(text: string): Omit<ProfileSynopsis, "raw_text"> | null {
  // Try raw JSON
  try {
    const obj = JSON.parse(text);
    if (isValidSynopsis(obj)) return obj;
  } catch {
    // not raw JSON
  }

  // Try extracting JSON from a code block
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    try {
      const obj = JSON.parse(codeBlockMatch[1]);
      if (isValidSynopsis(obj)) return obj;
    } catch {
      // not valid JSON in code block
    }
  }

  // Try finding a JSON object anywhere in the text
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      const obj = JSON.parse(braceMatch[0]);
      if (isValidSynopsis(obj)) return obj;
    } catch {
      // not valid JSON
    }
  }

  return null;
}

function isValidSynopsis(obj: unknown): obj is Omit<ProfileSynopsis, "raw_text"> {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.headline === "string" &&
    typeof o.bio === "string" &&
    Array.isArray(o.thinks_about) &&
    Array.isArray(o.energized_by)
  );
}

/**
 * Fallback: extract sections from freeform text using headers.
 */
function parseSections(text: string): ProfileSynopsis {
  const headline = extractSection(text, ["headline", "identity", "title"]) || "Profile";
  const bio = extractSection(text, ["bio", "identity statement", "about"]) || "";
  const thinksAbout = extractBullets(text, ["think about", "thinks about", "i think about", "worldview"]);
  const energizedBy = extractBullets(text, ["energized by", "excited by", "i'm energized", "looking for"]);
  const backgroundSignal = extractSection(text, ["background signal", "background", "context"]) || "";
  const cta = extractSection(text, ["cta", "call to action", "if you"]) || "";

  return {
    headline,
    bio,
    thinks_about: thinksAbout.length > 0 ? thinksAbout : ["(Synopsis pending)"],
    energized_by: energizedBy.length > 0 ? energizedBy : ["(Synopsis pending)"],
    background_signal: backgroundSignal,
    cta,
    raw_text: text,
  };
}

function extractSection(text: string, keywords: string[]): string | null {
  for (const kw of keywords) {
    // Match "## Headline" or "**Headline:**" or "Headline:" patterns
    const patterns = [
      new RegExp(`(?:^|\\n)##\\s*${kw}[:\\s]*\\n([\\s\\S]*?)(?=\\n##|$)`, "i"),
      new RegExp(`(?:^|\\n)\\*\\*${kw}[:\\s]*\\*\\*[:\\s]*\\n?([\\s\\S]*?)(?=\\n\\*\\*|\\n##|$)`, "i"),
      new RegExp(`(?:^|\\n)${kw}[:\\s]+([^\\n]+)`, "i"),
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m?.[1]) return m[1].trim();
    }
  }
  return null;
}

function extractBullets(text: string, keywords: string[]): string[] {
  const section = extractSection(text, keywords);
  if (!section) return [];

  return section
    .split("\n")
    .map((line) => line.replace(/^[\s*\-•]+/, "").trim())
    .filter((line) => line.length > 5);
}
