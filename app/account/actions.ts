"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const db = await createClient();
  await db.auth.signOut();
  redirect("/account");
}
