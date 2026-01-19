"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GeneratedIcon, IconSize } from "@/entities/icon";
import { downloadIconAsBlob } from "./downloadIconAsBlob";
import { generateIconPreviews } from "./generateIconPreviews";
import { resizeIcon } from "./resizeIcon";

interface Props {
  icon: GeneratedIcon;
}

const SIZES: IconSize[] = [16, 32, 180, 192];

export function IconDownloader({ icon }: Props) {
  const [previews, setPreviews] = useState<Record<number, string>>({});

  useEffect(() => {
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;
    generateIconPreviews(dataUrl, SIZES).then(setPreviews);
  }, [icon]);

  const handleDownload = async (size: IconSize) => {
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;
    const resized = await resizeIcon(dataUrl, size);
    await downloadIconAsBlob(resized, `icon-${size}x${size}.png`);
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
