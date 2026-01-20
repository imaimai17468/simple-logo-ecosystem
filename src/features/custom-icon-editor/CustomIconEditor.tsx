"use client";

import { useRef, useState } from "react";
import {
  type CustomIconConfig,
  DEFAULT_CUSTOM_ICON_CONFIG,
} from "@/entities/custom-icon";
import { BorderPanel } from "./border-panel/BorderPanel";
import { DownloadPanel } from "./download-panel/DownloadPanel";
import { FontPanel } from "./font-panel/FontPanel";
import { GradientHandles } from "./gradient-handles/GradientHandles";
import { IconCanvas } from "./icon-canvas/IconCanvas";
import { PreviewPanel } from "./preview-panel/PreviewPanel";
import { ShapePanel } from "./shape-panel/ShapePanel";
import { TextInput } from "./text-input/TextInput";

export function CustomIconEditor() {
  const [config, setConfig] = useState<CustomIconConfig>(
    DEFAULT_CUSTOM_ICON_CONFIG,
  );
  const [isEditingText, setIsEditingText] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGradientHandleMove = (handleId: string, x: number, y: number) => {
    setConfig((prev) => ({
      ...prev,
      gradientHandles: prev.gradientHandles.map((h) =>
        h.id === handleId ? { ...h, x, y } : h,
      ) as [(typeof prev.gradientHandles)[0], (typeof prev.gradientHandles)[1]],
    }));
  };

  const handleColorChange = (handleId: string, color: string) => {
    setConfig((prev) => ({
      ...prev,
      gradientHandles: prev.gradientHandles.map((h) =>
        h.id === handleId ? { ...h, color } : h,
      ) as [(typeof prev.gradientHandles)[0], (typeof prev.gradientHandles)[1]],
    }));
  };

  const handleTextChange = (content: string) => {
    setConfig((prev) => ({
      ...prev,
      text: { ...prev.text, content },
    }));
  };

  const handleCanvasClick = () => {
    // Trigger text editing when clicking the canvas button
    setIsEditingText(true);
  };

  const handleBorderChange = (border: typeof config.border) => {
    setConfig((prev) => ({ ...prev, border }));
  };

  const handleTextConfigChange = (text: typeof config.text) => {
    setConfig((prev) => ({ ...prev, text }));
  };

  const handleShapeChange = (shape: typeof config.shape) => {
    setConfig((prev) => ({ ...prev, shape }));
  };

  return (
    <div className="grid h-[calc(100dvh-200px)] grid-cols-[auto_1fr_auto] items-center gap-8 px-8">
      {/* Left: Preview & Download Panels */}
      <div className="flex flex-col gap-4">
        <PreviewPanel config={config} />
        <DownloadPanel config={config} />
      </div>

      {/* Center: Icon Canvas + Gradient Handles */}
      <div className="flex items-center justify-center">
        <div className="pointer-events-none relative" ref={containerRef}>
          <button
            type="button"
            className="pointer-events-auto cursor-text border-none bg-transparent p-0"
            onClick={handleCanvasClick}
          >
            <IconCanvas
              config={config}
              ref={canvasRef}
              isEditingText={isEditingText}
              cursorPosition={cursorPosition}
            />
          </button>
          <div className="absolute inset-0">
            <GradientHandles
              handles={config.gradientHandles}
              onHandleMove={handleGradientHandleMove}
              onColorChange={handleColorChange}
              containerRef={containerRef}
            />
          </div>
          <div className="absolute inset-0">
            <TextInput
              value={config.text.content}
              onChange={handleTextChange}
              isEditing={isEditingText}
              onBlur={() => setIsEditingText(false)}
              onCursorPositionChange={setCursorPosition}
            />
          </div>
        </div>
      </div>

      {/* Right: Border Panel & Font Panel */}
      <div className="flex flex-col gap-4">
        <BorderPanel
          border={config.border}
          onBorderChange={handleBorderChange}
        />
        <FontPanel text={config.text} onTextChange={handleTextConfigChange} />
        <ShapePanel shape={config.shape} onShapeChange={handleShapeChange} />
      </div>
    </div>
  );
}
