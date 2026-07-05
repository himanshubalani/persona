// src/components/persona-chat/chat-container.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { type PersonaId, PERSONAS } from "@/lib/personas";
import { PersonaSidebar } from "./sidebar";
import { ThreadView } from "./thread-view";
import { InputBar } from "./input-bar";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";

export function PersonaChatApp() {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>("hitesh");
  const activePersona = PERSONAS[activePersonaId];
  const activePersonaIdRef = useRef(activePersonaId);

  // NEW: State to hold text clicked from suggestion chips
  const [prefill, setPrefill] = useState<{ text: string; id: number } | null>(null);

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

  // Handle switching personas
  function handlePersonaSwitch(id: PersonaId) {
    if (id === activePersonaId) return;
    setActivePersonaId(id);
    setMessages([]);
    setPrefill(null); // Clear any prefilled text when switching personas
  }

  function handleClearChat() {
    setMessages([]);
    setPrefill(null);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Left Thin Persona Rail */}
      <PersonaSidebar
        activePersona={activePersonaId}
        onSelectPersona={handlePersonaSwitch}
      />

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-0 bg-white">
        {/* Top Navbar */}
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3.5 bg-white z-10">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">
                {activePersona.name}
              </h1>
              <p className="text-xs text-slate-500">{activePersona.role}</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            title="Clear Chat"
            disabled={messages.length === 0 || isStreaming}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Clear
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
          // CHANGED: Instead of void sendMessage({ text }), we populate prefill state!
          onSuggestionClick={(text) => setPrefill({ text, id: Date.now() })}
        />

        {/* Bottom Input Box */}
        <InputBar
          onSubmit={(text) => void sendMessage({ text })}
          onStop={() => void stop()}
          isStreaming={isStreaming}
          themeColor={activePersona.themeColor}
          placeholderName={activePersona.name}
          // NEW: Pass the prefill request down to the input bar
          prefill={prefill}
        />
      </div>
    </div>
  );
}