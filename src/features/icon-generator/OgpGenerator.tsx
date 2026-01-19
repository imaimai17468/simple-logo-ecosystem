"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

      const iconSize = 96; // フォントサイズ64pxの1.5倍
      const iconX = 120;
      const iconY = (canvas.height - iconSize) / 2;

      // Apple風の角丸（約22.37%）を適用
      const radius = iconSize * 0.2237;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(iconX + radius, iconY);
      ctx.lineTo(iconX + iconSize - radius, iconY);
      ctx.quadraticCurveTo(
        iconX + iconSize,
        iconY,
        iconX + iconSize,
        iconY + radius,
      );
      ctx.lineTo(iconX + iconSize, iconY + iconSize - radius);
      ctx.quadraticCurveTo(
        iconX + iconSize,
        iconY + iconSize,
        iconX + iconSize - radius,
        iconY + iconSize,
      );
      ctx.lineTo(iconX + radius, iconY + iconSize);
      ctx.quadraticCurveTo(
        iconX,
        iconY + iconSize,
        iconX,
        iconY + iconSize - radius,
      );
      ctx.lineTo(iconX, iconY + radius);
      ctx.quadraticCurveTo(iconX, iconY, iconX + radius, iconY);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
      ctx.restore();

      // アプリ名を右側に配置（改行対応）
      ctx.fillStyle = "#000000";
      const fontSize = 64;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const textX = iconX + iconSize + fontSize; // フォントサイズ1文字分の余白
      const maxWidth = canvas.width - textX - fontSize;
      const lineHeight = 80;

      // テキストを改行で分割
      const lines = appName.split("\n");
      const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(line, textX, y, maxWidth);
      });

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
      <Textarea
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        placeholder="アプリ名を入力（改行可）"
        rows={3}
      />

      {ogpPreview && (
        <div className="space-y-2">
          <p className="text-gray-500 text-sm">プレビュー (1200x630)</p>
          <div className="inline-block overflow-hidden rounded border">
            <Image
              src={ogpPreview}
              alt="OGP Preview"
              width={1200}
              height={630}
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
