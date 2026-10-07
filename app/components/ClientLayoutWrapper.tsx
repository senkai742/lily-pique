"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./cart/CartDrawer";
import { CartProvider } from "../context/CartContext";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Render purely the children for admin pages (no store navbar/footer/cart)
    return <>{children}</>;
  }

  // Render the public store layout
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
