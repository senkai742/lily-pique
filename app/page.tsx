import Link from "next/link";
import { Truck } from "lucide-react";
import { freeDeliveryMessage } from "@/config/order-policy";
import Hero from "@/app/components/home/Hero";
import ProductSection from "@/app/components/home/ProductsSection";
import VipSection from "@/app/components/home/VipSection";
import AboutSection from "@/app/components/home/AboutSection";
import ContactSection from "@/app/components/home/ContactSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Link href="/delivery-returns" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-y border-primary/15 bg-secondary/25 px-5 py-3 text-center text-sm font-medium text-text hover:underline">
        <Truck size={18} aria-hidden="true" />
        {freeDeliveryMessage}
      </Link>

      <ProductSection />

      <VipSection />

      <AboutSection />

      <ContactSection />
    </>
  );
}