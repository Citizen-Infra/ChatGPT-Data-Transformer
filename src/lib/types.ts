/** One message from linearized conversation — matches EVIDENCE_JSONL_SPEC */
export interface EvidenceRow {
  id: string;
  date: string | null;
  role: string;
  text: string;
  conversation_id: string;
  conversation_title: string | null;
  turn_index: number;
  /** Optional: export provenance (matches Python transformer) */
  source?: {
    platform: string;
    export_format: string;
    conversation_ref: string;
    node_id?: string;
  };
}

/** Usage category for classification */
export interface UsageCategory {
  id: string;
  label: string;
  count: number;
  pct: number;
}

/** Monthly activity bucket */
export interface MonthlyActivity {
  label: string;       // e.g. "Jan 2026"
  yearMonth: string;   // e.g. "2026-01"
  count: number;
}

/** Project-like item derived from conversation titles or evidence */
export interface ProjectSummary {
  name: string;
  summary?: string;
  first_date?: string;
  last_date?: string;
  project_type?: string;      // e.g. "Product · Platform"
  status?: "active" | "ongoing" | "complete";
  conversation_count?: number;
}

/** Snapshot returned after parsing conversations.json */
export interface Snapshot {
  conversation_count: number;
  message_count: number;
  date_range: { first: string; last: string };
  usage_signature: UsageCategory[];
  top_projects: ProjectSummary[];
  interest_tags: string[];
  primary_lens?: string;
  activity_by_month: MonthlyActivity[];
}

/** Claude-generated profile synopsis (produced via API proxy) */
export interface ProfileSynopsis {
  headline: string;              // e.g. "Designer · Community Builder · Systems Thinker"
  bio: string;                   // 1-2 sentence identity statement
  thinks_about: string[];        // 4-6 worldview bullets
  energized_by: string[];        // 4-5 "what excites me" bullets
  background_signal: string;     // 2-3 sentences of context
  cta: string;                   // "If you're building something that..."
  raw_text: string;              // Full synopsis as plain text (for zip)
}

/** Stored in sessionStorage for results page */
export const PDT_SNAPSHOT_KEY = "pdt-snapshot";
/** Stored in sessionStorage when synopsis is generated */
export const PDT_SYNOPSIS_KEY = "pdt-synopsis";
/** Set after MCP zip is auto-downloaded; results page shows banner until dismissed */
export const PDT_ZIP_DOWNLOADED_KEY = "pdt-zip-downloaded";
/** Set when user dismisses the zip-downloaded banner */
export const PDT_ZIP_BANNER_DISMISSED_KEY = "pdt-zip-banner-dismissed";
