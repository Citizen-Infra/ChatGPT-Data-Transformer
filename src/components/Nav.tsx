"use client";

import { useState } from "react";
import Link from "next/link";

function PdtLogo({ isDark }: { isDark: boolean }) {
  return (
    <svg viewBox="0 0 200 40" className="h-9 w-auto" aria-label="chatgpt.pdt — personal data transformer">
      <text
        x="0"
        y="18"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fontSize="16"
        fill={isDark ? "#ffffff" : "#1a3a2a"}
      >
        chatgpt.pdt
      </text>
      <text
        x="0"
        y="34"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="400"
        fontSize="9"
        letterSpacing="0.5"
        fill={isDark ? "rgba(255,255,255,0.5)" : "#888888"}
        className="hidden min-[480px]:inline"
      >
        personal data transformer
      </text>
    </svg>
  );
}

export function Nav({ variant = "landing" }: { variant?: "landing" | "results" }) {
  const isDark = variant === "results";
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = isDark
    ? "text-sm font-medium text-white/80 no-underline hover:text-white transition-colors"
    : "text-sm font-medium text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)] transition-colors";

  const uploadHref = variant === "results" ? "/" : "/#upload";

  return (
    <nav
      className={`sticky top-0 z-50 border-b px-6 md:px-8 ${
        isDark ? "bg-pdt-dark border-white/10" : "bg-white border-[var(--border)]"
      }`}
    >
      <div className="h-14 flex items-center justify-between">
        {/* Logo — clickable SVG */}
        <Link href="/" className="no-underline flex-shrink-0">
          <PdtLogo isDark={isDark} />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          <Link href="/#how" className={linkClass}>
            How it works
          </Link>
          <Link href="/#privacy" className={linkClass}>
            Privacy
          </Link>
          <Link
            href={uploadHref}
            className={`text-sm font-semibold px-5 py-2.5 rounded-lg no-underline transition-colors ${
              isDark
                ? "text-white bg-pdt-dark border border-white/30 hover:bg-green-mid"
                : "text-white bg-pdt-dark hover:bg-green-mid"
            }`}
          >
            Upload your data →
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] ${isDark ? "text-white" : "text-[var(--text-primary)]"}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-[2px] rounded transition-all duration-200 ${isDark ? "bg-white" : "bg-[var(--text-primary)]"} ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-5 h-[2px] rounded transition-all duration-200 ${isDark ? "bg-white" : "bg-[var(--text-primary)]"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[2px] rounded transition-all duration-200 ${isDark ? "bg-white" : "bg-[var(--text-primary)]"} ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          menuOpen ? "max-h-60 pb-5" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 pt-2">
          <Link href="/#how" onClick={() => setMenuOpen(false)} className={linkClass}>
            How it works
          </Link>
          <Link href="/#privacy" onClick={() => setMenuOpen(false)} className={linkClass}>
            Privacy
          </Link>
          <Link
            href={uploadHref}
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-white bg-pdt-dark px-5 py-3 rounded-lg no-underline hover:bg-green-mid transition-colors text-center"
          >
            Upload your data →
          </Link>
        </div>
      </div>
    </nav>
  );
}
