import { AvatarConfiguration } from "./avatarEngine";
import { RecommendationResult, UserPreferences } from "./recommendEngine";

export interface GeminiCommentResponse {
  characterAnalysis: string;
  clubSynergy: string;
  campusTips: string;
  cheeringMessage: string;
  generatedByAi: boolean;
}

export async function generateGeminiClubComment(
  prefs: UserPreferences,
  avatar: AvatarConfiguration,
  topRecommendations: RecommendationResult[]
): Promise<GeminiCommentResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  const topClub = topRecommendations[0]?.club;
  const secondClub = topRecommendations[1]?.club;

  if (!apiKey) {
    console.log("No GEMINI_API_KEY found. Generating smart heuristic commentary.");
    return generateSmartFallbackComment(prefs, avatar, topRecommendations);
  }

  const prompt = `
당신은 고려대학교(고대)의 위트 넘치고 든든한 호랑이 마스코트 '호치(AI 호랑이)'입니다.
이번 2학기 개강 시즌을 맞아 동아리를 찾는 고려대 학우의 프로필과 아바타 분석 결과를 보고, 재치 있고 따뜻한 맞춤형 AI 심층 분석 코멘트를 작성해주세요.

[사용자 프로필]
- 단과대/학부: ${prefs.college || "고려대학교 학우"}
- 소속 동아리: ${prefs.currentClub || "새로운 동아리 탐색 중"}
- 관심 카테고리: ${prefs.categories.join(", ")}
- 자유 관심사: ${prefs.interests || "다양한 활동 탐색"}
- 생성된 아바타 타이틀: "${avatar.title}" (${avatar.subtitle})
- 아바타 한줄 설명: ${avatar.description}
- 1위 추천 동아리: ${topClub ? `${topClub.name} (${topClub.category.join("/")}) - ${topClub.description_short}` : "고려대 중앙동아리"}
- 2위 추천 동아리: ${secondClub ? `${secondClub.name} (${secondClub.category.join("/")})` : ""}

[요청 사항]
반드시 아래 JSON 형식으로만 응답해주세요. 마크다운 백틱 없이 순수 JSON만 반환해야 합니다:
{
  "characterAnalysis": "호랑이 자아 및 성향에 대한 재치 있는 2-3문장 분석",
  "clubSynergy": "1위 추천 동아리가 이 학우에게 왜 최고의 선택인지에 대한 2-3문장 시너지 설명",
  "campusTips": "안암 캠퍼스(중앙광장, 하나스퀘어, 참살이길 등)와 연계된 2학기 동아리 라이프 꿀팁 2문장",
  "cheeringMessage": "호랑이의 기운을 담은 파이팅 넘치는 한 줄 응원 구호 (예: 어흥! 이번 2학기 안암골의 주인공은 바로 너다!)"
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText.trim());
      return {
        characterAnalysis: parsed.characterAnalysis || "",
        clubSynergy: parsed.clubSynergy || "",
        campusTips: parsed.campusTips || "",
        cheeringMessage: parsed.cheeringMessage || "어흥! 너의 뜨거운 2학기를 응원해!",
        generatedByAi: true,
      };
    }
  } catch (error) {
    console.error("Gemini API call failed, using fallback:", error);
  }

  return generateSmartFallbackComment(prefs, avatar, topRecommendations);
}

export function generateSmartFallbackComment(
  prefs: UserPreferences,
  avatar: AvatarConfiguration,
  topRecommendations: RecommendationResult[]
): GeminiCommentResponse {
  const topClub = topRecommendations[0]?.club;
  const college = prefs.college || "고려대학교";
  const primaryCat = prefs.categories[0] || "동아리";

  let characterAnalysis = "";
  let clubSynergy = "";
  let campusTips = "";
  let cheeringMessage = "";

  if (primaryCat === "IT/개발") {
    characterAnalysis = `${college}의 테크 열정이 아바타에 고스란히 담겼네요! 문제를 보면 코드로 풀어내고 싶어 하는 호기심과 밤샘 빌딩도 즐길 줄 아는 끈기가 돋보입니다.`;
    clubSynergy = `특히 1위로 추천된 '${topClub?.name || "DevKor"}'에서는 당신의 아이디어를 바로 실제 서비스로 런칭할 수 있는 든든한 동료들을 만나 시너지가 폭발할 거예요.`;
    campusTips = `하나스퀘어 라운지나 중광 카페에서 맥북 열고 커피 한잔하며 개발 토론하기 딱 좋은 시즌입니다. 커밋 잔디와 함께 이번 학기를 빛내보세요!`;
    cheeringMessage = "🐯 버그 없는 깨끗한 코드와 함께, 이번 2학기 안암골의 유니콘 빌더가 되길!";
  } else if (primaryCat === "예술/공연") {
    characterAnalysis = `타고난 표현력과 무대를 사랑하는 뜨거운 열정이 넘쳐흐르는 아바타입니다! 사람들의 시선을 사로잡는 스타성과 감수성을 두루 갖추셨군요.`;
    clubSynergy = `'${topClub?.name || "고대극예술연구회"}'의 무대와 연습실이야말로 당신의 잠재된 끼를 마음껏 폭발시킬 수 있는 최고의 놀이터가 될 것입니다.`;
    campusTips = `민주광장 버스킹의 낭만과 4.18 기념관 소극장의 열기를 직접 느껴보세요. 공연이 끝난 뒤 참살이길 뒷풀이의 감동은 평생 갑니다!`;
    cheeringMessage = "🐯 붉은 함성과 박수갈채 속에서 가장 눈부시게 빛날 당신의 무대를 응원합니다!";
  } else if (primaryCat === "스포츠") {
    characterAnalysis = `지치지 않는 체력과 끈기, 그리고 동료들과의 팀워크를 무엇보다 소중히 여기는 진정한 고려대 호랑이의 기상을 품고 있습니다.`;
    clubSynergy = `'${topClub?.name || "FC KU"}'에서 함께 땀 흘리고 합을 맞추며, 승리의 짜릿함과 끈끈한 전우애를 가슴 깊이 새길 수 있습니다.`;
    campusTips = `녹지운동장에서의 시원한 러닝 후 마시는 이온음료 한 모금과, 고연전 응원의 전율을 온몸으로 즐길 준비를 해보세요!`;
    cheeringMessage = "🐯 승리의 포효와 함께 녹지를 누빌 너의 붉은 열정에 박수를 보낸다!";
  } else if (primaryCat === "학술" || primaryCat === "사회과학" || primaryCat === "창업") {
    characterAnalysis = `날카로운 분석력과 시대를 꿰뚫어보는 통찰력이 돋보이는 지적 탐구자 아바타입니다. 근거 있는 논리와 큰 그림을 보는 리더십이 탁월합니다.`;
    clubSynergy = `'${topClub?.name || "피그말리온"}'의 치열한 세미나와 프로젝트를 통해 단순한 스터디를 넘어 실제 필드에서 통하는 압도적 전문성을 쌓게 될 것입니다.`;
    campusTips = `백주년기념관 열람실과 CJ식품안전관 라운지에서 학우들과 밤샘 토론 후 맞이하는 안암골의 새벽 공기는 지적 쾌감 그 자체입니다.`;
    cheeringMessage = "🐯 날카로운 지성과 뜨거운 야망으로 세상을 선도할 고려대의 브레인, 파이팅!";
  } else {
    characterAnalysis = `특유의 밝은 친화력과 긍정적인 에너지로 주변을 환하게 밝히는 다재다능한 팔방미인 호랑이입니다!`;
    clubSynergy = `'${topClub?.name || "중앙동아리"}'에서 좋은 사람들과 깊은 유대감을 쌓으며, 잊지 못할 대학 생활의 하이라이트를 만들어갈 수 있습니다.`;
    campusTips = `중앙광장 잔디밭에서 즐기는 여유와 참살이길 맛집 탐방으로 가득 채울 설레는 2학기 캠퍼스 라이프를 시작해보세요!`;
    cheeringMessage = "🐯 어흥! 언제 어디서나 사랑받는 너의 멋진 2학기를 온 마음으로 응원해!";
  }

  return {
    characterAnalysis,
    clubSynergy,
    campusTips,
    cheeringMessage,
    generatedByAi: false,
  };
}
