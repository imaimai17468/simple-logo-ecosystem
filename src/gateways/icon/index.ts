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
    `Create a simple, clean icon for: ${prompt}. Design it with a solid background color and the icon element filling the entire space edge-to-edge. Avoid nested circles, frames, or borders within the icon. The design should be tightly fitted without any surrounding decorative elements. The icon should be suitable for use as an app icon or favicon.`,
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
