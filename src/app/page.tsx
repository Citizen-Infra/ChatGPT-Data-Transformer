import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav variant="landing" />
      <main className="min-h-screen bg-white">

      {/* ─── HERO ─── */}
      <section className="pt-[100px] pb-[72px] px-6 text-center max-w-[780px] mx-auto">
        <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-cream border border-[var(--card-border)] rounded-full font-mono-pdt text-[10px] font-medium tracking-wider uppercase text-[var(--text-muted)] mb-8 animate-fadeUp">
          <span className="w-1.5 h-1.5 bg-[#6DBF73] rounded-full" />
          Your data never leaves your machine
        </div>

        <h1 className="font-sans text-[36px] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)] mb-3.5 animate-fadeUp animation-delay-100">
          Your ChatGPT history is{" "}
          <em className="font-serif-pdt font-normal italic text-green-mid">worth keeping.</em>
        </h1>

        <p className="text-[15px] text-[var(--text-secondary)] max-w-[520px] mx-auto mb-8 leading-relaxed animate-fadeUp animation-delay-200">
          You&apos;ve had hundreds of conversations &mdash; ideas, projects, decisions, and how your mind works. We&apos;ll give you the scaffolding to make all of it portable, searchable, and useful in Claude.
        </p>

        <a href="#how" className="inline-flex items-center gap-2 bg-pdt-dark text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline transition-all hover:bg-green-mid hover:-translate-y-px hover:shadow-lg animate-fadeUp animation-delay-300">
          See how it works
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-muted)] animate-fadeUp animation-delay-400">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Your data stays on your machine. We give you the structure &mdash; MCP fills it in.
        </div>
      </section>

      {/* ─── WHY THIS MATTERS ─── */}
      <section className="bg-cream border-t border-b border-[var(--card-border)] py-[72px] px-6" id="how">
        <div className="max-w-[780px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
          <div>
            <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              Why this matters
            </div>
            <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-3.5">
              Your ChatGPT history isn&apos;t just chat logs.
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[560px]">
              It&apos;s a record of your ideas, your projects, and how your mind works. PDT gives you the scaffolding to make all of it portable and searchable &mdash; across any AI tool. Your data. Your machine. Your rules.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[var(--card-border)]">
            {[
              { icon: "💬", label: "Conversations", meta: "Ideas, research, decisions", color: "bg-green-light", barColor: "bg-green-accent", width: "85%" },
              { icon: "🧠", label: "Thinking patterns", meta: "How you approach problems", color: "bg-[#F5EBDA]", barColor: "bg-[#8BA898]", width: "65%" },
              { icon: "🔧", label: "Working knowledge", meta: "Tools, preferences, context", color: "bg-[#f0ebe8]", barColor: "bg-[#c8d8cf]", width: "72%" },
              { icon: "🤝", label: "Collaboration style", meta: "Your communication patterns", color: "bg-green-light", barColor: "bg-green-accent", width: "58%" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 py-3 border-b border-[var(--card-border)] last:border-b-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${row.color}`}>
                  {row.icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--text-primary)]">{row.label}</div>
                  <div className="font-mono-pdt text-[11px] text-[var(--text-muted)]">{row.meta}</div>
                </div>
                <div className="flex-1 h-1 bg-[#F5EBDA] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${row.barColor}`} style={{ width: row.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUTCOMES ─── */}
      <section className="py-[72px] px-6">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center mb-8">
            <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              What you&apos;ll build
            </div>
            <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-3.5">
              Scaffolding first. Then it all unlocks.
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[560px] mx-auto">
              Download the structure. Run MCP to fill it with your data. Then everything else becomes possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MCP Scaffolding Card */}
            <div className="bg-white border border-[var(--card-border)] rounded-2xl px-8 pt-9 pb-8 relative overflow-hidden transition-all hover:border-[#c8d8cf] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,74,62,0.08)] group">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-green-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="inline-block py-1 px-2.5 rounded-full font-mono-pdt text-[10px] font-semibold tracking-wider uppercase bg-pdt-dark text-cream mb-5">
                Start here
              </span>
              <h3 className="font-serif-pdt text-2xl font-normal text-[var(--text-primary)] mb-3.5 leading-[1.2]">
                MCP Scaffolding for Claude
              </h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-5">
                Download a pre-structured template folder. Point MCP at the scaffolding plus your ChatGPT export, and your conversations become searchable, citable context that Claude can actually read &mdash; right from your machine.
              </p>
              <a
                href="/mcp-setup"
                className="flex items-center justify-center gap-2 w-full bg-pdt-dark text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline transition-all hover:bg-green-mid hover:-translate-y-px hover:shadow-lg"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download scaffolding
              </a>
              <a href="/mcp-setup" className="inline-flex items-center gap-1 text-sm text-green-mid font-medium no-underline mt-3 transition-all hover:gap-2 hover:text-pdt-dark">
                Learn how MCP works &rarr;
              </a>
            </div>

            {/* Networking Card */}
            <div className="bg-white border border-[var(--card-border)] rounded-2xl px-8 pt-9 pb-8 relative overflow-hidden transition-all hover:border-[#c8d8cf] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,74,62,0.08)] group">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-green-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="inline-block py-1 px-2.5 rounded-full font-mono-pdt text-[10px] font-semibold tracking-wider uppercase bg-[#FFF8E6] text-[var(--text-primary)] border border-[#F0E0A8] mb-5">
                Unlocked by MCP
              </span>
              <h3 className="font-serif-pdt text-2xl font-normal text-[var(--text-primary)] mb-3.5 leading-[1.2]">
                Networking Card
              </h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-5">
                Once MCP has indexed your history, generate a shareable profile built from your real interests and thinking style. Better than a bio &mdash; it lets collaborators (and their AI tools) understand how you actually work.
              </p>
              <a href="/networking-card" className="inline-flex items-center gap-1 text-sm text-green-mid font-medium no-underline transition-all hover:gap-2 hover:text-pdt-dark">
                Learn more &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SETUP STEPS ─── */}
      <section id="setup" className="bg-[#1a2f26] text-cream py-[72px] px-6 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,191,115,0.06), transparent 70%)" }} />
        <div className="max-w-[780px] mx-auto text-center relative z-10">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[#8BA898] mb-3">
            Get started
          </div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-cream mb-3.5">
            Three steps to a<br />smarter Claude.
          </h2>
          <p className="text-[15px] text-[#8BA898] leading-relaxed max-w-[560px] mx-auto mb-12">
            Export your history, grab the scaffolding, and let MCP connect the dots.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="p-6 bg-white/[0.03] border border-[rgba(200,216,207,0.1)] rounded-xl">
              <div className="w-7 h-7 rounded-md bg-[#2D4A3E] text-cream inline-flex items-center justify-center text-[13px] font-semibold mb-3">1</div>
              <h4 className="text-[15px] font-semibold mb-2 text-cream">Export from ChatGPT</h4>
              <p className="text-[13px] text-[#8BA898] leading-snug">
                Go to{" "}
                <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-[#88E7BB] underline underline-offset-2">
                  Settings &rarr; Data Controls &rarr; Export
                </a>
                . You&apos;ll get an email with your{" "}
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded font-mono-pdt text-xs">conversations.json</code>{" "}
                file (may take up to 24 hrs).
              </p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-[rgba(200,216,207,0.1)] rounded-xl">
              <div className="w-7 h-7 rounded-md bg-[#2D4A3E] text-cream inline-flex items-center justify-center text-[13px] font-semibold mb-3">2</div>
              <h4 className="text-[15px] font-semibold mb-2 text-cream">Download the scaffolding</h4>
              <p className="text-[13px] text-[#8BA898] leading-snug">
                Grab the MCP scaffolding folder from our site &mdash; a pre-structured template that knows the shape of your data without ever reading the content.
              </p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-[rgba(200,216,207,0.1)] rounded-xl">
              <div className="w-7 h-7 rounded-md bg-[#2D4A3E] text-cream inline-flex items-center justify-center text-[13px] font-semibold mb-3">3</div>
              <h4 className="text-[15px] font-semibold mb-2 text-cream">Run MCP locally</h4>
              <p className="text-[13px] text-[#8BA898] leading-snug">
                Point MCP at your scaffolding and your original export. It fills in the structure on your machine &mdash; and Claude can now search your full history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRIVACY ─── */}
      <section id="privacy" className="py-[72px] px-6 border-b border-[var(--card-border)]">
        <div className="max-w-[780px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
          <div>
            <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              Your privacy, not ours
            </div>
            <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-6">
              Built for you to own your data, not for us to see it.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-green-light flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#2D4A3E" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">We never see your data</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-snug">You download generic scaffolding. MCP fills it in locally with your conversations. We never read, process, or touch your export &mdash; not even in the browser.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-green-light flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#2D4A3E" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4zM9 9h6v6H9z"/></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">We have no database</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-snug">There is nothing to breach. The site serves static scaffolding &mdash; no data processing happens here, not on a server, not in the browser.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-green-light flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#2D4A3E" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 00-2 2v16m0 0a2 2 0 002 2h12a2 2 0 002-2M13 2l7 7m-7-7v7h7m-7 4H8m8 4H8m2-8H8"/></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">MCP runs on your machine</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-snug">When MCP fills in the scaffolding, it reads your export locally. Your conversation content never leaves your device.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-green-light flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#2D4A3E" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">Claude reads, never stores</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-snug">Claude accesses your history through MCP at query time. Your files stay on your device &mdash; Claude references them, it doesn&apos;t copy them.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Flow Diagram */}
          <div className="bg-cream rounded-xl p-6 border border-[var(--card-border)]">
            <div className="font-mono-pdt text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--text-muted)] mb-5">
              How your data flows
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 py-2.5 px-3.5 bg-white rounded-[10px] border border-[var(--card-border)] text-[13px] text-[var(--text-primary)]">
                <span className="w-7 h-7 rounded-md bg-[#F5EBDA] flex items-center justify-center flex-shrink-0 text-[13px]">📄</span>
                Your conversations.json
              </div>
              <div className="text-center text-[#c8d8cf] text-base leading-none">↓</div>
              <div className="flex items-center gap-3 py-2.5 px-3.5 bg-white rounded-[10px] border border-[var(--card-border)] text-[13px] text-[var(--text-primary)]">
                <span className="w-7 h-7 rounded-md bg-green-light flex items-center justify-center flex-shrink-0 text-[13px]">📦</span>
                Scaffolding download &mdash; <em className="font-mono-pdt text-xs text-[var(--text-muted)] not-italic">generic, pre-built template</em>
              </div>
              <div className="text-center text-[#c8d8cf] text-base leading-none">↓</div>
              <div className="flex items-center gap-3 py-2.5 px-3.5 bg-white rounded-[10px] border border-[var(--card-border)] text-[13px] text-[var(--text-primary)]">
                <span className="w-7 h-7 rounded-md bg-[#F5EBDA] flex items-center justify-center flex-shrink-0 text-[13px]">🔧</span>
                MCP runs locally &mdash; <em className="font-mono-pdt text-xs text-[var(--text-muted)] not-italic">fills scaffolding with your data</em>
              </div>
              <div className="text-center text-[#c8d8cf] text-base leading-none">↓</div>
              <div className="flex items-center gap-3 py-2.5 px-3.5 bg-white rounded-[10px] border border-[var(--card-border)] text-[13px] text-[var(--text-primary)]">
                <span className="w-7 h-7 rounded-md bg-[rgba(45,74,62,0.1)] flex items-center justify-center flex-shrink-0 text-[13px]">🤖</span>
                Claude reads your history &mdash; <em className="font-mono-pdt text-xs text-[var(--text-muted)] not-italic">searchable, on your machine</em>
              </div>
            </div>
            <div className="mt-3 py-2.5 px-3.5 bg-[rgba(109,191,115,0.08)] rounded-lg text-xs text-green-accent flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              We never see your conversations. You download structure; MCP fills in content locally.
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONNECT ─── */}
      <section className="bg-cream border-t border-b border-[var(--card-border)] py-[72px] px-6 text-center">
        <div className="max-w-[600px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
            Make it permanent
          </div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-3.5">
            Connect your data to Claude
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[560px] mx-auto mb-8">
            Once you have your scaffolding, our setup guide walks you through running MCP locally so Claude can search your full ChatGPT history &mdash; on your terms, from your machine.
          </p>
          <a
            href="/mcp-setup"
            className="inline-flex items-center gap-2 bg-pdt-dark text-cream py-3 px-7 rounded-lg text-sm font-semibold no-underline transition-all hover:bg-green-mid hover:-translate-y-px"
          >
            Setup Guide
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* ─── CIBC ─── */}
      <section id="about" className="py-[72px] px-6">
        <div className="max-w-[780px] mx-auto">
          <div className="font-mono-pdt text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
            Who we are
          </div>
          <h2 className="font-sans text-[26px] font-bold leading-[1.3] text-[var(--text-primary)] mb-8">
            Citizen Infrastructure Builders
          </h2>

          <blockquote className="border-l-[3px] border-[#8BA898] pl-6 mb-2">
            <p className="font-serif-pdt text-xl font-normal italic text-[#4d4943] leading-snug">
              &ldquo;If you want to teach people a new way of thinking, don&apos;t bother trying to teach them. Instead, give them a tool, the use of which will lead to new ways of thinking.&rdquo;
            </p>
          </blockquote>
          <cite className="block font-mono-pdt text-[11px] text-[var(--text-muted)] not-italic mb-6">&mdash; Buckminster Fuller</cite>

          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[640px] mb-6">
            We build digital pitchforks &mdash; citizen infrastructure that teaches collective action, solidarity, and shared stewardship through use. Not apps or platforms in the traditional sense, but tools crafted to reshape how people relate to each other and to their communities.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {[
              "Philosophically by design",
              "Ownership-enabling",
              "Solidarity-building",
              "Sovereignty-preserving",
              "Interoperable",
              "Anti-fragile",
            ].map((p) => (
              <span key={p} className="py-1.5 px-3.5 bg-cream border border-[var(--card-border)] rounded-full font-mono-pdt text-[11px] text-[var(--text-secondary)]">
                {p}
              </span>
            ))}
          </div>

          {/* Projects Table */}
          <table className="w-full border-collapse mb-10">
            <thead>
              <tr>
                <th className="text-left font-mono-pdt text-[10px] tracking-[0.1em] uppercase text-[var(--text-muted)] py-3 border-b border-[var(--card-border)] font-medium">Project</th>
                <th className="text-left font-mono-pdt text-[10px] tracking-[0.1em] uppercase text-[var(--text-muted)] py-3 border-b border-[var(--card-border)] font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "my-community", desc: "Community dashboard Chrome extension — Bluesky feed, curated digest, participation opportunities" },
                { name: "dear-neighbors", desc: "Neighborhood dashboard Chrome extension — community-curated local news + participation opportunities" },
                { name: "nsrt", desc: "Novi Sad Relational Tech — neighborhood tools for Novi Sad residents" },
              ].map((proj) => (
                <tr key={proj.name}>
                  <td className="py-3 border-b border-[var(--card-border)] font-mono-pdt font-medium text-xs text-[var(--text-primary)]">{proj.name}</td>
                  <td className="py-3 border-b border-[var(--card-border)] text-[13px] text-[var(--text-secondary)] leading-snug">{proj.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
            {/* ChatGPT — active / focused */}
            <div className="border-2 border-green-accent rounded-xl p-6 bg-[#F2FAF5] shadow-[0_2px_12px_rgba(45,106,79,0.10)] relative">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-block py-0.5 px-2 rounded-full font-mono-pdt text-[10px] font-semibold tracking-wider uppercase bg-pdt-dark text-cream">ChatGPT</span>
                <span className="inline-block py-0.5 px-2 rounded-full font-mono-pdt text-[10px] font-semibold tracking-wider uppercase bg-green-accent text-white">You are here</span>
              </div>
              <h4 className="font-serif-pdt text-xl font-normal text-[var(--text-primary)] mb-2 leading-[1.2]">ChatGPT Data Transformer</h4>
              <p className="text-[13px] text-[var(--text-secondary)] leading-snug mb-4">Analyze your ChatGPT export &mdash; see your usage signature, topics, and conversation patterns. Same privacy-first approach, built for OpenAI&apos;s format.</p>
              <a href="#setup" className="text-sm text-green-mid font-semibold no-underline inline-flex items-center gap-1 transition-all hover:gap-2 hover:text-pdt-dark">Get started &rarr;</a>
            </div>
            {/* Claude — secondary */}
            <div className="border border-[var(--card-border)] rounded-xl p-6 bg-white transition-all hover:border-[#c8d8cf] hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-block py-0.5 px-2 rounded-full font-mono-pdt text-[10px] font-semibold tracking-wider uppercase bg-green-light text-pdt-dark">Claude</span>
              </div>
              <h4 className="font-serif-pdt text-xl font-normal text-[var(--text-primary)] mb-2 leading-[1.2]">Claude Data Transformer</h4>
              <p className="text-[13px] text-[var(--text-secondary)] leading-snug mb-4">Discover your Claude usage patterns and get matched with Skills that make your workflows more efficient.</p>
              <a href="https://claude-data-transformer.vercel.app" className="text-sm text-green-mid font-medium no-underline inline-flex items-center gap-1 transition-all hover:gap-2 hover:text-pdt-dark">Visit tool &rarr;</a>
            </div>
          </div>

          <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-pdt-dark text-cream py-3 px-6 rounded-lg text-sm font-semibold no-underline transition-all hover:bg-green-mid hover:-translate-y-px mt-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            Join us on GitHub
          </a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 px-6 flex flex-col md:flex-row justify-between items-center border-t border-[var(--card-border)] gap-4">
        <div className="font-bold text-base text-pdt-dark">
          chatgpt<span className="text-[#8BA898] font-normal">.pdt</span>
        </div>
        <ul className="flex gap-6 list-none">
          <li><a href="#how" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">How it works</a></li>
          <li><a href="#privacy" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">Privacy</a></li>
          <li><a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">GitHub</a></li>
          <li><a href="#about" className="font-mono-pdt text-[11px] text-[var(--text-muted)] no-underline hover:text-pdt-dark transition-colors">CIB</a></li>
        </ul>
        <div className="font-mono-pdt text-[11px] text-[var(--text-muted)]">&copy; 2025 Citizen Infrastructure &middot; Your Data, Always</div>
      </footer>

      </main>
    </>
  );
}
