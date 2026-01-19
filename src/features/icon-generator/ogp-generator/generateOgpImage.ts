export interface OgpImageParams {
  iconDataUrl: string;
  appName: string;
  width: number;
  height: number;
}

export async function generateOgpImage(
  params: OgpImageParams,
): Promise<string> {
  const { iconDataUrl, appName, width, height } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // 背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // アイコンを読み込み
  const img = new window.Image();
  img.src = iconDataUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // フォントサイズとサイズ計算
  const fontSize = 80;
  const iconSize = fontSize * 1.5;
  const spacing = fontSize;
  const lineHeight = fontSize * 1.25;

  // テキスト幅を測定
  ctx.font = `bold ${fontSize}px sans-serif`;
  const lines = appName.split("\n");
  const maxTextWidth = Math.max(
    ...lines.map((line) => ctx.measureText(line).width),
  );

  // 中央揃え位置を計算
  const contentWidth = iconSize + spacing + maxTextWidth;
  const startX = (width - contentWidth) / 2;
  const iconX = startX;
  const iconY = (height - iconSize) / 2;

  // Apple風の角丸を描画
  const radius = iconSize * 0.2237;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(iconX + radius, iconY);
  ctx.lineTo(iconX + iconSize - radius, iconY);
  ctx.quadraticCurveTo(
    iconX + iconSize,
    iconY,
    iconX + iconSize,
    iconY + radius,
  );
  ctx.lineTo(iconX + iconSize, iconY + iconSize - radius);
  ctx.quadraticCurveTo(
    iconX + iconSize,
    iconY + iconSize,
    iconX + iconSize - radius,
    iconY + iconSize,
  );
  ctx.lineTo(iconX + radius, iconY + iconSize);
  ctx.quadraticCurveTo(
    iconX,
    iconY + iconSize,
    iconX,
    iconY + iconSize - radius,
  );
  ctx.lineTo(iconX, iconY + radius);
  ctx.quadraticCurveTo(iconX, iconY, iconX + radius, iconY);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
  ctx.restore();

  // テキストを描画
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const textX = iconX + iconSize + spacing;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, textX, y);
  });

  return canvas.toDataURL();
}
