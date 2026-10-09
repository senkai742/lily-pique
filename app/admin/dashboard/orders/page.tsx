import { createClient } from "@/utils/supabase/server";
import { Search, Filter, Download } from "lucide-react";
import OrdersTable, { type Order } from "./OrdersTable";

export default async function AdminOrders() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id, created_at,
      first_name, last_name, email, phone,
      address, city, district, postal_code, note,
      delivery_zone, subtotal, shipping, grand_total, status,
      order_items (
        id, product_name, color, color_hex, image, price, quantity
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
  }

  const rows = (orders as Order[] | null) ?? [];

  return (
    <div className="p-6 md:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {rows.length} order{rows.length !== 1 ? "s" : ""} total · click a row to see items
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 border-b border-zinc-200 px-6 py-4 sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors w-fit">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <OrdersTable orders={rows} />

        {/* Footer */}
        <div className="border-t border-zinc-100 px-6 py-4">
          <p className="text-sm text-zinc-500">Showing {rows.length} order{rows.length !== 1 ? "s" : ""}</p>
        </div>

      </div>
    </div>
  );
}
