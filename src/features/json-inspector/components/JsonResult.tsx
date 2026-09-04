import { AlertTriangle, ClipboardList, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useClipboard } from "@/hooks/useClipboard";
import type { JsonParseError, JsonStats, JsonStatus } from "../types";

interface JsonResultProps {
  status: JsonStatus;
  output: string;
  error: JsonParseError | null;
  stats: JsonStats | null;
}

function StatusBadge({ status }: { status: JsonStatus }) {
  if (status === "valid") return <Badge variant="success">Valid JSON</Badge>;
  if (status === "invalid") return <Badge variant="danger">Invalid JSON</Badge>;
  return <Badge>Empty</Badge>;
}

function downloadFile(contents: string, filename: string) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function JsonResult({ status, output, error, stats }: JsonResultProps) {
  const { copy, copied } = useClipboard();

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {stats && status !== "empty" && (
            <span className="text-xs text-muted-foreground">
              {stats.characters.toLocaleString()} chars · {stats.lines.toLocaleString()} lines ·{" "}
              {stats.bytes.toLocaleString()} bytes
            </span>
          )}
        </div>
        {status === "valid" && output && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => copy(output)}>
              <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadFile(output, "formatted.json")}
            >
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
          </div>
        )}
      </div>

      <div className="min-h-72 flex-1 rounded-md border border-border bg-muted/40 sm:min-h-96">
        {status === "empty" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
            <ClipboardList className="h-6 w-6" />
            <p>Paste or drop some JSON to get started.</p>
          </div>
        )}

        {status === "invalid" && error && (
          <div className="p-4">
            <Alert variant="danger">
              <AlertTriangle />
              <div>
                <AlertTitle>Invalid JSON</AlertTitle>
                <AlertDescription>
                  {error.message}
                  {error.line !== undefined && error.column !== undefined && (
                    <> — line {error.line}, column {error.column}.</>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          </div>
        )}

        {status === "valid" && (
          <div className="scrollbar-thin h-72 overflow-auto sm:h-96">
            <div className="flex min-w-full">
              <div
                aria-hidden
                className="sticky left-0 select-none border-r border-border bg-muted/40 px-2 py-4 text-right font-mono text-sm leading-6 text-muted-foreground"
              >
                {output.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre className="flex-1 whitespace-pre px-4 py-4 font-mono text-sm leading-6 text-surface-foreground">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}