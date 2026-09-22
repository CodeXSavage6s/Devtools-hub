import { useRef } from "react";
import { AlignLeft, Minimize2, CheckCircle2, Trash2, FileCode, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { validateUploadFile } from "../utils/json";

interface JsonToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onClear: () => void;
  onLoadExample: () => void;
  onFileLoaded: (contents: string) => void;
  disabled: boolean;
}

export function JsonToolbar({
  onFormat,
  onMinify,
  onValidate,
  onClear,
  onLoadExample,
  onFileLoaded,
  disabled,
}: JsonToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const validationError = validateUploadFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onFileLoaded(String(reader.result ?? ""));
    reader.onerror = () => showToast("Couldn't read that file", "error");
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" onClick={onFormat} disabled={disabled}>
        <AlignLeft className="h-3.5 w-3.5" /> Format
      </Button>
      <Button size="sm" variant="outline" onClick={onMinify} disabled={disabled}>
        <Minimize2 className="h-3.5 w-3.5" /> Minify
      </Button>
      <Button size="sm" variant="outline" onClick={onValidate} disabled={disabled}>
        <CheckCircle2 className="h-3.5 w-3.5" /> Validate
      </Button>
      <Button size="sm" variant="outline" onClick={onLoadExample}>
        <FileCode className="h-3.5 w-3.5" /> Load example
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" /> Upload .json
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <Button
        size="sm"
        variant="ghost"
        className="ml-auto text-muted-foreground"
        onClick={onClear}
        disabled={disabled}
      >
        <Trash2 className="h-3.5 w-3.5" /> Clear
      </Button>
    </div>
  );
}
