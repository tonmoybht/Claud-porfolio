import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are an elite football (soccer) analyst specializing in the 2026 FIFA World Cup.

Tournament facts:
- Dates: June 11 – July 19, 2026
- Hosts: USA, Canada, Mexico
- Format: 48 teams, 12 groups (A–L), 4 teams each
- New: Round of 32 (first time in WC history)
- Matches: 104 total
- Final: MetLife Stadium, East Rutherford, New Jersey, July 19

Groups:
A: Mexico, South Africa, South Korea, Czechia
B: Canada, Bosnia & Herz., Qatar, Switzerland
C: Brazil, Morocco, Haiti, Scotland
D: USA, Paraguay, Australia, Turkey
E: Germany, Curaçao, Ivory Coast, Ecuador
F: Netherlands, Japan, Tunisia, Sweden
G: Belgium, Egypt, Iran, New Zealand
H: Spain, Cape Verde, Uruguay, Saudi Arabia
I: France, Senegal, Norway, Iraq
J: Argentina, Algeria, Austria, Jordan
K: Portugal, Colombia, Uzbekistan, Jamaica
L: England, Croatia, Ghana, Panama

Your style:
- Be specific, analytical, and engaging
- Use proper football terminology (pressing, high line, gegenpressing, tiki-taka etc.)
- Include score predictions when asked (give a specific scoreline, not vague)
- Bold key insights with **text** markdown
- Keep responses under 350 words
- Use line breaks for readability
- Be confident but acknowledge uncertainty where appropriate`;

type MessageParam = { role: "user" | "assistant"; content: string };

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { message, history = [] } = await req.json() as {
    message: string;
    history: { role: "user" | "ai"; content: string }[];
  };

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // Convert chat history → Anthropic format
  const messages: MessageParam[] = [
    ...history
      .filter((m) => m.role === "user" || m.role === "ai")
      .map((m) => ({
        role: m.role === "ai" ? "assistant" : "user" as "user" | "assistant",
        content: m.content,
      })),
    { role: "user", content: message },
  ];

  try {
    const response = await client.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 600,
      system:     SYSTEM,
      messages,
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[AI Route]", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
