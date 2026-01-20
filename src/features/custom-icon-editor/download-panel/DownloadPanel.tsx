"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomIconConfig } from "@/entities/custom-icon";
import { exportCanvas } from "../icon-canvas/exportCanvas";
import { exportSvg } from "../icon-canvas/exportSvg";

interface DownloadPanelProps {
  config: CustomIconConfig;
}

type ExportFormat = "png" | "svg";

export function DownloadPanel({ config }: DownloadPanelProps) {
  const [customSize, setCustomSize] = useState("512");
  const [format, setFormat] = useState<ExportFormat>("png");

  const handleDownload = () => {
    const size = Number.parseInt(customSize, 10);
    if (Number.isNaN(size) || size < 1 || size > 2048) {
      alert("サイズは1〜2048の数値を入力してください");
      return;
    }

    if (format === "svg") {
      // SVGダウンロード
      const svgContent = exportSvg(config, size);
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `custom-icon-${size}px.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // PNGダウンロード
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
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-lg">
      <Label>ダウンロード</Label>

      <div className="flex flex-col gap-2">
        <Label className="text-sm">形式</Label>
        <Select
          value={format}
          onValueChange={(value) => setFormat(value as ExportFormat)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="svg">SVG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm">サイズ</Label>
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
      </div>

      <Button onClick={handleDownload}>ダウンロード</Button>
    </div>
  );
}
