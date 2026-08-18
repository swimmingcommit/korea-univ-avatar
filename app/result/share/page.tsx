"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { generateAvatar, AvatarConfiguration } from "@/lib/avatarEngine";
import { UserPreferences } from "@/lib/recommendEngine";

export default function ShareViewPage() {
  const [avatar, setAvatar] = useState<AvatarConfiguration | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ku_avatar_prefs");
      let prefs: UserPreferences = { categories: ["IT/개발"], college: "정보대학" };
      if (saved) {
        prefs = JSON.parse(saved);
      }
      setAvatar(generateAvatar(prefs));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-8">
      <div>
        <span className="inline-block px-3 py-1 bg-ku-soft text-ku-crimson text-xs font-black rounded-full mb-2">
          고려대 동아리 아바타 카드
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          호랑이 학우의 동아리 자아를 확인해보세요! 🐯
        </h1>
      </div>

      {avatar && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
          <AvatarCanvas config={avatar} size={300} interactive={true} showTitle={true} />
        </div>
      )}

      {/* CTA to make own avatar */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
        <h2 className="text-lg font-black">
          나도 내 동아리 아바타를 만들어보고 싶다면?
        </h2>
        <p className="text-xs text-slate-300">
          단 1분 만에 나만의 호랑이 캐릭터와 2026-2학기 맞춤 고려대 동아리를 추천받으세요!
        </p>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 via-rose-500 to-ku-crimson text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all"
        >
          <span>나도 아바타 만들기 (무료)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
