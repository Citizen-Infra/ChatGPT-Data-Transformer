"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";

/* ───────────────────────────────────────────
   Data: MCP Tools
   ─────────────────────────────────────────── */
const MCP_TOOLS = [
  {
    name: "search_evidence",
    label: "Full-text search across all your messages",
    description:
      "This is the workhorse. Ask Claude to find anything you\u2019ve ever discussed \u2014 ideas, decisions, research, recommendations, arguments you worked through. Claude searches your entire history and pulls up the relevant passages.",
    prompts: [
      "Search my history for any conversations about pricing strategy",
      "Find everything I\u2019ve discussed about React component architecture",
      "What have I said about work-life balance over the past year?",
      "Pull up any conversations where I was working through a difficult decision",
    ],
  },
  {
    name: "get_conversation",
    label: "Get all turns in one conversation by ID",
    description:
      "Once Claude finds a relevant conversation, it can pull the full thread \u2014 every message, in order. Useful when you need the complete context of a past discussion, not just a snippet.",
    prompts: [],
  },
  {
    name: "list_conversations",
    label: "Browse and filter all your conversations",
    description:
      "Get an overview of everything in your history. Filter by date, browse titles, or ask Claude to categorize your conversations by topic. Great for understanding the shape of your past thinking.",
    prompts: [],
  },
  {
    name: "get_evidence_by_id",
    label: "Fetch a specific evidence row",
    description:
      "When Claude surfaces a specific passage from your history, this tool lets it retrieve the full surrounding context. Think of it as zooming in on a particular moment in a conversation.",
    prompts: [],
  },
  {
    name: "get_stats",
    label: "Overview of your data \u2014 totals, date range, role counts",
    description:
      "See the shape of your ChatGPT usage at a glance. How many conversations, what date range, how the messages break down. A quick way to orient yourself and Claude to what\u2019s available.",
    prompts: [],
  },
  {
    name: "search_by_date",
    label: "Filter messages by date range",
    description:
      "Narrow your search to a specific time period. Useful for finding what you were working on last quarter, tracing how your thinking evolved over months, or isolating conversations from a particular project phase.",
    prompts: [],
  },
];

/* ───────────────────────────────────────────
   Data: Workflow stories
   ─────────────────────────────────────────── */
const WORKFLOW_STORIES = [
  {
    title: "The career pivoter",
    body: "I spent 18 months talking through a career change with ChatGPT \u2014 pros and cons, fears, research, salary comparisons. When I switched to Claude, I asked it to search my history for every conversation about career decisions. It synthesized 40+ conversations into a clear picture of what I actually want. I couldn\u2019t have reconstructed that myself.",
  },
  {
    title: "The founder",
    body: "I\u2019ve been building in public for two years \u2014 product ideas, user research, pivot decisions, technical architecture. Now when I\u2019m writing investor updates or preparing for board meetings, I ask Claude to pull up my original reasoning for key decisions. It\u2019s like having a perfect institutional memory.",
  },
  {
    title: "The researcher",
    body: "I use AI for literature review, hypothesis testing, and writing. Being able to search my past conversations by date range means I can trace how my thinking evolved on a topic over months. I found contradictions in my own reasoning I never would have caught.",
  },
  {
    title: "The organizer",
    body: "I coordinated mutual aid and community campaigns through ChatGPT \u2014 outreach templates, volunteer management, event planning. Now I can search all of that history when planning new campaigns. Nothing gets lost between cycles.",
  },
];

/* ───────────────────────────────────────────
   Data: Troubleshooting FAQ
   ─────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "Claude doesn\u2019t see my tools",
    a: "Make sure you\u2019ve restarted Claude Desktop after editing your config file. Check that the JSON is valid (no trailing commas, matching brackets). You can verify by looking for the chatgpt-transformer tools in Claude\u2019s tool list at the start of a new conversation.",
  },
  {
    q: "I get a path error",
    a: "Double-check that the path in your config file points to the actual folder where you unzipped the scaffolding files and placed your conversations.json. The path must be absolute (start with / on Mac or C:\\ on Windows), not relative.",
  },
  {
    q: "It\u2019s slow to start",
    a: "The first time MCP indexes your conversations may take a minute or two, especially if you have a large export. Subsequent launches will be faster since the index is already built. If it takes more than 5 minutes, check that your conversations.json isn\u2019t corrupted.",
  },
  {
    q: "I have an existing MCP setup",
    a: "Just add the chatgpt-transformer entry to your existing mcpServers object in claude_desktop_config.json. It won\u2019t interfere with other MCP servers \u2014 they all run independently. Make sure to add a comma after the previous server entry.",
  },
];

/* ───────────────────────────────────────────
   Data: MCP Explainer Steps
   ─────────────────────────────────────────── */
const MCP_STEPS = [
  { title: "Download the scaffolding from PDT", body: "A pre-structured template that tells MCP how to organize and index your ChatGPT export. It doesn\u2019t contain your data \u2014 just the schema." },
  { title: "MCP indexes your export locally", body: "MCP reads your conversations.json on your machine and fills in the scaffolding. Nothing is uploaded anywhere \u2014 the index lives on your device." },
  { title: "Claude Desktop connects through MCP", body: "Claude Desktop reads your config file and connects to the chatgpt-transformer MCP server running locally on your machine." },
  { title: "Ask a question, Claude searches your history", body: "When you ask Claude something, it queries your local index and pulls only the relevant passages \u2014 not your entire history. Fast, efficient, and low on token usage." },
];

const WHY_NOT_UPLOAD = [
  { icon: "\uD83D\uDCCF", title: "Claude has file size limits", body: "A typical ChatGPT export runs tens or hundreds of megabytes \u2014 well beyond what Claude can accept as an upload." },
  { icon: "\uD83D\uDD25", title: "Uploading eats your usage", body: "Even if you could fit it, sending your entire history as context on every message would consume massive amounts of your Claude usage quota." },
  { icon: "\uD83C\uDFAF", title: "MCP + PDT schema are surgical", body: "Instead of dumping everything into context, MCP indexes your history locally and serves only the relevant passages when Claude asks. Full searchability at a fraction of the token cost." },
];

const PRIVACY_ITEMS = [
  { icon: "\uD83D\uDD12", title: "PDT never touches your data", body: "You download structure, MCP fills it in on your machine. We don\u2019t process, store, or transmit anything." },
  { icon: "\uD83D\uDCBB", title: "Everything stays on your device", body: "Your files, your index, your data \u2014 all local. You control what exists and can delete it anytime." },
  { icon: "\u2696\uFE0F", title: "Standard Claude policies apply", body: "When Claude reads your local files to answer a question, Anthropic\u2019s standard privacy policies apply \u2014 no different from pasting text into Claude. MCP just makes it searchable." },
];

/* ═══════════════════════════════════════════
   Page component
   ═══════════════════════════════════════════ */
export default function McpSetupPage() {
  const [openTool, setOpenTool] = useState<string | null>("search_evidence");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openMcpSteps, setOpenMcpSteps] = useState<Set<number>>(new Set());
  const [openWhyUpload, setOpenWhyUpload] = useState<Set<number>>(new Set());
  const [openPrivacy, setOpenPrivacy] = useState<Set<number>>(new Set());
  const [configPlatform, setConfigPlatform] = useState<"mac" | "win">("mac");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const toggleSet = (set: Set<number>, idx: number, setter: (s: Set<number>) => void) => {
    const next = new Set(set);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setter(next);
  };

  const copyConfig = useCallback(() => {
    const config = `{
  "mcpServers": {
    "chatgpt-transformer": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/chatgpt-transformer-mcp",
        "--data-dir",
        "/path/to/your/unzipped/files"
      ]
    }
  }
}`;
    navigator.clipboard.writeText(config);
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel("Copy"), 2000);
  }, []);

  const scrollCarousel = (dir: number) => {
    const next = Math.max(0, Math.min(WORKFLOW_STORIES.length - 1, carouselIdx + dir));
    setCarouselIdx(next);
    const cards = trackRef.current?.querySelectorAll(".persona-card");
    cards?.[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <>
      <Nav variant="landing" />
      <main className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section className="bg-cream pt-[130px] pb-[72px] px-6 text-center border-b border-[var(--card-border)]">
        <div className="max-w-[660px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[#8BA898] mb-3">
            Your data, working for you
          </div>
          <h1 className="font-sans text-[36px] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)] mb-5">
            Your past thinking shouldn&apos;t disappear when you switch tools.
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] max-w-[540px] mx-auto mb-8">
            Your ChatGPT export is too large for Claude to read directly &mdash; it&apos;ll hit file size limits and burn through your usage. Our scaffolding lets MCP index your history locally so Claude can search it on demand, pulling only what&apos;s relevant instead of swallowing the whole file.
          </p>
          <a href="#setup" className="inline-flex items-center gap-2 bg-pdt-dark text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline transition-all hover:bg-green-mid hover:-translate-y-px hover:shadow-lg">
            Get set up
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BEFORE / AFTER
          ═══════════════════════════════════════ */}
      <section className="py-[72px] px-6" id="how">
        <div className="max-w-[780px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">What changes</div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-8">Before and after you connect.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* WITHOUT */}
            <div className="border border-[var(--card-border)] rounded-xl p-7 bg-white">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-full bg-red-50 text-red-800 flex items-center justify-center text-xs font-bold">&#x2715;</div>
                <span className="font-mono-pdt text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--text-muted)]">Without your data</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Claude starts from zero every conversation",
                  "You re-explain your projects, your context, your preferences",
                  "Past thinking is locked inside a platform you\u2019re leaving",
                  "You lose years of intellectual work",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--text-secondary)] leading-[1.6]">
                    <span className="w-4 h-0.5 bg-[#c8d8cf] rounded-sm flex-shrink-0 mt-[11px]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* WITH */}
            <div className="border border-[#c8d8cf] rounded-xl p-7 bg-[#e8f0eb]">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#f0fdf4] text-[#166534] flex items-center justify-center text-xs font-bold">&#x2713;</div>
                <span className="font-mono-pdt text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--text-muted)]">With your MCP connected</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Claude can search years of your thinking in real time",
                  "Reference specific past conversations by topic or date",
                  "Build on ideas you explored months ago",
                  "Your context travels with you. Stored on your device, read by Claude when you need it \u2014 not trapped in one product",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--text-secondary)] leading-[1.6]">
                    <span className="text-[#166534] text-sm flex-shrink-0 mt-0.5">&#x2713;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── MCP EXPLAINER ── */}
          <div className="mt-8 border border-[var(--card-border)] rounded-xl p-8 bg-white border-l-[3px] border-l-pdt-dark">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-5">How MCP actually works</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6] mb-5">
              MCP (Model Context Protocol) is an open standard that lets AI tools like Claude read local files on your device. Instead of uploading data, MCP serves it to Claude on demand &mdash; only what&apos;s needed, when it&apos;s needed.{" "}
              <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-green-mid font-medium underline underline-offset-2">Learn more about MCP &rarr;</a>
            </p>
            <div className="divide-y divide-[var(--card-border)]">
              {MCP_STEPS.map((step, i) => (
                <div key={i}>
                  <button type="button" onClick={() => toggleSet(openMcpSteps, i, setOpenMcpSteps)} className="flex items-center gap-3 py-3.5 w-full text-left">
                    <span className="w-6 h-6 rounded-full bg-[#e8f0eb] text-pdt-dark text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="flex-1 text-[15px] font-medium text-[var(--text-primary)]">{step.title}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] text-[#8BA898] flex-shrink-0 transition-transform duration-200 ${openMcpSteps.has(i) ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {openMcpSteps.has(i) && (
                    <div className="pl-9 pb-3.5 text-[14px] text-[var(--text-secondary)] leading-[1.6]">{step.body}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── WHY NOT UPLOAD ── */}
          <div className="mt-5 border border-[var(--card-border)] rounded-xl p-8 bg-white border-l-[3px] border-l-green-accent">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Why not just upload your export to Claude?</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6] mb-4">You can&apos;t &mdash; and even if you could, you wouldn&apos;t want to.</p>
            <div className="divide-y divide-[var(--card-border)]">
              {WHY_NOT_UPLOAD.map((item, i) => (
                <div key={i}>
                  <button type="button" onClick={() => toggleSet(openWhyUpload, i, setOpenWhyUpload)} className="flex items-center gap-2.5 py-3 w-full text-left">
                    <span className="text-[15px] flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-[14px] font-medium text-[var(--text-primary)]">{item.title}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] text-[#8BA898] flex-shrink-0 transition-transform duration-200 ${openWhyUpload.has(i) ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {openWhyUpload.has(i) && (
                    <div className="pl-7 pb-3 text-[13px] text-[var(--text-secondary)] leading-[1.6]">{item.body}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── PRIVACY ── */}
          <div className="mt-5 border border-[var(--card-border)] rounded-xl p-8 bg-white border-l-[3px] border-l-[#6DBF73]" id="privacy">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">What this means for your privacy</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6] mb-4">The short version: we never see your data.</p>
            <div className="divide-y divide-[var(--card-border)]">
              {PRIVACY_ITEMS.map((item, i) => (
                <div key={i}>
                  <button type="button" onClick={() => toggleSet(openPrivacy, i, setOpenPrivacy)} className="flex items-center gap-2.5 py-3 w-full text-left">
                    <span className="text-[15px] flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-[14px] font-medium text-[var(--text-primary)]">{item.title}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] text-[#8BA898] flex-shrink-0 transition-transform duration-200 ${openPrivacy.has(i) ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {openPrivacy.has(i) && (
                    <div className="pl-7 pb-3 text-[13px] text-[var(--text-secondary)] leading-[1.6]">{item.body}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SIX TOOLS
          ═══════════════════════════════════════ */}
      <section className="bg-cream py-[72px] px-6 border-t border-b border-[var(--card-border)]">
        <div className="max-w-[780px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">What you can actually do</div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-3.5">Six tools PDT gives you.</h2>
          <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] max-w-[560px] mb-8">
            Your MCP gives Claude six tools to work with your ChatGPT history. Here&apos;s what that looks like in practice.
          </p>

          <div className="space-y-3">
            {MCP_TOOLS.map((tool) => {
              const isOpen = openTool === tool.name;
              return (
                <div key={tool.name} className={`border rounded-xl bg-white overflow-hidden transition-colors ${isOpen ? "border-[#c8d8cf]" : "border-[var(--card-border)] hover:border-[#c8d8cf]"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenTool(isOpen ? null : tool.name)}
                    className="w-full flex items-center gap-3 py-[18px] px-6 text-left"
                  >
                    <code className="font-mono-pdt text-[11px] font-medium bg-pdt-dark text-cream py-1 px-2.5 rounded-md flex-shrink-0 whitespace-nowrap">
                      {tool.name}
                    </code>
                    <span className="text-[15px] text-[var(--text-secondary)] flex-1 hidden sm:inline">{tool.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] text-[#8BA898] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px]" : "max-h-0"}`}>
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-[14px] font-medium text-[var(--text-primary)] mb-2 sm:hidden">{tool.label}</p>
                      <p className="text-[15px] text-[var(--text-secondary)] leading-[1.7] mb-4">{tool.description}</p>
                      {tool.prompts.length > 0 && (
                        <>
                          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.1em] uppercase text-[#8BA898] mb-2.5">Try asking Claude</div>
                          <div className="space-y-2">
                            {tool.prompts.map((prompt) => (
                              <div key={prompt} className="flex items-center gap-2.5 py-3 px-4 bg-[#e8f0eb] rounded-lg font-mono-pdt text-[13px] text-pdt-dark">
                                <span className="text-[#8BA898] text-xs flex-shrink-0">&rsaquo;</span>
                                &ldquo;{prompt}&rdquo;
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PERSONAS CAROUSEL
          ═══════════════════════════════════════ */}
      <section className="py-[72px] px-6">
        <div className="max-w-[780px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">How people actually use this</div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-8">Real workflows, compound value.</h2>

          <div className="relative overflow-hidden">
            <div ref={trackRef} className="flex gap-5 overflow-x-auto scroll-snap-x-mandatory pb-1" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {WORKFLOW_STORIES.map((story) => (
                <div key={story.title} className="persona-card flex-none w-[calc(50%-10px)] min-w-[280px] scroll-snap-start border border-[var(--card-border)] rounded-xl p-7 bg-cream border-l-[3px] border-l-pdt-dark">
                  <h3 className="font-serif-pdt text-xl font-normal text-[var(--text-primary)] mb-3">{story.title}</h3>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6] italic">{story.body}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-5">
              <button type="button" onClick={() => scrollCarousel(-1)} className="w-9 h-9 rounded-full border border-[var(--card-border)] bg-white flex items-center justify-center text-pdt-dark hover:bg-[#e8f0eb] transition-colors" aria-label="Previous">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex gap-1.5">
                {WORKFLOW_STORIES.map((_, i) => (
                  <button key={i} type="button" onClick={() => { setCarouselIdx(i); trackRef.current?.querySelectorAll(".persona-card")?.[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }); }} className={`h-2 rounded-full transition-all ${i === carouselIdx ? "w-5 bg-pdt-dark" : "w-2 bg-[var(--card-border)]"}`} aria-label={`Go to slide ${i + 1}`} />
                ))}
              </div>
              <button type="button" onClick={() => scrollCarousel(1)} className="w-9 h-9 rounded-full border border-[var(--card-border)] bg-white flex items-center justify-center text-pdt-dark hover:bg-[#e8f0eb] transition-colors" aria-label="Next">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SETUP
          ═══════════════════════════════════════ */}
      <section id="setup" className="bg-[#1a2f26] text-cream py-[72px] px-6 border-t-[3px] border-t-green-accent relative overflow-hidden">
        <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,191,115,0.06), transparent 70%)" }} />
        <div className="max-w-[780px] mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[#8BA898] mb-3">Setup</div>
            <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-cream mb-3.5">Get set up in 15 minutes</h2>
            <p className="text-[15px] text-[#8BA898] leading-[1.7] max-w-[520px] mx-auto">
              You&apos;ll need Claude Desktop (the app, not the website). If you don&apos;t have it yet,{" "}
              <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer" className="text-[#88E7BB] underline underline-offset-2">download it here</a>.
            </p>
          </div>

          <div className="space-y-10">
            {/* Step 1 */}
            <div className="grid grid-cols-[40px_1fr] gap-5">
              <div className="w-9 h-9 rounded-full bg-[#2D4A3E] text-cream flex items-center justify-center text-[15px] font-semibold">1</div>
              <div>
                <h3 className="text-lg font-bold text-cream mb-2">Download the scaffolding</h3>
                <p className="text-[14px] text-[#8BA898] leading-[1.6] mb-4">
                  Download the MCP scaffolding folder from PDT. This is a pre-structured template &mdash; it doesn&apos;t contain your data yet. Unzip it somewhere you&apos;ll remember (like your Documents folder), alongside your ChatGPT export&apos;s{" "}
                  <code className="bg-white/[0.08] px-1.5 py-0.5 rounded font-mono-pdt text-xs">conversations.json</code>.
                </p>
                <a href="#" className="inline-flex items-center gap-2 bg-pdt-dark text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline border border-[#8BA898]/20 transition-all hover:bg-green-mid hover:-translate-y-px hover:shadow-lg">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  Download scaffolding
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-[40px_1fr] gap-5">
              <div className="w-9 h-9 rounded-full bg-[#2D4A3E] text-cream flex items-center justify-center text-[15px] font-semibold">2</div>
              <div>
                <h3 className="text-lg font-bold text-cream mb-2">Find your Claude Desktop config</h3>
                <p className="text-[14px] text-[#8BA898] leading-[1.6] mb-4">Claude Desktop uses a configuration file to know which MCP servers to connect to.</p>
                <div className="flex gap-0">
                  <button type="button" onClick={() => setConfigPlatform("mac")} className={`py-2 px-4 font-mono-pdt text-[11px] border border-[rgba(200,216,207,0.12)] rounded-tl-lg transition-colors ${configPlatform === "mac" ? "bg-white/10 text-cream" : "bg-white/[0.06] text-[#8BA898]"}`}>Mac</button>
                  <button type="button" onClick={() => setConfigPlatform("win")} className={`py-2 px-4 font-mono-pdt text-[11px] border border-l-0 border-[rgba(200,216,207,0.12)] rounded-tr-lg transition-colors ${configPlatform === "win" ? "bg-white/10 text-cream" : "bg-white/[0.06] text-[#8BA898]"}`}>Windows</button>
                </div>
                <div className="bg-white/[0.05] border border-t-0 border-[rgba(200,216,207,0.12)] rounded-b-lg py-4 px-5 font-mono-pdt text-xs text-[#c8d8cf] leading-[1.7] overflow-x-auto">
                  <code>{configPlatform === "mac" ? "~/Library/Application Support/Claude/claude_desktop_config.json" : "%APPDATA%\\Claude\\claude_desktop_config.json"}</code>
                </div>
                <p className="text-xs text-[#8BA898] mt-2">If the file doesn&apos;t exist yet, create it.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-[40px_1fr] gap-5">
              <div className="w-9 h-9 rounded-full bg-[#2D4A3E] text-cream flex items-center justify-center text-[15px] font-semibold">3</div>
              <div>
                <h3 className="text-lg font-bold text-cream mb-2">Add the chatgpt-transformer entry</h3>
                <p className="text-[14px] text-[#8BA898] leading-[1.6] mb-4">Open the config file in any text editor and add the chatgpt-transformer server. Your scaffolding folder includes a ready-to-paste config snippet &mdash; just copy it in.</p>
                <div className="bg-white/[0.05] border border-[rgba(200,216,207,0.12)] rounded-lg overflow-hidden relative">
                  <button type="button" onClick={copyConfig} className="absolute top-2.5 right-3 bg-white/[0.08] text-[#8BA898] hover:bg-white/[0.15] hover:text-cream py-1 px-2.5 rounded font-mono-pdt text-[11px] transition-colors">{copyLabel}</button>
                  <div className="font-mono-pdt text-[11px] text-[#8BA898] py-1.5 px-5 bg-white/[0.04]">claude_desktop_config.json</div>
                  <pre className="py-4 px-5 overflow-x-auto font-mono-pdt text-xs leading-[1.7]">
                    <code>
                      <span className="text-[#c8d8cf]">{"{"}</span>{"\n"}
                      {"  "}<span className="text-[#c8d8cf]">&quot;mcpServers&quot;</span><span className="text-[#c8d8cf]">: {"{"}</span>{"\n"}
                      {"    "}<span className="text-[#c8d8cf]">&quot;chatgpt-transformer&quot;</span><span className="text-[#c8d8cf]">: {"{"}</span>{"\n"}
                      {"      "}<span className="text-[#c8d8cf]">&quot;command&quot;</span>: <span className="text-[#88E7BB]">&quot;npx&quot;</span>,{"\n"}
                      {"      "}<span className="text-[#c8d8cf]">&quot;args&quot;</span>: [{"\n"}
                      {"        "}<span className="text-[#88E7BB]">&quot;-y&quot;</span>,{"\n"}
                      {"        "}<span className="text-[#88E7BB]">&quot;@anthropic/chatgpt-transformer-mcp&quot;</span>,{"\n"}
                      {"        "}<span className="text-[#88E7BB]">&quot;--data-dir&quot;</span>,{"\n"}
                      {"        "}<span className="text-[#88E7BB]">&quot;/path/to/your/unzipped/files&quot;</span>{"\n"}
                      {"      "}]{"\n"}
                      {"    "}<span className="text-[#c8d8cf]">{"}"}</span>{"\n"}
                      {"  "}<span className="text-[#c8d8cf]">{"}"}</span>{"\n"}
                      <span className="text-[#c8d8cf]">{"}"}</span>
                    </code>
                  </pre>
                </div>
                <div className="mt-3 flex items-start gap-2 text-[13px] text-[#8BA898] leading-[1.5]">
                  <span className="text-[#e8b84d] flex-shrink-0 mt-0.5">&#9888;</span>
                  Replace <code className="bg-white/[0.08] px-1.5 py-0.5 rounded font-mono-pdt text-xs">/path/to/your/unzipped/files</code> with the folder containing both your scaffolding files and your <code className="bg-white/[0.08] px-1.5 py-0.5 rounded font-mono-pdt text-xs">conversations.json</code>.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-[40px_1fr] gap-5">
              <div className="w-9 h-9 rounded-full bg-[#2D4A3E] text-cream flex items-center justify-center text-[15px] font-semibold">4</div>
              <div>
                <h3 className="text-lg font-bold text-cream mb-2">Restart Claude Desktop</h3>
                <p className="text-[14px] text-[#8BA898] leading-[1.6]">Close and reopen Claude Desktop. You should see the chatgpt-transformer tools available in your tool list.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="grid grid-cols-[40px_1fr] gap-5">
              <div className="w-9 h-9 rounded-full bg-[#2D4A3E] text-cream flex items-center justify-center text-[15px] font-semibold">5</div>
              <div>
                <h3 className="text-lg font-bold text-cream mb-2">Try it out</h3>
                <p className="text-[14px] text-[#8BA898] leading-[1.6] mb-4">Start a new conversation and ask Claude something about your past:</p>
                <div className="space-y-2">
                  {[
                    "What do you know about my ChatGPT history?",
                    "Search my past conversations for [any topic you care about]",
                    "Give me an overview of my data \u2014 how many conversations, what date range?",
                  ].map((prompt) => (
                    <div key={prompt} className="flex items-center gap-2.5 py-3 px-4 bg-white/[0.05] border border-[rgba(200,216,207,0.08)] rounded-lg font-mono-pdt text-[13px] text-[#c8d8cf]">
                      <span className="text-[#8BA898] text-xs flex-shrink-0">&rsaquo;</span>
                      &ldquo;{prompt}&rdquo;
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
          ═══════════════════════════════════════ */}
      <section className="py-[72px] px-6">
        <div className="max-w-[780px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">Troubleshooting</div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-8">Common questions</h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-[var(--card-border)] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-[18px] px-6 text-left hover:bg-green-light/20 transition-colors"
                  >
                    <span className="text-[15px] font-semibold text-[var(--text-primary)] pr-4">&ldquo;{item.q}&rdquo;</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] text-[#8BA898] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px]" : "max-h-0"}`}>
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BOTTOM CTA
          ═══════════════════════════════════════ */}
      <section className="bg-[#1a2f26] text-center py-[72px] px-6 border-t-[3px] border-t-green-accent">
        <div className="max-w-[520px] mx-auto">
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-cream mb-3.5">Ready to bring your history with you?</h2>
          <p className="text-[15px] text-[#8BA898] leading-[1.7] max-w-[520px] mx-auto mb-8">
            Download the scaffolding, point MCP at your ChatGPT export, and you&apos;re connected in minutes. We never see your data &mdash; everything runs on your machine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" className="inline-flex items-center gap-2 bg-pdt-dark text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline border border-[#8BA898]/20 transition-all hover:bg-green-mid hover:-translate-y-px hover:shadow-lg">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download scaffolding
            </a>
            <Link href="/" className="inline-flex items-center gap-2 bg-transparent text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline border border-[var(--card-border)] transition-all hover:bg-white/[0.06]">
              About the Developers
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 flex flex-col md:flex-row justify-between items-center border-t border-[var(--card-border)] gap-4">
        <Link href="/" className="font-bold text-base text-pdt-dark no-underline">
          chatgpt<span className="text-[#8BA898] font-normal">.pdt</span>
        </Link>
        <ul className="flex gap-6 list-none">
          <li><a href="#how" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">How it works</a></li>
          <li><a href="#privacy" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">Privacy</a></li>
          <li><a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">GitHub</a></li>
          <li><Link href="/#about" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">CIB</Link></li>
        </ul>
        <div className="font-mono-pdt text-[11px] text-[var(--text-muted)]">&copy; 2025 Citizen Infrastructure &middot; Your Data, Always</div>
      </footer>

      </main>
    </>
  );
}
