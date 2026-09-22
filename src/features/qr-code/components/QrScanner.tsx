import { useEffect, useRef, useState } from "react";
import { Camera, Copy, Upload, RotateCcw, VideoOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useClipboard } from "@/hooks/useClipboard";
import { decodeImageData, getImageDataFromImage, loadImageFile } from "../utils/qr-scan";

type CameraState = "idle" | "starting" | "active" | "error";

function ResultPanel({ text, onReset }: { text: string; onReset: () => void }) {
  const { copy, copied } = useClipboard();
  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/40 p-4">
      <p className="text-sm font-medium text-muted-foreground">Decoded content</p>
      <p className="break-all rounded-md bg-surface p-3 font-mono text-sm">{text}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => copy(text)}>
          <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" /> Scan another
        </Button>
      </div>
    </div>
  );
}

function UploadScanner() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const img = await loadImageFile(file);
      const imageData = getImageDataFromImage(img);
      const decoded = decodeImageData(imageData);
      if (decoded) {
        setResult(decoded);
      } else {
        setError("No QR code was found in this image.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read this image.");
    }
  };

  if (result) {
    return <ResultPanel text={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/40 p-10 text-center">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Upload an image containing a QR code.</p>
        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
          Choose image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <Alert variant="danger">
          <VideoOff />
          <div>
            <AlertTitle>Couldn't decode this image</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}

function CameraScanner() {
  const [state, setState] = useState<CameraState>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCamera = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState("idle");
  };

  // Always release the camera when this component unmounts or the parent
  // switches away from the Camera tab — otherwise the browser keeps the
  // camera light on indefinitely.
  useEffect(() => () => stopCamera(), []);

  const scanFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const decoded = decodeImageData(imageData);

    if (decoded) {
      setResult(decoded);
      stopCamera();
      return;
    }

    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    setError(null);
    setResult(null);

    if (!window.isSecureContext) {
      setState("error");
      setError("Camera access requires a secure (HTTPS or localhost) connection.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setError("Camera access isn't supported in this browser.");
      return;
    }

    setState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState("active");
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      setState("error");
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Camera access was denied. Allow camera access and try again.");
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setError("No camera was found on this device.");
      } else {
        setError("Couldn't access the camera.");
      }
    }
  };

  if (result) {
    return (
      <ResultPanel
        text={result}
        onReset={() => {
          setResult(null);
          setState("idle");
        }}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
        <video
          ref={videoRef}
          muted
          playsInline
          className={state === "active" ? "max-h-80 w-full object-contain" : "hidden"}
        />
        {state !== "active" && (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <Camera className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {state === "starting" ? "Starting camera…" : "Use your camera to scan a QR code."}
            </p>
            <Button size="sm" onClick={startCamera} disabled={state === "starting"}>
              <Camera className="h-3.5 w-3.5" /> Start camera
            </Button>
          </div>
        )}
      </div>

      {state === "active" && (
        <Button size="sm" variant="outline" onClick={stopCamera}>
          <VideoOff className="h-3.5 w-3.5" /> Stop camera
        </Button>
      )}

      {error && (
        <Alert variant="danger">
          <VideoOff />
          <div>
            <AlertTitle>Camera unavailable</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}

export function QrScanner() {
  return (
    <Tabs defaultValue="upload">
      <TabsList>
        <TabsTrigger value="upload">Upload image</TabsTrigger>
        <TabsTrigger value="camera">Camera</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <UploadScanner />
      </TabsContent>
      <TabsContent value="camera">
        <CameraScanner />
      </TabsContent>
    </Tabs>
  );
}
