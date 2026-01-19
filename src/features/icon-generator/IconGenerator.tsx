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
    <div className="space-y-8">
      <IconGeneratorForm onGenerated={handleGenerated} />

      <IconHistory onSelect={handleSelectHistory} />

      {icon && (
        <>
          <div className="border-t pt-8">
            <h2 className="mb-4 font-semibold text-xl">
              生成結果: {currentPrompt}
            </h2>
          </div>
          <IconPreview icon={icon} />
          <IconDownloader icon={icon} />
          <OgpGenerator icon={icon} />
        </>
      )}
    </div>
  );
}
