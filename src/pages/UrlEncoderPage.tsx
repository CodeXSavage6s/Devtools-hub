import { UrlEncoder } from "@/features/url-encoder/UrlEncoder";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UrlEncoderPage() {
  useDocumentTitle("URL Encoder & Decoder | DevTools Hub");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          URL Encoder / Decoder
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Percent-encode or decode a single value or a whole URL, entirely in your browser.
        </p>
      </div>
      <UrlEncoder />
    </div>
  );
}
