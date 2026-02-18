"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { SubNav } from "@/components/SubNav";

/* ───────────────────────────────────────────
   The Claude prompt for self-generation
   ─────────────────────────────────────────── */
const CLAUDE_PROMPT = `Using my ChatGPT history through the MCP tools, create a networking card artifact for me. Here's what I need:

1. First, use get_stats to understand the scope of my data
2. Use search_evidence to identify my top recurring themes, interests, and project areas
3. Use list_conversations to find my most active projects and their date ranges
4. Use search_evidence to understand how I use AI (research vs writing vs technical vs other)

Then create a React artifact that serves as my personal networking card with:

- A clean, shareable design (think digital business card, not resume)
- My top 5-8 interest areas as tags
- A "How I use AI" bar chart showing my usage breakdown
- My 3-5 most active projects with date ranges
- Space at the top for my name, role, and location (use placeholder text I can edit)
- A subtle footer that says "Generated from [X] conversations over [Y] years using PDT \u2014 chatgpt.pdt.com"

Design notes:
- Use a warm, professional color palette (dark greens, cream, sage)
- Make it look good as a screenshot (people will share this as an image)
- Keep it to a single card view \u2014 no scrolling
- Don't include any raw conversation text or personal details I haven't explicitly provided
- Make the name/role/location editable in the artifact so I can customize before sharing

Important: Only surface patterns and themes. Never quote or reference specific conversation content. This should feel like a thoughtful summary, not a data dump.`;

/* ═══════════════════════════════════════════
   Page component
   ═══════════════════════════════════════════ */
export default function NetworkingCardPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CLAUDE_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Nav variant="landing" />
      <SubNav />
      <main className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════
          1. HERO
          ═══════════════════════════════════════ */}
      <section className="bg-cream text-center px-6 py-16 md:py-24">
        <div className="max-w-[720px] mx-auto">
          <div className="uppercase tracking-widest text-[11px] font-semibold text-green-accent mb-4">
            Your networking card
          </div>
          <h1 className="font-serif-pdt text-4xl md:text-[48px] leading-tight text-[var(--text-primary)] mb-6">
            Skip the small talk. Share how you actually think.
          </h1>
          <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-[600px] mx-auto">
            Your networking card is a shareable snapshot of your projects, interests, and thinking patterns &mdash; pulled from your ChatGPT history. Not a resume. Not a LinkedIn profile. A real picture of what you&apos;re working on and how your mind works.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. WHAT'S ON IT
          ═══════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          What your card shows
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-10 leading-tight">
          A snapshot of how your mind works.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Card preview placeholder */}
          <div className="bg-cream border border-[var(--card-border)] rounded-xl p-8 md:p-10">
            <div className="space-y-5">
              {/* Mini preview of card structure */}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-2">Preview</div>
                <div className="bg-white rounded-xl border border-[var(--border)] p-5 shadow-sm">
                  <div className="h-3 w-32 bg-pdt-dark/20 rounded mb-1.5" />
                  <div className="h-2 w-24 bg-pdt-dark/10 rounded mb-4" />
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["AI ethics", "community tech", "urban planning", "mutual aid", "data sovereignty"].map((tag) => (
                      <span key={tag} className="text-[10px] py-0.5 px-2 rounded-full bg-green-light text-pdt-dark border border-green-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 rounded bg-pdt-dark" style={{ width: "65%" }} />
                      <span className="text-[9px] text-[var(--text-muted)]">Research</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 rounded bg-green-mid" style={{ width: "20%" }} />
                      <span className="text-[9px] text-[var(--text-muted)]">Writing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 rounded bg-green-accent" style={{ width: "15%" }} />
                      <span className="text-[9px] text-[var(--text-muted)]">Technical</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-2 w-28 bg-pdt-dark/10 rounded" />
                      <div className="h-2 w-16 bg-pdt-dark/5 rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-2 w-24 bg-pdt-dark/10 rounded" />
                      <div className="h-2 w-14 bg-pdt-dark/5 rounded" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    <div className="h-1.5 w-40 bg-pdt-dark/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown list */}
          <div className="space-y-6">
            {[
              {
                icon: "\u{1F464}",
                title: "Your name, role, and location",
                desc: "You choose what to include. Nothing is pulled from your conversations automatically \u2014 these fields are yours to fill in.",
              },
              {
                icon: "\u{1F3AF}",
                title: "Top interest areas and themes",
                desc: "Recurring topics from your conversation history, surfaced as tags. What you keep coming back to \u2014 the threads that define your thinking.",
              },
              {
                icon: "\u{1F4CA}",
                title: "How you use AI",
                desc: "A visual breakdown of your usage patterns: research, writing, technical problem-solving, and more. Shows your relationship with AI as a tool.",
              },
              {
                icon: "\u{1F4C5}",
                title: "Active projects with date ranges",
                desc: "What you\u2019ve been building and when. Gives people a sense of your trajectory and what\u2019s current.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-light flex items-center justify-center text-base flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">{item.title}</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-4">
              Everything on your card is derived from patterns in your conversations &mdash; not from any single message. Your raw conversations are never shown or shared.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. WHAT IT'S FOR
          ═══════════════════════════════════════ */}
      <section className="bg-cream py-20">
        <div className="max-w-[960px] mx-auto px-6 md:px-8">
          <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
            Why it matters
          </div>
          <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-4 leading-tight">
            Technology should help us relate better.
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] max-w-[640px] leading-relaxed mb-12">
            We believe the best technology helps people connect with themselves, each other, and the world. Your networking card is a small step in that direction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Meetups & conferences",
                desc: "Share your card instead of a business card. Let people find you based on what you actually care about, not your job title.",
              },
              {
                title: "Finding collaborators",
                desc: "Looking for a co-builder? Share your card in community Slack channels, Discord servers, or group chats to signal what you\u2019re working on.",
              },
              {
                title: "Personal reflection",
                desc: "Sometimes seeing your own patterns laid out is the most useful part. What themes keep showing up? What have you actually been spending your AI time on?",
              },
              {
                title: "Community onboarding",
                desc: "Share it when joining a new community or organization so people can quickly understand your background and interests.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-[var(--card-border)] p-6">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. TWO WAYS TO GENERATE
          ═══════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          Two paths
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-10 leading-tight">
          How to get your card
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Path A — PDT API */}
          <div className="border-2 border-green-accent/40 rounded-xl p-7 md:p-8 bg-green-light/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-pdt-dark text-white">Option A</span>
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-green-light text-pdt-dark">Easiest</span>
            </div>
            <h3 className="font-serif-pdt text-xl font-normal text-[var(--text-primary)] mb-3">
              Generate on PDT
            </h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-6">
              Upload your ChatGPT export to PDT and generate your card directly. We use Claude&apos;s API to process your lenses and project types &mdash; never your raw conversations.
            </p>
            <Link
              href="/#upload"
              className="inline-flex items-center gap-2 bg-pdt-dark text-white py-3 px-6 rounded-lg text-sm font-semibold no-underline hover:bg-green-mid transition-colors"
            >
              Upload your data &rarr;
            </Link>
          </div>

          {/* Path B — Local MCP */}
          <div className="border border-[var(--card-border)] rounded-xl p-7 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-pdt-dark text-white">Option B</span>
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-green-badge text-pdt-dark">Most Private</span>
            </div>
            <h3 className="font-serif-pdt text-xl font-normal text-[var(--text-primary)] mb-3">
              Generate it yourself with Claude
            </h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-6">
              Already have your MCP set up? You can generate your networking card as a Claude artifact &mdash; a living, linkable overview of your thinking that you control completely.
            </p>
            <a
              href="#prompt"
              className="inline-flex items-center gap-2 border-2 border-pdt-dark text-pdt-dark bg-white py-2.5 px-6 rounded-lg text-sm font-semibold no-underline hover:bg-green-light transition-colors"
            >
              See the prompt below &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. THE PROMPT — Copy-pasteable block
          ═══════════════════════════════════════ */}
      <section id="prompt" className="bg-pdt-dark py-20">
        <div className="max-w-[960px] mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <div className="uppercase tracking-widest text-[11px] font-semibold text-green-accent mb-3">
              Generate it yourself
            </div>
            <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-white mb-3 leading-tight">
              Generate your card as a Claude artifact
            </h2>
            <p className="text-[15px] text-white/60 max-w-[600px] mx-auto leading-relaxed">
              Copy this prompt into Claude Desktop with your MCP connected. Claude will search your ChatGPT history, identify your patterns, and create a shareable artifact &mdash; a living page you can link to anytime.
            </p>
          </div>

          {/* Prompt block */}
          <div className="bg-[#0d1f16] border border-white/10 rounded-xl overflow-hidden max-w-[800px] mx-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className="font-mono-pdt text-[11px] text-white/40">Paste this into Claude Desktop</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[12px] text-white/50 hover:text-white/90 transition-colors font-mono-pdt flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 md:p-6 overflow-x-auto text-[13px] font-mono-pdt leading-relaxed whitespace-pre-wrap">
              <code className="text-green-300/90">{CLAUDE_PROMPT}</code>
            </pre>
          </div>

          {/* Post-prompt guidance */}
          <div className="max-w-[800px] mx-auto mt-8">
            <p className="text-[14px] text-white/50 leading-relaxed text-center">
              After Claude generates your artifact, you&apos;ll get a shareable link. You can also screenshot it and share as an image at events. Edit the name, role, and location fields directly in the artifact before sharing.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. TIPS
          ═══════════════════════════════════════ */}
      <section className="bg-green-light/30 py-16">
        <div className="max-w-[960px] mx-auto px-6 md:px-8">
          <h2 className="font-serif-pdt text-2xl font-normal text-[var(--text-primary)] mb-8 leading-tight">
            Tips for a great card
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Edit before sharing",
                desc: "The artifact will have placeholder text for your name and role. Update these before you screenshot or share the link.",
              },
              {
                title: "Iterate",
                desc: "If the first version doesn\u2019t capture your vibe, tell Claude what to adjust. \u201CMake the projects section more prominent\u201D or \u201CRemove the coding-related themes\u201D \u2014 it\u2019s a conversation.",
              },
              {
                title: "Keep it current",
                desc: "Re-run the prompt periodically as your history grows. Your card should evolve as your thinking does.",
              },
              {
                title: "Pair it with your MCP",
                desc: "When someone sees your card and wants to know more, you can use your MCP to instantly pull up relevant conversations and context.",
              },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-badge flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[var(--text-primary)] mb-1">{tip.title}</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. BOTTOM CTA
          ═══════════════════════════════════════ */}
      <section className="bg-cream text-center px-6 py-16 md:py-20">
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-4 leading-tight">
          Ready to make yours?
        </h2>
        <p className="text-[15px] text-[var(--text-secondary)] max-w-[480px] mx-auto leading-relaxed mb-8">
          Upload your ChatGPT export and generate your networking card in minutes. Or set up your MCP and generate it locally with Claude.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#upload"
            className="inline-flex items-center gap-2 bg-pdt-dark text-white py-3.5 px-8 rounded-lg text-sm font-semibold no-underline hover:bg-green-mid transition-colors"
          >
            Upload your data &rarr;
          </Link>
          <Link
            href="/mcp-setup"
            className="inline-flex items-center gap-2 border-2 border-pdt-dark text-pdt-dark bg-transparent py-3 px-8 rounded-lg text-sm font-semibold no-underline hover:bg-pdt-dark hover:text-white transition-colors"
          >
            Set up your MCP first &rarr;
          </Link>
        </div>
      </section>

      {/* Footer — matches main site */}
      <footer className="border-t border-[var(--border)] py-6 px-6 md:px-8">
        <div className="max-w-[960px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-mono-pdt font-bold text-[15px] text-pdt-dark no-underline">chatgpt.pdt</Link>
          <div className="flex gap-6">
            <Link href="/#how" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">How it works</Link>
            <Link href="/#privacy" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">Privacy</Link>
            <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">GitHub</a>
            <a href="https://citizeninfra.org" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">CIBC</a>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">&copy; 2025 Citizen Infrastructure &middot; Your Data, Always</div>
        </div>
      </footer>
      </main>
    </>
  );
}
