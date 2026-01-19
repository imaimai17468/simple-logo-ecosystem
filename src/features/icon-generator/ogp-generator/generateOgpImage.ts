import { OGP_FONTS, type OgpFont } from "./ogpFonts";
import { OGP_THEMES, type OgpTheme } from "./ogpThemes";

export type OgpLayout = "horizontal" | "vertical";

export interface OgpImageParams {
  iconDataUrl: string;
  appName: string;
  width: number;
  height: number;
  theme?: OgpTheme;
  layout?: OgpLayout;
  iconSize?: number;
  fontSize?: number;
  font?: OgpFont;
}

export async function generateOgpImage(
  params: OgpImageParams,
): Promise<string> {
  const {
    iconDataUrl,
    appName,
    width,
    height,
    theme = "light",
    layout = "horizontal",
    iconSize: customIconSize,
    fontSize: customFontSize,
    font = "sans-serif",
  } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // テーマの色を取得
  const colors = OGP_THEMES[theme];

  // 背景
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);

  // アイコンを読み込み
  const img = new window.Image();
  img.src = iconDataUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // フォント設定を取得
  const fontConfig = OGP_FONTS.find((f) => f.value === font);
  const fontFamily = fontConfig?.fontFamily || "sans-serif";

  // サイズ計算
  const fontSize = customFontSize || 80;
  const iconSize = customIconSize || fontSize * 1.5;
  const spacing = fontSize;
  const lineHeight = fontSize * 1.25;

  // テキスト幅を測定
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  const lines = appName.split("\n");
  const maxTextWidth = Math.max(
    ...lines.map((line) => ctx.measureText(line).width),
  );

  // レイアウトに応じた位置計算
  let iconX: number;
  let iconY: number;
  let textX: number;
  let textY: number;

  if (layout === "horizontal") {
    // 横並び：アイコン左・テキスト右
    const contentWidth = iconSize + spacing + maxTextWidth;
    const startX = (width - contentWidth) / 2;
    iconX = startX;
    iconY = (height - iconSize) / 2;
    textX = iconX + iconSize + spacing;
    textY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  } else {
    // 縦並び：アイコン上・テキスト下
    const textHeight = lines.length * lineHeight;
    const contentHeight = iconSize + spacing + textHeight;
    const startY = (height - contentHeight) / 2;
    iconX = (width - iconSize) / 2;
    iconY = startY;
    textX = width / 2;
    textY = iconY + iconSize + spacing;
  }

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
  ctx.fillStyle = colors.text;

  if (layout === "horizontal") {
    // 横並び：各行を中央基準で描画
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    lines.forEach((line, index) => {
      const y = textY + index * lineHeight;
      ctx.fillText(line, textX, y);
    });
  } else {
    // 縦並び：各行を上基準で描画
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    lines.forEach((line, index) => {
      const y = textY + index * lineHeight;
      ctx.fillText(line, textX, y);
    });
  }

  return canvas.toDataURL();
}
