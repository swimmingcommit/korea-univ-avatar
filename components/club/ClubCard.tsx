"use client";

import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { RecommendationResult } from "@/lib/recommendEngine";

interface ClubCardProps {
  result: RecommendationResult;
  rank: number;
}

export const ClubCard: React.FC<ClubCardProps> = ({ result, rank }) => {
  const { club, matchScore, highlightKeywords } = result;

  // Max 2 tag chips per card as requested
  const limitedTags = highlightKeywords.slice(0, 2);

  return (
    <div className="py-4 px-3 sm:px-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      {/* Left: Big Rank Number + Club Details */}
      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Large Rank Number (Always single-line horizontal with min-width) */}
        <div className="shrink-0 min-w-[2.75rem] sm:min-w-[3rem] w-11 sm:w-12 text-center flex items-center justify-center pt-0.5">
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight whitespace-nowrap tabular-nums select-none ${
              rank === 1
                ? "text-crimson"
                : rank === 2
                ? "text-crimson-light"
                : "text-stone-400"
            }`}
          >
            {rank < 10 ? `0${rank}` : rank}
          </span>
        </div>

        {/* Club Meta & Description */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-ink group-hover:text-crimson transition-colors break-keep">
              {club.name}
            </h3>
            <span className="text-xs font-bold text-crimson bg-crimson/5 px-2 py-0.5 rounded">
              {club.type}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              · {club.college}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed break-keep line-clamp-2">
            {club.description_short}
          </p>

          {/* Minimal Tags (Max 2) */}
          {limitedTags.length > 0 && (
            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-stone-500 font-medium">
              {limitedTags.map((tag, idx) => (
                <span key={idx}>#{tag}</span>
              ))}
              {club.recruit_period && (
                <span className="text-stone-400">
                  · 모집: {club.recruit_period.replace(/가두모집\s*/g, "").trim()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Match Score & Link */}
      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
        <div className="inline-flex items-center gap-1 text-xs font-black text-crimson">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{matchScore}% 일치</span>
        </div>

        <a
          href={club.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-crimson transition-colors py-1 px-2.5 rounded-lg hover:bg-crimson/5"
        >
          <span>공식 정보</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </div>
    </div>
  );
};
