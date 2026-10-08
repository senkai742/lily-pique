"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    if (isDrawerOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl transition-transform transform border-l border-gold/20 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-5 bg-secondary/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" size={20} />
            <h2 className="font-serif text-2xl font-light text-text">Your Cart</h2>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="rounded-full p-2 text-text/60 hover:bg-white hover:text-text transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
              <ShoppingBag size={48} className="text-gold/50 mb-4" strokeWidth={1} />
              <p className="font-serif text-xl text-text">Your cart is empty.</p>
              <p className="text-sm font-light text-text/70 mt-2">
                Discover our fresh blooms and artisanal arrangements to get started.
              </p>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="mt-6 rounded-full border border-primary/30 px-6 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gold/20 bg-secondary/20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-lg leading-tight text-text line-clamp-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-text/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center rounded-full border border-gold/30 bg-white shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-text/60 hover:text-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-text/60 hover:text-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <p className="text-sm font-semibold text-text">
                      ৳ {(item.price * item.quantity).toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gold/20 bg-secondary/10 p-6">
            <div className="flex justify-between text-lg font-serif text-text mb-6">
              <span>Subtotal</span>
              <span className="font-bold">৳ {cartTotal.toLocaleString("en-BD")}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsDrawerOpen(false)}
              className="block w-full rounded-full bg-primary py-4 text-center text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-text/20 hover:bg-text"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
