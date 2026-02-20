"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Logo components ── */
function PdtLogo() {
  return (
    <div className="flex flex-col leading-none" aria-label="chatgpt.pdt — personal data transformer">
      <span className="text-[1.4rem] tracking-tight text-pdt-dark" style={{ fontWeight: 800, lineHeight: 1.2 }}>
        chatgpt<span style={{ color: "#2d5a3f" }}>.</span>pdt
      </span>
      <span className="text-[0.75rem] font-normal tracking-wide text-[var(--text-secondary)]" style={{ lineHeight: 1.2 }}>
        personal data transformer
      </span>
    </div>
  );
}

function PdtLogoCompact() {
  return (
    <span className="text-[0.95rem] tracking-tight text-[#FDF6EC] whitespace-nowrap" style={{ fontWeight: 800, lineHeight: 1 }}>
      chatgpt<span style={{ color: "#8BA898" }}>.</span>pdt
    </span>
  );
}

/* ── Section scroll nav arrays per page ── */
const LANDING_SECTIONS = [
  { id: "how", label: "How it works" },
  { id: "setup", label: "Get started" },
  { id: "privacy", label: "Privacy" },
  { id: "about", label: "About the builders" },
];

const MCP_SETUP_SECTIONS = [
  { id: "how", label: "How it works" },
  { id: "tools", label: "Tools" },
  { id: "setup", label: "Setup" },
  { id: "faq", label: "FAQ" },
];

const NETWORKING_CARD_SECTIONS = [
  { id: "whats-on-it", label: "What's on it" },
  { id: "why-it-matters", label: "Why it matters" },
  { id: "how-to-get", label: "How to get yours" },
  { id: "prompt", label: "The prompt" },
];

/* ── Page-level tabs ── */
const PAGE_TABS = [
  { href: "/", label: "About" },
  { href: "/mcp-setup", label: "MCP Setup" },
  { href: "/networking-card", label: "Networking Card" },
];

/* ── Scroll threshold ── */
const SCROLL_THRESHOLD = 80;

function getSectionsForPath(pathname: string) {
  if (pathname === "/mcp-setup") return MCP_SETUP_SECTIONS;
  if (pathname === "/networking-card") return NETWORKING_CARD_SECTIONS;
  if (pathname === "/") return LANDING_SECTIONS;
  return [];
}

/* ══════════════════════════════════════════════
   Nav component
   ══════════════════════════════════════════════ */
export function Nav({ variant = "landing" }: { variant?: "landing" | "results" }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [forceShowPrimary, setForceShowPrimary] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const forceShowScrollY = useRef(0);

  const sections = getSectionsForPath(pathname);
  const showSubNav = sections.length > 0;

  /* Close menu when clicking outside */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  /* Close menu on path change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Track scroll position for compact header + section highlighting */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > SCROLL_THRESHOLD);

      /* If user scrolls 100px+ down from where they opened the menu, collapse it */
      if (forceShowPrimary && currentY - forceShowScrollY.current > 100) {
        setForceShowPrimary(false);
      }

      /* Section highlighting */
      if (sections.length === 0) {
        setActiveSection("");
        return;
      }
      let current = "";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 200) current = id;
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, forceShowPrimary]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const primaryCollapsed = scrolled && showSubNav && !forceShowPrimary;

  return (
    <header className="sticky top-0 z-50">
      {/* ══════════════════════════════════════════════
          PRIMARY NAV — white bar, logo + page tabs
          Collapses when scrolled (desktop only)
          ══════════════════════════════════════════════ */}
      <div
        className="primary-nav bg-white flex items-center justify-between px-5 md:px-7 overflow-hidden transition-all duration-[250ms] ease-out"
        style={{
          height: primaryCollapsed ? 0 : 56,
          borderBottom: primaryCollapsed ? "none" : "1px solid var(--card-border)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="no-underline flex-shrink-0 flex items-center">
          <PdtLogo />
        </Link>

        {/* ── Desktop page-level tabs ── */}
        <nav className="nav-desktop hidden md:flex items-stretch h-[56px] gap-0">
          {PAGE_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center px-5 text-[13px] font-medium no-underline whitespace-nowrap transition-all duration-150 border-l border-r ${
                  isActive
                    ? "bg-[#c8d8cf] text-[#1a2f26] border-[var(--card-border)]"
                    : "bg-transparent text-[#2D4A3E] border-transparent hover:bg-[#f7f5f0]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Hamburger (mobile) ── */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] flex-shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-[2px] rounded bg-[var(--text-primary)] transition-all duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-5 h-[2px] rounded bg-[var(--text-primary)] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[2px] rounded bg-[var(--text-primary)] transition-all duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE DROPDOWN
          ══════════════════════════════════════════════ */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden bg-[#1a2f26] py-2">
          {/* Page tabs */}
          {PAGE_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => setMenuOpen(false)}
              className={`block w-full text-left px-5 py-3 text-[14px] font-medium no-underline ${
                pathname === tab.href ? "text-[#FDF6EC]" : "text-[#FDF6EC]/60"
              }`}
            >
              {tab.label}
            </Link>
          ))}

          {/* Section links for current page */}
          {sections.length > 0 && (
            <div className="border-t border-white/[0.06] pt-1 mt-1">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setMenuOpen(false); scrollTo(id); }}
                  className={`block w-full text-left px-5 py-[7px] pl-9 font-mono-pdt text-[12px] ${
                    activeSection === id ? "text-[#FDF6EC]/60" : "text-[#FDF6EC]/35"
                  }`}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECONDARY NAV — dark green bar, section scroll
          ══════════════════════════════════════════════ */}
      {showSubNav && (
        <div className="header-subnav bg-[#2D4A3E] flex items-center h-[42px] relative px-4">
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3a5a4a]" />

          {/* Compact logo — only visible when scrolled and primary collapsed */}
          <Link
            href="/"
            className="compact-logo no-underline flex items-center flex-shrink-0 overflow-hidden transition-all duration-[250ms] ease-out"
            style={{
              opacity: primaryCollapsed ? 1 : 0,
              width: primaryCollapsed ? "auto" : 0,
              marginRight: primaryCollapsed ? 12 : 0,
            }}
          >
            <PdtLogoCompact />
          </Link>

          {/* Section nav links — centered */}
          <nav
            className="nav-section-scroll flex items-center flex-1 justify-center gap-0 overflow-x-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {sections.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={`relative z-[1] px-5 py-[10px] font-mono-pdt text-[12px] whitespace-nowrap flex-shrink-0 transition-all duration-150 ${
                    isActive ? "font-medium text-[#FDF6EC]" : "font-normal text-[#FDF6EC]/60"
                  }`}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  {label}
                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#8BA898] rounded-t-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Expand button — only visible when scrolled and primary collapsed */}
          <button
            type="button"
            onClick={() => {
              setForceShowPrimary((v) => {
                if (!v) forceShowScrollY.current = window.scrollY;
                return !v;
              });
            }}
            aria-label="Toggle navigation"
            className="flex-shrink-0 flex items-center justify-center p-1 overflow-hidden transition-all duration-[250ms] ease-out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              opacity: primaryCollapsed ? 1 : 0,
              width: primaryCollapsed ? 28 : 0,
              marginLeft: primaryCollapsed ? 8 : 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FDF6EC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              {forceShowPrimary ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
