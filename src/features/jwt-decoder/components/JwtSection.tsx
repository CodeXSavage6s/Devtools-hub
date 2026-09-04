import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";

interface JwtSectionProps {
  title: string;
  data: Record<string, unknown>;
}

export function JwtSection({ title, data }: JwtSectionProps) {
  const { copy, copied } = useClipboard();
  const json = JSON.stringify(data, null, 2);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Button size="sm" variant="ghost" onClick={() => copy(json)}>
          <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="scrollbar-thin max-h-64 overflow-auto rounded-md bg-muted/40 p-3 font-mono text-sm leading-relaxed">
          {json}
        </pre>
      </CardContent>
    </Card>
  );
}
