export interface QuizOption {
  text: string;
  subtext: string;
  emoji: string;
  traits: {
    sociability: number;
    activity: number;
    creativity: number;
    leadership: number;
    expertise: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  categoryTitle: string;
  description: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    categoryTitle: "주말 & 여가 스타일",
    question: "주말에 자유시간이 주어진다면 나는 어떤 하루를 보내고 싶나요?",
    description: "새로운 사람들과의 교류 vs 나만의 몰입 시간",
    options: [
      {
        emoji: "🎉",
        text: "안암 참살이길 번개! 사람들과 왁자지껄 떠들며 에너지 충전",
        subtext: "다양한 사람들을 만나며 새로운 인연을 만드는 게 최고",
        traits: { sociability: 5, activity: 4, creativity: 3, leadership: 3, expertise: 1 },
      },
      {
        emoji: "☕",
        text: "조용한 안암 카페나 방에서 좋아하는 취미/공부에 깊게 몰입",
        subtext: "소수 정예 친구를 보거나 혼자만의 시간을 가지며 성장하는 타입",
        traits: { sociability: 1, activity: 2, creativity: 4, leadership: 1, expertise: 5 },
      },
    ],
  },
  {
    id: 2,
    categoryTitle: "활동 스타일 & 에너지",
    question: "동아리 활동을 할 때 더 끌리는 방식은?",
    description: "역동적인 현장 액션 vs 깊이 있는 지적 창작",
    options: [
      {
        emoji: "🏃",
        text: "온몸으로 뛰고 무대에 서거나 현장에서 직접 부딪히는 역동적 활동!",
        subtext: "스포츠, 댄스, 밴드, 야외 봉사 등 생생한 땀방울이 주는 전율",
        traits: { sociability: 4, activity: 5, creativity: 4, leadership: 3, expertise: 3 },
      },
      {
        emoji: "💻",
        text: "노트북을 켜고 팀원들과 치열하게 기획, 분석, 개발, 창작하는 활동!",
        subtext: "코딩, 학술 토론, 전략 기획, 미디어 영상 편집 등 결과물 중심",
        traits: { sociability: 2, activity: 1, creativity: 5, leadership: 4, expertise: 5 },
      },
    ],
  },
  {
    id: 3,
    categoryTitle: "아이디어 & 문제해결",
    question: "새로운 프로젝트나 행사를 준비할 때 나의 태도는?",
    description: "파격적인 새로운 시도 vs 검증된 룰과 체계적 완성도",
    options: [
      {
        emoji: "💡",
        text: "아무도 해본 적 없는 독창적이고 실험적인 아이디어 먼저 지르기!",
        subtext: "틀에 얽매이지 않고 창의적인 재미를 만들어내는 개척자",
        traits: { sociability: 3, activity: 4, creativity: 5, leadership: 4, expertise: 3 },
      },
      {
        emoji: "📐",
        text: "기존 선배들의 족보와 프로세스를 꼼꼼히 분석해 완벽한 퀄리티로 완성!",
        subtext: "체계적이고 탄탄한 논리와 실행력으로 신뢰받는 완벽주의자",
        traits: { sociability: 2, activity: 2, creativity: 2, leadership: 3, expertise: 5 },
      },
    ],
  },
  {
    id: 4,
    categoryTitle: "팀 내 나의 포지션",
    question: "동아리 팀 프로젝트에서 내가 자연스럽게 맡게 되는 역할은?",
    description: "앞장서서 이끄는 리더 vs 묵묵히 핵심을 완성하는 실력파",
    options: [
      {
        emoji: "👑",
        text: "전체 방향을 이끌고 팀원들의 분위기를 북돋우는 회장/기획 총괄",
        subtext: "의사결정을 내리고 사람들을 하나로 모으는 타고난 리더십",
        traits: { sociability: 5, activity: 4, creativity: 4, leadership: 5, expertise: 3 },
      },
      {
        emoji: "🛠️",
        text: "내 담당 파트의 퀄리티를 최상으로 뽑아내는 든든한 에이스 실무자",
        subtext: "묵묵히 자기 역할을 200% 해내며 팀의 핵심 기둥이 되는 타입",
        traits: { sociability: 2, activity: 2, creativity: 4, leadership: 1, expertise: 5 },
      },
    ],
  },
  {
    id: 5,
    categoryTitle: "이번 학기 나의 목표",
    question: "이번 2학기 동아리를 통해 가장 얻고 싶은 소중한 가치는?",
    description: "평생 갈 동기/선후배 인연 vs 독보적인 실력과 포트폴리오",
    options: [
      {
        emoji: "🐯",
        text: "평생 잊지 못할 추억과 끈끈한 고려대 호랑이 동기·선후배 인맥!",
        subtext: "새벽 뒷풀이, 축제 응원, 엠티 등 뜨거운 청춘의 유대감",
        traits: { sociability: 5, activity: 4, creativity: 3, leadership: 4, expertise: 2 },
      },
      {
        emoji: "🚀",
        text: "어디서도 쉽게 얻을 수 없는 압도적인 전문 역량과 빛나는 포트폴리오!",
        subtext: "취업/진로에 직결되는 수상 실적, 실전 경험, 지적 성장",
        traits: { sociability: 2, activity: 2, creativity: 4, leadership: 3, expertise: 5 },
      },
    ],
  },
];
