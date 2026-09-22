import { useEffect, useState } from "react";
import { Download, FileCode, Trash2, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateQrPngDataUrl, generateQrSvgString, DEFAULT_QR_OPTIONS } from "../utils/qr-generate";
import type { QrErrorCorrectionLevel } from "../types";

const SIZE_OPTIONS = [
  { label: "Small", value: 200 },
  { label: "Medium", value: 320 },
  { label: "Large", value: 480 },
];

const ECC_LEVELS: { value: QrErrorCorrectionLevel; label: string }[] = [
  { value: "L", label: "L (7%)" },
  { value: "M", label: "M (15%)" },
  { value: "Q", label: "Q (25%)" },
  { value: "H", label: "H (30%)" },
];

const EXAMPLE_TEXT = "https://example.com";

export function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(DEFAULT_QR_OPTIONS.size);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<QrErrorCorrectionLevel>(
    DEFAULT_QR_OPTIONS.errorCorrectionLevel
  );
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (text.trim().length === 0) {
      setPngDataUrl(null);
      setSvgString(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const options = { size, errorCorrectionLevel, darkColor: "#000000", lightColor: "#ffffff" };

    // A short debounce so we're not regenerating on every keystroke while
    // typing a long URL.
    const timeout = window.setTimeout(async () => {
      try {
        const [png, svg] = await Promise.all([
          generateQrPngDataUrl(text, options),
          generateQrSvgString(text, options),
        ]);
        if (!cancelled) {
          setPngDataUrl(png);
          setSvgString(svg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setPngDataUrl(null);
          setSvgString(null);
          setError(
            err instanceof Error
              ? err.message
              : "Couldn't generate a QR code for this input."
          );
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [text, size, errorCorrectionLevel]);

  const downloadPng = () => {
    if (!pngDataUrl) return;
    const link = document.createElement("a");
    link.href = pngDataUrl;
    link.download = "qr-code.png";
    link.click();
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">Text or URL</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setText(EXAMPLE_TEXT)}>
                <FileCode className="h-3.5 w-3.5" /> Example
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setText("")} disabled={!text}>
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com or any text"
            spellCheck={false}
            className="h-28 scrollbar-thin"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Size</p>
          <Tabs value={String(size)} onValueChange={(v) => setSize(Number(v))}>
            <TabsList>
              {SIZE_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Error correction</p>
          <Tabs
            value={errorCorrectionLevel}
            onValueChange={(v) => setErrorCorrectionLevel(v as QrErrorCorrectionLevel)}
          >
            <TabsList>
              {ECC_LEVELS.map((level) => (
                <TabsTrigger key={level.value} value={level.value}>
                  {level.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            Higher levels stay scannable even if part of the code is damaged or obscured, at the
            cost of a denser pattern.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Preview</p>
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-md border border-border bg-muted/40 p-6">
          {error ? (
            <Alert variant="danger">
              <AlertTriangle />
              <div>
                <AlertTitle>Couldn't generate this QR code</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          ) : pngDataUrl ? (
            <>
              <img
                src={pngDataUrl}
                alt="Generated QR code"
                className="max-w-full rounded-md bg-white p-2"
                width={size}
                height={size}
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={downloadPng}>
                  <Download className="h-3.5 w-3.5" /> PNG
                </Button>
                <Button size="sm" variant="outline" onClick={downloadSvg}>
                  <Download className="h-3.5 w-3.5" /> SVG
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Enter some text or a URL to generate a QR code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
