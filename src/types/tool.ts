import type { LucideIcon } from "lucide-react";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}
