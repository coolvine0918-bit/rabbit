import React from 'react';
import { RabbitEvolutionLevel } from '../types';

export type RabbitMood = 'idle' | 'correct' | 'wrong-first' | 'wrong-second' | 'harvesting' | 'fever';

interface RabbitAvatarProps {
  mood: RabbitMood;
  speechText?: string;
  onPersimmonClick?: () => void;
  canClaimReward?: boolean;
  evolutionLevel?: RabbitEvolutionLevel;
  comboCount?: number;
  isFever?: boolean;
}

export const RabbitAvatar: React.FC<RabbitAvatarProps> = ({
  mood,
  speechText,
  onPersimmonClick,
  canClaimReward,
  evolutionLevel = 1,
  comboCount = 0,
  isFever = false,
}) => {
  const getLevelBadge = () => {
    switch (evolutionLevel) {
      case 1:
        return { name: 'Lv.1 아기 달토끼', color: 'bg-slate-800/90 text-slate-200 border-slate-600' };
      case 2:
        return { name: 'Lv.2 색동 도령 토끼', color: 'bg-indigo-900/90 text-indigo-200 border-indigo-500' };
      case 3:
        return { name: 'Lv.3 만물상 옥토끼', color: 'bg-purple-900/90 text-purple-200 border-purple-400' };
      case 4:
        return { name: 'Lv.4 전설의 헌법 수호신', color: 'bg-amber-900/95 text-amber-200 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' };
      default:
        return { name: 'Lv.1 아기 달토끼', color: 'bg-slate-800 text-slate-200 border-slate-600' };
    }
  };

  const badge = getLevelBadge();

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-auto">
      {/* Level Badge above Speech */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-jua border shadow-md flex items-center gap-1 ${badge.color}`}>
          {evolutionLevel === 4 ? '👑' : evolutionLevel === 3 ? '✨' : evolutionLevel === 2 ? '🎀' : '🐰'}
          <span>{badge.name}</span>
        </span>
        {comboCount >= 2 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-jua bg-rose-600 text-white border border-rose-400 shadow animate-pulse">
            🔥 {comboCount}연속 정답!
          </span>
        )}
      </div>

      {/* Speech Bubble Above Rabbit */}
      {speechText && (
        <div className={`relative z-30 mb-2 max-w-[210px] sm:max-w-xs px-3 py-1.5 rounded-xl text-slate-900 border-2 shadow-xl text-center text-xs sm:text-sm font-jua transition-all ${
          isFever
            ? 'bg-amber-100 border-amber-400 text-amber-950 animate-bounce shadow-[0_0_20px_rgba(251,191,36,0.6)]'
            : 'bg-amber-50 border-amber-300'
        }`}>
          {speechText}
          <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300 -translate-x-1/2" />
        </div>
      )}

      <div className="relative flex items-end">
        {/* Rabbit Sitting on the Wall */}
        <div
          className={`relative transition-transform duration-300 ${
            mood === 'correct' || isFever
              ? 'animate-bounce'
              : mood === 'wrong-first'
              ? 'animate-pulse'
              : ''
          }`}
        >
          {/* Main SVG Rabbit with Evolution Layers */}
          <svg
            viewBox="0 0 170 190"
            className="w-28 sm:w-36 md:w-44 h-auto drop-shadow-2xl overflow-visible"
          >
            <defs>
              <radialGradient id="rabbitBody" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="85%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </radialGradient>
              <linearGradient id="pinkEar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="goldGat" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Level 4: Divine Angel Wings / Halo Aura */}
            {evolutionLevel >= 4 && (
              <g className="animate-pulse opacity-90">
                {/* Golden Halo */}
                <ellipse cx="68" cy="18" rx="30" ry="8" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
                <ellipse cx="68" cy="18" rx="27" ry="6" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                {/* Celestial Aura Rays */}
                <circle cx="82" cy="110" r="70" fill="#fde047" opacity="0.15" />
              </g>
            )}

            {/* Fluffy Tail */}
            <circle cx="132" cy="138" r="16" fill="#cbd5e1" />
            <circle cx="134" cy="136" r="14" fill="#e2e8f0" />

            {/* Back Foot / Haunch */}
            <ellipse cx="108" cy="148" rx="28" ry="18" fill="url(#rabbitBody)" />

            {/* Main Body */}
            <ellipse cx="82" cy="120" rx="32" ry="38" fill="url(#rabbitBody)" />

            {/* Level 2 & 3 & 4 Hanbok Vest / Clothes */}
            {evolutionLevel === 2 && (
              // Lv.2 색동 조끼 (Saekdong vest)
              <g>
                <path d="M 62,96 Q 82,90 102,96 L 105,135 Q 82,142 60,135 Z" fill="#6366f1" opacity="0.9" />
                {/* Striped collar */}
                <path d="M 70,96 L 82,118 L 94,96" stroke="#f43f5e" strokeWidth="4" fill="none" />
                <path d="M 72,96 L 82,115 L 92,96" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
              </g>
            )}

            {evolutionLevel === 3 && (
              // Lv.3 보라빛 명절 한복과 복주머니
              <g>
                <path d="M 60,94 Q 82,88 104,94 L 108,138 Q 82,146 58,138 Z" fill="#9333ea" opacity="0.95" />
                <path d="M 68,94 L 82,120 L 96,94" stroke="#fbbf24" strokeWidth="4.5" fill="none" />
                {/* Gold pouch hanging */}
                <ellipse cx="62" cy="130" rx="6" ry="8" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="62" y1="122" x2="62" y2="128" stroke="#dc2626" strokeWidth="1.5" />
              </g>
            )}

            {evolutionLevel >= 4 && (
              // Lv.4 황금 관복과 헌법 수호 옥패
              <g>
                <path d="M 58,92 Q 82,85 106,92 L 110,140 Q 82,148 56,140 Z" fill="#b45309" />
                <path d="M 60,94 Q 82,88 104,94 L 107,137 Q 82,145 59,137 Z" fill="#d97706" />
                <path d="M 66,92 L 82,122 L 98,92" stroke="#fef08a" strokeWidth="5" fill="none" />
                {/* Jade emblem */}
                <circle cx="82" cy="128" r="7" fill="#10b981" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="82" cy="128" r="3.5" fill="#047857" />
              </g>
            )}

            {/* Front Paws */}
            {mood === 'correct' || isFever ? (
              // Raised paws celebrating
              <g>
                <ellipse cx="56" cy="78" rx="7" ry="12" transform="rotate(-30 56 78)" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <ellipse cx="78" cy="76" rx="7" ry="12" transform="rotate(20 78 76)" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
              </g>
            ) : mood === 'harvesting' ? (
              // Reaching up paw
              <g>
                <ellipse cx="50" cy="70" rx="7" ry="13" transform="rotate(-45 50 70)" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <ellipse cx="68" cy="115" rx="8" ry="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
              </g>
            ) : (
              // Resting front paw
              <ellipse cx="64" cy="145" rx="10" ry="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            )}

            {/* Level 4 Staff: Golden Constitutional Scalpel / Persimmon Scepter */}
            {evolutionLevel >= 4 && (
              <g transform="translate(38, 70) rotate(-15)">
                <line x1="0" y1="0" x2="0" y2="75" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                <circle cx="0" cy="-4" r="9" fill="#fb923c" stroke="#f59e0b" strokeWidth="2" />
                <polygon points="0,-16 4,-6 14,-6 6,0 9,10 0,4 -9,10 -6,0 -14,-6 -4,-6" fill="#fde047" />
              </g>
            )}

            {/* Head */}
            <ellipse cx="68" cy="68" rx="25" ry="24" fill="url(#rabbitBody)" />

            {/* Left Ear */}
            <g transform={mood === 'wrong-first' ? 'rotate(-12 60 40)' : 'rotate(-5 60 40)'}>
              <ellipse cx="52" cy="24" rx="9" ry="26" fill="url(#rabbitBody)" />
              <ellipse cx="52" cy="24" rx="4.5" ry="20" fill="url(#pinkEar)" opacity="0.85" />
            </g>

            {/* Right Ear */}
            <g transform={mood === 'wrong-first' ? 'rotate(10 75 40)' : 'rotate(8 75 40)'}>
              <ellipse cx="74" cy="20" rx="9" ry="27" fill="url(#rabbitBody)" />
              <ellipse cx="74" cy="20" rx="4.5" ry="21" fill="url(#pinkEar)" opacity="0.85" />
            </g>

            {/* Level 3 Gat (전통 갓) / Level 4 Golden Crown Hat */}
            {evolutionLevel === 3 && (
              <g transform="translate(68, 44)">
                {/* Black Gat brim */}
                <ellipse cx="0" cy="0" rx="26" ry="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                {/* Gat cylinder */}
                <rect x="-11" y="-18" width="22" height="18" rx="2" fill="#0f172a" />
                {/* Amber Gat string */}
                <path d="M -10,0 Q 0,16 10,0" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {evolutionLevel >= 4 && (
              <g transform="translate(68, 42)">
                {/* Golden Crown Brim */}
                <ellipse cx="0" cy="0" rx="28" ry="7" fill="url(#goldGat)" stroke="#fef08a" strokeWidth="1.5" />
                {/* Crown crown peaks */}
                <polygon points="-12,-2 -16,-18 -8,-8 0,-24 8,-8 16,-18 12,-2" fill="url(#goldGat)" stroke="#fef08a" strokeWidth="1" />
                <circle cx="0" cy="-24" r="3" fill="#ef4444" />
                <circle cx="-16" cy="-18" r="2.5" fill="#3b82f6" />
                <circle cx="16" cy="-18" r="2.5" fill="#10b981" />
              </g>
            )}

            {/* Eye */}
            {mood === 'correct' || isFever ? (
              // Smiling happy curved eye
              <path d="M 48,64 Q 54,58 60,64" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : mood === 'wrong-first' || mood === 'wrong-second' ? (
              // Winking / puzzled eye
              <g>
                <circle cx="53" cy="64" r="4.5" fill="#1e293b" />
                <circle cx="51.5" cy="62" r="1.5" fill="#ffffff" />
                {/* Sweatdrop */}
                <path d="M 36,48 Q 32,56 36,59 Q 40,56 36,48 Z" fill="#38bdf8" />
              </g>
            ) : (
              // Cute curious round eye
              <g>
                <circle cx="52" cy="64" r="4.5" fill="#1e293b" />
                <circle cx="50.5" cy="62.5" r="1.8" fill="#ffffff" />
              </g>
            )}

            {/* Pink Nose & Whiskers */}
            <ellipse cx="42" cy="69" rx="2.5" ry="2" fill="#f472b6" />
            <path d="M 38,72 Q 42,75 46,72" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />

            {/* Cheeks */}
            <ellipse cx="46" cy="71" rx="5" ry="3.5" fill="#fda4af" opacity="0.6" />

            {/* Sparkle effects on correct or fever */}
            {(mood === 'correct' || isFever) && (
              <g className="animate-spin">
                <polygon points="25,35 27,42 34,44 27,46 25,53 23,46 16,44 23,42" fill="#fbbf24" />
                <polygon points="120,40 122,46 128,47 122,49 120,55 118,49 112,47 118,46" fill="#fde047" />
              </g>
            )}
          </svg>
        </div>

        {/* Persimmon Sitting on the Wall next to the Rabbit */}
        <div
          className={`relative -ml-4 mb-2 cursor-pointer transition-transform duration-200 hover:scale-115 ${
            canClaimReward ? 'animate-bounce ring-4 ring-amber-400 rounded-full p-1' : ''
          }`}
          onClick={onPersimmonClick}
          title="토끼 옆의 잘 익은 감 (클릭하여 감 수확)"
        >
          <svg viewBox="0 0 50 50" className="w-10 sm:w-12 h-10 sm:h-12 drop-shadow-lg">
            <defs>
              <radialGradient id="wallPersimmon" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </radialGradient>
            </defs>
            <path d="M 25,12 L 25,6" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 18,13 Q 25,9 32,13 Q 25,16 18,13" fill="#4d7c0f" />
            <circle cx="25" cy="28" r="18" fill="url(#wallPersimmon)" />
            <ellipse cx="21" cy="22" rx="4" ry="2" fill="#ffffff" opacity="0.4" />
          </svg>
          {canClaimReward && (
            <span className="absolute -top-3 -right-2 px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full font-jua animate-pulse">
              수확!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

