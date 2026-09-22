import { UrlInspector } from "@/features/url-inspector/UrlInspector";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UrlInspectorPage() {
  useDocumentTitle("URL Inspector | DevTools Hub");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          URL Inspector
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Break a URL down into its protocol, host, path, query, and hash — parsed locally.
        </p>
      </div>
      <UrlInspector />
    </div>
  );
}
