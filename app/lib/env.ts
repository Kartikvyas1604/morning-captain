function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.warn(`[env] Missing ${key} — using placeholder in development`);
    return `dev-${key.toLowerCase()}-placeholder`;
  }
  return value;
}

function optionalEnv(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

export function getEnv() {
  return {
    ANTHROPIC_API_KEY: requireEnv("ANTHROPIC_API_KEY"),
    CORAL_BINARY: optionalEnv("CORAL_BINARY", "coral"),
    CORAL_PROFILE: optionalEnv("CORAL_PROFILE", "default"),
    GOOGLE_CLIENT_ID: optionalEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: optionalEnv("GOOGLE_CLIENT_SECRET"),
    NEXTAUTH_SECRET: optionalEnv("NEXTAUTH_SECRET"),
    NEXTAUTH_URL: optionalEnv("NEXTAUTH_URL", "http://localhost:3000"),
    GITHUB_TOKEN: optionalEnv("GITHUB_TOKEN"),
    NOTION_API_KEY: optionalEnv("NOTION_API_KEY"),
    SLACK_BOT_TOKEN: optionalEnv("SLACK_BOT_TOKEN"),
    CORAL_ENABLED: optionalEnv("CORAL_ENABLED", "true"),
  };
}

export function hasSourceAccess(source: string): boolean {
  const e = getEnv();
  switch (source) {
    case "gmail":
    case "calendar":
      return !!(e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET);
    case "github":
      return !!e.GITHUB_TOKEN;
    case "notion":
      return !!e.NOTION_API_KEY;
    case "slack":
      return !!e.SLACK_BOT_TOKEN;
    default:
      return false;
  }
}
