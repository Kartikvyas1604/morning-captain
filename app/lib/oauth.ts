import type { OAuthProviderConfig } from "./types";

export const OAUTH_PROVIDERS: Record<string, OAuthProviderConfig> = {
  github: {
    name: "github",
    label: "GitHub",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scopes: ["repo", "read:user"],
    clientIdEnv: "GITHUB_CLIENT_ID",
    clientSecretEnv: "GITHUB_CLIENT_SECRET",
  },
  slack: {
    name: "slack",
    label: "Slack",
    authorizeUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    scopes: ["channels:history", "channels:read", "users:read", "chat:write"],
    clientIdEnv: "SLACK_CLIENT_ID",
    clientSecretEnv: "SLACK_CLIENT_SECRET",
  },
  google: {
    name: "google",
    label: "Google",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
  },
  notion: {
    name: "notion",
    label: "Notion",
    authorizeUrl: "https://api.notion.com/v1/oauth/authorize",
    tokenUrl: "https://api.notion.com/v1/oauth/token",
    scopes: [],
    clientIdEnv: "NOTION_CLIENT_ID",
    clientSecretEnv: "NOTION_CLIENT_SECRET",
  },
};

export function isProviderConfigured(provider: OAuthProviderConfig): boolean {
  return !!(process.env[provider.clientIdEnv] && process.env[provider.clientSecretEnv]);
}

export function getOAuthUrl(
  provider: OAuthProviderConfig,
  state: string,
  redirectUri: string
): string {
  const params = new URLSearchParams({
    client_id: process.env[provider.clientIdEnv] || "",
    redirect_uri: redirectUri,
    response_type: "code",
    state,
    scope: provider.scopes.join(" "),
    ...(provider.name === "google" ? { access_type: "offline", prompt: "consent" } : {}),
  });
  return `${provider.authorizeUrl}?${params}`;
}

export function getClientCredentials(provider: OAuthProviderConfig): {
  clientId: string;
  clientSecret: string;
} {
  return {
    clientId: process.env[provider.clientIdEnv] || "",
    clientSecret: process.env[provider.clientSecretEnv] || "",
  };
}

export async function exchangeCode(
  provider: OAuthProviderConfig,
  code: string,
  redirectUri: string
): Promise<Record<string, string>> {
  const { clientId, clientSecret } = getClientCredentials(provider);

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (provider.name === "notion") {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers.Authorization = `Basic ${encoded}`;
  }

  const res = await fetch(provider.tokenUrl, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed for ${provider.name}: ${res.status} ${text}`);
  }

  return res.json();
}
