"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function PaymentResultPage() {
  const { clearCart } = useCart();
  const clearCartRef = useRef(clearCart);
  useEffect(() => { clearCartRef.current = clearCart; }, [clearCart]);
  const [message, setMessage] = useState("Checking your payment…");
  const [orderId, setOrderId] = useState("");
  const [retry, setRetry] = useState(0);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let active = true;
    async function checkPayment() {
    await Promise.resolve();
    if (!active) return;
    const params = new URLSearchParams(window.location.search);
    const order = params.get("order") || "";
    const token = params.get("token") || "";
    const transactionId = params.get("transactionId");
    setOrderId(order);
    if (!transactionId || !order || !token) {
      setMessage("Payment was not completed. Your cart has been kept so you can try again.");
      setChecking(false);
      return;
    }
    setChecking(true);
    fetch(`/api/payments/rupantorpay?${new URLSearchParams({ order, token })}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (active && result.paid) {
        const savedCart = sessionStorage.getItem(`payment-cart-${order}`);
        if (savedCart && localStorage.getItem("lilypique-cart") === savedCart) clearCartRef.current();
        sessionStorage.removeItem(`payment-cart-${order}`);
      }
      if (active) setMessage(result.paid ? "Payment received. Thank you for your order!" :
        "Your payment is awaiting confirmation. Please check again shortly.");
    }).catch(() => {
      if (active) setMessage("We couldn’t confirm your payment yet. Check again or contact us with your order reference before paying again.");
    }).finally(() => { if (active) setChecking(false); });
    }
    void checkPayment();
    return () => { active = false; };
  }, [retry]);
  return <main className="mx-auto min-h-[65vh] max-w-xl px-6 py-20 text-center">
    <h1 className="text-3xl font-serif">bKash Payment</h1>
    <p role="status" className="my-6">{message}</p>
    {orderId && <p className="mb-6 break-all">Order reference: {orderId}</p>}
    <div className="flex flex-wrap justify-center gap-6">
      <button disabled={checking} onClick={() => setRetry((value) => value + 1)} className="text-primary underline disabled:opacity-50">Check payment again</button>
      {orderId && <Link href={`/track-order?id=${orderId}`} className="text-primary underline">Track order</Link>}
      <Link href="/checkout" className="text-primary underline">Back to checkout</Link>
    </div>
  </main>;
}
