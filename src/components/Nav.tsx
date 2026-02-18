"use client";

import { useState } from "react";
import Link from "next/link";

function PdtLogo({ isDark }: { isDark: boolean }) {
  // Main letterforms color: white on dark, dark green on light
  const mainFill = isDark ? "#fcfdfd" : "#1a3a2a";
  // Accent color stays green either way
  const accentFill = "#8bc97a";

  return (
    <svg
      viewBox="0 0 295.32 101.46"
      className="h-7 w-auto"
      aria-label="OAiK logo"
    >
      {/* O */}
      <path fill={mainFill} d="m89.78,18.45C79.86,5.59,66.27.1,50.35,0c-13.34-.08-25.54,3.62-35.1,13.26C-.17,28.8-3.14,47.76,2.96,67.85c10.69,35.17,51.24,40.78,74.78,25.87,15.71-9.95,22.04-25.04,22.2-43.11.15-11.85-2.89-22.73-10.17-32.16Zm-21.78,61.93c-16.94,11-44.58,4.76-49.44-21.26-2.44-13.1-.44-25.27,9.58-34.9,9.13-8.78,20.36-10.19,32.08-6.9,11.56,3.24,18.2,11.59,21.18,22.97.88,3.36,1.34,6.81,1.26,10.32-.36,12.13-3.91,22.8-14.65,29.78Z"/>
      {/* i dot (green) */}
      <path fill={accentFill} d="m236.05,1.47h0c-10.84,0-19.63,8.79-19.63,19.63h0c0,1.31,1.06,2.38,2.38,2.38h0c10.84,0,19.63-8.79,19.63-19.63h0c0-1.31-1.06-2.38-2.38-2.38Z"/>
      {/* K */}
      <path fill={mainFill} d="m294.9,97.2c-.07-.08-.13-.15-.19-.22-13.98-14.57-43.37-46.99-43.37-46.99,0,0,33.2-36.28,41.74-45.3,1.08-1.14.26-3.01-1.31-3.01-6.11,0-11.75,0-17.39,0-1.23,0-1.76,1.08-2.45,1.81-7.87,7.87-26.05,26.81-34.12,35.23v23.64c8.18,8.52,26.66,27.82,34.33,35.49,1.57,1.57,3.02,2.28,5.2,2.22,5.29,0,15.98-.06,16.25-.06,1.48.02,2.27-1.71,1.31-2.84Z"/>
      {/* i stem */}
      <path fill={mainFill} d="m231.97,27.82h-13.67c-1.04,0-1.88.84-1.88,1.88v68.22c0,1.04.84,1.88,1.88,1.88h1c.44.02.93.02,1.5.02,2.07,0,3.79-.01,5.8-.02h5.36c1.04,0,1.88-.84,1.88-1.88V29.7c0-1.04-.84-1.88-1.88-1.88Z"/>
      {/* A (green) */}
      <path fill={accentFill} d="m201.81,97.52c-9.22-21.52-18.39-43.06-27.57-64.6-4.07-9.56-8.2-19.1-12.14-28.71-.86-2.1-1.96-2.74-4.2-2.74h-10.36c-2.24,0-3.34.65-4.2,2.74-3.94,9.61-8.07,19.15-12.14,28.71-9.17,21.54-18.34,43.08-27.57,64.6-.75,1.75.43,2.43,1.48,2.43,4.53,0,9.06-.09,13.59.01,1.62.04,2.19-.79,2.7-2.06.29-.72.61-1.43.94-2.14l30.38-73.97,17.67,43.24-24.66.06c-3.91.01-7.44,2.37-8.93,5.99l-4.19,10.16c6.51.05,13.02.09,19.53.09h0c.19,0,.38,0,.57,0s.38,0,.57,0h0c7.05,0,14.11-.04,21.16-.1,2.17-.02,3.17.69,3.91,2.66,1.78,4.71,3.8,9.33,5.68,14.01.51,1.27,1.08,2.06,2.7,2.06,4,0,9.06-.01,13.59-.01.54,0,2.23-.67,1.48-2.43Z"/>
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
