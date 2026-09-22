import { QrCode } from "@/features/qr-code/QrCode";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function QrCodePage() {
  useDocumentTitle("QR Code Generator & Scanner | DevTools Hub");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          QR Code Generator / Scanner
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Generate a QR code from text or a URL, or scan one from an image or your camera — all
          decoded locally in your browser.
        </p>
      </div>
      <QrCode />
    </div>
  );
}
