import React from 'react';

interface ChuseokBackgroundProps {
  onPickPersimmon?: () => void;
  onOpenGiftBox?: () => void;
  canClaimReward?: boolean;
}

export const ChuseokBackground: React.FC<ChuseokBackgroundProps> = ({
  onPickPersimmon,
  onOpenGiftBox,
  canClaimReward,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Night Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060b1e] via-[#0b1433] to-[#121c3b]" />

      {/* Twinkling Stars */}
      <svg className="absolute inset-0 w-full h-full opacity-70">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="60%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Star coordinates */}
        {[
          { cx: '15%', cy: '18%', r: 2.5, anim: 'animate-pulse' },
          { cx: '28%', cy: '12%', r: 3.5, anim: 'animate-pulse delay-75' },
          { cx: '35%', cy: '25%', r: 2, anim: 'animate-pulse delay-150' },
          { cx: '48%', cy: '15%', r: 2.5, anim: 'animate-pulse delay-300' },
          { cx: '62%', cy: '22%', r: 3, anim: 'animate-pulse delay-200' },
          { cx: '75%', cy: '14%', r: 2.5, anim: 'animate-pulse delay-100' },
          { cx: '88%', cy: '28%', r: 3.5, anim: 'animate-pulse delay-500' },
          { cx: '82%', cy: '36%', r: 2, anim: 'animate-pulse delay-700' },
        ].map((star, idx) => (
          <circle
            key={idx}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="url(#starGlow)"
            className={star.anim}
          />
        ))}

        {/* 4-point golden sparkle stars from attached illustration */}
        <g transform="translate(420, 160) scale(0.9)" className="animate-pulse">
          <path d="M 0,-15 Q 0,0 15,0 Q 0,0 0,15 Q 0,0 -15,0 Q 0,0 0,-15" fill="#fde047" opacity="0.9" />
        </g>
        <g transform="translate(390, 190) scale(0.6)" className="animate-pulse delay-300">
          <path d="M 0,-15 Q 0,0 15,0 Q 0,0 0,15 Q 0,0 -15,0 Q 0,0 0,-15" fill="#fef08a" opacity="0.8" />
        </g>
        <g transform="translate(980, 260) scale(0.75)" className="animate-pulse delay-500">
          <path d="M 0,-15 Q 0,0 15,0 Q 0,0 0,15 Q 0,0 -15,0 Q 0,0 0,-15" fill="#fde047" opacity="0.85" />
        </g>
      </svg>

      {/* Top Left: Golden Harvest Full Moon (보름달) */}
      <div className="absolute -top-12 -left-12 sm:-top-8 sm:-left-8 w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#fff3b0] via-[#fcd34d] to-[#eab308] shadow-[0_0_90px_rgba(252,211,77,0.4)] opacity-95">
        {/* Subtle Moon surface craters */}
        <div className="absolute w-20 h-20 rounded-full bg-[#f59e0b]/20 top-1/4 left-1/3 blur-sm" />
        <div className="absolute w-12 h-12 rounded-full bg-[#d97706]/15 top-1/2 left-1/2 blur-xs" />
        <div className="absolute w-16 h-16 rounded-full bg-[#f59e0b]/15 top-2/3 left-1/4 blur-sm" />
      </div>

      {/* Left Persimmon Branch (감나무 가지 - 왼쪽 보름달 앞) */}
      <svg
        viewBox="0 0 400 300"
        className="absolute top-0 left-0 w-64 sm:w-88 md:w-104 h-auto pointer-events-auto z-10"
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          <filter id="branchShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.4" />
          </filter>
          <radialGradient id="persimmonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ff9800" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
        </defs>

        {/* Tree Branch */}
        <path
          d="M -20,70 Q 70,85 130,135 Q 180,180 250,220"
          stroke="#5c3818"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          filter="url(#branchShadow)"
        />
        <path
          d="M 60,95 Q 120,60 180,75"
          stroke="#4a2a10"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 140,145 Q 150,220 140,240"
          stroke="#4a2a10"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Leaves */}
        <ellipse cx="60" cy="120" rx="14" ry="7" transform="rotate(-30 60 120)" fill="#2e7d32" />
        <ellipse cx="110" cy="115" rx="15" ry="8" transform="rotate(25 110 115)" fill="#388e3c" />
        <ellipse cx="160" cy="110" rx="16" ry="8" transform="rotate(-40 160 110)" fill="#1b5e20" />
        <ellipse cx="205" cy="190" rx="15" ry="7" transform="rotate(45 205 190)" fill="#2e7d32" />
        <ellipse cx="145" cy="200" rx="13" ry="7" transform="rotate(-20 145 200)" fill="#388e3c" />

        {/* Hanging Persimmon 1 */}
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 85,175 L 85,190" stroke="#3e2723" strokeWidth="3" />
          <path d="M 75,190 Q 85,185 95,190 Q 85,195 75,190" fill="#2e7d32" />
          <circle cx="85" cy="205" r="19" fill="url(#persimmonGrad)" />
        </g>

        {/* Hanging Persimmon 2 */}
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce delay-75' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 140,110 L 140,125" stroke="#3e2723" strokeWidth="3" />
          <path d="M 130,125 Q 140,120 150,125 Q 140,130 130,125" fill="#2e7d32" />
          <circle cx="140" cy="140" r="18" fill="url(#persimmonGrad)" />
        </g>

        {/* Hanging Persimmon 3 */}
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce delay-150' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 140,240 L 140,255" stroke="#3e2723" strokeWidth="3" />
          <path d="M 130,255 Q 140,250 150,255 Q 140,260 130,255" fill="#2e7d32" />
          <circle cx="140" cy="270" r="20" fill="url(#persimmonGrad)" />
        </g>

        {/* Hanging Persimmon 4 */}
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce delay-200' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 205,230 L 205,245" stroke="#3e2723" strokeWidth="3" />
          <path d="M 195,245 Q 205,240 215,245 Q 205,250 195,245" fill="#2e7d32" />
          <circle cx="205" cy="260" r="19" fill="url(#persimmonGrad)" />
        </g>
      </svg>

      {/* Top Right Persimmon Branch (오른쪽 위 감나무 가지) */}
      <svg
        viewBox="0 0 350 250"
        className="absolute top-0 right-0 w-56 sm:w-72 md:w-88 h-auto pointer-events-auto z-10"
        preserveAspectRatio="xMaxYMin meet"
      >
        <path
          d="M 370,10 Q 280,40 230,110 Q 180,170 120,200"
          stroke="#5c3818"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          filter="url(#branchShadow)"
        />
        <path
          d="M 280,45 Q 220,40 180,80"
          stroke="#4a2a10"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Leaves */}
        <ellipse cx="295" cy="75" rx="14" ry="7" transform="rotate(-20 295 75)" fill="#2e7d32" />
        <ellipse cx="235" cy="80" rx="16" ry="8" transform="rotate(30 235 80)" fill="#388e3c" />
        <ellipse cx="200" cy="140" rx="14" ry="7" transform="rotate(-35 200 140)" fill="#1b5e20" />
        <ellipse cx="145" cy="170" rx="13" ry="7" transform="rotate(25 145 170)" fill="#2e7d32" />

        {/* Right Persimmons */}
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 285,15 L 285,30" stroke="#3e2723" strokeWidth="3" />
          <circle cx="285" cy="42" r="16" fill="url(#persimmonGrad)" />
        </g>
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce delay-100' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 215,90 L 215,105" stroke="#3e2723" strokeWidth="3" />
          <circle cx="215" cy="120" r="19" fill="url(#persimmonGrad)" />
        </g>
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce delay-200' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 290,120 L 290,135" stroke="#3e2723" strokeWidth="3" />
          <circle cx="290" cy="150" r="18" fill="url(#persimmonGrad)" />
        </g>
        <g
          className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${canClaimReward ? 'animate-bounce delay-75' : ''}`}
          onClick={onPickPersimmon}
        >
          <path d="M 260,185 L 260,200" stroke="#3e2723" strokeWidth="3" />
          <circle cx="260" cy="216" r="18" fill="url(#persimmonGrad)" />
        </g>
      </svg>

      {/* Bottom Traditional Korean Roof Wall (한국 전통 기와 담장) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 pointer-events-auto z-10 flex flex-col justify-end">
        {/* Row of Round Tile End-Caps (기와 수막새 문양 원형) */}
        <div className="relative w-full h-8 sm:h-10 bg-[#334155] border-t-4 border-[#1e293b] flex items-center justify-between px-2 overflow-hidden shadow-lg">
          <div className="absolute inset-0 flex items-center justify-around">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#475569] border-2 border-[#1e293b] flex items-center justify-center shadow-inner"
              >
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#1e293b]" />
              </div>
            ))}
          </div>
        </div>

        {/* Earthen Wall Body (담장 몸체) */}
        <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-[#2a303c] via-[#1e232d] to-[#12151b] border-t-2 border-[#475569]/30 relative">
          <div className="absolute inset-x-0 top-2 h-0.5 bg-slate-600/30" />
          <div className="absolute inset-x-0 bottom-4 h-1 bg-black/40" />
        </div>
      </div>

      {/* Bottom-Left: Traditional Bojagi Gift Wrap Bundles (보자기 선물 꾸러미) */}
      <div
        className={`absolute bottom-20 sm:bottom-24 md:bottom-28 left-4 sm:left-10 md:left-16 z-20 pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 ${canClaimReward ? 'ring-4 ring-amber-400 rounded-xl animate-pulse' : ''}`}
        onClick={onOpenGiftBox}
        title="전통 보자기 선물 꾸러미 (클릭하여 선물 열기)"
      >
        <div className="relative flex items-end space-x-1 sm:space-x-2">
          {/* Basket Bojagi Box */}
          <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-[#b49069] rounded-t-lg border-2 border-[#825c38] flex flex-col items-center justify-between p-1 shadow-2xl">
            {/* Bojagi ribbon knot & norigae */}
            <div className="w-8 h-4 bg-[#8ec5fc] rounded-full border border-white -mt-2.5 shadow flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
            </div>
            {/* Basket weave pattern */}
            <div className="w-full flex flex-col space-y-1 my-auto opacity-70">
              <div className="w-full h-0.5 bg-[#664627]" />
              <div className="w-full h-0.5 bg-[#664627]" />
              <div className="w-full h-0.5 bg-[#664627]" />
              <div className="w-full h-0.5 bg-[#664627]" />
            </div>
            {/* Norigae tassel */}
            <div className="flex flex-col items-center -mb-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <div className="w-0.5 h-4 bg-emerald-600" />
            </div>
          </div>

          {/* Silk Wrapped Gift Bundle (남색 & 분홍 보자기) */}
          <div className="relative w-20 h-16 sm:w-24 sm:h-20 bg-[#4a6b82] rounded-lg border border-[#314a5d] shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Cross ribbon in pale pink */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-4 bg-[#fbcfe8] transform -rotate-12 opacity-85" />
              <div className="absolute w-4 h-full bg-[#fbcfe8] transform rotate-12 opacity-85" />
            </div>
            {/* Center ribbon blossom */}
            <div className="relative z-10 w-6 h-6 rounded-full bg-[#f472b6] border border-white shadow flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-300" />
            </div>
          </div>
        </div>

        {canClaimReward && (
          <div className="mt-1 px-2 py-0.5 bg-amber-400 text-slate-950 text-xs font-bold font-jua text-center rounded-full shadow animate-bounce">
            🎁 선물 꾸러미 열기!
          </div>
        )}
      </div>
    </div>
  );
};
