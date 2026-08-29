import clubsData from "@/data/clubs.json";
import { Traits, computeTraitSimilarity } from "./traitSimilarity";

export type { Traits };

export interface Club {
  id: string;
  name: string;
  category: string[];
  college: string;
  type: string;
  traits: Traits;
  keywords: string[];
  description_short: string;
  external_link: string;
  recruit_period: string;
}

export interface UserPreferences {
  currentClub?: string;
  categories: string[];
  interests?: string;
  college?: string;
  quizTraits?: Traits;
}

export interface RecommendationResult {
  club: Club;
  matchScore: number; // 0 to 100 (%)
  matchedReasons: string[];
  highlightKeywords: string[];
}

// Default trait profiles for categories if quiz is not taken
export const CATEGORY_DEFAULT_TRAITS: Record<string, Traits> = {
  "IT/개발": { sociability: 2.5, activity: 2.0, creativity: 4.8, leadership: 3.2, expertise: 4.9 },
  "학술": { sociability: 3.0, activity: 2.2, creativity: 3.8, leadership: 4.0, expertise: 4.8 },
  "예술/공연": { sociability: 4.8, activity: 4.5, creativity: 4.9, leadership: 3.5, expertise: 4.0 },
  "스포츠": { sociability: 4.7, activity: 5.0, creativity: 2.5, leadership: 4.0, expertise: 4.2 },
  "봉사": { sociability: 4.8, activity: 3.8, creativity: 4.0, leadership: 4.2, expertise: 2.8 },
  "미디어/방송": { sociability: 4.0, activity: 4.0, creativity: 4.9, leadership: 4.2, expertise: 4.4 },
  "취미/친목": { sociability: 4.9, activity: 3.5, creativity: 3.2, leadership: 2.5, expertise: 3.0 },
  "창업": { sociability: 4.2, activity: 4.0, creativity: 5.0, leadership: 5.0, expertise: 4.5 },
  "사회과학": { sociability: 3.8, activity: 3.2, creativity: 4.2, leadership: 4.8, expertise: 4.5 },
  "종교": { sociability: 4.2, activity: 2.8, creativity: 3.0, leadership: 3.2, expertise: 2.5 },
};

export function calculateUserTraits(prefs: UserPreferences): Traits {
  if (prefs.quizTraits) {
    return prefs.quizTraits;
  }

  // Calculate averaged traits from selected categories
  const baseTraits: Traits = { sociability: 3, activity: 3, creativity: 3, leadership: 3, expertise: 3 };
  if (!prefs.categories || prefs.categories.length === 0) {
    return baseTraits;
  }

  let totalSociability = 0;
  let totalActivity = 0;
  let totalCreativity = 0;
  let totalLeadership = 0;
  let totalExpertise = 0;
  let count = 0;

  for (const cat of prefs.categories) {
    const profile = CATEGORY_DEFAULT_TRAITS[cat];
    if (profile) {
      totalSociability += profile.sociability;
      totalActivity += profile.activity;
      totalCreativity += profile.creativity;
      totalLeadership += profile.leadership;
      totalExpertise += profile.expertise;
      count++;
    }
  }

  if (count === 0) return baseTraits;

  return {
    sociability: Number((totalSociability / count).toFixed(2)),
    activity: Number((totalActivity / count).toFixed(2)),
    creativity: Number((totalCreativity / count).toFixed(2)),
    leadership: Number((totalLeadership / count).toFixed(2)),
    expertise: Number((totalExpertise / count).toFixed(2)),
  };
}

export function recommendClubs(prefs: UserPreferences, topN = 5): RecommendationResult[] {
  const userTraits = calculateUserTraits(prefs);
  const clubs = clubsData as Club[];

  const userInterestsRaw = (prefs.interests || "").toLowerCase();
  const userKeywords = userInterestsRaw
    .split(/[\s,./#~!?]+/)
    .filter((w) => w.length >= 2);

  interface ScoredCandidate {
    club: Club;
    rawScore: number;
    matchedReasons: string[];
    highlightKeywords: string[];
  }

  const scoredClubs: ScoredCandidate[] = clubs.map((club) => {
    // 1. Euclidean distance-based trait similarity (0.0 ~ 1.0)
    const similarity = computeTraitSimilarity(userTraits, club.traits);

    // 2. Category matching bonus (up to +0.25)
    let categoryBonus = 0;
    if (prefs.categories && prefs.categories.length > 0) {
      const matchCount = club.category.filter((cat) => prefs.categories.includes(cat)).length;
      if (matchCount > 0) {
        categoryBonus = Math.min(0.25, matchCount * 0.15);
      }
    }

    // 3. Keyword matching bonus (up to +0.20)
    let keywordBonus = 0;
    const matchedKeywords: string[] = [];
    if (userKeywords.length > 0 || userInterestsRaw.length > 0) {
      for (const kw of club.keywords) {
        const lowerKw = kw.toLowerCase();
        const isMatched =
          userKeywords.some((ukw) => lowerKw.includes(ukw) || ukw.includes(lowerKw)) ||
          (lowerKw.length >= 2 && userInterestsRaw.includes(lowerKw));
        if (isMatched && !matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
          keywordBonus += 0.06;
        }
      }
      keywordBonus = Math.min(0.20, keywordBonus);
    }

    // 4. College match bonus (+0.05)
    let collegeBonus = 0;
    if (prefs.college && club.college === prefs.college && club.college !== "전체") {
      collegeBonus = 0.05;
    }

    // 5. Current club penalty (if already belonging to it, deprioritize slightly)
    let currentClubPenalty = 0;
    if (prefs.currentClub && club.name.toLowerCase().includes(prefs.currentClub.toLowerCase())) {
      currentClubPenalty = -0.15;
    }

    // Unclamped continuous raw score
    const rawScore = similarity * 0.65 + categoryBonus + keywordBonus + collegeBonus + currentClubPenalty;

    // Generate matched reason tags
    const reasons: string[] = [];
    if (categoryBonus > 0) {
      reasons.push(`${club.category.join(", ")} 관심사 일치`);
    }
    if (matchedKeywords.length > 0) {
      reasons.push(`핵심 키워드 '${matchedKeywords.slice(0, 2).join(", ")}' 연관`);
    }
    if (club.traits.expertise >= 4.5 && userTraits.expertise >= 3.5) {
      reasons.push("높은 전문성 & 실무 성장 잠재력");
    }
    if (club.traits.sociability >= 4.5 && userTraits.sociability >= 3.5) {
      reasons.push("끈끈한 친목과 활발한 네트워킹");
    }
    if (club.traits.activity >= 4.5 && userTraits.activity >= 3.5) {
      reasons.push("열정적인 에너지 & 역동적 활동");
    }
    if (reasons.length === 0) {
      reasons.push("종합 성향 벡터 기반 최적 매칭");
    }

    return {
      club,
      rawScore,
      matchedReasons: reasons,
      highlightKeywords: matchedKeywords.length > 0 ? matchedKeywords : club.keywords.slice(0, 3),
    };
  });

  // 1차 정렬: rawScore 내림차순, 동점 시 club.id 오름차순 (명시적 tie-break)
  scoredClubs.sort((a, b) => {
    if (b.rawScore !== a.rawScore) {
      return b.rawScore - a.rawScore;
    }
    return a.club.id.localeCompare(b.club.id);
  });

  // Top N 후보 추출
  const topCandidates = scoredClubs.slice(0, topN);

  if (topCandidates.length === 0) {
    return [];
  }

  // topN 후보들끼리 Min-Max 상대 정규화 (75% ~ 98% 구간, min===max인 경우 90% 고정)
  const rawScores = topCandidates.map((c) => c.rawScore);
  const minRaw = Math.min(...rawScores);
  const maxRaw = Math.max(...rawScores);
  const isUniform = Math.abs(maxRaw - minRaw) < 1e-6;

  return topCandidates.map((c) => {
    let matchScore = 90;
    if (!isUniform) {
      const normalizedRatio = (c.rawScore - minRaw) / (maxRaw - minRaw);
      matchScore = Math.round(75 + normalizedRatio * (98 - 75));
    }

    return {
      club: c.club,
      matchScore,
      matchedReasons: c.matchedReasons,
      highlightKeywords: c.highlightKeywords,
    };
  });
}
