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

  // Empty State with Staggered Animations & overscroll-contain
  if (messages.length === 0) {
    return (
      <div
        role="log"
        aria-live="polite"
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain px-4 py-6 text-center select-none"
      >
        {/* Avatar with Inset Outline */}
        <div
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent transition-[transform,opacity,box-shadow] duration-300 hover:scale-105 shadow-lg mb-4 outline outline-1 -outline-offset-1 outline-black/10 shrink-0"
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

        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 text-balance">
          Chat with {persona.name}
        </h2>
        <p className="mb-6 text-xs sm:text-sm text-slate-500 max-w-md text-pretty leading-relaxed px-2">
          {persona.tagline}
        </p>

        {/* Staggered Suggestion Chips with Scale on Press */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg px-2">
          {persona.suggestionChips.map((chip, index) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSuggestionClick?.(chip)}
              style={{
                outlineColor: persona.themeColor,
                animationDelay: `${index * 80}ms`,
              }}
              className="animate-fade-in-up cursor-pointer rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[scale,border-color,box-shadow,background-color,color] duration-150 ease-out hover:border-slate-300 hover:shadow-sm active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-offset-1 text-left text-pretty"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    /* overscroll-contain stops scroll chaining to prevent mobile URL bar bounce */
    <div
      ref={scrollContainerRef}
      role="log"
      aria-live="polite"
      onScroll={handleScroll}
      className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-3.5 sm:px-6 sm:py-4 space-y-4"
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