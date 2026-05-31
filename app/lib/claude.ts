import { getEnv } from "./env";
import type { BriefingData, ChatMessage } from "./types";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

interface OpenRouterChoice {
  message: { content: string };
}

interface OpenRouterResponse {
  choices: OpenRouterChoice[];
}

async function callOpenRouter(
  model: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  const env = getEnv();

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text}`);
  }

  const data: OpenRouterResponse = await res.json();
  return data.choices?.[0]?.message?.content || "";
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
  const text = await callOpenRouter(
    getEnv().OPENROUTER_MODEL,
    BRIEFING_SYSTEM_PROMPT,
    [
      {
        role: "user",
        content: `Here is today's data (${date}):\n\n${JSON.stringify(data, null, 2)}\n\nGenerate the morning briefing.`,
      },
    ],
    1024
  );

  return text || "Captain's Briefing — No data available to generate a briefing.";
}

export async function chatWithBriefing(
  userMessage: string,
  history: ChatMessage[],
  briefingData: BriefingData
): Promise<string> {
  const contextMessage = `Here is the user's full briefing data for context:\n\n${JSON.stringify(briefingData, null, 2)}\n\nUse this to answer questions about their day.`;

  const messages: { role: string; content: string }[] = [
    { role: "user", content: contextMessage },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const text = await callOpenRouter(
    getEnv().OPENROUTER_MODEL,
    CHAT_SYSTEM_PROMPT,
    messages,
    2048
  );

  return text || "I don't have an answer based on the available data.";
}
