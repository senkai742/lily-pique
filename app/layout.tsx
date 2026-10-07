import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { colors } from "../config/colors";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-background': colors.background,
        '--color-text': colors.text,
        '--color-gold': colors.gold,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col bg-background text-text">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
