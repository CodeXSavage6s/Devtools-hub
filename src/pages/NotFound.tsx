import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Compass className="h-8 w-8 text-muted-foreground" />
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          There's no tool at this address. Head back to the homepage.
        </p>
      </div>
      <Link to="/" className={buttonVariants({ variant: "default" })}>
        Back to home
      </Link>
    </div>
  );
}
