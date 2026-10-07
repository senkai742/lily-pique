import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background lg:flex lg:items-center lg:min-h-[calc(100vh-64px)] py-6 sm:py-10 lg:py-0">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:gap-12 w-full">
        
        {/* Left Column (Content) */}
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold">
            Premium Clothing Collection
          </span>

          <h1 className="max-w-xl text-3xl font-normal uppercase tracking-tight text-text sm:text-5xl lg:text-6xl leading-[1.15]">
            {siteConfig.hero.title}
          </h1>

          <p className="max-w-md text-sm font-light leading-relaxed text-text/80 sm:text-lg">
            {siteConfig.hero.subtitle}
          </p>

          <div className="flex flex-col gap-3 min-[400px]:flex-row min-[400px]:gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-secondary"
            >
              Browse Collection
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href={`tel:${siteConfig.phones[0]}`}
              className="inline-flex items-center justify-center border border-gold bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text transition hover:bg-secondary"
            >
              Contact Us
            </Link>
          </div>

          {/* Brand Pillars Grid */}
          <div className="grid grid-cols-3 gap-4 border-t border-gold/30 pt-5 sm:pt-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text">
                Quality
              </h3>
              <p className="mt-0.5 text-[11px] text-text/70 font-light">
                Trusted Fabrics
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text">
                Collection
              </h3>
              <p className="mt-0.5 text-[11px] text-text/70 font-light">
                Latest Designs
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text">
                Service
              </h3>
              <p className="mt-0.5 text-[11px] text-text/70 font-light">
                Wholesale & Retail
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Image Showcase) */}
        <div className="relative mt-2 lg:mt-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary rounded-sm">
            <Image
              src="/images/hero.png"
              alt="LilyPique Collection"
              fill
              priority
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute bottom-4 left-4 border border-gold bg-background/90 backdrop-blur-md px-4 py-2.5 rounded-none shadow-sm sm:bottom-6 sm:left-6">
            <p className="text-[10px] uppercase tracking-widest text-gold">
              Explore
            </p>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text mt-0.5">
              New Arrivals
            </h3>
          </div>
        </div>

      </div>
    </section>
  );
}