import { calculateArchetypeScores, selectTopArchetype, generateAvatar, ARCHETYPE_RULES } from "../lib/avatarEngine";
import { UserPreferences } from "../lib/recommendEngine";

console.log("=== 🐯 Avatar Engine Test Suite ===");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, extraInfo = "") {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${extraInfo}`);
    failed++;
  }
}

// 1. 스포츠 동의어 키워드 확인 (풋살, 사커, 웨이트)
const sportsKeywords = ARCHETYPE_RULES["05"].keywords;
assert(
  sportsKeywords.includes("풋살") && sportsKeywords.includes("사커") && sportsKeywords.includes("웨이트"),
  "05번 키워드에 풋살, 사커, 웨이트 포함 여부",
  `Keywords: ${JSON.stringify(sportsKeywords)}`
);

// 2. 카테고리 단독 선택 시 해당 아키타입 선출 테스트
const itPrefs: UserPreferences = { categories: ["IT/개발"] };
const itAvatar = generateAvatar(itPrefs);
assert(itAvatar.archetypeId === "02", "IT/개발 단독 선택 시 02번 코딩 호랑이 선출", `Got ${itAvatar.archetypeId}`);

const sportsPrefs: UserPreferences = { categories: ["스포츠"] };
const sportsAvatar = generateAvatar(sportsPrefs);
assert(sportsAvatar.archetypeId === "05", "스포츠 단독 선택 시 05번 근손실 호랑이 선출", `Got ${sportsAvatar.archetypeId}`);

// 3. Activity 트레잇 우세 시 05번(스포츠) 우세 테스트
const activeQuizPrefs: UserPreferences = {
  categories: [],
  quizTraits: { sociability: 4.5, activity: 5.0, creativity: 2.5, leadership: 4.0, expertise: 4.0 },
};
const activeAvatar = generateAvatar(activeQuizPrefs);
assert(activeAvatar.archetypeId === "05", "스포츠 성향(Activity 5.0 등) 퀴즈 입력 시 05번 근손실 호랑이 선출", `Got ${activeAvatar.archetypeId}`);

// 4. 키워드 점수 상한 및 1순위 카테고리 방어 테스트
// IT/개발 1순위 + 스포츠 키워드 6개 폭주 ("축구 농구 러닝 헬스 풋살 웨이트")
const floodPrefs: UserPreferences = {
  categories: ["IT/개발"],
  interests: "축구 농구 러닝 헬스 풋살 웨이트 마라톤 체육",
};
const floodScores = calculateArchetypeScores(floodPrefs);
const floodAvatar = generateAvatar(floodPrefs);

console.log("\n📊 [키워드 폭주 시 점수 분포]");
console.log(`- 02번 (IT/개발): ${floodScores["02"].toFixed(2)}점 (카테고리 40 + 트레잇 유사도 40 = 80점)`);
console.log(`- 05번 (스포츠): ${floodScores["05"].toFixed(2)}점 (키워드 캡 45점 + 트레잇 유사도)`);

assert(
  floodAvatar.archetypeId === "02",
  "스포츠 키워드 6개 폭주 시에도 1순위 IT/개발 카테고리가 02번으로 안정 선출 (키워드 3개 캡 작동)",
  `Got ${floodAvatar.archetypeId}`
);

// 5. 무소속 새내기 기본 Fallback 테스트
const noPrefs: UserPreferences = { categories: [], currentClub: "없음 (새내기/탐색 중)" };
const noAvatar = generateAvatar(noPrefs);
assert(noAvatar.archetypeId === "08", "선택/키워드 없는 새내기 무소속 시 08번 갓기 호랑이 선출", `Got ${noAvatar.archetypeId}`);

console.log(`\n========================================`);
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 All Avatar Engine Tests Passed Perfectly!");
}
