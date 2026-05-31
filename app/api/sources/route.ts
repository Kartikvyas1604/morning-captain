import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkSourceHealth } from "@/app/lib/coral";
import { hasSourceAccess } from "@/app/lib/env";
import { hasToken } from "@/app/lib/store";
import type { SourceName, SourceStatus } from "@/app/lib/types";

const ALL_SOURCES: SourceName[] = [
  "gmail",
  "calendar",
  "notion",
  "github",
  "slack",
];

export async function GET() {
  const startTime = Date.now();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;

  try {
    const results = await Promise.allSettled(
      ALL_SOURCES.map(async (name): Promise<SourceStatus> => {
        const providerMap: Record<string, string> = {
          gmail: "google",
          calendar: "google",
          notion: "notion",
          github: "github",
          slack: "slack",
        };
        const oauthProvider = providerMap[name];

        const hasUserToken = sessionId ? hasToken(sessionId, oauthProvider) : false;
        const hasAppCreds = hasSourceAccess(name);

        if (!hasUserToken && !hasAppCreds) {
          return {
            name,
            connected: false,
            error: "Not connected",
          };
        }

        const health = await checkSourceHealth(name);
        return {
          name,
          connected: health.connected,
          error: health.error,
        };
      })
    );

    const sources: SourceStatus[] = results.map((r) => {
      if (r.status === "fulfilled") return r.value;
      return {
        name: "unknown",
        connected: false,
        error: r.reason?.message || "Unknown error",
      };
    });

    const statusMap = sources.reduce(
      (acc, s) => ({ ...acc, [s.name]: s.connected }),
      {} as Record<string, boolean>
    );

    const elapsed = Date.now() - startTime;
    console.log(`[sources] Health check completed in ${elapsed}ms`);

    return NextResponse.json({
      sources,
      status: statusMap,
    });
  } catch (err) {
    console.error("[sources] Error:", err);
    return NextResponse.json(
      {
        sources: ALL_SOURCES.map((name) => ({
          name,
          connected: false,
          error: "Health check failed",
        })),
        status: ALL_SOURCES.reduce(
          (acc, name) => ({ ...acc, [name]: false }),
          {} as Record<string, boolean>
        ),
      },
      { status: 500 }
    );
  }
}
