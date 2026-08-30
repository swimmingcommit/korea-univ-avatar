import { Traits, computeTraitSimilarity } from "./traitSimilarity";
import { CATEGORY_DEFAULT_TRAITS, UserPreferences, calculateUserTraits } from "./recommendEngine";

export type UserTraits = Traits;
export type AvatarArchetypeId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";

export interface ArchetypeRule {
  id: AvatarArchetypeId;
  name: string;
  categories: string[];
  keywords: string[];
  traitKey?: keyof Traits;
}

export const ARCHETYPE_IDEAL_CATEGORIES: Record<Exclude<AvatarArchetypeId, "08">, string> = {
  "01": "예술/공연",
  "02": "IT/개발",
  "03": "봉사",
  "04": "학술",
  "05": "스포츠",
  "06": "취미/친목",
  "07": "미디어/방송",
};

export const ARCHETYPE_RULES: Record<AvatarArchetypeId, ArchetypeRule> = {
  "01": {
    id: "01",
    name: "폼 미쳤다, 무대 찢고 온 호랑이",
    categories: ["예술/공연"],
    keywords: ["밴드", "공연", "무대", "댄스", "음악", "보컬", "악기", "연극", "뮤지컬", "버스킹", "노래", "합주", "안무"],
    traitKey: "creativity",
  },
  "02": {
    id: "02",
    name: "밤샘 코딩하다 커피 수액 맞는 호랑이",
    categories: ["IT/개발"],
    keywords: ["코딩", "개발", "해커톤", "파이썬", "웹", "알고리즘", "인공지능", "ai", "프로그래밍", "앱", "백엔드", "프론트엔드", "소프트웨어"],
    traitKey: "expertise",
  },
  "03": {
    id: "03",
    name: "안암골 천사 호랑이",
    categories: ["봉사"],
    keywords: ["봉사", "환경", "멘토링", "나눔", "기여", "사회공헌", "친환경", "텀블러", "에코", "서포터즈"],
    traitKey: "sociability",
  },
  "04": {
    id: "04",
    name: "팩트로 뼈 때리는 호랑이",
    categories: ["학술", "사회과학", "창업"],
    keywords: ["토론", "전략", "발표", "학회", "세미나", "기획", "경영", "스타트업", "학술", "피치", "논문", "리서치", "피칭", "아이디어"],
    traitKey: "leadership",
  },
  "05": {
    id: "05",
    name: "근손실 걱정하는 호랑이",
    categories: ["스포츠"],
    keywords: ["운동", "축구", "농구", "러닝", "헬스", "야구", "피트니스", "배드민턴", "테니스", "클라이밍", "수영", "체육", "근력", "헬창", "마라톤", "풋살", "사커", "웨이트"],
    traitKey: "activity",
  },
  "06": {
    id: "06",
    name: "틈만 나면 안암 탈출하는 호랑이",
    categories: ["취미/친목"],
    keywords: ["여행", "보드게임", "맛집", "갓생", "요리", "게임", "친목", "취미", "공예", "베이킹", "카페", "원데이클래스", "탐방"],
    traitKey: "sociability",
  },
  "07": {
    id: "07",
    name: "낭만 줍는 호랑이",
    categories: ["미디어/방송"],
    keywords: ["사진", "영상", "유튜브", "콘텐츠", "필름", "카메라", "디자인", "편집", "촬영", "방송", "미디어", "포토", "쇼츠", "릴스", "브이로그"],
    traitKey: "creativity",
  },
  "08": {
    id: "08",
    name: "고뽕 치사량 맞은 갓기 호랑이",
    categories: ["새내기"],
    keywords: ["새내기", "신입생", "탐색", "과잠", "루키", "모름", "자유"],
    traitKey: undefined,
  },
};

export function calculateArchetypeScores(prefs: UserPreferences): Record<AvatarArchetypeId, number> {
  const traits = calculateUserTraits(prefs);
  const userCategories = prefs.categories || [];
  const userInterests = (prefs.interests || "").toLowerCase();
  const isNoClub =
    prefs.currentClub?.includes("없음") ||
    prefs.currentClub?.includes("새내기") ||
    prefs.currentClub?.includes("탐색") ||
    !prefs.currentClub;

  const scores: Record<AvatarArchetypeId, number> = {
    "01": 0,
    "02": 0,
    "03": 0,
    "04": 0,
    "05": 0,
    "06": 0,
    "07": 0,
    "08": 0,
  };

  const archetypeIds = Object.keys(ARCHETYPE_RULES) as AvatarArchetypeId[];

  // 1. 카테고리 매칭: 1순위 40점, 2순위 이하 20점
  userCategories.forEach((cat, index) => {
    const points = index === 0 ? 40 : 20;
    archetypeIds.forEach((archId) => {
      const rule = ARCHETYPE_RULES[archId];
      if (rule.categories.includes(cat)) {
        scores[archId] += points;
      }
    });
  });

  // 2. 키워드 매칭: prefs.interests 텍스트에 포함된 키워드 개수 * 15점 (최대 3개 매칭 캡 = 최대 45점)
  if (userInterests.trim().length > 0) {
    archetypeIds.forEach((archId) => {
      const rule = ARCHETYPE_RULES[archId];
      let matchedCount = 0;
      rule.keywords.forEach((kw) => {
        if (userInterests.includes(kw.toLowerCase())) {
          matchedCount++;
        }
      });
      const cappedCount = Math.min(matchedCount, 3);
      scores[archId] += cappedCount * 15;
    });
  }

  // 3. 5축 성향 유사도 기반 점수 가산: 각 아키타입의 이상적 5축 벡터와의 유사도(0~1) * 40점 (08번 새내기 제외)
  archetypeIds.forEach((archId) => {
    if (archId === "08") return;
    const categoryKey = ARCHETYPE_IDEAL_CATEGORIES[archId as keyof typeof ARCHETYPE_IDEAL_CATEGORIES];
    const idealVector = CATEGORY_DEFAULT_TRAITS[categoryKey];
    if (idealVector) {
      const similarity = computeTraitSimilarity(traits, idealVector);
      scores[archId] += similarity * 40;
    }
  });

  // 4. 무소속/탐색 중이고 카테고리·키워드·퀴즈 성향이 전혀 없는 경우에만 08번에 +50 보너스
  const hasNoCategories = userCategories.length === 0;
  const hasNoInterests = !userInterests || userInterests.trim().length === 0;
  const hasNoQuizTraits = !prefs.quizTraits;
  if (isNoClub && hasNoCategories && hasNoInterests && hasNoQuizTraits) {
    scores["08"] += 50;
  }

  return scores;
}

export function selectTopArchetype(scores: Record<AvatarArchetypeId, number>): AvatarArchetypeId {
  const archetypeIds = Object.keys(scores) as AvatarArchetypeId[];
  archetypeIds.sort((a, b) => {
    if (scores[b] !== scores[a]) {
      return scores[b] - scores[a];
    }
    return a.localeCompare(b);
  });
  return archetypeIds[0];
}

export interface AvatarConfiguration {
  id: string;
  archetypeId: AvatarArchetypeId;
  title: string;
  subtitle: string;
  description: string;
  speechQuote: string;
  geminiToneExample: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  parts: {
    skinTone: string;
    animalType: "panther" | "owl" | "fairy_tiger" | "scholar_tiger" | "runner_tiger" | "explorer_tiger" | "hermit_tiger" | "freshman_tiger";
    hairType: "stage_glam" | "messy_night" | "soft_fairy" | "dandy_neat" | "sport_band" | "hip_beanie" | "classic_part" | "ku_varsity_cap";
    hairColor: string;
    eyeType: "stage_fierce" | "dark_circle" | "gentle_smile" | "sharp_glasses" | "runner_sparkle" | "curious_round" | "deep_calm" | "freshman_sparkle";
    mouthType: "smile" | "laugh" | "cool" | "talking";
    outfitType: "stage_glam_jacket" | "night_hoodie" | "volunteer_eco_vest" | "formal_president_suit" | "sport_running_wear" | "explorer_casual" | "hermit_knit" | "ku_crimson_varsity";
    propType: "stand_mic" | "energy_drink_laptop" | "eco_tumbler" | "laser_pointer_slide" | "smartwatch_dumbbell" | "camera_map" | "vintage_book_pen" | "campus_guide_map";
    backgroundType: "stage_spotlight" | "night_coding_room" | "peace_nature" | "presentation_hall" | "central_plaza_track" | "chamsali_adventure" | "quiet_library_study" | "ku_main_hall_front";
    effectType: "stage_lights" | "green_matrix" | "sprout_leaves" | "presentation_chart" | "fire_stamina" | "adventure_stars" | "coffee_aroma" | "freshman_twinkle";
  };
  plushImageUrl: string;
  customOverlay?: {
    collegeName?: string;
    collegeBadge?: string;
    interestKeywords?: string[];
    clubName?: string;
  };
  stats: {
    passion: number;
    sociability: number;
    intellect: number;
    creativity: number;
    chill: number;
  };
}

export function generateAvatar(prefs: UserPreferences): AvatarConfiguration {
  const scores = calculateArchetypeScores(prefs);
  const archetypeId = selectTopArchetype(scores);

  let baseConfig: AvatarConfiguration;
  switch (archetypeId) {
    case "01": // 폼 미쳤다, 무대 찢고 온 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "폼 미쳤다, 무대 찢고 온 호랑이",
        subtitle: "#공연 #예술 #열정 (활동성·창작성 高)",
        description: "동방 구석에 썩히기엔 아까운 미친 끼의 소유자.\n멍석만 깔아주면 도파민 터지는 텐션으로 무대를 장악합니다.\n내 안의 관종력을 주체할 수 없다면 당장 스포트라이트 아래로!",
        speechQuote: "너의 끼는 동아리방에 갇혀있을 수 없어!\n화려한 조명 아래서 가장 빛나는 너!",
        geminiToneExample: "너의 끼는 동아리방에 갇혀있을 수 없어!\n화려한 조명 아래서 가장 빛나는 너!",
        colorTheme: {
          primary: "#1E1B4B",
          secondary: "#831843",
          accent: "#F43F5E",
          background: "#FFF1F2",
        },
        parts: {
          skinTone: "#1E293B", // Sleek black panther tone
          animalType: "panther",
          hairType: "stage_glam",
          hairColor: "#0F172A",
          eyeType: "stage_fierce",
          mouthType: "laugh",
          outfitType: "stage_glam_jacket",
          propType: "stand_mic",
          backgroundType: "stage_spotlight",
          effectType: "stage_lights",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 98,
          sociability: 85,
          intellect: 70,
          creativity: 95,
          chill: 50,
        },
      };
      break;

    case "02": // 밤샘 코딩하다 커피 수액 맞는 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "밤샘 코딩하다 커피 수액 맞는 호랑이",
        subtitle: "#IT/개발 #밤샘 #몰입 (전문성·창작성 高, 사교성 低)",
        description: "빨간 맛 에러창과 멱살 잡고 싸우다 동트는 걸 보는 게 일상.\n몸엔 피 대신 아메리카노가 흐르고,\n깃허브 잔디 채우는 맛으로 사는 찐 광기의 몰입형 인재랍니다.",
        speechQuote: "오류창과 기싸움하느라 오늘 밤도 순삭!\n코드는 돌아가는데 내 멘탈이 안 돌아가네.",
        geminiToneExample: "오류창과 기싸움하느라 오늘 밤도 순삭!\n코드는 돌아가는데 내 멘탈이 안 돌아가네.",
        colorTheme: {
          primary: "#0F172A",
          secondary: "#10B981",
          accent: "#38BDF8",
          background: "#F0FDF4",
        },
        parts: {
          skinTone: "#E2E8F0",
          animalType: "owl",
          hairType: "messy_night",
          hairColor: "#334155",
          eyeType: "dark_circle",
          mouthType: "cool",
          outfitType: "night_hoodie",
          propType: "energy_drink_laptop",
          backgroundType: "night_coding_room",
          effectType: "green_matrix",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 88,
          sociability: 35,
          intellect: 98,
          creativity: 92,
          chill: 30,
        },
      };
      break;

    case "03": // 안암골 천사 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "안암골 천사 호랑이",
        subtitle: "#봉사 #환경 #사회과학 (사교성·리더십 高)",
        description: "파워 'F' 감성으로 인류애 충전 완료!\n내 주변은 꼭 따뜻하게 챙기고 싶은 프로 다정러.",
        speechQuote: "세상을 더 나은 곳으로 만들려는 너의 마음!\n정의감과 따뜻함으로 세상을 구한다!",
        geminiToneExample: "세상을 더 나은 곳으로 만들려는 너의 마음!\n정의감과 따뜻함으로 세상을 구한다!",
        colorTheme: {
          primary: "#047857",
          secondary: "#F59E0B",
          accent: "#10B981",
          background: "#ECFDF5",
        },
        parts: {
          skinTone: "#FEF08A",
          animalType: "fairy_tiger",
          hairType: "soft_fairy",
          hairColor: "#65A30D",
          eyeType: "gentle_smile",
          mouthType: "smile",
          outfitType: "volunteer_eco_vest",
          propType: "eco_tumbler",
          backgroundType: "peace_nature",
          effectType: "sprout_leaves",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 85,
          sociability: 96,
          intellect: 78,
          creativity: 82,
          chill: 90,
        },
      };
      break;

    case "04": // 팩트로 뼈 때리는 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "팩트로 뼈 때리는 호랑이",
        subtitle: "#학술 #토론 #리더십 (전문성·리더십·사교성 高)",
        description: "“근거 있어?\" 철저한 논리와 팩트로 무장한 인간 파워포인트.\n가끔 팩폭으로 뼈를 때리기도 하지만,\n기획과 발표에서만큼은 멱살 잡고 하드캐리하는 든든한 브레인이랍니다.",
        speechQuote: "팩트와 논리로 무장했다!\n당신의 스피치에 모두가 집중할 수밖에!\n(조금만 짧게 말해줘..)",
        geminiToneExample: "팩트와 논리로 무장했다!\n당신의 스피치에 모두가 집중할 수밖에!\n(조금만 짧게 말해줘..)",
        colorTheme: {
          primary: "#1E3A8A",
          secondary: "#B45309",
          accent: "#862633",
          background: "#EFF6FF",
        },
        parts: {
          skinTone: "#FDE047",
          animalType: "scholar_tiger",
          hairType: "dandy_neat",
          hairColor: "#1E293B",
          eyeType: "sharp_glasses",
          mouthType: "talking",
          outfitType: "formal_president_suit",
          propType: "laser_pointer_slide",
          backgroundType: "presentation_hall",
          effectType: "presentation_chart",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 92,
          sociability: 90,
          intellect: 96,
          creativity: 80,
          chill: 45,
        },
      };
      break;

    case "05": // 근손실 걱정하는 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "근손실 걱정하는 호랑이",
        subtitle: "#스포츠 #체육 #건강 (활동성 高)",
        description: "공강 시간엔 높은 확률로 체육관이나 헬스장에 서식 중.\n전공책보다 단백질과 스트랩을 더 소중히 여기며,\n땀 흘리는 활동이라면 일단 눈부터 반짝입니다.",
        speechQuote: "캠퍼스는 너의 트랙!\n과잠보다 운동복이 더 잘 어울리는 너,\n오늘 혹시 하체 조지러 가는 날?",
        geminiToneExample: "캠퍼스는 너의 트랙!\n과잠보다 운동복이 더 잘 어울리는 너,\n오늘 혹시 하체 조지러 가는 날?",
        colorTheme: {
          primary: "#DC2626",
          secondary: "#EA580C",
          accent: "#FBBF24",
          background: "#FEF2F2",
        },
        parts: {
          skinTone: "#FBBF24",
          animalType: "runner_tiger",
          hairType: "sport_band",
          hairColor: "#451A03",
          eyeType: "runner_sparkle",
          mouthType: "laugh",
          outfitType: "sport_running_wear",
          propType: "smartwatch_dumbbell",
          backgroundType: "central_plaza_track",
          effectType: "fire_stamina",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 99,
          sociability: 82,
          intellect: 65,
          creativity: 60,
          chill: 70,
        },
      };
      break;

    case "06": // 틈만 나면 안암 탈출하는 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "틈만 나면 안암 탈출하는 호랑이",
        subtitle: "#취미/친목 #다양성 #도전 (창작성·사교성 高)",
        description: "가만히 있는 걸 못 견디는 호기심 만렙 프로찍먹러.\n안암골에만 갇혀있기엔 역마살이 너무 강해,\n틈만 나면 핫플 탐방과 새로운 취미를 찾아 도파민 사냥을 떠납니다.",
        speechQuote: "이것저것 다 해보고 싶은 욕심쟁이!\n너의 캠퍼스 라이프는 매일이 새로운 어드벤처!",
        geminiToneExample: "이것저것 다 해보고 싶은 욕심쟁이!\n너의 캠퍼스 라이프는 매일이 새로운 어드벤처!",
        colorTheme: {
          primary: "#7C3AED",
          secondary: "#EC4899",
          accent: "#F59E0B",
          background: "#FAF5FF",
        },
        parts: {
          skinTone: "#FDE047",
          animalType: "explorer_tiger",
          hairType: "hip_beanie",
          hairColor: "#4C1D95",
          eyeType: "curious_round",
          mouthType: "smile",
          outfitType: "explorer_casual",
          propType: "camera_map",
          backgroundType: "chamsali_adventure",
          effectType: "adventure_stars",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 85,
          sociability: 95,
          intellect: 75,
          creativity: 96,
          chill: 80,
        },
      };
      break;

    case "07": // 낭만 줍는 호랑이
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "낭만 줍는 호랑이",
        subtitle: "#미디어 #콘텐츠 #사진·영상 (창작성·감성 高)",
        description: "남들은 걍 지나치는 풍경도 감성 충만하게 건져내는 인간 핀터레스트.\n영감 찾아 셔터를 누르고 밤새 편집 창과 씨름하면서도,\n예쁘게 뽑힌 결과물 하나에 모든 고통을 잊는 낭만파입니다.",
        speechQuote: "남들은 그냥 지나치는 풍경도\n렌즈를 거치면 작품이 돼!\n안암골 낭만은 네가 다 줍고 다니는구나.",
        geminiToneExample: "남들은 그냥 지나치는 풍경도\n렌즈를 거치면 작품이 돼!\n안암골 낭만은 네가 다 줍고 다니는구나.",
        colorTheme: {
          primary: "#0F766E",
          secondary: "#D97706",
          accent: "#F59E0B",
          background: "#F0FDFA",
        },
        parts: {
          skinTone: "#FEF08A",
          animalType: "hermit_tiger",
          hairType: "classic_part",
          hairColor: "#292524",
          eyeType: "curious_round",
          mouthType: "smile",
          outfitType: "explorer_casual",
          propType: "camera_map",
          backgroundType: "chamsali_adventure",
          effectType: "adventure_stars",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 88,
          sociability: 75,
          intellect: 80,
          creativity: 98,
          chill: 85,
        },
      };
      break;

    case "08": // 고뽕 치사량 맞은 갓기 호랑이
    default:
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "고뽕 치사량 맞은 갓기 호랑이",
        subtitle: "#새내기 #탐색 중 #무소속 (무한한 가능성)",
        description: "아직 뭘 해야 할지 몰라 이것저것 다 찔러보고 싶은 상태.\n크림슨 과잠 핏에 취해 안암골 곳곳을 기웃거리는 중이며,\n어디든 갈 수 있고 뭐든 될 수 있는 무한한 가능성을 갖고 있습니다.",
        speechQuote: "아직 어디에도 속하지 않은 너,\n그건 어디든 갈 수 있다는 뜻!\n무한한 가능성의 새내기!",
        geminiToneExample: "아직 어디에도 속하지 않은 너,\n그건 어디든 갈 수 있다는 뜻!\n무한한 가능성의 새내기!",
        colorTheme: {
          primary: "#862633",
          secondary: "#54131D",
          accent: "#FDE047",
          background: "#FFF5F5",
        },
        parts: {
          skinTone: "#FDE047",
          animalType: "freshman_tiger",
          hairType: "ku_varsity_cap",
          hairColor: "#1F2937",
          eyeType: "freshman_sparkle",
          mouthType: "smile",
          outfitType: "ku_crimson_varsity",
          propType: "campus_guide_map",
          backgroundType: "ku_main_hall_front",
          effectType: "freshman_twinkle",
        },
        plushImageUrl: `/avatars/plush_${archetypeId}.png`,
        stats: {
          passion: 88,
          sociability: 75,
          intellect: 75,
          creativity: 80,
          chill: 85,
        },
      };
      break;
  }

  // 3. Dynamic Personalization Overlays & Custom Badges
  const collegeBadges: Record<string, string> = {
    "의과대학/간호대학": "🩺 의과대학",
    "경영대학": "💼 경영대학",
    "정보대학": "💻 정보대학",
    "공과대학/공학": "⚙️ 공과대학",
    "문과대학": "📖 문과대학",
    "정경대학": "🏛️ 정경대학",
    "사범대학": "🎓 사범대학",
    "디자인조형학부": "🎨 디자인조형",
    "미디어학부": "📹 미디어학부",
    "자유전공학부": "🧭 자유전공",
  };

  const cBadge = (prefs.college && collegeBadges[prefs.college]) || (prefs.college ? `🐯 ${prefs.college}` : "🐯 고려대학교");
  const words = prefs.interests
    ? prefs.interests.split(/[, ]+/).filter(Boolean).slice(0, 3)
    : [];

  baseConfig.customOverlay = {
    collegeName: prefs.college,
    collegeBadge: cBadge,
    interestKeywords: words,
    clubName: prefs.currentClub?.includes("없음") || !prefs.currentClub ? undefined : prefs.currentClub,
  };

  // If specific college and interests are selected, personalize subtitle and title
  if (prefs.college && prefs.college !== "전체" && prefs.college !== "고려대학교") {
    const colShort = prefs.college.replace("대학", "").replace("/간호", "");
    if (words.length > 0) {
      baseConfig.subtitle = `#${colShort} #${words[0]} #${baseConfig.title.split(" ")[0]}`;
    }
  }

  return baseConfig;
}
