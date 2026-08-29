import { Traits, computeTraitSimilarity } from "./traitSimilarity";
import { UserPreferences, calculateUserTraits } from "./recommendEngine";

export type UserTraits = Traits;
export type AvatarArchetypeId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";

export interface ArchetypeRule {
  id: AvatarArchetypeId;
  name: string;
  categories: string[];
  keywords: string[];
  traitKey?: keyof Traits;
}

export const ARCHETYPE_RULES: Record<AvatarArchetypeId, ArchetypeRule> = {
  "01": {
    id: "01",
    name: "무대 위의 야망 흑표범",
    categories: ["예술/공연"],
    keywords: ["밴드", "공연", "무대", "댄스", "음악", "보컬", "악기", "연극", "뮤지컬", "버스킹", "노래", "합주", "안무"],
    traitKey: "creativity",
  },
  "02": {
    id: "02",
    name: "밤샘 코딩 잉크 부족 올빼미",
    categories: ["IT/개발"],
    keywords: ["코딩", "개발", "해커톤", "파이썬", "웹", "알고리즘", "인공지능", "ai", "프로그래밍", "앱", "백엔드", "프론트엔드", "소프트웨어"],
    traitKey: "expertise",
  },
  "03": {
    id: "03",
    name: "캠퍼스 평화주의 텀블러 요정",
    categories: ["봉사"],
    keywords: ["봉사", "환경", "멘토링", "나눔", "기여", "사회공헌", "친환경", "텀블러", "에코", "서포터즈"],
    traitKey: "sociability",
  },
  "04": {
    id: "04",
    name: "전략적 투머치토커 학회장",
    categories: ["학술", "사회과학", "창업"],
    keywords: ["토론", "전략", "발표", "학회", "세미나", "기획", "경영", "스타트업", "학술", "피치", "논문", "리서치", "피칭", "아이디어"],
    traitKey: "leadership",
  },
  "05": {
    id: "05",
    name: "근손실 걱정하는 중앙광장 러너",
    categories: ["스포츠"],
    keywords: ["운동", "축구", "농구", "러닝", "헬스", "야구", "피트니스", "배드민턴", "테니스", "클라이밍", "수영", "체육", "근력", "헬창", "마라톤"],
    traitKey: "activity",
  },
  "06": {
    id: "06",
    name: "미지의 취미 탐험가 #갓생살기",
    categories: ["취미/친목"],
    keywords: ["여행", "보드게임", "맛집", "갓생", "요리", "게임", "친목", "취미", "공예", "베이킹", "카페", "원데이클래스", "탐방"],
    traitKey: "sociability",
  },
  "07": {
    id: "07",
    name: "안암골 감성 필름 크리에이터",
    categories: ["미디어/방송"],
    keywords: ["사진", "영상", "유튜브", "콘텐츠", "필름", "카메라", "디자인", "편집", "촬영", "방송", "미디어", "포토", "쇼츠", "릴스", "브이로그"],
    traitKey: "creativity",
  },
  "08": {
    id: "08",
    name: "과잠 입은 새내기 (무소속의 야망)",
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

  // 2. 키워드 매칭: prefs.interests 텍스트에 포함된 키워드 개수 * 15점
  if (userInterests.trim().length > 0) {
    archetypeIds.forEach((archId) => {
      const rule = ARCHETYPE_RULES[archId];
      let matchedCount = 0;
      rule.keywords.forEach((kw) => {
        if (userInterests.includes(kw.toLowerCase())) {
          matchedCount++;
        }
      });
      scores[archId] += matchedCount * 15;
    });
  }

  // 3. 퀴즈 성향(traits) 반영: (trait값 - 3) * 10 만큼 가감
  archetypeIds.forEach((archId) => {
    const rule = ARCHETYPE_RULES[archId];
    if (rule.traitKey && traits[rule.traitKey] !== undefined) {
      const traitVal = traits[rule.traitKey];
      scores[archId] += (traitVal - 3) * 10;
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
    case "01": // 무대 위의 야망 흑표범
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "무대 위의 야망 흑표범",
        subtitle: "#공연 #예술 #열정 (활동성·창작성 高)",
        description: "화려한 조명 아래서 가장 빛나는 카리스마 아티스트! 내 안의 넘치는 끼를 스튜디오나 동방에 가둘 수 없습니다.",
        speechQuote: "너의 끼는 스튜디오나 동아리방에 갇혀있을 수 없어! 화려한 조명 아래서 가장 빛나는 너!",
        geminiToneExample: "너의 끼는 스튜디오나 동아리방에 갇혀있을 수 없어! 화려한 조명 아래서 가장 빛나는 너!",
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

    case "02": // 밤샘 코딩 잉크 부족 올빼미
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "밤샘 코딩 잉크 부족 올빼미",
        subtitle: "#IT/개발 #밤샘 #몰입 (전문성·창작성 高, 사교성 低)",
        description: "에러 로그와 치열하게 싸우다 아침을 맞이하는 하드코어 빌더! 잉크는 닳았지만 화면 속 초록색 코드는 쏟아집니다.",
        speechQuote: "오류와 싸우다 아침을 맞이하는 너, 잉크는 없지만 코드는 넘쳐나! (근데 좀 자...)",
        geminiToneExample: "오류와 싸우다 아침을 맞이하는 너, 잉크는 없지만 코드는 넘쳐나! (근데 좀 자...)",
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

    case "03": // 캠퍼스 평화주의 텀블러 요정
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "캠퍼스 평화주의 텀블러 요정",
        subtitle: "#봉사 #환경 #사회과학 (사교성·리더십 高)",
        description: "세상을 더 따뜻하고 나은 곳으로 바꾸려는 선한 영향력의 소유자! 텀블러처럼 꽉 찬 정의감과 배려심으로 캠퍼스를 밝힙니다.",
        speechQuote: "세상을 더 나은 곳으로 만들려는 너의 마음! 텀블러처럼 꽉 찬 너의 정의감과 따뜻함!",
        geminiToneExample: "세상을 더 나은 곳으로 만들려는 너의 마음! 텀블러처럼 꽉 찬 너의 정의감과 따뜻함!",
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

    case "04": // 전략적 투머치토커 학회장
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "전략적 투머치토커 학회장",
        subtitle: "#학술 #토론 #리더십 (전문성·리더십·사교성 高)",
        description: "철저한 팩트와 논리로 무장한 발표의 달인! 한번 마이크를 잡으면 끝나지 않는 열정 스피치로 청중을 압도합니다.",
        speechQuote: "팩트와 논리로 무장한 너! 너의 스피치에 모두가 집중할 수밖에! (조금만 짧게 말해줘..)",
        geminiToneExample: "팩트와 논리로 무장한 너! 너의 스피치에 모두가 집중할 수밖에! (조금만 짧게 말해줘..)",
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

    case "05": // 근손실 걱정하는 중앙광장 러너
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "근손실 걱정하는 중앙광장 러너",
        subtitle: "#스포츠 #체육 #건강 (활동성 高)",
        description: "안암골 캠퍼스 전체가 나의 트랙! 과잠보다 트레이닝복이 찰떡같이 어울리는 지치지 않는 활력의 에너자이저.",
        speechQuote: "캠퍼스는 너의 트랙! 과잠보다 운동복이 더 잘 어울리는 너, 오늘 혹시 하체 데이?",
        geminiToneExample: "캠퍼스는 너의 트랙! 과잠보다 운동복이 더 잘 어울리는 너, 오늘 혹시 하체 데이?",
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

    case "06": // 미지의 취미 탐험가 #갓생살기
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "미지의 취미 탐험가 #갓생살기",
        subtitle: "#취미/친목 #다양성 #도전 (창작성·사교성 高)",
        description: "이것저것 다 해보고 싶은 캠퍼스 욕심쟁이! 카메라 메고 보드게임, 맛집, 여행까지 매일이 새로운 어드벤처입니다.",
        speechQuote: "이것저것 다 해보고 싶은 욕심쟁이! 너의 캠퍼스 라이프는 매일이 새로운 어드벤처!",
        geminiToneExample: "이것저것 다 해보고 싶은 욕심쟁이! 너의 캠퍼스 라이프는 매일이 새로운 어드벤처!",
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

    case "07": // 안암골 감성 필름 크리에이터
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId,
        title: "안암골 감성 필름 크리에이터",
        subtitle: "#미디어 #콘텐츠 #사진·영상 (창작성·감성 高)",
        description: "캠퍼스의 모든 찰나를 영화처럼 담아내는 감성 아티스트! 렌즈와 뷰파인더 너머로 안암골의 낭만과 청춘을 기록합니다.",
        speechQuote: "캠퍼스의 모든 찰나가 너의 뷰파인더 속에선 영화가 돼! 낭만을 기록하는 안암골 최고의 크리에이터!",
        geminiToneExample: "캠퍼스의 모든 찰나가 너의 뷰파인더 속에선 영화가 돼! 낭만을 기록하는 안암골 최고의 크리에이터!",
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

        case "08": // 과잠 입은 새내기 (무소속의 야망)
    default:
      baseConfig = {
        id: `avatar_${archetypeId}_${Date.now()}`,
        archetypeId: "08",
        title: "과잠 입은 새내기 (무소속의 야망)",
        subtitle: "#새내기 #탐색 중 #무소속 (무한한 가능성)",
        description: "아직 어디에도 속하지 않았다는 건, 곧 어디든 갈 수 있다는 뜻! 새빨간 크림슨 과잠을 입고 캠퍼스를 탐색하는 슈퍼 루키.",
        speechQuote: "아직 어디에도 속하지 않은 너, 그건 곧 어디든 갈 수 있다는 뜻! 무한한 가능성의 새내기!",
        geminiToneExample: "아직 어디에도 속하지 않은 너, 그건 곧 어디든 갈 수 있다는 뜻! 무한한 가능성의 새내기!",
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
