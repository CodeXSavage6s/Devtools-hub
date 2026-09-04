# DevTools Hub

A small, focused collection of browser-based developer utilities. Everything runs entirely client-side — nothing you paste into any tool is sent to a server.

## Features

- **Homepage** — introduces the project and links to each tool via cards.
- **JSON Inspector**
  - Format JSON with 2-space indentation
  - Minify JSON
  - Validate JSON with readable error messages (including line/column when the engine reports a resolvable position)
  - Clear input, load a bundled example, copy the result, download the result as a `.json` file
  - Upload a `.json` file via the file picker or by dragging it onto the input
  - Empty, valid, and error states, with live character/line/byte stats
- **JWT Decoder**
  - Decodes the header and payload of any JWT (base64url decoding is implemented directly, no JWT library)
  - Displays common claims (`iss`, `sub`, `aud`, `exp`, `iat`, `nbf`, `jti`) with human-readable labels
  - Converts `exp` / `iat` / `nbf` timestamps to local date/time
  - Shows an "Expired" / "Not expired" badge based on `exp`
  - Separates header, payload, and signature into distinct views
  - Clear, persistent warning that this tool decodes but does **not** verify signatures
- **Shared shell** — responsive top navigation, light/dark/system theme (persisted to `localStorage`), and a lightweight in-app toast system for action feedback (e.g. copy confirmations).

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (with CSS variable–based light/dark theme tokens)
- Hand-built shadcn/ui-style primitives (Button, Card, Tabs, Badge, Alert, Tooltip, Separator, Dropdown Menu), built on Radix UI primitives where accessibility behavior matters (Tabs, Tooltip, Dropdown Menu)
- `class-variance-authority`, `clsx`, `tailwind-merge` for variant-driven styling
- `lucide-react` for icons
- `react-router-dom` for client-side routing

No backend, database, authentication, or JWT-signing/verification library is used or required.

## Getting started

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print the URL, typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    layout/        # Header, Footer, Shell (app frame + routing outlet)
    shared/         # ToolCard — reusable across the homepage
    ui/             # Hand-built shadcn-style primitives (Button, Card, Tabs, ...)
  features/
    json-inspector/
      components/   # JsonEditor, JsonToolbar, JsonResult
      utils/        # json.ts — parse/format/minify/error-location logic
      types.ts
      JsonInspector.tsx   # feature entry point
    jwt-decoder/
      components/   # JwtInput, JwtSection, ClaimsTable
      utils/        # jwt.ts — base64url decode, claim parsing
      types.ts
      JwtDecoder.tsx      # feature entry point
  hooks/            # useTheme, useToast, useClipboard
  lib/              # cn() classname helper
  pages/            # Home, JsonInspectorPage, JwtDecoderPage, NotFound
  types/            # shared cross-app types (ToolDefinition)
  App.tsx           # route table
  main.tsx          # providers + render
```

Feature-specific logic (parsing, formatting, decoding) lives entirely inside its `features/<name>` folder, so a new tool can be added later without touching JSON or JWT code.

## How the JSON Inspector works

Formatting, minifying, and validating all go through `JSON.parse` / `JSON.stringify` — no parsing library is used, since the browser's native JSON support is sufficient and dependency-free.

When `JSON.parse` throws, the error message is inspected for a `position N` marker (which V8-based engines include). If found, that character offset is converted into a 1-indexed line and column by walking the input up to that offset. If the engine doesn't report a resolvable position, only the raw error message is shown — the tool does not fabricate a line/column it can't actually determine.

## How the JWT Decoder works

A JWT is split on its two `.` separators into header, payload, and signature segments. The header and payload segments are base64url-decoded (a small manual implementation — replace URL-safe characters, restore padding, decode) and parsed as JSON. The signature segment is *not* decoded, because it isn't encoded data — it's a cryptographic hash of the header and payload, and can only be checked against a real secret or key, which this tool never asks for or has access to.

## Security limitations

- **This is a decoder, not a verifier.** Decoding a JWT proves nothing about whether it's authentic — it only proves you can read base64. Verifying a signature requires the issuer's secret or public key, which this tool intentionally never requests.
- Everything happens in your browser's memory. No token, JSON payload, or file you use in this app is transmitted anywhere.
- Even so, treat any token or payload you paste in as something you're comfortable exposing to whatever machine your browser is running on. Don't paste real production secrets into tools you don't control or trust — including this one, if you didn't build or audit it yourself.
- There is no token cracking, secret discovery, brute forcing, or authentication-bypass functionality in this project, and none is planned.

## Future possibilities

The shell is intentionally structured so a new tool is just a new folder under `features/`, a page under `pages/`, a route in `App.tsx`, and a card on the homepage. Ideas that would fit the same pattern without requiring a backend:

- Base64 / URL encoder-decoder
- UUID generator
- Regex tester
- Timestamp / cron expression converter
- Color format converter (hex/rgb/hsl)

None of these are implemented yet — this README only describes what exists today.

## Known limitations of this build

This project's source was generated in a sandboxed environment without network access, so `npm install` and `npm run build` could not actually be executed here to produce a verified build. The code was written carefully, reviewed with a TypeScript syntax check on every file, and the core JSON/JWT logic was independently tested in plain Node — but you should run `npm install && npm run dev` (or `npm run build`) yourself as a final check after downloading.
