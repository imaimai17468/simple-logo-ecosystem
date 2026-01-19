import type { IconHistory } from "@/entities/icon";

const HISTORY_STORAGE_KEY = "icon_generation_history";

export function deleteHistoryItem(
  history: IconHistory[],
  id: string,
): IconHistory[] {
  return history.filter((h) => h.id !== id);
}

export function saveHistoryToStorage(history: IconHistory[]): void {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}
