import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPayment } from "@/lib/rupantorpay";

export async function POST(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("order");
    const token = request.nextUrl.searchParams.get("token");
    const body = await request.json();
    const transactionId = body.transaction_id || body.transactionId;
    if (!orderId || !token || typeof transactionId !== "string" || transactionId.length > 100) {
      return NextResponse.json({ error: "Invalid payment request" }, { status: 400 });
    }
    const paid = await verifyOrderPayment(orderId, token, transactionId);
    return NextResponse.json({ paid });
  } catch {
    return NextResponse.json({ error: "Payment could not be verified. Please try again." }, { status: 502 });
  }
}
