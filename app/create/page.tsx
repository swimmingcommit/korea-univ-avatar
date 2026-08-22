"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Search, Compass, Check, ArrowRight, Tag, BookOpen, GraduationCap, X, Users } from "lucide-react";
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

  const handleGenerate = async (withQuiz = false) => {
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

    if (withQuiz) {
      router.push("/create/quiz");
      return;
    }

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
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-ku-crimson flex items-center justify-center mx-auto text-5xl shadow-2xl border-4 border-white/80 animate-bounce">
            🐯
          </div>
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-200">
              ✨ Nano Banana AI 실시간 키링 렌더링 중
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {loadingStep === 0 && `[${college}] 맞춤 털인형 솜 채우는 중... 🧸`}
              {loadingStep === 1 && `[${selectedCategories.join(", ")}] 전용 의상 & 소품 스타일링 중... 👔`}
              {loadingStep === 2 && "캠퍼스 조명 비추며 3D 키링 완성하는 중! 📸"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              입력하신 {interests ? `'${interests}'` : "관심사"}를 반영한 단 하나의 나만의 고려대 호랑이 키링을 빚어내고 있습니다.
            </p>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              className="bg-gradient-to-r from-amber-400 via-rose-500 to-ku-crimson h-full rounded-full"
              initial={{ width: "15%" }}
              animate={{ width: loadingStep === 0 ? "45%" : loadingStep === 1 ? "80%" : "100%" }}
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
        <span className="inline-block px-3 py-1 bg-ku-soft text-ku-crimson text-xs font-black rounded-full mb-2">
          STEP 1 OF 2
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          동아리 취향 & 프로필 입력 🐯
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          나에 대한 간단한 정보를 알려주시면 딱 맞는 호랑이 아바타를 만들어드려요.
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
        <div className="space-y-2">
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
            placeholder="예: 파이썬 해커톤, 락밴드 일렉기타 합주, 축제 무대 기획, 보드게임 번개 등"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-ku-crimson focus:ring-2 focus:ring-ku-crimson/20 transition-all outline-none"
          />
          <p className="text-[11px] text-slate-400">
            입력된 단어를 기반으로 동아리 추천 정확도와 아바타 소품이 정밀해집니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={() => handleGenerate(false)}
            className="w-full py-4 px-6 bg-ku-crimson hover:bg-ku-dark text-white font-black text-base rounded-2xl shadow-xl hover:shadow-ku-crimson/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>내 호랑이 아바타 즉시 생성하기</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold">또는</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={() => handleGenerate(true)}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>5문항 성향 퀴즈 풀고 더 정밀하게 생성하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
