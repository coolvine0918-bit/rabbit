import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, VolumeX, FileSpreadsheet, RotateCcw, Award, Sparkles, Flame, Zap } from 'lucide-react';
import { QuizQuestion, StudentInfo, GiftItem, RabbitEvolutionLevel } from './types';
import { generateAllQuestions } from './data/cases';
import { getRandomGift } from './data/gifts';
import { sound } from './utils/audio';
import { ChuseokBackground } from './components/ChuseokBackground';
import { RabbitAvatar, RabbitMood } from './components/RabbitAvatar';
import { GameTimer } from './components/GameTimer';
import { StudentEntryModal } from './components/StudentEntryModal';
import { QuizCard } from './components/QuizCard';
import { RewardModal } from './components/RewardModal';
import { GameOverModal } from './components/GameOverModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';

// Hardcoded Google Spreadsheet ID as requested
const SPREADSHEET_ID = '1uyrh0lvlOjmmjTz2cy1SGjXPKOZ1D9ELEZzrHEqvUkY';

export default function App() {
  // Game Lifecycle States
  const [gameState, setGameState] = useState<'ENTRY' | 'PLAYING' | 'REWARD' | 'GAME_OVER'>('ENTRY');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // Questions & Navigation
  const [questionQueue, setQuestionQueue] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [retryQueue, setRetryQueue] = useState<QuizQuestion[]>([]);

  // Current Question State
  const [attempts, setAttempts] = useState<number>(0); // 0: none, 1: 1st fail, 2: 2nd fail
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);

  // Game Gamification: Combo & Fever System
  const [comboCount, setComboCount] = useState<number>(0);
  const [isFever, setIsFever] = useState<boolean>(false);
  const [feverTimer, setFeverTimer] = useState<number>(0);

  // Performance & Inventory
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [collectedGifts, setCollectedGifts] = useState<GiftItem[]>([]);

  // Rabbit Learner Avatar Evolution State (Lv 1 ~ Lv 4)
  const [evolutionLevel, setEvolutionLevel] = useState<RabbitEvolutionLevel>(1);
  const [rabbitMood, setRabbitMood] = useState<RabbitMood>('idle');
  const [rabbitSpeech, setRabbitSpeech] = useState<string>('안녕! 헌법 기본권을 함께 배워보자!');

  // Sound & Modals
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);

  // Initialize Questions
  useEffect(() => {
    const all = generateAllQuestions();
    setQuestionQueue(all);
  }, []);

  // Check and apply Evolution Level based on score and gifts
  useEffect(() => {
    let nextLevel: RabbitEvolutionLevel = 1;
    if (score >= 1200 || collectedGifts.length >= 8) {
      nextLevel = 4; // 전설의 헌법 수호신
    } else if (score >= 700 || collectedGifts.length >= 5) {
      nextLevel = 3; // 만물상 옥토끼 (갓 & 복주머니)
    } else if (score >= 300 || collectedGifts.length >= 2) {
      nextLevel = 2; // 색동 도령 토끼 (색동 조끼)
    }

    if (nextLevel > evolutionLevel) {
      sound.playLevelUp();
      setEvolutionLevel(nextLevel);
      setRabbitMood('correct');
      const titles = [
        '',
        '아기 달토끼',
        '색동 도령 토끼',
        '만물상 옥토끼',
        '전설의 헌법 수호신 토끼',
      ];
      setRabbitSpeech(`우와! 칭호 진화! [${titles[nextLevel]}] 달성! 👑✨`);
    }
  }, [score, collectedGifts.length, evolutionLevel]);

  // Fever Countdown Timer
  useEffect(() => {
    if (!isFever) return;
    const timer = setInterval(() => {
      setFeverTimer((prev) => {
        if (prev <= 1) {
          setIsFever(false);
          setRabbitSpeech('피버 타임 종료! 계속해서 콤보를 이어가 봐요!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFever]);

  const currentQuestion: QuizQuestion | undefined = useMemo(() => {
    if (currentIndex < questionQueue.length) {
      return questionQueue[currentIndex];
    }
    if (retryQueue.length > 0) {
      return retryQueue[0];
    }
    return undefined;
  }, [questionQueue, currentIndex, retryQueue]);

  // Start Game
  const handleStartGame = (info: StudentInfo) => {
    setStudentInfo(info);
    setGameState('PLAYING');
    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCollectedGifts([]);
    setCurrentIndex(0);
    setRetryQueue([]);
    setAttempts(0);
    setIsSolved(false);
    setSelectedChoice(null);
    setWrongChoices([]);
    setComboCount(0);
    setIsFever(false);
    setEvolutionLevel(1);
    setRabbitMood('idle');
    setRabbitSpeech(`${info.name} 학습자님, 화이팅! 5분 동안 토끼를 진화시키고 선물을 모아봐요!`);
  };

  // Option Selected
  const handleSelectOption = (idx: number) => {
    if (!currentQuestion || isSolved || attempts >= 2) return;
    setSelectedChoice(idx);

    if (idx === currentQuestion.correctIndex) {
      // Correct!
      setIsSolved(true);
      setCorrectCount((prev) => prev + 1);

      // Streak / Combo calculation
      const nextCombo = comboCount + 1;
      setComboCount(nextCombo);

      // Multiplier logic
      let multiplier = 1.0;
      if (isFever) {
        multiplier = 2.0;
      } else if (nextCombo >= 5) {
        multiplier = 2.0;
      } else if (nextCombo >= 3) {
        multiplier = 1.5;
      } else if (nextCombo >= 2) {
        multiplier = 1.2;
      }

      // Check for Fever Mode Activation (at 4 consecutive hits or during fever)
      if (nextCombo === 4 && !isFever) {
        setIsFever(true);
        setFeverTimer(18); // 18 seconds fever
        sound.playFever();
        setRabbitSpeech('🔥 FEVER TIME 발동! 18초간 모든 점수 & 수확 보너스 2배 폭발! 🔥');
      } else {
        sound.playCombo(nextCombo);
      }

      const baseScore = attempts === 0 ? 100 : 70;
      const finalScore = Math.round(baseScore * multiplier);
      setScore((prev) => prev + finalScore);

      setRabbitMood('correct');
      if (nextCombo >= 3) {
        setRabbitSpeech(`대단해요! ${nextCombo}연속 정답! (+${finalScore}점, ${multiplier}배 배율)`);
      } else {
        setRabbitSpeech(`와, 정답이에요! (+${finalScore}점) 감을 따거나 선물 꾸러미를 열어보세요!`);
      }

      // Open reward modal or allow clicking directly on tree/gift box
      setGameState('REWARD');
    } else {
      // Incorrect
      sound.playWrong();
      setIncorrectCount((prev) => prev + 1);
      setWrongChoices((prev) => [...prev, idx]);
      // Reset combo streak upon wrong attempt
      setComboCount(0);

      if (attempts === 0) {
        // First wrong attempt -> Give 1 more chance
        setAttempts(1);
        setRabbitMood('wrong-first');
        setRabbitSpeech('앗, 아쉬워요! 콤보가 리셋되었지만 한 번 더 신중하게 골라보세요! 🥕');
      } else {
        // Second wrong attempt -> Show explanation and queue for retry
        setAttempts(2);
        setRabbitMood('wrong-second');
        setRabbitSpeech('괜찮아요! 해설을 확인하고 나중에 다시 풀어봐요!');
        // Queue this question to retry queue
        setRetryQueue((prev) => {
          if (!prev.some((q) => q.id === currentQuestion.id)) {
            return [...prev, currentQuestion];
          }
          return prev;
        });
      }
    }
  };

  // Claim Reward (from modal or by clicking persimmon/gift box)
  const handleClaimReward = (gift: GiftItem) => {
    const giftPoints = isFever ? gift.points * 2 : gift.points;
    setCollectedGifts((prev) => [gift, ...prev]);
    setScore((prev) => prev + giftPoints);
    setRabbitMood('harvesting');
    setRabbitSpeech(`우와! [${gift.name}] 획득! (+${giftPoints}점)`);

    setTimeout(() => {
      moveToNextQuestion();
    }, 450);
  };

  // Advance to Next Question
  const moveToNextQuestion = useCallback(() => {
    setAttempts(0);
    setIsSolved(false);
    setSelectedChoice(null);
    setWrongChoices([]);
    setRabbitMood(isFever ? 'fever' : 'idle');
    setGameState('PLAYING');

    if (currentIndex + 1 < questionQueue.length) {
      setCurrentIndex((prev) => prev + 1);
      if (isFever) {
        setRabbitSpeech('⚡ 피버 타임 질주! 다음 문제도 빠르게 풀어봐요!');
      } else {
        setRabbitSpeech('다음 사례를 꼼꼼히 읽어보세요!');
      }
    } else if (retryQueue.length > 0) {
      setRetryQueue((prev) => prev.slice(1));
      setRabbitSpeech('이전에 아쉽게 틀렸던 문제를 다시 정복해볼까요?');
    } else {
      const reshuffled = generateAllQuestions();
      setQuestionQueue(reshuffled);
      setCurrentIndex(0);
      setRabbitSpeech('새로운 보너스 라운드 도전!');
    }
  }, [currentIndex, questionQueue.length, retryQueue, isFever]);

  // Timer Finished (5 minutes)
  const handleTimeUp = useCallback(() => {
    setGameState('GAME_OVER');
    setRabbitMood('idle');
    setIsFever(false);
    setRabbitSpeech('5분 경과! 정말 멋지게 문제를 해결했어요!');
  }, []);

  // Audio Toggle
  const toggleAudio = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className={`relative w-full min-h-screen bg-[#070d24] text-slate-100 font-sans overflow-x-hidden flex flex-col justify-between select-none transition-colors duration-500 ${
      isFever ? 'bg-gradient-to-b from-[#1b091f] via-[#2a0e2d] to-[#12081f]' : ''
    }`}>
      {/* Visual Chuseok Artwork Background */}
      <ChuseokBackground
        onPickPersimmon={() => {
          if (gameState === 'REWARD') {
            handleClaimReward(getRandomGift('persimmon'));
          }
        }}
        onOpenGiftBox={() => {
          if (gameState === 'REWARD') {
            handleClaimReward(getRandomGift('box'));
          }
        }}
        canClaimReward={gameState === 'REWARD'}
      />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-lg sm:text-xl shadow">
            {evolutionLevel === 4 ? '👑' : evolutionLevel === 3 ? '✨' : '🌕'}
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-jua text-amber-300 tracking-tight flex items-center gap-1.5">
              <span>기본권 지킴이 달토끼의 추석 선물 대작전</span>
              {isFever && (
                <span className="px-2 py-0.5 bg-rose-600 text-amber-200 rounded-full text-xs font-jua animate-pulse flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>FEVER {feverTimer}s</span>
                </span>
              )}
            </h1>
            {studentInfo && (
              <p className="text-[11px] text-slate-300 font-noto">
                학번: <span className="text-amber-200 font-bold">{studentInfo.studentId}</span> | 이름:{' '}
                <span className="text-amber-200 font-bold">{studentInfo.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Google Sheet Direct Status Button */}
          <button
            onClick={() => setIsSheetModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/60 text-emerald-200 rounded-xl font-jua text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            title="구글 시트 연동 기록 확인"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">구글 시트 기록</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-300 hover:text-amber-400 transition cursor-pointer"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Playing View */}
      <main className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-2 flex-1 flex flex-col items-center justify-center">
        {gameState !== 'ENTRY' && currentQuestion && (
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-4 sm:gap-5 md:gap-6 my-auto">
            {/* Left / Center: The Question Card with Combo & Screen Shake */}
            <div className="w-full md:flex-1 max-w-2xl">
              <QuizCard
                question={currentQuestion}
                questionIndex={currentIndex}
                totalQuestions={questionQueue.length}
                attempts={attempts}
                isSolved={isSolved}
                selectedChoice={selectedChoice}
                wrongChoices={wrongChoices}
                onSelectOption={handleSelectOption}
                onNextQuestion={moveToNextQuestion}
                comboCount={comboCount}
                isFever={isFever}
              />
            </div>

            {/* Right Side: Prominent 5-Minute Timer and Score Panel */}
            <div className="w-full md:w-60 lg:w-64 flex flex-row md:flex-col items-stretch justify-between gap-3 shrink-0">
              {/* Prominent 5-Minute Timer as requested */}
              <GameTimer
                initialSeconds={300}
                isRunning={gameState === 'PLAYING' || gameState === 'REWARD'}
                onTimeUp={handleTimeUp}
              />

              {/* Live Score & Gifts Pocket with Level Evolution status */}
              <div className="flex-1 lg:flex-none bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-jua text-slate-400">현재 점수</span>
                  <span className="text-base sm:text-lg font-jua text-amber-300 font-bold">
                    {score.toLocaleString()}점
                  </span>
                </div>

                {/* Combo & Multiplier Status */}
                <div className="flex items-center justify-between text-xs font-noto">
                  <span className="text-slate-400">연속 콤보</span>
                  <span className="font-jua text-rose-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 inline text-rose-500" />
                    <span>{comboCount}연타</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-noto">
                  <span className="text-slate-400">맞힌 문제</span>
                  <span className="text-emerald-400 font-bold font-jua">{correctCount}개</span>
                </div>

                <div className="flex items-center justify-between text-xs font-noto">
                  <span className="text-slate-400">수확한 선물</span>
                  <span className="text-orange-400 font-bold font-jua">{collectedGifts.length}개</span>
                </div>

                {/* Evolution Progress Bar */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-jua text-slate-300 mb-1">
                    <span>토끼 성장 진화</span>
                    <span className="text-amber-400">Lv.{evolutionLevel}/4</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (score / 1200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Gift Icons preview row */}
                {collectedGifts.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-1 overflow-x-auto">
                    {collectedGifts.slice(0, 5).map((g, i) => (
                      <span key={i} title={g.name} className="text-lg">
                        {g.icon}
                      </span>
                    ))}
                    {collectedGifts.length > 5 && (
                      <span className="text-[10px] text-slate-400 font-jua">
                        +{collectedGifts.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Section: Rabbit Learner Avatar on the Wall */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 pb-2 pt-0 flex items-end justify-between pointer-events-none">
        {/* Left Side: Hints or Chuseok Greetings */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/70 px-3 py-1.5 rounded-full text-xs text-amber-200/90 font-jua shadow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>헌법 제37조 제2항: 기본권은 국가안전보장·질서유지·공공복리를 위해 법률로써 제한</span>
        </div>

        {/* Right Side: The Rabbit Avatar Sitting on the Wall with Level Evolution */}
        <div className="ml-auto pointer-events-auto">
          <RabbitAvatar
            mood={rabbitMood}
            speechText={rabbitSpeech}
            evolutionLevel={evolutionLevel}
            comboCount={comboCount}
            isFever={isFever}
            onPersimmonClick={() => {
              if (gameState === 'REWARD') {
                handleClaimReward(getRandomGift('persimmon'));
              }
            }}
            canClaimReward={gameState === 'REWARD'}
          />
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Student Entry Screen */}
      {gameState === 'ENTRY' && (
        <StudentEntryModal
          onStartGame={handleStartGame}
          spreadsheetId={SPREADSHEET_ID}
        />
      )}

      {/* 2. Reward Selection Modal with Interactive Tactile Picking */}
      {gameState === 'REWARD' && (
        <RewardModal
          onClaimReward={handleClaimReward}
          comboCount={comboCount}
          isFever={isFever}
        />
      )}

      {/* 3. Game Over & Google Sheets Sync Screen */}
      {gameState === 'GAME_OVER' && studentInfo && (
        <GameOverModal
          student={studentInfo}
          score={score}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          gifts={collectedGifts}
          spreadsheetId={SPREADSHEET_ID}
          onPlayAgain={() => {
            setGameState('PLAYING');
            setScore(0);
            setCorrectCount(0);
            setIncorrectCount(0);
            setCollectedGifts([]);
            setCurrentIndex(0);
            setRetryQueue([]);
            setAttempts(0);
            setIsSolved(false);
            setSelectedChoice(null);
            setWrongChoices([]);
            setComboCount(0);
            setIsFever(false);
            setEvolutionLevel(1);
            setRabbitMood('idle');
            setRabbitSpeech('새로운 5분 도전 시작! 이번에도 힘내봐요!');
          }}
        />
      )}

      {/* 4. Google Sheet Inspector & Teacher Setup Modal */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        spreadsheetId={SPREADSHEET_ID}
      />
    </div>
  );
}
