import type { LucideIcon } from "lucide-react";

export type ToolCategory = "JSON & Data" | "URL Tools" | "Networking & Numbers" | "Encoding & Media";

export const TOOL_CATEGORIES: ToolCategory[] = [
  "JSON & Data",
  "URL Tools",
  "Networking & Numbers",
  "Encoding & Media",
];

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: ToolCategory;
  /** Extra terms that should match this tool in search, beyond name/description. */
  keywords: string[];
}
