import { useMemo, useRef, useState, type DragEvent, type UIEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFileLoaded: (contents: string) => void;
}

// Shared with the textarea below so numbers line up with actual text rows.
const LINE_HEIGHT_CLASS = "leading-6";

export function JsonEditor({ value, onChange, onFileLoaded }: JsonEditorProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { showToast } = useToast();
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => (value.length === 0 ? 1 : value.split("\n").length), [value]);

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      showToast("Please drop a .json file", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onFileLoaded(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  return (
    <div
      className={cn(
        "relative rounded-md border-2 border-dashed border-transparent transition-colors",
        isDragOver && "border-accent bg-accent/5"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="relative h-72 sm:h-96">
        <div
          ref={gutterRef}
          aria-hidden
          className={cn(
            "scrollbar-thin pointer-events-none absolute inset-y-0 left-0 w-10 select-none overflow-hidden rounded-l-md border-r border-border bg-muted/40 py-2 text-right font-mono text-sm text-muted-foreground",
            LINE_HEIGHT_CLASS
          )}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="pr-2">
              {i + 1}
            </div>
          ))}
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={'{"name":"John","age":20,"projects":["NexusForge","DevTools Hub"]}'}
          spellCheck={false}
          wrap="off"
          className={cn(
            "scrollbar-thin h-full whitespace-pre pl-12",
            LINE_HEIGHT_CLASS
          )}
        />
      </div>
      {isDragOver && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-background/70 text-sm font-medium text-accent">
          Drop your .json file
        </div>
      )}
    </div>
  );
}