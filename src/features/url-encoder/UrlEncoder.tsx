import { useState } from "react";
import { ArrowLeftRight, Copy, Trash2, FileCode, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useClipboard } from "@/hooks/useClipboard";
import { ReservedCharacters } from "./components/ReservedCharacters";
import { transformUrlText, EXAMPLES } from "./utils/url-encoding";
import type { EncodingMode } from "./types";

export function UrlEncoder() {
  const [mode, setMode] = useState<EncodingMode>("component");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { copy, copied } = useClipboard();

  const runEncode = () => {
    const result = transformUrlText(input, mode, "encode");
    setOutput(result.output);
    setError(result.error);
  };

  const runDecode = () => {
    const result = transformUrlText(input, mode, "decode");
    setOutput(result.output);
    setError(result.error);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setError(null);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(EXAMPLES[mode]);
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as EncodingMode);
            setOutput("");
            setError(null);
          }}
        >
          <TabsList>
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="full">Full URL</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          {mode === "component"
            ? "Use for a single query value — encodes &, =, ?, #, and spaces."
            : "Use for a whole URL — leaves : / ? # & = alone, encodes only unsafe characters."}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">Input</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={runEncode} disabled={!input}>
              Encode
            </Button>
            <Button size="sm" variant="outline" onClick={runDecode} disabled={!input}>
              Decode
            </Button>
            <Button size="sm" variant="outline" onClick={handleExample}>
              <FileCode className="h-3.5 w-3.5" /> Example
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "component"
              ? "John Doe & Jane's Café? 50% off"
              : "https://example.com/search?q=hello world"
          }
          spellCheck={false}
          className="h-32 scrollbar-thin"
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">Result</p>
          {output && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSwap}>
                <ArrowLeftRight className="h-3.5 w-3.5" /> Use as input
              </Button>
              <Button size="sm" variant="outline" onClick={() => copy(output)}>
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}
        </div>

        {error ? (
          <Alert variant="danger">
            <Info />
            <div>
              <AlertTitle>Couldn't decode this</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        ) : (
          <Textarea
            readOnly
            value={output}
            placeholder="Result will appear here"
            className="h-32 scrollbar-thin bg-muted/40"
          />
        )}
      </div>

      <Alert>
        <Info />
        <div>
          <AlertTitle>encodeURI vs. encodeURIComponent</AlertTitle>
          <AlertDescription>
            <code className="font-mono">encodeURIComponent</code> (Component mode) escapes
            everything except letters, digits, and{" "}
            <code className="font-mono">- _ . ! ~ * ' ( )</code> — safe for a single value
            that's going into a query string. <code className="font-mono">encodeURI</code>{" "}
            (Full URL mode) additionally leaves URL-structural characters like{" "}
            <code className="font-mono">: / ? # [ ] @ & = + $ , ;</code> untouched, since
            encoding those would break the URL itself. Running Encode on text that's already
            encoded will double-encode it (e.g. <code className="font-mono">%20</code> becomes{" "}
            <code className="font-mono">%2520</code>) — if you're unsure, try Decode first.
          </AlertDescription>
        </div>
      </Alert>

      <ReservedCharacters />
    </div>
  );
}
