function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`[env] Missing ${key} — using placeholder in development`);
    return `dev-${key.toLowerCase()}-placeholder`;
  }
  return value;
}

function optionalEnv(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

export const env = {
  // Anthropic / Claude
  ANTHROPIC_API_KEY: requireEnv("ANTHROPIC_API_KEY"),

  // Coral
  CORAL_BINARY: optionalEnv("CORAL_BINARY", "coral"),
  CORAL_PROFILE: optionalEnv("CORAL_PROFILE", "default"),

  // Google OAuth (NextAuth)
  GOOGLE_CLIENT_ID: optionalEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: optionalEnv("GOOGLE_CLIENT_SECRET"),
  NEXTAUTH_SECRET: optionalEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: optionalEnv("NEXTAUTH_URL", "http://localhost:3000"),

  // GitHub
  GITHUB_TOKEN: optionalEnv("GITHUB_TOKEN"),

  // Notion
  NOTION_API_KEY: optionalEnv("NOTION_API_KEY"),

  // Slack
  SLACK_BOT_TOKEN: optionalEnv("SLACK_BOT_TOKEN"),

  // Feature flags
  CORAL_ENABLED: optionalEnv("CORAL_ENABLED", "true"),
} as const;

export function hasSourceAccess(source: string): boolean {
  switch (source) {
    case "gmail":
    case "calendar":
      return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
    case "github":
      return !!env.GITHUB_TOKEN;
    case "notion":
      return !!env.NOTION_API_KEY;
    case "slack":
      return !!env.SLACK_BOT_TOKEN;
    default:
      return false;
  }
}
