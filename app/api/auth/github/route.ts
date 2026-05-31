import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOAuthUrl, isProviderConfigured, OAUTH_PROVIDERS } from "@/app/lib/oauth";
import { setOAuthState } from "@/app/lib/store";

export async function GET() {
  const provider = OAUTH_PROVIDERS.github;
  if (!isProviderConfigured(provider)) {
    return new Response(
      setupPage("github", "GitHub",
        `<ol>
          <li>Go to <a href="https://github.com/settings/developers">GitHub Settings → Developer Settings</a></li>
          <li>Create a new OAuth App</li>
          <li>Set Homepage URL to <code>http://localhost:3000</code></li>
          <li>Set Authorization callback URL to <code>http://localhost:3000/api/auth/github/callback</code></li>
          <li>Copy the Client ID and generate a Client Secret</li>
        </ol>`
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  }

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
  setOAuthState(sessionId, state, "github");

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/github/callback`;
  const url = getOAuthUrl(provider, state, redirectUri);

  redirect(url);
}

function setupPage(id: string, name: string, steps: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Setup ${name} · Morning Captain</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#0a0e14; color:#e8e6e3; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
.card { background:linear-gradient(145deg,#14181f,#0f1319); border:1px solid rgba(201,147,58,0.15); border-radius:24px; padding:48px 40px 40px; max-width:520px; width:100%; box-shadow:0 24px 80px rgba(0,0,0,0.5); }
h1 { font-size:22px; font-weight:600; margin-bottom:4px; }
.sub { color:#8b8f96; font-size:14px; margin-bottom:20px; }
ol { text-align:left; font-size:13px; line-height:1.7; padding-left:20px; }
li { margin-bottom:8px; color:#c8c6c3; }
a { color:#2dd4bf; }
code { background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:4px; font-size:12px; color:#c9933a; word-break:break-all; }
.env-box { background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; margin:16px 0; font-family:monospace; font-size:12px; }
.env-box .line { padding:2px 0; }
.env-box .key { color:#c9933a; }
.env-box .val { color:#8b8f96; }
.btn { display:inline-block; padding:12px 24px; border-radius:12px; font-size:14px; font-weight:600; text-decoration:none; cursor:pointer; transition:all 0.2s; margin-top:8px; }
.btn-primary { background:linear-gradient(135deg,#c9933a,#2dd4bf); color:#0a0e14; }
.btn-primary:hover { box-shadow:0 0 32px rgba(201,147,58,0.3); }
.btn-back { background:transparent; color:#8b8f96; border:1px solid rgba(255,255,255,0.06); margin-left:8px; }
.btn-back:hover { background:rgba(255,255,255,0.04); }
</style>
</head>
<body>
<div class="card">
<h1>🔑 Setup ${name}</h1>
<p class="sub">Add OAuth credentials to <code>.env.local</code> to connect ${name}.</p>
${steps}
<div class="env-box">
<div class="line"><span class="key">${id.toUpperCase()}_CLIENT_ID</span>=<span class="val">your-client-id</span></div>
<div class="line"><span class="key">${id.toUpperCase()}_CLIENT_SECRET</span>=<span class="val">your-client-secret</span></div>
</div>
<p style="font-size:12px;color:#8b8f96;margin-bottom:16px;">After updating <code>.env.local</code>, restart the dev server and try again.</p>
<div>
<a href="/settings" class="btn btn-back">Back to Settings</a>
</div>
</div>
</body>
</html>`;
}
