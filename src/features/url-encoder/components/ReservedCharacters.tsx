import { RESERVED_CHARACTERS } from "../utils/url-encoding";

export function ReservedCharacters() {
  return (
    <div className="rounded-md border border-border">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium">Reserved URL characters</p>
        <p className="text-xs text-muted-foreground">
          These carry structural meaning in a URL, so component-encoding escapes them.
        </p>
      </div>
      <div className="divide-y divide-border">
        {RESERVED_CHARACTERS.map((item) => (
          <div
            key={item.char}
            className="flex items-center gap-4 px-4 py-2 text-sm"
          >
            <span className="w-6 shrink-0 font-mono text-foreground">
              {item.char === " " ? "␠" : item.char}
            </span>
            <span className="w-14 shrink-0 font-mono text-muted-foreground">{item.encoded}</span>
            <span className="text-muted-foreground">{item.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
