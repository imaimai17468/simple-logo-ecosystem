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

  const result = await model.generateContent(
    `Create a simple, clean app icon for: ${prompt}.

CRITICAL REQUIREMENTS:
- Use ONE SINGLE solid color background that fills the entire image (no white background, no outer layer)
- The icon element should be drawn DIRECTLY on this single background color
- NO nested backgrounds, NO inner squares, NO double layers, NO frames
- The icon design should extend edge-to-edge within the single colored background
- Think of it like a mobile app icon: one background color with the icon drawn on top

Style: Modern, minimalist, suitable for app icons and favicons.`,
  );

  const response = result.response;
  const imagePart = response.candidates?.[0]?.content?.parts?.find((part) =>
    part.inlineData?.mimeType?.startsWith("image/"),
  );

  if (!imagePart?.inlineData) {
    throw new Error("No image generated");
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}
