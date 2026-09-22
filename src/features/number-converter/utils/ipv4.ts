import type { Ipv4ConversionResult, Ipv4Format } from "../types";

const MAX_UINT32 = 4294967295;

function octetsToInt(octets: number[]): number {
  // Bitwise ops in JS operate on signed 32-bit ints, so a leading octet
  // >= 128 would flip the sign bit; ">>> 0" reinterprets the result as an
  // unsigned 32-bit integer, giving the correct decimal value with no
  // floating-point arithmetic involved.
  return (
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
  );
}

function intToOctets(value: number): number[] {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ];
}

function parseIpv4(input: string): number[] {
  const parts = input.trim().split(".");
  if (parts.length !== 4) {
    throw new Error("An IPv4 address needs exactly 4 dot-separated octets (e.g. 192.168.1.10).");
  }
  return parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) {
      throw new Error(`"${part}" isn't a valid octet — each part must be 0–255.`);
    }
    const n = Number(part);
    if (n < 0 || n > 255) {
      throw new Error(`"${part}" is out of range — each octet must be 0–255.`);
    }
    return n;
  });
}

function parseIntegerValue(input: string, format: Ipv4Format): number {
  const trimmed = input.trim();

  if (format === "decimal") {
    if (!/^\d+$/.test(trimmed)) throw new Error("Enter a plain decimal number.");
    const n = Number(trimmed);
    if (n > MAX_UINT32) {
      throw new Error(`Value is too large for a 32-bit address (max ${MAX_UINT32}).`);
    }
    return n;
  }

  // hex
  const cleaned = trimmed.replace(/^0[xX]/, "");
  if (!/^[0-9a-fA-F]{1,8}$/.test(cleaned)) {
    throw new Error("Enter 1–8 hexadecimal digits (0–9, A–F).");
  }
  const n = parseInt(cleaned, 16);
  if (n > MAX_UINT32) {
    throw new Error(`Value is too large for a 32-bit address (max ${MAX_UINT32}).`);
  }
  return n;
}

export function convertIpv4(input: string, format: Ipv4Format): Ipv4ConversionResult {
  const empty = { ipv4: "", decimal: "", hex: "", binary: "", error: null };
  if (input.trim().length === 0) return empty;

  try {
    const intValue =
      format === "ipv4" ? octetsToInt(parseIpv4(input)) : parseIntegerValue(input, format);

    const octets = intToOctets(intValue);

    return {
      ipv4: octets.join("."),
      decimal: intValue.toString(10),
      hex: intValue.toString(16).toUpperCase().padStart(8, "0"),
      binary: octets.map((o) => o.toString(2).padStart(8, "0")).join("."),
      error: null,
    };
  } catch (error) {
    return {
      ipv4: "",
      decimal: "",
      hex: "",
      binary: "",
      error: error instanceof Error ? error.message : "Invalid input.",
    };
  }
}
