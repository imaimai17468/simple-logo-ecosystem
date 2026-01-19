import { generateIconWithGemini } from "@/gateways/icon";

export async function POST(request: Request) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json(
        { success: false, error: "プロンプトが必要です" },
        { status: 400 },
      );
    }

    if (!apiKey || typeof apiKey !== "string") {
      return Response.json(
        { success: false, error: "API Keyが必要です" },
        { status: 400 },
      );
    }

    const image = await generateIconWithGemini(prompt, apiKey);

    return Response.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error("Icon generation error:", error);
    return Response.json(
      {
        success: false,
        error: "画像生成に失敗しました。API Keyを確認してください。",
      },
      { status: 500 },
    );
  }
}
