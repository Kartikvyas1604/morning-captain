import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

  return NextResponse.json({ sessionId });
}
