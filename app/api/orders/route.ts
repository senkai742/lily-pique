import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use the service role key so the insert bypasses RLS for anon users
// (alternatively you can use the anon key + an INSERT RLS policy)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
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
      delivery_zone,
      subtotal,
      shipping,
      grand_total,
      items,
    } = body;

    // Insert the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        district,
        postal_code,
        note: note || null,
        delivery_zone,
        subtotal,
        shipping,
        grand_total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Insert order items
    const orderItems = items.map((item: {
      id: string | number;
      name: string;
      color?: string;
      colorHex?: string;
      image: string;
      price: number;
      quantity: number;
    }) => ({
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
      // Order was created — don't fail the whole request, just log it
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
