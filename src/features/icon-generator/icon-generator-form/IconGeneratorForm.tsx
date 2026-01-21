"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GeneratedIcon } from "@/entities/icon";
import {
  addToHistory,
  checkImageSize,
  checkStorageAvailability,
} from "../icon-history/addToHistory";

interface Props {
  onGenerated: (icon: GeneratedIcon, prompt: string) => void;
}

const API_KEY_STORAGE_KEY = "gemini_api_key";

export function IconGeneratorForm({ onGenerated }: Props) {
  const apiKeyId = useId();
  const promptId = useId();
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // API Keyを保存
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim()) return;

    // 生成前にストレージの空き容量をチェック
    const storage = checkStorageAvailability();
    if (!storage.canStore) {
      setWarning(
        `履歴の容量がいっぱいです（${storage.currentSizeKB}KB / ${storage.historyCount}件）。新しいアイコンを履歴に保存するには、古い履歴を削除してください。`,
      );
      // 容量不足でも生成は続行可能（履歴に保存されないだけ）
    }

    // API Keyを保存
    handleSaveApiKey();

    setLoading(true);
    setError(null);
    // 容量警告は残す（クリアボタンのため）

    try {
      const response = await fetch("/api/generate-icon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (data.success && data.image) {
        // 生成された画像のサイズをチェック
        const sizeCheck = checkImageSize(data.image.base64);

        // 画像が大きすぎる場合は警告を表示
        if (sizeCheck.isTooBig) {
          setWarning(
            `生成された画像が大きすぎるため、履歴に保存できませんでした (${sizeCheck.sizeMB}MB)。アイコンは正常に使用できますが、履歴には残りません。`,
          );
        }

        // 履歴に保存を試みる（大きすぎる場合は内部でスキップされる）
        addToHistory(prompt, data.image);

        // アイコンは必ず表示
        onGenerated(data.image, prompt);
      } else {
        setError(data.error || "生成に失敗しました");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "エラーが発生しました";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={apiKeyId}>
          Gemini API Key{" "}
          <a
            href="https://ai.google.dev/gemini-api/docs/api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm"
          >
            （取得方法）
          </a>
        </Label>
        <Input
          id={apiKeyId}
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          disabled={loading}
        />
        <p className="text-gray-500 text-xs">
          API Keyはブラウザにのみ保存され、外部に送信されません
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={promptId}>プロンプト</Label>
        <Input
          id={promptId}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: 青いロケットのアイコン"
          disabled={loading}
        />
      </div>

      <Button
        variant="gradient"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !apiKey.trim()}
      >
        {loading ? "生成中..." : "アイコンを生成"}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {warning && <p className="text-sm text-yellow-600">⚠️ {warning}</p>}
    </div>
  );
}
