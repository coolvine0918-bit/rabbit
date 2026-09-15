import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, ExternalLink, Download, RefreshCw, X, CheckCircle, Copy, Code, Check } from 'lucide-react';
import { GameRecord } from '../types';
import { GOOGLE_APPS_SCRIPT_WEBHOOK_URL } from '../utils/googleSheets';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetId: string;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  spreadsheetId,
}) => {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);

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

  const fetchRecords = () => {
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appsScriptSnippet = `// [Google Apps Script 코드 - 스프레드시트 1uyrh0lvlOjmmjTz2cy1SGjXPKOZ1D9ELEZzrHEqvUkY 연동]
function doPost(e) {
  var sheet = SpreadsheetApp.openById("${spreadsheetId}").getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // 첫 행이 비어있으면 헤더 작성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["기록일시", "학번", "이름", "점수", "정답수", "틀린수", "획득선물수", "획득선물목록"]);
  }
  
  // 학생 기록 추가
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString(),
    data.studentId,
    data.name,
    data.score,
    data.correctCount,
    data.incorrectCount,
    data.giftsCount,
    (data.giftsList || []).join(", ")
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(appsScriptSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.25)] text-slate-100 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-jua text-emerald-300">
              구글 스프레드시트 실시간 기록 현황
            </h2>
            <p className="text-xs text-slate-400 font-noto">
              지정된 구글 시트 ID와 영구 연동되어 기기를 바꾸어도 모든 학생 기록이 안전하게 보존됩니다.
            </p>
          </div>
        </div>

        {/* Sheet Info Box */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-slate-400 text-[11px]">연동 상태:</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-jua text-[11px] border border-emerald-500/40">
                실시간 웹 앱 연동 중 (Apps Script)
              </span>
            </div>
            <span className="text-slate-400 block text-[11px]">구글 시트 ID:</span>
            <span className="font-mono text-emerald-300 font-bold select-all break-all text-xs sm:text-sm">
              {spreadsheetId}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-jua text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <span>구글 시트 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                const currentRecords = records.length > 0 ? records : (() => {
                  try {
                    const stored = localStorage.getItem('chuseok_game_records');
                    return stored ? JSON.parse(stored) : [];
                  } catch {
                    return [];
                  }
                })();
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
              }}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-jua text-xs flex items-center justify-center gap-1.5 transition border border-slate-600 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 백업</span>
            </button>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-jua text-slate-300">
              기록된 학생 수: <strong className="text-amber-400">{records.length}명</strong>
            </span>
            <button
              onClick={fetchRecords}
              disabled={loading}
              className="p-1 text-slate-400 hover:text-amber-400 transition"
              title="새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setShowScript(!showScript)}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-jua cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showScript ? '순위표 보기' : '선생님용 연동 Apps Script 확인'}</span>
          </button>
        </div>

        {/* Content View */}
        {showScript ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 mb-4 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-amber-300 font-jua">
                구글 스프레드시트 확장프로그램 &gt; Apps Script에 붙여넣을 코드
              </span>
              <button
                onClick={copyScript}
                className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded font-jua text-[11px] flex items-center gap-1 hover:bg-amber-300"
              >
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '복사됨!' : '스크립트 복사'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300 bg-slate-900 p-2.5 rounded-lg max-h-48">
              {appsScriptSnippet}
            </pre>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto border border-slate-700/80 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300 font-jua sticky top-0">
                <tr>
                  <th className="p-2.5 text-center">순위</th>
                  <th className="p-2.5">학번</th>
                  <th className="p-2.5">이름</th>
                  <th className="p-2.5 text-right">점수</th>
                  <th className="p-2.5 text-center">맞힌 개수</th>
                  <th className="p-2.5 text-center">선물 수</th>
                  <th className="p-2.5 text-right">기록 일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-noto">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      등록된 학생 기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-800/60 text-slate-200">
                      <td className="p-2.5 text-center font-jua text-amber-300">
                        {i === 0 ? '🥇 1' : i === 1 ? '🥈 2' : i === 2 ? '🥉 3' : i + 1}
                      </td>
                      <td className="p-2.5 font-mono">{r.studentId}</td>
                      <td className="p-2.5 font-bold">{r.name}</td>
                      <td className="p-2.5 text-right font-jua text-amber-300">
                        {r.score.toLocaleString()}점
                      </td>
                      <td className="p-2.5 text-center text-emerald-400 font-bold">{r.correctCount}</td>
                      <td className="p-2.5 text-center text-orange-400">{r.giftsCount}</td>
                      <td className="p-2.5 text-right text-[10px] text-slate-400">{r.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-jua text-xs transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
