import type { ClaimInfo, DecodedJwt } from "../types";

/**
 * Decodes a base64url string (used in JWT segments) into a UTF-8 string.
 * Implemented manually rather than pulling in a library, since this is a
 * small, well-defined transform.
 */
export function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  const parts = trimmed.split(".");

  if (parts.length !== 3) {
    throw new Error(
      `A JWT should have 3 dot-separated parts (header.payload.signature) — found ${parts.length}.`
    );
  }

  const [rawHeader, rawPayload, rawSignature] = parts;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(rawHeader));
  } catch {
    throw new Error("Couldn't decode the header — it isn't valid base64url-encoded JSON.");
  }

  try {
    payload = JSON.parse(base64UrlDecode(rawPayload));
  } catch {
    throw new Error("Couldn't decode the payload — it isn't valid base64url-encoded JSON.");
  }

  return {
    header,
    payload,
    signature: rawSignature,
    raw: { header: rawHeader, payload: rawPayload, signature: rawSignature },
  };
}

const CLAIM_LABELS: Record<string, string> = {
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expires at",
  iat: "Issued at",
  nbf: "Not valid before",
  jti: "JWT ID",
};

const TIMESTAMP_CLAIMS = new Set(["exp", "iat", "nbf"]);

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

export function buildClaims(payload: Record<string, unknown>): ClaimInfo[] {
  return Object.entries(payload)
    .filter(([key]) => key in CLAIM_LABELS)
    .map(([key, value]) => {
      const isTimestamp = TIMESTAMP_CLAIMS.has(key) && typeof value === "number";
      const claim: ClaimInfo = {
        key,
        label: CLAIM_LABELS[key] ?? key,
        value,
        display: formatValue(value),
      };

      if (isTimestamp) {
        const date = new Date((value as number) * 1000);
        claim.isTimestamp = true;
        claim.timestampDisplay = Number.isNaN(date.getTime())
          ? "Invalid timestamp"
          : date.toLocaleString();
      }

      if (key === "exp" && typeof value === "number") {
        claim.isExpiry = true;
        claim.expired = Date.now() >= value * 1000;
      }

      return claim;
    });
}

export function getOtherClaims(payload: Record<string, unknown>): [string, unknown][] {
  return Object.entries(payload).filter(([key]) => !(key in CLAIM_LABELS));
}
