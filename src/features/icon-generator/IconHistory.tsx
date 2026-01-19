"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { IconHistory as IconHistoryType } from "@/entities/icon";

interface Props {
  onSelect: (history: IconHistoryType) => void;
}

const HISTORY_STORAGE_KEY = "icon_generation_history";
const MAX_HISTORY = 10;

export function IconHistory({ onSelect }: Props) {
  const [history, setHistory] = useState<IconHistoryType[]>([]);

  const loadHistory = useCallback(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as IconHistoryType[];
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    loadHistory();

    // カスタムイベントをリスンして履歴を自動リロード
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener("icon-history-updated", handleHistoryUpdate);

    return () => {
      window.removeEventListener("icon-history-updated", handleHistoryUpdate);
    };
  }, [loadHistory]);

  const handleDelete = (id: string) => {
    const newHistory = history.filter((h) => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  };

  const handleClearAll = () => {
    if (confirm("すべての履歴を削除しますか？")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">生成履歴</h3>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          すべて削除
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {history.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 rounded border p-3">
            <button
              type="button"
              className="flex flex-col gap-2 transition-opacity hover:opacity-80"
              onClick={() => onSelect(item)}
            >
              <Image
                src={`data:${item.icon.mimeType};base64,${item.icon.base64}`}
                alt={item.prompt}
                width={100}
                height={100}
                className="aspect-square w-full rounded border object-cover"
                unoptimized
              />
              <p className="line-clamp-2 text-left text-gray-600 text-xs">
                {item.prompt}
              </p>
              <p className="text-left text-gray-400 text-xs">
                {new Date(item.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(item.id)}
            >
              削除
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 履歴に追加するユーティリティ関数
export function addToHistory(
  prompt: string,
  icon: { base64: string; mimeType: string },
) {
  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  let history: IconHistoryType[] = [];

  if (saved) {
    try {
      history = JSON.parse(saved) as IconHistoryType[];
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }

  const newItem: IconHistoryType = {
    id: crypto.randomUUID(),
    prompt,
    icon,
    createdAt: new Date().toISOString(),
  };

  history.unshift(newItem);

  // 最大件数を超えたら古いものを削除
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

  // カスタムイベントを発火して他のコンポーネントに通知
  window.dispatchEvent(new Event("icon-history-updated"));
}
