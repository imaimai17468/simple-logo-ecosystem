"use client";

import Image from "next/image";
import type { IconComponentProps } from "../types";

export function IconPreview({ icon }: IconComponentProps) {
  const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">プレビュー</h3>
      <Image
        src={dataUrl}
        alt="Generated icon"
        width={384}
        height={384}
        className="max-w-xs border"
        style={{ borderRadius: "22.37%" }}
        unoptimized
      />
    </div>
  );
}
