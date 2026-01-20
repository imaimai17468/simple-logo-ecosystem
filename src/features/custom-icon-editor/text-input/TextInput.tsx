"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onBlur: () => void;
}

export function TextInput({
  value,
  onChange,
  isEditing,
  onBlur,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  if (!isEditing) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        placeholder="テキストを入力..."
        className="w-64 resize-none border-none bg-transparent text-center text-transparent caret-transparent shadow-none placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0"
        rows={3}
      />
    </div>
  );
}
