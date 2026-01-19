"use client";

import { useState } from "react";
import type { GeneratedIcon } from "@/entities/icon";
import { IconDownloader } from "./IconDownloader";
import { IconGeneratorForm } from "./IconGeneratorForm";
import { IconPreview } from "./IconPreview";
import { OgpGenerator } from "./OgpGenerator";

export function IconGenerator() {
  const [icon, setIcon] = useState<GeneratedIcon | null>(null);

  return (
    <div className="space-y-8">
      <IconGeneratorForm onGenerated={setIcon} />

      {icon && (
        <>
          <IconPreview icon={icon} />
          <IconDownloader icon={icon} />
          <OgpGenerator icon={icon} />
        </>
      )}
    </div>
  );
}
