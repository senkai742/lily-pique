"use server";
import { createClient } from "@/utils/supabase/server";
import { orderDatabase } from "@/lib/rupantorpay";
import { verifyMembershipPayment } from "@/lib/vip-payments";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function adminClient() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  const { data: admin } = await db.rpc("is_admin");
  if (!user || !admin) throw new Error("Admin access required");
  return db;
}

export async function setEarlyAccess(data: FormData) {
  const db = await adminClient();
  const id = data.get("product_id");
  if (typeof id !== "string") throw new Error("Invalid product");
  const { error } = await db.from("products").update({ vip_early_access: data.get("enabled") === "true" }).eq("id", id);
  if (error) throw new Error("Unable to update early access");
  revalidatePath("/", "layout");
}

export async function confirmMembershipPayment(data: FormData) {
  await adminClient();
  const id = data.get("membership_id");
  const transaction = data.get("transaction_id");
  if (typeof id !== "string" || typeof transaction !== "string" || !transaction.trim() || transaction.length > 100) redirect("/admin/dashboard/members?result=invalid");
  let paid = false;
  try {
    const { data: member, error } = await orderDatabase().from("vip_memberships").select("payment_token").eq("id", id).single();
    if (error || !member) throw new Error("Membership not found");
    paid = await verifyMembershipPayment(id, member.payment_token, transaction.trim());
  } catch { redirect("/admin/dashboard/members?result=failed"); }
  revalidatePath("/admin/dashboard/members");
  redirect(`/admin/dashboard/members?result=${paid ? "verified" : "pending"}`);
}
