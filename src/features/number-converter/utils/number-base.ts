import type { NumberBase, NumberConversionResult } from "../types";

/**
 * All conversions here go through BigInt rather than Number, so arbitrarily
 * large values convert exactly with no floating-point rounding — there's no
 * practical upper limit the way there would be with Number arithmetic.
 */
function parseByBase(input: string, base: NumberBase): bigint {
  const trimmed = input.trim();

  if (base === "decimal") {
    if (!/^\d+$/.test(trimmed)) {
      throw new Error("Decimal input must contain only digits 0–9.");
    }
    return BigInt(trimmed);
  }

  if (base === "hex") {
    const cleaned = trimmed.replace(/^0[xX]/, "");
    if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
      throw new Error("Hexadecimal input must contain only 0–9 and A–F.");
    }
    return BigInt(`0x${cleaned}`);
  }

  // binary
  const cleaned = trimmed.replace(/^0[bB]/, "");
  if (!/^[01]+$/.test(cleaned)) {
    throw new Error("Binary input must contain only 0 and 1.");
  }
  return BigInt(`0b${cleaned}`);
}

export function convertNumber(input: string, fromBase: NumberBase): NumberConversionResult {
  const empty = { decimal: "", hex: "", binary: "", error: null };
  if (input.trim().length === 0) return empty;

  try {
    const value = parseByBase(input, fromBase);
    return {
      decimal: value.toString(10),
      hex: value.toString(16).toUpperCase(),
      binary: value.toString(2),
      error: null,
    };
  } catch (error) {
    return {
      decimal: "",
      hex: "",
      binary: "",
      error: error instanceof Error ? error.message : "Invalid input.",
    };
  }
}
