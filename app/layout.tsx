import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { colors } from "../config/colors";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LilyPique",
  description: "Premium clothing and apparel for modern lifestyles",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
      style={{
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-background': colors.background,
        '--color-text': colors.text,
        '--color-gold': colors.gold,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col bg-background text-text font-sans">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
