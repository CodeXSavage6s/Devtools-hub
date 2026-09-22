import type { ParsedUrlInfo } from "../types";

export type InspectResult = { data: ParsedUrlInfo; error: null } | { data: null; error: string };

/**
 * Parses a URL's structure using the native URL API. This never fetches or
 * otherwise contacts the URL — it only reads apart the string.
 */
export function inspectUrl(input: string): InspectResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { data: null, error: "Enter a URL to inspect." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      data: null,
      error: "That doesn't look like a valid, complete URL — make sure it includes a protocol, e.g. https://",
    };
  }

  return {
    data: {
      protocol: url.protocol,
      username: url.username,
      password: url.password,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      searchParams: Array.from(url.searchParams.entries()),
      hash: url.hash.replace(/^#/, ""),
      origin: url.origin,
    },
    error: null,
  };
}
