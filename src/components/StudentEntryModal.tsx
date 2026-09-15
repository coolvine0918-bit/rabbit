import React, { useState } from 'react';
import { Sparkles, Award, Clock, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { StudentInfo } from '../types';

interface StudentEntryModalProps {
  onStartGame: (info: StudentInfo) => void;
  spreadsheetId: string;
}

export const StudentEntryModal: React.FC<StudentEntryModalProps> = ({
  onStartGame,
  spreadsheetId,
}) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('학번을 입력해주세요 (예: 20115, 3학년 2반 10번 등)');
      return;
    }
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setError('');
    onStartGame({
      studentId: studentId.trim(),
      name: name.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900/95 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(251,191,36,0.25)] text-slate-100 my-auto">
        {/* Decorative Top Accent */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-jua text-sm sm:text-base rounded-full shadow-lg flex items-center gap-1.5 border border-amber-200">
          <Sparkles className="w-4 h-4" />
          <span>한가위 헌법 탐험 퀴즈</span>
        </div>

        {/* Title */}
        <div className="text-center mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-jua text-amber-300 tracking-wide">
            기본권 지킴이 달토끼의 추석 선물 대작전
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-noto">
            사례를 읽고 침해된 기본권과 제한 사유를 맞혀 달토끼와 선물을 수확하세요!
          </p>
        </div>

        {/* Game Features Checklist */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center text-xs font-jua">
          <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex flex-col items-center">
            <Clock className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-amber-200">5분 타이머</span>
            <span className="text-[10px] text-slate-400">여유로운 탐색 퀴즈</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex flex-col items-center">
            <Award className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-amber-200">감 & 선물 꾸러미</span>
            <span className="text-[10px] text-slate-400">정답 시 보상 획득</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex flex-col items-center">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-emerald-300">구글 시트 연동</span>
            <span className="text-[10px] text-slate-400">점수 자동 기록</span>
          </div>
        </div>

        {/* Google Sheet Sync Notice */}
        <div className="mb-5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300">구글 시트 연동 주소: </span>
            <span className="font-mono text-emerald-100 bg-emerald-900/50 px-1.5 py-0.5 rounded select-all break-all">
              {spreadsheetId}
            </span>
            <p className="text-[11px] text-emerald-300/80 mt-1">
              어느 기기에서 플레이하든 학번, 이름, 최종 점수가 구글 시트에 바로 기록됩니다.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="student-id-input" className="block text-xs font-bold text-slate-300 mb-1 font-jua">
              학번 <span className="text-rose-400">*</span>
            </label>
            <input
              id="student-id-input"
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 30115 (3학년 1반 15번) 또는 2026101"
              className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-600 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition placeholder:text-slate-500"
            />
          </div>

          <div>
            <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-300 mb-1 font-jua">
              이름 <span className="text-rose-400">*</span>
            </label>
            <input
              id="student-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="학생 이름을 입력하세요 (예: 김하늘)"
              className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-600 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/50 border border-rose-800 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="start-game-btn"
            type="submit"
            className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-jua text-base sm:text-lg rounded-2xl shadow-xl hover:brightness-105 active:scale-[0.98] transition cursor-pointer font-bold border-2 border-amber-200"
          >
            달토끼와 함께 3분 퀴즈 시작하기 🚀
          </button>
        </form>

        {/* Rule note */}
        <p className="mt-4 text-center text-[11px] text-slate-400 font-noto">
          💡 틀려도 1회 재도전 기회가 주어지며, 2회 오답인 문제는 해설을 학습한 후 다시 기회가 주어집니다!
        </p>
      </div>
    </div>
  );
};
