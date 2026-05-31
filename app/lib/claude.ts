import Anthropic from "@anthropic-ai/sdk";
import { env } from "./env";
import type { BriefingData, ChatMessage } from "./types";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

const BRIEFING_SYSTEM_PROMPT = `You are Morning Captain, a sharp naval officer productivity assistant. Your role is to convert structured data into a tight, prioritized daily briefing.

RULES:
- Start every briefing with "Captain's Briefing — [today's date]"
- Lead with the most urgent items first (high priority)
- Mention upcoming meetings with times
- Reference specific items by name when calling out urgency
- End with exactly one clear action recommendation
- Tone: direct, calm, confident — no filler, no pleasantries
- NEVER make up data or hallucinate items not in the JSON
- Keep it 4-6 sentences
- Use natural language, not bullet points`;

const CHAT_SYSTEM_PROMPT = `You are Morning Captain, a conversational assistant with full context of the user's day. You have access to all their briefing data — emails, meetings, tasks, pull requests, and Slack messages.

RULES:
- Answer questions directly and precisely
- Reference specific items by name
- You can compare across sources (e.g. "Is that Slack message related to the PR?")
- If asked about something not in the data, say so clearly
- Keep tone direct and calm — like a naval officer
- Don't add pleasantries or filler`;

export async function generateBriefing(
  data: BriefingData,
  date: string
): Promise<string> {
  const c = getClient();

  const message = await c.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: BRIEFING_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is today's data (${date}):

${JSON.stringify(data, null, 2)}

Generate the morning briefing.`,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as Anthropic.TextBlock).text)
    .join("\n");

  return text || "Captain's Briefing — No data available to generate a briefing.";
}

export async function chatWithBriefing(
  userMessage: string,
  history: ChatMessage[],
  briefingData: BriefingData
): Promise<string> {
  const c = getClient();

  const contextMessage: ChatMessage = {
    role: "assistant",
    content: `Here is the user's full briefing data for context:\n\n${JSON.stringify(briefingData, null, 2)}\n\nUse this to answer questions about their day.`,
  };

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: contextMessage.content },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const response = await c.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: CHAT_SYSTEM_PROMPT,
    messages,
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as Anthropic.TextBlock).text)
    .join("\n");

  return text || "I don't have an answer based on the available data.";
}
