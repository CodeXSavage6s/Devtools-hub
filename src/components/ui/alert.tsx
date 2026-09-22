import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex gap-3 rounded-md border p-4 text-sm [&_svg]:mt-0.5 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground [&_svg]:text-muted-foreground",
        danger: "border-danger/30 bg-danger/10 text-danger [&_svg]:text-danger",
        success:
          "border-success/30 bg-success/10 text-success [&_svg]:text-success",
        // Note: intentionally NOT text-accent-foreground — that token is
        // designed for text on top of a solid accent-colored button and is
        // near-black, which is almost invisible against a dark background.
        warning: "border-accent/30 bg-accent/10 text-foreground [&_svg]:text-accent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-medium leading-none", className)} {...props} />;
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  // A fixed gray (rather than inheriting the variant's title color) keeps
  // body copy legible in both themes without fighting each variant's
  // accent color — this is the same fix applied by hand to the JWT
  // decoder's warning alert; it's now built into the component everywhere.
  return (
    <p
      className={cn(
        "mt-1 text-sm text-gray-500 dark:text-gray-400 [&:first-child]:mt-0",
        className
      )}
      {...props}
    />
  );
}
