"use client";

import { useState } from "react";
import { Search, Mail, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";

export type CustomerSummary = {
  id: string; // phone or email
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
};

export default function CustomersTable({ customers }: { customers: CustomerSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-zinc-200 px-6 py-4 sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div className="text-xs text-zinc-500 font-medium">
          Showing {filtered.length} of {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </div>
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
              <th className="px-6 py-4 font-medium whitespace-nowrap text-right">View Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-zinc-400">
                  {customers.length === 0 ? "No customer records yet." : "No customers match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-zinc-900">{customer.name}</span>
                    <span className="block mt-0.5 text-xs text-zinc-400">Guest Checkout</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 text-xs">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Mail size={14} className="text-zinc-400" />
                          <a href={`mailto:${customer.email}`} className="hover:underline">
                            {customer.email}
                          </a>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Phone size={14} className="text-zinc-400" />
                          <a href={`tel:${customer.phone}`} className="hover:underline">
                            {customer.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-semibold text-xs">
                      {customer.ordersCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    ৳ {customer.totalSpent.toLocaleString("en-BD")}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 whitespace-nowrap text-xs">
                    {customer.lastOrderDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/track-order?phone=${encodeURIComponent(customer.phone)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100 transition-colors"
                      target="_blank"
                    >
                      <ShoppingBag size={13} />
                      Track
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 px-6 py-4 flex items-center justify-between text-xs text-zinc-500">
        <p>Customers are automatically aggregated from verified checkout submissions.</p>
      </div>
    </div>
  );
}
