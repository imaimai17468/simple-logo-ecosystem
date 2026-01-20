"use client";

import { useCallback, useEffect, useState } from "react";
import type { GradientHandle } from "@/entities/custom-icon";
import { ColorPicker } from "../color-picker/ColorPicker";
import { calculateRelativePosition } from "./handleDrag";

interface GradientHandlesProps {
  handles: [GradientHandle, GradientHandle];
  onHandleMove: (handleId: string, x: number, y: number) => void;
  onColorChange: (handleId: string, color: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function GradientHandles({
  handles,
  onHandleMove,
  onColorChange,
  containerRef,
}: GradientHandlesProps) {
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent, handleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handleId);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!activeHandle || !containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const { x, y } = calculateRelativePosition(e.clientX, e.clientY, bounds);
      onHandleMove(activeHandle, x, y);
    },
    [activeHandle, containerRef, onHandleMove],
  );

  const handleMouseUp = useCallback(() => {
    setActiveHandle(null);
  }, []);

  // グローバルマウスイベントリスナー
  useEffect(() => {
    if (!activeHandle) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeHandle, handleMouseMove, handleMouseUp]);

  return (
    <>
      {handles.map((handle) => (
        <div key={handle.id} className="pointer-events-auto">
          {/* Color picker popover with draggable circle as trigger */}
          <ColorPicker
            color={handle.color}
            onChange={(color) => onColorChange(handle.id, color)}
          >
            <div
              role="button"
              tabIndex={0}
              className="absolute h-8 w-8 cursor-move rounded-full border-4 border-white shadow-lg transition-transform hover:scale-110"
              style={{
                backgroundColor: handle.color,
                left: `${handle.x * 100}%`,
                top: `${handle.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={(e) => handleMouseDown(e, handle.id)}
            />
          </ColorPicker>
        </div>
      ))}
    </>
  );
}
