"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  GeneratedIcon,
  IconHistory as IconHistoryType,
} from "@/entities/icon";
import { IconDownloader } from "./icon-downloader/IconDownloader";
import { IconGeneratorForm } from "./icon-generator-form/IconGeneratorForm";
import { IconHistory } from "./icon-history/IconHistory";
import { IconPreview } from "./icon-preview/IconPreview";
import { OgpGenerator } from "./ogp-generator/OgpGenerator";

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
    <div className="space-y-6 lg:grid lg:grid-cols-[2fr_3fr] lg:gap-8 lg:space-y-0">
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
            <section className="rounded-xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-lg text-purple-900">
                生成結果: {currentPrompt}
              </h2>
              <IconPreview icon={icon} />
            </section>

            <section className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
              <Tabs defaultValue="download">
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="download" className="flex-1">
                    アイコンダウンロード
                  </TabsTrigger>
                  <TabsTrigger value="ogp" className="flex-1">
                    OGP画像生成
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="download">
                  <IconDownloader icon={icon} />
                </TabsContent>
                <TabsContent value="ogp">
                  <OgpGenerator icon={icon} />
                </TabsContent>
              </Tabs>
            </section>
          </>
        ) : (
          <section className="hidden rounded-xl border border-purple-200 bg-purple-50 p-6 shadow-sm lg:block">
            <p className="text-center text-purple-600">
              アイコンを生成すると、ここに結果が表示されます
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
