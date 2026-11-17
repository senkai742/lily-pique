import { orderDatabase, rupantorRequest } from "@/lib/rupantorpay";
import { VIP_FEE } from "@/config/vip";

export async function verifyMembershipPayment(id: string, token: string, transactionId: string) {
  const db = orderDatabase();
  const { data: membership, error } = await db.from("vip_memberships")
    .select("id, status, fee, payment_method, payment_transaction_id")
    .eq("id", id).eq("payment_token", token).single();
  if (error || !membership) throw new Error("Membership not found");
  if (membership.status === "active") return true;
  const payment = await rupantorRequest("verify-payment", { transaction_id: transactionId });
  if (payment.status !== "COMPLETED") return false;
  const metadata = typeof payment.metadata === "string" ? JSON.parse(payment.metadata) : payment.metadata;
  if (payment.transaction_id !== transactionId || payment.currency !== "BDT" ||
      payment.payment_method?.toLowerCase() !== membership.payment_method ||
      metadata?.membership_id !== id || metadata?.payment_token !== token ||
      !Number.isFinite(Number(payment.amount)) || Math.round(Number(payment.amount) * 100) !== VIP_FEE * 100 ||
      Number(membership.fee) !== VIP_FEE) throw new Error("Membership payment mismatch");
  const { data: activated, error: updateError } = await db.from("vip_memberships").update({
    status: "active", payment_transaction_id: transactionId, activated_at: new Date().toISOString(),
  }).eq("id", id).eq("status", "pending").select("id").maybeSingle();
  if (updateError) throw updateError;
  if (activated) return true;
  const { data: latest, error: readError } = await db.from("vip_memberships").select("status").eq("id", id).single();
  if (readError || latest?.status !== "active") throw new Error("Membership activation failed");
  return true;
}
