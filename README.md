# ChatGPT PDT Website

Privacy-first web app for the **Personal Data Transformer (PDT)**. Upload your ChatGPT `conversations.json`; everything runs in your browser. No account, no server storage.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Upload a `conversations.json` from your ChatGPT export to see your snapshot and download your networking card (PNG).

## What it does

1. **Landing** — Hero, how-to (export from ChatGPT), drag-and-drop upload, trust copy.
2. **Parse** — Client-side only: reads `conversations.json`, linearizes messages, builds a snapshot (conversation count, date range, usage categories, top conversation titles as “projects”, simple interest tags).
3. **Results** — Snapshot summary + networking card (portrait 390×844). Optional display name, then “Download My Networking Card” as PNG (2x for retina).
4. **Bloom CTA** — Link to find a Bloom chapter. MCP zip + setup tutorial can be added later.

## Stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- `html2canvas` for card PNG export
- No backend; no analytics on file contents

## Folder

All work is in **`C:\Users\Megan\Documents\Bloom\chatGPT_pdt_website`**. The transformer logic and MCP schema live in your other repo (Portable-ChatGPT-Data-Transformer); this app is the standalone web UI.
