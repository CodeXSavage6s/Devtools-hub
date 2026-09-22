import { NumberConverter } from "@/features/number-converter/NumberConverter";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NumberConverterPage() {
  useDocumentTitle("Decimal, Hex & Binary Converter | DevTools Hub");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Number / IP Converter
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Convert between decimal, hexadecimal, and binary — including IPv4 addresses.
        </p>
      </div>
      <NumberConverter />
    </div>
  );
}
