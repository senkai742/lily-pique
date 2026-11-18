import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { colors } from "../config/colors";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const title = "LilyPique | A Bouquet Made With Effort";
const description = "Thoughtfully handcrafted bouquets and floral arrangements for birthdays, celebrations, and everyday moments worth making special.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: "LilyPique", type: "website" },
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
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
