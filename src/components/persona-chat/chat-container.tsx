// src/components/persona-chat/chat-container.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { type PersonaId, PERSONAS } from "@/lib/personas";
import { PersonaSidebar } from "./sidebar";
import { ThreadView } from "./thread-view";
import { InputBar } from "./input-bar";
import { TrashIcon, List } from "@phosphor-icons/react/dist/ssr";

export function PersonaChatApp() {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>("hitesh");
  const activePersona = PERSONAS[activePersonaId];
  const activePersonaIdRef = useRef(activePersonaId);

  const [prefill, setPrefill] = useState<{ text: string; id: number } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Touch gesture coordinates for left-edge swipe detection
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    activePersonaIdRef.current = activePersonaId;
  }, [activePersonaId]);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            messages,
            id,
            personaId: activePersonaIdRef.current,
          },
        };
      },
    }),
  });

  const isStreaming = status === "submitted" || status === "streaming";

  function handlePersonaSwitch(id: PersonaId) {
    if (id === activePersonaId) return;
    setActivePersonaId(id);
    setMessages([]);
    setPrefill(null);
    setIsMobileMenuOpen(false);
  }

  function handleClearChat() {
    setMessages([]);
    setPrefill(null);
  }

  // Handle Touch Start for Swipe Gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  // Handle Touch End: calculate trajectory to differentiate swipe from vertical scroll
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Must be a predominantly horizontal swipe (> 40px movement, and horizontal delta > 1.5x vertical delta)
    if (absDeltaX > 40 && absDeltaX > absDeltaY * 1.5) {
      // Swipe right from the left edge (< 70px) -> Open sidebar
      if (deltaX > 0 && !isMobileMenuOpen && touchStartRef.current.x < 70) {
        setIsMobileMenuOpen(true);
      }
      // Swipe left anywhere when menu is open -> Close sidebar
      else if (deltaX < 0 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    touchStartRef.current = null;
  };

  return (
    /* Using h-dvh (Dynamic Viewport Height) to prevent iOS Safari address bar from pushing content off-screen */
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex h-dvh max-h-dvh w-screen overflow-hidden bg-slate-50 font-sans"
    >
      {/* Desktop Sidebar Rail */}
      <div className="hidden md:flex h-full shrink-0">
        <PersonaSidebar
          activePersona={activePersonaId}
          onSelectPersona={handlePersonaSwitch}
        />
      </div>

      {/* Mobile Backdrop & Off-Canvas Drawer */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ease-out ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-out Sheet */}
        <div
          className={`relative flex h-full w-72 max-w-[85vw] flex-col bg-slate-900 shadow-2xl transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <PersonaSidebar
            activePersona={activePersonaId}
            onSelectPersona={handlePersonaSwitch}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-0 bg-white">
        {/* Top Navbar */}
        <header className="flex items-center justify-between border-b border-slate-200 px-3.5 py-3 sm:px-6 sm:py-3.5 bg-white z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              type="button"
              aria-label="Open sidebar"
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 active:scale-[0.96] transition-[scale,background-color,border-color,box-shadow] duration-150 ease-out hover:bg-slate-50 shrink-0 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <List className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-800 leading-tight truncate text-balance">
                {activePersona.name}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate text-pretty">
                {activePersona.role}
              </p>
            </div>
          </div>

          {/* Optically aligned Clear Button with scale-on-press */}
          <button
            onClick={handleClearChat}
            title="Clear Chat"
            disabled={messages.length === 0 || isStreaming}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/80 pl-3.5 pr-3 text-xs font-medium text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-slate-50 hover:text-red-600 active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed transition-[scale,background-color,color,border-color,box-shadow,opacity] duration-150 ease-out cursor-pointer shrink-0"
          >
            <TrashIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Clear</span>
          </button>
        </header>

        {/* Thread View (Messages) */}
        <ThreadView
          messages={messages.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.parts
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join(""),
          }))}
          isStreaming={isStreaming}
          persona={activePersona}
          onSuggestionClick={(text) => setPrefill({ text, id: Date.now() })}
        />

        {/* Bottom Input Box */}
        <InputBar
          onSubmit={(text) => void sendMessage({ text })}
          onStop={() => void stop()}
          isStreaming={isStreaming}
          themeColor={activePersona.themeColor}
          placeholderName={activePersona.name}
          prefill={prefill}
        />
      </div>
    </div>
  );
}