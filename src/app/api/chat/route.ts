// src/app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { PERSONAS, type PersonaId } from "@/lib/personas";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, personaId } = await req.json() as { messages: UIMessage[]; personaId: PersonaId };

    const targetPersonaId: PersonaId = personaId && PERSONAS[personaId] ? personaId : "hitesh";
    const selectedPersona = PERSONAS[targetPersonaId];

    // ==========================================
    // TOOL CALLING ARCHITECTURE STUB (FOR LATER)
    // ==========================================
    // When you are ready to fetch YouTube videos for Hitesh, Piyush, or Himanshu,
    // uncomment the tools block below. For now, tool calling is turned off.
    /*
    const tools = {
      fetchYouTubeVideos: {
        description: "Fetch recent or relevant YouTube videos by the active coding persona",
        parameters: z.object({
          query: z.string().describe("Topic to search on the channel, e.g., 'Docker tutorial' or 'System Design'"),
        }),
        execute: async ({ query }: { query: string }) => {
          // TODO: Replace with real YouTube Data API v3 call or custom RSS/scraper endpoint
          return {
            persona: selectedPersona.name,
            query,
            videos: [
              { title: `${selectedPersona.name} - Master ${query} in 2026`, url: "https://youtube.com/@..." },
            ],
          };
        },
      },
    };
    */

    const result = await streamText({
      model: openai('gpt-5.4-nano'),
      system: selectedPersona.systemPrompt,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
	  maxOutputTokens: 1000,
	  maxRetries: 1
      // tools: tools, // Uncomment this line when ready to activate tool calling
    });

    return result.toUIMessageStreamResponse();;
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}