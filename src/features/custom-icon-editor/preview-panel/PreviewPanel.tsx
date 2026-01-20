"use client";

import JSZip from "jszip";
import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { CustomIconConfig } from "@/entities/custom-icon";
import { exportCanvas } from "../icon-canvas/exportCanvas";

interface PreviewPanelProps {
  config: CustomIconConfig;
}

const PREVIEW_SIZES = [32, 64, 96, 128] as const;

export function PreviewPanel({ config }: PreviewPanelProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const handleBatchDownload = async () => {
    const zip = new JSZip();

    const blobPromises = PREVIEW_SIZES.map((size) => {
      return new Promise<{ size: number; blob: Blob }>((resolve, reject) => {
        const canvas = exportCanvas(config, size);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ size, blob });
          } else {
            reject(new Error(`Failed to create blob for size ${size}`));
          }
        }, "image/png");
      });
    });

    const results = await Promise.all(blobPromises);

    for (const { size, blob } of results) {
      zip.file(`icon-${size}.png`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-icons.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    for (let i = 0; i < PREVIEW_SIZES.length; i++) {
      const canvasRef = canvasRefs.current[i];
      if (!canvasRef) continue;

      const size = PREVIEW_SIZES[i];
      const exportedCanvas = exportCanvas(config, size);

      const ctx = canvasRef.getContext("2d");
      if (!ctx) continue;

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(exportedCanvas, 0, 0);
    }
  }, [config]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-lg">
      <Label>プレビュー</Label>
      <div className="grid grid-cols-2 gap-4">
        {PREVIEW_SIZES.map((size, index) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <canvas
              ref={(el) => {
                canvasRefs.current[index] = el;
              }}
              width={size}
              height={size}
              style={{ width: `${size}px`, height: `${size}px` }}
            />
            <span className="text-muted-foreground text-xs">{size}px</span>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={handleBatchDownload}>
        <Download className="mr-2 h-4 w-4" />
        まとめてダウンロード (32, 64, 96, 128px)
      </Button>
    </div>
  );
}
