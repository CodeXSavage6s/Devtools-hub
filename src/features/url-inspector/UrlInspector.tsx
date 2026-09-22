import { useMemo, useState } from "react";
import { ShieldAlert, ScanSearch, FileCode, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UrlInspectorResult } from "./components/UrlInspectorResult";
import { inspectUrl } from "./utils/inspect-url";

const EXAMPLE_URL = "https://user:password@example.com:8080/api/users?page=2&active=true#section";

export function UrlInspector() {
  const [input, setInput] = useState("");

  const result = useMemo(() => inspectUrl(input), [input]);

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <ShieldAlert />
        <div>
          <AlertTitle>URLs can carry sensitive data</AlertTitle>
          <AlertDescription>
            Be careful when sharing URLs. Query parameters, usernames, or paths may contain
            sensitive information. This tool only parses the URL's structure locally — it never
            fetches, pings, or otherwise contacts the URL you paste in.
          </AlertDescription>
        </div>
      </Alert>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="url-input" className="text-sm font-medium text-muted-foreground">
            URL
          </label>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setInput(EXAMPLE_URL)}>
              <FileCode className="h-3.5 w-3.5" /> Example
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setInput("")} disabled={!input}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </div>
        <Input
          id="url-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://user:password@example.com:8080/api/users?page=2#section"
          spellCheck={false}
          className="font-mono"
        />
      </div>

      {input.trim().length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted/40 p-10 text-center text-sm text-muted-foreground">
          <ScanSearch className="h-6 w-6" />
          <p>Paste a URL above to break it down into its parts.</p>
        </div>
      )}

      {result.error && input.trim().length > 0 && (
        <Alert variant="danger">
          <ShieldAlert />
          <div>
            <AlertTitle>Couldn't parse this URL</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
          </div>
        </Alert>
      )}

      {result.data && <UrlInspectorResult data={result.data} />}
    </div>
  );
}
