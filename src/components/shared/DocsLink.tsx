import { ExternalLink } from "lucide-react";

interface DocLink {
  label: string;
  href: string;
}

export function DocsLink({ label, href }: { DocLink }) {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <ExternalLink className="h-3 w-3" /> Docs:
      </span>
        <span key={href} className="inline-flex items-center gap-1.5">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {label}
          </a>
           <span aria-hidden>·</span>
        </span>
    </p>
  );
}
