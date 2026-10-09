import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderIdParam = searchParams.get("id")?.trim();
    const phoneParam = searchParams.get("phone")?.trim();

    if (!orderIdParam && !phoneParam) {
      return NextResponse.json(
        { error: "Please enter an Order ID or phone number." },
        { status: 400 }
      );
    }

    let query = supabase
      .from("orders")
      .select(`
        id, created_at, status, delivery_zone,
        first_name, last_name, phone,
        subtotal, shipping, grand_total, note,
        order_items (
          id, product_name, color, color_hex, image, price, quantity
        )
      `)
      .order("created_at", { ascending: false });

    if (orderIdParam) {
      const cleanId = orderIdParam.replace(/^#/, "").trim().toLowerCase();
      const isFullUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(cleanId);

      if (isFullUuid) {
        query = query.eq("id", cleanId);
      } else if (/^[0-9a-f]{1,8}$/.test(cleanId)) {
        // Range filter on UUID prefix (e.g. '7a6c3e07')
        const minUuid = cleanId.padEnd(8, "0") + "-0000-0000-0000-000000000000";
        const maxUuid = cleanId.padEnd(8, "f") + "-ffff-ffff-ffff-ffffffffffff";
        query = query.gte("id", minUuid).lte("id", maxUuid);
      } else {
        return NextResponse.json(
          { error: "Invalid Order ID format. Expected an 8-character code or full UUID." },
          { status: 400 }
        );
      }
    } else if (phoneParam) {
      const cleanPhone = phoneParam.replace(/[\s-]/g, "");
      query = query.ilike("phone", `%${cleanPhone}%`);
    }

    const { data: orders, error } = await query.limit(10);

    if (error) {
      console.error("Tracking query error:", error);
      return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: "No orders found matching your search. Please check the ID or phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Tracking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
