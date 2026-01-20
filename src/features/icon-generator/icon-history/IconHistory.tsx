"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { IconHistory as IconHistoryType } from "@/entities/icon";
import { deleteHistoryItem, saveHistoryToStorage } from "./deleteHistoryItem";
import { loadHistoryFromStorage } from "./loadHistoryFromStorage";

interface Props {
  onSelect: (history: IconHistoryType) => void;
}

const HISTORY_STORAGE_KEY = "icon_generation_history";

export function IconHistory({ onSelect }: Props) {
  const [history, setHistory] = useState<IconHistoryType[]>(() =>
    loadHistoryFromStorage(),
  );

  useEffect(() => {
    const handleHistoryUpdate = () => {
      setHistory(loadHistoryFromStorage());
    };

    window.addEventListener("icon-history-updated", handleHistoryUpdate);

    return () => {
      window.removeEventListener("icon-history-updated", handleHistoryUpdate);
    };
  }, []);

  const handleDelete = (id: string) => {
    const newHistory = deleteHistoryItem(history, id);
    setHistory(newHistory);
    saveHistoryToStorage(newHistory);
  };

  const handleClearAll = () => {
    if (confirm("すべての履歴を削除しますか？")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">生成履歴</h3>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            すべて削除
          </Button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-purple-200 border-dashed bg-purple-50/30 px-6 py-12 text-center dark:border-purple-800 dark:bg-purple-950/30">
          <svg
            className="mb-4 h-12 w-12 text-purple-300 dark:text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>履歴なし</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mb-2 font-medium text-purple-900 dark:text-purple-100">
            まだ履歴がありません
          </p>
          <p className="text-purple-600 text-sm dark:text-purple-300">
            アイコンを生成すると、ここに履歴が表示されます
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col gap-2 rounded-lg border border-purple-100 bg-white p-3 transition-all hover:border-purple-300 hover:shadow-md"
            >
              <button
                type="button"
                className="flex flex-col gap-2 transition-transform hover:scale-[1.02]"
                onClick={() => onSelect(item)}
              >
                <Image
                  src={`data:${item.icon.mimeType};base64,${item.icon.base64}`}
                  alt={item.prompt}
                  width={80}
                  height={80}
                  className="aspect-square w-full border object-cover"
                  style={{ borderRadius: "22.37%" }}
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
                className="text-purple-600 hover:text-purple-700"
              >
                削除
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
