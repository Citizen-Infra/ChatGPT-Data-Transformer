"use client";

import { useEffect, useState } from "react";
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
    <div className="max-w-[960px] mx-auto px-6 md:px-8 mt-6 rounded-xl bg-pdt-dark flex flex-wrap items-center justify-between gap-4 py-6 px-6 md:px-8">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Check your downloads</h3>
        <p className="text-white/60 text-[13px]">You now have all the files you need for your own Claude MCP that can reference your ChatGPT data.</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://docs.anthropic.com/en/docs/build-with-claude/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-mid text-white border border-white/20 py-3 px-6 rounded-lg text-sm font-semibold no-underline hover:bg-green-accent transition-colors whitespace-nowrap"
        >
          MCP Setup Instructions →
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
