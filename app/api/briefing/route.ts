import { NextResponse } from "next/server";
import { executeBriefingQuery, BRIEFING_SQL } from "@/app/lib/coral";
import { generateBriefing } from "@/app/lib/claude";
import type { BriefingResponse } from "@/app/lib/types";

export async function POST() {
  const startTime = Date.now();

  try {
    const { data, sourceStatus, error: coralError } = await executeBriefingQuery();

    if (coralError) {
      console.warn("[briefing] Coral reported:", coralError);
    }

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let summary = "";

    const hasData = Object.values(data).some((arr) => arr.length > 0);

    if (hasData) {
      try {
        summary = await generateBriefing(data, date);
      } catch (claudeErr) {
        console.error("[briefing] Claude error:", claudeErr);
        summary = `Captain's Briefing — ${date}\n\nAI summary unavailable. Raw data is displayed below.`;
      }
    } else {
      summary = `Captain's Briefing — ${date}\n\nNo data available. Connect your sources in Settings to get started.`;
    }

    const response: BriefingResponse = {
      summary,
      data,
      sql: BRIEFING_SQL,
      timestamp: new Date().toISOString(),
      source_status: sourceStatus,
    };

    const elapsed = Date.now() - startTime;
    console.log(`[briefing] Completed in ${elapsed}ms`);

    return NextResponse.json(response);
  } catch (err) {
    console.error("[briefing] Fatal error:", err);
    return NextResponse.json(
      {
        summary: "Captain's Briefing — Unable to load data. Please try again.",
        data: {
          emails: [],
          meetings: [],
          tasks: [],
          pull_requests: [],
          slack_messages: [],
        },
        sql: "",
        timestamp: new Date().toISOString(),
        source_status: {
          gmail: false,
          calendar: false,
          notion: false,
          github: false,
          slack: false,
        },
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
