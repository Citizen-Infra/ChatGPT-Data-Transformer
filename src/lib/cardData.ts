/**
 * CardData shape from pdt_card_generation_kit — used to render the networking card.
 */

export interface CardDataTag {
  label: string;
  variant: "filled" | "tonal" | "outlined";
}

export interface CardDataUsageMode {
  label: string;
  percent: number;
  color: "primary" | "secondary" | "tertiary" | "quaternary";
}

export interface CardDataProject {
  name: string;
  description: string;
  pipColor: "primary" | "secondary" | "tertiary";
}

export interface CardData {
  name: string;
  role: string;
  tagline: string;
  location: string;
  tags: CardDataTag[];
  usageModes: CardDataUsageMode[];
  projects: CardDataProject[];
  lenses: string[];
  attribution?: string;
}

const USAGE_COLORS: Record<string, CardDataUsageMode["color"]> = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
};

import type { Snapshot, ProfileSynopsis } from "./types";

/** Map Snapshot + customization + optional synopsis to CardData for the kit renderer */
export function snapshotToCardData(
  snapshot: Snapshot,
  customization?: { displayName?: string; role?: string; location?: string; tagline?: string },
  synopsis?: ProfileSynopsis
): CardData {
  const name = customization?.displayName || "ChatGPT user";
  const role = customization?.role || "";
  const location = customization?.location || "";

  // Tagline: prefer synopsis headline, then customization, then auto-generated
  const autoTagline = snapshot.usage_signature
    .filter((u) => u.pct > 0)
    .slice(0, 3)
    .map((u) => u.label.split(" &")[0].split(" /")[0] + ".")
    .join(" ");
  const tagline = synopsis?.headline || customization?.tagline || autoTagline;

  // Tags: prefer synopsis thinks_about bullets, then interest_tags
  let tags: CardDataTag[];
  if (synopsis && synopsis.thinks_about.length > 0) {
    tags = synopsis.thinks_about.slice(0, 5).map((t, i) => ({
      label: t.slice(0, 40),
      variant: i === 0 ? "filled" as const : i <= 2 ? "tonal" as const : "outlined" as const,
    }));
  } else {
    const labels = snapshot.interest_tags.slice(0, 5).map((w) => w.replace(/^\w/, (c) => c.toUpperCase()));
    tags = labels.map((label, i) => ({
      label: label.slice(0, 28),
      variant: i === 0 ? "filled" as const : i <= 2 ? "tonal" as const : "outlined" as const,
    }));
  }

  // Usage modes: always from snapshot (structural data)
  const usageSorted = snapshot.usage_signature.filter((u) => u.pct > 0).slice(0, 4);
  const colors: CardDataUsageMode["color"][] = ["primary", "secondary", "tertiary", "quaternary"];
  const usageModes: CardDataUsageMode[] = usageSorted.map((u, i) => {
    const isLast = i === usageSorted.length - 1;
    const percent = isLast
      ? Math.max(0, 100 - usageSorted.slice(0, -1).reduce((s, x) => s + x.pct, 0))
      : u.pct;
    return {
      label: u.label.split(" &")[0].slice(0, 32),
      percent,
      color: colors[i] ?? "quaternary",
    };
  });

  // Projects: always from snapshot
  const pipColors: CardDataProject["pipColor"][] = ["primary", "secondary", "tertiary"];
  const projects: CardDataProject[] = snapshot.top_projects.slice(0, 3).map((p, i) => ({
    name: p.name.slice(0, 32),
    description: p.summary || [p.first_date, p.last_date].filter(Boolean).join(" — ") || "From your conversation history.",
    pipColor: pipColors[i] ?? "tertiary",
  }));

  // Lenses: prefer synopsis energized_by, then interest_tags
  let lenses: string[];
  if (synopsis && synopsis.energized_by.length > 0) {
    lenses = synopsis.energized_by.slice(0, 6).map((l) => l.slice(0, 32));
  } else {
    lenses = snapshot.interest_tags.slice(0, 6).map((w) => w.replace(/^\w/, (c) => c.toUpperCase()).slice(0, 24));
  }

  return {
    name,
    role,
    tagline: tagline.slice(0, 80),
    location,
    tags,
    usageModes,
    projects,
    lenses,
  };
}
