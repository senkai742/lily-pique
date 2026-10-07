import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Revenue", value: "৳ 45,231", icon: DollarSign, trend: "+20.1%", trendUp: true },
    { name: "Orders", value: "124", icon: ShoppingBag, trend: "+12.5%", trendUp: true },
    { name: "Active Products", value: "48", icon: Package, trend: "+2.4%", trendUp: true },
    { name: "Total Customers", value: "892", icon: Users, trend: "-1.1%", trendUp: false },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "Sarah Johnson", product: "Classic Blush Rose Bouquet", status: "Delivered", amount: "৳ 4,500", date: "2 mins ago" },
    { id: "#ORD-002", customer: "Michael Chen", product: "Midnight Elegance Arrangement", status: "Processing", amount: "৳ 6,200", date: "1 hour ago" },
    { id: "#ORD-003", customer: "Emma Davis", product: "Sunny Day Sunflower Mix", status: "Shipped", amount: "৳ 3,100", date: "3 hours ago" },
    { id: "#ORD-004", customer: "James Wilson", product: "Premium White Lily Box", status: "Pending", amount: "৳ 5,800", date: "5 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Welcome back! Here's an overview of your store's performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/products/new"
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
                <div className="mt-4 flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold text-zinc-900">{stat.value}</h2>
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          
          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-5">
              <h3 className="text-lg font-semibold text-zinc-900">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Customer</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Product</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-900">{order.id}</td>
                      <td className="px-6 py-4 text-zinc-600">{order.customer}</td>
                      <td className="px-6 py-4 text-zinc-600">{order.product}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border
                          ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                            'bg-orange-50 text-orange-700 border-orange-200'}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-900">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 text-center">
              <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
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
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 relative">
                    {/* Connection Line */}
                    {i !== 4 && (
                      <div className="absolute left-4 top-10 h-full w-[2px] bg-zinc-100" />
                    )}
                    
                    <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 shadow-sm ring-4 ring-white">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        <span className="font-semibold text-zinc-900">New order</span> received from Emma Davis for ৳ 4,500
                      </p>
                      <p className="mt-1 text-xs font-medium text-zinc-400">{i * 2} hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
