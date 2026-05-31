import { execSync } from "child_process";
import { getEnv } from "./env";
import { fetchGitHubPRs, fetchSlackMessages, fetchNotionTasks, fetchGoogleData } from "./fetchers";
import type { Email, CalendarEvent, Task, PullRequest, SlackMessage, SourceName } from "./types";

const BRIEFING_QUERY = `-- Morning Captain: Master Briefing Query
-- Fetches today's data from all 5 sources in a single Coral run

SELECT 'email' AS source_type, e.subject AS title, e.sender AS context, e.received_at AS timestamp, CASE WHEN e.is_important THEN 'high' ELSE 'normal' END AS priority, e.id AS ref_id, e.snippet AS detail FROM gmail.inbox e WHERE e.is_unread = TRUE AND DATE(e.received_at) = CURRENT_DATE

UNION ALL

SELECT 'meeting' AS source_type, c.title AS title, c.organizer AS context, c.start_time AS timestamp, 'high' AS priority, c.id AS ref_id, CONCAT(c.attendee_count, ' attendees') AS detail FROM calendar.events c WHERE DATE(c.start_time) = CURRENT_DATE AND c.status = 'confirmed'

UNION ALL

SELECT 'task' AS source_type, t.title AS title, t.source AS context, t.due_date AS timestamp, CASE WHEN t.priority = 'High' THEN 'high' ELSE 'normal' END AS priority, t.id AS ref_id, t.status AS detail FROM notion.tasks t WHERE t.status IN ('in_progress', 'not_started')

UNION ALL

SELECT 'pull_request' AS source_type, p.title AS title, p.repository AS context, p.updated_at AS timestamp, CASE WHEN p.status = 'needs_review' THEN 'high' ELSE 'normal' END AS priority, p.id AS ref_id, p.status AS detail FROM github.pull_requests p WHERE p.status IN ('needs_review', 'changes_requested', 'draft')

UNION ALL

SELECT 'slack' AS source_type, s.text AS title, CONCAT(s.channel, ' — ', s.sender) AS context, s.sent_at AS timestamp, CASE WHEN s.is_mention THEN 'high' ELSE 'normal' END AS priority, s.id AS ref_id, CASE WHEN s.is_direct_message THEN 'DM' ELSE 'mention' END AS detail FROM slack.messages s WHERE s.is_unread = TRUE AND (s.is_mention = TRUE OR s.is_direct_message = TRUE) AND DATE(s.sent_at) = CURRENT_DATE ORDER BY timestamp DESC;`;

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
        data.emails.push({ id: row.ref_id, subject: row.title, sender: row.context, snippet: row.detail, received_at: row.timestamp, is_unread: true, is_important: row.priority === "high" });
        break;
      case "meeting":
        data.meetings.push({ id: row.ref_id, title: row.title, start_time: row.timestamp, end_time: row.timestamp, organizer: row.context, meeting_link: null, attendee_count: parseInt(row.detail) || 0, status: "confirmed" });
        break;
      case "task":
        data.tasks.push({ id: row.ref_id, title: row.title, due_date: row.timestamp, priority: row.priority, status: row.detail, source: row.context });
        break;
      case "pull_request":
        data.pull_requests.push({ id: row.ref_id, title: row.title, repository: row.context, author: "", status: row.detail, updated_at: row.timestamp, url: "" });
        break;
      case "slack":
        const parts = row.context.split(" — ");
        data.slack_messages.push({ id: row.ref_id, text: row.title, channel: parts[0], sender: parts[1] || row.context, sent_at: row.timestamp, is_unread: true, is_mention: row.detail === "mention", is_direct_message: row.detail === "DM" });
        break;
    }
  }
  return data;
}

export async function executeBriefingQuery(sessionId?: string): Promise<{
  data: { emails: Email[]; meetings: CalendarEvent[]; tasks: Task[]; pull_requests: PullRequest[]; slack_messages: SlackMessage[] };
  sourceStatus: Record<string, boolean>;
  error: string | null;
}> {
  const env = getEnv();

  if (env.CORAL_ENABLED === "true") {
    try {
      execSync(`which ${env.CORAL_BINARY}`, { timeout: 1000, encoding: "utf-8" });
      const output = execSync(`${env.CORAL_BINARY} query --profile ${env.CORAL_PROFILE} --format json`, {
        input: BRIEFING_QUERY, timeout: 8000, encoding: "utf-8",
      });
      const rows: CoralRow[] = JSON.parse(output);
      const data = classifyResults(rows);
      const sourcesWithData = new Set(rows.map((r) => r.source_type));
      console.log(`[coral] Query returned ${rows.length} rows`);
      return {
        data,
        sourceStatus: { gmail: sourcesWithData.has("email"), calendar: sourcesWithData.has("meeting"), notion: sourcesWithData.has("task"), github: sourcesWithData.has("pull_request"), slack: sourcesWithData.has("slack") },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[coral] CLI unavailable, falling back to API:", msg);
    }
  }

  const results = await Promise.allSettled([
    fetchGitHubPRs(sessionId),
    fetchSlackMessages(sessionId),
    fetchNotionTasks(sessionId),
    fetchGoogleData(sessionId),
  ]);

  const [prs, slack, tasks, google] = results.map((r) =>
    r.status === "fulfilled" ? r.value : []
  ) as [PullRequest[], SlackMessage[], Task[], { emails: Email[]; meetings: CalendarEvent[] }];

  const prsActual = Array.isArray(prs) ? prs : [];
  const slackActual = Array.isArray(slack) ? slack : [];
  const tasksActual = Array.isArray(tasks) ? tasks : [];
  const googleActual = google && typeof google === "object" && "emails" in google ? google : { emails: [], meetings: [] };

  console.log(`[coral] Fetched: ${prsActual.length} PRs, ${slackActual.length} slack, ${tasksActual.length} tasks, ${googleActual.emails.length} emails, ${googleActual.meetings.length} meetings`);

  return {
    data: {
      emails: googleActual.emails,
      meetings: googleActual.meetings,
      tasks: tasksActual,
      pull_requests: prsActual,
      slack_messages: slackActual,
    },
    sourceStatus: {
      gmail: googleActual.emails.length > 0,
      calendar: googleActual.meetings.length > 0,
      notion: tasksActual.length > 0,
      github: prsActual.length > 0,
      slack: slackActual.length > 0,
    },
    error: null,
  };
}

export async function checkSourceHealth(source: SourceName): Promise<{ connected: boolean; error?: string }> {
  return { connected: true };
}
