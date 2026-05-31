import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/app/lib/claude";
import { getEnv } from "@/app/lib/env";
import { BRIEFING_SQL } from "@/app/lib/coral";
import type { ShellQueryResult } from "@/app/lib/types";

const SHELL_PROMPT = `You are Morning Captain SQL shell. Convert natural language into a Coral SQL query.

The database has these tables/views:
- gmail.inbox (id, subject, sender, snippet, received_at, is_unread, is_important)
- calendar.events (id, title, start_time, end_time, organizer, meeting_link, attendee_count, status)
- notion.tasks (id, title, due_date, priority, status, source)
- github.pull_requests (id, title, repository, author, status, updated_at, url)
- slack.messages (id, text, channel, sender, sent_at, is_unread, is_mention, is_direct_message)

RULES:
- Return ONLY the SQL query, nothing else
- Use valid SQLite syntax compatible with Coral
- Use CURRENT_DATE and standard SQL functions
- Keep queries safe (SELECT only)
- Here is an example of a valid query:\n${BRIEFING_SQL}`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json() as { query: string };

    const sql = await callOpenRouter(
      getEnv().OPENROUTER_MODEL,
      SHELL_PROMPT,
      [{ role: "user", content: `Convert this to a Coral SQL query: "${query}"` }],
      512
    );

    const cleanSql = sql.replace(/```sql\n?/gi, "").replace(/```\n?/g, "").trim();

    const result: ShellQueryResult = {
      sql: cleanSql,
      columns: [],
      rows: [],
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[shell] Error:", err);
    return NextResponse.json({ sql: "", columns: [], rows: [], error: "Failed to generate query" }, { status: 500 });
  }
}
