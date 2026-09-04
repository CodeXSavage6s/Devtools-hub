import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ClaimInfo } from "../types";

interface ClaimsTableProps {
  claims: ClaimInfo[];
  otherClaims: [string, unknown][];
}

function formatOtherValue(value: unknown): string {
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return JSON.stringify(value);
  }
  return String(value);
}

export function ClaimsTable({ claims, otherClaims }: ClaimsTableProps) {
  if (claims.length === 0 && otherClaims.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This token doesn't carry any claims in its payload.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {claims.map((claim) => (
        <div
          key={claim.key}
          className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium">{claim.label}</p>
            <p className="text-xs text-muted-foreground">{claim.key}</p>
          </div>
          <div className="flex items-center gap-2 sm:text-right">
            <div>
              <p className="font-mono text-sm">{claim.display}</p>
              {claim.timestampDisplay && (
                <p className="text-xs text-muted-foreground">{claim.timestampDisplay}</p>
              )}
            </div>
            {claim.isExpiry && (
              <Badge variant={claim.expired ? "danger" : "success"}>
                {claim.expired ? "Expired" : "Not expired"}
              </Badge>
            )}
          </div>
        </div>
      ))}

      {otherClaims.length > 0 && (
        <div className="px-4 py-3">
          {claims.length > 0 && <Separator className="mb-3" />}
          <p className="mb-2 text-sm font-medium">Other claims</p>
          <div className="space-y-1.5">
            {otherClaims.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="font-mono text-xs text-muted-foreground">{key}</span>
                <span className="break-all font-mono text-sm">{formatOtherValue(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
