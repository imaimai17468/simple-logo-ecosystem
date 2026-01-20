import type { TextConfig } from "@/entities/custom-icon";

export function renderText(
  ctx: CanvasRenderingContext2D,
  size: number,
  text: TextConfig,
  options?: {
    showCursor?: boolean;
    cursorPosition?: number;
  },
): void {
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

  const content = text.content || "";

  // 改行で分割
  const lines = content.split("\n");
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

  // カーソル描画
  if (options?.showCursor && options.cursorPosition !== undefined) {
    // カーソル位置を計算
    let currentPos = 0;
    let cursorLine = 0;
    let cursorOffsetInLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length;
      if (currentPos + lineLength >= options.cursorPosition) {
        cursorLine = i;
        cursorOffsetInLine = options.cursorPosition - currentPos;
        break;
      }
      currentPos += lineLength + 1; // +1 for newline
    }

    // カーソルのある行のテキスト
    const lineText = lines[cursorLine] || "";
    const textBeforeCursor = lineText.substring(0, cursorOffsetInLine);

    // カーソル位置のX座標を計算
    const textWidth = ctx.measureText(textBeforeCursor).width;
    const lineWidth = ctx.measureText(lineText).width;
    const cursorX = centerX - lineWidth / 2 + textWidth;
    const cursorY = startY + cursorLine * lineHeight;

    // カーソルを描画
    ctx.strokeStyle = text.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cursorX, cursorY - text.fontSize / 2);
    ctx.lineTo(cursorX, cursorY + text.fontSize / 2);
    ctx.stroke();
  }
}
