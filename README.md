# DevTools Hub

Developer tools that stay in your browser. A small, fast collection of browser-based utilities — no account, no backend, no database.

## Overview

DevTools Hub started as a two-tool portfolio project (JSON Inspector, JWT Decoder) and has grown into a small focused platform of six developer utilities, organized by category with client-side search. Every tool runs entirely in the browser: your tool input is processed locally and is not sent to our servers.

## Features

- **Tool discovery homepage** — hero, a client-side tool search, and tools grouped into categories (JSON & Data, URL Tools, Networking & Numbers)
- **Central tool registry** (`src/lib/tools.ts`) — a single source of truth for every tool's name, description, category, route, and search keywords, used by both the homepage and the header's Tools menu
- **Responsive navigation** — a categorized "Tools" dropdown on desktop, a full-screen categorized menu on mobile, plus light/dark/system theme (persisted to `localStorage`)
- **Per-page document titles** and Open Graph / Twitter Card metadata for link previews
- **404 page**, `vercel.json` SPA rewrite, `robots.txt`, and `sitemap.xml`

## Current tools

| Tool | Route | What it does |
|---|---|---|
| JSON Inspector | `/json-inspector` | Format, validate, minify, and inspect JSON. Drag-and-drop or upload a `.json` file (5 MB limit), copy or download the result. |
| JWT Decoder | `/jwt-decoder` | Decode a JWT's header and payload, read its standard claims with human-readable timestamps, and see expiry status. Decodes only — never verifies. |
| URL Encoder / Decoder | `/url-encoder` | Encode or decode a single value (`encodeURIComponent`/`decodeURIComponent`) or a whole URL (`encodeURI`/`decodeURI`), with a reserved-character reference and a note on avoiding double-encoding. |
| URL Builder | `/url-builder` | Assemble a URL from a base, path, and dynamically added/removed query parameters, built with `URL`/`URLSearchParams` rather than string concatenation. |
| URL Inspector | `/url-inspector` | Break a URL down into protocol, credentials, host, port, path, query parameters, and hash using the native `URL` API. Never fetches the URL. |
| Number / IP Converter | `/number-converter` | Convert between decimal, hexadecimal, and binary (via `BigInt`, so there's no practical size limit or float rounding), plus IPv4 ⇄ decimal/hex/binary using 32-bit bitwise arithmetic. |

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (CSS-variable-based light/dark theme tokens)
- Hand-built shadcn/ui-style primitives (Button, Card, Tabs, Badge, Alert, Tooltip, Separator, Dropdown Menu, Input, Textarea), built on Radix UI primitives where accessibility behavior matters (Tabs, Tooltip, Dropdown Menu)
- `class-variance-authority`, `clsx`, `tailwind-merge` for variant-driven styling
- `lucide-react` for icons
- `react-router-dom` for client-side routing

No backend, database, authentication, analytics, or third-party API is used. The only third-party network requests are the Google Fonts stylesheet and font files loaded in `index.html` — nothing else leaves the browser, and no tool input is ever included in any request.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

`npm run build` runs a TypeScript project build (`tsc -b`) followed by the Vite build.

## Deploying to Vercel

The included `vercel.json` rewrites any path without a file extension to `/index.html`, so client-side routes like `/json-inspector` work correctly when loaded directly (not just when navigated to from within the app), while actual static assets (`.js`, `.css`, `.svg`, `.png`, `.txt`, `.xml`, etc.) are served as-is.

Before deploying, replace the placeholder domain (`devtools-hub.example.com`) in `index.html`, `public/robots.txt`, and `public/sitemap.xml` with your real deployed URL.

## Project structure

```
src/
  components/
    layout/         # Header, Footer, Shell (app frame + routing outlet)
    shared/         # ToolCard, ToolSearch — used by the homepage
    ui/             # Hand-built shadcn-style primitives
  features/
    json-inspector/
    jwt-decoder/
    url-encoder/
    url-builder/
    url-inspector/
    number-converter/
      components/   # Feature-specific UI
      utils/        # Feature-specific logic (parsing, encoding, converting)
      types.ts
      <Feature>.tsx # Feature entry point, imported by its page
  hooks/            # useTheme, useToast, useClipboard, useDocumentTitle
  lib/              # cn() classname helper, tools.ts (tool registry)
  pages/            # One page per route, each sets its own document title
  types/            # Shared cross-app types (ToolDefinition, ToolCategory)
  App.tsx           # Route table
  main.tsx          # Providers + render
```

Each tool's parsing/formatting/converting logic lives entirely inside its own `features/<name>/utils` folder, so tools don't share or depend on each other's internals. Adding a future tool means: add an entry to `src/lib/tools.ts`, add its route in `App.tsx`, and build the feature folder — nothing else needs to change.

## Privacy model

Your tool input — JSON, JWTs, URLs, numbers, IP addresses — is processed locally in your browser using native Web APIs (`JSON`, `URL`, `URLSearchParams`, `atob`, `BigInt`) and is **not sent to our servers**. There is no backend for any tool to call.

The app does load two third-party resources: a Google Fonts stylesheet and font files (declared in `index.html`). These requests only fetch fonts — they never include anything you've typed into a tool.

## JWT security limitation

**The JWT Decoder decodes; it does not verify.** Decoding a JWT does not verify its signature. The signature is a cryptographic value used to verify a token's integrity and authenticity — this tool displays it but cannot check it, since that requires the issuer's original secret or public key, which the tool never asks for or has access to. Anyone can decode a JWT's header and payload; only the holder of the correct key can confirm a token is authentic. Don't paste sensitive production tokens into tools you don't trust — including this one, if you haven't audited it yourself.

## URL scanner security boundary

**The URL Inspector inspects structure only — it never fetches, pings, or probes anything.** It parses a URL string locally with the native `URL` API and displays its protocol, credentials, host, port, path, query parameters, and hash. It does not perform port scanning, network scanning, SSRF, endpoint probing, or vulnerability scanning, and never will. Because URLs can carry credentials or API keys in their username, password, or query string, the tool displays a warning about that whenever you use it.

## Accessibility

- All icon-only buttons have `aria-label`s (theme toggle, mobile nav toggle, remove-parameter, clear-search)
- Every form control has an associated `<label>` (via `htmlFor`/`id` or `aria-label`)
- Heading hierarchy is `h1` (page title) → `h2` (homepage category) → `h3` (card title), consistently
- Visible focus rings on every interactive element (`:focus-visible`)
- Tabs, Tooltip, and Dropdown Menu are built on Radix UI primitives for correct keyboard navigation and ARIA roles out of the box

## Responsive design

Every tool layout collapses to a single column below the `sm` breakpoint, and the header switches from an inline nav + dropdown to a full-screen categorized menu below `md`. Tables and code blocks that could overflow (JSON output, JWT claims, URL query parameters) scroll horizontally within their own container instead of breaking the page layout.

## Future possibilities

The registry-driven structure makes it straightforward to add another tool without restructuring anything. Ideas that would fit the same pattern:

- Base64 encoder/decoder (beyond JWT segments)
- UUID generator
- Regex tester
- Timestamp / cron expression converter
- Color format converter (hex/rgb/hsl)

None of these are implemented yet — this README only describes what exists today.

## Known limitations of this build

This project's source has been generated and edited across multiple sessions in a sandboxed environment without network access, so `npm install` and a fresh `npm run build` could not be executed *by the assistant* in every session. Where that's the case:

- Every changed file was checked individually with the TypeScript compiler for syntax errors (not full cross-file type checking, which needs installed dependencies)
- Pure logic (JSON parsing/formatting, JWT base64url decoding, IPv4 bitwise conversion) was independently verified against the spec's own examples in plain Node
- The project was previously built successfully end-to-end (via `npm install && npm run build`) — the `package-lock.json` in this repo reflects that

Run `npm install && npm run build` yourself after pulling changes as a final check, especially after a large batch of edits like the URL/Number tools added in this pass.
