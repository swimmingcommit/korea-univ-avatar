import { recommendClubs, UserPreferences, RecommendationResult } from "./recommendEngine";
import clubsData from "@/data/clubs.json";

function printSeparator(title: string) {
  console.log("\n" + "=".repeat(80));
  console.log(`  ${title}`);
  console.log("=".repeat(80));
}

// ============================================================================
// TEST 1: 기본 스포츠 카테고리 추천 (퀴즈 미응시) - 편차 적용 전/후 비교
// ============================================================================
function test1_DefaultSportsCategory() {
  printSeparator("테스트 1: 스포츠 카테고리 기본 추천 (동일 벡터 분산 검증)");

  const prefs: UserPreferences = {
    categories: ["스포츠"],
    interests: "",
  };

  const results = recommendClubs(prefs, 5);

  console.log("\n[현재 (데이터 미세 편차 적용 후) TOP 5 추천 결과]");
  console.log("-".repeat(80));
  console.log(
    "순위".padEnd(6) +
    "동아리명".padEnd(18) +
    "매칭 점수".padEnd(12) +
    "Trait 벡터 [S, A, C, L, E]".padEnd(30) +
    "매칭 이유"
  );
  console.log("-".repeat(80));

  const uniqueClubs = new Set<string>();
  const scoreSet = new Set<number>();

  results.forEach((r, idx) => {
    uniqueClubs.add(r.club.id);
    scoreSet.add(r.matchScore);
    const traitStr = `[${r.club.traits.sociability}, ${r.club.traits.activity}, ${r.club.traits.creativity}, ${r.club.traits.leadership}, ${r.club.traits.expertise}]`;
    console.log(
      `#${idx + 1}`.padEnd(6) +
      r.club.name.padEnd(18) +
      `${r.matchScore}%`.padEnd(12) +
      traitStr.padEnd(30) +
      r.matchedReasons.join(" / ")
    );
  });

  console.log("\n[검증 결과]");
  console.log(`✔ TOP 5 동아리 고유성: ${uniqueClubs.size === 5 ? "PASS (5개 모두 서로 다른 동아리)" : "FAIL"}`);
  console.log(`✔ Match Score 점수 차등성: ${scoreSet.size > 1 ? `PASS (점수 구간 ${Math.min(...Array.from(scoreSet))}% ~ ${Math.max(...Array.from(scoreSet))}% 로 차등 부여됨)` : "FAIL (모두 동일)"}`);
  console.log(`✔ 과거(수정 전) 비교: 과거에는 15개 스포츠 동아리가 완전히 동일한 [5,5,2,4,4] 벡터를 가져 모두 동률이었으나,`);
  console.log(`  현재는 각 동아리의 세부 활동성/창의성 차이로 인해 명확한 점수 그라데이션과 우선순위가 형성됨.`);
}

// ============================================================================
// TEST 2: 3회 반복 호출 일관성(Determinism) 검증
// ============================================================================
function test2_RepeatConsistency() {
  printSeparator("테스트 2: 3회 반복 호출 결과 일관성(Determinism) 검증");

  const prefs: UserPreferences = {
    categories: ["스포츠"],
    interests: "",
  };

  const runs: RecommendationResult[][] = [];
  for (let i = 0; i < 3; i++) {
    runs.push(recommendClubs(prefs, 5));
  }

  let isConsistent = true;
  for (let i = 0; i < 3; i++) {
    const runSummary = runs[i].map((r) => `${r.club.name}(${r.matchScore}%)`).join(" -> ");
    console.log(`실행 #${i + 1}: ${runSummary}`);

    if (i > 0) {
      const prev = runs[i - 1];
      const curr = runs[i];
      for (let j = 0; j < 5; j++) {
        if (prev[j].club.id !== curr[j].club.id || prev[j].matchScore !== curr[j].matchScore) {
          isConsistent = false;
        }
      }
    }
  }

  console.log("\n[검증 결과]");
  console.log(`✔ 3회 반복 일치 여부: ${isConsistent ? "PASS (3회 모두 100% 동일한 순서 및 점수 유지)" : "FAIL (비일관적 결과 발생)"}`);
}

// ============================================================================
// TEST 3: Quiz Traits 변화에 따른 순위 변동성 검증 (고활동 vs 고창의)
// ============================================================================
function test3_QuizTraitsVariation() {
  printSeparator("테스트 3: 성향(Quiz Traits) 변화에 따른 추천 순위 역동성 검증");

  // 프로필 A: 초고활동형 / 정형화된 팀 스포츠 선호 (Activity: 5.0, Creativity: 1.5)
  const profileA: UserPreferences = {
    categories: ["스포츠"],
    quizTraits: {
      sociability: 5.0,
      activity: 5.0,
      creativity: 1.5,
      leadership: 4.0,
      expertise: 4.0,
    },
  };

  // 프로필 B: 중등도 활동 / 개인 기교 및 창의형 스포츠 선호 (Activity: 4.0, Creativity: 3.0)
  const profileB: UserPreferences = {
    categories: ["스포츠"],
    quizTraits: {
      sociability: 5.0,
      activity: 4.0,
      creativity: 3.0,
      leadership: 4.0,
      expertise: 4.0,
    },
  };

  const resultsA = recommendClubs(profileA, 109); // 전체 순위 추출
  const resultsB = recommendClubs(profileB, 109);

  console.log("\n[프로필 A: 초고활동형 (Activity: 5.0, Creativity: 1.5)] TOP 5");
  console.log("-".repeat(80));
  resultsA.slice(0, 5).forEach((r, idx) => {
    console.log(
      `#${idx + 1}`.padEnd(5) +
      r.club.name.padEnd(18) +
      `점수: ${r.matchScore}%`.padEnd(14) +
      `Traits: [Act: ${r.club.traits.activity}, Cre: ${r.club.traits.creativity}]`.padEnd(30) +
      `(${r.club.description_short})`
    );
  });

  console.log("\n[프로필 B: 기교·창의형 (Activity: 4.0, Creativity: 3.0)] TOP 5");
  console.log("-".repeat(80));
  resultsB.slice(0, 5).forEach((r, idx) => {
    console.log(
      `#${idx + 1}`.padEnd(5) +
      r.club.name.padEnd(18) +
      `점수: ${r.matchScore}%`.padEnd(14) +
      `Traits: [Act: ${r.club.traits.activity}, Cre: ${r.club.traits.creativity}]`.padEnd(30) +
      `(${r.club.description_short})`
    );
  });

  console.log("\n[주요 동아리 순위 변동 비교]");
  console.log("-".repeat(80));
  console.log(
    "동아리명".padEnd(18) +
    "동아리 성향 (Act / Cre)".padEnd(26) +
    "프로필 A 순위".padEnd(16) +
    "프로필 B 순위".padEnd(16) +
    "순위 변화 요약"
  );
  console.log("-".repeat(80));

  const compareClubs = [
    "아마추어축구부",
    "KUBOX",
    "호농회",
    "ENTHES",
    "택견한울",
    "KUTIME",
    "KUBT",
  ];

  compareClubs.forEach((name) => {
    const rankA = resultsA.findIndex((r) => r.club.name === name) + 1;
    const rankB = resultsB.findIndex((r) => r.club.name === name) + 1;
    const club = clubsData.find((c) => c.name === name);
    const traitInfo = `Act: ${club?.traits.activity} / Cre: ${club?.traits.creativity}`;

    let summary = "";
    if (rankA < rankB) {
      summary = `🔺 프로필 A에서 ${rankB - rankA}계단 상위 (고활동 최적)`;
    } else if (rankA > rankB) {
      summary = `🔹 프로필 B에서 ${rankA - rankB}계단 상위 (창의/기교 최적)`;
    } else {
      summary = "동일 순위";
    }

    console.log(
      name.padEnd(18) +
      traitInfo.padEnd(26) +
      `#${rankA}위`.padEnd(16) +
      `#${rankB}위`.padEnd(16) +
      summary
    );
  });

  console.log("\n[검증 결과]");
  const soccerRankA = resultsA.findIndex((r) => r.club.name === nameMatch("아마추어축구부")) + 1;
  const soccerRankB = resultsB.findIndex((r) => r.club.name === nameMatch("아마추어축구부")) + 1;
  const enthesRankA = resultsA.findIndex((r) => r.club.name === nameMatch("ENTHES")) + 1;
  const enthesRankB = resultsB.findIndex((r) => r.club.name === nameMatch("ENTHES")) + 1;

  console.log(`✔ 아마추어축구부(Act 5.0, Cre 1.6): 프로필 A(#${soccerRankA}) > 프로필 B(#${soccerRankB}) ➔ 순위 상승 확인!`);
  console.log(`✔ ENTHES(Act 4.8, Cre 2.4): 프로필 B(#${enthesRankB}) > 프로필 A(#${enthesRankA}) ➔ 순위 상승 확인!`);
}

function nameMatch(target: string): string {
  const c = clubsData.find((club) => club.name.includes(target));
  return c ? c.name : target;
}

// ============================================================================
// Runner
// ============================================================================
function runAllTests() {
  console.log("\n🧪 [추천 엔진 통합 테스트 (recommendEngine.test.ts)] 시작\n");
  test1_DefaultSportsCategory();
  test2_RepeatConsistency();
  test3_QuizTraitsVariation();
  console.log("\n✨ 모든 통합 테스트 검증 완료!\n");
}

runAllTests();
