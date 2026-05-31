import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOAuthUrl, OAUTH_PROVIDERS } from "@/app/lib/oauth";
import { setOAuthState } from "@/app/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;
  if (!sessionId) return Response.json({ error: "No session" }, { status: 401 });

  const provider = OAUTH_PROVIDERS.github;
  const state = crypto.randomUUID();
  setOAuthState(sessionId, state, "github");

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/github/callback`;
  const url = getOAuthUrl(provider, state, redirectUri);

  redirect(url);
}
