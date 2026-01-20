import type { CustomIconConfig } from "@/entities/custom-icon";

/**
 * CustomIconConfigからSVG文字列を生成
 */
export function exportSvg(config: CustomIconConfig, size: number): string {
  const scale = size / config.iconSize;
  const radius = size * 0.2237; // Apple-style 22.37%

  // SVG要素を構築
  const elements: string[] = [];

  // 1. クリップパスとグラデーション定義
  const clipPathId = "icon-clip";
  const gradientId = "icon-gradient";

  const defs = `
    <defs>
      <clipPath id="${clipPathId}">
        <path d="M ${radius} 0 L ${size - radius} 0 Q ${size} 0 ${size} ${radius} L ${size} ${size - radius} Q ${size} ${size} ${size - radius} ${size} L ${radius} ${size} Q 0 ${size} 0 ${size - radius} L 0 ${radius} Q 0 0 ${radius} 0 Z" />
      </clipPath>
      <linearGradient id="${gradientId}" x1="${config.gradientHandles[0].x * 100}%" y1="${config.gradientHandles[0].y * 100}%" x2="${config.gradientHandles[1].x * 100}%" y2="${config.gradientHandles[1].y * 100}%">
        <stop offset="0%" stop-color="${config.gradientHandles[0].color}" />
        <stop offset="100%" stop-color="${config.gradientHandles[1].color}" />
      </linearGradient>
    </defs>
  `.trim();

  elements.push(defs);

  // 2. グラデーション背景
  elements.push(
    `<rect width="${size}" height="${size}" fill="url(#${gradientId})" clip-path="url(#${clipPathId})" />`,
  );

  // 3. シェイプ（有効な場合）
  if (config.shape.enabled) {
    const shapeSize = size * config.shape.size;
    const centerX = size / 2;
    const centerY = size / 2;
    const scaledStrokeWidth = config.shape.strokeWidth * scale;

    let shapePath = "";
    switch (config.shape.type) {
      case "rectangle": {
        const halfSize = shapeSize / 2;
        const x = centerX - halfSize;
        const y = centerY - halfSize;
        shapePath = `<rect x="${x}" y="${y}" width="${shapeSize}" height="${shapeSize}" fill="none" stroke="${config.shape.color}" stroke-width="${scaledStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
        break;
      }
      case "triangle": {
        const halfBase = shapeSize / 2;
        const circumradius = shapeSize / Math.sqrt(3);
        const topY = centerY - circumradius;
        const bottomY = centerY + circumradius / 2;

        const points = `${centerX},${topY} ${centerX + halfBase},${bottomY} ${centerX - halfBase},${bottomY}`;
        shapePath = `<polygon points="${points}" fill="none" stroke="${config.shape.color}" stroke-width="${scaledStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
        break;
      }
      case "circle": {
        const radius = shapeSize / 2;
        shapePath = `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${config.shape.color}" stroke-width="${scaledStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
        break;
      }
    }

    // 回転を適用
    if (config.shape.rotation !== 0) {
      shapePath = `<g transform="rotate(${config.shape.rotation} ${centerX} ${centerY})" clip-path="url(#${clipPathId})">${shapePath}</g>`;
    } else {
      shapePath = `<g clip-path="url(#${clipPathId})">${shapePath}</g>`;
    }

    elements.push(shapePath);
  }

  // 4. テキスト
  if (config.text.content) {
    const scaledFontSize = config.text.fontSize * scale;
    const lines = config.text.content.split("\n");
    const lineHeight = scaledFontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const centerX = size / 2;
    const startY = size / 2 - totalHeight / 2 + lineHeight / 2;

    const textElements = lines.map((line, index) => {
      const y = startY + index * lineHeight;
      return `<text x="${centerX}" y="${y}" font-family="${config.text.fontFamily}" font-size="${scaledFontSize}" font-weight="${config.text.fontWeight}" fill="${config.text.color}" text-anchor="middle" dominant-baseline="middle">${escapeXml(line)}</text>`;
    });

    elements.push(
      `<g clip-path="url(#${clipPathId})">${textElements.join("\n")}</g>`,
    );
  }

  // 5. ボーダー（有効な場合）
  if (config.border.enabled) {
    const scaledBorderWidth = config.border.width * scale;
    const offset = scaledBorderWidth / 2;
    const innerSize = size - offset * 2;
    const innerRadius = radius - offset;

    const borderPath = `M ${offset + innerRadius} ${offset} L ${offset + innerSize - innerRadius} ${offset} Q ${offset + innerSize} ${offset} ${offset + innerSize} ${offset + innerRadius} L ${offset + innerSize} ${offset + innerSize - innerRadius} Q ${offset + innerSize} ${offset + innerSize} ${offset + innerSize - innerRadius} ${offset + innerSize} L ${offset + innerRadius} ${offset + innerSize} Q ${offset} ${offset + innerSize} ${offset} ${offset + innerSize - innerRadius} L ${offset} ${offset + innerRadius} Q ${offset} ${offset} ${offset + innerRadius} ${offset} Z`;

    elements.push(
      `<path d="${borderPath}" fill="none" stroke="${config.border.color}" stroke-width="${scaledBorderWidth}" clip-path="url(#${clipPathId})" />`,
    );
  }

  // SVG全体を構築
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
${elements.join("\n")}
</svg>`;

  return svg;
}

/**
 * XML用の特殊文字をエスケープ
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
