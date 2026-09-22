import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";

interface ResultFieldProps {
  label: string;
  value: string;
  active?: boolean;
}

export function ResultField({ label, value, active }: ResultFieldProps) {
  const { copy, copied } = useClipboard();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {label} {active && <span className="text-xs text-accent">(input)</span>}
        </p>
        {value && (
          <Button size="sm" variant="ghost" onClick={() => copy(value)}>
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      <div className="min-h-9 break-all rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}
