import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ResultField } from "./components/ResultField";
import { convertNumber } from "./utils/number-base";
import { convertIpv4 } from "./utils/ipv4";
import type { Ipv4Format, NumberBase } from "./types";

const NUMBER_BASE_LABELS: Record<NumberBase, string> = {
  decimal: "Decimal",
  hex: "Hexadecimal",
  binary: "Binary",
};

const NUMBER_PLACEHOLDERS: Record<NumberBase, string> = {
  decimal: "255",
  hex: "FF",
  binary: "11111111",
};

const IPV4_FORMAT_LABELS: Record<Ipv4Format, string> = {
  ipv4: "IPv4",
  decimal: "Decimal",
  hex: "Hexadecimal",
};

const IPV4_PLACEHOLDERS: Record<Ipv4Format, string> = {
  ipv4: "192.168.1.10",
  decimal: "3232235786",
  hex: "C0A8010A",
};

function NumberBaseConverter() {
  const [fromBase, setFromBase] = useState<NumberBase>("decimal");
  const [value, setValue] = useState("");

  const result = useMemo(() => convertNumber(value, fromBase), [value, fromBase]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="number-input" className="text-sm font-medium text-muted-foreground">
            Value
          </label>
          <Tabs
            value={fromBase}
            onValueChange={(v) => {
              setFromBase(v as NumberBase);
              setValue("");
            }}
          >
            <TabsList>
              {(Object.keys(NUMBER_BASE_LABELS) as NumberBase[]).map((base) => (
                <TabsTrigger key={base} value={base}>
                  {NUMBER_BASE_LABELS[base]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Input
          id="number-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={NUMBER_PLACEHOLDERS[fromBase]}
          spellCheck={false}
          className="font-mono"
        />
      </div>

      {result.error ? (
        <Alert variant="danger">
          <Info />
          <div>
            <AlertTitle>Invalid input</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
          </div>
        </Alert>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <ResultField label="Decimal" value={result.decimal} active={fromBase === "decimal"} />
          <ResultField label="Hexadecimal" value={result.hex} active={fromBase === "hex"} />
          <ResultField label="Binary" value={result.binary} active={fromBase === "binary"} />
        </div>
      )}
    </div>
  );
}

function Ipv4Converter() {
  const [format, setFormat] = useState<Ipv4Format>("ipv4");
  const [value, setValue] = useState("");

  const result = useMemo(() => convertIpv4(value, format), [value, format]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="ipv4-input" className="text-sm font-medium text-muted-foreground">
            Value
          </label>
          <Tabs
            value={format}
            onValueChange={(v) => {
              setFormat(v as Ipv4Format);
              setValue("");
            }}
          >
            <TabsList>
              {(Object.keys(IPV4_FORMAT_LABELS) as Ipv4Format[]).map((f) => (
                <TabsTrigger key={f} value={f}>
                  {IPV4_FORMAT_LABELS[f]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Input
          id="ipv4-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={IPV4_PLACEHOLDERS[format]}
          spellCheck={false}
          className="font-mono"
        />
      </div>

      {result.error ? (
        <Alert variant="danger">
          <Info />
          <div>
            <AlertTitle>Invalid input</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
          </div>
        </Alert>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultField label="IPv4" value={result.ipv4} active={format === "ipv4"} />
          <ResultField label="Decimal" value={result.decimal} active={format === "decimal"} />
          <ResultField label="Hexadecimal" value={result.hex} active={format === "hex"} />
          <ResultField label="Binary (dotted)" value={result.binary} />
        </div>
      )}

      <Alert>
        <Info />
        <div>
          <AlertTitle>How this maps to 32 bits</AlertTitle>
          <AlertDescription>
            An IPv4 address is four 8-bit octets (0–255 each), which together form a single
            32-bit number — that's why the decimal form tops out at 4,294,967,295. Converting
            between forms is just re-reading those same 32 bits as decimal, hex, or binary.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

export function NumberConverter() {
  return (
    <Tabs defaultValue="numbers">
      <TabsList>
        <TabsTrigger value="numbers">Number conversion</TabsTrigger>
        <TabsTrigger value="ipv4">IPv4 conversion</TabsTrigger>
      </TabsList>
      <TabsContent value="numbers">
        <NumberBaseConverter />
      </TabsContent>
      <TabsContent value="ipv4">
        <Ipv4Converter />
      </TabsContent>
    </Tabs>
  );
}
