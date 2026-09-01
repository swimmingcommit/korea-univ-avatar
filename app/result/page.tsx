"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Share2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { AvatarRadarChart } from "@/components/avatar/AvatarRadarChart";
import { ClubCertifiedStamp } from "@/components/avatar/ClubCertifiedStamp";
import { ClubCard } from "@/components/club/ClubCard";
import { ShareModal } from "@/components/share/ShareModal";
import { GeminiProCtaBanner } from "@/components/cta/GeminiProCtaBanner";
import { generateAvatar, AvatarConfiguration, AvatarArchetypeId } from "@/lib/avatarEngine";
import { getClubs } from "@/lib/supabase";
import {
  recommendClubs,
  calculateUserTraits,
  RecommendationResult,
  UserPreferences,
  Traits,
} from "@/lib/recommendEngine";
import { buildShareUrl, parsePrefsFromUrl } from "@/lib/shareUrl";

export default function ResultPage() {
  const router = useRouter();
  const exportCardRef = useRef<HTMLDivElement>(null);

  const [prefs, setPrefs] = useState<UserPreferences>({
    categories: ["IT/개발"],
    college: "정보대학",
  });
  const [traits, setTraits] = useState<Traits>({
    sociability: 3,
    activity: 3,
    creativity: 3,
    leadership: 3,
    expertise: 3,
  });
  const [avatar, setAvatar] = useState<AvatarConfiguration | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        let userPrefs: UserPreferences = {
          categories: ["IT/개발"],
          college: "정보대학",
        };

        // 1. Prioritize URL parameters (when opened from KakaoTalk, Instagram, or shared link)
        let urlPrefs: UserPreferences | null = null;
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          urlPrefs = parsePrefsFromUrl(urlParams);
        }

        if (urlPrefs) {
          userPrefs = urlPrefs;
        } else {
          // 2. Fall back to local storage
          const saved = localStorage.getItem("ku_avatar_prefs");
          if (saved) {
            userPrefs = JSON.parse(saved);
          }
        }

        setPrefs(userPrefs);
        const computedTraits = calculateUserTraits(userPrefs);
        setTraits(computedTraits);

        const generated = generateAvatar(userPrefs);

        // If URL has explicit shared archetype params, respect them
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const sharedArchetype = urlParams.get("archetype");
          const sharedTitle = urlParams.get("title");
          const sharedSubtitle = urlParams.get("subtitle");

          if (sharedArchetype) {
            generated.archetypeId = sharedArchetype as AvatarArchetypeId;
            generated.plushImageUrl = `/avatars/plush_${sharedArchetype}.png`;
          }
          if (sharedTitle) {
            generated.title = sharedTitle;
          }
          if (sharedSubtitle) {
            generated.subtitle = sharedSubtitle;
          }
        }

        const customAiImg = localStorage.getItem("ku_generated_avatar_image");
        if (customAiImg && !urlPrefs) {
          generated.plushImageUrl = customAiImg;
        }
        setAvatar(generated);

        const allClubs = await getClubs();
        const recs = recommendClubs(userPrefs, 5, allClubs);
        setRecommendations(recs);
        setLoaded(true);

        // Trigger Celebration Confetti
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#7A1626", "#C9A227", "#A63D4F", "#1F1B18"],
        });
      } catch (e) {
        console.error(e);
        setLoaded(true);
      }
    }

    loadData();
  }, []);

  const getShareUrl = () => {
    if (typeof window === "undefined" || !avatar) return "";
    return buildShareUrl(avatar, prefs);
  };

  if (!loaded || !avatar) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-crimson/10 flex items-center justify-center text-crimson animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
    );
  }

  const siteDomain = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "")
    : "ku-tiger-avatar.netlify.app";

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 space-y-8">
      {/* 1. Avatar Presentation & 5-Axis Radar Hero Card (Exportable Target) */}
      <div
        id="avatar-card-export"
        ref={exportCardRef}
        className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-crimson/25 space-y-6 relative overflow-hidden bg-gradient-to-br from-white via-[#FAF6EE] to-[#F5ECE1]"
      >
        {/* Subtle Tiger Stripe Pattern Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-tiger-stripes" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 30 10, 60 25 T 120 15 L 120 28 Q 80 40, 40 25 T 0 35 Z" fill="#7A1626" />
              <path d="M10 70 Q 50 60, 80 80 T 130 65 L 130 78 Q 90 95, 50 78 T 10 88 Z" fill="#7A1626" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-tiger-stripes)" />
        </svg>

        {/* Subtle Crimson & Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-crimson/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold/12 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Stamp */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between relative z-10 gap-3 text-center sm:text-left">
          <div className="w-full">
            <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight break-keep text-center sm:text-left">
              {avatar.title}
            </h1>
          </div>

          {/* Signature Element: Certified Stamp Graphic */}
          <ClubCertifiedStamp size={90} className="shrink-0 -mt-2 -mr-2 hidden xs:block" />
        </div>

        {/* Main Content: Avatar Canvas */}
        <div className="flex flex-col items-center justify-center relative z-10 max-w-lg mx-auto w-full">
          {/* Avatar Canvas with Crimson Pedestal Texture */}
          <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-crimson/10 via-[#FAF6EE] to-crimson/5 border border-crimson/15 shadow-inner relative overflow-hidden group">
            {/* Subtle Tiger Pattern on Avatar Frame */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="avatar-tiger-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 15 Q 20 5, 40 18 T 80 10 L 80 20 Q 50 30, 25 18 T 0 25 Z" fill="#7A1626" />
                  <path d="M5 50 Q 35 40, 55 58 T 90 45 L 90 55 Q 60 70, 30 55 T 5 65 Z" fill="#7A1626" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#avatar-tiger-pattern)" />
            </svg>
            <AvatarCanvas config={avatar} size={300} interactive={true} showTitle={false} />
            <p className="text-xs sm:text-sm text-stone-600 mt-3 text-center leading-relaxed whitespace-pre-line max-w-sm relative z-10 font-medium">
              {avatar.description}
            </p>
          </div>
        </div>

        {/* Quick Action Bar under card */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-stone-100 relative z-10">
          <button
            type="button"
            onClick={() => {
              const shareUrl = getShareUrl();
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: `[고려대 동아리 아바타] ${avatar.title}`,
                  text: `나만의 고대 호랑이 아바타와 2학기 찰떡 동아리 찾았다! 🐯 "${avatar.speechQuote}"`,
                  url: shareUrl,
                }).catch(() => {});
              } else {
                setIsShareModalOpen(true);
              }
            }}
            className="w-full sm:w-auto px-5 py-3 bg-cream hover:bg-white text-ink border border-stone-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap active:scale-98 cursor-pointer"
          >
            <span className="text-sm">💬</span>
            <span>카카오톡 / 친구에게 공유</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3 bg-crimson hover:bg-crimson-light text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap active:scale-98 cursor-pointer"
          >
            <span className="text-sm">📸</span>
            <span>인스타 스토리 & 이미지 저장</span>
          </button>

          <Link
            href="/create"
            className="w-full sm:w-auto px-4 py-3 bg-transparent hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 만들기</span>
          </Link>
        </div>
      </div>

      {/* Hidden 9:16 Instagram Story Canvas for 1-Tap Export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div
          id="insta-story-export"
          className="w-[450px] h-[800px] bg-gradient-to-b from-[#7A1626] via-[#540E19] to-[#1F1B18] text-white p-8 flex flex-col justify-between items-center relative overflow-hidden"
        >
          {/* Top Header */}
          <div className="text-center space-y-1 z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-gold border border-white/20">
              🔴 2026-2학기 고려대 동아리 매칭
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              나의 호랑이 자아는? 🐯
            </h2>
          </div>

          {/* Central Plush Avatar */}
          <div className="relative z-10 w-[300px] h-[300px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.plushImageUrl || `/avatars/plush_${avatar.archetypeId}.png`}
              alt={avatar.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar Information & Quote */}
          <div className="text-center space-y-3 z-10 max-w-sm">
            <div className="text-xs text-gold font-bold">
              {avatar.subtitle}
            </div>
            <h3 className="text-3xl font-black tracking-tight text-white">
              {avatar.title}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-semibold bg-black/30 p-3 rounded-2xl border border-white/10 whitespace-pre-line">
              {avatar.speechQuote}
            </p>
          </div>

          {/* Bottom Branding & Tags */}
          <div className="text-center space-y-1.5 z-10 border-t border-white/20 pt-4 w-full">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-gold">
              <span>#고려대학교</span>
              <span>#동아리아바타</span>
              <span>#2학기신입부원</span>
            </div>
            <p className="text-[10px] text-slate-300 font-mono">
              {siteDomain}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Gemini Plus CTA Banner (Solid Crimson Theme) */}
      <div>
        <GeminiProCtaBanner
          avatar={avatar}
          topClub={recommendations[0]?.club}
          randomInitial={true}
        />
      </div>

      {/* 3. Top Recommended Clubs Section (Ranking List Style with Thin Dividers) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 px-1 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span>🎯 딱 맞는 고려대 동아리 TOP 5</span>
            </h2>
          </div>

          <a
            href="https://klub.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-xs font-bold text-crimson hover:text-crimson-light transition-colors shrink-0"
          >
            <span className="keep-all">klub.kr 전체 동아리 보기</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>

        {/* Clean Ranking List with thin dividers */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-stone-200 divide-y divide-stone-200/80 shadow-sm overflow-hidden">
          {recommendations.map((result, idx) => (
            <ClubCard key={result.club.id} result={result} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          avatar={avatar}
          prefs={prefs}
          cardRef={exportCardRef}
        />
      )}
    </div>
  );
}
