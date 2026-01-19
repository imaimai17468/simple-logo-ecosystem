"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GeneratedIcon } from "@/entities/icon";

interface Props {
  icon: GeneratedIcon;
}

export function OgpGenerator({ icon }: Props) {
  const [appName, setAppName] = useState("");
  const [ogpPreview, setOgpPreview] = useState<string | null>(null);

  // OGPプレビューを生成
  useEffect(() => {
    if (!appName.trim()) {
      setOgpPreview(null);
      return;
    }

    const generatePreview = async () => {
      const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;

      // Canvas で OGP 画像を合成
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 背景
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // アイコンを左側に配置
      const img = new window.Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const iconSize = 400;
      const iconX = 100;
      const iconY = (canvas.height - iconSize) / 2;

      ctx.drawImage(img, iconX, iconY, iconSize, iconSize);

      // アプリ名を右側に配置
      ctx.fillStyle = "#000000";
      ctx.font = "bold 72px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const textX = iconX + iconSize + 80;
      const textY = canvas.height / 2;

      ctx.fillText(appName, textX, textY);

      setOgpPreview(canvas.toDataURL());
    };

    generatePreview();
  }, [appName, icon]);

  const handleGenerateOgp = async () => {
    if (!ogpPreview) return;

    // data URLをダウンロード
    const a = document.createElement("a");
    a.href = ogpPreview;
    a.download = "ogp-image.png";
    a.click();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">OGP画像生成</h3>
      <Input
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        placeholder="アプリ名を入力"
      />

      {ogpPreview && (
        <div className="space-y-2">
          <p className="text-gray-500 text-sm">プレビュー (1200x630)</p>
          <div className="overflow-hidden rounded border">
            <Image
              src={ogpPreview}
              alt="OGP Preview"
              width={1200}
              height={630}
              className="w-full"
              unoptimized
            />
          </div>
        </div>
      )}

      <Button onClick={handleGenerateOgp} disabled={!ogpPreview}>
        OGP画像をダウンロード
      </Button>
    </div>
  );
}
