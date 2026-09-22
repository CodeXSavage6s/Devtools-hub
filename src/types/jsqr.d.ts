// jsqr doesn't ship its own TypeScript types, and depending on a
// third-party @types package that may or may not exist on the registry
// isn't worth the risk for the couple of functions we actually use.
declare module "jsqr" {
  export interface QRPoint {
    x: number;
    y: number;
  }

  export interface QRCodeLocation {
    topLeftCorner: QRPoint;
    topRightCorner: QRPoint;
    bottomLeftCorner: QRPoint;
    bottomRightCorner: QRPoint;
  }

  export interface QRCode {
    binaryData: number[];
    data: string;
    chunks: unknown[];
    location: QRCodeLocation;
  }

  export type BinarizeOptions = "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst";

  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: { inversionAttempts?: BinarizeOptions }
  ): QRCode | null;
}
