import { useMemo, useState } from "react";
import { Plus, Copy, Trash2, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "@/hooks/useClipboard";
import { ParamRow } from "./components/ParamRow";
import { buildUrl, createEmptyParam } from "./utils/build-url";
import type { QueryParam } from "./types";

const EXAMPLE = {
  base: "https://api.example.com",
  path: "users",
  hash: "",
  params: [
    { id: "example-1", key: "page", value: "2", enabled: true },
    { id: "example-2", key: "search", value: "John Doe", enabled: true },
    { id: "example-3", key: "filter", value: "active", enabled: true },
  ] as QueryParam[],
};

export function UrlBuilder() {
  const [base, setBase] = useState("");
  const [path, setPath] = useState("");
  const [hash, setHash] = useState("");
  const [params, setParams] = useState<QueryParam[]>([createEmptyParam()]);
  const { copy, copied } = useClipboard();

  const result = useMemo(() => buildUrl(base, path, params, hash), [base, path, params, hash]);

  const updateParam = (updated: QueryParam) => {
    setParams((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const removeParam = (id: string) => {
    setParams((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClear = () => {
    setBase("");
    setPath("");
    setHash("");
    setParams([createEmptyParam()]);
  };

  const handleExample = () => {
    setBase(EXAMPLE.base);
    setPath(EXAMPLE.path);
    setHash(EXAMPLE.hash);
    setParams(EXAMPLE.params);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="base-url" className="text-sm font-medium text-muted-foreground">
              Base URL
            </label>
            <Input
              id="base-url"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="https://api.example.com"
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="path" className="text-sm font-medium text-muted-foreground">
              Path
            </label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="users"
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Query parameters</p>
            <Button size="sm" variant="outline" onClick={() => setParams((p) => [...p, createEmptyParam()])}>
              <Plus className="h-3.5 w-3.5" /> Add parameter
            </Button>
          </div>
          <div className="space-y-2">
            {params.map((param) => (
              <ParamRow
                key={param.id}
                param={param}
                onChange={updateParam}
                onRemove={() => removeParam(param.id)}
              />
            ))}
            {params.length === 0 && (
              <p className="text-sm text-muted-foreground">No parameters yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hash" className="text-sm font-medium text-muted-foreground">
            Fragment / hash
          </label>
          <Input
            id="hash"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="section-2"
            className="max-w-xs font-mono"
          />
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleExample}>
            <FileCode className="h-3.5 w-3.5" /> Example
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Generated URL</p>
          {result.url && (
            <Button size="sm" variant="outline" onClick={() => copy(result.url!)}>
              <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>
        <div className="min-h-24 rounded-md border border-border bg-muted/40 p-4">
          {result.error ? (
            <p className="text-sm text-muted-foreground">{result.error}</p>
          ) : (
            <p className="break-all font-mono text-sm leading-relaxed text-surface-foreground">
              {result.url}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
