import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Google redirects here (via Supabase) with a one-time code to exchange for a session. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  // Only allow same-site relative redirects.
  if (!next.startsWith("/") || next.startsWith("//")) next = "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
