import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { getEnv } from "@/app/lib/env";
import { BRIEFING_SQL } from "@/app/lib/coral";
import type { ShellQueryResult } from "@/app/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json() as { sql: string };
    const env = getEnv();

    if (env.CORAL_ENABLED !== "true") {
      return NextResponse.json({ sql, columns: [], rows: [], error: "Coral not enabled" });
    }

    const output = execSync(`${env.CORAL_BINARY} query --profile ${env.CORAL_PROFILE} --format json`, {
      input: sql,
      timeout: 10000,
      encoding: "utf-8",
    });

    const rows: Record<string, unknown>[] = JSON.parse(output);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return NextResponse.json({ sql, columns, rows });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[shell/exec] Error:", msg);
    return NextResponse.json({ sql: "", columns: [], rows: [], error: `Execution error: ${msg}` }, { status: 500 });
  }
}
