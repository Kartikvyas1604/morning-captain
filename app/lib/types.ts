export interface Email {
  id: string;
  subject: string;
  sender: string;
  snippet: string;
  received_at: string;
  is_unread: boolean;
  is_important: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  organizer: string;
  meeting_link: string | null;
  attendee_count: number;
  status: string;
}

export interface Task {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
  status: string;
  source: string;
}

export interface PullRequest {
  id: string;
  title: string;
  repository: string;
  author: string;
  status: string;
  updated_at: string;
  url: string;
}

export interface SlackMessage {
  id: string;
  text: string;
  channel: string;
  sender: string;
  sent_at: string;
  is_unread: boolean;
  is_mention: boolean;
  is_direct_message: boolean;
}

export interface BriefingData {
  emails: Email[];
  meetings: CalendarEvent[];
  tasks: Task[];
  pull_requests: PullRequest[];
  slack_messages: SlackMessage[];
}

export interface BriefingResponse {
  summary: string;
  data: BriefingData;
  sql: string;
  timestamp: string;
  source_status: Record<string, boolean>;
  ai_generated: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SourceStatus {
  name: string;
  connected: boolean;
  error?: string;
}

export type SourceName = "gmail" | "calendar" | "notion" | "github" | "slack";

export interface OAuthProviderConfig {
  name: string;
  label: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientIdEnv: string;
  clientSecretEnv: string;
}

export interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
}
