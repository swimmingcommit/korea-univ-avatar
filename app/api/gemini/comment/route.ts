import { NextRequest, NextResponse } from "next/server";
import { generateGeminiClubComment } from "@/lib/gemini";
import { AvatarConfiguration } from "@/lib/avatarEngine";
import { RecommendationResult, UserPreferences } from "@/lib/recommendEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prefs, avatar, recommendations } = body as {
      prefs: UserPreferences;
      avatar: AvatarConfiguration;
      recommendations: RecommendationResult[];
    };

    if (!prefs || !avatar) {
      return NextResponse.json(
        { error: "Invalid request payload: prefs and avatar required." },
        { status: 400 }
      );
    }

    const commentResponse = await generateGeminiClubComment(prefs, avatar, recommendations || []);

    return NextResponse.json(commentResponse);
  } catch (error) {
    console.error("Error in Gemini API route handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error in Gemini route." },
      { status: 500 }
    );
  }
}
