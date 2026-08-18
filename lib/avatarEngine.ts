import { Traits, UserPreferences, calculateUserTraits } from "./recommendEngine";

export interface AvatarConfiguration {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  speechQuote: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  parts: {
    skinTone: string;
    hairType: "short_dandy" | "wavy_perm" | "long_straight" | "red_headband" | "street_beanie" | "ku_cap";
    hairColor: string;
    eyeType: "energetic" | "confident" | "friendly" | "focused" | "winking";
    mouthType: "smile" | "laugh" | "cool" | "talking";
    outfitType: "ku_varsity" | "tech_hoodie" | "stage_rock" | "suit_chic" | "sports_jersey" | "volunteer_vest" | "casual_knit";
    propType: "macbook" | "electric_guitar" | "basketball" | "microphone" | "book_pen" | "camera" | "coffee_cup";
    backgroundType: "central_plaza" | "hana_square" | "festival_stage" | "club_room" | "anam_street" | "library";
    effectType: "sparkles" | "code_binary" | "music_notes" | "fire_passion" | "heart_vibe";
    tigerEars: boolean;
    kuBadge: boolean;
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
  const traits = calculateUserTraits(prefs);
  const primaryCat = prefs.categories[0] || "IT/개발";
  const secondaryCat = prefs.categories[1] || "";
  const interests = (prefs.interests || "").toLowerCase();

  // Determine Dominant Trait
  const maxTrait = (Object.keys(traits) as (keyof Traits)[]).reduce((a, b) =>
    traits[a] > traits[b] ? a : b
  );

  // 1. Outfit Selection based on Primary Category
  let outfitType: AvatarConfiguration["parts"]["outfitType"] = "ku_varsity";
  if (primaryCat === "IT/개발" || interests.includes("코딩") || interests.includes("개발")) {
    outfitType = "tech_hoodie";
  } else if (primaryCat === "예술/공연" || interests.includes("밴드") || interests.includes("음악")) {
    outfitType = "stage_rock";
  } else if (primaryCat === "스포츠" || interests.includes("운동") || interests.includes("축구")) {
    outfitType = "sports_jersey";
  } else if (primaryCat === "봉사" || interests.includes("봉사") || interests.includes("멘토링")) {
    outfitType = "volunteer_vest";
  } else if (primaryCat === "학술" || primaryCat === "사회과학" || primaryCat === "창업") {
    outfitType = "suit_chic";
  } else if (primaryCat === "취미/친목") {
    outfitType = "casual_knit";
  } else {
    outfitType = "ku_varsity";
  }

  // 2. Prop Selection based on Secondary Category or keywords
  let propType: AvatarConfiguration["parts"]["propType"] = "macbook";
  if (interests.includes("기타") || interests.includes("노래") || primaryCat === "예술/공연") {
    propType = "electric_guitar";
  } else if (interests.includes("마이크") || interests.includes("방송") || primaryCat === "미디어/방송") {
    propType = "microphone";
  } else if (interests.includes("공") || interests.includes("농구") || primaryCat === "스포츠") {
    propType = "basketball";
  } else if (interests.includes("카메라") || interests.includes("영상") || secondaryCat === "미디어/방송") {
    propType = "camera";
  } else if (primaryCat === "학술" || primaryCat === "사회과학" || interests.includes("공부") || interests.includes("책")) {
    propType = "book_pen";
  } else if (primaryCat === "취미/친목" || interests.includes("카페")) {
    propType = "coffee_cup";
  } else {
    propType = "macbook";
  }

  // 3. Hair Selection
  let hairType: AvatarConfiguration["parts"]["hairType"] = "short_dandy";
  if (traits.activity >= 4.5) {
    hairType = "red_headband"; // 승리의 빨간 머리띠
  } else if (primaryCat === "예술/공연") {
    hairType = "street_beanie";
  } else if (traits.creativity >= 4.5) {
    hairType = "wavy_perm";
  } else if (traits.sociability >= 4.5) {
    hairType = "ku_cap";
  } else {
    hairType = "short_dandy";
  }

  // 4. Eyes & Expressions based on Traits
  let eyeType: AvatarConfiguration["parts"]["eyeType"] = "energetic";
  let mouthType: AvatarConfiguration["parts"]["mouthType"] = "smile";
  if (traits.sociability >= 4.5) {
    eyeType = "friendly";
    mouthType = "laugh";
  } else if (traits.expertise >= 4.5) {
    eyeType = "focused";
    mouthType = "cool";
  } else if (traits.creativity >= 4.5) {
    eyeType = "winking";
    mouthType = "smile";
  } else {
    eyeType = "energetic";
    mouthType = "smile";
  }

  // 5. Background selection
  let backgroundType: AvatarConfiguration["parts"]["backgroundType"] = "central_plaza";
  if (primaryCat === "IT/개발") {
    backgroundType = "hana_square";
  } else if (primaryCat === "예술/공연") {
    backgroundType = "festival_stage";
  } else if (primaryCat === "학술" || primaryCat === "사회과학") {
    backgroundType = "library";
  } else if (primaryCat === "취미/친목" || traits.sociability >= 4.5) {
    backgroundType = "anam_street";
  } else {
    backgroundType = "club_room";
  }

  // 6. Effect Type
  let effectType: AvatarConfiguration["parts"]["effectType"] = "sparkles";
  if (primaryCat === "IT/개발") effectType = "code_binary";
  else if (primaryCat === "예술/공연") effectType = "music_notes";
  else if (traits.activity >= 4.5) effectType = "fire_passion";
  else if (traits.sociability >= 4.5) effectType = "heart_vibe";

  // 7. Dynamic Title and Subtitle Generation
  let title = "자유로운 안암골 호랑이";
  let subtitle = "열정과 지성을 겸비한 다재다능형";
  let description = "어떤 동아리에 가도 금세 적응해 팀의 활력소가 되는 올라운더 타입!";
  let speechQuote = "어흥! 나와 함께 이번 2학기 고려대 캠퍼스를 불태워볼 준비 됐어?";

  if (primaryCat === "IT/개발") {
    title = "새벽 코딩하는 하나스퀘어 호랑이";
    subtitle = "밤샘 해커톤과 빌딩에 진심인 개발 꿈나무";
    description = "에러 로그도 두렵지 않다! 코드로 세상을 바꾸고 아이디어를 현실로 구현하는 테크 호랑이.";
    speechQuote = "버그는 잡고 커밋은 쌓인다! 이번 학기엔 내 손으로 멋진 서비스 런칭해볼래!";
  } else if (primaryCat === "예술/공연") {
    title = "민주광장 버스킹의 절대지배자";
    subtitle = "무대 위에서 가장 뜨겁게 빛나는 아티스트";
    description = "관객의 환호와 멜로디에 심장이 뛰는 타고난 무대 체질! 캠퍼스 축제의 주인공.";
    speechQuote = "소리 질러~! 내 안의 넘치는 필과 리듬을 이번 정기 공연에서 전부 보여줄게!";
  } else if (primaryCat === "스포츠") {
    title = "녹지운동장을 달리는 붉은 엔진";
    subtitle = "체력과 근성으로 한계를 뛰어넘는 스포츠맨";
    description = "경기의 승패보다 중요한 건 끝까지 함께 뛰는 동료들과의 전우애! 지치지 않는 체력의 소유자.";
    speechQuote = "패스는 정확하게, 슛은 과감하게! 오늘 운동 끝나고 다 같이 고기 먹으러 가자!";
  } else if (primaryCat === "학술" || primaryCat === "사회과학") {
    title = "백주년기념관의 지적 탐구자";
    subtitle = "날카로운 논리와 통찰로 시대를 읽는 브레인";
    description = "깊이 있는 리서치와 토론을 통해 복잡한 문제의 해답을 찾아내는 고려대의 차세대 리더.";
    speechQuote = "논리적인 근거와 날카로운 인사이트가 있다면, 어떤 문제도 명쾌하게 해결할 수 있어!";
  } else if (primaryCat === "봉사") {
    title = "안암골을 따뜻하게 밝히는 선한 영향력";
    subtitle = "나눔과 연대로 더 나은 세상을 만드는 엔젤";
    description = "혼자만의 성공보다 함께하는 행복의 가치를 아는 따뜻한 마음씨의 소유자.";
    speechQuote = "우리의 작은 관심과 행동이 모이면 세상을 조금 더 따뜻하게 바꿀 수 있어!";
  } else if (primaryCat === "미디어/방송") {
    title = "캠퍼스 트렌드를 리드하는 크리에이터";
    subtitle = "카메라 렌즈로 시대를 포착하고 기록하는 미디어인";
    description = "콘텐츠 감각과 연출력으로 고려대의 모든 순간을 생생하게 담아내는 스토리텔러.";
    speechQuote = "레디, 액션! 호랑이들의 가슴 뛰는 이야기, 지금 바로 송출합니다!";
  } else if (primaryCat === "취미/친목") {
    title = "참살이길 핵인싸 분위기 메이커";
    subtitle = "어디서나 웃음꽃을 피우는 긍정 에너지 호랑이";
    description = "특유의 친화력과 배려심으로 사람들을 끌어모으는 동아리의 소중한 활력소.";
    speechQuote = "인생은 즐기는 거야! 새로운 친구들과 함께라면 매일매일이 축제지!";
  } else if (primaryCat === "창업") {
    title = "세상을 뒤흔들 미래 유니콘 빌더";
    subtitle = "시장의 문제를 날카롭게 파고드는 혁신가";
    description = "실패를 두려워하지 않고 빠른 실행력으로 비즈니스 기회를 창출하는 파운더 마인드.";
    speechQuote = "아이디어에 머무르지 않고 시장에서 증명한다! 우리 팀과 함께 세상을 바꿔볼래?";
  }

  return {
    id: `avatar_${Date.now()}`,
    title,
    subtitle,
    description,
    speechQuote,
    colorTheme: {
      primary: "#862633", // KU Crimson
      secondary: "#1E293B",
      accent: "#F59E0B",
      background: "#FFF5F5",
    },
    parts: {
      skinTone: "#FDE047", // Cute golden tiger tone / warm anime skin
      hairType,
      hairColor: "#1F2937",
      eyeType,
      mouthType,
      outfitType,
      propType,
      backgroundType,
      effectType,
      tigerEars: true,
      kuBadge: true,
    },
    stats: {
      passion: Math.min(100, Math.round(traits.activity * 18 + 10)),
      sociability: Math.min(100, Math.round(traits.sociability * 18 + 10)),
      intellect: Math.min(100, Math.round(traits.expertise * 18 + 10)),
      creativity: Math.min(100, Math.round(traits.creativity * 18 + 10)),
      chill: Math.min(100, Math.round((6 - traits.leadership) * 16 + 15)),
    },
  };
}
