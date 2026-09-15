// Google Apps Script Web App Endpoint for real-time spreadsheet synchronization
export const GOOGLE_SHEET_ID = '1uyrh0lvlOjmmjTz2cy1SGjXPKOZ1D9ELEZzrHEqvUkY';
export const GOOGLE_APPS_SCRIPT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycby0ZXneLcA_tmP2YTj455_GBYZylrsYLKrLKAIccuDom6KdxUWSry-0zANwudjoEyTTfw/exec';

export interface RecordPayload {
  studentId: string;
  name: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  giftsCount: number;
  giftsList: string[];
  timestamp?: string;
}

/**
 * Sends student game record directly to Google Apps Script Web App.
 * Uses mode: 'no-cors' option or standard POST to ensure it never gets blocked
 * by CORS in browser environments while executing in Google Sheets.
 */
export async function sendRecordToGoogleSheet(payload: RecordPayload): Promise<boolean> {
  const finalPayload = {
    ...payload,
    timestamp: payload.timestamp || new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
  };

  try {
    // 1. Try standard text/plain POST (Google Apps Script handles text/plain without CORS preflight issues)
    await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(finalPayload),
      mode: 'no-cors', // Essential for Google Apps Script redirects across different origins
    });
    return true;
  } catch (err) {
    console.warn('Direct Google Sheet submission error:', err);
    return false;
  }
}
