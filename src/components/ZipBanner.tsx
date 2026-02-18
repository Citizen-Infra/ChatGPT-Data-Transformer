"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDT_ZIP_DOWNLOADED_KEY, PDT_ZIP_BANNER_DISMISSED_KEY } from "@/lib/types";

export function ZipBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const downloaded = sessionStorage.getItem(PDT_ZIP_DOWNLOADED_KEY) === "true";
    const dismissed = sessionStorage.getItem(PDT_ZIP_BANNER_DISMISSED_KEY) === "true";
    setShow(downloaded && !dismissed);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(PDT_ZIP_BANNER_DISMISSED_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="max-w-[960px] mx-auto px-6 md:px-8 mt-6">
      <div className="rounded-xl bg-pdt-dark py-6 px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1.5">Your files are ready</h3>
            <p className="text-white/70 text-[13px] leading-relaxed max-w-[520px]">
              We created a set of files from your ChatGPT history. You can use them on their own to explore your data, or connect them to Claude so it can search and reference your past conversations in real time.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            <Link
              href="/mcp-setup"
              className="inline-flex items-center gap-2 bg-green-mid text-white border border-white/20 py-2.5 px-5 rounded-lg text-sm font-semibold no-underline hover:bg-green-accent transition-colors whitespace-nowrap"
            >
              Setup Guide &rarr;
            </Link>
            <Link
              href="/mcp-setup#setup"
              className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/15 py-2.5 px-5 rounded-lg text-sm font-medium no-underline hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              What&apos;s in my files?
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
