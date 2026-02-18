"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDT_SNAPSHOT_KEY } from "@/lib/types";
import type { Snapshot } from "@/lib/types";
import { Nav } from "./Nav";
import { SubNav } from "./SubNav";
import { ZipBanner } from "./ZipBanner";

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
            HOW YOU USE AI — Horizontal bars (WCAG accessible)
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 pb-4">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-2">Usage Signature</div>
          <h2 className="font-serif-pdt text-3xl font-normal text-[var(--text-primary)] mb-8 leading-tight">How you use AI</h2>
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
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-4">Activity by Month</div>
              {snapshot.activity_by_month?.length > 0 ? (
                <div
                  role="list"
                  aria-label="Messages per month"
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
                Your files are ready. Connect them to Claude Desktop and get instant access to your full ChatGPT history &mdash; searchable and citable.
              </p>
              <p className="text-[13px] text-white/60 mb-6">
                This is the foundation. Once connected, you can generate networking cards, explore your thinking patterns, and build on years of past conversations. Your files stay on your device &mdash; when you ask Claude a question, Claude processes them directly. We never see your data; you&apos;re working with Claude, not with us.
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
                You choose how it&apos;s made: generate it here using our API, or use your MCP to have Claude build it from your local files. Either way, PDT never sees your conversations &mdash; you&apos;re working directly with Claude.
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
            WHAT'S NEXT — Action-oriented CTA
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 border-t border-[var(--border)]">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-2">What&apos;s Next</div>
          <h2 className="font-serif-pdt text-3xl font-normal text-[var(--text-primary)] mb-3 leading-tight">
            Your data is ready. Now make it useful.
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] mb-8">
            You&apos;ve got the files. Here&apos;s how to put them to work:
          </p>

          {/* Three action items — compact checklist rows */}
          <div className="space-y-5 mb-12">
            <div className="flex gap-3.5 items-start">
              <span className="text-lg flex-shrink-0 mt-0.5">⚡</span>
              <div>
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">Connect your MCP</span>
                <span className="text-[14px] text-[var(--text-secondary)]"> &mdash; Give Claude access to your full history. Search, cite, and build on years of past thinking. </span>
                <Link href="/mcp-setup" className="text-[14px] font-semibold text-pdt-dark no-underline hover:underline">Set up MCP &rarr;</Link>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <span className="text-lg flex-shrink-0 mt-0.5">🪪</span>
              <div>
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">Generate your networking card</span>
                <span className="text-[14px] text-[var(--text-secondary)]"> &mdash; Create a shareable snapshot of your projects and interests. Bring it to your next event. </span>
                <Link href="/networking-card" className="text-[14px] font-semibold text-pdt-dark no-underline hover:underline">Make your card &rarr;</Link>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <span className="text-lg flex-shrink-0 mt-0.5">🔧</span>
              <div>
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">Keep building</span>
                <span className="text-[14px] text-[var(--text-secondary)]"> &mdash; Your MCP is an open foundation. Use it to build custom tools, automate workflows, or create artifacts we haven&apos;t thought of yet.</span>
              </div>
            </div>
          </div>

          {/* Build with us — warm secondary callout */}
          <div className="border-l-4 border-green-accent bg-green-light/40 rounded-r-lg px-6 py-5 mb-4">
            <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-2">Want to build citizen infrastructure?</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
              PDT is one tool in a larger ecosystem of projects built to strengthen community agency and data sovereignty. We&apos;re a community of builders, designers, researchers, and citizens &mdash; and we&apos;re always looking for collaborators.
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
