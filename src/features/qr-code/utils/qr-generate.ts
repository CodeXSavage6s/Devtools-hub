import QRCode from "qrcode";
import type { QrGenerateOptions } from "../types";

/**
 * Wraps the `qrcode` library so the rest of the feature doesn't need to
 * know its option shape. Both calls can throw (e.g. text too long for the
 * chosen error-correction level) — callers are expected to catch that.
 */
export async function generateQrPngDataUrl(
  text: string,
  options: QrGenerateOptions
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options.size,
    margin: 2,
    errorCorrectionLevel: options.errorCorrectionLevel,
    color: { dark: options.darkColor, light: options.lightColor },
  });
}

export async function generateQrSvgString(
  text: string,
  options: QrGenerateOptions
): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: 2,
    errorCorrectionLevel: options.errorCorrectionLevel,
    color: { dark: options.darkColor, light: options.lightColor },
  });
}

export const DEFAULT_QR_OPTIONS: QrGenerateOptions = {
  size: 320,
  errorCorrectionLevel: "M",
  darkColor: "#000000",
  lightColor: "#ffffff",
};
