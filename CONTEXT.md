# PDT — Context for Cursor

## What PDT Is

**Personal Data Transformer (PDT)** is a privacy-first, no-account web platform. **chatgpt.pdt.com** transforms ChatGPT JSON exports into structured, portable outputs — processed **entirely in the browser** (nothing stored, nothing sent).

## MVP Outputs

1. **Networking Card** — Portrait PNG (390×844 base, 2x retina): display name, top 3 projects, 5–7 interest tags, usage signature. Primary validation target.
2. **MCP Files** — Zip with index.json, overview.md, projects.json, concepts.json, evidence.jsonl, README for Claude Desktop.
3. **Caricature** — (Later) Illustrated portrait from worldview lenses via image API.

## ChatGPT Export Format

- User downloads from chatgpt.com → Settings → Data Controls → Export Data.
- Export contains **conversations.json** — a **JSON array** of conversation objects.
- Each conversation: `{ "id", "title", "mapping", ... }`. `mapping` is an object keyed by node IDs; each node has `message: { author: { role }, content: { parts: ["text"] }, create_time }`. Messages are in a **tree**; linearize by `create_time` for chronological order.

## Repo Layout

- **src/app/** — Next.js App Router: page.tsx (landing), results/page.tsx, layout, globals.css.
- **src/lib/** — Client-side parser (conversations → snapshot), card data shape.
- **src/components/** — Upload zone, NetworkingCard, snapshot preview.

## Trust / Privacy

- No data leaves the browser (except optional caricature: only a derived text prompt).
- No accounts, no persistence. One-time session.
