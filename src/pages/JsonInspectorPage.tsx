import { JsonInspector } from "@/features/json-inspector/JsonInspector";

export function JsonInspectorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          JSON Inspector
        </h1>
        <a href="https://www.json.org/json-en.html" className="text-sm text-yellow-600">Learn about JSON</a>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          Paste, format, minify, and validate JSON entirely in your browser.
        </p>
      </div>
      <JsonInspector />
    </div>
  );
}
