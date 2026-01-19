import type { IconHistory } from "@/entities/icon";

const HISTORY_STORAGE_KEY = "icon_generation_history";
const MAX_HISTORY = 10;

export function addToHistory(
  prompt: string,
  icon: { base64: string; mimeType: string },
): void {
  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  let history: IconHistory[] = [];

  if (saved) {
    try {
      history = JSON.parse(saved) as IconHistory[];
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }

  const newItem: IconHistory = {
    id: crypto.randomUUID(),
    prompt,
    icon,
    createdAt: new Date().toISOString(),
  };

  history.unshift(newItem);

  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  window.dispatchEvent(new Event("icon-history-updated"));
}
