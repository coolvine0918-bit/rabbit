import React from 'react';
import { ShieldAlert, Scale, CheckCircle2, XCircle, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  attempts: number; // 0: not attempted, 1: first attempt wrong, 2: second attempt wrong
  isSolved: boolean;
  selectedChoice: number | null;
  wrongChoices: number[];
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
  comboCount?: number;
  isFever?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  attempts,
  isSolved,
  selectedChoice,
  wrongChoices,
  onSelectOption,
  onNextQuestion,
  comboCount = 0,
  isFever = false,
}) => {
  const isSecondFailure = attempts >= 2 && !isSolved;
  const canSelect = !isSolved && !isSecondFailure;

  return (
    <div
      id="quiz-card"
      className={`relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 flex flex-col transition-all duration-300 ${
        isFever
          ? 'border-2 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.5)] ring-2 ring-amber-400/40'
          : attempts === 1
          ? 'border-2 border-rose-500/80 animate-shake shadow-[0_0_25px_rgba(244,63,94,0.3)]'
          : 'border-2 border-amber-400/40'
      }`}
    >
      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-jua">
            문제 {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-noto font-bold">
            사례 {question.caseId}
          </span>
          {comboCount >= 2 && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-full text-xs font-jua shadow animate-pulse flex items-center gap-1">
              <span>🔥 {comboCount}연타 콤보!</span>
              <span className="text-[10px] text-amber-200">
                ({comboCount >= 5 ? 'x2.0' : comboCount >= 3 ? 'x1.5' : 'x1.2'})
              </span>
            </span>
          )}
        </div>

        {/* Question Type Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-jua border ${
            question.questionType === 'RIGHT_RESTRICTED'
              ? 'bg-sky-950/70 border-sky-400/50 text-sky-300'
              : 'bg-emerald-950/70 border-emerald-400/50 text-emerald-300'
          }`}
        >
          {question.questionType === 'RIGHT_RESTRICTED' ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              <span>제한받는 기본권 찾기</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>기본권 제한의 사유(목적) 찾기</span>
            </>
          )}
        </div>
      </div>

      {/* Verbatim Story Case Box */}
      <div className="mb-4 bg-slate-950/80 border border-amber-300/30 rounded-2xl p-3.5 sm:p-4 shadow-inner">
        <div className="flex items-center gap-1.5 text-amber-300 font-jua text-xs sm:text-sm mb-1">
          <span>📜 [상황 및 사례 원문]</span>
          <span className="text-amber-100 font-bold">{question.caseTitle}</span>
        </div>
        <p className="text-sm sm:text-base font-noto text-slate-200 leading-relaxed font-medium">
          "{question.caseStory}"
        </p>
      </div>

      {/* Question Prompt */}
      <div className="mb-4">
        <h3 className="text-sm sm:text-base font-jua text-amber-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{question.prompt}</span>
        </h3>
      </div>

      {/* Attempt Status Banner */}
      {attempts === 1 && !isSolved && (
        <div className="mb-3 px-3 py-2 bg-amber-500/20 border border-amber-500/50 rounded-xl flex items-center gap-2 text-xs font-jua text-amber-300 animate-pulse">
          <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
          <span>틀렸습니다! 한 번 더 풀어볼 기회가 주어집니다. 신중하게 다시 선택해보세요! (남은 기회: 1회)</span>
        </div>
      )}

      {isSecondFailure && (
        <div className="mb-3 px-3 py-2 bg-rose-950/70 border border-rose-500/60 rounded-xl text-xs text-rose-200 font-noto flex items-start gap-2">
          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-jua text-rose-300 text-sm block">
              2번째 풀이도 틀렸습니다. 해설을 확인한 뒤 나중에 다시 도전할 수 있습니다!
            </span>
            <p className="mt-1 text-slate-200">
              <strong className="text-emerald-400">올바른 정답:</strong> {question.correctAnswer}
            </p>
            <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      )}

      {isSolved && (
        <div className="mb-3 px-3 py-2 bg-emerald-950/70 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 font-noto flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-jua text-emerald-300 text-sm block">정답입니다! 🎉</span>
            <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 mb-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedChoice === idx;
          const isWrong = wrongChoices.includes(idx);
          const isCorrect = isSolved && idx === question.correctIndex;
          const isRevealedCorrect = isSecondFailure && idx === question.correctIndex;

          let btnClass = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-amber-400/50';

          if (isCorrect || isRevealedCorrect) {
            btnClass = 'bg-emerald-900/60 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)]';
          } else if (isWrong) {
            btnClass = 'bg-rose-950/50 border-rose-600/70 text-rose-300 line-through opacity-70';
          } else if (isSelected) {
            btnClass = 'bg-amber-900/40 border-amber-400 text-amber-200 font-bold';
          }

          return (
            <button
              key={idx}
              disabled={!canSelect || isWrong}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-3.5 sm:p-4 md:p-4.5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between text-xs sm:text-sm md:text-base font-noto min-h-[48px] touch-manipulation active:scale-[0.99] select-none ${btnClass} ${
                canSelect && !isWrong ? 'cursor-pointer hover:scale-[1.01]' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-3.5">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-xs sm:text-sm font-jua text-amber-300 shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{option}</span>
              </div>

              {isCorrect && <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />}
              {isRevealedCorrect && !isSolved && <span className="text-[11px] sm:text-xs font-jua text-emerald-400">정답</span>}
              {isWrong && <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Next Button if 2nd Failure */}
      {isSecondFailure && (
        <button
          onClick={onNextQuestion}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-jua text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition active:scale-98 font-bold"
        >
          <span>다음 문제로 넘어가기 (나중에 재도전)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
