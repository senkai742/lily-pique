import Hero from "@/app/components/home/Hero";
import ProductSection from "@/app/components/home/ProductsSection";
import AboutSection from "@/app/components/home/AboutSection";
import ContactSection from "@/app/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />

      <ProductSection />

      <AboutSection />/

      <ContactSection />
    </>
  );
}