import { Braces, KeySquare, Link2, Hammer, ScanSearch, Binary, QrCode } from "lucide-react";
import type { ToolDefinition } from "@/types/tool";

/**
 * Single source of truth for every tool in the app. The homepage (cards +
 * search + category grouping) and the header's tools menu both read from
 * this list, so adding a new tool is: add an entry here, add its route in
 * App.tsx, and build the feature. Nothing else needs to change.
 */
export const TOOLS: ToolDefinition[] = [
  {
    id: "json-inspector",
    name: "JSON Inspector",
    description: "Format, validate, minify, and inspect JSON.",
    href: "/json-inspector",
    icon: Braces,
    category: "JSON & Data",
    keywords: ["json", "format", "formatter", "validate", "minify", "pretty print"],
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT headers and payloads and inspect their claims.",
    href: "/jwt-decoder",
    icon: KeySquare,
    category: "JSON & Data",
    keywords: ["jwt", "token", "auth", "claims", "bearer", "decode"],
  },
  {
    id: "url-encoder",
    name: "URL Encoder / Decoder",
    description: "Encode or decode URL components and full URLs safely.",
    href: "/url-encoder",
    icon: Link2,
    category: "URL Tools",
    keywords: ["url", "encode", "decode", "percent encoding", "uri", "query string"],
  },
  {
    id: "url-builder",
    name: "URL Builder",
    description: "Assemble a URL from a base, path, query parameters, and hash.",
    href: "/url-builder",
    icon: Hammer,
    category: "URL Tools",
    keywords: ["url", "builder", "query params", "generator", "search params"],
  },
  {
    id: "url-inspector",
    name: "URL Inspector",
    description: "Break a URL down into its protocol, host, path, and query parts.",
    href: "/url-inspector",
    icon: ScanSearch,
    category: "URL Tools",
    keywords: ["url", "parse", "inspect", "structure", "scanner", "host", "port"],
  },
  {
    id: "number-converter",
    name: "Number / IP Converter",
    description: "Convert between decimal, hex, and binary — including IPv4 addresses.",
    href: "/number-converter",
    icon: Binary,
    category: "Networking & Numbers",
    keywords: ["decimal", "hex", "hexadecimal", "binary", "ipv4", "ip address", "subnet"],
  },
  {
    id: "qr-code",
    name: "QR Code Generator / Scanner",
    description: "Generate a QR code from text or a URL, or scan one from an image or your camera.",
    href: "/qr-code",
    icon: QrCode,
    category: "Encoding & Media",
    keywords: ["qr", "qr code", "barcode", "scan", "camera", "generate"],
  },
];

export function searchTools(tools: ToolDefinition[], query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.description, tool.category, ...tool.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
