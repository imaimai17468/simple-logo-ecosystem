"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { IconComponentProps } from "../types";
import { downloadDataUrl } from "./downloadDataUrl";
import { generateOgpImage } from "./generateOgpImage";

export function OgpGenerator({ icon }: IconComponentProps) {
  const [appName, setAppName] = useState("");
  const [ogpPreview, setOgpPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!appName.trim()) {
      setOgpPreview(null);
      return;
    }

    generateOgpImage({
      iconDataUrl: `data:${icon.mimeType};base64,${icon.base64}`,
      appName,
      width: 1200,
      height: 630,
    }).then(setOgpPreview);
  }, [appName, icon]);

  const handleGenerateOgp = () => {
    if (!ogpPreview) return;
    downloadDataUrl(ogpPreview, "ogp-image.png");
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

      <div className="space-y-2">
        <p className="text-gray-500 text-sm">プレビュー (1200x630)</p>
        <div className="flex min-h-40 flex-col items-center justify-center rounded border bg-gray-50 p-6">
          {ogpPreview ? (
            <div className="w-full overflow-hidden rounded border bg-white">
              <Image
                src={ogpPreview}
                alt="OGP Preview"
                width={1200}
                height={630}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm">
              アプリ名を入力するとプレビューが表示されます
            </p>
          )}
        </div>
      </div>

      <Button
        variant="gradient"
        onClick={handleGenerateOgp}
        disabled={!ogpPreview}
      >
        OGP画像をダウンロード
      </Button>
    </div>
  );
}
