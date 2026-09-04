export type JsonStatus = "empty" | "valid" | "invalid";

export interface JsonParseError {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonStats {
  characters: number;
  lines: number;
  bytes: number;
}
