"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GeneratedIcon } from "@/entities/icon";

interface Props {
  onGenerated: (icon: GeneratedIcon) => void;
}

const API_KEY_STORAGE_KEY = "gemini_api_key";

export function IconGeneratorForm({ onGenerated }: Props) {
  const apiKeyId = useId();
  const promptId = useId();
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LocalStorage からAPI Keyを読み込み
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // API Keyを保存
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim()) return;

    // API Keyを保存
    handleSaveApiKey();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-icon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (data.success && data.image) {
        onGenerated(data.image);
      } else {
        setError(data.error || "生成に失敗しました");
      }
    } catch (_err) {
      setError("エラーが発生しました");
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
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !apiKey.trim()}
      >
        {loading ? "生成中..." : "アイコンを生成"}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
