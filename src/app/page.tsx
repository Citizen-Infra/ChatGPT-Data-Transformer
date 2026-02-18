import { Nav } from "@/components/Nav";
import { SubNav } from "@/components/SubNav";
import { UploadSection } from "@/components/UploadSection";

export default function Home() {
  return (
    <>
      <Nav variant="landing" />
      <SubNav />
      <main className="min-h-screen bg-white">

      {/* Hero — cream bg, headline + upload in hero */}
      <section className="bg-cream text-center px-6 py-16 md:py-20">
        <h1 className="font-serif-pdt text-4xl md:text-[44px] leading-tight text-[var(--text-primary)] mb-8">
          <span className="block">Switching to Claude?</span>
          <span className="block text-green-mid">Take your ChatGPT data with you!</span>
        </h1>
        <div className="max-w-[480px] mx-auto">
          <UploadSection variant="hero" />
          <p className="text-xs text-[var(--text-muted)] mt-4">
            From your ChatGPT data export &middot; JSON file only &middot;{" "}
            <a href="#privacy" className="text-[var(--text-muted)] underline hover:text-pdt-dark transition-colors">
              see how it works &rarr;
            </a>
          </p>
          <div className="inline-block mt-3 bg-green-badge text-pdt-dark py-2 px-5 rounded-full text-[13px] font-medium">
            No account. No storage. No servers. Everything runs in your browser.
          </div>
        </div>
      </section>

      {/* What you'll walk away with — Three things */}
      <section id="how" className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          What you&apos;ll walk away with
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-4 leading-tight">
          Data sovereignty starts with data portability.
        </h2>
        <p className="text-[15px] text-[var(--text-secondary)] max-w-[640px] leading-relaxed mb-10">
          Your ChatGPT history isn&apos;t just chat logs. It&apos;s a record of your ideas, projects, and how your mind works. PDT transforms it into something you can carry, share, and build on — in any AI tool, forever. Your data. Your rules.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — MCP Files for Claude (most important) */}
          <div className="border border-[var(--card-border)] rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-pdt-dark text-white">Power Users</span>
            </div>
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-2">MCP Files for Claude</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
              A structured zip that lets Claude search and cite your ChatGPT history in real time. Brings your past thinking into every future conversation. Your files stay on your device, structured using our transformer schema &mdash; Claude reads them when you ask a question.
            </p>
            <a href="/mcp-setup" className="text-[13px] font-semibold text-pdt-dark no-underline hover:underline">
              Learn how MCP works &rarr;
            </a>
          </div>
          {/* Card 2 — Networking Card */}
          <div className="border border-[var(--card-border)] rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-pdt-dark text-white">START HERE</span>
            </div>
            <div className="text-3xl mb-4">🪪</div>
            <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-2">Networking Card</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
              A phone-ready PNG showing your top projects, interests, and thinking style. We believe technology should help us relate better to ourselves, each other, and the world. Generate yours and share it at your next local event to find collaborators and friends more quickly.
            </p>
            <a href="/networking-card" className="text-[13px] font-semibold text-pdt-dark no-underline hover:underline">
              Learn more &rarr;
            </a>
          </div>
          {/* Card 3 — Caricature (coming soon) */}
          <div className="border border-[var(--card-border)] rounded-xl p-6 opacity-75">
            <div className="flex gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded bg-gray-200 text-[var(--text-muted)]">Coming Soon</span>
            </div>
            <div className="text-3xl mb-4 grayscale-[30%]">🎭</div>
            <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-2">Caricature</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">
              An illustrated portrait of how you think — not how you look. Generated from your worldview lenses and project patterns. Strange, accurate, shareable.
            </p>
            <span className="text-[12px] text-[var(--text-muted)] italic">Available soon</span>
          </div>
        </div>
      </section>

      {/* Steps — 4 steps with line */}
      <section className="max-w-[960px] mx-auto px-6 md:px-8 py-20 border-t border-[var(--border)]">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">
          Before you upload
        </div>
        <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] mb-3 leading-tight">
          First, download your data from ChatGPT
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-10 leading-relaxed">
          It can take up to 24 hours for ChatGPT to prepare your export. We&apos;ll be here when you&apos;re ready.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-pdt-dark text-white flex items-center justify-center text-[15px] font-bold mb-4">1</div>
            <h4 className="text-[15px] font-bold mb-2">Open ChatGPT Settings</h4>
            <p className="text-[13px] text-[var(--text-secondary)] mb-2 leading-relaxed">Go to chatgpt.com → click your avatar → Settings.</p>
            <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-[13px] text-pdt-dark font-semibold no-underline hover:underline">Open ChatGPT ↗</a>
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-pdt-dark text-white flex items-center justify-center text-[15px] font-bold mb-4">2</div>
            <h4 className="text-[15px] font-bold mb-2">Find Data Controls</h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Navigate to Data Controls → Export data → Confirm Export.</p>
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-pdt-dark text-white flex items-center justify-center text-[15px] font-bold mb-4">3</div>
            <h4 className="text-[15px] font-bold mb-2">Check Your Email</h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">ChatGPT emails you a download link. May take up to 24 hrs.</p>
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-pdt-dark text-white flex items-center justify-center text-[15px] font-bold mb-4">4</div>
            <h4 className="text-[15px] font-bold mb-2">Find conversations.json</h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              Unzip the downloaded file. Look for <code className="font-mono-pdt text-xs bg-green-light text-pdt-dark px-1.5 py-0.5 rounded">conversations.json</code>
            </p>
          </div>
        </div>
      </section>

      {/* Upload section — 2 col: features + dropzone */}
      <section id="upload" className="max-w-[960px] mx-auto px-6 md:px-8 py-20 border-t border-[var(--border)]">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">Upload</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] leading-tight mb-4">
              Drop your file.<br />We do the rest.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              Everything runs in your browser. Your data never touches our servers.
            </p>
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded flex items-center justify-center text-base flex-shrink-0">🔥</div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Processed entirely in your browser</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">No upload, no transmission. We use your device&apos;s own compute to do the transformation.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded flex items-center justify-center text-base flex-shrink-0">🛡️</div>
                <div>
                  <h4 className="text-sm font-bold mb-1">We have no database</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">There is nothing to breach. Closing this tab deletes everything — nothing persists.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded flex items-center justify-center text-base flex-shrink-0">📁</div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Files live only on your device</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">The outputs you download belong to you. We can&apos;t access them after you leave.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded flex items-center justify-center text-base flex-shrink-0">🔗</div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Connect Claude to your history</h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Use MCP to give Claude direct access to your past conversations &mdash; searchable and citable. Your files stay on your device; Claude reads them when you ask a question.</p>
                  <a href="/mcp-setup" className="text-[13px] font-semibold text-pdt-dark no-underline hover:underline mt-1 inline-block">
                    Learn more about MCP &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-cream border-2 border-dashed border-[var(--card-border)] rounded-xl p-10 md:p-12 flex flex-col items-center">
              <UploadSection variant="dropzone" />
              <p className="text-[11px] text-[var(--text-muted)] mt-5 text-center">Large files (150k+ words) may take 30–60 seconds. Keep this tab open.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MCP banner */}
      <section className="bg-pdt-dark text-center py-16 px-6 md:px-8">
        <h2 className="font-serif-pdt text-3xl font-normal text-white mb-3">
          Connect your data to Claude
        </h2>
        <p className="text-sm text-white/70 max-w-[520px] mx-auto mb-7 leading-relaxed">
          When you upload your history, we transform it into files you can plug into Claude using MCP — a way for AI tools to access your personal data locally, on your terms.
        </p>
        <a
          href="/mcp-setup"
          className="inline-flex items-center gap-2 border border-white/40 text-white py-3 px-7 rounded-lg text-sm font-semibold no-underline hover:bg-white/10 transition-colors"
        >
          Setup Guide &rarr;
        </a>
      </section>

      {/* Privacy — 2 col: features + diagram */}
      <section id="privacy" className="max-w-[960px] mx-auto px-6 md:px-8 py-20">
        <div className="uppercase tracking-widest text-[11px] font-semibold text-[var(--text-muted)] mb-3">How privacy works here</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-serif-pdt text-3xl md:text-4xl font-normal text-[var(--text-primary)] leading-tight mb-8">
              Built for you to own your data, not for us to see it.
            </h2>
            <div className="space-y-6">
              {[
                { title: "Client-side JavaScript only", desc: "Your file is processed entirely in your browser using your device\u2019s compute. Nothing is uploaded anywhere." },
                { title: "No database, nothing to breach", desc: "We don\u2019t store anything. There\u2019s no account system. Closing this tab destroys all processed data permanently." },
                { title: "AI features are opt-in only", desc: "PDT transforms your data entirely in your browser \u2014 we never see it. If you choose to connect your files to Claude through MCP, Claude processes your queries using Anthropic\u2019s standard privacy practices. You can also use our API to generate artifacts like networking cards \u2014 only your lenses and project types are shared, never raw conversations." },
                { title: "Privacy-preserving analytics only", desc: "We use Plausible (not Google Analytics) for simple page-view counts. No behavioral tracking, no fingerprinting." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-pdt-dark"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-cream border border-[var(--border)] rounded-xl p-8">
            <div className="font-mono-pdt text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-5">// Data Flow Diagram</div>
            <div className="space-y-4">
              <div className="bg-white border border-[var(--border)] rounded-lg py-3 px-4 border-l-4 border-l-orange-400">
                <div className="font-semibold text-xs">📄 Your conversations.json</div>
                <div className="text-[11px] text-[var(--text-secondary)]">Lives on your device</div>
              </div>
              <div className="text-center text-[var(--text-muted)] text-sm">↓</div>
              <div className="bg-white border border-[var(--border)] rounded-lg py-3 px-4 border-l-4 border-l-blue-400">
                <div className="font-semibold text-xs">🌐 Browser (your device)</div>
                <div className="text-[11px] text-[var(--text-secondary)]">JavaScript parser + transformer</div>
              </div>
              <div className="text-center text-[var(--text-muted)] text-sm">↓</div>
              <div className="bg-white border border-[var(--border)] rounded-lg py-3 px-4 border-l-4 border-l-green-accent">
                <div className="font-semibold text-xs">📦 Outputs (Download)</div>
                <div className="text-[11px] text-[var(--text-secondary)]">MCP Files · Networking Card</div>
              </div>
              <div className="text-center text-[var(--text-muted)] text-sm">↓</div>
              <div className="bg-white border border-[var(--border)] rounded-lg py-3 px-4">
                <div className="font-semibold text-xs">🔒 AI features (opt-in only)</div>
                <div className="text-[11px] text-[var(--text-secondary)]">Sends lenses &amp; project types only — never raw conversations. You can always use your local MCP instead.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CIBC — Citizen Infrastructure Builders Club
          ═══════════════════════════════════════════════════════════ */}
      <section id="cibc" className="max-w-[960px] mx-auto px-6 md:px-8 py-20 border-t border-[var(--border)]">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-3">Who We Are</div>
        <h2 className="font-serif-pdt text-3xl md:text-[2.25rem] font-normal text-[var(--text-primary)] leading-tight mb-8">
          Citizen Infrastructure Builders
        </h2>

        {/* Buckminster Fuller quote */}
        <blockquote className="border-l-4 border-green-accent pl-6 py-2 mb-10">
          <p className="font-serif-pdt text-lg md:text-xl italic text-[var(--text-primary)] leading-relaxed mb-2">
            &ldquo;If you want to teach people a new way of thinking, don&apos;t bother trying to teach them. Instead, give them a tool, the use of which will lead to new ways of thinking.&rdquo;
          </p>
          <cite className="text-[13px] text-[var(--text-muted)] not-italic">&mdash; Buckminster Fuller</cite>
        </blockquote>

        {/* Body copy */}
        <div className="max-w-[680px] space-y-4 mb-10">
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
            We build digital pitchforks &mdash; citizen infrastructure that teaches collective action, solidarity, and shared stewardship through use. Not apps or platforms in the traditional sense, but tools crafted to reshape how people relate to each other and to their communities.
          </p>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
            In an age of techno-feudalism, where digital platforms have replaced markets with fiefdoms and users have become digital serfs, the antidote is not better regulation of feudal tools &mdash; it&apos;s building tools that nurture citizen empowerment and the people&apos;s capacity to act together.
          </p>
        </div>

        {/* Principles — badges/tags */}
        <div className="mb-10">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-3">Principles</div>
          <div className="flex flex-wrap gap-2">
            {[
              "Pedagogical by design",
              "Ownership-enabling",
              "Solidarity-building",
              "Sovereignty-preserving",
              "Interoperable",
              "Antifragile",
            ].map((p) => (
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
                {[
                  { name: "my-community", desc: "Community dashboard Chrome extension \u2014 Bluesky feed, curated digest, participation opportunities" },
                  { name: "dear-neighbors", desc: "Neighborhood dashboard Chrome extension \u2014 community-curated local news + participation opportunities" },
                  { name: "nsrt", desc: "Novi Sad Relational Tech \u2014 neighborhood tools for Novi Sad residents" },
                ].map((proj) => (
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
          Join us on GitHub &rarr;
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 px-6 md:px-8">
        <div className="max-w-[960px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono-pdt font-bold text-[15px] text-pdt-dark">chatgpt.pdt</div>
          <div className="flex gap-6">
            <a href="#how" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">How it works</a>
            <a href="#privacy" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">Privacy</a>
            <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">GitHub</a>
            <a href="https://citizeninfra.org" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">CIBC</a>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">© 2025 Citizen Infrastructure · Your Data, Always</div>
        </div>
      </footer>
      </main>
    </>
  );
}
