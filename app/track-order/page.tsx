"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Phone,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

type OrderItem = {
  id: string;
  product_name: string;
  color: string | null;
  color_hex: string | null;
  image: string | null;
  price: number;
  quantity: number;
};

type TrackedOrder = {
  id: string;
  created_at: string;
  status: string;
  delivery_zone: string;
  first_name: string;
  last_name: string;
  phone: string;
  subtotal: number;
  shipping: number;
  grand_total: number;
  order_items: OrderItem[];
};

const STEPS = [
  { key: "pending", label: "Order Placed", desc: "Waiting for confirmation", icon: Clock },
  { key: "processing", label: "Processing", desc: "Preparing your items", icon: Package },
  { key: "shipped", label: "Shipped", desc: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", desc: "Delivered to recipient", icon: CheckCircle2 },
];

function getStepIndex(status: string) {
  const s = status.toLowerCase();
  if (s === "cancelled") return -1;
  const idx = STEPS.findIndex((step) => step.key === s);
  return idx === -1 ? 0 : idx;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || searchParams.get("phone") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Determine if looks like phone or order id
      const isDigitsOnly = /^[0-9+-\s]+$/.test(searchTerm.trim()) && searchTerm.trim().replace(/\D/g, "").length >= 7;
      const paramName = isDigitsOnly ? "phone" : "id";

      const res = await fetch(`/api/orders/track?${paramName}=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No order found with the provided details.");
        setOrders([]);
      } else {
        setOrders(data.orders || []);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchOrders(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(query);
  };

  return (
    <div className="min-h-screen aesthetic-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Customer Support
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-text">
            Track Your Order
          </h1>
          <p className="mt-2 text-sm text-text/60 max-w-md mx-auto">
            Enter your Order ID (full or short code like <span className="font-mono font-semibold">#A1B2C3D4</span>) or the phone number used during checkout.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative flex items-center rounded-2xl border border-primary/20 bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="ml-3 text-text/40 shrink-0" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. #ORD-1234 or +880 1700 000000"
              className="w-full bg-transparent px-4 py-3 text-sm text-text outline-none placeholder:text-text/40"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-text hover:shadow disabled:opacity-50 shrink-0"
            >
              {loading ? "Searching..." : "Track"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center backdrop-blur-sm mb-8">
            <XCircle className="mx-auto text-red-500 mb-2" size={32} />
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <p className="mt-1 text-xs text-red-600/80">
              Double check the Order ID from your confirmation screen or the phone number you entered.
            </p>
          </div>
        )}

        {/* Orders list */}
        {orders.length > 0 && (
          <div className="space-y-8">
            {orders.length > 1 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                <p className="text-sm font-semibold text-text">
                  Found {orders.length} orders for this search
                </p>
                <p className="text-xs text-text/60 mt-0.5">
                  Showing all your orders below (newest to oldest).
                </p>
              </div>
            )}
            {orders.map((order, orderIndex) => {
              const isCancelled = order.status.toLowerCase() === "cancelled";
              const currentStepIdx = getStepIndex(order.status);
              const displayId = `#${order.id.slice(0, 8).toUpperCase()}`;

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-primary/10 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
                >
                  {orders.length > 1 && (
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                      Order #{orderIndex + 1} of {orders.length}
                    </div>
                  )}
                  {/* Top order summary header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/10 pb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl font-bold text-text">{displayId}</span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize border ${
                          isCancelled
                            ? "bg-red-50 text-red-700 border-red-200"
                            : order.status.toLowerCase() === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : order.status.toLowerCase() === "shipped"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : order.status.toLowerCase() === "processing"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-text/50">
                        Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-text/50">Total Amount</div>
                      <div className="text-lg font-bold text-text">
                        ৳ {Number(order.grand_total).toLocaleString("en-BD")}
                      </div>
                    </div>
                  </div>

                  {/* Progress tracker */}
                  <div className="py-8">
                    {isCancelled ? (
                      <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-center">
                        <span className="font-medium text-red-600 text-sm">
                          This order was cancelled. Please contact support if you have questions.
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute top-5 left-6 right-6 h-0.5 bg-zinc-200 hidden sm:block">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{
                              width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Steps grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                          {STEPS.map((step, idx) => {
                            const Icon = step.icon;
                            const isDone = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;

                            return (
                              <div
                                key={step.key}
                                className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                              >
                                <div
                                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                    isDone
                                      ? "border-primary bg-primary text-white shadow-sm"
                                      : "border-zinc-300 bg-white text-zinc-400"
                                  } ${isCurrent ? "ring-4 ring-primary/20 scale-105" : ""}`}
                                >
                                  <Icon size={18} />
                                </div>
                                <div>
                                  <div
                                    className={`text-xs font-semibold ${
                                      isDone ? "text-text" : "text-text/40"
                                    }`}
                                  >
                                    {step.label}
                                  </div>
                                  <div className="text-[11px] text-text/50 mt-0.5">
                                    {step.desc}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items in this order */}
                  <div className="border-t border-primary/10 pt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/50 mb-3">
                      Items Ordered
                    </h3>
                    <div className="divide-y divide-zinc-100 rounded-xl border border-primary/10 bg-zinc-50/50 p-2 sm:p-3">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2.5 px-2">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-200 border border-zinc-200">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <ShoppingBag className="m-auto text-zinc-400" size={20} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-text">
                              {item.product_name}
                            </p>
                            {item.color && (
                              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text/60">
                                <span
                                  className="h-2 w-2 rounded-full border border-black/10"
                                  style={{ backgroundColor: item.color_hex || "#ccc" }}
                                />
                                {item.color}
                              </div>
                            )}
                            <p className="text-xs text-text/50">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-semibold text-text">
                            ৳ {(item.price * item.quantity).toLocaleString("en-BD")}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-text/60">
                      <div>
                        Delivery: <span className="capitalize font-medium text-text">{order.delivery_zone} Dhaka (Cash on Delivery)</span>
                      </div>
                      <div className="flex gap-4">
                        <span>Subtotal: ৳ {Number(order.subtotal).toLocaleString("en-BD")}</span>
                        <span>Shipping: ৳ {Number(order.shipping).toLocaleString("en-BD")}</span>
                        <span className="font-bold text-text">
                          Total: ৳ {Number(order.grand_total).toLocaleString("en-BD")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty initial state hint */}
        {!searched && (
          <div className="rounded-3xl border border-primary/10 bg-white/60 p-8 text-center backdrop-blur-sm">
            <ShoppingBag className="mx-auto text-primary/30 mb-3" size={40} />
            <h3 className="font-serif font-semibold text-text text-lg">Looking for an existing order?</h3>
            <p className="mt-1 text-sm text-text/60 max-w-sm mx-auto">
              Please enter the Order ID provided upon checkout or the phone number you used when placing the order.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                Browse Our Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Need Help CTA */}
        <div className="mt-12 text-center border-t border-primary/10 pt-8">
          <p className="text-xs text-text/60">
            Have questions regarding your order? Reach out to our hotline.
          </p>
          <Link
            href="tel:+8801819876543"
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-text transition-colors"
          >
            <Phone size={14} />
            Call Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen aesthetic-bg flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-text/60">Loading tracker...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
