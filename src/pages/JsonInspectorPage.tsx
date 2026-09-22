import { JsonInspector } from "@/features/json-inspector/JsonInspector";
import { DocsLink } from "@/components/shared/DocsLink";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function JsonInspectorPage() {
  useDocumentTitle("JSON Inspector & Formatter | DevTools Hub");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          JSON Inspector
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Paste, format, minify, and validate JSON entirely in your browser.
        </p>
      </div>
      <JsonInspector />
      <DocsLink href="https://www.json.org/json-en.html" label="JSON specification (json.org)" />
    </div>
  );
}
