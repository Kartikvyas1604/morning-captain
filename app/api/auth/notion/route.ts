import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOAuthUrl, isProviderConfigured, OAUTH_PROVIDERS } from "@/app/lib/oauth";
import { setOAuthState } from "@/app/lib/store";

export async function GET() {
  const provider = OAUTH_PROVIDERS.notion;
  if (!isProviderConfigured(provider)) redirect("/settings?error=not_configured&provider=notion");

  const cookieStore = await cookies();
  let sessionId = cookieStore.get("mc_session")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("mc_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  const state = crypto.randomUUID();
  setOAuthState(sessionId, state, "notion");

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/notion/callback`;
  const url = getOAuthUrl(provider, state, redirectUri);

  redirect(url);
}
