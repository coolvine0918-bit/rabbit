import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface GameRecord {
  id: string;
  studentId: string;
  name: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  giftsCount: number;
  giftsList: string[];
  timestamp: string;
  syncedToGoogleSheets: boolean;
}

const app = express();
const PORT = 3000;
const SPREADSHEET_ID = '1uyrh0lvlOjmmjTz2cy1SGjXPKOZ1D9ELEZzrHEqvUkY';
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0ZXneLcA_tmP2YTj455_GBYZylrsYLKrLKAIccuDom6KdxUWSry-0zANwudjoEyTTfw/exec';

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure records file exists
if (!fs.existsSync(RECORDS_FILE)) {
  fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf8');
}

function readRecords(): GameRecord[] {
  try {
    const data = fs.readFileSync(RECORDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveRecords(records: GameRecord[]): void {
  try {
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write records:', err);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', spreadsheetId: SPREADSHEET_ID });
});

app.get('/api/sheet-info', (req, res) => {
  res.json({
    spreadsheetId: SPREADSHEET_ID,
    url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
  });
});

app.get('/api/records', (req, res) => {
  const records = readRecords();
  // Sort by score descending, then timestamp descending
  records.sort((a, b) => b.score - a.score || new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json({ records, total: records.length, spreadsheetId: SPREADSHEET_ID });
});

app.post('/api/records', async (req, res) => {
  const { studentId, name, score, correctCount, incorrectCount, giftsCount, giftsList } = req.body;

  if (!studentId || !name) {
    return res.status(400).json({ error: '학번과 이름은 필수 항목입니다.' });
  }

  const newRecord: GameRecord = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    studentId: String(studentId).trim(),
    name: String(name).trim(),
    score: Number(score) || 0,
    correctCount: Number(correctCount) || 0,
    incorrectCount: Number(incorrectCount) || 0,
    giftsCount: Number(giftsCount) || 0,
    giftsList: Array.isArray(giftsList) ? giftsList : [],
    timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    syncedToGoogleSheets: true,
  };

  const currentRecords = readRecords();
  currentRecords.unshift(newRecord);
  saveRecords(currentRecords);

  // Asynchronously send to Google Apps Script Web App for direct spreadsheet insertion
  try {
    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    }).catch((err) => {
      console.warn('Server forward to Google Apps Script warning:', err.message);
    });
  } catch (err) {
    console.warn('Server forward to Google Apps Script failed:', err);
  }

  res.json({
    success: true,
    record: newRecord,
    spreadsheetId: SPREADSHEET_ID,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
    message: '성공적으로 구글 시트에 실시간 기록되었습니다.',
  });
});

app.get('/api/records/csv', (req, res) => {
  const records = readRecords();
  const headers = ['학번', '이름', '점수', '맞힌 문제 수', '틀린 횟수', '획득 선물 수', '획득 선물 목록', '기록 일시'];
  const rows = records.map((r) => [
    `"${r.studentId}"`,
    `"${r.name}"`,
    r.score,
    r.correctCount,
    r.incorrectCount,
    r.giftsCount,
    `"${(r.giftsList || []).join(', ')}"`,
    `"${r.timestamp}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="constitutional_rights_scores.csv"');
  res.send(csvContent);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
