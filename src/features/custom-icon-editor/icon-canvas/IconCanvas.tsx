"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { CustomIconConfig } from "@/entities/custom-icon";
import { renderBorder } from "./renderBorder";
import { renderGradient } from "./renderGradient";
import { renderShape } from "./renderShape";
import { renderText } from "./renderText";

interface IconCanvasProps {
  config: CustomIconConfig;
}

export const IconCanvas = forwardRef<HTMLCanvasElement, IconCanvasProps>(
  ({ config }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement>) || internalRef;

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, config.iconSize, config.iconSize);

      // Create rounded rectangle clip path
      const radius = config.iconSize * 0.2237; // Apple-style 22.37%
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(config.iconSize - radius, 0);
      ctx.quadraticCurveTo(config.iconSize, 0, config.iconSize, radius);
      ctx.lineTo(config.iconSize, config.iconSize - radius);
      ctx.quadraticCurveTo(
        config.iconSize,
        config.iconSize,
        config.iconSize - radius,
        config.iconSize,
      );
      ctx.lineTo(radius, config.iconSize);
      ctx.quadraticCurveTo(0, config.iconSize, 0, config.iconSize - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      // 1. Render gradient
      renderGradient(ctx, config.iconSize, config.gradientHandles);

      // 2. Render shape (if enabled)
      if (config.shape.enabled) {
        renderShape(ctx, config.iconSize, config.shape);
      }

      // 3. Render text (if present)
      renderText(ctx, config.iconSize, config.text);

      // 4. Render border (if enabled) - inside clip
      if (config.border.enabled) {
        renderBorder(ctx, config.iconSize, radius, config.border);
      }

      ctx.restore();
    }, [config, canvasRef.current]);

    return (
      <canvas
        ref={canvasRef}
        width={config.iconSize}
        height={config.iconSize}
        style={{ width: "400px", height: "400px" }}
      />
    );
  },
);

IconCanvas.displayName = "IconCanvas";
