// src/components/persona-chat/sidebar.tsx
"use client";

import React from "react";
import Image from "next/image";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { X } from "@phosphor-icons/react/dist/ssr";

interface SidebarProps {
  activePersona: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  onClose?: () => void;
}

export function PersonaSidebar({ activePersona, onSelectPersona, onClose }: SidebarProps) {
  const personaList = Object.values(PERSONAS);

  return (
    <aside
      role="complementary"
      aria-label="Persona Selector"
      className="flex h-full w-full md:w-64 md:min-w-[256px] flex-col justify-between border-r border-slate-800 bg-slate-900 py-5 text-white select-none"
    >
      {/* Top Branding / Logo Header */}
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-md bg-transparent">
            <Image
              src="/Logo.png"
              alt="Persona AI"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white tracking-wide truncate text-balance">
              Clerio Personas
            </span>
            <span className="text-[11px] text-slate-400 truncate text-pretty">
              Select a mentor
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            aria-label="Close sidebar"
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white active:scale-[0.96] transition-[scale,background-color,color] duration-150 ease-out shrink-0 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Persona Avatars & Names List */}
      <div className="flex flex-col gap-1.5 w-full px-3 my-auto py-6 overflow-y-auto">
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
              className={`group relative flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left transition-[background-color,color,transform,opacity,box-shadow,scale] duration-150 ease-out focus:outline-none cursor-pointer active:scale-[0.96] ${
                isActive
                  ? "bg-slate-800/90 text-white shadow-sm font-medium"
                  : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              {/* Active color indicator bar on left edge */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-[opacity,transform] duration-200 ease-out ${
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                }`}
                style={{ backgroundColor: persona.themeColor }}
              />

              {/* Avatar Image with Inset Outline */}
              <div
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 transition-[transform,border-color,box-shadow,opacity] duration-200 ease-out outline outline-1 -outline-offset-1 outline-white/10 ${
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

              {/* Persona Name & Role */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold truncate leading-snug text-slate-100 group-hover:text-white transition-colors text-balance">
                  {persona.name}
                </span>
                <span className="text-[11px] text-slate-400 truncate text-pretty">
                  {persona.role}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Footer with Tabular Numbers */}
      <div className="flex items-center justify-between px-5 text-xs text-slate-500 border-t border-slate-800/80 pt-4 mt-2 font-mono">
        <span className="tabular-nums">v1.0 • Clerio Personas</span>
        <span
          className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"
          title="System Online"
        />
      </div>
    </aside>
  );
}