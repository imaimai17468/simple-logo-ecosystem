"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IconSize } from "@/entities/icon";
import type { IconComponentProps } from "../types";
import { downloadIconAsBlob } from "./downloadIconAsBlob";
import { generateIconPreviews } from "./generateIconPreviews";
import { resizeIcon } from "./resizeIcon";
import { validateIconSize } from "./validateIconSize";

const SIZES: IconSize[] = [16, 32, 180, 192];

export function IconDownloader({ icon }: IconComponentProps) {
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [customSize, setCustomSize] = useState("");
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;
    generateIconPreviews(dataUrl, SIZES).then(setPreviews);
  }, [icon]);

  useEffect(() => {
    if (!customSize.trim()) {
      setCustomPreview(null);
      setError(null);
      return;
    }

    const validation = validateIconSize(customSize);
    if (!validation.isValid) {
      setCustomPreview(null);
      setError(validation.error || "入力エラー");
      return;
    }

    setError(null);
    const size = Number(customSize);
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;
    resizeIcon(dataUrl, size).then(setCustomPreview);
  }, [customSize, icon]);

  const handleDownload = async (size: IconSize) => {
    const dataUrl = `data:${icon.mimeType};base64,${icon.base64}`;
    const resized = await resizeIcon(dataUrl, size);
    await downloadIconAsBlob(resized, `icon-${size}x${size}.png`);
  };

  const handleCustomDownload = async () => {
    if (!customPreview || error) {
      return;
    }

    const size = Number(customSize);
    await downloadIconAsBlob(customPreview, `icon-${size}x${size}.png`);
    setCustomSize("");
    setCustomPreview(null);
  };

  return (
    <div className="space-y-6">
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

      <div className="border-t pt-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">カスタムサイズ</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  type="number"
                  placeholder="512"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomDownload();
                    }
                  }}
                  min={1}
                  max={2048}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <Button
                onClick={handleCustomDownload}
                disabled={!customPreview || !!error}
              >
                ダウンロード
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              1〜2048pxの正方形サイズを指定できます
            </p>
          </div>

          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded border bg-gray-50 p-6">
            {customPreview ? (
              <>
                <div className="flex items-center justify-center">
                  <Image
                    src={customPreview}
                    alt={`${customSize}x${customSize} preview`}
                    width={Number(customSize)}
                    height={Number(customSize)}
                    className="max-h-32 max-w-32 border bg-white"
                    style={{
                      borderRadius: "22.37%",
                      width: "auto",
                      height: "auto",
                    }}
                    unoptimized
                  />
                </div>
                <span className="text-gray-500 text-xs">
                  {customSize}x{customSize}
                </span>
              </>
            ) : (
              <p className="text-center text-gray-400 text-sm">
                サイズを入力するとプレビューが表示されます
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
