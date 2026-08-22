import { NextRequest, NextResponse } from "next/server";
import { generateDynamicPlushPrompt } from "@/lib/avatarPromptMatrix";
import { AvatarArchetypeId } from "@/lib/avatarEngine";
import { UserPreferences } from "@/lib/recommendEngine";

interface GenerateRequestBody {
  prefs: UserPreferences;
  archetypeId: AvatarArchetypeId;
  apiKey?: string;
  customKeywords?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();
    const { prefs, archetypeId, apiKey, customKeywords } = body;

    // 1. Build rich combinatorial prompt with base anchor
    const promptDetails = generateDynamicPlushPrompt(prefs, archetypeId, customKeywords);

    const resolvedApiKey =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.NANO_BANANA_API_KEY ||
      "";

    // 2. If API Key is present, attempt live Imagen 3 / Gemini Pro generation
    if (resolvedApiKey) {
      try {
        // Call Google AI Studio / Imagen 3 REST API
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${resolvedApiKey}`;
        const payload = {
          instances: [{ prompt: promptDetails.prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            outputOptions: { mimeType: "image/jpeg" },
          },
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(25000), // 25s timeout
        });

        if (res.ok) {
          const data = await res.json();
          const base64Data = data.predictions?.[0]?.bytesBase64Encoded;
          if (base64Data) {
            return NextResponse.json({
              success: true,
              imageUrl: `data:image/jpeg;base64,${base64Data}`,
              prompt: promptDetails.prompt,
              details: {
                outfit: promptDetails.outfit,
                prop: promptDetails.prop,
                background: promptDetails.background,
              },
              generatedByAi: true,
            });
          }
        }
      } catch (genError: any) {
        console.warn("AI generation attempt error, using fallback:", genError.message);
      }
    }

    // 3. Graceful Fallback if no key or API quota
    const fallbackImages: Record<string, string> = {
      "01": "/avatars/plush_01.png",
      "02": "/avatars/plush_02.png",
      "03": "/avatars/plush_03.png",
      "04": "/avatars/plush_04.png",
      "05": "/avatars/plush_05.png",
      "06": "/avatars/plush_06.png",
      "07": "/avatars/plush_07.png",
      "08": "/avatars/plush_08.png",
    };

    return NextResponse.json({
      success: true,
      imageUrl: fallbackImages[archetypeId] || "/avatars/plush_08.png",
      prompt: promptDetails.prompt,
      details: {
        outfit: promptDetails.outfit,
        prop: promptDetails.prop,
        background: promptDetails.background,
      },
      generatedByAi: false,
      notice: resolvedApiKey
        ? "AI 생성 호출 대기열로 인해 기본 고화질 키링 아바타로 표시되었습니다."
        : "Gemini / Nano Banana API 키를 입력하시면 실시간으로 매번 새로운 호랑이 키링을 무제한 생성합니다.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate avatar" },
      { status: 500 }
    );
  }
}
