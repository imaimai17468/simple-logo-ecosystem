import type { IconHistory } from "@/entities/icon";

const HISTORY_STORAGE_KEY = "icon_generation_history";

export function loadHistoryFromStorage(): IconHistory[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved) as IconHistory[];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
}
