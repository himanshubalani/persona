// src/components/persona-chat/input-bar.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PaperPlaneRightIcon, StopCircleIcon } from "@phosphor-icons/react/dist/ssr";

export function clampTextareaHeight(scrollHeight: number): number {
  return Math.max(48, Math.min(180, scrollHeight));
}

export function canSubmit(text: string): boolean {
  return text.trim().length > 0;
}

export interface InputBarProps {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  themeColor: string;
  placeholderName: string;
  prefill?: { text: string; id: number } | null;
}

export function InputBar({
  onSubmit,
  onStop,
  isStreaming = false,
  disabled = false,
  themeColor,
  placeholderName,
  prefill,
}: InputBarProps) {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(48);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-populate and focus when a suggestion chip is clicked
  useEffect(() => {
    if (!prefill) return;
    setValue(prefill.text);

    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      const end = ta.value.length;
      ta.setSelectionRange(end, end);
    });
  }, [prefill?.id]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "48px";
    const newHeight = clampTextareaHeight(textarea.scrollHeight);
    setHeight(newHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit(value) || disabled || isStreaming) return;
    onSubmit(value);
    setValue("");
    setHeight(48);
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  }, [value, disabled, isStreaming, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSubmitDisabled = !canSubmit(value) || disabled;

  return (
    <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4">
      {/* Concentric radius calculation: outer rounded-2xl (16px) with p-1.5 (6px) requires inner button rounded-[10px] (10px) */}
      <div
        className="flex items-end gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-1.5 sm:px-3 sm:py-2 transition-[border-color,background-color,box-shadow] duration-150 ease-out focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[var(--shadow-border)]"
        style={{
          outlineColor: themeColor,
        }}
      >
        {/* text-[16px] on small viewports prevents iOS auto-zoom */}
        <textarea
          ref={textareaRef}
          value={value}
          maxLength={1500}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isStreaming}
          placeholder={`Message ${placeholderName}...`}
          aria-label="Message input"
          className="flex-1 resize-none overflow-hidden border-0 bg-transparent px-2.5 py-1.5 text-[16px] sm:text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 my-auto text-pretty"
          style={{
            minHeight: "32px",
            maxHeight: "180px",
            height: `${height - 16}px`,
          }}
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generation"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] text-white transition-[scale,opacity,background-color,box-shadow] duration-150 ease-out hover:opacity-95 active:scale-[0.96] focus:outline-none shrink-0 shadow-sm cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            <StopCircleIcon className="h-5 w-5 shrink-0" weight="fill" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            aria-label="Send message"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-[scale,opacity,background-color,box-shadow] duration-150 ease-out hover:opacity-95 active:scale-[0.96] focus:outline-none shrink-0 shadow-sm cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            <PaperPlaneRightIcon className="h-5 w-5 shrink-0" weight="fill" />
          </button>
        )}
      </div>
    </div>
  );
}