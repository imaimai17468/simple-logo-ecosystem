"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomIconConfig } from "@/entities/custom-icon";
import { exportCanvas } from "../icon-canvas/exportCanvas";

interface DownloadPanelProps {
  config: CustomIconConfig;
}

export function DownloadPanel({ config }: DownloadPanelProps) {
  const [customSize, setCustomSize] = useState("512");

  const handleDownload = () => {
    const size = Number.parseInt(customSize, 10);
    if (Number.isNaN(size) || size < 1 || size > 2048) {
      alert("サイズは1〜2048の数値を入力してください");
      return;
    }

    const canvas = exportCanvas(config, size);
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `custom-icon-${size}px.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-lg">
      <Label>ダウンロード</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          placeholder="512"
          min={1}
          max={2048}
          className="w-24"
        />
        <span className="flex items-center text-sm">px</span>
      </div>
      <Button onClick={handleDownload}>カスタムサイズでダウンロード</Button>
    </div>
  );
}
