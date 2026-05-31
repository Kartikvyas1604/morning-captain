import { getEnv } from "./env";
import { getToken } from "./store";
import type {
  Email,
  CalendarEvent,
  Task,
  PullRequest,
  SlackMessage,
} from "./types";

function resolveToken(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return parsed.access_token || parsed.authed_user?.access_token || raw;
  } catch {
    return raw;
  }
}

export async function fetchGitHubPRs(sessionId?: string): Promise<PullRequest[]> {
  const env = getEnv();
  const raw = env.GITHUB_TOKEN || (sessionId ? getToken(sessionId, "github") : undefined);
  const token = resolveToken(raw);
  if (!token) { console.warn("[fetcher] GitHub: no token"); return []; }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Morning-Captain/1.0",
  };

  const mapPR = (item: any): PullRequest => ({
    id: String(item.id),
    title: item.title,
    repository: item.repository_url?.split("/").slice(-2).join("/") || item.base?.repo?.full_name || item.head?.repo?.full_name || "unknown",
    author: item.user?.login || "",
    status: item.draft ? "draft" : item.state === "closed" ? "merged" : "needs_review",
    updated_at: item.updated_at || item.created_at || new Date().toISOString(),
    url: item.html_url || item.pull_request?.html_url || "",
  });

  try {
    const res = await fetch(
      "https://api.github.com/search/issues?q=is:open+is:pr+author:@me&sort=updated&per_page=10",
      { headers }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.items?.length) return data.items.map(mapPR);
    } else if (res.status === 403 || res.status === 422) {
      console.warn("[fetcher] GitHub search unavailable, trying PRs endpoint");
    }

    const userRes = await fetch("https://api.github.com/user", { headers });
    if (!userRes.ok) { console.warn("[fetcher] GitHub: cannot get user"); return []; }
    const user = await userRes.json();
    const login: string = user.login;

    const repoRes = await fetch(
      `https://api.github.com/search/issues?q=is:open+is:pr+involves:${login}&sort=updated&per_page=10`,
      { headers }
    );
    if (repoRes.ok) {
      const data = await repoRes.json();
      if (data.items?.length) return data.items.map(mapPR);
    }

    const reposRes = await fetch(
      "https://api.github.com/user/repos?per_page=20&sort=updated&type=owner",
      { headers }
    );
    if (!reposRes.ok) { console.warn("[fetcher] GitHub: cannot get repos"); return []; }
    const repos: any[] = await reposRes.json();
    const prs: PullRequest[] = [];
    for (const repo of repos.slice(0, 5)) {
      try {
        const prRes = await fetch(
          `https://api.github.com/repos/${repo.full_name}/pulls?state=open&per_page=5`,
          { headers }
        );
        if (prRes.ok) {
          const items: any[] = await prRes.json();
          for (const item of items) {
            prs.push(mapPR({ ...item, repository_url: `https://api.github.com/repos/${repo.full_name}` }));
          }
        }
      } catch { continue; }
    }
    return prs;
  } catch (e) { console.warn("[fetcher] GitHub error:", e); return []; }
}

export async function fetchSlackMessages(sessionId?: string): Promise<SlackMessage[]> {
  const env = getEnv();
  const raw = env.SLACK_BOT_TOKEN || (sessionId ? getToken(sessionId, "slack") : undefined);
  const token = resolveToken(raw);
  if (!token) return [];

  const messages: SlackMessage[] = [];

  try {
    const listRes = await fetch(
      "https://slack.com/api/conversations.list?types=public_channel,private_channel,im&limit=20",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    if (!listData.ok) { console.warn("[fetcher] Slack list error:", listData.error); return []; }

    const channels = (listData.channels || []).slice(0, 5);

    for (const ch of channels) {
      try {
        const histRes = await fetch(
          `https://slack.com/api/conversations.history?channel=${ch.id}&limit=3`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const histData = await histRes.json();
        if (!histData.ok) continue;

        for (const msg of histData.messages || []) {
          if (msg.bot_id || msg.subtype) continue;
          messages.push({
            id: msg.ts,
            text: msg.text || "",
            channel: ch.name || ch.id,
            sender: msg.user || "unknown",
            sent_at: new Date(Number(msg.ts) * 1000).toISOString(),
            is_unread: true,
            is_mention: msg.text?.includes("<@") || false,
            is_direct_message: ch.is_im || false,
          });
        }
      } catch { continue; }
    }
  } catch (e) { console.warn("[fetcher] Slack error:", e); }

  return messages.slice(0, 10);
}

export async function fetchNotionTasks(sessionId?: string): Promise<Task[]> {
  const env = getEnv();
  const raw = env.NOTION_API_KEY || (sessionId ? getToken(sessionId, "notion") : undefined);
  const token = resolveToken(raw);
  if (!token) return [];

  const tasks: Task[] = [];

  try {
    const searchRes = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { value: "database", property: "object" },
        sort: { direction: "descending", timestamp: "last_edited_time" },
        page_size: 5,
      }),
    });
    const searchData = await searchRes.json();

    if (searchData.results) {
      for (const db of searchData.results) {
        if (db.object !== "database") continue;

        try {
          const queryRes = await fetch(`https://api.notion.com/v1/databases/${db.id}/query`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ page_size: 10 }),
          });
          const queryData = await queryRes.json();

          for (const page of queryData.results || []) {
            const props: Record<string, any> = page.properties || {};
            const titleProp: any = Object.values(props).find((p: any) => p.type === "title");
            const title = titleProp?.title?.map((t: any) => t.plain_text).join("") || "Untitled";

            const statusProp: any = Object.values(props).find((p: any) => p.type === "status" || p.type === "select");
            const status = statusProp?.status?.name || statusProp?.select?.name || "in_progress";

            const dateProp: any = Object.values(props).find((p: any) => p.type === "date");
            const dueDate = dateProp?.date?.start || null;

            tasks.push({
              id: page.id,
              title,
              due_date: dueDate,
              priority: status === "Done" || status === "Completed" ? "low" : "normal",
              status: status.toLowerCase().replace(/\s+/g, "_"),
              source: db.id,
            });
          }
        } catch { continue; }
      }
    }
  } catch (e) { console.warn("[fetcher] Notion error:", e); }

  return tasks.filter((t) => !["done", "completed"].includes(t.status));
}

export async function fetchGoogleData(sessionId?: string): Promise<{
  emails: Email[];
  meetings: CalendarEvent[];
}> {
  const raw = sessionId ? getToken(sessionId, "google") : undefined;
  const token = resolveToken(raw);
  if (!token) {
    return { emails: [], meetings: [] };
  }

  const emails: Email[] = [];
  const meetings: CalendarEvent[] = [];

  try {
    const gmailRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=5",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (gmailRes.ok) {
      const gmailData = await gmailRes.json();
      for (const msg of gmailData.messages || []) {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!detailRes.ok) continue;
        const detail = await detailRes.json();
        const headers = detail.payload?.headers || [];

        emails.push({
          id: detail.id,
          subject: headers.find((h: any) => h.name === "Subject")?.value || "(no subject)",
          sender: headers.find((h: any) => h.name === "From")?.value || "unknown",
          snippet: detail.snippet || "",
          received_at: new Date(Number(detail.internalDate)).toISOString(),
          is_unread: true,
          is_important: headers.some((h: any) => h.name === "X-Priority" && h.value === "1"),
        });
      }
    }
  } catch (e) { console.warn("[fetcher] Gmail error:", e); }

  try {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${endOfDay.toISOString()}&orderBy=startTime&singleEvents=true&maxResults=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (calRes.ok) {
      const calData = await calRes.json();
      for (const ev of calData.items || []) {
        meetings.push({
          id: ev.id,
          title: ev.summary || "Untitled Event",
          start_time: ev.start?.dateTime || ev.start?.date || "",
          end_time: ev.end?.dateTime || ev.end?.date || "",
          organizer: ev.organizer?.email || "",
          meeting_link: ev.hangoutLink || ev.conferenceData?.entryPoints?.[0]?.uri || null,
          attendee_count: ev.attendees?.length || 0,
          status: ev.status || "confirmed",
        });
      }
    }
  } catch (e) { console.warn("[fetcher] Calendar error:", e); }

  return { emails, meetings };
}
