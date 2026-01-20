"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: ReactNode;
}

const PRESET_COLORS = [
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#6366F1",
  "#EF4444",
  "#14B8A6",
  "#84CC16",
  "#F97316",
  "#A855F7",
  "#06B6D4",
];

export function ColorPicker({ color, onChange, children }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <Label>カラー選択</Label>

          {/* Native HTML5 color input */}
          <Input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full cursor-pointer"
          />

          {/* Hex input for manual entry */}
          <Input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#8B5CF6"
            pattern="^#[0-9A-Fa-f]{6}$"
          />

          {/* Preset colors */}
          <div className="space-y-2">
            <Label className="text-xs">プリセット</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  type="button"
                  key={presetColor}
                  className="h-8 w-8 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
