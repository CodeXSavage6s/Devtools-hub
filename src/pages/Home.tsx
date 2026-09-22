import { useMemo, useState } from "react";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolSearch } from "@/components/shared/ToolSearch";
import { TOOLS, searchTools } from "@/lib/tools";
import { TOOL_CATEGORIES } from "@/types/tool";

export function Home() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => searchTools(TOOLS, query), [query]);

  const categorized = useMemo(
    () =>
      TOOL_CATEGORIES.map((category) => ({
        category,
        tools: filtered.filter((tool) => tool.category === category),
      })).filter((group) => group.tools.length > 0),
    [filtered]
  );

  return (
    <div className="space-y-10">
      <section className="max-w-2xl space-y-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Developer tools that stay in your browser.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          DevTools Hub is a small, fast collection of browser-based utilities — no account, no
          install. Your tool input is processed locally in your browser and is not sent to our
          servers.
        </p>
      </section>

      <ToolSearch value={query} onChange={setQuery} className="max-w-sm" />

      {categorized.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tools match "{query}". Try a different search term.
        </p>
      ) : (
        <div className="space-y-8">
          {categorized.map(({ category, tools }) => (
            <section key={category} className="space-y-3">
              <h2 className="font-display text-lg font-semibold tracking-tight">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
