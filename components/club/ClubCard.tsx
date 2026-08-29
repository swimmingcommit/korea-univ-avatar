"use client";

import React from "react";
import { ExternalLink, Sparkles, Users, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { RecommendationResult } from "@/lib/recommendEngine";

interface ClubCardProps {
  result: RecommendationResult;
  rank: number;
}

export const ClubCard: React.FC<ClubCardProps> = ({ result, rank }) => {
  const { club, matchScore, matchedReasons, highlightKeywords } = result;

  const rankBadgeColor =
    rank === 1
      ? "bg-amber-500 text-white"
      : rank === 2
      ? "bg-slate-700 text-white"
      : rank === 3
      ? "bg-amber-700 text-white"
      : "bg-slate-200 text-slate-700";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-ku-crimson/40 transition-all group">
      {/* Header: Rank + Club Name + Match Score */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${rankBadgeColor}`}
          >
            {rank}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-ku-crimson transition-colors flex items-center gap-1.5 leading-[1.35] keep-all">
              {club.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 keep-all">
              <span className="font-semibold text-ku-crimson">{club.type}</span>
              <span>•</span>
              <span>{club.college}</span>
            </div>
          </div>
        </div>

        {/* Match Percentage Pill */}
        <div className="flex flex-col items-end shrink-0">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-ku-crimson rounded-full font-black text-xs border border-rose-200/60 shadow-inner">
            <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="keep-all whitespace-nowrap">{matchScore}% 일치</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-[1.6] mb-3 keep-all">
        {club.description_short}
      </p>

      {/* Matched Reasons Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
        {matchedReasons.map((reason, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 keep-all max-w-full leading-[1.35]"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="keep-all">{reason}</span>
          </span>
        ))}
      </div>

      {/* Keywords Chips */}
      <div className="flex flex-wrap items-center gap-1 mb-4">
        {highlightKeywords.map((kw, idx) => (
          <span
            key={idx}
            className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-medium keep-all"
          >
            #{kw}
          </span>
        ))}
      </div>

      {/* Footer info & CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1 text-slate-500 text-[11px] keep-all">
          <Calendar className="w-3.5 h-3.5 text-ku-crimson shrink-0" />
          <span>모집: {club.recruit_period}</span>
        </div>

        <a
          href={club.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-ku-crimson hover:text-ku-dark transition-colors break-url"
        >
          <span className="keep-all">공식 정보 보기</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
};
