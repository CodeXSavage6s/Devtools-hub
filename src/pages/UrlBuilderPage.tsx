import { UrlBuilder } from "@/features/url-builder/UrlBuilder";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UrlBuilderPage() {
  useDocumentTitle("URL Builder | DevTools Hub");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          URL Builder
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Assemble a URL from a base, path, query parameters, and hash — with correct encoding.
        </p>
      </div>
      <UrlBuilder />
    </div>
  );
}
