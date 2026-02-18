"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDT_SNAPSHOT_KEY } from "@/lib/types";
import type { Snapshot } from "@/lib/types";
import { Nav } from "./Nav";
import { SubNav } from "./SubNav";

/* WCAG-accessible color palette — distinguishable across common color vision deficiencies */
const USAGE_COLORS: Record<string, string> = {
  technical:     "#1a3a2a",
  research:      "#4a7ab5",
  writing:       "#d4883a",
  brainstorming: "#7b5ea7",
  planning:      "#c4564a",
  communication: "#3a9e8f",
  learning:      "#8ab84a",
  creative:      "#d4a03a",
  other:         "#999999",
};
const USAGE_COLOR_FALLBACK = "#1a3a2a";

/** Format an ISO date string into "Mon YYYY" */
function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}



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

  const topUsage = snapshot.usage_signature.filter((u) => u.pct > 0);
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

      {/* Hero — dark green, eyebrow + title + paragraph + CTAs */}
      <section className="bg-pdt-dark text-center px-6 py-14 md:py-16">
        <div className="uppercase tracking-widest text-[11px] font-semibold mb-4" style={{ color: "#88E7BB" }}>
          What just downloaded
        </div>
        <h1 className="font-serif-pdt text-4xl md:text-5xl font-normal text-white mb-4 leading-tight">
          The architecture of your thinking.
        </h1>
        <p className="text-white/70 text-[15px] max-w-[600px] mx-auto leading-relaxed mb-8">
          That zip file is a portable schema &mdash; the scaffolding that turns raw chat logs into something an AI can actually work with. Connect it to Claude to populate it and start working with your history, not just storing it.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/mcp-setup" className="inline-flex items-center gap-2 bg-white text-pdt-dark border-0 rounded-lg py-3 px-6 text-sm font-semibold no-underline hover:bg-white/90 transition-colors">
            Set up your MCP &rarr;
          </Link>
          <Link href="/schema" className="inline-flex items-center gap-2 border border-white/30 text-white rounded-lg py-3 px-6 text-sm font-semibold no-underline hover:bg-white/10 transition-colors">
            What did I just download?
          </Link>
        </div>
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

      <div className="max-w-[960px] mx-auto px-6 md:px-8 pb-20">

        {/* ═══════════════════════════════════════════════════════════
            CHARTS — Usage breakdown + Conversations by month
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[var(--border)] pt-8">

            {/* Left: Accessible horizontal bar chart — one bar per category */}
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-4">Breakdown by Usage Type</div>
              <div role="list" aria-label="Usage breakdown by category" className="flex flex-col gap-3">
                {topUsage.map((u) => {
                  const catKey = u.id.toLowerCase().replace(/[^a-z]/g, "");
                  const barColor = USAGE_COLORS[catKey] ?? USAGE_COLOR_FALLBACK;
                  const labelText = u.label.split(" &")[0].split(" /")[0];
                  const labelId = `cat-${catKey}`;
                  return (
                    <div key={u.id} role="listitem" className="grid grid-cols-[110px_1fr_40px] gap-3 items-center">
                      <span id={labelId} className="text-[14px] text-[var(--text-primary)] text-right truncate">{labelText}</span>
                      <div
                        className="h-4 bg-[#e8e5df] rounded overflow-hidden"
                        role="progressbar"
                        aria-labelledby={labelId}
                        aria-valuenow={u.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${Math.max(u.pct, 4)}%`,
                            backgroundColor: barColor,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <span className="text-[14px] font-semibold text-[var(--text-primary)] text-right">{u.pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Activity by month — individual month-year, chronological, scrollable */}
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-4">Conversations by Month</div>
              {snapshot.activity_by_month?.length > 0 ? (
                <div
                  role="list"
                  aria-label="Conversations per month"
                  className="flex flex-col gap-2.5 overflow-y-auto"
                  style={{ maxHeight: "360px" }}
                >
                  {snapshot.activity_by_month.map((m) => {
                    const maxCount = Math.max(...snapshot.activity_by_month!.map((x) => x.count), 1);
                    const widthPct = Math.max((m.count / maxCount) * 100, 6);
                    const labelId = `month-${m.yearMonth}`;
                    return (
                      <div key={m.yearMonth} role="listitem" className="grid grid-cols-[80px_1fr_40px] gap-3 items-center">
                        <span id={labelId} className="text-[14px] text-[var(--text-secondary)] text-right">{m.label}</span>
                        <div
                          className="h-3.5 bg-green-light rounded overflow-hidden"
                          role="progressbar"
                          aria-labelledby={labelId}
                          aria-valuenow={m.count}
                          aria-valuemin={0}
                          aria-valuemax={maxCount}
                        >
                          <div
                            className="h-full rounded bg-[#2d5a3f]"
                            style={{
                              width: `${widthPct}%`,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span className="text-[14px] font-semibold text-[var(--text-primary)] text-right">{m.count}</span>
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
            MCP + NETWORKING CARD — redesigned action cards
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* MCP Card — dark */}
            <div
              className="rounded-2xl flex flex-col overflow-hidden transition-all hover:shadow-[0_8px_32px_rgba(26,46,35,0.25)]"
              style={{ background: "#1A2E23", border: "1px solid #243B2E", padding: "36px 32px 32px" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
                  <circle cx="12" cy="13" r="2" stroke="rgba(255,255,255,0.4)"/>
                  <path d="M12 11v-1.5M12 15v1.5M14 13h1.5M10 13H8.5" stroke="rgba(255,255,255,0.4)"/>
                </svg>
              </div>
              <span
                className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider rounded-full w-fit mb-4"
                style={{ padding: "4px 10px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Requires Claude Desktop
              </span>
              <h3 className="font-serif-pdt text-2xl font-normal text-white mb-3 leading-tight">Connect to Claude</h3>
              <p className="text-[15px] leading-relaxed mb-2 flex-grow" style={{ color: "rgba(255,255,255,0.75)" }}>
                Point your schema at Claude through MCP. It stays on your device &mdash; Claude reads it directly.
              </p>
              <p className="text-[13px] leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.5)" }}>~5 minute setup</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/mcp-setup"
                  className="inline-flex items-center gap-2 w-fit rounded-full text-[14px] font-semibold no-underline transition-all hover:-translate-y-px"
                  style={{ padding: "12px 24px", background: "#FFFFFF", color: "#1A2E23" }}
                >
                  Set up your MCP
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </Link>
                <Link
                  href="/schema"
                  className="inline-flex items-center gap-2 w-fit rounded-full text-[14px] font-semibold no-underline transition-all hover:-translate-y-px"
                  style={{ padding: "12px 24px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  About the schema
                </Link>
              </div>
            </div>

            {/* Networking Card — light */}
            <div
              className="rounded-2xl flex flex-col overflow-hidden transition-all hover:shadow-[0_8px_32px_rgba(26,46,35,0.08)]"
              style={{ background: "#FFFFFF", border: "1px solid #D8DDD9", padding: "36px 32px 32px" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: "#F3F7F4", border: "1px solid #E8F0EB" }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#3D6B50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M7 8h6M7 12h10M7 16h4"/>
                </svg>
              </div>
              <span
                className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider rounded-full w-fit mb-4"
                style={{ padding: "4px 10px", background: "#FFF8E6", color: "#8B6914", border: "1px solid #F0E0A8" }}
              >
                New
              </span>
              <h3 className="font-serif-pdt text-2xl font-normal text-[var(--text-primary)] mb-3 leading-tight">Your Networking Card</h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-2 flex-grow">
                A shareable snapshot of your projects, interests, and thinking style &mdash; pulled from your history. Bring it to your next meetup instead of small talk.
              </p>
              <p className="text-[13px] mb-7" style={{ color: "#6B7C72" }}>Generate here or via MCP in Claude</p>
              <Link
                href="/networking-card"
                className="inline-flex items-center gap-2 w-fit rounded-full text-[14px] font-semibold no-underline text-white transition-all hover:-translate-y-px"
                style={{ padding: "12px 24px", background: "#1A2E23" }}
              >
                Generate your card
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </Link>
            </div>

          </div>
        </div>


        {/* Build with us — callout */}
        <div className="pt-14 border-t border-[var(--border)]">
          <div className="border-l-4 border-green-accent bg-green-light/40 rounded-r-lg px-6 py-5">
            <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-2">Want to build anti-extractive, data-portable, relational tools?</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
              PDT is part of a growing ecosystem of citizen infrastructure &mdash; tools designed to give people sovereignty over their data and strengthen how communities relate. We&apos;re builders, designers, and citizens looking for collaborators.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-pdt-dark no-underline hover:underline">
                Get in touch &rarr;
              </a>
              <Link href="/#cibc" className="text-[13px] font-semibold text-pdt-dark no-underline hover:underline">
                Learn about CIBC &rarr;
              </Link>
            </div>
          </div>
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
