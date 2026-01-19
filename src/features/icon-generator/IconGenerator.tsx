"use client";

import { useState } from "react";
import type {
  GeneratedIcon,
  IconHistory as IconHistoryType,
} from "@/entities/icon";
import { IconDownloader } from "./IconDownloader";
import { IconGeneratorForm } from "./IconGeneratorForm";
import { IconHistory } from "./IconHistory";
import { IconPreview } from "./IconPreview";
import { OgpGenerator } from "./OgpGenerator";

export function IconGenerator() {
  const [icon, setIcon] = useState<GeneratedIcon | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  const handleGenerated = (generatedIcon: GeneratedIcon, prompt: string) => {
    setIcon(generatedIcon);
    setCurrentPrompt(prompt);
  };

  const handleSelectHistory = (history: IconHistoryType) => {
    setIcon(history.icon);
    setCurrentPrompt(history.prompt);
  };

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-[40%_60%] lg:gap-8 lg:space-y-0">
      {/* 左カラム */}
      <div className="space-y-6">
        <section className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
          <IconGeneratorForm onGenerated={handleGenerated} />
        </section>

        <section className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
          <IconHistory onSelect={handleSelectHistory} />
        </section>
      </div>

      {/* 右カラム */}
      <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
        {icon ? (
          <>
            <section className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-lg text-purple-900">
                生成結果: {currentPrompt}
              </h2>
              <IconPreview icon={icon} />
            </section>

            <section className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
              <IconDownloader icon={icon} />
            </section>

            <section className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
              <OgpGenerator icon={icon} />
            </section>
          </>
        ) : (
          <section className="hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm lg:block">
            <p className="text-center text-purple-600">
              アイコンを生成すると、ここに結果が表示されます
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
