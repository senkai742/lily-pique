import { randomUUID } from "node:crypto";
import { customerContext } from "@/lib/customer";
import { orderDatabase, paymentOrigin, rupantorRequest } from "@/lib/rupantorpay";
import { normalizePhone, VIP_FEE } from "@/config/vip";

export async function POST(request: Request) {
  try {
    const { user, membership } = await customerContext();
    if (!user?.email || !user.email_confirmed_at) return Response.json({ error: "Please sign in with a verified email first." }, { status: 401 });
    if (membership?.status === "active") return Response.json({ error: "Your lifetime membership is already active." }, { status: 409 });
    if (membership) {
      return membership.checkout_url ? Response.json({ paymentUrl: membership.checkout_url }) : Response.json({ error: "Your payment session is awaiting confirmation. Contact us before starting another payment." }, { status: 409 });
    }
    if (!process.env.RUPANTORPAY_API_KEY || !process.env.SITE_URL) return Response.json({ error: "Membership payments are currently unavailable." }, { status: 503 });
    const body = await request.json();
    const phone = typeof body.phone === "string" ? normalizePhone(body.phone) : null;
    if (!phone || typeof body.full_name !== "string" || !body.full_name.trim() || body.full_name.length > 120 || !["bkash", "nagad"].includes(body.payment_method) || body.terms_accepted !== true) {
      return Response.json({ error: "Enter your name, a valid Bangladesh phone number, and accept the member terms." }, { status: 400 });
    }
    const db = orderDatabase();
    const token = randomUUID();
    // Unique user/phone constraints reserve one lifetime membership, including concurrent requests.
    const { data: row, error } = await db.from("vip_memberships").insert({
      user_id: user.id, full_name: body.full_name.trim(), phone, email: user.email,
      fee: VIP_FEE, payment_method: body.payment_method, payment_token: token,
    }).select("id").single();
    if (error || !row) return Response.json({ error: "A membership registration already exists for this account or phone. Refresh your account or contact us." }, { status: 409 });
    const origin = paymentOrigin();
    const params = new URLSearchParams({ membership: row.id, token });
    const resultUrl = `${origin}/checkout/payment?${params}`;
    try {
      const payment = await rupantorRequest("checkout", {
        fullname: body.full_name.trim(), email: user.email, amount: String(VIP_FEE),
        success_url: resultUrl, cancel_url: resultUrl,
        webhook_url: `${origin}/api/payments/vip?${params}`,
        metadata: { membership_id: row.id, payment_token: token, phone },
      });
      if (![true, 1].includes(payment.status) || typeof payment.payment_url !== "string") throw new Error("Checkout failed");
      const url = new URL(payment.payment_url);
      if (url.protocol !== "https:" || url.hostname !== "payment.rupantorpay.com") throw new Error("Invalid payment URL");
      const { error: saveError } = await db.from("vip_memberships").update({ checkout_url: url.href }).eq("id", row.id);
      if (saveError) throw saveError;
      return Response.json({ paymentUrl: url.href }, { status: 201 });
    } catch {
      // Do not create another charge when a provider timeout may have created a session.
      return Response.json({ error: "Unable to open your payment session. Contact us before paying again; your registration has been retained." }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "Unable to register membership. Please try again later." }, { status: 500 });
  }
}
