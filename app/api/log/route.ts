import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/app/lib/claude";
import { getEnv } from "@/app/lib/env";
import type { BriefingData, CaptainLogEntry } from "@/app/lib/types";

const LOG_PROMPT = `You are Morning Captain. Write a 3-sentence summary of what was accomplished today.

RULES:
- Focus on completed work, not scheduled items
- Mention specific PRs merged, tasks completed, meetings attended
- End with a one-line note on tomorrow's priority
- Be direct and factual`;

const logs = new Map<string, CaptainLogEntry>();

export async function POST(request: NextRequest) {
  try {
    const { date, data } = await request.json() as { date: string; data: BriefingData };

    const text = await callOpenRouter(
      getEnv().OPENROUTER_MODEL,
      LOG_PROMPT,
      [{ role: "user", content: `Summarize today (${date}):\n\n${JSON.stringify(data, null, 2)}` }],
      256
    );

    const entry: CaptainLogEntry = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date,
      summary: text || "No activity to summarize.",
      data,
      created_at: new Date().toISOString(),
    };

    logs.set(entry.id, entry);
    return NextResponse.json(entry);
  } catch (err) {
    console.error("[log] Error:", err);
    return NextResponse.json({ error: "Failed to create log entry" }, { status: 500 });
  }
}

export async function GET() {
  const entries = Array.from(logs.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json({ entries });
}
