# 🤖 Persona AI — GenAI with JS (2026)

![Next.js 16](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

> **Live Demo:** [https://your-live-deployment-url.vercel.app](https://your-live-deployment-url.vercel.app)  
> **GitHub Repository:** [https://github.com/YOUR_USERNAME/persona-ai](https://github.com/YOUR_USERNAME/persona-ai)

**Persona AI** is a state-of-the-art Generative AI web application built with **Next.js App Router**, **TypeScript**, and the **Vercel AI SDK**. It simulates hyper-realistic, authentic, and context-aware technical conversations with leading coding educators **Hitesh Choudhary**, **Piyush Garg**, and platform architect **Himanshu Balani**.

---

## 🎯 Project Overview & Objectives

Designed as a submission for the **GenAI with JS 2026** challenge, this platform goes beyond standard LLM wrappers. It meticulously recreates the distinct **communication styles, teaching philosophies, linguistic quirks (such as Hinglish), and technical depths** of each persona using advanced prompt engineering and contextual boundary enforcement.

### 🌟 Key Features
* **🧠 Deep Persona Accuracy:** Authentic vocabulary, tone, and mentoring strategies tailored to each creator.
* **⚡ Instant Persona Switching:** Seamlessly toggle between mentors via a sleek 256px desktop navigation rail.
* **💬 Auto-Prefill Suggestion Chips:** Interactive onboarding chips that populate and auto-focus the input bar for frictionless engagement.
* **🎨 Dynamic Theme-Tinted UI:** Custom avatar badges, glowing indicators, and chat bubbles matching each persona's brand colors (`#DC2626` Red for Hitesh, `#EC4899` Pink for Piyush, `#90a8ed` Blue for Himanshu).
* **📝 Safe Markdown Rendering:** Lightweight, XSS-safe inline rendering for code blocks, bold text, lists, and links, complete with an authentic terminal cursor blink during streaming.
* **🛡️ Production Safety Nets:** Built-in rate limiting, token clamping, sliding-window memory management, and Edge Runtime execution.
* **🔌 Tool-Calling Ready Architecture:** Modular backend structure pre-configured to easily plug in live YouTube Data API scrapers or RSS feed tools.

---

## 📚 Documentation for Evaluation

### 1. Data Collection & Preparation
To capture an authentic tone, persona data was gathered from publicly available ecosystems, talks, social media, and documentation:
* **Hitesh Choudhary ([hitesh.ai](https://hitesh.ai/) / Chai aur Code):** Analyzed 2,500+ YouTube videos, public talks, Twitter/X threads, and executive history (ex-Founder LCO, ex-CTO iNeuron, ex-Senior Director Physics Wallah). Key linguistic markers identified include Hinglish fusion (*"Simple h ji," "Dekho," "Accha ji," "Azaad desh hai"*), deep emphasis on practical business perspective over syntax, and famous philosophies like *"Vibe Coders vs. Gut Feeling developers"* and *"Let's sip some tea and write some code."*
* **Piyush Garg ([piyushgarg.dev](https://www.piyushgarg.dev/)):** Extracted insights from his full-stack tutorials, DevOps bootcamps, and SaaS building livestreams. Focus areas include hands-on architectural breakdowns, clean containerization (Docker, Next.js, AWS), type safety, and direct, highly technical encouragement closing with *"Keep building, keep shipping! 🚀"*
* **Himanshu Balani:** Modeled around modern indie-hacking, curiosity-driven side quests, and deep-dive engineering (rebuilding Git/Redis from scratch, full-stack AI platform creation).

### 2. Prompt Engineering Strategy
Rather than relying on basic system prompts, we utilize a **Structured Modular Prompt Architecture** located in `src/lib/personas.ts`. Each prompt is divided into four strict behavioral domains:
1. **Role & Identity:** Imprints executive background, career history, and personal worldview.
2. **Core Mindset & Philosophies:** Forces the LLM to evaluate user problems through the creator's unique lens (e.g., Hitesh's "Business Engineer" mindset vs. Piyush's "DevOps Architect" mindset).
3. **Tone of Voice & Linguistics:** Explicitly maps out sentence starters, slang usage, and multilingual rules (Hinglish grammar structures) to prevent robotic LLM syntax.
4. **Response Guidelines & Boundaries:** Instructs the model on how to handle overwhelmed beginners, architecture reviews, and when to reference open-source hobby tools (like *FreeAPI*, *ChaiCode*, or *Masterji*).

### 3. Context Management Approach
To ensure high performance, low latency, and cost-efficiency without sacrificing conversation quality, we implement a **Triple-Layer Context Strategy**:
* **Sliding Window Memory (`MAX_HISTORY_MESSAGES = 10`):** In `src/app/api/chat/route.ts`, the backend interceptor slices the conversation history to the most recent 10 messages before converting them to model messages. This prevents infinite context-window token bloat while retaining immediate conversation continuity.
* **Cross-Persona Isolation:** When a user clicks a new mentor in the sidebar, `handlePersonaSwitch()` explicitly fires `setMessages([])` and clears prefill states. This prevents "persona contamination" (e.g., stopping Piyush's AI from reading previous Hinglish context from Hitesh and breaking character).
* **Input Payload Clamping (`MAX_MESSAGE_LENGTH = 1500`):** Both frontend `<textarea>` attributes and backend Edge validation prevent malicious users from pasting massive payloads, guarding against token exhaustion and prompt injection.

---

## 💬 Sample Conversations

### ☕ Hitesh Choudhary Persona
> **User:** *Sir, AI is doing all the coding nowadays. Can I just use prompt engineering and vibe code my startup app without learning DSA or System Design?*
>
> **AI Hitesh:** Accha ji! Dekho, azaad desh hai—so sure, you can definitely do that, it's totally your choice! But let me give you a reality check from my years as a CTO.
> 
> Right now, I see two types of developers working on AI: *"Vibe Coders"* and *"Gut Feeling developers"*... and honestly, I don't know which one is worse! 😅 Woh time gya when coders just had to stitch some syntax together or prompt an LLM. Aajkal you need a serious business perspective and deep engineering fundamentals.
> 
> If your AI-generated app gets real users tomorrow, who is going to fix the database bottlenecks? Who is going to handle memory leaks or network latency? Vibe coding works for demos, but building scalable products requires understanding what happens under the hood. Simple h ji!
> 
> Start with the basics. Hop onto **ChaiCode** or use **FreeAPI** to practice real API handling and understand how data actually flows. Consistency se padho, attendance laga aao community me, baaki sab to ho hi jayega.
> 
> **Let’s sip some tea and write some code. ☕💻**

---

### 🚀 Piyush Garg Persona
> **User:** *How should I deploy my Next.js full-stack app? Should I just use a basic VPS or containerize it?*
>
> **AI Piyush:** Let's break down the architecture here. If you are building a production-ready SaaS, you should absolutely **containerize your Next.js application using Docker** right from the start.
> 
> Why? Because running raw Node.js processes directly on a VPS leads to environment inconsistencies between your local machine and production. By writing a multi-stage `Dockerfile`, you strip away unnecessary dev dependencies, keep your image lightweight, and make CI/CD pipelines seamless.
> 
> Here is how I would structure your deployment pipeline:
> 1. **Multi-Stage Docker Build:** Build your standalone Next.js output inside a container.
> 2. **Reverse Proxy:** Put **Nginx** or **Traefik** in front of your Docker container to handle SSL termination and routing.
> 3. **CI/CD with GitHub Actions:** Automate your build and push it to AWS ECR or Docker Hub whenever you merge to main.
> 
> Don't rely on shortcuts if you want to scale. Clean code, type safety, and solid DevOps fundamentals will save you hundreds of debugging hours later.
> 
> **Keep building, keep shipping! 🚀**

---

## 🏗️ Technical Architecture & Tech Stack

```text
+-----------------------------------------------------------------+
|                        Client (Browser)                         |
|  +--------------------+  +-------------------+  +------------+  |
|  | PersonaSidebar.tsx |  |  ThreadView.tsx   |  | InputBar   |  |
|  +--------------------+  +-------------------+  +------------+  |
+---------------------------------+-------------------------------+
                                  |
               Vercel AI SDK (useChat / DefaultChatTransport)
                                  |
+---------------------------------v-------------------------------+
|                      Next.js Edge Runtime                       |
|                   (/api/chat/route.ts - POST)                   |
|                                                                 |
|  1. Origin/Host Verification   3. Persona System Prompt Injection|
|  2. Input & Context Clamping   4. OpenAI Stream Generation      |
+---------------------------------+-------------------------------+
                                  |
                        OpenAI API (gpt-4o-mini)