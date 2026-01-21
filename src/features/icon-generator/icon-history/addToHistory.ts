import type { IconHistory } from "@/entities/icon";

const HISTORY_STORAGE_KEY = "icon_generation_history";
const MAX_HISTORY = 10;

/**
 * 画像データのサイズを推定（バイト単位）
 */
function estimateBase64Size(base64: string): number {
  // Base64 は 4文字で3バイトを表現するため、文字数 * 0.75 でバイト数を推定
  return Math.ceil((base64.length * 3) / 4);
}

/**
 * 履歴全体のサイズを推定（バイト単位）
 */
function estimateHistorySize(history: IconHistory[]): number {
  return history.reduce((total, item) => {
    return total + estimateBase64Size(item.icon.base64);
  }, 0);
}

/**
 * 画像サイズが大きすぎるかチェック
 */
export function checkImageSize(base64: string): {
  isTooBig: boolean;
  sizeKB: number;
  sizeMB: number;
} {
  const bytes = estimateBase64Size(base64);
  const kb = bytes / 1024;
  const mb = bytes / (1024 * 1024);
  const MAX_SIZE_MB = 1.5; // 1.5MB を超えたら警告

  return {
    isTooBig: mb > MAX_SIZE_MB,
    sizeKB: Math.round(kb),
    sizeMB: parseFloat(mb.toFixed(2)),
  };
}

/**
 * localStorage の使用状況をチェック
 */
export function checkStorageAvailability(): {
  canStore: boolean;
  currentSizeKB: number;
  historyCount: number;
  estimatedAvailableKB: number;
} {
  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  let currentSize = 0;
  let historyCount = 0;

  if (saved) {
    currentSize = estimateBase64Size(saved);
    try {
      const history = JSON.parse(saved) as IconHistory[];
      historyCount = history.length;
    } catch {
      // パースエラーは無視
    }
  }

  const currentSizeKB = Math.round(currentSize / 1024);
  const MAX_STORAGE_KB = 4 * 1024; // 4MB（localStorage の制限を考慮）
  const TYPICAL_IMAGE_KB = 500; // 典型的な画像サイズの推定値
  const estimatedAvailableKB = MAX_STORAGE_KB - currentSizeKB;
  const canStore = estimatedAvailableKB > TYPICAL_IMAGE_KB;

  return {
    canStore,
    currentSizeKB,
    historyCount,
    estimatedAvailableKB,
  };
}

/**
 * 履歴をクリア
 */
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  window.dispatchEvent(new Event("icon-history-updated"));
}

export function addToHistory(
  prompt: string,
  icon: { base64: string; mimeType: string },
): void {
  // 画像サイズをチェック（大きすぎる場合は保存をスキップ）
  const sizeCheck = checkImageSize(icon.base64);
  if (sizeCheck.isTooBig) {
    return; // 保存をスキップ、エラーはスローしない
  }

  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  let history: IconHistory[] = [];

  if (saved) {
    try {
      history = JSON.parse(saved) as IconHistory[];
    } catch {
      // パースエラーは無視
    }
  }

  const newItem: IconHistory = {
    id: crypto.randomUUID(),
    prompt,
    icon,
    createdAt: new Date().toISOString(),
  };

  history.unshift(newItem);

  // localStorage の容量制限を考慮して、サイズベースで履歴を削減
  const MAX_SIZE = 4 * 1024 * 1024; // 4MB (localStorage の制限を考慮)

  while (history.length > 0 && estimateHistorySize(history) > MAX_SIZE) {
    // 最も古い項目を削除
    history.pop();
  }

  // それでも多すぎる場合は、件数でも制限
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event("icon-history-updated"));
  } catch (e) {
    // localStorage の容量制限エラーの場合、さらに履歴を削減
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      // 最新の1件のみ保存を試みる
      const singleItemHistory = [newItem];
      try {
        localStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(singleItemHistory),
        );
        window.dispatchEvent(new Event("icon-history-updated"));
      } catch (retryError) {
        // 1件でも保存できない場合は、履歴保存をスキップ
        console.error(
          "Cannot save even a single item, disabling history:",
          retryError,
        );
        // エラーをスローせず、ユーザーはアイコンを使用できる
      }
    } else {
      console.error("Failed to save history:", e);
    }
    // エラーの場合もスローせず、履歴保存をスキップ
  }
}
