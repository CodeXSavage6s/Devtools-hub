import type { ParsedUrlInfo } from "../types";

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span
        className={`break-all font-mono text-sm ${muted ? "text-muted-foreground" : "text-foreground"}`}
      >
        {value || <span className="text-muted-foreground">Not present</span>}
      </span>
    </div>
  );
}

export function UrlInspectorResult({ data }: { data: ParsedUrlInfo }) {
  return (
    <div className="space-y-4">
      <div className="divide-y divide-border rounded-md border border-border">
        <Row label="Protocol" value={data.protocol} />
        <Row label="Username" value={data.username} />
        <Row label="Password" value={data.password} />
        <Row label="Hostname" value={data.hostname} />
        <Row label="Port" value={data.port || "(default for protocol)"} muted={!data.port} />
        <Row label="Path" value={data.pathname} />
        <Row label="Hash" value={data.hash} />
      </div>

      <div className="rounded-md border border-border">
        <div className="border-b border-border px-4 py-2.5">
          <p className="text-sm font-medium text-muted-foreground">
            Query parameters {data.searchParams.length > 0 && `(${data.searchParams.length})`}
          </p>
        </div>
        {data.searchParams.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">No query parameters.</p>
        ) : (
          <div className="divide-y divide-border">
            {data.searchParams.map(([key, value], index) => (
              <div
                key={`${key}-${index}`}
                className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span className="font-mono text-sm text-muted-foreground">{key}</span>
                <span className="break-all font-mono text-sm">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
