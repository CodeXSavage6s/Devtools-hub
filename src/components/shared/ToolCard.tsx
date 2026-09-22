import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import type { ToolDefinition } from "@/types/tool";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;

  return (
    <Card className="flex flex-col justify-between transition-colors hover:border-accent/40 focus-within:border-accent/40">
      <CardHeader>
        <div className="mb-1 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <Badge className="hidden sm:inline-flex">{tool.category}</Badge>
        </div>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          to={tool.href}
          className={buttonVariants({ variant: "outline", className: "w-full justify-between" })}
        >
          Open tool
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
