import { NextRequest, NextResponse } from "next/server";
import { chatWithBriefing } from "@/app/lib/claude";
import type { ChatMessage, BriefingData } from "@/app/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, briefing_data } = body as {
      message: string;
      history: ChatMessage[];
      briefing_data: BriefingData;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const reply = await chatWithBriefing(message, history || [], briefing_data);

    return NextResponse.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[chat] Error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        reply: "Sorry, I couldn't process that. Please try again.",
      },
      { status: 500 }
    );
  }
}
