"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { parseConversationsJson } from "@/lib/parser";
import { buildAndDownloadMcpZip } from "@/lib/mcpZip";
import { PDT_SNAPSHOT_KEY, PDT_ZIP_DOWNLOADED_KEY, PDT_ZIP_BANNER_DISMISSED_KEY } from "@/lib/types";

type Status = "idle" | "reading" | "done" | "error";
type Variant = "hero" | "dropzone";

export function UploadSection({ variant = "hero" }: { variant?: Variant }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!file.name.toLowerCase().endsWith(".json")) {
        setError("That doesn't look like a ChatGPT export. We're looking for a file called conversations.json — check your unzipped folder.");
        return;
      }
      setStatus("reading");
      setProgress(10);
      try {
        const text = await file.text();
        setProgress(50);
        const data = JSON.parse(text) as unknown;
        setProgress(80);
        const { snapshot, evidence } = parseConversationsJson(data);
        setProgress(90);
        await buildAndDownloadMcpZip(snapshot, evidence);
        setProgress(100);
        setStatus("done");
        track("file_upload", {
          conversations: snapshot.conversation_count,
          messages: snapshot.message_count,
        });
        sessionStorage.setItem(PDT_SNAPSHOT_KEY, JSON.stringify(snapshot));
        sessionStorage.setItem(PDT_ZIP_DOWNLOADED_KEY, "true");
        sessionStorage.removeItem(PDT_ZIP_BANNER_DISMISSED_KEY);
        router.push("/results");
      } catch (e) {
        setStatus("error");
        const message = e instanceof Error ? e.message : "Something went wrong.";
        if (message.includes("list of conversations") || message.includes("JSON")) {
          setError("That doesn't look like a ChatGPT export. We're looking for a file called conversations.json — check your unzipped folder.");
        } else {
          setError(message);
        }
      }
    },
    [router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    (e.currentTarget as HTMLElement).classList.add("drag-over");
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const inputId = `pdt-file-input-${variant}`;
  const clickInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.getElementById(inputId)?.click();
  };

  const isHero = variant === "hero";

  return (
    <div className="space-y-4 w-full max-w-[600px]">
      <div
        className={`
          bg-pdt-surface border-2 border-dashed rounded-2xl cursor-pointer transition-all
          ${status === "reading" ? "border-pdt-500 bg-pdt-50 cursor-default" : "border-pdt-200 hover:border-pdt-700 hover:bg-pdt-50 hover:scale-[1.01]"}
          ${isHero ? "p-8 md:p-9 mb-4" : "p-10 md:p-12 text-center"}
        `}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => status !== "reading" && document.getElementById(inputId)?.click()}
      >
        <input
          id={inputId}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          onChange={onInputChange}
          disabled={status === "reading"}
        />
        {status === "reading" ? (
          <div className="space-y-4">
            <p className="text-pdt-body font-medium">Reading your history…</p>
            <div className="h-1.5 bg-pdt-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pdt-700 to-pdt-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            {!isHero && (
              <div className="w-14 h-14 bg-pdt-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📂</div>
            )}
            <p className={`text-pdt-body mb-1.5 ${isHero ? "text-base font-medium" : "text-sm"}`}>
              {isHero ? (
                <>Drop your <code className="bg-pdt-50 border border-pdt-200 px-1.5 py-0.5 rounded text-sm text-pdt-900">conversations.json</code> here</>
              ) : (
                "Drag and drop your file here, or click to browse."
              )}
            </p>
            <p className="text-pdt-subtle text-sm mb-5">
              {isHero ? "From your ChatGPT data export" : <>Only <code className="bg-pdt-50 px-1 py-0.5 rounded text-xs text-pdt-900">conversations.json</code> from your ChatGPT export.</>}
            </p>
            <button
              type="button"
              onClick={clickInput}
              className="bg-pdt-700 text-white border-0 rounded-lg py-3 px-8 font-sans text-[15px] font-semibold cursor-pointer hover:bg-pdt-900 transition-colors inline-block"
            >
              Choose file
            </button>
            {!isHero && <p className="text-pdt-subtle text-sm mt-4">or drag and drop</p>}
          </div>
        )}
      </div>

      {status === "error" && error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
