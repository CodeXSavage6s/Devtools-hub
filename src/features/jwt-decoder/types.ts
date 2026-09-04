export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export interface JwtDecodeError {
  message: string;
}

export interface ClaimInfo {
  key: string;
  label: string;
  value: unknown;
  display: string;
  isTimestamp?: boolean;
  timestampDisplay?: string;
  isExpiry?: boolean;
  expired?: boolean;
}
