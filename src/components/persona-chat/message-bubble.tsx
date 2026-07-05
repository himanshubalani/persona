// src/components/persona-chat/message-bubble.tsx
"use client";

import React from "react";
import Image from "next/image";
import { type Persona } from "@/lib/personas";

export interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  persona: Persona;
}

/**
 * Lightweight Markdown Renderer adapted from your project reference.
 * Supports: **bold**, *italic*, `code`, [links](url), lists (- or *), and newlines.
 */
export function renderMarkdown(text: string, themeColor: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let keyCounter = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyCounter++}`} className="list-disc pl-4 my-1.5 space-y-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // Headings
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushList();

      const level = headingMatch[1].length;
      const text = headingMatch[2];

      const headingClasses = {
        1: "text-2xl font-bold mt-4 mb-2",
        2: "text-xl font-bold mt-3 mb-2",
        3: "text-lg font-semibold mt-3 mb-1.5",
        4: "text-base font-semibold mt-2 mb-1",
        5: "text-sm font-semibold mt-2 mb-1",
        6: "text-sm font-medium mt-2 mb-1 text-slate-600",
      };

      const Tag = `h${level}` as keyof JSX.IntrinsicElements;

      elements.push(
        <Tag
          key={`heading-${keyCounter++}`}
          className={headingClasses[level as keyof typeof headingClasses]}
        >
          {renderInline(text!, themeColor)}
        </Tag>
      );

      continue;
    }

    const listMatch = /^[-*]\s+(.*)/.exec(line);

    if (listMatch) {
      listItems.push(
        <li key={`li-${keyCounter++}`}>{renderInline(listMatch[1]!, themeColor)}</li>
      );
    } else {
      flushList();

      if (line === "") {
        elements.push(<br key={`br-${keyCounter++}`} />);
      } else {
        if (elements.length > 0 && i > 0) {
          const prevLine = lines[i - 1];
          if (prevLine !== undefined && !(/^[-*]\s+/.exec(prevLine)) && prevLine !== "") {
            elements.push(<br key={`br-${keyCounter++}`} />);
          }
        }
        elements.push(
          <span key={`line-${keyCounter++}`}>{renderInline(line, themeColor)}</span>
        );
      }
    }
  }

  flushList();
  return elements;
}

function renderInline(text: string, themeColor: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let keyCounter = 0;
  const inlineRegex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))|(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)])/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      tokens.push(<strong key={`b-${keyCounter++}`} className="font-semibold text-slate-900">{match[2]}</strong>);
    } else if (match[3]) {
      tokens.push(<em key={`i-${keyCounter++}`} className="italic">{match[4]}</em>);
    } else if (match[5]) {
      tokens.push(
        <code
          key={`c-${keyCounter++}`}
          className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      tokens.push(
        <a
          key={`a-${keyCounter++}`}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium hover:opacity-80"
          style={{ color: themeColor }}
        >
          {match[8]}
        </a>
      );
    } else if (match[10]) {
      tokens.push(
        <a
          key={`a-${keyCounter++}`}
          href={match[10]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium hover:opacity-80 break-all"
          style={{ color: themeColor }}
        >
          {match[10]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

const cursorBlinkStyle = `
@keyframes cursor-blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0 }
}
`;

export function MessageBubble({ role, content, isStreaming, persona }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div
          className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] text-[14px] text-white shadow-sm break-words"
          style={{ backgroundColor: persona.themeColor }}
        >
          {content}
        </div>
      </div>
    );
  }

  // Assistant message with Persona avatar and colored accent
  return (
    <div className="flex items-start gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
      {isStreaming && <style>{cursorBlinkStyle}</style>}
      
      {/* Persona Avatar */}
      <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-slate-200 mt-1 shadow-sm">
        <Image src={persona.avatarUrl} alt={persona.name} width={32} height={32} className="h-full w-full object-cover" unoptimized />
      </div>

      <div className="flex flex-col gap-1 max-w-[80%]">
        <span className="text-xs font-semibold px-1 text-slate-500 flex items-center gap-1.5">
          {persona.name}
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: persona.themeColor }} />
        </span>

        <div className={`bg-white border rounded-2xl rounded-tl-sm px-4 py-3 text-[14px] text-slate-800 shadow-sm break-words leading-relaxed ${persona.borderTint}`}>
          {renderMarkdown(content, persona.themeColor)}
          {isStreaming && (
            <span
              className="inline-block w-2 h-4 ml-1 align-middle rounded-sm"
              style={{
                backgroundColor: persona.themeColor,
                animation: "cursor-blink 530ms step-end infinite",
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
}