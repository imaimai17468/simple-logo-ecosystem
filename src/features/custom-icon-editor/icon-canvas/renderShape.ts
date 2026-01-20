import type { ShapeConfig } from "@/entities/custom-icon";

export function renderShape(
  ctx: CanvasRenderingContext2D,
  size: number,
  shape: ShapeConfig,
): void {
  if (!shape.enabled) return;

  ctx.save();

  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // シェイプのサイズ（shape.sizeはアイコンサイズに対する比率）
  const shapeSize = size * shape.size;
  const centerX = size / 2;
  const centerY = size / 2;

  // 中心で回転
  ctx.translate(centerX, centerY);
  ctx.rotate((shape.rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);

  ctx.beginPath();

  switch (shape.type) {
    case "rectangle": {
      const halfSize = shapeSize / 2;
      ctx.rect(centerX - halfSize, centerY - halfSize, shapeSize, shapeSize);
      break;
    }
    case "triangle": {
      // 正三角形を描画（頂点が上）
      const halfBase = shapeSize / 2;

      // 三角形の外接円の半径
      const circumradius = shapeSize / Math.sqrt(3);

      // 頂点を中心から配置
      const topY = centerY - circumradius;
      const bottomY = centerY + circumradius / 2;

      ctx.moveTo(centerX, topY); // 上の頂点
      ctx.lineTo(centerX + halfBase, bottomY); // 右下
      ctx.lineTo(centerX - halfBase, bottomY); // 左下
      ctx.closePath();
      break;
    }
    case "circle": {
      const radius = shapeSize / 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      break;
    }
  }

  ctx.stroke();
  ctx.restore();
}
