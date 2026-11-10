import { createClient } from "@supabase/supabase-js";

export function orderDatabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function paymentOrigin() {
  const origin = new URL(process.env.SITE_URL!);
  if (origin.protocol !== "https:" && origin.hostname !== "localhost") throw new Error("SITE_URL must use HTTPS");
  return origin.origin;
}

export async function rupantorRequest(endpoint: string, body: Record<string, unknown>) {
  if (!process.env.RUPANTORPAY_API_KEY) throw new Error("Payment configuration missing");
  const response = await fetch(`https://payment.rupantorpay.com/api/payment/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": process.env.RUPANTORPAY_API_KEY,
      "X-CLIENT": new URL(paymentOrigin()).host },
    body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error("Payment provider unavailable");
  return response.json();
}

// Redirects and webhooks are untrusted. Only the authenticated verify API can confirm payment.
export async function verifyOrderPayment(orderId: string, token: string, transactionId: string) {
  const db = orderDatabase();
  const { data: order, error } = await db.from("orders")
    .select("id, grand_total, payment_status, payment_token, payment_transaction_id")
    .eq("id", orderId).eq("payment_method", "bkash").eq("payment_token", token).single();
  if (error || !order) throw new Error("Payment order not found");
  if (order.payment_status === "paid") return true;
  const payment = await rupantorRequest("verify-payment", { transaction_id: transactionId });
  const metadata = typeof payment.metadata === "string" ? JSON.parse(payment.metadata) : payment.metadata;
  if (payment.status !== "COMPLETED") return false;
  if (payment.transaction_id !== transactionId || payment.currency !== "BDT" ||
      payment.payment_method?.toLowerCase() !== "bkash" || metadata?.order_id !== orderId ||
      metadata?.payment_token !== token || !Number.isFinite(Number(payment.amount)) ||
      Math.round(Number(payment.amount) * 100) !== Math.round(Number(order.grand_total) * 100)) {
    throw new Error("Payment details do not match order");
  }
  const { error: updateError } = await db.from("orders").update({ payment_status: "paid",
    payment_transaction_id: transactionId, paid_at: new Date().toISOString() })
    .eq("id", orderId).eq("payment_status", "pending");
  if (updateError) throw new Error("Unable to save payment confirmation");
  return true;
}
