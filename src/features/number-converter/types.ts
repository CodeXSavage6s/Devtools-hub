export type NumberBase = "decimal" | "hex" | "binary";
export type Ipv4Format = "ipv4" | "decimal" | "hex";

export interface NumberConversionResult {
  decimal: string;
  hex: string;
  binary: string;
  error: string | null;
}

export interface Ipv4ConversionResult {
  ipv4: string;
  decimal: string;
  hex: string;
  binary: string;
  error: string | null;
}
