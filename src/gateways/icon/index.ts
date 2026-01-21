import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeneratedIcon } from "@/entities/icon";

export async function generateIconWithGemini(
  prompt: string,
  apiKey: string,
): Promise<GeneratedIcon> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const result =
    await model.generateContent(`Create a modern, visually striking app icon for: ${prompt}.

DESIGN REQUIREMENTS:

Background & Colors:
- Use subtle, refined gradients (2-3 colors maximum, soft transitions)
- Prefer sophisticated color combinations: muted tones, analogous colors, or monochromatic gradients
- Consider soft depth effects like gentle shadows or light gradients
- Avoid both plain solid colors AND overly vibrant/rainbow gradients
- Aim for elegant, modern aesthetic - not flashy or childish
- NO white backgrounds unless specifically requested

Visual Style (choose what fits best):
- Soft, subtle gradients with clean geometric shapes
- Minimal depth with gentle shadows (avoid dramatic 3D effects)
- Matte or semi-gloss finishes (avoid excessive shine)
- Simple, elegant compositions over complex effects
- Restrained use of light and shadow for sophistication

Composition:
- Clean, scalable design suitable for app icons
- Focus on a single main element or symbol
- Edge-to-edge design that fills the canvas
- NO text, letters, or typography (icons only)
- NO nested frames or double borders

Technical:
- Output size: 1024x1024 pixels (1K resolution)
- Square aspect ratio (1:1)
- Modern, premium feel
- Optimized for both light and dark contexts

Style: Contemporary 2025 app icon aesthetic - refined, sophisticated, and memorable. Elegant simplicity over flashy complexity.`);

  const response = result.response;

  // candidates の存在確認
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("No candidates in response");
  }

  const candidate = response.candidates[0];

  // parts の存在確認
  if (!candidate.content?.parts || candidate.content.parts.length === 0) {
    throw new Error("No parts in response");
  }

  // 画像パートを検索
  const imagePart = candidate.content.parts.find((part) => part.inlineData);

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data found in response parts");
  }

  // mimeType が設定されていない場合はデフォルト値を使用
  const mimeType = imagePart.inlineData.mimeType || "image/png";

  return {
    base64: imagePart.inlineData.data,
    mimeType,
  };
}
