import { FileCode, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Header + payload are real base64url-encoded JSON; exp is set well into
// the future (2030) so the example doesn't show as expired. The signature
// segment is a placeholder — this tool never verifies signatures anyway.
const EXAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoiZGV2dG9vbHMtaHViIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE4OTM0NTYwMDB9." +
  "4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ";

interface JwtInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JwtInput({ value, onChange }: JwtInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">Token</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onChange(EXAMPLE_JWT)}>
            <FileCode className="h-3.5 w-3.5" /> Load example
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onChange("")} disabled={!value}>
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
        spellCheck={false}
        className="h-28 scrollbar-thin"
      />
    </div>
  );
}
