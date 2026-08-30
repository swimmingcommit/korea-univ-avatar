"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Info, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EDE4D8] shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#7A1626] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform">
            🐯
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-[#1F1B18] tracking-tight">
                고대 동아리 <span className="text-[#7A1626]">아바타</span>
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-[#7A746E] font-medium -mt-0.5">
              KU Club Avatar & Recommender
            </p>
          </div>
        </Link>

        {/* Nav actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5EBE1] text-[#7A1626] hover:bg-[#7A1626] hover:text-white transition-colors text-xs font-bold"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>아바타 만들기</span>
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF6EE] hover:bg-[#F5EBE1] text-[#1F1B18] border border-[#EDE4D8] transition-colors text-[11px] sm:text-xs font-bold"
            title="우리 동아리 등록 및 관리 스튜디오"
          >
            <span>📢 <span className="hidden xs:inline">동아리</span> 등록</span>
          </Link>

          <Link
            href="/about"
            className="p-1.5 sm:p-2 rounded-full text-[#4A453F] hover:text-[#7A1626] hover:bg-[#F5EBE1] transition-colors"
            title="서비스 소개"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* User Profile Badge (Only shown when logged in) */}
          {isLoggedIn && (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-[#EDE4D8]">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-[#C9A227]/15 border border-[#C9A227]/30 rounded-full text-[11px] font-bold text-[#1F1B18]">
                <Sparkles className="w-3 h-3 text-[#C9A227]" />
                <span className="max-w-[50px] sm:max-w-[70px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1 text-[#7A746E] hover:text-[#1F1B18] rounded-full transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
