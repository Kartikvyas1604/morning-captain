import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/app/lib/claude";
import { getEnv } from "@/app/lib/env";
import type { BriefingData } from "@/app/lib/types";

const STANDUP_PROMPT = `You are Morning Captain, a sharp naval officer productivity assistant. Generate a concise async standup message from briefing data.

RULES:
- Answer: what did I do yesterday, what am I doing today, what blockers
- Use real data only — never hallucinate
- Be specific: reference PR titles, task names, people
- Keep each section 1-2 sentences
- Format: "Yesterday: ...\nToday: ...\nBlockers: ..."
- If no data for a section, say "Nothing tracked"`;

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json() as { data: BriefingData };

    const text = await callOpenRouter(
      getEnv().OPENROUTER_MODEL,
      STANDUP_PROMPT,
      [{ role: "user", content: `Generate my standup from this data:\n\n${JSON.stringify(data, null, 2)}` }],
      512
    );

    const yesterday = text.match(/Yesterday:\s*([\s\S]+?)(?=\nToday:|$)/)?.[1]?.trim() || "Nothing tracked";
    const today = text.match(/Today:\s*([\s\S]+?)(?=\nBlockers:|$)/)?.[1]?.trim() || "Nothing tracked";
    const blockers = text.match(/Blockers:\s*([\s\S]+?)(?=$)/)?.[1]?.trim() || "None";

    return NextResponse.json({ yesterday, today, blockers, raw: text });
  } catch (err) {
    console.error("[standup] Error:", err);
    return NextResponse.json({ yesterday: "Unavailable", today: "Unavailable", blockers: "Unavailable", raw: "" }, { status: 500 });
  }
}
