import { createClient } from "@/utils/supabase/server";

export async function customerContext() {
  const db = await createClient();
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) return { db, user: null, membership: null };
  const { data: membership, error } = await db.from("vip_memberships")
    .select("id, full_name, phone, status, activated_at, payment_method, checkout_url")
    .eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Unable to load membership. Please try again.");
  return { db, user, membership };
}
