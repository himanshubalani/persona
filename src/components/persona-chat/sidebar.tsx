// src/components/persona-chat/sidebar.tsx
"use client";

import React from "react";
import Image from "next/image";
import { PERSONAS, type PersonaId } from "@/lib/personas";

interface SidebarProps {
  activePersona: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
}

export function PersonaSidebar({ activePersona, onSelectPersona }: SidebarProps) {
  const personaList = Object.values(PERSONAS);

  return (
    <aside
      role="complementary"
      aria-label="Persona Selector"
      className="flex w-64 min-w-[256px] flex-col justify-between border-r border-slate-800 bg-slate-900 py-5 text-white select-none transition-all duration-300"
    >
      {/* Top Branding / Logo Header */}
      <div className="flex items-center gap-3 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md">
          P.AI
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white tracking-wide truncate">
            Persona AI
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            Select a mentor
          </span>
        </div>
      </div>

      {/* Persona Avatars & Names List */}
      <div className="flex flex-col gap-1.5 w-full px-3 my-auto">
        <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Available Personas
        </div>

        {personaList.map((persona) => {
          const isActive = activePersona === persona.id;

          return (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              aria-label={`Switch to ${persona.name}`}
              className={`group relative flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 focus:outline-none cursor-pointer ${
                isActive
                  ? "bg-slate-800/90 text-white shadow-sm font-medium"
                  : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              {/* Active color indicator bar on left edge */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300 ${
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                }`}
                style={{ backgroundColor: persona.themeColor }}
              />

              {/* Avatar Image */}
              <div
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? "scale-105 shadow-md"
                    : "border-transparent opacity-80 group-hover:opacity-100 group-hover:scale-105"
                }`}
                style={{
                  borderColor: isActive ? persona.themeColor : "transparent",
                  boxShadow: isActive ? `0 0 12px ${persona.themeColor}30` : "none",
                }}
              >
                <Image
                  src={persona.avatarUrl}
                  alt={persona.name}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover bg-slate-800"
                  unoptimized
                />
              </div>

              {/* Persona Name & Role to the right */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold truncate leading-snug text-slate-100 group-hover:text-white transition-colors">
                  {persona.name}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {persona.role}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Footer */}
      <div className="flex items-center justify-between px-5 text-xs text-slate-500 border-t border-slate-800/80 pt-4 mt-2 font-mono">
        <span>v1.0 • Persona AI • GenAI  </span>
        <span
          className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
          title="System Online"
        />
      </div>
    </aside>
  );
}