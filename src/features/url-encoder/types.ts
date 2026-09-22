export type EncodingMode = "component" | "full";
export type EncodingOperation = "encode" | "decode";

export interface EncodingResult {
  output: string;
  error: string | null;
}
