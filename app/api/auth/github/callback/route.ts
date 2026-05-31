import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OAUTH_PROVIDERS } from "@/app/lib/oauth";
import { exchangeCode } from "@/app/lib/oauth";
import { getOAuthState, removeOAuthState, setToken } from "@/app/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;

  if (error || !sessionId || !code || !state) {
    redirect("/settings?error=auth_failed");
  }

  const savedState = getOAuthState(sessionId, "github");
  removeOAuthState(sessionId, "github");

  if (state !== savedState) {
    redirect("/settings?error=state_mismatch");
  }

  try {
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${appUrl}/api/auth/github/callback`;
    const tokens = await exchangeCode(OAUTH_PROVIDERS.github, code, redirectUri);

    if (tokens.access_token) {
      setToken(sessionId, "github", JSON.stringify(tokens));
    }
  } catch {
    redirect("/settings?error=token_exchange_failed");
  }

  redirect("/settings?connected=github");
}
