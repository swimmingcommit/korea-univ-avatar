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
당신은 고려대학교(고대)의 위트 넘치고 든든한 AI 호랑이 마스코트입니다.
사용자의 프로필과 아바타 유형("${avatar.title}"), 1위 추천 동아리를 보고, 지정된 아바타 성격 톤에 맞춰 재치 있고 따뜻한 맞춤형 AI 심층 분석 코멘트를 작성해주세요.

[사용자 프로필]
- 단과대/학부: ${prefs.college || "고려대학교"}
- 소속 동아리: ${prefs.currentClub || "새로운 동아리 탐색 중"}
- 아바타 타이틀: "${avatar.title}" (${avatar.subtitle})
- 아바타 핵심 대사: "${avatar.speechQuote}"
- 1위 추천 동아리: ${topClub ? `${topClub.name} (${topClub.category.join("/")}) - ${topClub.description_short}` : "고려대 중앙동아리"}
- 2위 추천 동아리: ${secondClub ? `${secondClub.name} (${secondClub.category.join("/")})` : ""}

[응답 가이드라인]
1. characterAnalysis: "${avatar.speechQuote}"의 위트와 감성을 담아 사용자 성향을 분석해주세요 (2-3문장).
2. clubSynergy: 1위 추천 동아리('${topClub?.name || "동아리"}')가 왜 이 아바타에게 찰떡궁합인지 설명해주세요 (2문장).
3. campusTips: 안암 캠퍼스(중앙광장, 하나스퀘어, 참살이길 등)와 연계된 실전 동아리 꿀팁 (1-2문장).
4. cheeringMessage: 호랑이의 기운을 담은 파이팅 넘치는 한 줄 응원 구호.

반드시 아래 순수 JSON 형식으로만 반환하세요 (마크다운 백틱 제외):
{
  "characterAnalysis": "...",
  "clubSynergy": "...",
  "campusTips": "...",
  "cheeringMessage": "..."
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
        characterAnalysis: parsed.characterAnalysis || avatar.speechQuote,
        clubSynergy: parsed.clubSynergy || "",
        campusTips: parsed.campusTips || "",
        cheeringMessage: parsed.cheeringMessage || "어흥! 너의 멋진 2학기 동아리 라이프를 응원해!",
        generatedByAi: true,
      };
    }
  } catch (error) {
    console.error("Gemini API call failed, using smart fallback:", error);
  }

  return generateSmartFallbackComment(prefs, avatar, topRecommendations);
}

export function generateSmartFallbackComment(
  prefs: UserPreferences,
  avatar: AvatarConfiguration,
  topRecommendations: RecommendationResult[]
): GeminiCommentResponse {
  const topClub = topRecommendations[0]?.club;
  const archId = avatar.archetypeId;

  switch (archId) {
    case "01": // 무대 위의 야망 흑표범
      return {
        characterAnalysis: `너의 끼는 스튜디오나 동아리방에 갇혀있을 수 없어! 화려한 조명 아래서 가장 빛나는 카리스마 아티스트 흑표범입니다.`,
        clubSynergy: `'${topClub?.name || "공연 동아리"}'의 무대야말로 당신의 잠재된 퍼포먼스와 음악적 감각을 온전히 폭발시킬 수 있는 최고의 공간입니다.`,
        campusTips: `민주광장 버스킹과 인촌기념관 대공연장의 스포트라이트를 놓치지 마세요. 무대 뒤 참살이길 뒷풀이의 감동은 평생 갑니다!`,
        cheeringMessage: `🐯 화려한 조명 아래서 가장 눈부시게 빛날 흑표범의 무대를 응원해!`,
        generatedByAi: false,
      };

    case "02": // 밤샘 코딩 잉크 부족 올빼미
      return {
        characterAnalysis: `오류와 싸우다 아침을 맞이하는 너, 잉크는 없지만 코드는 넘쳐나! (근데 좀 자...) 몰입과 문제 해결력의 끝판왕 올빼미입니다.`,
        clubSynergy: `'${topClub?.name || "KUCC"}'에서 밤샘 코딩을 함께할 최고의 동료들을 만나 밤하늘을 수놓는 커밋 잔디를 완성하게 될 거예요.`,
        campusTips: `하나스퀘어 24시간 열람실과 중광 카페에서 몬스터 한 캔 따고 키보드 두드리기 딱 좋은 시즌입니다.`,
        cheeringMessage: `🐯 오류 없는 깨끗한 빌드와 함께, 이번 학기 안암골의 슈퍼 빌더가 되길!`,
        generatedByAi: false,
      };

    case "03": // 캠퍼스 평화주의 텀블러 요정
      return {
        characterAnalysis: `세상을 더 나은 곳으로 만들려는 너의 마음! 텀블러처럼 꽉 찬 너의 정의감과 따뜻함이 캠퍼스 전체를 환하게 비춥니다.`,
        clubSynergy: `'${topClub?.name || "봉사 동아리"}'에서 당신의 선한 영향력과 따뜻한 리더십이 만개하여 잊지 못할 나눔의 기적을 만들 것입니다.`,
        campusTips: `중앙광장 잔디밭에서 텀블러 들고 나누는 담소와 교내 플로깅 활동은 안암골에 평화를 가져옵니다!`,
        cheeringMessage: `🐯 세상을 바꾸는 너의 다정한 발걸음을 온 마음으로 응원해!`,
        generatedByAi: false,
      };

    case "04": // 전략적 투머치토커 학회장
      return {
        characterAnalysis: `팩트와 논리로 무장한 너! 너의 스피치에 모두가 집중할 수밖에! (조금만 짧게 말해줘..) 철저한 준비성과 압도적인 달변가입니다.`,
        clubSynergy: `'${topClub?.name || "학술 동아리"}'의 치열한 세미나와 디베이트에서 당신의 날카로운 인사이트와 전략적 사고가 가장 빛날 것입니다.`,
        campusTips: `CJ식품안전관 라운지와 백주년기념관에서 슬라이드 띄워놓고 펼치는 열띤 토론은 지적 쾌감 그 자체입니다.`,
        cheeringMessage: `🐯 논리와 카리스마로 청중을 사로잡을 고려대의 학회장, 파이팅!`,
        generatedByAi: false,
      };

    case "05": // 근손실 걱정하는 중앙광장 러너
      return {
        characterAnalysis: `캠퍼스는 너의 트랙! 과잠보다 운동복이 더 잘 어울리는 너, 오늘 혹시 하체 데이? 지치지 않는 활력과 강철 체력의 소유자입니다.`,
        clubSynergy: `'${topClub?.name || "스포츠 동아리"}'에서 함께 땀 흘리며 달릴 때, 승리의 쾌감과 끈끈한 전우애가 가슴을 뜨겁게 채울 거예요.`,
        campusTips: `수업 끝나자마자 녹지운동장 트랙 5바퀴 돌고 마시는 이온음료 한 잔으로 이번 2학기 근성장 완료!`,
        cheeringMessage: `🐯 근손실 0%에 도전하는 너의 폭발적인 에너지를 응원한다!`,
        generatedByAi: false,
      };

    case "06": // 미지의 취미 탐험가 #갓생살기
      return {
        characterAnalysis: `이것저것 다 해보고 싶은 욕심쟁이! 너의 캠퍼스 라이프는 매일이 새로운 어드벤처! 호기심과 다재다능함이 넘쳐납니다.`,
        clubSynergy: `'${topClub?.name || "취미 동아리"}'에서 새로운 취미와 색다른 인연들을 만나 매주가 축제 같은 대학 생활을 즐길 수 있습니다.`,
        campusTips: `참살이길 골목 맛집 탐방부터 동방 보드게임 한판까지, 발길 닿는 곳마다 새로운 재미를 찾아보세요!`,
        cheeringMessage: `🐯 매일매일 새로운 즐거움으로 가득 찰 너의 갓생 라이프 파이팅!`,
        generatedByAi: false,
      };

    case "07": // 안암골 감성 필름 크리에이터
      return {
        characterAnalysis: `캠퍼스의 모든 찰나가 너의 뷰파인더 속에선 영화가 돼! 낭만을 기록하는 안암골 최고의 감성 크리에이터입니다.`,
        clubSynergy: `'${topClub?.name || "미디어/영상 동아리"}'에서 당신의 시각적 감각과 스토리텔링이 빛을 발해 캠퍼스를 사로잡는 명작을 완성할 거예요.`,
        campusTips: `노을 지는 인촌기념관 계단과 다람쥐길에서 필름 카메라 들고 출사 나가기 딱 좋은 가을입니다!`,
        cheeringMessage: `🐯 렌즈 너머로 청춘의 모든 순간을 찬란하게 담아낼 너를 응원해!`,
        generatedByAi: false,
      };

    case "08": // 과잠 입은 새내기 (무소속의 야망)
    default:
      return {
        characterAnalysis: `아직 어디에도 속하지 않은 너, 그건 곧 어디든 갈 수 있다는 뜻! 무한한 가능성의 새내기! 고려대 크림슨 과잠이 가장 잘 어울립니다.`,
        clubSynergy: `'${topClub?.name || "고려대 동아리"}'에서 109개 동아리 중 가장 당신다운 첫 발걸음을 떼며 가슴 뛰는 캠퍼스 이야기를 시작해보세요.`,
        campusTips: `중앙광장 본관 앞 호랑이 잔디밭에서 인생샷 남기고, 9월 초 가두모집 부스를 투어하며 온갖 동방을 탐험해보세요!`,
        cheeringMessage: `🐯 어흥! 무한한 잠재력으로 캠퍼스를 정복할 새내기 호랑이, 환영해!`,
        generatedByAi: false,
      };
  }
}
