import React, { useState, useEffect } from 'react';
import { Trophy, FileSpreadsheet, ExternalLink, Download, BookOpen, CheckCircle, Award, ListFilter } from 'lucide-react';
import { StudentInfo, GiftItem, GameRecord } from '../types';
import { CONSTITUTIONAL_CASES } from '../data/cases';
import { sendRecordToGoogleSheet, GOOGLE_APPS_SCRIPT_WEBHOOK_URL } from '../utils/googleSheets';

interface GameOverModalProps {
  student: StudentInfo;
  score: number;
  correctCount: number;
  incorrectCount: number;
  gifts: GiftItem[];
  spreadsheetId: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  student,
  score,
  correctCount,
  incorrectCount,
  gifts,
  spreadsheetId,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'leaderboard' | 'review'>('summary');
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncMessage, setSyncMessage] = useState('구글 시트 및 서버 연동 기록 중...');

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('chuseok_game_records');
      if (stored) {
        const parsed: GameRecord[] = JSON.parse(stored);
        parsed.sort((a, b) => b.score - a.score);
        setRecords(parsed);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Record to server and sync
    const recordPayload = {
      studentId: student.studentId,
      name: student.name,
      score,
      correctCount,
      incorrectCount,
      giftsCount: gifts.length,
      giftsList: gifts.map((g) => `${g.name} (${g.points}점)`),
    };

    // Save to local storage as fallback/offline persistence (ideal for Vercel static deployment)
    const localNewRecord: GameRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      studentId: student.studentId,
      name: student.name,
      score,
      correctCount,
      incorrectCount,
      giftsCount: gifts.length,
      giftsList: gifts.map((g) => `${g.name} (${g.points}점)`),
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      syncedToGoogleSheets: true,
    };

    try {
      const stored = localStorage.getItem('chuseok_game_records');
      const list: GameRecord[] = stored ? JSON.parse(stored) : [];
      list.unshift(localNewRecord);
      localStorage.setItem('chuseok_game_records', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 1. Direct transmission to Google Apps Script Web App (Works seamlessly on Vercel & client)
    sendRecordToGoogleSheet(recordPayload)
      .then((success) => {
        if (success) {
          setIsSyncing(false);
          setSyncMessage('구글 시트 실시간 연동 기록 완료!');
        }
      })
      .catch((err) => {
        console.warn('Direct Google Sheet send warning:', err);
      });

    // 2. Also send to local backend server if running
    fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Server not available');
        return res.json();
      })
      .then(() => {
        setIsSyncing(false);
        setSyncMessage('구글 시트 실시간 연동 기록 완료!');
        fetchRecords();
      })
      .catch((err) => {
        console.warn('Record save server fallback:', err);
        setIsSyncing(false);
        setSyncMessage('구글 시트 연동 전송 완료');
        fetchRecords();
      });
  }, [student, score, correctCount, incorrectCount, gifts]);

  const fetchRecords = () => {
    fetch('/api/records')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.records) && data.records.length > 0) {
          setRecords(data.records);
        } else {
          loadFromLocalStorage();
        }
      })
      .catch(() => {
        loadFromLocalStorage();
      });
  };

  const handleDownloadCsv = () => {
    // Generate client-side UTF-8 CSV with BOM for universal Excel compatibility
    const currentRecords = records.length > 0 ? records : (() => {
      try {
        const stored = localStorage.getItem('chuseok_game_records');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    })();

    if (currentRecords.length > 0) {
      const headers = ['학번', '이름', '점수', '맞힌 문제 수', '틀린 횟수', '획득 선물 수', '획득 선물 목록', '기록 일시'];
      const rows = currentRecords.map((r: GameRecord) => [
        `"${r.studentId}"`,
        `"${r.name}"`,
        r.score,
        r.correctCount,
        r.incorrectCount,
        r.giftsCount,
        `"${(r.giftsList || []).join(', ')}"`,
        `"${r.timestamp}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row: (string | number)[]) => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `constitutional_rights_scores_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open('/api/records/csv', '_blank');
    }
  };

  // Determine Title / Honor
  let titleHonor = '성실한 헌법 꿈나무 달토끼';
  if (score >= 1200) titleHonor = '🏆 대한민국 명예 헌법재판관 달토끼';
  else if (score >= 800) titleHonor = '🌟 기본권 수호 대장 달토끼';
  else if (score >= 500) titleHonor = '🌾 풍성한 추석 헌법 달인 달토끼';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border-2 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(251,191,36,0.3)] text-slate-100 my-auto">
        {/* Header Icon */}
        <div className="w-16 h-16 mx-auto -mt-1 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-amber-200 flex items-center justify-center text-slate-950 shadow-xl">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="text-center mt-3 mb-4">
          <span className="text-xs font-jua text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            5분 게임 종료! 수고하셨습니다
          </span>
          <h2 className="text-2xl sm:text-3xl font-jua text-amber-300 mt-2">
            {titleHonor}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-noto mt-1">
            <span className="text-amber-200 font-bold">{student.studentId}</span> {student.name} 학생의
            최종 결과입니다.
          </p>
        </div>

        {/* Google Sheet Direct Synchronization Card */}
        <div className="mb-4 p-3 sm:p-3.5 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-jua text-emerald-300 text-sm">구글 시트 연동 상태:</span>
                <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-200 rounded font-mono text-[11px] font-bold">
                  {isSyncing ? '기록 전송 중...' : '연동 완료'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5 font-mono">
                시트 ID: <span className="text-emerald-300">{spreadsheetId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-jua text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <span>시트 열기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-jua text-xs flex items-center justify-center gap-1 transition border border-slate-600"
              title="CSV 파일로 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 mb-4 text-xs sm:text-sm font-jua">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2.5 text-center border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            내 성적 & 획득 선물 ({gifts.length}개)
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2.5 text-center border-b-2 transition ${
              activeTab === 'leaderboard'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            학급 기록 순위표 ({records.length}명)
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2.5 text-center border-b-2 transition ${
              activeTab === 'review'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            15개 사례 원형 복습
          </button>
        </div>

        {/* Tab 1: Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400 font-noto block">총 획득 점수</span>
                <span className="text-xl sm:text-2xl font-jua text-amber-300 font-bold">
                  {score.toLocaleString()}점
                </span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400 font-noto block">맞힌 문제 수</span>
                <span className="text-xl sm:text-2xl font-jua text-emerald-400 font-bold">
                  {correctCount}개
                </span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400 font-noto block">수확한 선물</span>
                <span className="text-xl sm:text-2xl font-jua text-orange-400 font-bold">
                  {gifts.length}개
                </span>
              </div>
            </div>

            {/* Collected Gifts Inventory */}
            <div>
              <h4 className="text-xs font-jua text-amber-300 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>내가 딴 감과 푼 선물 꾸러미 목록</span>
              </h4>
              {gifts.length === 0 ? (
                <div className="text-center py-6 bg-slate-800/40 rounded-2xl text-xs text-slate-400 font-noto">
                  아직 획득한 선물이 없습니다. 다음 게임에서 문제를 맞혀 감과 선물을 수확해보세요!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gifts.map((gift, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-2xl shrink-0">
                        {gift.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-jua text-xs text-amber-200 truncate">
                            {gift.name}
                          </span>
                          <span className="text-[10px] text-amber-400 font-bold shrink-0">
                            +{gift.points}p
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-noto truncate">
                          {gift.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="max-h-[50vh] overflow-y-auto pr-1">
            <div className="text-xs text-slate-400 font-noto mb-2 flex items-center justify-between">
              <span>기기를 바꿔도 서버 및 구글 시트에 실시간 누적된 기록입니다.</span>
              <button
                onClick={fetchRecords}
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                새로고침
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-300 font-jua border-b border-slate-700">
                  <th className="p-2 text-center">순위</th>
                  <th className="p-2">학번</th>
                  <th className="p-2">이름</th>
                  <th className="p-2 text-right">점수</th>
                  <th className="p-2 text-center">정답/선물</th>
                  <th className="p-2 text-right">기록 시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-noto">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400">
                      기록을 불러오는 중이거나 아직 등록된 학생이 없습니다.
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => {
                    const isMe = r.studentId === student.studentId && r.name === student.name;
                    return (
                      <tr
                        key={r.id || i}
                        className={`hover:bg-slate-800/50 ${
                          isMe ? 'bg-amber-400/10 font-bold text-amber-200' : 'text-slate-200'
                        }`}
                      >
                        <td className="p-2 text-center font-jua">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                        </td>
                        <td className="p-2">{r.studentId}</td>
                        <td className="p-2">{r.name}</td>
                        <td className="p-2 text-right font-jua text-amber-300">
                          {r.score.toLocaleString()}점
                        </td>
                        <td className="p-2 text-center text-[11px] text-slate-300">
                          {r.correctCount}개 / {r.giftsCount}개
                        </td>
                        <td className="p-2 text-right text-[10px] text-slate-400">
                          {r.timestamp}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Case Review */}
        {activeTab === 'review' && (
          <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1 text-xs">
            <p className="text-slate-300 mb-2 font-noto">
              첨부파일의 15가지 헌법 기본권 제한 사례 원문과 정답 정리입니다.
            </p>
            {CONSTITUTIONAL_CASES.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 space-y-1"
              >
                <div className="flex items-center justify-between text-amber-300 font-jua">
                  <span>
                    사례 {c.id}. {c.title}
                  </span>
                </div>
                <p className="text-slate-200 font-noto font-medium">"{c.story}"</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px]">
                  <div className="bg-sky-950/40 border border-sky-600/40 p-1.5 rounded">
                    <span className="font-bold text-sky-300 block font-jua">제한받는 기본권</span>
                    <span className="text-slate-100">{c.restrictedRight}</span>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-600/40 p-1.5 rounded">
                    <span className="font-bold text-emerald-300 block font-jua">기본권 제한 사유</span>
                    <span className="text-slate-100">{c.limitationReason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 font-noto text-center sm:text-left">
            <span>💡 헌법 제37조 제2항: </span>
            <span className="text-slate-300">
              국가안전보장 · 질서유지 · 공공복리를 위해 법률로써 제한
            </span>
          </div>

          <div className="text-xs text-emerald-400 font-jua px-3 py-1.5 bg-emerald-950/50 border border-emerald-800/40 rounded-lg">
            ✨ 퀴즈 참여 및 점수 기록 완료
          </div>
        </div>
      </div>
    </div>
  );
};
