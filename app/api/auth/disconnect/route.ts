import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { removeToken } from "@/app/lib/store";

export async function POST(request: Request) {
  const { provider } = await request.json();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  removeToken(sessionId, provider);
  return NextResponse.json({ ok: true });
}
