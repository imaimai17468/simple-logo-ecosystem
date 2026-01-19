"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { GeneratedIcon } from "@/entities/icon";
import { downloadDataUrl } from "./downloadDataUrl";
import { generateOgpImage } from "./generateOgpImage";

interface Props {
  icon: GeneratedIcon;
}

export function OgpGenerator({ icon }: Props) {
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
