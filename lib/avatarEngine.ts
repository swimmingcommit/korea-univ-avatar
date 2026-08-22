import { Traits, UserPreferences, calculateUserTraits } from "./recommendEngine";

export type AvatarArchetypeId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";

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
  stats: {
    passion: number;
    sociability: number;
    intellect: number;
    creativity: number;
    chill: number;
  };
}

export function generateAvatar(prefs: UserPreferences): AvatarConfiguration {
  const traits = calculateUserTraits(prefs);
  const primaryCat = prefs.categories[0] || "IT/개발";
  const allCats = prefs.categories || [];
  const interests = (prefs.interests || "").toLowerCase();
  const isNoClub =
    prefs.currentClub?.includes("없음") ||
    prefs.currentClub?.includes("새내기") ||
    prefs.currentClub?.includes("탐색") ||
    !prefs.currentClub;

  // 1. Archetype Decision Tree based on User Request 8 Archetypes:
  // 01: 무대 위의 야망 흑표범 (공연/예술, 활동성/창작성 高)
  // 02: 밤샘 코딩 잉크 부족 올빼미 (IT/개발, 전문성/창작성 高, 사교성 低)
  // 03: 캠퍼스 평화주의 텀블러 요정 (봉사/환경/사회과학, 사교성/리더십 高)
  // 04: 전략적 투머치토커 학회장 (학술/토론/리더십, 전문성/리더십/사교성 高)
  // 05: 근손실 걱정하는 중앙광장 러너 (스포츠/체육, 활동성 高)
  // 06: 미지의 취미 탐험가 #갓생살기 (취미/친목, 창작성/사교성 高)
  // 07: 조용한 카리스마 서재의 은둔자 (학술/인문/철학, 전문성 高, 사교성 低)
  // 08: 과잠 입은 새내기 (무소속의 야망) (새내기/탐색/무소속, 밸런스)

  let archetypeId: AvatarArchetypeId = "08";

  if (isNoClub && allCats.length === 0 && !interests) {
    archetypeId = "08";
  } else if (
    primaryCat === "예술/공연" ||
    interests.includes("밴드") ||
    interests.includes("공연") ||
    interests.includes("무대") ||
    interests.includes("댄스") ||
    interests.includes("음악") ||
    interests.includes("보컬")
  ) {
    archetypeId = "01";
  } else if (
    primaryCat === "IT/개발" ||
    interests.includes("코딩") ||
    interests.includes("개발") ||
    interests.includes("해커톤") ||
    interests.includes("파이썬") ||
    interests.includes("웹") ||
    interests.includes("알고리즘")
  ) {
    archetypeId = "02";
  } else if (
    primaryCat === "봉사" ||
    interests.includes("봉사") ||
    interests.includes("환경") ||
    interests.includes("멘토링") ||
    interests.includes("나눔")
  ) {
    archetypeId = "03";
  } else if (
    (primaryCat === "학술" || primaryCat === "사회과학" || primaryCat === "창업") &&
    (traits.leadership >= 3.5 || traits.sociability >= 3.5 || interests.includes("토론") || interests.includes("전략") || interests.includes("발표"))
  ) {
    archetypeId = "04";
  } else if (
    primaryCat === "스포츠" ||
    interests.includes("운동") ||
    interests.includes("축구") ||
    interests.includes("농구") ||
    interests.includes("러닝") ||
    interests.includes("헬스") ||
    traits.activity >= 4.0
  ) {
    archetypeId = "05";
  } else if (
    primaryCat === "취미/친목" ||
    interests.includes("여행") ||
    interests.includes("보드게임") ||
    interests.includes("맛집") ||
    interests.includes("다양") ||
    interests.includes("갓생")
  ) {
    archetypeId = "06";
  } else if (
    primaryCat === "미디어/방송" ||
    interests.includes("사진") ||
    interests.includes("영상") ||
    interests.includes("유튜브") ||
    interests.includes("콘텐츠") ||
    interests.includes("필름") ||
    interests.includes("카메라") ||
    interests.includes("디자인")
  ) {
    archetypeId = "07";
  } else if (isNoClub) {
    archetypeId = "08";
  } else {
    archetypeId = "06";
  }

  // 2. Archetype Definitions (Matching User Specifications Exactly)
  switch (archetypeId) {
    case "01": // 무대 위의 야망 흑표범
      return {
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

    case "02": // 밤샘 코딩 잉크 부족 올빼미
      return {
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

    case "03": // 캠퍼스 평화주의 텀블러 요정
      return {
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

    case "04": // 전략적 투머치토커 학회장
      return {
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

    case "05": // 근손실 걱정하는 중앙광장 러너
      return {
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

    case "06": // 미지의 취미 탐험가 #갓생살기
      return {
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

    case "07": // 안암골 감성 필름 크리에이터
      return {
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

    case "08": // 과잠 입은 새내기 (무소속의 야망)
    default:
      return {
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
  }
}
