import type { CustomIconConfig } from "@/entities/custom-icon";
import { renderBorder } from "./renderBorder";
import { renderGradient } from "./renderGradient";
import { renderText } from "./renderText";

export function exportCanvas(
  config: CustomIconConfig,
  size: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D context");

  // Scale factor
  const scale = size / config.iconSize;

  // Create clip path
  const radius = size * 0.2237; // Apple-style 22.37%
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip();

  // Render gradient with scaled handles
  const scaledHandles: typeof config.gradientHandles = [
    {
      ...config.gradientHandles[0],
      x: config.gradientHandles[0].x,
      y: config.gradientHandles[0].y,
    },
    {
      ...config.gradientHandles[1],
      x: config.gradientHandles[1].x,
      y: config.gradientHandles[1].y,
    },
  ];
  renderGradient(ctx, size, scaledHandles);

  // Render text with scaled font size
  const scaledText = {
    ...config.text,
    fontSize: config.text.fontSize * scale,
  };
  renderText(ctx, size, scaledText);

  // Render border if enabled - inside clip
  if (config.border.enabled) {
    const scaledBorder = {
      ...config.border,
      width: config.border.width * scale,
    };
    renderBorder(ctx, size, radius, scaledBorder);
  }

  ctx.restore();

  return canvas;
}
