import type { BorderConfig } from "@/entities/custom-icon";

export function renderBorder(
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  border: BorderConfig,
): void {
  ctx.strokeStyle = border.color;
  ctx.lineWidth = border.width;

  // strokeは中心線に描画されるため、lineWidthの半分だけ内側にオフセット
  const offset = border.width / 2;
  const innerSize = size - offset * 2;
  const innerRadius = radius - offset;

  // オフセットされたパスを描画
  ctx.beginPath();
  ctx.moveTo(offset + innerRadius, offset);
  ctx.lineTo(offset + innerSize - innerRadius, offset);
  ctx.quadraticCurveTo(
    offset + innerSize,
    offset,
    offset + innerSize,
    offset + innerRadius,
  );
  ctx.lineTo(offset + innerSize, offset + innerSize - innerRadius);
  ctx.quadraticCurveTo(
    offset + innerSize,
    offset + innerSize,
    offset + innerSize - innerRadius,
    offset + innerSize,
  );
  ctx.lineTo(offset + innerRadius, offset + innerSize);
  ctx.quadraticCurveTo(
    offset,
    offset + innerSize,
    offset,
    offset + innerSize - innerRadius,
  );
  ctx.lineTo(offset, offset + innerRadius);
  ctx.quadraticCurveTo(offset, offset, offset + innerRadius, offset);
  ctx.closePath();
  ctx.stroke();
}
