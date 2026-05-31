import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasToken } from "@/app/lib/store";
import { hasSourceAccess } from "@/app/lib/env";
import type { SourceName, SourceStatus } from "@/app/lib/types";

const ALL_SOURCES: SourceName[] = [
  "gmail",
  "calendar",
  "notion",
  "github",
  "slack",
];

const PROVIDER_MAP: Record<string, string> = {
  gmail: "google",
  calendar: "google",
  notion: "notion",
  github: "github",
  slack: "slack",
};

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;

  const sources: SourceStatus[] = ALL_SOURCES.map((name) => {
    const oauthProvider = PROVIDER_MAP[name];
    const userConnected = sessionId ? hasToken(sessionId, oauthProvider) : false;
    const appConfigured = hasSourceAccess(name);
    const connected = userConnected || appConfigured;

    return {
      name,
      connected,
      error: connected ? undefined : "Not configured",
    };
  });

  const statusMap = sources.reduce(
    (acc, s) => ({ ...acc, [s.name]: s.connected }),
    {} as Record<string, boolean>
  );

  return NextResponse.json({ sources, status: statusMap });
}
