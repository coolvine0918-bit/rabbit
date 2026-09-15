import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameTimerProps {
  initialSeconds?: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  initialSeconds = 300, // 5 minutes
  isRunning,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 10 && next > 0) {
          sound.playTick();
        }
        if (next <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = timeLeft / initialSeconds;
  const strokeDashoffset = 283 * (1 - progressRatio);

  // Status Colors
  const isDanger = timeLeft <= 30;
  const isWarning = timeLeft > 30 && timeLeft <= 60;

  const colorClass = isDanger
    ? 'text-rose-400 stroke-rose-500'
    : isWarning
    ? 'text-amber-400 stroke-amber-500'
    : 'text-emerald-400 stroke-emerald-500';

  return (
    <div
      id="game-timer-container"
      className="relative flex flex-col items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 sm:p-3 shadow-2xl min-w-[90px] sm:min-w-[120px]"
    >
      <div className="flex items-center gap-1 text-[11px] sm:text-xs font-jua text-slate-300 mb-1">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>남은 시간</span>
      </div>

      {/* Circular Timer Ring */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="7"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={`transition-all duration-1000 ${colorClass}`}
          />
        </svg>

        {/* Digital Time Inside */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-base sm:text-lg font-mono font-bold tracking-tight ${colorClass} ${
              isDanger ? 'animate-pulse font-extrabold' : ''
            }`}
          >
            {formattedTime}
          </span>
          <span className="text-[9px] text-slate-400 font-sans">3분 제한</span>
        </div>
      </div>

      {isDanger && (
        <div className="mt-1 flex items-center gap-0.5 text-[10px] text-rose-400 font-jua animate-bounce">
          <AlertCircle className="w-3 h-3" />
          <span>마무리 서두르세요!</span>
        </div>
      )}
    </div>
  );
};
