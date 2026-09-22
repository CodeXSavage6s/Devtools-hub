import type { QueryParam } from "../types";

export type BuildUrlResult = { url: string; error: null } | { url: null; error: string };

/**
 * Assembles a URL from its parts using the native URL / URLSearchParams
 * APIs rather than manual string concatenation, so encoding is handled
 * correctly and consistently.
 */
export function buildUrl(
  base: string,
  path: string,
  params: QueryParam[],
  hash: string
): BuildUrlResult {
  const trimmedBase = base.trim();
  if (!trimmedBase) {
    return { url: null, error: "Enter a base URL to get started (e.g. https://api.example.com)." };
  }

  let url: URL;
  try {
    url = new URL(trimmedBase);
  } catch {
    return {
      url: null,
      error: "That doesn't look like a valid base URL — make sure it includes a protocol, e.g. https://",
    };
  }

  const trimmedPath = path.trim();
  if (trimmedPath) {
    const basePath = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
    const cleanSegment = trimmedPath.replace(/^\/+/, "");
    url.pathname = `${basePath === "/" ? "" : basePath}/${cleanSegment}`;
  }

  const search = new URLSearchParams();
  for (const param of params) {
    if (param.enabled && param.key.trim()) {
      search.append(param.key.trim(), param.value);
    }
  }
  // URLSearchParams encodes spaces as "+" (form encoding); "%20" is more
  // broadly recognizable in a URL and matches what most developers expect.
  url.search = search.toString().replace(/\+/g, "%20");

  const trimmedHash = hash.trim().replace(/^#/, "");
  url.hash = trimmedHash;

  return { url: url.toString(), error: null };
}

let paramCounter = 0;
export function createEmptyParam(): QueryParam {
  paramCounter += 1;
  return { id: `param-${Date.now()}-${paramCounter}`, key: "", value: "", enabled: true };
}
