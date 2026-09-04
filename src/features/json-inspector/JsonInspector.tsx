import { useMemo, useState } from "react";
import { JsonEditor } from "./components/JsonEditor";
import { JsonResult } from "./components/JsonResult";
import { JsonToolbar } from "./components/JsonToolbar";
import { EXAMPLE_JSON, computeStats, formatJson, minifyJson, parseJson } from "./utils/json";
import { useToast } from "@/hooks/useToast";
import type { JsonStatus } from "./types";

type OutputMode = "format" | "minify";

export function JsonInspector() {
  const [input, setInput] = useState("");
  const [outputMode, setOutputMode] = useState<OutputMode>("format");
  const { showToast } = useToast();

  const { status, output, error, stats } = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return { status: "empty" as JsonStatus, output: "", error: null, stats: null };
    }

    const parsed = parseJson(input);
    if ("error" in parsed) {
      return {
        status: "invalid" as JsonStatus,
        output: "",
        error: parsed.error,
        stats: computeStats(input),
      };
    }

    const rendered = outputMode === "format" ? formatJson(input) : minifyJson(input);
    return {
      status: "valid" as JsonStatus,
      output: rendered,
      error: null,
      stats: computeStats(rendered),
    };
  }, [input, outputMode]);

  const handleValidate = () => {
    if (status === "empty") {
      showToast("Nothing to validate yet", "info");
    } else if (status === "valid") {
      showToast("Valid JSON", "success");
    } else if (error) {
      const location =
        error.line !== undefined ? ` (line ${error.line}, column ${error.column})` : "";
      showToast(`Invalid JSON: ${error.message}${location}`, "error");
    }
  };

  return (
    <div className="space-y-4 ">
      <JsonToolbar
        disabled={status === "empty"}
        onFormat={() => setOutputMode("format")}
        onMinify={() => setOutputMode("minify")}
        onValidate={handleValidate}
        onClear={() => setInput("")}
        onLoadExample={() => setInput(EXAMPLE_JSON)}
        onFileLoaded={(contents) => setInput(contents)}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground">Input</p>
          <JsonEditor
            value={input}
            onChange={setInput}
            onFileLoaded={(contents) => setInput(contents)}
          />
        </div>
        <div className="space-y-2 overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground">
            {outputMode === "format" ? "Formatted output" : "Minified output"}
          </p>
          <JsonResult status={status} output={output} error={error} stats={stats} />
        </div>
      </div>
    </div>
  );
}
