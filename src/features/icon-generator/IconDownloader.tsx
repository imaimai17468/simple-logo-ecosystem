"use client";

import { Button } from "@/components/ui/button";
import type { GeneratedIcon, IconSize } from "@/entities/icon";

interface Props {
  icon: GeneratedIcon;
}

const SIZES: IconSize[] = [16, 32, 180, 192];

export function IconDownloader({ icon }: Props) {
  const handleDownload = async (size: IconSize) => {
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;

    // Canvas でリサイズ
    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, size, size);

    // ダウンロード
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `icon-${size}x${size}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">ダウンロード</h3>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((size) => (
          <Button
            key={size}
            variant="outline"
            onClick={() => handleDownload(size)}
          >
            {size}x{size}
          </Button>
        ))}
      </div>
    </div>
  );
}
