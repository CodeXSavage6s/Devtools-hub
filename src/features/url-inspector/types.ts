export interface ParsedUrlInfo {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  searchParams: [string, string][];
  hash: string;
  origin: string;
}
