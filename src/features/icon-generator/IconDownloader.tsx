"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GeneratedIcon, IconSize } from "@/entities/icon";

interface Props {
  icon: GeneratedIcon;
}

const SIZES: IconSize[] = [16, 32, 180, 192];

export function IconDownloader({ icon }: Props) {
  const [previews, setPreviews] = useState<Record<number, string>>({});

  // 各サイズのプレビューを生成
  useEffect(() => {
    const generatePreviews = async () => {
      const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;
      const img = new window.Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const newPreviews: Record<number, string> = {};

      for (const size of SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        ctx.drawImage(img, 0, 0, size, size);
        newPreviews[size] = canvas.toDataURL();
      }

      setPreviews(newPreviews);
    };

    generatePreviews();
  }, [icon]);

  const handleDownload = async (size: IconSize) => {
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;

    // Canvas でリサイズ
    const img = new window.Image();
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
      <h3 className="font-medium text-lg">各サイズダウンロード</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SIZES.map((size) => (
          <div
            key={size}
            className="flex flex-col items-center gap-2 rounded border p-4"
          >
            {previews[size] && (
              <Image
                src={previews[size]}
                alt={`${size}x${size} preview`}
                width={size}
                height={size}
                className="border bg-gray-50"
                style={{ borderRadius: "22.37%" }}
                unoptimized
              />
            )}
            <span className="text-gray-500 text-xs">
              {size}x{size}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(size)}
            >
              ダウンロード
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
