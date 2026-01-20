import type { TextConfig } from "@/entities/custom-icon";

export function renderText(
  ctx: CanvasRenderingContext2D,
  size: number,
  text: TextConfig,
): void {
  if (!text.content) return;

  // テキスト描画設定
  ctx.fillStyle = text.color;
  ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Shadowをクリア
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 改行で分割
  const lines = text.content.split("\n");
  const lineHeight = text.fontSize * 1.2; // 行間を20%追加
  const totalHeight = lines.length * lineHeight;

  // 中央揃えのための開始Y座標を計算
  const centerX = size / 2;
  const startY = size / 2 - totalHeight / 2 + lineHeight / 2;

  // 各行を描画
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, centerX, y);
  });
}
