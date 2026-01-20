"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ShapeConfig, ShapeType } from "@/entities/custom-icon";
import { ColorPicker } from "../color-picker/ColorPicker";

interface ShapePanelProps {
  shape: ShapeConfig;
  onShapeChange: (shape: ShapeConfig) => void;
}

const SHAPE_OPTIONS: { type: ShapeType; label: string; icon: string }[] = [
  { type: "rectangle", label: "四角", icon: "□" },
  { type: "triangle", label: "三角", icon: "△" },
  { type: "circle", label: "丸", icon: "○" },
];

export function ShapePanel({ shape, onShapeChange }: ShapePanelProps) {
  const toggleId = useId();

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={toggleId}>シェイプ</Label>
        <Switch
          id={toggleId}
          checked={shape.enabled}
          onCheckedChange={(enabled) => onShapeChange({ ...shape, enabled })}
        />
      </div>

      {shape.enabled && (
        <>
          <div className="flex flex-col gap-2">
            <Label>形状</Label>
            <div className="grid grid-cols-3 gap-2">
              {SHAPE_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.type}
                  className={`flex flex-col items-center gap-1 rounded-md border-2 p-2 transition-colors ${
                    shape.type === option.type
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => onShapeChange({ ...shape, type: option.type })}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>カラー</Label>
            <ColorPicker
              color={shape.color}
              onChange={(color) => onShapeChange({ ...shape, color })}
            >
              <button
                type="button"
                className="h-10 w-full rounded border-2 border-gray-200 hover:border-gray-400"
                style={{ backgroundColor: shape.color }}
              />
            </ColorPicker>
          </div>

          <div className="flex flex-col gap-2">
            <Label>線の太さ: {shape.strokeWidth}px</Label>
            <Slider
              value={[shape.strokeWidth]}
              onValueChange={([strokeWidth]) =>
                onShapeChange({ ...shape, strokeWidth })
              }
              min={1}
              max={20}
              step={1}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>サイズ: {Math.round(shape.size * 100)}%</Label>
            <Slider
              value={[shape.size * 100]}
              onValueChange={([sizePercent]) =>
                onShapeChange({ ...shape, size: sizePercent / 100 })
              }
              min={10}
              max={100}
              step={1}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>回転: {shape.rotation}°</Label>
            <Slider
              value={[shape.rotation]}
              onValueChange={([rotation]) =>
                onShapeChange({ ...shape, rotation })
              }
              min={0}
              max={360}
              step={1}
            />
          </div>
        </>
      )}
    </div>
  );
}
