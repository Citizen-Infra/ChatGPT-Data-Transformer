"use client";

import { useState } from "react";
import Link from "next/link";

function PdtLogo({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? "text-white" : "text-pdt-dark";
  const subtitleColor = isDark ? "text-white/60" : "text-[var(--text-secondary)]";
  const dotColor = "#2d5a3f";

  return (
    <div className="flex flex-col leading-none" aria-label="chatgpt.pdt — personal data transformer">
      <span className={`font-bold text-[17px] tracking-tight ${textColor}`}>
        chatgpt<span style={{ color: dotColor }}>.</span>pdt
      </span>
      <span className={`text-[10px] font-normal tracking-wide ${subtitleColor}`}>
        personal data transformer
      </span>
    </div>
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
            Upload your data &rarr;
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
            Upload your data &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}
