import React from "react";
import { AvatarConfiguration } from "@/lib/avatarEngine";

interface PartProps {
  config: AvatarConfiguration;
  isBlinking?: boolean;
  isTalking?: boolean;
  mouthFrame?: number; // 0: closed, 1: half, 2: wide open
}

// 1. Backgrounds
export const BackgroundLayer: React.FC<PartProps> = ({ config }) => {
  const type = config.parts.backgroundType;

  switch (type) {
    case "stage_spotlight": // 01: 무대 위의 야망 흑표범
      return (
        <g id="bg-stage-spotlight">
          <defs>
            <linearGradient id="stageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="60%" stopColor="#4C0519" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#stageGrad)" />
          {/* Beaming Spotlights */}
          <polygon points="40,0 120,0 260,400 100,400" fill="rgba(244, 63, 94, 0.25)" />
          <polygon points="360,0 280,0 140,400 300,400" fill="rgba(253, 224, 71, 0.25)" />
          <circle cx="200" cy="180" r="140" fill="rgba(244, 63, 94, 0.3)" filter="blur(30px)" />
        </g>
      );

    case "night_coding_room": // 02: 밤샘 코딩 올빼미
      return (
        <g id="bg-night-coding">
          <defs>
            <linearGradient id="owlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#022C22" />
              <stop offset="50%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <pattern id="matrixGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#owlGrad)" />
          <rect width="400" height="400" rx="28" fill="url(#matrixGrid)" />
          <circle cx="200" cy="180" r="130" fill="rgba(16, 185, 129, 0.2)" filter="blur(35px)" />
          {/* Crescent Moon in Night */}
          <path d="M 330 60 A 25 25 0 0 0 355 85 A 30 30 0 1 1 330 60 Z" fill="#FDE047" opacity="0.8" />
        </g>
      );

    case "peace_nature": // 03: 텀블러 요정
      return (
        <g id="bg-peace-nature">
          <defs>
            <linearGradient id="natureGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D1FAE5" />
              <stop offset="50%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#natureGrad)" />
          {/* Sun Glow & Tree Leaves */}
          <circle cx="200" cy="140" r="120" fill="rgba(255, 255, 255, 0.6)" filter="blur(25px)" />
          <circle cx="200" cy="120" r="40" fill="#FEF08A" opacity="0.7" />
          {/* Cute Little Flying Birds */}
          <path d="M60 90 Q70 80 80 90 Q90 80 100 90" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M300 70 Q310 60 320 70 Q330 60 340 70" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );

    case "presentation_hall": // 04: 전략적 투머치토커 학회장
      return (
        <g id="bg-presentation">
          <defs>
            <linearGradient id="presGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#172554" />
              <stop offset="100%" stopColor="#31101E" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#presGrad)" />
          {/* Lecture Screen Frame */}
          <rect x="50" y="50" width="300" height="200" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          <circle cx="200" cy="170" r="120" fill="rgba(59, 130, 246, 0.25)" filter="blur(30px)" />
        </g>
      );

    case "central_plaza_track": // 05: 중앙광장 러너
      return (
        <g id="bg-track">
          <defs>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="40%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#trackGrad)" />
          {/* Running Track Curves */}
          <path d="M-50 280 Q200 180 450 280" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="none" strokeDasharray="16 12" />
          <path d="M-50 330 Q200 230 450 330" stroke="rgba(255,255,255,0.3)" strokeWidth="6" fill="none" strokeDasharray="16 12" />
          <circle cx="200" cy="150" r="110" fill="rgba(253, 224, 71, 0.3)" filter="blur(30px)" />
        </g>
      );

    case "chamsali_adventure": // 06: 취미 탐험가 #갓생살기
      return (
        <g id="bg-adventure">
          <defs>
            <linearGradient id="advGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#581C87" />
              <stop offset="50%" stopColor="#7E22CE" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#advGrad)" />
          {/* Fun colorful bokeh dots */}
          <circle cx="80" cy="90" r="35" fill="rgba(244, 114, 182, 0.35)" filter="blur(15px)" />
          <circle cx="320" cy="110" r="45" fill="rgba(251, 191, 36, 0.35)" filter="blur(18px)" />
          <circle cx="100" cy="300" r="40" fill="rgba(56, 189, 248, 0.35)" filter="blur(15px)" />
          <circle cx="310" cy="290" r="35" fill="rgba(168, 85, 247, 0.35)" filter="blur(15px)" />
        </g>
      );

    case "quiet_library_study": // 07: 서재의 은둔자
      return (
        <g id="bg-library-study">
          <defs>
            <linearGradient id="studyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C1917" />
              <stop offset="60%" stopColor="#292524" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#studyGrad)" />
          {/* Classical Bookshelf Arch */}
          <path d="M40 380 L40 110 Q200 50 360 110 L360 380 Z" fill="rgba(255,255,255,0.05)" />
          <line x1="50" y1="170" x2="350" y2="170" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="3" />
          <line x1="50" y1="270" x2="350" y2="270" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="3" />
          {/* Warm Antique Reading Lamp Glow */}
          <circle cx="200" cy="170" r="130" fill="rgba(245, 158, 11, 0.22)" filter="blur(35px)" />
        </g>
      );

    case "ku_main_hall_front": // 08: 과잠 입은 새내기
    default:
      return (
        <g id="bg-main-hall">
          <defs>
            <linearGradient id="mainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4C0519" />
              <stop offset="50%" stopColor="#862633" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#mainGrad)" />
          {/* Korea University Main Hall (본관) Gothic Silhouette */}
          <path
            d="M70 380 L70 260 L110 260 L110 210 L150 210 L150 175 L200 130 L250 175 L250 210 L290 210 L290 260 L330 260 L330 380 Z"
            fill="rgba(0,0,0,0.25)"
          />
          {/* Gothic Clock Tower & Star */}
          <circle cx="200" cy="190" r="12" fill="rgba(253, 224, 71, 0.6)" />
          <circle cx="200" cy="190" r="4" fill="#FFFFFF" />
          <circle cx="200" cy="160" r="140" fill="rgba(255, 255, 255, 0.12)" filter="blur(30px)" />
        </g>
      );
  }
};

// 2. Effects
export const EffectsLayer: React.FC<PartProps> = ({ config }) => {
  const effect = config.parts.effectType;

  switch (effect) {
    case "green_matrix": // 02
      return (
        <g id="fx-matrix" opacity="0.85" fill="#34D399" fontFamily="monospace" fontSize="13" fontWeight="bold">
          <text x="35" y="80">const bug = 0;</text>
          <text x="310" y="105">01101</text>
          <text x="40" y="280">git push</text>
          <text x="290" y="280">npm run</text>
          <text x="35" y="180">while(alive)</text>
          <text x="320" y="190">&#123; sleep: 0 &#125;</text>
        </g>
      );

    case "sprout_leaves": // 03
      return (
        <g id="fx-sprout" fill="#10B981" opacity="0.9">
          {/* Floating Leaves */}
          <path d="M45 100 C45 85 65 85 65 100 C65 115 45 115 45 100 Z" />
          <path d="M340 110 C340 95 360 95 360 110 C360 125 340 125 340 110 Z" />
          <path d="M40 270 C40 258 55 258 55 270 C55 282 40 282 40 270 Z" />
          <text x="330" y="280" fontSize="20">🌱</text>
        </g>
      );

    case "presentation_chart": // 04
      return (
        <g id="fx-chart" stroke="#38BDF8" strokeWidth="2.5" opacity="0.8" fill="none">
          <polyline points="45,110 65,95 85,100 105,75" strokeLinecap="round" />
          <polyline points="295,115 315,95 335,80 355,60" strokeLinecap="round" stroke="#F59E0B" />
          <circle cx="105" cy="75" r="4" fill="#38BDF8" />
          <circle cx="355" cy="60" r="4" fill="#F59E0B" />
        </g>
      );

    case "fire_stamina": // 05
      return (
        <g id="fx-fire" opacity="0.9">
          <circle cx="50" cy="110" r="12" fill="#EF4444" filter="blur(3px)" />
          <circle cx="65" cy="95" r="7" fill="#F59E0B" filter="blur(2px)" />
          <circle cx="340" cy="110" r="14" fill="#EF4444" filter="blur(3px)" />
          <circle cx="325" cy="90" r="8" fill="#F59E0B" filter="blur(2px)" />
          <text x="40" y="280" fontSize="22">🔥</text>
          <text x="330" y="275" fontSize="22">💪</text>
        </g>
      );

    case "adventure_stars": // 06
      return (
        <g id="fx-adventure" fill="#FDE047" opacity="0.9">
          <path d="M50 90 L53 100 L63 103 L53 106 L50 116 L47 106 L37 103 L47 100 Z" />
          <path d="M335 100 L337 108 L345 110 L337 112 L335 120 L333 112 L325 110 L333 108 Z" fill="#EC4899" />
          <text x="40" y="285" fontSize="20">🧭</text>
          <text x="335" y="275" fontSize="20">✨</text>
        </g>
      );

    case "coffee_aroma": // 07
      return (
        <g id="fx-coffee" opacity="0.8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M55 110 Q65 95 55 80" />
          <path d="M68 115 Q78 100 68 85" />
          <path d="M335 105 Q345 90 335 75" />
          <text x="325" y="280" fontSize="20" stroke="none" fill="#D97706">📖</text>
        </g>
      );

    case "stage_lights": // 01
      return (
        <g id="fx-stage-lights" fill="#FDE047" opacity="0.95">
          <text x="40" y="110" fontSize="24" fill="#F43F5E">♬</text>
          <text x="335" y="100" fontSize="24" fill="#FBBF24">★</text>
          <text x="45" y="280" fontSize="22" fill="#38BDF8">♪</text>
          <text x="330" y="280" fontSize="24" fill="#EC4899">🎸</text>
        </g>
      );

    case "freshman_twinkle": // 08
    default:
      return (
        <g id="fx-freshman" fill="#FDE047" opacity="0.95">
          <path d="M55 90 L58 100 L68 103 L58 106 L55 116 L52 106 L42 103 L52 100 Z" />
          <path d="M335 100 L337 108 L345 110 L337 112 L335 120 L333 112 L325 110 L333 108 Z" fill="#FFFFFF" />
          <text x="40" y="280" fontSize="20">🐯</text>
          <text x="330" y="275" fontSize="20">🎓</text>
        </g>
      );
  }
};

// 3. Animal Ears & Base Head
export const TigerEarsLayer: React.FC<PartProps> = ({ config }) => {
  const animal = config.parts.animalType;

  if (animal === "panther") {
    // Sleek Black Panther Ears
    return (
      <g id="panther-ears">
        <path d="M125 120 C100 80 115 50 145 65 C155 70 155 95 145 120 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
        <path d="M125 100 C115 80 125 68 140 75 C145 80 145 95 135 105 Z" fill="#F43F5E" />
        <path d="M275 120 C300 80 285 50 255 65 C245 70 245 95 255 120 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
        <path d="M275 100 C285 80 275 68 260 75 C255 80 255 95 265 105 Z" fill="#F43F5E" />
      </g>
    );
  }

  if (animal === "owl") {
    // Owl Feathers/Tufts
    return (
      <g id="owl-tufts">
        <polygon points="120,130 140,55 160,110" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
        <polygon points="280,130 260,55 240,110" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
      </g>
    );
  }

  // Classic Tiger Ears (with archetype skin matches)
  return (
    <g id="tiger-ears">
      <path d="M125 120 C100 80 115 50 145 65 C155 70 155 95 145 120 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
      <path d="M125 100 C115 80 125 68 140 75 C145 80 145 95 135 105 Z" fill="#F472B6" />
      <path d="M275 120 C300 80 285 50 255 65 C245 70 245 95 255 120 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
      <path d="M275 100 C285 80 275 68 260 75 C255 80 255 95 265 105 Z" fill="#F472B6" />
    </g>
  );
};

export const HeadAndFaceLayer: React.FC<PartProps> = ({ config }) => {
  const isPanther = config.parts.animalType === "panther";
  const skin = config.parts.skinTone;

  return (
    <g id="head-base">
      {/* Cute Head Outline */}
      <ellipse
        cx="200"
        cy="180"
        rx="88"
        ry="78"
        fill={skin}
        stroke={isPanther ? "#334155" : "#D97706"}
        strokeWidth="3.5"
      />

      {/* Cheek Stripes */}
      <g fill={isPanther ? "#475569" : "#92400E"} opacity={isPanther ? 0.6 : 0.85}>
        <path d="M116 172 L132 175 L118 180 Z" />
        <path d="M115 186 L130 188 L117 194 Z" />
        <path d="M284 172 L268 175 L282 180 Z" />
        <path d="M285 186 L270 188 L283 194 Z" />
        {/* Forehead Tiger Mark 王 */}
        <path d="M190 120 L210 120 M193 127 L207 127 M188 134 L212 134 M200 120 L200 134" stroke={isPanther ? "#94A3B8" : "#92400E"} strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Cute Blush */}
      <ellipse cx="145" cy="195" rx="14" ry="8" fill="#FB7185" opacity={isPanther ? 0.4 : 0.6} />
      <ellipse cx="255" cy="195" rx="14" ry="8" fill="#FB7185" opacity={isPanther ? 0.4 : 0.6} />

      {/* Cute Nose */}
      <polygon points="196,182 204,182 200,187" fill="#F43F5E" />
    </g>
  );
};

// 4. Eyes & Expressions
export const EyesLayer: React.FC<PartProps> = ({ config, isBlinking }) => {
  const eyeType = config.parts.eyeType;

  if (isBlinking) {
    return (
      <g id="eyes-blinking" stroke="#451A03" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M152 178 Q165 188 178 178" />
        <path d="M222 178 Q235 188 248 178" />
      </g>
    );
  }

  switch (eyeType) {
    case "stage_fierce": // 01: 흑표범
      return (
        <g id="eyes-panther">
          <path d="M148 156 L180 166" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          <path d="M252 156 L220 166" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="165" cy="175" rx="14" ry="14" fill="#FDE047" />
          <ellipse cx="235" cy="175" rx="14" ry="14" fill="#FDE047" />
          {/* Slit Pupils */}
          <ellipse cx="165" cy="175" rx="4.5" ry="12" fill="#0F172A" />
          <ellipse cx="235" cy="175" rx="4.5" ry="12" fill="#0F172A" />
          <circle cx="168" cy="170" r="3" fill="#FFFFFF" />
          <circle cx="238" cy="170" r="3" fill="#FFFFFF" />
        </g>
      );

    case "dark_circle": // 02: 밤샘 올빼미 (다크서클!)
      return (
        <g id="eyes-owl">
          {/* Purple Dark Circles Under Eyes */}
          <ellipse cx="165" cy="186" rx="18" ry="8" fill="#6366F1" opacity="0.4" filter="blur(2px)" />
          <ellipse cx="235" cy="186" rx="18" ry="8" fill="#6366F1" opacity="0.4" filter="blur(2px)" />
          {/* Tired Big Eyes */}
          <ellipse cx="165" cy="174" rx="15" ry="15" fill="#1E293B" />
          <ellipse cx="235" cy="174" rx="15" ry="15" fill="#1E293B" />
          <circle cx="165" cy="174" r="6" fill="#10B981" />
          <circle cx="235" cy="174" r="6" fill="#10B981" />
          <circle cx="167" cy="171" r="2.5" fill="#FFFFFF" />
          <circle cx="237" cy="171" r="2.5" fill="#FFFFFF" />
        </g>
      );

    case "sharp_glasses": // 04: 학회장 (샤프한 안경)
      return (
        <g id="eyes-scholar">
          <ellipse cx="165" cy="176" rx="13" ry="14" fill="#1F2937" />
          <ellipse cx="235" cy="176" rx="13" ry="14" fill="#1F2937" />
          <circle cx="168" cy="172" r="5" fill="#FFFFFF" />
          <circle cx="238" cy="172" r="5" fill="#FFFFFF" />
          {/* Smart Gold Glasses */}
          <rect x="145" y="160" width="40" height="30" rx="6" fill="none" stroke="#D97706" strokeWidth="3.5" />
          <rect x="215" y="160" width="40" height="30" rx="6" fill="none" stroke="#D97706" strokeWidth="3.5" />
          <line x1="185" y1="173" x2="215" y2="173" stroke="#D97706" strokeWidth="3.5" />
        </g>
      );

    case "gentle_smile": // 03: 텀블러 요정
      return (
        <g id="eyes-gentle" stroke="#065F46" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M150 178 Q165 162 180 178" />
          <path d="M220 178 Q235 162 250 178" />
        </g>
      );

    case "runner_sparkle": // 05: 러너
      return (
        <g id="eyes-runner">
          <path d="M148 154 L180 162" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M252 154 L220 162" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="165" cy="174" rx="14" ry="15" fill="#1E293B" />
          <ellipse cx="235" cy="174" rx="14" ry="15" fill="#1E293B" />
          <circle cx="169" cy="169" r="6" fill="#FFFFFF" />
          <circle cx="239" cy="169" r="6" fill="#FFFFFF" />
        </g>
      );

    case "deep_calm": // 07: 은둔자
      return (
        <g id="eyes-calm">
          <path d="M150 164 Q165 160 180 166" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M220 166 Q235 160 250 164" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="165" cy="176" rx="12" ry="12" fill="#1E293B" />
          <ellipse cx="235" cy="176" rx="12" ry="12" fill="#1E293B" />
          <circle cx="168" cy="172" r="4" fill="#FFFFFF" />
          <circle cx="238" cy="172" r="4" fill="#FFFFFF" />
        </g>
      );

    case "freshman_sparkle": // 08: 새내기
    case "curious_round": // 06: 탐험가
    default:
      return (
        <g id="eyes-freshman">
          <ellipse cx="165" cy="174" rx="15" ry="17" fill="#1E293B" />
          <ellipse cx="235" cy="174" rx="15" ry="17" fill="#1E293B" />
          <circle cx="170" cy="168" r="6.5" fill="#FFFFFF" />
          <circle cx="162" cy="180" r="3.5" fill="#FFFFFF" />
          <circle cx="240" cy="168" r="6.5" fill="#FFFFFF" />
          <circle cx="232" cy="180" r="3.5" fill="#FFFFFF" />
        </g>
      );
  }
};

// 5. Mouth (Talking Sync)
export const MouthLayer: React.FC<PartProps> = ({ config, isTalking, mouthFrame = 0 }) => {
  if (isTalking) {
    if (mouthFrame === 2) {
      return (
        <g id="mouth-talking-wide">
          <ellipse cx="200" cy="202" rx="15" ry="13" fill="#BE123C" stroke="#451A03" strokeWidth="2.5" />
          <ellipse cx="200" cy="207" rx="10" ry="6" fill="#F43F5E" />
          <polygon points="193,193 197,193 195,198" fill="#FFFFFF" />
          <polygon points="203,193 207,193 205,198" fill="#FFFFFF" />
        </g>
      );
    } else if (mouthFrame === 1) {
      return (
        <g id="mouth-talking-half">
          <path d="M190 196 Q200 210 210 196 Z" fill="#BE123C" stroke="#451A03" strokeWidth="2.5" />
          <polygon points="194,196 198,196 196,199" fill="#FFFFFF" />
        </g>
      );
    } else {
      return (
        <g id="mouth-talking-closed" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M190 196 Q195 200 200 196 Q205 200 210 196" />
        </g>
      );
    }
  }

  return (
    <g id="mouth-smile" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none">
      <path d="M190 194 Q195 200 200 196 Q205 200 210 194" />
    </g>
  );
};

// 6. Hair & Headwear
export const HairAndHeadwearLayer: React.FC<PartProps> = ({ config }) => {
  const hair = config.parts.hairType;

  switch (hair) {
    case "stage_glam": // 01: 화려한 무대 헤어
      return (
        <g id="hair-stage">
          <path d="M120 135 C110 80 290 80 280 135 C250 115 220 120 200 115 C180 120 150 115 120 135 Z" fill="#0F172A" />
          {/* Glam Silver Streak */}
          <path d="M140 120 Q170 145 195 125" stroke="#F43F5E" strokeWidth="4" fill="none" />
        </g>
      );

    case "messy_night": // 02: 올빼미 헝클어진 머리
      return (
        <g id="hair-messy" fill="#334155">
          <path d="M125 135 C125 80 275 80 275 135 C240 120 220 135 200 120 C180 135 160 120 125 135 Z" />
          {/* Sleep Cowlick tufts */}
          <path d="M200 80 Q215 50 210 40 Q195 55 198 80" />
        </g>
      );

    case "soft_fairy": // 03: 텀블러 요정 새싹 머리
      return (
        <g id="hair-fairy">
          <path d="M125 135 C125 90 275 90 275 135 C250 125 220 130 200 125 C180 130 150 125 125 135 Z" fill="#65A30D" />
          {/* Sprout on head 🌱 */}
          <path d="M198 75 Q185 55 175 62 Q185 75 198 75" fill="#84CC16" />
          <path d="M202 75 Q215 55 225 62 Q215 75 202 75" fill="#84CC16" />
          <line x1="200" y1="75" x2="200" y2="90" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case "sport_band": // 05: 러너 헤어밴드
      return (
        <g id="hair-band">
          <path d="M125 135 C125 90 275 90 275 135 Z" fill="#451A03" />
          {/* Red Athletic Headband */}
          <path d="M114 135 Q200 115 286 135 L284 150 Q200 130 116 150 Z" fill="#DC2626" />
          <text x="200" y="145" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">RUN KU</text>
        </g>
      );

    case "hip_beanie": // 06: 탐험가 비니
      return (
        <g id="hair-beanie">
          <path d="M120 130 C120 70 280 70 280 130 Z" fill="#4C1D95" stroke="#2E1065" strokeWidth="2" />
          <rect x="114" y="122" width="172" height="20" rx="8" fill="#6D28D9" />
          <text x="200" y="135" fill="#FDE047" fontSize="9" fontWeight="bold" textAnchor="middle">ADVENTURE</text>
        </g>
      );

    case "classic_part": // 07: 서재 은둔자 가르마
      return (
        <g id="hair-classic" fill="#292524">
          <path d="M125 135 C125 90 275 90 275 135 C250 120 215 125 200 120 C185 125 150 120 125 135 Z" />
          <path d="M135 135 Q170 148 190 135 Q230 148 265 135 Q200 120 135 135 Z" />
        </g>
      );

    case "ku_varsity_cap": // 08: 새내기 야구모자
    default:
      return (
        <g id="hair-cap">
          <path d="M125 135 C125 80 275 80 275 135 Z" fill="#862633" />
          <path d="M110 138 Q200 120 290 138 Q240 160 110 138 Z" fill="#54131D" />
          <text x="200" y="112" fill="#FDE047" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="serif">
            K
          </text>
        </g>
      );
  }
};

// 7. Outfits
export const OutfitLayer: React.FC<PartProps> = ({ config }) => {
  const outfit = config.parts.outfitType;

  switch (outfit) {
    case "stage_glam_jacket": // 01: 흑표범 무대 의상
      return (
        <g id="outfit-stage">
          <path d="M100 250 Q200 230 300 250 L340 380 L60 380 Z" fill="#0F172A" />
          <polygon points="170,245 230,245 200,310" fill="#F43F5E" />
          {/* Silver Studs / Chains */}
          <line x1="165" y1="250" x2="185" y2="380" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="150" cy="280" r="4" fill="#FDE047" />
          <circle cx="250" cy="280" r="4" fill="#FDE047" />
        </g>
      );

    case "night_hoodie": // 02: 올빼미 후드티
      return (
        <g id="outfit-owl-hoodie">
          <path d="M110 250 Q200 230 290 250 L330 380 L70 380 Z" fill="#1E293B" />
          <line x1="180" y1="250" x2="180" y2="300" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <line x1="220" y1="250" x2="220" y2="300" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <text x="200" y="320" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            NO SLEEP;
          </text>
        </g>
      );

    case "volunteer_eco_vest": // 03: 텀블러 요정 자원봉사 조끼
      return (
        <g id="outfit-eco-vest">
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#FFFFFF" />
          {/* Green Eco Volunteer Vest */}
          <path d="M125 248 L170 248 L165 380 L90 380 Z" fill="#059669" />
          <path d="M275 248 L230 248 L235 380 L310 380 Z" fill="#059669" />
          {/* Eco Heart Logo */}
          <circle cx="148" cy="290" r="10" fill="#FFFFFF" />
          <text x="148" y="294" fontSize="11" textAnchor="middle">🌱</text>
        </g>
      );

    case "formal_president_suit": // 04: 학회장 정장
      return (
        <g id="outfit-president-suit">
          <path d="M105 250 Q200 230 295 250 L335 380 L65 380 Z" fill="#1E3A8A" />
          <polygon points="170,245 230,245 200,340" fill="#FFFFFF" />
          <polygon points="194,258 206,258 209,330 200,345 191,330" fill="#862633" />
          <line x1="193" y1="285" x2="207" y2="285" stroke="#F59E0B" strokeWidth="2" />
        </g>
      );

    case "sport_running_wear": // 05: 러너 트레이닝복
      return (
        <g id="outfit-runner">
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#DC2626" />
          {/* Dynamic White Racing Stripes */}
          <path d="M110 250 L70 380 L95 380 L130 250 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M290 250 L330 380 L305 380 L270 250 Z" fill="#FFFFFF" opacity="0.7" />
          <text x="200" y="315" fill="#FFFFFF" fontSize="24" fontWeight="900" textAnchor="middle">
            KU #1
          </text>
        </g>
      );

    case "explorer_casual": // 06: 탐험가 캐주얼 룩
      return (
        <g id="outfit-explorer">
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#7C3AED" />
          {/* Backpack Straps */}
          <line x1="140" y1="250" x2="130" y2="380" stroke="#F59E0B" strokeWidth="8" />
          <line x1="260" y1="250" x2="270" y2="380" stroke="#F59E0B" strokeWidth="8" />
          <text x="200" y="310" fill="#FDE047" fontSize="16" textAnchor="middle">🎒</text>
        </g>
      );

    case "hermit_knit": // 07: 서재 은둔자 니트
      return (
        <g id="outfit-knit">
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#78350F" opacity="0.9" />
          <path d="M150 240 Q200 265 250 240 Q260 255 245 265 Q200 280 155 265 Z" fill="#451A03" />
        </g>
      );

    case "ku_crimson_varsity": // 08: 과잠 입은 새내기
    default:
      return (
        <g id="outfit-varsity">
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#862633" stroke="#54131D" strokeWidth="2" />
          <path d="M110 250 L70 380 L105 380 L135 255 Z" fill="#FEF3C7" />
          <path d="M290 250 L330 380 L295 380 L265 255 Z" fill="#FEF3C7" />
          <path d="M165 242 Q200 258 235 242" stroke="#FFFFFF" strokeWidth="5" fill="none" />
          <circle cx="200" cy="270" r="3.5" fill="#FFFFFF" />
          <circle cx="200" cy="300" r="3.5" fill="#FFFFFF" />
          <circle cx="200" cy="330" r="3.5" fill="#FFFFFF" />
          <circle cx="200" cy="360" r="3.5" fill="#FFFFFF" />
          <text x="155" y="295" fill="#FDE047" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="serif">
            K
          </text>
        </g>
      );
  }
};

// 8. Props
export const PropsLayer: React.FC<PartProps> = ({ config }) => {
  const prop = config.parts.propType;

  switch (prop) {
    case "stand_mic": // 01: 흑표범 스탠드 마이크
      return (
        <g id="prop-stand-mic" transform="translate(250, 240) scale(0.9)">
          <rect x="25" y="30" width="8" height="120" rx="4" fill="#64748B" />
          <ellipse cx="29" cy="20" rx="14" ry="18" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
          <circle cx="29" cy="20" r="26" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" />
        </g>
      );

    case "energy_drink_laptop": // 02: 에너지드링크 & 녹색 코드 노트북
      return (
        <g id="prop-owl-tech" transform="translate(230, 260) scale(0.9)">
          {/* Laptop with Green Code */}
          <rect x="0" y="30" width="110" height="60" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <rect x="6" y="35" width="98" height="48" rx="4" fill="#022C22" />
          <text x="12" y="48" fill="#34D399" fontSize="8" fontFamily="monospace">void loop()</text>
          <text x="12" y="60" fill="#34D399" fontSize="8" fontFamily="monospace">&gt; SUCCESS_</text>
          {/* Energy Drink Can */}
          <rect x="95" y="10" width="18" height="35" rx="3" fill="#10B981" stroke="#064E3B" strokeWidth="1.5" />
          <text x="104" y="28" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">60mg</text>
        </g>
      );

    case "eco_tumbler": // 03: 텀블러 요정 에코백 & 텀블러
      return (
        <g id="prop-tumbler" transform="translate(250, 260) scale(0.9)">
          {/* Eco Stainless Tumbler */}
          <polygon points="18,15 48,15 44,75 22,75" fill="#10B981" stroke="#047857" strokeWidth="2" />
          <rect x="15" y="10" width="36" height="6" rx="2" fill="#FFFFFF" />
          <text x="33" y="48" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">ECO</text>
          {/* Sprout sticker on tumbler */}
          <circle cx="33" cy="62" r="5" fill="#FEF08A" />
        </g>
      );

    case "laser_pointer_slide": // 04: 학회장 레이저 포인터 & 슬라이드
      return (
        <g id="prop-pointer" transform="translate(245, 255) scale(0.9)">
          {/* Slide Board Mini */}
          <rect x="10" y="20" width="75" height="50" rx="6" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />
          <polyline points="20,55 35,42 50,48 65,30" stroke="#F59E0B" strokeWidth="2" fill="none" />
          {/* Red Laser Dot */}
          <circle cx="65" cy="30" r="4" fill="#EF4444" filter="blur(1px)" />
        </g>
      );

    case "smartwatch_dumbbell": // 05: 러너 스마트워치 & 아령
      return (
        <g id="prop-runner-gear" transform="translate(250, 270) scale(0.9)">
          {/* Smartwatch display */}
          <rect x="15" y="20" width="32" height="32" rx="8" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
          <text x="31" y="35" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle">160 BPM</text>
          <text x="31" y="46" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">10.5km</text>
        </g>
      );

    case "camera_map": // 06: 탐험가 카메라 & 캠퍼스 지도
      return (
        <g id="prop-camera-map" transform="translate(240, 265) scale(0.9)">
          <rect x="10" y="20" width="70" height="45" rx="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="45" cy="42" r="16" fill="#0F172A" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="45" cy="42" r="10" fill="#3B82F6" opacity="0.6" />
          <circle cx="68" cy="28" r="3" fill="#EF4444" />
        </g>
      );

    case "vintage_book_pen": // 07: 서재 은둔자 양장본 & 만년필
      return (
        <g id="prop-book-pen" transform="translate(240, 270) scale(0.9)">
          <rect x="10" y="20" width="65" height="50" rx="4" fill="#451A03" stroke="#292524" strokeWidth="2" />
          <rect x="15" y="24" width="55" height="42" rx="2" fill="#FEF3C7" />
          <line x1="22" y1="34" x2="60" y2="34" stroke="#92400E" strokeWidth="2" />
          <line x1="22" y1="44" x2="55" y2="44" stroke="#92400E" strokeWidth="2" />
          <polygon points="65,10 78,3 82,7 69,14" fill="#F59E0B" />
        </g>
      );

    case "campus_guide_map": // 08: 새내기 캠퍼스 가이드 지도
    default:
      return (
        <g id="prop-freshman-guide" transform="translate(240, 270) scale(0.9)">
          {/* Folded Campus Map */}
          <polygon points="10,20 35,15 60,22 85,15 85,65 60,72 35,65 10,70" fill="#FEF3C7" stroke="#862633" strokeWidth="2" />
          <circle cx="35" cy="40" r="4" fill="#EF4444" />
          <text x="45" y="44" fill="#862633" fontSize="8" fontWeight="bold">안암골</text>
        </g>
      );
  }
};
