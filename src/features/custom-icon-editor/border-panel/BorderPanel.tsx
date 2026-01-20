"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { BorderConfig } from "@/entities/custom-icon";
import { ColorPicker } from "../color-picker/ColorPicker";

interface BorderPanelProps {
  border: BorderConfig;
  onBorderChange: (border: BorderConfig) => void;
}

export function BorderPanel({ border, onBorderChange }: BorderPanelProps) {
  const toggleId = useId();

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={toggleId}>ボーダー</Label>
        <Switch
          id={toggleId}
          checked={border.enabled}
          onCheckedChange={(enabled) => onBorderChange({ ...border, enabled })}
        />
      </div>

      {border.enabled && (
        <>
          <div className="flex flex-col gap-2">
            <Label>カラー</Label>
            <ColorPicker
              color={border.color}
              onChange={(color) => onBorderChange({ ...border, color })}
            >
              <button
                type="button"
                className="h-10 w-full rounded border-2 border-gray-200 hover:border-gray-400"
                style={{ backgroundColor: border.color }}
              />
            </ColorPicker>
          </div>

          <div className="flex flex-col gap-2">
            <Label>太さ: {border.width}px</Label>
            <Slider
              value={[border.width]}
              onValueChange={([width]) => onBorderChange({ ...border, width })}
              min={1}
              max={20}
              step={1}
            />
          </div>
        </>
      )}
    </div>
  );
}
