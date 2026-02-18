"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDT_SNAPSHOT_KEY } from "@/lib/types";
import type { Snapshot } from "@/lib/types";
import { Nav } from "./Nav";
import { SubNav } from "./SubNav";
import { ZipBanner } from "./ZipBanner";

const USAGE_BAR_COLORS = ["#1a3a2a", "#2d5a3f", "#3d7a56", "#8cc5a0"];

/** Format an ISO date string into "Mon YYYY" */
function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const CIBC_PRINCIPLES = [
  "Pedagogical by design",
  "Ownership-enabling",
  "Solidarity-building",
  "Sovereignty-preserving",
  "Interoperable",
  "Antifragile",
];

const CIBC_PROJECTS = [
  { name: "my-community", desc: "Community dashboard Chrome extension — Bluesky feed, curated digest, participation opportunities" },
  { name: "dear-neighbors", desc: "Neighborhood dashboard Chrome extension — community-curated local news + participation opportunities" },
  { name: "nsrt", desc: "Novi Sad Relational Tech — neighborhood tools for Novi Sad residents" },
];


export function ResultsView() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(PDT_SNAPSHOT_KEY);
      if (!raw) {
        setSnapshot(null);
        return;
      }
      setSnapshot(JSON.parse(raw) as Snapshot);
    } catch {
      setSnapshot(null);
    }
  }, []);

  if (snapshot === null) {
    return (
      <>
        <Nav variant="landing" />
        <SubNav />
        <main className="min-h-screen max-w-2xl mx-auto px-6 py-16 bg-white">
          <p className="text-pdt-body">
            No snapshot in this session.{" "}
            <Link href="/" className="text-pdt-700 font-medium underline hover:text-pdt-900">
              Upload your ChatGPT data
            </Link>{" "}
            to get started.
          </p>
        </main>
      </>
    );
  }

  const topUsage = snapshot.usage_signature.filter((u) => u.pct > 0).slice(0, 4);
  const yearsOfHistory = snapshot.date_range.first && snapshot.date_range.last
    ? Math.max(1, Math.round((new Date(snapshot.date_range.last).getTime() - new Date(snapshot.date_range.first).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 0;

  /* Active Since date range — e.g. "Mar 2022 – Jan 2025" */
  const activeSince = snapshot.date_range.first && snapshot.date_range.last
    ? `${formatShortDate(snapshot.date_range.first)} – ${formatShortDate(snapshot.date_range.last)}`
    : "—";

  return (
    <>
      <Nav variant="landing" />
      <SubNav />

      {/* Hero — dark green, title + paragraph only */}
      <section className="bg-pdt-dark text-center px-6 py-14 md:py-16">
        <h1 className="font-serif-pdt text-4xl md:text-5xl font-normal text-white mb-4 leading-tight">
          Here&apos;s what we found.
        </h1>
        <p className="text-white/70 text-[15px] max-w-[520px] mx-auto leading-relaxed">
          We analyzed your full ChatGPT history. Here&apos;s what your conversations say about how you think, what you build, and where your mind keeps returning.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BANNER — 4 stats: Conversations | Messages | Years | Active Since
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-[960px] mx-auto px-6 md:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)]">
            <div className="p-6 md:p-8 text-center">
              <div className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] leading-tight">{snapshot.conversation_count.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mt-2">Conversations</div>
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] leading-tight">{snapshot.message_count.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mt-2">Messages</div>
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] leading-tight">{yearsOfHistory}</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mt-2">Years of History</div>
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="font-serif-pdt text-lg md:text-xl font-normal text-[var(--text-primary)] leading-tight mt-1">{activeSince}</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mt-2">Active Since</div>
            </div>
          </div>
        </div>
      </div>

      <ZipBanner />

      <div className="max-w-[960px] mx-auto px-6 md:px-8 pb-20">

        {/* ═══════════════════════════════════════════════════════════
            HOW YOU USE AI — Stacked bar + legend left, Activity by month right
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 pb-4">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-2">Usage Signature</div>
          <h2 className="font-serif-pdt text-3xl font-normal text-[var(--text-primary)] mb-8 leading-tight">How you use AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[var(--border)] pt-8">
            {/* Left: stacked bar + legend */}
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-4">Breakdown by Usage Type</div>
              <div className="flex h-[18px] rounded overflow-hidden gap-0.5 mb-6">
                {topUsage.map((u, i) => (
                  <div key={u.id} className="h-full rounded-sm transition-all duration-500" style={{ flex: u.pct || 1, background: USAGE_BAR_COLORS[i % 4] }} />
                ))}
              </div>
              <div className="flex flex-col gap-3.5">
                {topUsage.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: USAGE_BAR_COLORS[i % 4] }} />
                      <span className="text-sm text-[var(--text-primary)]">{u.label.split(" &")[0].split(" /")[0]}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{u.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Activity by month rows */}
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-4">Activity by Month</div>
              {snapshot.activity_by_month?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {snapshot.activity_by_month.map((m) => {
                    const maxCount = Math.max(...snapshot.activity_by_month!.map((x) => x.count), 1);
                    const widthPct = Math.max((m.count / maxCount) * 100, 8);
                    return (
                      <div key={m.yearMonth} className="grid grid-cols-[70px_1fr_36px] gap-3 items-center">
                        <span className="text-[13px] text-[var(--text-secondary)] text-right">{m.label.split(" ")[0]}</span>
                        <div className="h-3.5 bg-green-light rounded overflow-hidden">
                          <div className="h-full rounded bg-green-accent transition-all duration-500" style={{ width: `${widthPct}%` }} />
                        </div>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)] text-right">{m.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No monthly data available.</p>
              )}
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════
            MCP FILES + NETWORKING CARD — side by side
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MCP Files card — dark background, concise entry point */}
            <div className="bg-pdt-dark rounded-xl p-8 flex flex-col">
              <div className="text-4xl mb-3">📁</div>
              <div className="flex gap-2 items-center mb-2 flex-wrap">
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-white/15 text-white inline-flex items-center gap-1">◆ Power Users</span>
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-green-accent/30 text-green-light">FREE</span>
                <span className="text-[10px] text-white/50">· REQUIRES CLAUDE DESKTOP</span>
              </div>
              <h3 className="font-serif-pdt text-[22px] font-normal mb-2.5 leading-tight text-white">MCP Files for Claude</h3>
              <p className="text-[13px] text-white/70 leading-relaxed mb-3">
                Your files are ready. Connect them to Claude Desktop and get instant access to your full ChatGPT history &mdash; searchable, citable, and running entirely on your machine.
              </p>
              <p className="text-[13px] text-white/60 mb-6">
                This is the foundation. Once connected, you can generate networking cards, explore your thinking patterns, and build on years of past conversations &mdash; all locally, with no data leaving your device.
              </p>
              <div className="mt-auto">
                <Link href="/mcp-setup" className="inline-flex items-center gap-2 bg-white text-pdt-dark py-2.5 px-6 rounded-lg text-sm font-semibold no-underline hover:bg-gray-100 transition-colors">
                  Get set up &rarr;
                </Link>
              </div>
            </div>

            {/* Networking Card — light background, concise entry point */}
            <div className="border border-[var(--card-border)] rounded-xl p-8 flex flex-col">
              <div className="text-4xl mb-3">🪪</div>
              <div className="flex gap-2 mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-pdt-dark text-white">NEW</span>
              </div>
              <h3 className="font-serif-pdt text-[22px] font-normal mb-2.5 leading-tight">Your Networking Card</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
                A shareable snapshot of your projects, interests, and thinking style &mdash; pulled from your ChatGPT history. Share it at your next meetup or community event to skip the small talk and find collaborators faster.
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
                We believe technology should help us relate better to ourselves, each other, and the world. Your card is a small step in that direction.
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6">
                You choose how it&apos;s made: generate it here using our API, or create it yourself locally through your MCP. Your data, your call.
              </p>
              <div className="mt-auto">
                <Link href="/networking-card" className="inline-flex items-center gap-2 bg-pdt-dark text-white py-2.5 px-6 rounded-lg text-sm font-semibold no-underline hover:bg-green-mid transition-colors">
                  Learn more &amp; generate &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════
            CIBC — Citizen Infrastructure Builders Club
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 border-t border-[var(--border)]">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-3">Who We Are</div>
          <h2 className="font-serif-pdt text-3xl md:text-[2.25rem] font-normal text-[var(--text-primary)] leading-tight mb-8">
            Citizen Infrastructure Builders
          </h2>

          {/* Buckminster Fuller quote */}
          <blockquote className="border-l-4 border-green-accent pl-6 py-2 mb-10">
            <p className="font-serif-pdt text-lg md:text-xl italic text-[var(--text-primary)] leading-relaxed mb-2">
              &ldquo;If you want to teach people a new way of thinking, don&apos;t bother trying to teach them. Instead, give them a tool, the use of which will lead to new ways of thinking.&rdquo;
            </p>
            <cite className="text-[13px] text-[var(--text-muted)] not-italic">— Buckminster Fuller</cite>
          </blockquote>

          {/* Body copy */}
          <div className="max-w-[680px] space-y-4 mb-10">
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
              We build digital pitchforks — citizen infrastructure that teaches collective action, solidarity, and shared stewardship through use. Not apps or platforms in the traditional sense, but tools crafted to reshape how people relate to each other and to their communities.
            </p>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
              In an age of techno-feudalism, where digital platforms have replaced markets with fiefdoms and users have become digital serfs, the antidote is not better regulation of feudal tools — it&apos;s building tools that nurture citizen empowerment and the people&apos;s capacity to act together.
            </p>
          </div>

          {/* Principles — badges/tags */}
          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-3">Principles</div>
            <div className="flex flex-wrap gap-2">
              {CIBC_PRINCIPLES.map((p) => (
                <span key={p} className="text-[12px] font-medium py-1.5 px-3.5 rounded-full bg-green-light text-pdt-dark border border-green-badge">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Projects — compact table */}
          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-3">Projects</div>
            <div className="border border-[var(--border)] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-green-light/50">
                    <th className="text-left py-3 px-4 text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Project</th>
                    <th className="text-left py-3 px-4 text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {CIBC_PROJECTS.map((proj) => (
                    <tr key={proj.name}>
                      <td className="py-3 px-4 font-mono-pdt text-[13px] font-medium text-pdt-dark whitespace-nowrap align-top">{proj.name}</td>
                      <td className="py-3 px-4 text-[13px] text-[var(--text-secondary)] leading-relaxed">{proj.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ecosystem mention */}
          <p className="text-[13px] text-[var(--text-muted)] mb-8">
            Part of a larger ecosystem connecting with Metagov, Newspeak House, Civic Tech Field Guide, Life Itself, and the Relational Tech Project.
          </p>

          {/* CTA */}
          <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-pdt-dark text-white border-0 rounded-lg py-3 px-6 text-sm font-semibold no-underline hover:bg-green-mid transition-colors">
            Join us on GitHub →
          </a>
        </div>
      </div>


      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-8 py-6 px-6 md:px-8">
        <div className="max-w-[960px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono-pdt font-bold text-[15px] text-pdt-dark">chatgpt.pdt</div>
          <div className="flex gap-6">
            <a href="/#how" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">How it works</a>
            <a href="/#privacy" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">Privacy</a>
            <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">GitHub</a>
            <a href="https://citizeninfra.org" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">CIBC</a>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">© 2025 Citizen Infrastructure · Your Data, Always</div>
        </div>
      </footer>
    </>
  );
}
