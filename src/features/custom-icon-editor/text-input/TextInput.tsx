"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onBlur: () => void;
  onCursorPositionChange?: (position: number) => void;
}

export function TextInput({
  value,
  onChange,
  isEditing,
  onBlur,
  onCursorPositionChange,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSelectionChange = () => {
    if (textareaRef.current && onCursorPositionChange) {
      onCursorPositionChange(textareaRef.current.selectionStart);
    }
  };

  if (!isEditing) return null;

  const handleFocus = () => {
    textareaRef.current?.focus();
  };

  return (
    <>
      {/* Canvas上をクリック可能にするための透明オーバーレイ */}
      <button
        type="button"
        className="pointer-events-auto absolute inset-0 cursor-text bg-transparent"
        onClick={(e) => {
          e.stopPropagation();
          handleFocus();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleFocus();
          }
        }}
        aria-label="テキスト入力エリア"
      />
      {/* 画面外に配置したTextArea（IME入力用） */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          handleSelectionChange();
        }}
        onBlur={onBlur}
        onKeyUp={handleSelectionChange}
        placeholder=""
        className="-left-[9999px] pointer-events-auto absolute w-64 resize-none"
        rows={3}
      />
    </>
  );
}
