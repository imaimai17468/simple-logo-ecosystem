"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { TextConfig } from "@/entities/custom-icon";

const FONT_FAMILY_OPTIONS = [
  { value: "system-ui, sans-serif", label: "システムフォント" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: '"Times New Roman", serif', label: "Times New Roman" },
  { value: '"Courier New", monospace', label: "Courier New" },
  {
    value:
      '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic Medium", YuGothic, sans-serif',
    label: "ヒラギノ角ゴシック",
  },
  {
    value: '"Yu Gothic Medium", YuGothic, "Hiragino Sans", sans-serif',
    label: "游ゴシック",
  },
  { value: "Meiryo, sans-serif", label: "メイリオ" },
  { value: '"Noto Sans JP", sans-serif', label: "Noto Sans JP" },
  { value: '"Noto Serif JP", serif', label: "Noto Serif JP" },
] as const;

const FONT_WEIGHT_OPTIONS = [
  { value: "100", label: "Thin (100)" },
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "700", label: "Bold (700)" },
  { value: "900", label: "Black (900)" },
] as const;

interface FontPanelProps {
  text: TextConfig;
  onTextChange: (text: TextConfig) => void;
}

export function FontPanel({ text, onTextChange }: FontPanelProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-lg">
      <div className="flex flex-col gap-2">
        <Label>文字サイズ: {text.fontSize}px</Label>
        <Slider
          value={[text.fontSize]}
          onValueChange={([fontSize]) => onTextChange({ ...text, fontSize })}
          min={12}
          max={240}
          step={1}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>フォント</Label>
        <Select
          value={text.fontFamily}
          onValueChange={(fontFamily) => onTextChange({ ...text, fontFamily })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="フォントを選択" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>太さ</Label>
        <Select
          value={String(text.fontWeight)}
          onValueChange={(value) =>
            onTextChange({ ...text, fontWeight: Number(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="太さを選択" />
          </SelectTrigger>
          <SelectContent>
            {FONT_WEIGHT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
