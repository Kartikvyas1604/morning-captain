import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { executeBriefingQuery, BRIEFING_SQL } from "@/app/lib/coral";
import { generateBriefing } from "@/app/lib/claude";
import type { BriefingResponse, Persona } from "@/app/lib/types";

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("mc_session")?.value;

    let persona: Persona = "deep-work";
    try {
      const body = await request.json();
      if (body.persona) persona = body.persona;
    } catch { /* no body, use default */ }

    const { data, sourceStatus, error: coralError } = await executeBriefingQuery(sessionId);

    if (coralError) {
      console.warn("[briefing] Reported:", coralError);
    }

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    let summary = "";
    let aiGenerated = false;
    const hasData = Object.values(data).some((arr) => arr.length > 0);

    if (hasData) {
      try {
        summary = await generateBriefing(data, date, persona);
        aiGenerated = true;
      } catch (claudeErr) {
        console.error("[briefing] Claude error:", claudeErr);
        aiGenerated = false;
        const lines: string[] = [`Captain's Briefing — ${date}`];
        if (data.pull_requests.length) lines.push(`\nPull Requests (${data.pull_requests.length}):`, ...data.pull_requests.slice(0, 5).map((p) => `  • ${p.repository} — ${p.title}`));
        if (data.emails.length) lines.push(`\nEmails (${data.emails.length}):`, ...data.emails.slice(0, 3).map((e) => `  • ${e.sender} — ${e.subject}`));
        if (data.meetings.length) lines.push(`\nMeetings (${data.meetings.length}):`, ...data.meetings.slice(0, 3).map((m) => `  • ${m.title} at ${m.start_time}`));
        if (data.tasks.length) lines.push(`\nTasks (${data.tasks.length}):`, ...data.tasks.slice(0, 3).map((t) => `  • ${t.title}`));
        if (data.slack_messages.length) lines.push(`\nSlack (${data.slack_messages.length}):`, ...data.slack_messages.slice(0, 3).map((m) => `  • #${m.channel} — ${m.sender}: ${m.text}`));
        summary = lines.join("\n");
      }
    } else {
      summary = "";
    }

    const response: BriefingResponse = {
      summary, data, sql: BRIEFING_SQL,
      timestamp: new Date().toISOString(),
      source_status: sourceStatus,
      ai_generated: aiGenerated,
    };

    console.log(`[briefing] Completed in ${Date.now() - startTime}ms`);
    return NextResponse.json(response);
  } catch (err) {
    console.error("[briefing] Fatal error:", err);
    return NextResponse.json({
      summary: "",
      data: { emails: [], meetings: [], tasks: [], pull_requests: [], slack_messages: [] },
      sql: "", timestamp: new Date().toISOString(),
      source_status: { gmail: false, calendar: false, notion: false, github: false, slack: false },
      ai_generated: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }, { status: 500 });
  }
}
