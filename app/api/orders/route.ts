import { NextRequest, NextResponse } from "next/server";
import { orderDatabase, paymentOrigin, rupantorRequest } from "@/lib/rupantorpay";
import { deliveryCharges } from "@/config/order-policy";
import { customerContext } from "@/lib/customer";
import { validDeliveryDate, vipDiscount } from "@/config/vip";
import { randomUUID } from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const supabase = orderDatabase();
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      district,
      postal_code,
      note,
      items,
    } = body;

    const { user, membership } = await customerContext();
    const isVip = membership?.status === "active";
    if (!validDeliveryDate(body.delivery_date)) {
      return NextResponse.json({ error: "Choose a delivery date at least 4 days in advance." }, { status: 400 });
    }
    const noteCard = body.note_card_message ?? "";
    const preferredTime = body.preferred_delivery_time ?? "";
    if (typeof noteCard !== "string" || noteCard.length > 500 || typeof preferredTime !== "string" || preferredTime.length > 120 || (!isVip && (noteCard.trim() || preferredTime.trim()))) {
      return NextResponse.json({ error: "Please check your member note card and delivery preference." }, { status: 400 });
    }
    const deliveryZone = body.delivery_zone;
    if ((deliveryZone !== "inside" && deliveryZone !== "outside") || body.policy_accepted !== true) {
      return NextResponse.json({ error: "Please select a delivery area and agree to the order policies." }, { status: 400 });
    }

    const paymentMethod = body.payment_method ?? "bkash";
    if (!["bkash", "nagad"].includes(paymentMethod) ||
        ![first_name, last_name, email, phone, address, city, district, postal_code]
          .every(value => typeof value === "string" && value.trim().length > 0 && value.length <= 500) ||
        !Array.isArray(items) || items.length === 0 || items.length > 100) {
      return NextResponse.json({ error: "Please check your contact details and cart." }, { status: 400 });
    }
    if (!process.env.RUPANTORPAY_API_KEY || !process.env.SITE_URL) {
      return NextResponse.json({ error: "Online payment is currently unavailable. Please try again later." }, { status: 503 });
    }
    const pricedItems = [];
    for (const item of items) {
      const productId = String(item.id).slice(0, 36);
      if (!/^[0-9a-f-]{36}$/i.test(productId) || typeof item.color !== "string" ||
          !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
      }
      const [{ data: product, error: productError }, { data: variant, error: variantError }] = await Promise.all([
        supabase.from("products").select("id, name, vip_early_access").eq("id", productId).eq("status", "active").single(),
        supabase.from("product_variants").select("price, color, hex_code, images")
          .eq("product_id", productId).eq("color", item.color).single(),
      ]);
      if (productError || variantError || !product || !variant || (product.vip_early_access && !isVip) || !Number.isFinite(Number(variant.price)) || Number(variant.price) <= 0) {
        return NextResponse.json({ error: "A product is no longer available. Please refresh your cart." }, { status: 400 });
      }
      pricedItems.push({ id: product.id, name: product.name, color: variant.color,
        colorHex: variant.hex_code, image: variant.images?.[0] ?? null,
        price: Number(variant.price), quantity: item.quantity });
    }
    const subtotal = pricedItems.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100;
    const shipping = deliveryCharges[deliveryZone as keyof typeof deliveryCharges];
    const discount = vipDiscount(subtotal, isVip);
    const grand_total = Math.round((subtotal - discount + shipping) * 100) / 100;
    if (typeof body.grand_total !== "number" || !Number.isFinite(body.grand_total) || Math.round(body.grand_total * 100) !== Math.round(grand_total * 100)) {
      return NextResponse.json({ error: "Your prices or membership status changed. Refresh checkout before paying." }, { status: 409 });
    }
    const paymentToken = randomUUID();

    // Insert the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        vip_member: isVip,
        vip_discount: discount,
        note_card_message: isVip ? noteCard.trim() || null : null,
        delivery_date: body.delivery_date,
        preferred_delivery_time: isVip ? preferredTime.trim() || null : null,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        district,
        postal_code,
        note: note || null,
        delivery_zone: deliveryZone,
        subtotal,
        shipping,
        grand_total,
        status: "pending",
        payment_method: paymentMethod,
        payment_status: "pending",
        payment_token: paymentToken,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Insert order items
    const orderItems = pricedItems.map((item) => ({
      order_id: order.id,
      product_id: String(item.id),
      product_name: item.name,
      color: item.color || null,
      color_hex: item.colorHex || null,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
    }

    {
      try {
        const origin = paymentOrigin();
        const params = new URLSearchParams({ order: order.id, token: paymentToken! });
        const resultUrl = `${origin}/checkout/payment?${params}`;
        const payment = await rupantorRequest("checkout", {
          fullname: `${first_name} ${last_name}`, email, amount: String(grand_total),
          success_url: resultUrl, cancel_url: resultUrl,
          webhook_url: `${origin}/api/payments/rupantorpay?${params}`,
          metadata: { order_id: order.id, payment_token: paymentToken, phone },
        });
        if (![true, 1].includes(payment.status) || typeof payment.payment_url !== "string") throw new Error("Checkout failed");
        const paymentUrl = new URL(payment.payment_url);
        if (paymentUrl.protocol !== "https:" || paymentUrl.hostname !== "payment.rupantorpay.com") throw new Error("Invalid payment URL");
        return NextResponse.json({ orderId: order.id, paymentUrl: paymentUrl.href }, { status: 201 });
      } catch {
        // Retain the order: a provider timeout can occur after a payment session is created.
        return NextResponse.json({ error: "Unable to start payment. Please try again.", orderId: order.id }, { status: 502 });
      }
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
