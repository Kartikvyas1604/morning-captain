import { execSync } from "child_process";
import { env } from "./env";
import type {
  Email,
  CalendarEvent,
  Task,
  PullRequest,
  SlackMessage,
  SourceName,
} from "./types";

const BRIEFING_QUERY = `-- Morning Captain: Master Briefing Query
-- Fetches today's data from all 5 sources in a single Coral run

-- 1. Gmail: unread and important emails from today
SELECT
  'email' AS source_type,
  e.subject AS title,
  e.sender AS context,
  e.received_at AS timestamp,
  CASE WHEN e.is_important THEN 'high' ELSE 'normal' END AS priority,
  e.id AS ref_id,
  e.snippet AS detail
FROM gmail.inbox e
WHERE e.is_unread = TRUE
  AND DATE(e.received_at) = CURRENT_DATE

UNION ALL

-- 2. Google Calendar: today's confirmed events
SELECT
  'meeting' AS source_type,
  c.title AS title,
  c.organizer AS context,
  c.start_time AS timestamp,
  'high' AS priority,
  c.id AS ref_id,
  CONCAT(c.attendee_count, ' attendees') AS detail
FROM calendar.events c
WHERE DATE(c.start_time) = CURRENT_DATE
  AND c.status = 'confirmed'

UNION ALL

-- 3. Notion: open and in-progress tasks
SELECT
  'task' AS source_type,
  t.title AS title,
  t.source AS context,
  t.due_date AS timestamp,
  CASE WHEN t.priority = 'High' THEN 'high' ELSE 'normal' END AS priority,
  t.id AS ref_id,
  t.status AS detail
FROM notion.tasks t
WHERE t.status IN ('in_progress', 'not_started')

UNION ALL

-- 4. GitHub: PRs needing review or open drafts
SELECT
  'pull_request' AS source_type,
  p.title AS title,
  p.repository AS context,
  p.updated_at AS timestamp,
  CASE WHEN p.status = 'needs_review' THEN 'high' ELSE 'normal' END AS priority,
  p.id AS ref_id,
  p.status AS detail
FROM github.pull_requests p
WHERE p.status IN ('needs_review', 'changes_requested', 'draft')

UNION ALL

-- 5. Slack: unread DMs and mentions from today
SELECT
  'slack' AS source_type,
  s.text AS title,
  CONCAT(s.channel, ' — ', s.sender) AS context,
  s.sent_at AS timestamp,
  CASE WHEN s.is_mention THEN 'high' ELSE 'normal' END AS priority,
  s.id AS ref_id,
  CASE WHEN s.is_direct_message THEN 'DM' ELSE 'mention' END AS detail
FROM slack.messages s
WHERE s.is_unread = TRUE
  AND (s.is_mention = TRUE OR s.is_direct_message = TRUE)
  AND DATE(s.sent_at) = CURRENT_DATE
ORDER BY timestamp DESC;`;

export const BRIEFING_SQL = BRIEFING_QUERY;

interface CoralRow {
  source_type: string;
  title: string;
  context: string;
  timestamp: string;
  priority: string;
  ref_id: string;
  detail: string;
}

function classifyResults(rows: CoralRow[]) {
  const data = {
    emails: [] as Email[],
    meetings: [] as CalendarEvent[],
    tasks: [] as Task[],
    pull_requests: [] as PullRequest[],
    slack_messages: [] as SlackMessage[],
  };

  for (const row of rows) {
    switch (row.source_type) {
      case "email":
        data.emails.push({
          id: row.ref_id,
          subject: row.title,
          sender: row.context,
          snippet: row.detail,
          received_at: row.timestamp,
          is_unread: true,
          is_important: row.priority === "high",
        });
        break;
      case "meeting":
        data.meetings.push({
          id: row.ref_id,
          title: row.title,
          start_time: row.timestamp,
          end_time: row.timestamp,
          organizer: row.context,
          meeting_link: null,
          attendee_count: parseInt(row.detail) || 0,
          status: "confirmed",
        });
        break;
      case "task":
        data.tasks.push({
          id: row.ref_id,
          title: row.title,
          due_date: row.timestamp,
          priority: row.priority,
          status: row.detail,
          source: row.context,
        });
        break;
      case "pull_request":
        data.pull_requests.push({
          id: row.ref_id,
          title: row.title,
          repository: row.context,
          author: "",
          status: row.detail,
          updated_at: row.timestamp,
          url: "",
        });
        break;
      case "slack":
        data.slack_messages.push({
          id: row.ref_id,
          text: row.title,
          channel: row.context.split(" — ")[0],
          sender: row.context.split(" — ")[1] || row.context,
          sent_at: row.timestamp,
          is_unread: true,
          is_mention: row.detail === "mention",
          is_direct_message: row.detail === "DM",
        });
        break;
    }
  }

  return data;
}

export async function executeBriefingQuery(): Promise<{
  data: {
    emails: Email[];
    meetings: CalendarEvent[];
    tasks: Task[];
    pull_requests: PullRequest[];
    slack_messages: SlackMessage[];
  };
  sourceStatus: Record<string, boolean>;
  error: string | null;
}> {
  if (env.CORAL_ENABLED !== "true") {
    return {
      data: { emails: [], meetings: [], tasks: [], pull_requests: [], slack_messages: [] },
      sourceStatus: { gmail: false, calendar: false, notion: false, github: false, slack: false },
      error: "Coral is disabled. Set CORAL_ENABLED=true to enable.",
    };
  }

  try {
    const output = execSync(
      `${env.CORAL_BINARY} query --profile ${env.CORAL_PROFILE} --format json`,
      { input: BRIEFING_QUERY, timeout: 15000, encoding: "utf-8" }
    );

    const rows: CoralRow[] = JSON.parse(output);
    const data = classifyResults(rows);

    const sourcesWithData = new Set(rows.map((r) => r.source_type));
    const sourceStatus: Record<string, boolean> = {
      gmail: sourcesWithData.has("email"),
      calendar: sourcesWithData.has("meeting"),
      notion: sourcesWithData.has("task"),
      github: sourcesWithData.has("pull_request"),
      slack: sourcesWithData.has("slack"),
    };

    return { data, sourceStatus, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[coral] Query failed:", message);

    if (message.includes("command not found") || message.includes("not found")) {
      return {
        data: { emails: [], meetings: [], tasks: [], pull_requests: [], slack_messages: [] },
        sourceStatus: { gmail: false, calendar: false, notion: false, github: false, slack: false },
        error: "Coral CLI not found. Install Coral or set CORAL_ENABLED=false.",
      };
    }

    return {
      data: { emails: [], meetings: [], tasks: [], pull_requests: [], slack_messages: [] },
      sourceStatus: { gmail: false, calendar: false, notion: false, github: false, slack: false },
      error: `Coral query error: ${message}`,
    };
  }
}

export async function checkSourceHealth(
  source: SourceName
): Promise<{ connected: boolean; error?: string }> {
  if (env.CORAL_ENABLED !== "true") {
    return { connected: false, error: "Coral is disabled" };
  }

  try {
    const testQuery = `SELECT 1 FROM ${source === "gmail" ? "gmail.inbox" : source === "calendar" ? "calendar.events" : source === "notion" ? "notion.tasks" : source === "github" ? "github.pull_requests" : "slack.messages"} LIMIT 1`;

    execSync(`${env.CORAL_BINARY} query --profile ${env.CORAL_PROFILE} --format json`, {
      input: testQuery,
      timeout: 5000,
      encoding: "utf-8",
    });

    return { connected: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { connected: false, error: message };
  }
}
