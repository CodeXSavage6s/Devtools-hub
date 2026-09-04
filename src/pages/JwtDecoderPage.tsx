import { JwtDecoder } from "@/features/jwt-decoder/JwtDecoder";

export function JwtDecoderPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          JWT Decoder
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Decode a JWT's header and payload, and inspect its claims — locally, in your browser.
        </p>
      </div>
      <JwtDecoder />
    </div>
  );
}
