import { NextResponse } from "next/server";
import { isProviderConfigured, OAUTH_PROVIDERS } from "@/app/lib/oauth";

export async function GET() {
  const configured: Record<string, boolean> = {};
  for (const [key, provider] of Object.entries(OAUTH_PROVIDERS)) {
    configured[key] = isProviderConfigured(provider);
  }
  return NextResponse.json({ configured });
}
