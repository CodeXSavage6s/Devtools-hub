import { useMemo, useState } from "react";
import { ShieldAlert, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import { DocsLink } from "@/components/shared/DocsLink";
import { JwtInput } from "./components/JwtInput";
import { JwtSection } from "./components/JwtSection";
import { ClaimsTable } from "./components/ClaimsTable";
import { buildClaims, decodeJwt, getOtherClaims } from "./utils/jwt";

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const { copy, copied } = useClipboard();

  const result = useMemo(() => {
    const trimmed = token.trim();
    if (trimmed.length === 0) return { state: "empty" as const };
    try {
      return { state: "decoded" as const, decoded: decodeJwt(trimmed) };
    } catch (error) {
      return {
        state: "error" as const,
        message: error instanceof Error ? error.message : "Couldn't decode this token.",
      };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <ShieldAlert />
        <div>
          <AlertTitle>This is a decoder, not a verifier</AlertTitle>
          <AlertDescription>
            Decoding a JWT does not verify its signature — anyone can decode a token, but only
            the holder of the correct key can confirm it's authentic. Don't paste sensitive
            production tokens into websites you don't trust.
          </AlertDescription>
        </div>
      </Alert>

      <JwtInput value={token} onChange={setToken} />

      {result.state === "empty" && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted/40 p-10 text-center text-sm text-muted-foreground">
          <KeyRound className="h-6 w-6" />
          <p>Paste a JWT above to decode its header, payload, and claims.</p>
        </div>
      )}

      {result.state === "error" && (
        <Alert variant="danger">
          <ShieldAlert />
          <div>
            <AlertTitle>Couldn't decode this token</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </div>
        </Alert>
      )}

      {result.state === "decoded" && (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Claims</p>
            <ClaimsTable
              claims={buildClaims(result.decoded.payload)}
              otherClaims={getOtherClaims(result.decoded.payload)}
            />
          </div>

          <Tabs defaultValue="header">
            <TabsList>
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="header">
              <JwtSection title="Decoded header" data={result.decoded.header} />
            </TabsContent>
            <TabsContent value="payload">
              <JwtSection title="Decoded payload" data={result.decoded.payload} />
            </TabsContent>
            <TabsContent value="signature">
              <Card>
                <CardContent className="space-y-3 pt-5">
                  <p className="text-sm text-muted-foreground">
                    The signature is a cryptographic value used to verify the token's integrity
                    and authenticity — it isn't encoded data, so it can't be "decoded" like the
                    header and payload. This tool displays the signature but does not verify it:
                    doing so requires the issuer's original secret or public key, which this tool
                    doesn't have and never asks for.
                  </p>
                  <div className="flex items-start justify-between gap-3 rounded-md bg-muted/40 p-3">
                    <span className="break-all font-mono text-xs">
                      {result.decoded.signature}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copy(result.decoded.signature)}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <DocsLink label="jwt.io introduction" href="https://jwt.io/introduction" />
      <DocsLink label="RFC 7519 spec" href="https://www.rfc-editor.org/rfc/rfc7519" />
    </div>
  );
}
