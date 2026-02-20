import Link from "next/link";
import { Nav } from "@/components/Nav";

const LAYERS = [
  { num: 1, name: "Index", desc: "The entry point. Calibrates identity, communication style, and sensitive topics \u2014 before a single conversation is read.", path: "index.json" },
  { num: 2, name: "Conversations", desc: "Raw conversation logs with metadata attached \u2014 significance scores, emotional arc, linked entities. Chat history with context, not just text.", path: "conversations/" },
  { num: 3, name: "Insights", desc: "Distilled frameworks and learnings extracted across conversations. Each one traced back to the conversations that produced it.", path: "insights/" },
  { num: 4, name: "Entities", desc: "The nouns of a person\u2019s world \u2014 people, projects, concepts. Tracked with relationships and context so the AI knows what matters.", path: "entities/" },
  { num: 5, name: "Timeline", desc: "Chronological milestones. Allows an AI to understand trajectory \u2014 not just where someone is, but how they got there.", path: "timeline/" },
  { num: 6, name: "Themes", desc: "The thematic landscape \u2014 recurring subjects and questions across a conversation history, organized by topic rather than time.", path: "themes/" },
];

const TREE = [
  { branch: "\u251C\u2500\u2500", file: "index.json", icon: "\uD83D\uDCC4", desc: "The master index \u2014 AI reads this first" },
  { branch: "\u251C\u2500\u2500", file: "conversations/", icon: "\uD83D\uDCC1", desc: "Raw logs + metadata" },
  { branch: "\u251C\u2500\u2500", file: "insights/", icon: "\uD83D\uDCC1", desc: "Frameworks & learnings" },
  { branch: "\u251C\u2500\u2500", file: "entities/", icon: "\uD83D\uDCC1", desc: "People, projects & concepts" },
  { branch: "\u251C\u2500\u2500", file: "timeline/", icon: "\uD83D\uDCC1", desc: "Chronological evolution" },
  { branch: "\u2514\u2500\u2500", file: "themes/", icon: "\uD83D\uDCC1", desc: "Topic organization" },
];

export default function SchemaPage() {
  return (
    <>
      <Nav variant="landing" />

      {/* ═══ HERO ═══ */}
      <section
        className="text-center px-6 py-[100px] md:py-[100px] relative overflow-hidden"
        style={{ background: "#1A2E23" }}
      >
        {/* Subtle radial gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 600px 400px at 20% 80%, rgba(74,127,94,0.15), transparent), radial-gradient(ellipse 500px 300px at 80% 20%, rgba(74,127,94,0.1), transparent)",
          }}
        />
        <p className="relative text-[11px] font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: "#6B9E7E" }}>
          How the schema works
        </p>
        <h1 className="relative font-serif-pdt text-[clamp(36px,5vw,56px)] font-normal text-white leading-[1.1] mb-6">
          The anatomy of<br />the schema.
        </h1>
        <p className="relative text-[18px] leading-[1.7] max-w-[560px] mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          A ChatGPT export is raw text &mdash; thousands of conversations with no structure, no context, no portability. PDT transforms that into a six-layer schema readable by any AI and owned entirely by you.
        </p>
      </section>

      {/* ═══ DIRECTORY TREE ═══ */}
      <section className="max-w-[900px] mx-auto px-6 py-20">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#3D6B50" }}>File structure</p>
        <h2 className="font-serif-pdt text-[clamp(28px,4vw,40px)] font-normal text-[var(--text-primary)] leading-[1.15] mb-4">The file structure.</h2>
        <p className="text-[17px] leading-[1.7] text-[var(--text-secondary)] max-w-[640px] mb-12">
          A zip file containing a structured directory. Every file is plain text &mdash; JSON for the machine, Markdown for you. Open it in any text editor. No proprietary formats. No lock-in.
        </p>

        {/* Tree diagram */}
        <div className="bg-white border border-[var(--border)] rounded-2xl px-9 py-10 relative overflow-hidden font-mono-pdt text-[15px] leading-[2.4]">
          <span className="absolute top-4 right-5 font-sans text-[10px] font-semibold tracking-[0.12em] text-[var(--text-muted)] opacity-50">PDT SCHEMA</span>
          <div className="font-medium" style={{ color: "#3D6B50" }}>/pdt/</div>
          {TREE.map((item, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <span className="min-w-[36px] select-none" style={{ color: "#D8DDD9" }}>{item.branch}</span>
              <span className="font-medium text-[var(--text-primary)]">{item.icon} {item.file}</span>
              <span className="font-sans text-[13px] ml-auto pl-6 whitespace-nowrap hidden md:inline" style={{ color: "#6B7C72" }}>{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Analogy callout */}
        <div className="flex gap-4 items-start mt-12 rounded-xl px-8 py-7" style={{ background: "#FFF8E6", border: "1px solid #F0E0A8" }}>
          <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
          <p className="text-[15px] leading-[1.65] text-[var(--text-primary)]">
            <strong className="font-semibold">Think of it like onboarding a new assistant.</strong> You wouldn&apos;t hand someone a transcript of every phone call you&apos;ve ever made. You&apos;d give them a structured briefing packet &mdash; who you are, what you&apos;re working on, how you think. That&apos;s what this schema does for an AI.
          </p>
        </div>
      </section>

      {/* ═══ SIX LAYERS ═══ */}
      <section style={{ background: "#F5F3ED" }} className="px-6 py-20">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#3D6B50" }}>Six layers</p>
          <h2 className="font-serif-pdt text-[clamp(28px,4vw,40px)] font-normal text-[var(--text-primary)] leading-[1.15] mb-4">From noise to meaning.</h2>
          <p className="text-[17px] leading-[1.7] text-[var(--text-secondary)] max-w-[640px] mb-12">
            Each layer of the schema serves a different purpose. Together, they turn raw chat logs into something an AI can actually understand &mdash; without re-reading thousands of conversations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LAYERS.map((layer) => (
              <div
                key={layer.num}
                className="rounded-xl bg-white px-6 py-7 transition-all hover:-translate-y-0.5"
                style={{ border: "1px solid #D8DDD9" }}
              >
                <div className="font-serif-pdt text-[32px] leading-none mb-2" style={{ color: "#C1DACA" }}>{layer.num}</div>
                <div className="font-semibold text-[16px] text-[var(--text-primary)] mb-1.5">{layer.name}</div>
                <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{layer.desc}</p>
                <div className="font-mono-pdt text-[12px] mt-2.5 opacity-70" style={{ color: "#3D6B50" }}>{layer.path}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DUAL FORMAT ═══ */}
      <section className="max-w-[900px] mx-auto px-6 py-20">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#3D6B50" }}>Open standards</p>
        <h2 className="font-serif-pdt text-[clamp(28px,4vw,40px)] font-normal text-[var(--text-primary)] leading-[1.15] mb-4">Two formats. Zero lock-in.</h2>
        <p className="text-[17px] leading-[1.7] text-[var(--text-secondary)] max-w-[640px] mb-12">
          Every layer ships in two formats: JSON for the machine and Markdown for the human. Both are plain text. Both are open. Read the schema in any text editor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* JSON panel */}
          <div className="rounded-2xl px-7 py-8" style={{ background: "#243B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: "#6B9E7E" }}>For the AI</p>
            <h3 className="font-serif-pdt text-[22px] font-normal text-white mb-4">JSON</h3>
            <p className="text-[14px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
              Handles dates, IDs, relationships, confidence scores, and metadata. This is what the AI reads.
            </p>
            <pre className="font-mono-pdt text-[12px] leading-[1.8] rounded-[10px] p-5 overflow-x-auto" style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.75)" }}>
{`{
  "id": "insight_024",
  "type": "framework",
  "confidence": 0.95,
  "created_at": "2023-10-27",
  "related_entities": ["id_88", "id_92"]
}`}
            </pre>
          </div>

          {/* Markdown panel */}
          <div className="rounded-2xl px-7 py-8" style={{ background: "#F5F3ED", border: "1px solid #D8DDD9" }}>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: "#3D6B50" }}>For the human</p>
            <h3 className="font-serif-pdt text-[22px] font-normal text-[var(--text-primary)] mb-4">Markdown</h3>
            <p className="text-[14px] leading-relaxed text-[var(--text-secondary)] mb-5">
              Handles the &lsquo;why&rsquo; &mdash; summaries, descriptions, and nuanced explanations. This is what the human reads.
            </p>
            <pre className="font-mono-pdt text-[12px] leading-[1.8] rounded-[10px] p-5 overflow-x-auto bg-white text-[var(--text-primary)]" style={{ border: "1px solid #D8DDD9" }}>
{`## Integration Without Flattening

Summary: Collective understanding
requires preserving the legibility of
sources, not collapsing them into a
single voice.

Confidence: High · Source: 3 convos`}
            </pre>
          </div>
        </div>

        <p className="text-center mt-7 text-[15px] italic" style={{ color: "#6B7C72" }}>
          Both are plain text. Open standards. No proprietary formats.
        </p>
      </section>

      {/* ═══ SOVEREIGNTY ═══ */}
      <section className="px-6 py-20" style={{ background: "#1A2E23" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#6B9E7E" }}>Why it&apos;s built this way</p>
          <h2 className="font-serif-pdt text-[clamp(28px,4vw,40px)] font-normal text-white leading-[1.15] mb-4">Your thinking belongs to you.</h2>
          <p className="text-[17px] leading-[1.7] max-w-[640px] mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            Not to OpenAI. Not to Anthropic. Not to Google. The PDT schema is portable by design &mdash; structured so any AI can read it, owned so only the user decides who does.
          </p>

          {/* 3 principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { label: "Ownership", desc: "Files live on the user\u2019s device. PDT never stores, transmits, or sees any data." },
              { label: "Portability", desc: "Plain text, open formats. Take a conversation history to any tool, any AI, anytime." },
              { label: "Readability", desc: "Structured for machines, legible to humans. No proprietary translation needed." },
            ].map((p) => (
              <div key={p.label} className="text-center">
                <div className="w-6 h-px mx-auto mb-3" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="text-[13px] font-semibold tracking-[0.05em] text-white mb-1.5">{p.label}</div>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center py-16">
            <p className="text-[17px] mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>The schema is the hard part. PDT does it for you.</p>
            <Link
              href="/#upload"
              className="inline-flex items-center gap-2.5 rounded-full text-[15px] font-semibold no-underline transition-all hover:-translate-y-px"
              style={{ padding: "14px 32px", background: "#FFFFFF", color: "#1A2E23" }}
            >
              Get started
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 px-6 md:px-8">
        <div className="max-w-[960px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono-pdt font-bold text-[15px] text-pdt-dark">chatgpt.pdt</div>
          <div className="flex gap-6">
            <a href="/#how" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">How it works</a>
            <a href="/#privacy" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">Privacy</a>
            <a href="https://github.com/Citizen-Infra" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">GitHub</a>
            <a href="https://citizeninfra.org" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]">CIBC</a>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">&copy; 2025 Citizen Infrastructure &middot; Your Data, Always</div>
        </div>
      </footer>
    </>
  );
}
