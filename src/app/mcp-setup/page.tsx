"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { SubNav } from "@/components/SubNav";

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
      "Once you\u2019ve found a relevant conversation, you can pull up the full thread \u2014 every message, every response, the complete back-and-forth. Useful for revisiting complex reasoning or picking up where you left off.",
    prompts: [
      "Pull up the full conversation from that pricing discussion",
      "Show me the complete thread where I was debugging that API issue",
      "I want to continue the brainstorm I was having about my book outline \u2014 find it and show me where I left off",
    ],
  },
  {
    name: "list_conversations",
    label: "Browse and filter all your conversations",
    description:
      "Get a bird\u2019s-eye view of your entire ChatGPT history. Filter by date, topic, or browse to rediscover conversations you forgot about. Useful for auditing what you\u2019ve worked on or finding patterns in how you use AI.",
    prompts: [
      "List all my conversations from last March",
      "How many conversations have I had about my startup idea?",
      "Show me a summary of what I was working on in Q3 2024",
      "What topics do I keep coming back to?",
    ],
  },
  {
    name: "get_evidence_by_id",
    label: "Fetch a specific evidence row",
    description:
      "Retrieve a specific piece of evidence by its ID. Useful for citing or re-examining a particular data point Claude surfaced in a previous search.",
    prompts: [
      "Get me the details on evidence ev_00042",
      "Pull up that specific quote you referenced earlier",
    ],
  },
  {
    name: "get_stats",
    label: "Overview of your data \u2014 totals, date range, role counts",
    description:
      "A quick dashboard of your ChatGPT history: how many conversations, what date range they cover, the breakdown of how you\u2019ve used AI. Useful for understanding the scope of what Claude has access to.",
    prompts: [
      "Give me an overview of my ChatGPT data",
      "How many conversations do you have access to from my history?",
      "What\u2019s the date range of my data?",
    ],
  },
  {
    name: "search_by_date",
    label: "Filter messages by date range",
    description:
      "Search within a specific time window. Useful for finding conversations tied to a project phase, a life event, or a period you want to revisit.",
    prompts: [
      "What was I working on between June and August 2024?",
      "Find conversations from the week I was preparing for my presentation",
      "Show me everything from January 2025 \u2014 I was making some big decisions that month",
      "What did I ask about during the holidays last year?",
    ],
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
    a: "Make sure you edited the right config file and restarted Claude Desktop completely (not just opened a new chat). On Mac, fully quit the app (Cmd+Q). On Windows, close the window and check that it\u2019s not running in the system tray.",
  },
  {
    q: "I get a path error",
    a: 'Double-check the path to your unzipped files. Use the full absolute path, not a relative one. On Windows, use forward slashes or double backslashes (e.g., C:/Users/You/Documents/pdt-files).',
  },
  {
    q: "It\u2019s slow to start",
    a: "First load can take a moment if you have thousands of conversations. Subsequent queries are faster as the index is cached in memory.",
  },
  {
    q: "I have an existing MCP setup",
    a: "The config supports multiple MCP servers. Add chatgpt-transformer alongside your existing entries. PDT\u2019s download already handles this if it detects an existing config.",
  },
];

/* ═══════════════════════════════════════════
   Page component
   ═══════════════════════════════════════════ */
export default function McpSetupPage() {
  const [openTool, setOpenTool] = useState<string | null>("search_evidence");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            Your data, working for you
          </div>
          <h1 className="font-serif-pdt text-4xl md:text-[48px] leading-tight text-[var(--text-primary)] mb-6">
            Your past thinking shouldn&apos;t disappear when you switch tools.
          </h1>
          <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-[600px] mx-auto mb-8">
            When you connect your ChatGPT history to Claude through MCP, every conversation you&apos;ve ever had becomes searchable, citable context. Claude doesn&apos;t just know what you asked &mdash; it knows how you think.
          </p>
          <a
            href="#setup"
            className="inline-flex items-center gap-2 bg-pdt-dark text-white py-3.5 px-8 rounded-lg text-sm font-semibold no-underline hover:bg-green-mid transition-colors"
          >
            Get set up &rarr;
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. BEFORE / AFTER
          ═══════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          What changes
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-10 leading-tight">
          Before and after you connect.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WITHOUT */}
          <div className="border border-[var(--border)] rounded-xl p-8 bg-white">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">&#x2718;</div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Without your data</span>
            </div>
            <ul className="space-y-4">
              {[
                "Claude starts from zero every conversation",
                "You re-explain your projects, your context, your preferences",
                "Past thinking is locked inside a platform you\u2019re leaving",
                "You lose years of intellectual work",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">&mdash;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* WITH */}
          <div className="border-2 border-green-accent/40 rounded-xl p-8 bg-green-light/30">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-green-badge flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pdt-dark">With your MCP connected</span>
            </div>
            <ul className="space-y-4">
              {[
                "Claude can search years of your thinking in real time",
                "Reference specific past conversations by topic or date",
                "Build on ideas you explored months ago",
                "Your context travels with you \u2014 not trapped in one product",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[14px] text-[var(--text-primary)] leading-relaxed">
                  <span className="text-green-accent flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. TOOL CARDS — Accordion
          ═══════════════════════════════════════ */}
      <section className="bg-cream py-20">
        <div className="max-w-[960px] mx-auto px-6 md:px-8">
          <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
            What you can actually do
          </div>
          <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-3 leading-tight">
            Six tools. Thousands of possibilities.
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] max-w-[640px] leading-relaxed mb-10">
            Your MCP gives Claude six tools to work with your ChatGPT history. Here&apos;s what that looks like in practice.
          </p>

          <div className="space-y-3">
            {MCP_TOOLS.map((tool) => {
              const isOpen = openTool === tool.name;
              return (
                <div key={tool.name} className="border border-[var(--card-border)] rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenTool(isOpen ? null : tool.name)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-green-light/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <code className="font-mono-pdt text-[12px] bg-pdt-dark text-white px-2.5 py-1 rounded flex-shrink-0">
                        {tool.name}
                      </code>
                      <span className="text-[14px] text-[var(--text-secondary)] truncate hidden sm:inline">
                        {tool.label}
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px]" : "max-h-0"}`}>
                    <div className="px-5 md:px-6 pb-6 pt-0">
                      {/* Label (visible on mobile where it's hidden in header) */}
                      <p className="text-[14px] font-medium text-[var(--text-primary)] mb-2 sm:hidden">
                        {tool.label}
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-5">
                        {tool.description}
                      </p>
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-green-accent mb-3">
                        Try asking Claude
                      </div>
                      <div className="space-y-2">
                        {tool.prompts.map((prompt) => (
                          <div
                            key={prompt}
                            className="flex items-start gap-2.5 bg-green-light/50 border border-green-badge rounded-lg py-2.5 px-4"
                          >
                            <span className="text-green-accent text-xs mt-0.5 flex-shrink-0">&gt;</span>
                            <span className="font-mono-pdt text-[12px] text-pdt-dark leading-relaxed">
                              &ldquo;{prompt}&rdquo;
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. REAL WORKFLOWS — Stories
          ═══════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          How people actually use this
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-10 leading-tight">
          Real workflows, compound value.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORKFLOW_STORIES.map((story) => (
            <div key={story.title} className="bg-cream rounded-xl p-7 md:p-8 border-l-4 border-l-green-accent">
              <h3 className="font-serif-pdt text-xl font-normal text-[var(--text-primary)] mb-3">
                {story.title}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed italic">
                {story.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. SETUP STEPS
          ═══════════════════════════════════════ */}
      <section id="setup" className="bg-pdt-dark py-20">
        <div className="max-w-[960px] mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <div className="uppercase tracking-widest text-[11px] font-semibold text-green-accent mb-3">
              Setup
            </div>
            <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-white mb-3 leading-tight">
              Get set up in 15 minutes
            </h2>
            <p className="text-[15px] text-white/60 max-w-[520px] mx-auto leading-relaxed">
              You&apos;ll need Claude Desktop (the app, not the website). If you don&apos;t have it yet,{" "}
              <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer" className="text-white/90 underline hover:text-white transition-colors">
                download it here
              </a>.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-green-accent text-white flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-[17px] font-bold text-white mb-2">Download your files</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  After uploading your ChatGPT export to PDT, you&apos;ll download a zip file containing your transformed data. Unzip it somewhere you&apos;ll remember (like your Documents folder).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-green-accent text-white flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-[17px] font-bold text-white mb-2">Find your Claude Desktop config</h3>
                <p className="text-[14px] text-white/60 leading-relaxed mb-3">
                  Claude Desktop uses a configuration file to know which MCP servers to connect to.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg py-3 px-4">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-1">Mac</div>
                    <code className="font-mono-pdt text-[12px] text-white/80 break-all">
                      ~/Library/Application Support/Claude/claude_desktop_config.json
                    </code>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg py-3 px-4">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-1">Windows</div>
                    <code className="font-mono-pdt text-[12px] text-white/80 break-all">
                      %APPDATA%\Claude\claude_desktop_config.json
                    </code>
                  </div>
                </div>
                <p className="text-[13px] text-white/40 mt-3">
                  If the file doesn&apos;t exist yet, create it.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-green-accent text-white flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-[17px] font-bold text-white mb-2">Add the chatgpt-transformer entry</h3>
                <p className="text-[14px] text-white/60 leading-relaxed mb-4">
                  Open the config file in any text editor and add the chatgpt-transformer server. Your downloaded files include a ready-to-paste config snippet &mdash; just copy it in.
                </p>
                {/* Code block */}
                <div className="bg-[#0d1f16] border border-white/10 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                    <span className="font-mono-pdt text-[11px] text-white/40">claude_desktop_config.json</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          JSON.stringify(
                            {
                              mcpServers: {
                                "chatgpt-transformer": {
                                  command: "npx",
                                  args: [
                                    "-y",
                                    "@anthropic/chatgpt-transformer-mcp",
                                    "--data-dir",
                                    "/path/to/your/unzipped/files",
                                  ],
                                },
                              },
                            },
                            null,
                            2
                          )
                        );
                      }}
                      className="text-[11px] text-white/40 hover:text-white/80 transition-colors font-mono-pdt"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[13px] font-mono-pdt leading-relaxed">
                    <code className="text-green-300/90">
{`{
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
}`}
                    </code>
                  </pre>
                </div>
                <p className="text-[13px] text-white/40 mt-3 flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">&#9888;</span>
                  Replace <code className="font-mono-pdt text-white/60">/path/to/your/unzipped/files</code> with the actual path where you unzipped your PDT download.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-green-accent text-white flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-[17px] font-bold text-white mb-2">Restart Claude Desktop</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  Close and reopen Claude Desktop. You should see the chatgpt-transformer tools available in your tool list.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-10 h-10 rounded-full bg-green-accent text-white flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                5
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-[17px] font-bold text-white mb-2">Try it out</h3>
                <p className="text-[14px] text-white/60 leading-relaxed mb-4">
                  Start a new conversation and ask Claude something about your past:
                </p>
                <div className="space-y-2">
                  {[
                    "What do you know about my ChatGPT history?",
                    "Search my past conversations for [any topic you care about]",
                    "Give me an overview of my data \u2014 how many conversations, what date range?",
                  ].map((prompt) => (
                    <div
                      key={prompt}
                      className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-lg py-2.5 px-4"
                    >
                      <span className="text-green-accent text-xs mt-0.5 flex-shrink-0">&gt;</span>
                      <span className="font-mono-pdt text-[12px] text-white/70 leading-relaxed">
                        &ldquo;{prompt}&rdquo;
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. TROUBLESHOOTING — Accordion
          ═══════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          Troubleshooting
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-8 leading-tight">
          Common questions
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border border-[var(--card-border)] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-green-light/20 transition-colors"
                >
                  <span className="text-[15px] font-semibold text-[var(--text-primary)] pr-4">
                    &ldquo;{item.q}&rdquo;
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px]" : "max-h-0"}`}>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. BOTTOM CTA
          ═══════════════════════════════════════ */}
      <section className="bg-cream text-center px-6 py-16 md:py-20">
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-4 leading-tight">
          Ready to bring your history with you?
        </h2>
        <p className="text-[15px] text-[var(--text-secondary)] max-w-[480px] mx-auto leading-relaxed mb-8">
          Upload your ChatGPT export and get your MCP files in minutes. Everything runs in your browser.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#upload"
            className="inline-flex items-center gap-2 bg-pdt-dark text-white py-3.5 px-8 rounded-lg text-sm font-semibold no-underline hover:bg-green-mid transition-colors"
          >
            Upload your data &rarr;
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-pdt-dark text-pdt-dark bg-transparent py-3 px-8 rounded-lg text-sm font-semibold no-underline hover:bg-pdt-dark hover:text-white transition-colors"
          >
            Back to PDT
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
