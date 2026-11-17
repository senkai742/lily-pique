import { NextRequest } from "next/server";
import { verifyMembershipPayment } from "@/lib/vip-payments";

export async function POST(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("membership");
    const token = request.nextUrl.searchParams.get("token");
    const body = await request.json();
    const transactionId = body.transaction_id || body.transactionId;
    const uuid = /^[0-9a-f-]{36}$/i;
    if (!id || !token || !uuid.test(id) || !uuid.test(token) || typeof transactionId !== "string" || !transactionId || transactionId.length > 100) return Response.json({ error: "Invalid payment request" }, { status: 400 });
    return Response.json({ paid: await verifyMembershipPayment(id, token, transactionId) });
  } catch {
    return Response.json({ error: "Unable to verify membership payment. Please try again." }, { status: 502 });
  }
}
