"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDT_SNAPSHOT_KEY } from "@/lib/types";
import type { Snapshot } from "@/lib/types";
import { Nav } from "./Nav";
import { SubNav } from "./SubNav";

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
          <a href="#files-explained" className="inline-flex items-center gap-2 border border-white/30 text-white rounded-lg py-3 px-6 text-sm font-semibold no-underline hover:bg-white/10 transition-colors">
            Peek inside
          </a>
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
            MCP FILES + NETWORKING CARD — side by side
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MCP Files card — dark background, concise entry point */}
            <div className="bg-pdt-dark rounded-xl p-8 flex flex-col">
              <div className="text-4xl mb-3">📁</div>
              <div className="flex gap-2 items-center mb-2 flex-wrap">
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-white/15 text-white inline-flex items-center gap-1">◆ Power Users</span>
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
            WHAT'S NEXT — Card-style action steps
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 border-t border-[var(--border)]">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-2">What&apos;s Next</div>
          <h2 className="font-serif-pdt text-[1.85rem] font-extrabold text-[var(--text-primary)] mb-1.5 leading-tight tracking-tight">
            Your data is ready.<br />Now make it useful.
          </h2>
          <p className="text-[0.92rem] text-[var(--text-secondary)] mb-7">
            You&apos;ve got the files. Here&apos;s how to put them to work:
          </p>

          <div className="flex flex-col gap-2.5">
            {/* Step 1 — Connect MCP */}
            <div className="flex items-start gap-4 bg-white border border-[var(--border)] rounded-[14px] px-5 py-[18px] hover:border-[#d5d0ca] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.03)] hover:-translate-y-px transition-all">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#fef3ee] flex items-center justify-center flex-shrink-0">
                <svg className="w-[18px] h-[18px] text-[#e8652d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[0.92rem] text-[var(--text-primary)] mb-0.5">Connect your MCP</div>
                <p className="text-[0.84rem] leading-relaxed text-[var(--text-secondary)]">Give Claude access to your full history. Search, cite, and build on years of past thinking.</p>
                <Link href="/mcp-setup" className="inline-flex items-center gap-1 mt-2 py-[5px] px-3.5 rounded-full text-[0.78rem] font-semibold no-underline bg-[#fef3ee] text-[#e8652d] hover:bg-[#fde8dd] transition-colors">
                  Set up MCP
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>

            {/* Step 2 — Networking card */}
            <div className="flex items-start gap-4 bg-white border border-[var(--border)] rounded-[14px] px-5 py-[18px] hover:border-[#d5d0ca] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.03)] hover:-translate-y-px transition-all">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#eef6f1] flex items-center justify-center flex-shrink-0">
                <svg className="w-[18px] h-[18px] text-[#2d6a4f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[0.92rem] text-[var(--text-primary)] mb-0.5">Generate your networking card</div>
                <p className="text-[0.84rem] leading-relaxed text-[var(--text-secondary)]">Create a shareable snapshot of your projects and interests. Bring it to your next event.</p>
                <Link href="/networking-card" className="inline-flex items-center gap-1 mt-2 py-[5px] px-3.5 rounded-full text-[0.78rem] font-semibold no-underline bg-[#eef6f1] text-[#2d6a4f] hover:bg-[#ddeee4] transition-colors">
                  Make your card
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>

            {/* Step 3 — Keep building */}
            <div className="flex items-start gap-4 bg-white border border-[var(--border)] rounded-[14px] px-5 py-[18px] hover:border-[#d5d0ca] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.03)] hover:-translate-y-px transition-all">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#f1effe] flex items-center justify-center flex-shrink-0">
                <svg className="w-[18px] h-[18px] text-[#6b5ce7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[0.92rem] text-[var(--text-primary)] mb-0.5">Keep building</div>
                <p className="text-[0.84rem] leading-relaxed text-[var(--text-secondary)]">Your MCP is an open foundation. Use it to build custom tools, automate workflows, or create artifacts we haven&apos;t thought of yet.</p>
              </div>
            </div>
          </div>

          {/* Build with us — callout */}
          <div className="border-l-4 border-green-accent bg-green-light/40 rounded-r-lg px-6 py-5 mt-8">
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
