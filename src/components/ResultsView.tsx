"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";
import { PDT_SNAPSHOT_KEY } from "@/lib/types";
import type { Snapshot } from "@/lib/types";
import type { CardCustomization } from "./NetworkingCard";
import { NetworkingCardInner } from "./NetworkingCard";
import { Nav } from "./Nav";
import { SubNav } from "./SubNav";
import { ZipBanner } from "./ZipBanner";

const USAGE_BAR_COLORS = ["#1a3a2a", "#2d5a3f", "#3d7a56", "#8cc5a0"];


export function ResultsView() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadCard = async () => {
    if (!cardRef.current || !snapshot) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "pdt-networking-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };

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

  const customization: CardCustomization = {
    displayName: displayName || undefined,
    role: role || undefined,
    location: location || undefined,
  };
  const topUsage = snapshot.usage_signature.filter((u) => u.pct > 0).slice(0, 4);
  const yearsOfHistory = snapshot.date_range.first && snapshot.date_range.last
    ? Math.max(1, Math.round((new Date(snapshot.date_range.last).getTime() - new Date(snapshot.date_range.first).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 0;

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

      {/* Stats banner — simple 4-stat rollup */}
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
              <div className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] leading-tight">{snapshot.top_projects.length}</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mt-2">Projects Detected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden card for PNG capture */}
      <div ref={cardRef} className="absolute -left-[9999px] w-[320px]" aria-hidden="true">
        <NetworkingCardInner snapshot={snapshot} customization={customization} />
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


        {/* Caricature + MCP — side by side */}
        <div className="max-w-[960px] mx-auto px-6 md:px-8 pt-14 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[var(--card-border)] rounded-xl p-8">
              <div className="text-4xl mb-3">🎭</div>
              <div className="flex gap-2 mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-green-light text-pdt-dark">FREE</span>
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-gray-100 text-[var(--text-secondary)]">AI-GENERATED</span>
              </div>
              <h3 className="font-serif-pdt text-[22px] font-normal mb-2.5 leading-tight">Your Caricature</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
                Not your face — your mind. An illustrated portrait generated from your worldview lenses and project patterns. Strange, accurate, shareable.
              </p>
              <p className="text-xs text-[var(--text-muted)] italic leading-relaxed mb-5">
                Note: this is the only feature that sends data to an external API — a short text prompt with your lenses only, never your raw conversations.
              </p>
              <button type="button" disabled className="opacity-60 cursor-not-allowed inline-flex items-center gap-2 border-2 border-pdt-dark text-pdt-dark bg-white py-2.5 px-5 rounded-lg text-sm font-semibold w-fit">
                Generate my caricature →
              </button>
            </div>
            <div className="border border-[var(--card-border)] rounded-xl p-8">
              <div className="text-4xl mb-3">📁</div>
              <div className="flex gap-2 items-center mb-2 flex-wrap">
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-pdt-dark text-white inline-flex items-center gap-1">◆ Power Users</span>
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-green-light text-pdt-dark">FREE</span>
                <span className="text-[10px] text-[var(--text-muted)]">· REQUIRES CLAUDE DESKTOP</span>
              </div>
              <h3 className="font-serif-pdt text-[22px] font-normal mb-2.5 leading-tight">MCP Files for Claude</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
                You&apos;re downloading the <strong>file structure</strong> for your own Claude MCP server. Once set up, Claude can search and cite your full ChatGPT history — projects, evidence, and usage patterns — in real time.
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] mb-4">The zip contains the schema, evidence excerpts, and metadata. Claude does the deep synthesis when you connect it. Setup takes about 15 minutes.</p>
              <a href="https://docs.anthropic.com/en/docs/build-with-claude/mcp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-pdt-dark text-pdt-dark bg-white py-2.5 px-5 rounded-lg text-sm font-semibold w-fit no-underline hover:bg-pdt-dark hover:text-white transition-colors mb-4">
                View setup guide
              </a>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                Includes: <code className="font-mono-pdt">index.json</code> · <code className="font-mono-pdt">overview.md</code> · <code className="font-mono-pdt">usage_modes.json</code> · <code className="font-mono-pdt">projects.json</code> · <code className="font-mono-pdt">concepts.json</code> · <code className="font-mono-pdt">evidence.json</code>
              </p>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════
            FIND YOUR PEOPLE — Bloom CTA + chapters
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-14 border-t border-[var(--border)]">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-3">Find Your People</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-serif-pdt text-3xl font-normal text-[var(--text-primary)] leading-tight mb-4">Your card was built for this moment.</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Bloom Network is a global community of people working on regenerative innovation. There&apos;s a chapter in Houston — and growing in cities everywhere. Show up with your card. Find the people working on what you care about.
              </p>
              <a href="https://bloomnetwork.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-pdt-dark text-white border-0 rounded-lg py-3 px-6 text-sm font-semibold no-underline hover:bg-green-mid transition-colors">
                Find a Bloom chapter near you →
              </a>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-4">Bloom Chapters</div>
              <div className="flex flex-col gap-3">
                {[
                  { city: "Houston, TX", active: true, you: true },
                  { city: "Austin, TX", active: true },
                  { city: "Portland, OR", active: true },
                  { city: "Oakland, CA", active: true },
                  { city: "Denver, CO", active: false, coming: true },
                  { city: "Chicago, IL", active: false, coming: true },
                ].map((c) => (
                  <div key={c.city} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.active ? "bg-green-accent" : "bg-[var(--card-border)]"}`} />
                    <span className={c.you ? "font-bold text-pdt-dark" : "text-[var(--text-primary)] font-medium"}>
                      {c.city}{c.you ? " — you" : ""}{c.coming ? " — coming soon" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Footer — same as landing */}
      <footer className="border-t border-[var(--border)] mt-8 py-6 px-6 md:px-8">
        <div className="max-w-[960px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono-pdt font-bold text-[15px] text-pdt-dark">pdt.com</div>
          <div className="flex gap-6">
            <a href="/#how" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">How it works</a>
            <a href="/#privacy" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">Privacy</a>
            <a href="#" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">GitHub</a>
            <a href="https://bloomnetwork.org" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">Bloom Network</a>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">© 2024 PDT · Your Data, Always</div>
        </div>
      </footer>
    </>
  );
}
