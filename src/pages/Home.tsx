import { Braces, KeySquare } from "lucide-react";
import { ToolCard } from "@/components/shared/ToolCard";
import type { ToolDefinition } from "@/types/tool";

const TOOLS: ToolDefinition[] = [
  {
    id: "json-inspector",
    name: "JSON Inspector",
    description: "Format, validate, minify, and inspect JSON.",
    href: "/json-inspector",
    icon: Braces,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT headers and payloads and inspect their claims.",
    href: "/jwt-decoder",
    icon: KeySquare,
  },
];

export function Home() {
  return (
    <div className="space-y-12">
      <section className="max-w-2xl space-y-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple tools for developers.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          DevTools Hub is a small collection of lightweight, browser-based utilities. Nothing you
          paste in ever leaves your machine — there's no server, no account, and no tracking.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </section>
    </div>
  );
}
