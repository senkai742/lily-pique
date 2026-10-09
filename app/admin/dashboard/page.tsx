import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

function getTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real data in parallel
  const [ordersRes, productsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, grand_total, status, first_name, last_name, phone, email, created_at, order_items(product_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, status"),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.grand_total) || 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.filter((p) => (p.status || "").toLowerCase() === "active").length;

  // Unique customers based on phone or email
  const customerSet = new Set(
    orders.map((o) => (o.phone?.trim() || o.email?.trim() || "").toLowerCase()).filter(Boolean)
  );
  const totalCustomers = customerSet.size;

  const stats = [
    { 
      name: "Total Revenue", 
      value: `৳ ${totalRevenue.toLocaleString("en-BD")}`, 
      icon: DollarSign, 
      subtext: `${totalOrders} order${totalOrders !== 1 ? "s" : ""} placed` 
    },
    { 
      name: "Orders", 
      value: `${totalOrders}`, 
      icon: ShoppingBag, 
      subtext: orders.filter(o => (o.status || "").toLowerCase() === "pending").length + " pending confirmation" 
    },
    { 
      name: "Active Products", 
      value: `${activeProducts}`, 
      icon: Package, 
      subtext: `${products.length} total in catalog` 
    },
    { 
      name: "Total Customers", 
      value: `${totalCustomers}`, 
      icon: Users, 
      subtext: "Unique checkout buyers" 
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const STATUS_STYLES: Record<string, string> = {
    delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped:    "bg-purple-50 text-purple-700 border-purple-200",
    cancelled:  "bg-red-50 text-red-700 border-red-200",
    pending:    "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Live overview of your store&apos;s revenue, orders, and customer activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/dashboard/products/new"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                  <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-600">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-3xl font-bold text-zinc-900">{stat.value}</h2>
                  <p className="mt-1 text-xs text-zinc-400 font-medium">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          
          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">Recent Orders</h3>
              <span className="text-xs font-medium text-zinc-400">
                {recentOrders.length} latest
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Customer</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Items</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => {
                      const statusKey = (order.status || "pending").toLowerCase();
                      const itemsText = (order.order_items || [])
                        .map((i: { product_name: string }) => i.product_name)
                        .filter(Boolean)
                        .join(", ") || "Order items";

                      return (
                        <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-600">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-zinc-900">
                              {order.first_name} {order.last_name}
                            </div>
                            <div className="text-xs text-zinc-400">{order.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-zinc-600 max-w-xs truncate text-xs" title={itemsText}>
                            {itemsText}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border capitalize ${
                              STATUS_STYLES[statusKey] ?? STATUS_STYLES.pending
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">
                            ৳ {Number(order.grand_total).toLocaleString("en-BD")}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 text-center">
              <Link href="/admin/dashboard/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                View All Orders
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-5">
              <h3 className="text-lg font-semibold text-zinc-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <p className="text-center text-sm text-zinc-400 py-6">
                  No activity yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {orders.slice(0, 4).map((order, i, arr) => (
                    <div key={order.id} className="flex gap-4 relative">
                      {i !== arr.length - 1 && (
                        <div className="absolute left-4 top-10 h-full w-[2px] bg-zinc-100" />
                      )}
                      
                      <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 shadow-sm ring-4 ring-white">
                        <Clock size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                          <span className="font-semibold text-zinc-900">New order #{order.id.slice(0, 8).toUpperCase()}</span> received from {order.first_name} {order.last_name} for ৳ {Number(order.grand_total).toLocaleString("en-BD")}
                        </p>
                        <p className="mt-1 text-xs font-medium text-zinc-400">
                          {getTimeAgo(order.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
