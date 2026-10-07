import { Search, Filter, MoreVertical, Mail, Phone } from "lucide-react";

export default function AdminCustomers() {
  const customers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+880 1711 223344", orders: 3, spent: "৳ 12,500", lastOrder: "Oct 7, 2026" },
    { id: 2, name: "Michael Chen", email: "m.chen@example.com", phone: "+880 1822 334455", orders: 1, spent: "৳ 6,200", lastOrder: "Oct 7, 2026" },
    { id: 3, name: "Emma Davis", email: "emma.d@example.com", phone: "+880 1933 445566", orders: 5, spent: "৳ 24,100", lastOrder: "Oct 6, 2026" },
    { id: 4, name: "James Wilson", email: "j.wilson99@example.com", phone: "+880 1644 556677", orders: 1, spent: "৳ 5,800", lastOrder: "Oct 5, 2026" },
    { id: 5, name: "Olivia Brown", email: "olivia.b@example.com", phone: "+880 1555 667788", orders: 2, spent: "৳ 15,400", lastOrder: "Oct 5, 2026" },
  ];

  return (
    <div className="p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Guest Customers</h1>
          <p className="mt-1 text-sm text-zinc-500">View customer details collected from guest checkouts.</p>
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
              placeholder="Search by name, email, or phone..." 
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
                <th className="px-6 py-4 font-medium whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Contact Info</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Total Orders</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Total Spent</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Last Order</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-zinc-900">{customer.name}</span>
                    <span className="block mt-0.5 text-xs text-zinc-400">Guest Checkout</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Mail size={14} className="text-zinc-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Phone size={14} className="text-zinc-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-medium text-xs">
                      {customer.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{customer.spent}</td>
                  <td className="px-6 py-4 text-zinc-500">{customer.lastOrder}</td>
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
          <p className="text-sm text-zinc-500">Showing 1 to 5 of 892 guest records</p>
          <div className="flex gap-2">
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50" disabled>Prev</button>
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
