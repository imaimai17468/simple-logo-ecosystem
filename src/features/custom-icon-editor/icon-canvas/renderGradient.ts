import type { GradientHandle } from "@/entities/custom-icon";

export function renderGradient(
  ctx: CanvasRenderingContext2D,
  size: number,
  handles: [GradientHandle, GradientHandle],
): void {
  // ハンドル位置からグラデーション座標を計算
  const x1 = handles[0].x * size;
  const y1 = handles[0].y * size;
  const x2 = handles[1].x * size;
  const y2 = handles[1].y * size;

  // 線形グラデーションを作成
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, handles[0].color);
  gradient.addColorStop(1, handles[1].color);

  // グラデーションを描画
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
}
