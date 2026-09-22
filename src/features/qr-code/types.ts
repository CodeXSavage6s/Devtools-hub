export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrGenerateOptions {
  size: number;
  errorCorrectionLevel: QrErrorCorrectionLevel;
  darkColor: string;
  lightColor: string;
}

export type ScanSource = "upload" | "camera";
