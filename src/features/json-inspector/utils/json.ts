import type { JsonParseError, JsonStats } from "../types";

const INDENT = 2;

/**
 * Converts a flat character position (as reported by V8's JSON.parse errors)
 * into a 1-indexed line/column pair, so error messages can point at the
 * actual spot in the user's input.
 */
function positionToLineColumn(input: string, position: number) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

/**
 * Parses a JSON.parse error message and, where the engine reports a
 * character position, resolves it to a line/column. If we can't reliably
 * determine a position, we return the raw message only rather than
 * guessing.
 */
export function describeParseError(input: string, error: unknown): JsonParseError {
  const message = error instanceof Error ? error.message : "Invalid JSON";

  const positionMatch = message.match(/position (\d+)/i);
  if (positionMatch) {
    const position = Number(positionMatch[1]);
    const { line, column } = positionToLineColumn(input, position);
    return { message: cleanMessage(message), line, column };
  }

  // Some engines report "line X column Y" directly.
  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return {
      message: cleanMessage(message),
      line: Number(lineColMatch[1]),
      column: Number(lineColMatch[2]),
    };
  }

  return { message: cleanMessage(message) };
}

function cleanMessage(message: string): string {
  // Trim the verbose "JSON.parse: " / "in JSON at position N" engine noise
  // down to something readable, keeping the meaningful part.
  return message.replace(/^JSON\.parse:\s*/i, "").trim();
}

export function parseJson(input: string): { value: unknown } | { error: JsonParseError } {
  try {
    return { value: JSON.parse(input) };
  } catch (error) {
    return { error: describeParseError(input, error) };
  }
}

export function formatJson(input: string): string {
  const result = parseJson(input);
  if ("error" in result) throw new Error(result.error.message);
  return JSON.stringify(result.value, null, INDENT);
}

export function minifyJson(input: string): string {
  const result = parseJson(input);
  if ("error" in result) throw new Error(result.error.message);
  return JSON.stringify(result.value);
}

export function computeStats(input: string): JsonStats {
  return {
    characters: input.length,
    lines: input.length === 0 ? 0 : input.split("\n").length,
    bytes: new TextEncoder().encode(input).length,
  };
}

export const EXAMPLE_JSON = JSON.stringify(
  { name: "Savage", age: 16, active: true,
    projects: ["NexusForge", "DevTools Hub", "don-gb"],
    address: {
      city: "Delta",
      zip: "10115",
    },
    notes: null,
  },
  null,
  2
);
