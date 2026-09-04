import { useCallback, useState } from "react";
import { useToast } from "./useToast";

export function useClipboard(resetAfterMs = 1800) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const copy = useCallback(
    async (text: string, successMessage = "Copied to clipboard") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        showToast(successMessage, "success");
        window.setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch {
        showToast("Couldn't copy — check clipboard permissions", "error");
        return false;
      }
    },
    [resetAfterMs, showToast]
  );

  return { copy, copied };
}
