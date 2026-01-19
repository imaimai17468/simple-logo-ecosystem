"use client";

import Image from "next/image";
import type { GeneratedIcon } from "@/entities/icon";

interface Props {
  icon: GeneratedIcon;
}

export function IconPreview({ icon }: Props) {
  const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">プレビュー</h3>
      <Image
        src={dataUrl}
        alt="Generated icon"
        width={384}
        height={384}
        className="max-w-xs rounded border"
        unoptimized
      />
    </div>
  );
}
