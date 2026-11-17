import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (code || (tokenHash && (type === "email" || type === "signup" || type === "magiclink"))) {
    const db = await createClient();
    const { error } = code
      ? await db.auth.exchangeCodeForSession(code)
      : await db.auth.verifyOtp({ token_hash: tokenHash!, type: type as "email" | "signup" | "magiclink" });
    if (!error) return NextResponse.redirect(new URL("/account", request.url));
  }
  return NextResponse.redirect(new URL("/account?signin=expired", request.url));
}
