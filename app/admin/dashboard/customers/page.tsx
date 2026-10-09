import { createClient } from "@/utils/supabase/server";
import CustomersTable, { CustomerSummary } from "./CustomersTable";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("first_name, last_name, email, phone, grand_total, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load customers from orders:", error);
  }

  // Aggregate customers by phone number (or email if phone missing)
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: string;
    lastOrderTime: number;
  }>();

  (orders || []).forEach((order) => {
    const phone = order.phone?.trim() || "";
    const email = order.email?.trim() || "";
    const key = (phone || email || "unknown").toLowerCase();

    const fullName = `${order.first_name || ""} ${order.last_name || ""}`.trim() || "Guest Customer";
    const orderDate = new Date(order.created_at);
    const orderTime = orderDate.getTime();
    const formattedDate = orderDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const existing = customerMap.get(key);
    if (!existing) {
      customerMap.set(key, {
        name: fullName,
        email: email,
        phone: phone,
        ordersCount: 1,
        totalSpent: Number(order.grand_total) || 0,
        lastOrderDate: formattedDate,
        lastOrderTime: orderTime,
      });
    } else {
      existing.ordersCount += 1;
      existing.totalSpent += Number(order.grand_total) || 0;
      // If this order is more recent, update display name, contacts, and last order date
      if (orderTime > existing.lastOrderTime) {
        existing.lastOrderTime = orderTime;
        existing.lastOrderDate = formattedDate;
        if (fullName) existing.name = fullName;
        if (email) existing.email = email;
        if (phone) existing.phone = phone;
      }
    }
  });

  const customers: CustomerSummary[] = Array.from(customerMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      ordersCount: data.ordersCount,
      totalSpent: data.totalSpent,
      lastOrderDate: data.lastOrderDate,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent); // Sort by highest spenders first

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Customers</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {customers.length} customer profile{customers.length !== 1 ? "s" : ""} collected from checkout submissions.
          </p>
        </div>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
