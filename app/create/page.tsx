"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Search, Check, ArrowRight, Tag, BookOpen, GraduationCap, X, Users } from "lucide-react";
import clubsData from "@/data/clubs.json";
import { KU_COLLEGES } from "@/lib/colleges";
import { UserPreferences } from "@/lib/recommendEngine";
import { generateAvatar } from "@/lib/avatarEngine";

const AVAILABLE_CATEGORIES = [
  { id: "IT/개발", label: "💻 IT/개발", desc: "코딩, AI, 웹/앱, 해커톤" },
  { id: "학술", label: "📚 학술/연구", desc: "경영전략, 토론, 세미나, 스터디" },
  { id: "예술/공연", label: "🎸 예술/공연", desc: "밴드, 댄스, 연극, 오케스트라" },
  { id: "스포츠", label: "⚽ 스포츠/운동", desc: "축구, 농구, 국궁, 서핑, 산악" },
  { id: "봉사", label: "🤝 봉사/사회", desc: "교육봉사, 멘토링, 지역사회" },
  { id: "미디어/방송", label: "📹 미디어/방송", desc: "방송국, 영상제작, 신문사" },
  { id: "취미/친목", label: "🎲 취미/친목", desc: "보드게임, 여행, 맛집, 와인" },
  { id: "창업", label: "🚀 창업/비즈니스", desc: "스타트업 빌딩, IR 피칭" },
  { id: "사회과학", label: "🏛️ 사회과학/정치", desc: "모의국회, 사회비평, 정책" },
  { id: "종교", label: "🕊️ 종교/신앙", desc: "가톨릭, 기독교 학생회" },
];

const CATEGORY_CHIP_MAP: Record<string, string[]> = {
  "IT/개발": ["코딩", "웹/앱", "해커톤", "AI/데이터", "알고리즘"],
  "학술": ["경영전략", "학회", "토론", "세미나", "논문"],
  "예술/공연": ["밴드/합주", "보컬", "스트릿댄스", "연극/뮤지컬", "버스킹"],
  "스포츠": ["축구/풋살", "농구", "러닝/마라톤", "헬스/웨이트", "배드민턴"],
  "봉사": ["교육봉사", "멘토링", "환경보호", "사회공헌", "유기동물"],
  "미디어/방송": ["영상제작", "사진촬영", "유튜브/쇼츠", "방송/아나운싱", "카드뉴스/디자인"],
  "취미/친목": ["보드게임", "맛집탐방", "여행", "요리/베이킹", "방탈출"],
  "창업": ["스타트업", "IR피칭", "서비스기획", "비즈니스모델", "해커톤"],
  "사회과학": ["사회비평", "모의국회", "시사토론", "정책제안", "인권"],
  "종교": ["성경공부", "찬양", "공동체", "기도", "나눔"],
};

function getDynamicPlaceholder(primaryCategory?: string): string {
  switch (primaryCategory) {
    case "스포츠":
      return "예: 축구, 농구, 헬스, 러닝 중 끌리는 거 있어요?";
    case "IT/개발":
      return "예: 웹 개발, 앱, 데이터 분석, 해커톤 중 관심 있는 거?";
    case "예술/공연":
      return "예: 밴드, 댄스, 보컬, 연극 중 뭐가 더 끌려요?";
    case "학술":
      return "예: 경영전략, 학회 스터디, 토론, 세미나 중 해보고 싶은 건?";
    case "봉사":
      return "예: 교육봉사, 멘토링, 환경보호, 나눔 중 참여하고 싶은 활동은?";
    case "미디어/방송":
      return "예: 유튜브 영상제작, 사진촬영, 팟캐스트, 디자인 중 어떤 거?";
    case "취미/친목":
      return "예: 보드게임, 맛집탐방, 여행, 공예 중 하고 싶은 취미는?";
    case "창업":
      return "예: 스타트업 빌딩, 비즈니스 기획, 해커톤 중 관심 있는 건?";
    case "사회과학":
      return "예: 시사토론, 모의국회, 사회비평 중 탐구하고 싶은 주제는?";
    case "종교":
      return "예: 캠퍼스 공동체, 나눔, 성경모임 중 참여하고 싶은 것은?";
    default:
      return "예: 밴드 공연, 웹 개발, 농구, 사진 등 관심 있는 활동을 자유롭게 적어주세요";
  }
}

export default function CreatePage() {
  const router = useRouter();

  // Form State
  const [currentClub, setCurrentClub] = useState("");
  const [clubSearchTerm, setClubSearchTerm] = useState("");
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [isNoClub, setIsNoClub] = useState(false);

  const [college, setCollege] = useState("경영대학");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["IT/개발"]);
  const [interests, setInterests] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Restore saved state if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ku_avatar_prefs");
      if (saved) {
        const parsed: UserPreferences = JSON.parse(saved);
        if (parsed.currentClub) setCurrentClub(parsed.currentClub);
        if (parsed.college) setCollege(parsed.college);
        if (parsed.categories?.length) setSelectedCategories(parsed.categories);
        if (parsed.interests) setInterests(parsed.interests);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filtered clubs for autocomplete
  const filteredClubs = clubsData.filter((c) =>
    c.name.toLowerCase().includes(clubSearchTerm.toLowerCase())
  );

  const handleToggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      if (selectedCategories.length >= 3) {
        // limit to 3
        setSelectedCategories([...selectedCategories.slice(1), catId]);
      } else {
        setSelectedCategories([...selectedCategories, catId]);
      }
    }
  };

  const primaryCategory = selectedCategories[0];
  const dynamicPlaceholder = getDynamicPlaceholder(primaryCategory);

  // Contextual suggestion chips based on selected categories
  const activeChips: string[] = Array.from(
    new Set(
      selectedCategories.flatMap((cat) => CATEGORY_CHIP_MAP[cat] || []).slice(0, 8)
    )
  );
  const defaultChips = ["코딩/해커톤", "밴드/합주", "댄스/무대", "러닝/헬스", "여행/맛집", "토론/스피치", "사진/영상", "봉사/나눔"];
  const chipsToDisplay = activeChips.length > 0 ? activeChips : defaultChips;

  const handleAddKeywordChip = (chip: string) => {
    if (interests.includes(chip)) {
      // Toggle off
      const updated = interests
        .replace(chip, "")
        .replace(/,\s*,/g, ",")
        .replace(/^[\s,]+|[\s,]+$/g, "")
        .trim();
      setInterests(updated);
    } else {
      // Append
      const trimmed = interests.trim().replace(/,\s*$/, "");
      setInterests(trimmed ? `${trimmed}, ${chip}` : chip);
    }
  };

  const handleGenerate = async () => {
    if (selectedCategories.length === 0) {
      alert("관심 카테고리를 최소 1개 이상 선택해주세요!");
      return;
    }

    const prefs: UserPreferences = {
      currentClub: isNoClub ? "없음 (새내기/탐색 중)" : currentClub || "탐색 중",
      college,
      categories: selectedCategories,
      interests,
    };

    localStorage.setItem("ku_avatar_prefs", JSON.stringify(prefs));

    // Playful live AI generation loading animation then route to result
    setIsGenerating(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 900);

    try {
      // 1. Generate Archetype
      const avatarConfig = generateAvatar(prefs);

      // 2. Call backend /api/avatar/generate with user profile & college & custom keywords
      const res = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefs,
          archetypeId: avatarConfig.archetypeId,
          customKeywords: interests,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          localStorage.setItem("ku_generated_avatar_image", data.imageUrl);
          if (data.prompt) {
            localStorage.setItem("ku_generated_avatar_prompt", data.prompt);
          }
        }
      }
    } catch (e) {
      console.error("Live AI Generation error:", e);
    } finally {
      clearInterval(stepInterval);
      router.push("/result");
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-xs w-full"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-ku-crimson flex items-center justify-center mx-auto text-5xl shadow-2xl border-4 border-white/80 animate-bounce">
            🐯
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              className="bg-gradient-to-r from-amber-400 via-rose-500 to-ku-crimson h-full rounded-full"
              initial={{ width: "20%" }}
              animate={{ width: loadingStep === 0 ? "50%" : loadingStep === 1 ? "85%" : "100%" }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          동아리 취향 & 프로필 입력 🐯
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          나에 대한 간단한 정보를 입력하면 딱 맞는 동아리를 알려드려요.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8">
        {/* Section 1: 소속 동아리 */}
        <div className="space-y-3">
          <label className="block text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-ku-crimson" />
              <span>현재 소속된 동아리가 있나요?</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">선택 사항</span>
          </label>

          <div className="relative">
            {!isNoClub ? (
              <div>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={currentClub || clubSearchTerm}
                    onChange={(e) => {
                      setClubSearchTerm(e.target.value);
                      setCurrentClub(e.target.value);
                      setShowClubDropdown(true);
                    }}
                    onFocus={() => setShowClubDropdown(true)}
                    placeholder="동아리 이름 검색 (예: DevKor, 일맥, FC KU 등)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-ku-crimson focus:ring-2 focus:ring-ku-crimson/20 transition-all outline-none"
                  />
                  {currentClub && (
                    <button
                      onClick={() => {
                        setCurrentClub("");
                        setClubSearchTerm("");
                      }}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Autocomplete dropdown */}
                {showClubDropdown && clubSearchTerm && filteredClubs.length > 0 && (
                  <div className="absolute z-20 top-full mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-slate-200 max-h-48 overflow-y-auto p-1.5">
                    {filteredClubs.slice(0, 5).map((club) => (
                      <div
                        key={club.id}
                        onClick={() => {
                          setCurrentClub(club.name);
                          setClubSearchTerm(club.name);
                          setShowClubDropdown(false);
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-rose-50 hover:text-ku-crimson cursor-pointer flex items-center justify-between"
                      >
                        <span>{club.name}</span>
                        <span className="text-[10px] text-slate-400">{club.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500 font-semibold">
                새내기 / 현재 소속 동아리 없음으로 진행합니다.
              </div>
            )}

            {/* Quick Toggle Chip */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsNoClub(!isNoClub);
                  if (!isNoClub) {
                    setCurrentClub("");
                    setClubSearchTerm("");
                  }
                }}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                  isNoClub
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isNoClub ? "✓ 소속 동아리 없음 선택됨" : "아직 동아리 없음 (새내기/탐색 중)"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: 단과대학 */}
        <div className="space-y-3">
          <label className="block text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-ku-crimson" />
              <span>소속 단과대 / 학부</span>
            </span>
          </label>

          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-ku-crimson focus:ring-2 focus:ring-ku-crimson/20 transition-all outline-none"
          >
            {KU_COLLEGES.map((c, idx) => (
              <option key={idx} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Section 3: 관심 카테고리 (태그 다중선택) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-ku-crimson" />
              <span>관심 카테고리 (최대 3개 선택)</span>
            </label>
            <span className="text-xs font-black text-ku-crimson">
              {selectedCategories.length}/3 선택됨
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-rose-50/80 border-ku-crimson text-ku-crimson shadow-sm ring-1 ring-ku-crimson"
                      : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm">{cat.label}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-ku-crimson text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: 자유 텍스트 관심사 */}
        <div className="space-y-2.5">
          <label className="block text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-ku-crimson" />
              <span>요즘 하고 싶은 활동이나 관심 키워드</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">선택 사항</span>
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder={dynamicPlaceholder}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-ku-crimson focus:ring-2 focus:ring-ku-crimson/20 transition-all outline-none"
          />

          {/* Dynamic Suggestion Chips based on selected categories */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">
                {primaryCategory ? `💡 ${primaryCategory} 추천 키워드:` : "💡 추천 키워드:"}
              </span>
              <span className="text-[10px] text-slate-400">클릭 시 자동 추가</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {chipsToDisplay.map((kw) => {
                const isIncluded = interests.includes(kw);
                return (
                  <button
                    type="button"
                    key={kw}
                    onClick={() => handleAddKeywordChip(kw)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1 ${
                      isIncluded
                        ? "bg-ku-crimson text-white shadow-sm ring-1 ring-ku-crimson"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                    }`}
                  >
                    <span>{isIncluded ? "✓" : "+"}</span>
                    <span>{kw}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full py-4 px-6 bg-ku-crimson hover:bg-ku-dark text-white font-black text-base rounded-2xl shadow-xl hover:shadow-ku-crimson/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>나한테 딱 맞는 동아리 확인하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
