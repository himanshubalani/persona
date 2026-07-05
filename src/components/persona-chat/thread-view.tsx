// src/components/persona-chat/thread-view.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageBubble } from "./message-bubble";
import { type Persona } from "@/lib/personas";
import Image from "next/image";

export function shouldAutoScroll(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): boolean {
  return scrollHeight - scrollTop - clientHeight <= 60;
}

interface ThreadViewProps {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
  }>;
  isStreaming?: boolean;
  persona: Persona;
  onSuggestionClick?: (text: string) => void;
}

export function ThreadView({
  messages,
  isStreaming = false,
  persona,
  onSuggestionClick,
}: ThreadViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);
  const prevMessageCountRef = useRef(messages.length);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNearBottom = shouldAutoScroll(
      container.scrollTop,
      container.scrollHeight,
      container.clientHeight,
    );
    setUserHasScrolledUp(!isNearBottom);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const messageCountChanged = messages.length !== prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (!userHasScrolledUp && (messageCountChanged || isStreaming)) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, messages, isStreaming, userHasScrolledUp]);

  // Empty State with Persona Branding & Chips
  if (messages.length === 0) {
    return (
      <div
        role="log"
        aria-live="polite"
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6 text-center select-none"
      >
        <div
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent opacity-100 transition-all duration-300 hover:scale-105 hover:opacity-100 shadow-lg mb-4"
          style={{
            boxShadow: `0 0 16px ${persona.themeColor}40`,
          }}
        >
          <Image
			src={persona.avatarUrl}
			alt={persona.name}
			width={64}
			height={64}
			className="h-full w-full object-cover"
			unoptimized
		  />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          Chat with {persona.name}
        </h2>
        <p className="mb-6 text-sm text-slate-500 max-w-md">
          {persona.tagline}
        </p>

        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {persona.suggestionChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSuggestionClick?.(chip)}
              className="cursor-pointer rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-all hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{ outlineColor: persona.themeColor }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      role="log"
      aria-live="polite"
      onScroll={handleScroll}
      className="flex flex-1 flex-col overflow-y-auto px-6 py-4 space-y-4"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          persona={persona}
          isStreaming={
            isStreaming &&
            message.role === "assistant" &&
            index === messages.length - 1
          }
        />
      ))}
    </div>
  );
}