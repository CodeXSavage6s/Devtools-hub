import QRCode from "qrcode";
import type { QrGenerateOptions } from "../types";

export type GenerateResult = { dataUrl: string; error: null } | { dataUrl: null; error: string };

/**
 * Renders a QR code to a PNG data URL. Colors are intentionally fixed to
 * dark-on-white regardless of the site's theme — real-world scanners rely
 * on strong, predictable contrast, and a code inverted for dark mode is a
 * common cause of "why won't this scan" bug reports.
 */
export async function generateQrDataUrl(
  text: string,
  options: QrGenerateOptions
): Promise<GenerateResult> {
  if (text.length === 0) {
    return { dataUrl: null, error: null };
  }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: options.errorCorrectionLevel,
      width: options.size,
      margin: 2,
      color: { dark: "#101114", light: "#ffffff" },
    });
    return { dataUrl, error: null };
  } catch (error) {
    return {
      dataUrl: null,
      error:
        error instanceof Error
          ? error.message
          : "Couldn't generate a QR code for this input.",
    };
  }
}
