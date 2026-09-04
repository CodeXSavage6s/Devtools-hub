import { JsonInspector } from "@/features/json-inspector/JsonInspector";

export function JsonInspectorPage() {
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
    </div>
  );
}
