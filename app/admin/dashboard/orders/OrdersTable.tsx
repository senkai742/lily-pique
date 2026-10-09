"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export type OrderItem = {
  id: string;
  product_name: string;
  color: string | null;
  color_hex: string | null;
  image: string | null;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postal_code: string;
  note: string | null;
  delivery_zone: string;
  subtotal: number;
  shipping: number;
  grand_total: number;
  status: string;
  order_items: OrderItem[];
};

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
  pending:    "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50/50 text-zinc-500">
          <tr>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Order ID</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Date</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Customer</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Ordered Items</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Delivery</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Total</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-4 font-medium whitespace-nowrap text-right">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-16 text-center text-zinc-400">
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const isOpen = expanded === order.id;
              const statusKey = order.status?.toLowerCase() ?? "pending";
              const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
              const items = order.order_items || [];
              const previewItems = items.slice(0, 2);
              const remainingCount = items.length - previewItems.length;

              return (
                <>
                  {/* Main row */}
                  <tr
                    key={order.id}
                    onClick={() => toggle(order.id)}
                    className={`cursor-pointer transition-colors group ${
                      isOpen ? "bg-zinc-50/90" : "hover:bg-zinc-50/60"
                    }`}
                  >
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-zinc-600">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 text-zinc-500 whitespace-nowrap">
                      {fmt(order.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-zinc-900">
                        {order.first_name} {order.last_name}
                      </div>
                      <div className="text-xs text-zinc-400">{order.phone}</div>
                    </td>

                    {/* Ordered Items Preview */}
                    <td className="px-4 py-4 min-w-[260px] max-w-sm">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          {previewItems.map((item) => (
                            <div
                              key={item.id}
                              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 shadow-xs"
                              title={`${item.product_name} (${item.quantity}x)`}
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              ) : (
                                <div className="h-full w-full bg-zinc-200" />
                              )}
                              <span className="absolute bottom-0 right-0 rounded-tl bg-black/75 px-1 py-0 text-[9px] font-bold text-white leading-tight">
                                {item.quantity}
                              </span>
                            </div>
                          ))}

                          {remainingCount > 0 && (
                            <span className="flex h-9 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-2 text-[11px] font-medium text-zinc-500">
                              +{remainingCount} more
                            </span>
                          )}

                          <div className="ml-1 min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-zinc-800">
                              {previewItems[0]?.product_name}
                              {items.length > 1 ? ` +${items.length - 1} other` : ""}
                            </p>
                            <span className="text-[11px] text-zinc-400">
                              {itemCount} total item{itemCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-zinc-500 text-xs whitespace-nowrap">
                      <div className="font-medium text-zinc-700">{order.city || "Dhaka"}</div>
                      <div className="text-zinc-400 capitalize">{order.delivery_zone} Dhaka</div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-zinc-900">
                        ৳ {Number(order.grand_total).toLocaleString("en-BD")}
                      </div>
                    </td>

                    <td 
                      className="px-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-flex items-center">
                        <select
                          value={statusKey}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-xs font-medium border capitalize outline-none transition-all focus:ring-2 focus:ring-offset-1 focus:ring-zinc-400 disabled:opacity-50 ${STATUS_STYLES[statusKey] ?? STATUS_STYLES.pending}`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-white text-zinc-800">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-2 flex items-center">
                          {updatingId === order.id ? (
                            <Loader2 size={12} className="animate-spin text-zinc-500" />
                          ) : (
                            <ChevronDown size={12} className="opacity-60" />
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(order.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100 transition-colors"
                      >
                        <span>{isOpen ? "Hide" : "View"}</span>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded items row */}
                  {isOpen && (
                    <tr key={`${order.id}-items`} className="bg-zinc-50/60">
                      <td colSpan={8} className="px-8 pb-5 pt-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Order Items
                        </div>
                        <div className="space-y-2">
                          {order.order_items?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3"
                            >
                              {/* Image */}
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-zinc-200" />
                                )}
                              </div>

                              {/* Name + color */}
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-zinc-900">
                                  {item.product_name}
                                </p>
                                {item.color && (
                                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                                    <span
                                      className="inline-block h-2.5 w-2.5 rounded-full border border-black/10"
                                      style={{ backgroundColor: item.color_hex ?? "#ccc" }}
                                    />
                                    {item.color}
                                  </div>
                                )}
                              </div>

                              {/* Qty */}
                              <div className="text-xs text-zinc-500 whitespace-nowrap">
                                Qty: <span className="font-semibold text-zinc-700">{item.quantity}</span>
                              </div>

                              {/* Price */}
                              <div className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                                ৳ {(item.price * item.quantity).toLocaleString("en-BD")}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery note */}
                        {order.note && (
                          <p className="mt-3 text-xs text-zinc-500">
                            <span className="font-medium text-zinc-700">Note:</span> {order.note}
                          </p>
                        )}

                        {/* Totals breakdown */}
                        <div className="mt-3 flex justify-end gap-6 text-xs text-zinc-500">
                          <span>Subtotal: ৳ {Number(order.subtotal).toLocaleString("en-BD")}</span>
                          <span>Shipping: ৳ {Number(order.shipping).toLocaleString("en-BD")}</span>
                          <span className="font-semibold text-zinc-900">
                            Total: ৳ {Number(order.grand_total).toLocaleString("en-BD")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
