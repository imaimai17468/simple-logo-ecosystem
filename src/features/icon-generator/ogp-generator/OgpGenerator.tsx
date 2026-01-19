"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IconComponentProps } from "../types";
import { downloadDataUrl } from "./downloadDataUrl";
import { generateOgpImage, type OgpLayout } from "./generateOgpImage";
import { OGP_FONTS, type OgpFont } from "./ogpFonts";
import type { OgpTheme } from "./ogpThemes";

const DEFAULT_ICON_SIZE = 120;
const DEFAULT_FONT_SIZE = 80;

export function OgpGenerator({ icon }: IconComponentProps) {
  const iconSizeId = useId();
  const fontSizeId = useId();
  const fontId = useId();

  const [appName, setAppName] = useState("");
  const [ogpPreview, setOgpPreview] = useState<string | null>(null);

  // 詳細設定
  const [theme, setTheme] = useState<OgpTheme>("light");
  const [layout, setLayout] = useState<OgpLayout>("horizontal");
  const [iconSize, setIconSize] = useState<number>(DEFAULT_ICON_SIZE);
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE);
  const [font, setFont] = useState<OgpFont>("sans-serif");

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
      theme,
      layout,
      iconSize,
      fontSize,
      font,
    }).then(setOgpPreview);
  }, [appName, icon, theme, layout, iconSize, fontSize, font]);

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

      <Accordion type="single" collapsible>
        <AccordionItem value="settings">
          <AccordionTrigger>詳細設定</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {/* カラーテーマ */}
              <div className="space-y-2">
                <Label>カラーテーマ</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    ライト
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    ダーク
                  </Button>
                </div>
              </div>

              {/* レイアウト */}
              <div className="space-y-2">
                <Label>レイアウト</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={layout === "horizontal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayout("horizontal")}
                  >
                    横並び
                  </Button>
                  <Button
                    type="button"
                    variant={layout === "vertical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayout("vertical")}
                  >
                    縦並び
                  </Button>
                </div>
              </div>

              {/* アイコンサイズ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={iconSizeId}>
                    アイコンサイズ: {iconSize}px
                  </Label>
                  {iconSize !== DEFAULT_ICON_SIZE && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIconSize(DEFAULT_ICON_SIZE)}
                      className="h-auto p-1 text-xs"
                    >
                      デフォルトに戻す
                    </Button>
                  )}
                </div>
                <Input
                  id={iconSizeId}
                  type="range"
                  min="60"
                  max="300"
                  step="10"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                />
              </div>

              {/* フォントサイズ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={fontSizeId}>
                    フォントサイズ: {fontSize}px
                  </Label>
                  {fontSize !== DEFAULT_FONT_SIZE && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(DEFAULT_FONT_SIZE)}
                      className="h-auto p-1 text-xs"
                    >
                      デフォルトに戻す
                    </Button>
                  )}
                </div>
                <Input
                  id={fontSizeId}
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </div>

              {/* フォント */}
              <div className="space-y-2">
                <Label htmlFor={fontId}>フォント</Label>
                <Select
                  value={font}
                  onValueChange={(v) => setFont(v as OgpFont)}
                >
                  <SelectTrigger id={fontId}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OGP_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
