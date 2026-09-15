import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Hand } from 'lucide-react';
import { GiftItem } from '../types';
import { getRandomGift } from '../data/gifts';
import { sound } from '../utils/audio';

interface RewardModalProps {
  onClaimReward: (gift: GiftItem, choiceType: 'persimmon' | 'box') => void;
  comboCount?: number;
  isFever?: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  onClaimReward,
  comboCount = 0,
  isFever = false,
}) => {
  const [selectedType, setSelectedType] = useState<'persimmon' | 'box' | null>(null);
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [revealedGift, setRevealedGift] = useState<GiftItem | null>(null);

  const handleStartInteraction = (type: 'persimmon' | 'box') => {
    setSelectedType(type);
    setIsHarvesting(true);

    // Audio cue for action (tree shake / unwrapping)
    sound.playCombo(Math.max(comboCount, 1));

    // Simulate active hand-picking tactile duration
    setTimeout(() => {
      const gift = getRandomGift(type);
      setRevealedGift(gift);
      setIsHarvesting(false);
      sound.playGiftHarvest();

      // Trigger colorful Chuseok confetti
      confetti({
        particleCount: isFever ? 120 : 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: isFever
          ? ['#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#a855f7', '#3b82f6']
          : ['#f59e0b', '#fbbf24', '#f97316', '#34d399', '#ec4899', '#60a5fa'],
      });
    }, 650);
  };

  const handleConfirm = () => {
    if (revealedGift && selectedType) {
      onClaimReward(revealedGift, selectedType);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className={`relative w-full max-w-lg bg-slate-900/95 border-2 rounded-3xl p-5 sm:p-7 text-slate-100 text-center shadow-2xl transition-all duration-300 ${
        isFever
          ? 'border-amber-400 shadow-[0_0_80px_rgba(251,191,36,0.6)] ring-4 ring-amber-400/30'
          : 'border-amber-400/70 shadow-[0_0_60px_rgba(251,191,36,0.3)]'
      }`}>
        {/* Fever Banner if in Fever */}
        {isFever && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 font-jua text-xs sm:text-sm font-bold shadow-lg animate-pulse">
            🔥 FEVER TIME 발동! 보너스 점수 2배 대폭발! 🔥
          </div>
        )}

        {!revealedGift && !isHarvesting ? (
          <>
            {/* Celebration Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl animate-bounce">🎉</span>
              <h2 className="text-2xl sm:text-3xl font-jua text-amber-300">
                정답입니다! 훌륭해요!
              </h2>
              <span className="text-3xl animate-bounce">🎉</span>
            </div>

            {comboCount >= 2 && (
              <p className="text-xs sm:text-sm font-jua text-rose-400 mb-2">
                🔥 {comboCount}연속 정답 성공! (배율 보너스 적립 중)
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-300 font-noto mb-5">
              원하는 보상을 직접 터치하여 수확하거나 풀어보세요!
            </p>

            {/* Interactive Choices with Tactile Ripple Feedback */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              {/* Option 1: Persimmon Tree Picking */}
              <button
                onClick={() => handleStartInteraction('persimmon')}
                className="group relative p-4 sm:p-5 bg-gradient-to-b from-orange-950/50 to-slate-900 border-2 border-orange-500/70 hover:border-orange-400 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 transform hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95"
              >
                <div className="text-5xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-200 drop-shadow-lg">
                  🍊
                </div>
                <span className="font-jua text-orange-300 text-sm sm:text-base flex items-center gap-1">
                  <Hand className="w-3.5 h-3.5 inline text-orange-400" />
                  <span>가지의 감 따기</span>
                </span>
                <span className="text-[11px] text-orange-200/80 font-noto">
                  클릭해서 가지 흔들고 수확
                </span>
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-[10px] font-jua">
                  가을 제철 보너스
                </span>
              </button>

              {/* Option 2: Bojagi Gift Box Unwrapping */}
              <button
                onClick={() => handleStartInteraction('box')}
                className="group relative p-4 sm:p-5 bg-gradient-to-b from-purple-950/50 to-slate-900 border-2 border-purple-500/70 hover:border-purple-400 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 transform hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95"
              >
                <div className="text-5xl group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-200 drop-shadow-lg">
                  🎁
                </div>
                <span className="font-jua text-purple-300 text-sm sm:text-base flex items-center gap-1">
                  <Hand className="w-3.5 h-3.5 inline text-purple-400" />
                  <span>보자기 매듭 풀기</span>
                </span>
                <span className="text-[11px] text-purple-200/80 font-noto">
                  클릭해서 명절 선물 열기
                </span>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-jua">
                  희귀 전통 선물 확률UP
                </span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-noto">
              💡 배경 화면의 감나무 가지나 선물 상자를 직접 클릭하셔도 즉시 수확됩니다!
            </p>
          </>
        ) : isHarvesting ? (
          /* Active Interactive Shaking / Unwrapping Animation */
          <div className="py-10 flex flex-col items-center justify-center animate-in fade-in">
            <div className="relative text-6xl animate-bounce mb-4">
              {selectedType === 'persimmon' ? (
                <span className="inline-block transform animate-spin">🍊</span>
              ) : (
                <span className="inline-block transform animate-pulse">🎁</span>
              )}
            </div>
            <h3 className="text-xl font-jua text-amber-300 mb-1 animate-pulse">
              {selectedType === 'persimmon' ? '나뭇가지를 털어 감을 따는 중...!' : '정성스런 보자기 매듭을 푸는 중...!'}
            </h3>
            <p className="text-xs text-slate-400 font-noto">
              어떤 멋진 한가위 보물이 나올까요?
            </p>
          </div>
        ) : (
          /* Revealed Gift Card */
          revealedGift && (
            <>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 border border-amber-400 text-amber-300 rounded-full text-xs font-jua mb-3 shadow">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{revealedGift.rarity} 등급 명절 보물 발견!</span>
              </div>

              <div className="relative w-28 h-28 mx-auto my-3 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-amber-300/40 border-2 border-amber-400/80 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-bounce">
                {revealedGift.icon}
              </div>

              <h3 className="text-2xl font-jua text-amber-200 mb-1">
                {revealedGift.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-noto mb-4 px-4 leading-relaxed">
                "{revealedGift.description}"
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/90 border border-amber-400/50 rounded-2xl text-amber-300 font-jua text-sm mb-6 shadow">
                <span>보너스 점수:</span>
                <span className="text-lg font-bold text-amber-400">
                  +{isFever ? revealedGift.points * 2 : revealedGift.points}점
                </span>
                {isFever && (
                  <span className="text-xs text-rose-400 font-bold">(FEVER 2배 적용!)</span>
                )}
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-jua text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer font-bold active:scale-98 transition transform"
              >
                <span>선물 보관함에 챙기고 다음 문제로!</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

