// src/lib/personas.ts

export type PersonaId = "hitesh" | "piyush" | "himanshu";

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  themeColor: string;       // Primary hex/tailwind color
  bgTint: string;           // Soft background tint for assistant bubbles & badges
  borderTint: string;       // Border color for UI accents
  avatarUrl: string;        // Placeholder or real avatar image
  tagline: string;
  suggestionChips: string[];
  systemPrompt: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  hitesh: {
    id: "hitesh",
    name: "Hitesh Choudhary",
    role: "Chai aur Code",
    themeColor: "#DC2626",      // Red
    bgTint: "bg-red-50 text-red-950 border-red-200",
    borderTint: "border-[#DC2626]",
    avatarUrl: "https://avatars.githubusercontent.com/u/11613311?v=4",
    tagline: "Chai lover, YouTuber (2,500+ videos), and practical builder.",
    suggestionChips: [
      "Why is business perspective important for developers?",
      "What products have you built?",
      "Vibe coders vs Gut feeling developers in AI",
      "How to get out of tutorial hell?",
    ],
    systemPrompt: process.env.HITESH_SYSTEM_PROMPT 
  },

  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    role: "Principal Engineer by day, GenAI Educator by night",
    themeColor: "#EC4899",    
    bgTint: "bg-pink-50 text-pink-950 border-pink-200",
    borderTint: "border-[#EC4899]",
    avatarUrl: "https://pbs.twimg.com/profile_images/1991479533946695684/uL2HzvWv_400x400.jpg",
    tagline: "Forever 23. Princioal Engineer shipping GenAI systems & local AI apps. Don't ask me to do math, just diagrams & logic!",
    suggestionChips: [
      "Why do you say 'Loop Engineering is Dead'?",
      "Can a Commerce stream student really master GenAI and Full Stack?",
      "How did you build WisprType to process AI voice dictation locally?",
      "Draw me a diagram explaining how S3 actually works under the hood",
    ],
    systemPrompt: process.env.PIYUSH_SYSTEM_PROMPT,
  },

  himanshu: {
  id: "himanshu",
  name: "Himanshu Balani",
  role: "Developer, Builder & Technical Writer",
  themeColor: "#90a8ed",
  bgTint: "bg-blue-50 text-blue-950 border-blue-200",
  borderTint: "border-[#2563EB]",
  avatarUrl: "https://pbs.twimg.com/media/HLHguBYbgAAPike?format=jpg&name=large",
  tagline: "CSE graduate, full-stack dev, and someone who probably has too many side projects open at once. Ask me anything about building products, TypeScript, AI integration, or just tech in general. ☕",
  suggestionChips: [
    "What side project should I build next?",
    "Review my architecture decision",
    "Turn this idea into an MVP",
    "How would you write a blog about this?",
  ],
  systemPrompt: process.env.HIMANSHU_SYSTEM_PROMPT,
},
};