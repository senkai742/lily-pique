import { Search, Filter, MoreVertical, Download } from "lucide-react";

export default function AdminOrders() {
  const orders = [
    { id: "#ORD-001", date: "Oct 7, 2026", customer: "Sarah Johnson", items: 2, total: "৳ 4,500", status: "Delivered" },
    { id: "#ORD-002", date: "Oct 7, 2026", customer: "Michael Chen", items: 1, total: "৳ 6,200", status: "Processing" },
    { id: "#ORD-003", date: "Oct 6, 2026", customer: "Emma Davis", items: 3, total: "৳ 3,100", status: "Shipped" },
    { id: "#ORD-004", date: "Oct 5, 2026", customer: "James Wilson", items: 1, total: "৳ 5,800", status: "Pending" },
    { id: "#ORD-005", date: "Oct 5, 2026", customer: "Olivia Brown", items: 4, total: "৳ 12,400", status: "Delivered" },
    { id: "#ORD-006", date: "Oct 4, 2026", customer: "Daniel Taylor", items: 1, total: "৳ 2,100", status: "Cancelled" },
  ];

  return (
    <div className="p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage and track customer orders.</p>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Items</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Total</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">{order.id}</td>
                  <td className="px-6 py-4 text-zinc-500">{order.date}</td>
                  <td className="px-6 py-4 text-zinc-700">{order.customer}</td>
                  <td className="px-6 py-4 text-zinc-500">{order.items}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border
                      ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-orange-50 text-orange-700 border-orange-200'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-zinc-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">Showing 1 to 6 of 124 results</p>
          <div className="flex gap-2">
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50" disabled>Prev</button>
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
