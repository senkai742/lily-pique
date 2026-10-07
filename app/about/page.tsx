import AboutHero from "@/app/components/about/AboutHero";
import StorySection from "@/app/components/about/StorySection";
import FeaturesSection from "@/app/components/about/FeaturesSection";
import CategoryShowcase from "@/app/components/about/CategoryShowcase";
import CTASection from "@/app/components/about/CTASection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <FeaturesSection />
      <CategoryShowcase />
      <CTASection />
    </>
  );
}