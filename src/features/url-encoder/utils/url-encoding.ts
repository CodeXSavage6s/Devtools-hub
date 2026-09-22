import type { EncodingMode, EncodingOperation, EncodingResult } from "../types";

/**
 * Runs the requested transform using the native encode/decode functions.
 * "component" mode encodes everything that isn't valid in a single query
 * value (&, =, ?, #, +, spaces, etc included); "full" mode assumes the
 * input is already a whole URL and leaves URL-structural characters
 * (: / ? # [ ] @ & = + $ , ;) alone, matching what a browser does when it
 * navigates to a typed-in address.
 */
export function transformUrlText(
  input: string,
  mode: EncodingMode,
  operation: EncodingOperation
): EncodingResult {
  if (input.length === 0) {
    return { output: "", error: null };
  }

  try {
    if (operation === "encode") {
      const fn = mode === "component" ? encodeURIComponent : encodeURI;
      return { output: fn(input), error: null };
    }

    const fn = mode === "component" ? decodeURIComponent : decodeURI;
    return { output: fn(input), error: null };
  } catch {
    return {
      output: "",
      error:
        operation === "decode"
          ? "Invalid percent-encoding — this doesn't look like validly encoded text (e.g. a stray % not followed by two hex digits)."
          : "Couldn't encode this input.",
    };
  }
}

export const RESERVED_CHARACTERS: { char: string; encoded: string; note: string }[] = [
  { char: "&", encoded: "%26", note: "Separates query parameters" },
  { char: "=", encoded: "%3D", note: "Separates a parameter's key and value" },
  { char: "?", encoded: "%3F", note: "Starts the query string" },
  { char: "#", encoded: "%23", note: "Starts the fragment/hash" },
  { char: "%", encoded: "%25", note: "Escapes other characters — must itself be encoded" },
  { char: "+", encoded: "%2B", note: "Historically means space in form encoding" },
  { char: " ", encoded: "%20", note: "Space (encodeURIComponent uses %20, not +)" },
];

export const EXAMPLES: Record<EncodingMode, string> = {
  component: "John Doe & Jane's Café? 50% off + free shipping",
  full: "https://example.com/search?q=hello world&tag=café#section",
};
