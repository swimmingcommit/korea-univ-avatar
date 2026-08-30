"use client";

import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Traits } from "@/lib/recommendEngine";

interface AvatarRadarChartProps {
  traits: Traits;
  height?: number;
}

export const AvatarRadarChart: React.FC<AvatarRadarChartProps> = ({
  traits,
  height = 240,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    {
      subject: "사교성",
      value: Number(traits.sociability.toFixed(1)),
      fullMark: 5,
    },
    {
      subject: "활동성",
      value: Number(traits.activity.toFixed(1)),
      fullMark: 5,
    },
    {
      subject: "창의성",
      value: Number(traits.creativity.toFixed(1)),
      fullMark: 5,
    },
    {
      subject: "리더십",
      value: Number(traits.leadership.toFixed(1)),
      fullMark: 5,
    },
    {
      subject: "전문성",
      value: Number(traits.expertise.toFixed(1)),
      fullMark: 5,
    },
  ];

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center text-xs text-stone-400"
      >
        <span>성향 레이더 분석 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid
              stroke="#7A1626"
              strokeOpacity={0.16}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#1F1B18",
                fontSize: 12,
                fontWeight: 800,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="성향 분석"
              dataKey="value"
              stroke="#7A1626"
              strokeWidth={2.5}
              fill="#7A1626"
              fillOpacity={0.3}
              dot={{
                r: 3.5,
                fill: "#7A1626",
                stroke: "#FAF6EE",
                strokeWidth: 1.5,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Trait numerical value summary pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {data.map((item) => (
          <div
            key={item.subject}
            className="flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-stone-100/80 px-2 py-0.5 rounded-md"
          >
            <span className="text-stone-500">{item.subject}</span>
            <span className="text-crimson font-black">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
