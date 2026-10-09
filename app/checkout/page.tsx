"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, CheckCircle2 } from "lucide-react";

function FormField({
  label,
  id,
  type = "text",
  placeholder,
  required = true,
  half = false,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  half?: boolean;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label htmlFor={id} className="block text-sm font-medium text-text/70 mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        {number}
      </span>
      <h2 className="text-lg font-serif font-semibold text-text">{title}</h2>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<"inside" | "outside">("inside");

  const shipping = cart.length > 0 ? (deliveryZone === "inside" ? 60 : 80) : 0;
  const grandTotal = cartTotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.get("first_name"),
          last_name: data.get("last_name"),
          email: data.get("email"),
          phone: data.get("phone"),
          address: data.get("address"),
          city: data.get("city"),
          district: data.get("district"),
          postal_code: data.get("postal_code"),
          note: data.get("note"),
          delivery_zone: deliveryZone,
          subtotal: cartTotal,
          shipping,
          grand_total: grandTotal,
          items: cart,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const result = await res.json();
      if (result.orderId) {
        setCreatedOrderId(result.orderId);
      }

      clearCart();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!createdOrderId) return;
    navigator.clipboard.writeText(createdOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    const displayId = createdOrderId ? `#${createdOrderId.slice(0, 8).toUpperCase()}` : "";

    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Order Confirmed
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-text">Thank You for Your Order!</h1>
          <p className="mt-2 text-text/60 max-w-md mx-auto">
            We&apos;ve received your request and will call you soon to confirm delivery details.
          </p>
        </div>

        {createdOrderId && (
          <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-white/80 p-5 backdrop-blur-sm shadow-sm text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-text/50">
              Your Order Reference
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-zinc-50 border border-zinc-200/80 px-4 py-3">
              <div>
                <span className="font-mono text-lg font-bold text-text">{displayId}</span>
                <span className="block text-[11px] text-text/40 font-mono break-all">{createdOrderId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-text border border-zinc-200 hover:bg-zinc-100 transition-colors shadow-2xs"
              >
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-text/50">
              Save this ID or your phone number to track your order anytime.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {createdOrderId && (
            <Link
              href={`/track-order?id=${createdOrderId}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-text hover:-translate-y-0.5 shadow-md"
            >
              Track Order Status
            </Link>
          )}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/80 px-6 py-3 text-sm font-semibold text-text transition-all hover:bg-zinc-50 shadow-2xs"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <ShoppingBag size={56} className="text-primary/30" />
        <div>
          <h1 className="text-2xl font-serif font-bold text-text">Your cart is empty</h1>
          <p className="mt-2 text-text/60">Add some items before checking out.</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-text hover:-translate-y-0.5"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen aesthetic-bg py-12 px-4">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-text/50 hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to shopping
        </Link>

        <h1 className="mb-10 text-4xl font-serif font-bold text-text">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">

          {/* Left — Forms */}
          <div className="lg:col-span-2 space-y-8">

            {/* Contact */}
            <div className="rounded-2xl border border-primary/10 bg-white/80 backdrop-blur-sm p-7 shadow-sm">
              <SectionHeading number="1" title="Contact Information" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" id="first_name" placeholder="Sarah" half />
                <FormField label="Last Name" id="last_name" placeholder="Johnson" half />
                <FormField label="Email Address" id="email" type="email" placeholder="sarah@example.com" />
                <FormField label="Phone Number" id="phone" type="tel" placeholder="+880 1700 000000" />
              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-2xl border border-primary/10 bg-white/80 backdrop-blur-sm p-7 shadow-sm">
              <SectionHeading number="2" title="Delivery Address" />

              {/* Delivery Zone Selector */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                {([
                  { value: "inside", label: "Inside Dhaka", charge: "৳ 60" },
                  { value: "outside", label: "Outside Dhaka", charge: "৳ 100" },
                ] as const).map((zone) => (
                  <button
                    key={zone.value}
                    type="button"
                    onClick={() => setDeliveryZone(zone.value)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      deliveryZone === zone.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-primary/20 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm font-semibold text-text">{zone.label}</span>
                    <span className="text-xs text-text/50">Delivery: {zone.charge}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Street Address" id="address" placeholder="123 Rose Garden Lane" />
                <FormField label="City" id="city" placeholder="Dhaka" half />
                <FormField label="District" id="district" placeholder="Dhaka" half />
                <FormField label="Postal Code" id="postal_code" placeholder="1200" half />
                <FormField label="Delivery Note" id="note" placeholder="e.g. Ring the bell" required={false} half />
              </div>
            </div>

          </div>

          {/* Right — Order Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-white/90 backdrop-blur-sm p-6 shadow-sm sticky top-6">
              <h2 className="mb-5 text-lg font-serif font-semibold text-text">Order Summary</h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary/20 ring-1 ring-primary/10">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-text">
                        {item.name.replace(` - ${item.color || item.name.split(" - ").pop()}`, '')}
                      </p>
                      
                      {(item.color || item.name.includes(" - ")) && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                          <span 
                            className="w-2 h-2 rounded-full border border-black/10" 
                            style={{ backgroundColor: item.colorHex || '#ccc' }} 
                          />
                          <span>{item.color || item.name.split(" - ").pop()}</span>
                        </div>
                      )}
                      
                      <p className="mt-0.5 text-xs text-text/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-text shrink-0">
                      ৳ {(item.price * item.quantity).toLocaleString("en-BD")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-primary/10 pt-5 text-sm text-text/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳ {cartTotal.toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>৳ {shipping}</span>
                </div>
                <div className="flex justify-between border-t border-primary/10 pt-3 text-base font-bold text-text">
                  <span>Total</span>
                  <span>৳ {grandTotal.toLocaleString("en-BD")}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-zinc-50 border border-primary/10 px-4 py-2.5">
                <span className="text-base text-primary font-bold">৳</span>
                <span className="text-xs font-medium text-text/60">Cash on Delivery</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-text hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 active:scale-95"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="mt-3 text-center text-xs text-text/40">
                By placing an order you agree to our terms &amp; conditions.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
