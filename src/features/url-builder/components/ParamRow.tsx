import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { QueryParam } from "../types";

interface ParamRowProps {
  param: QueryParam;
  onChange: (param: QueryParam) => void;
  onRemove: () => void;
}

export function ParamRow({ param, onChange, onRemove }: ParamRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
      <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border">
        <input
          type="checkbox"
          checked={param.enabled}
          onChange={(e) => onChange({ ...param, enabled: e.target.checked })}
          aria-label={param.key ? `Enable parameter ${param.key}` : "Enable parameter"}
          className="h-4 w-4 accent-accent"
        />
      </label>
      <Input
        value={param.key}
        onChange={(e) => onChange({ ...param, key: e.target.value })}
        placeholder="key"
        aria-label="Parameter key"
        className={cn("min-w-0 flex-1 font-mono", !param.enabled && "opacity-50")}
      />
      <Input
        value={param.value}
        onChange={(e) => onChange({ ...param, value: e.target.value })}
        placeholder="value"
        aria-label="Parameter value"
        className={cn("min-w-0 flex-1 font-mono", !param.enabled && "opacity-50")}
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemove}
        aria-label="Remove parameter"
        className="shrink-0 text-muted-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
