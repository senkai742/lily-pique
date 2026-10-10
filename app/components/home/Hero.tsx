import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden aesthetic-bg lg:flex lg:items-center lg:min-h-[calc(100vh-80px)] pt-8 pb-12 sm:pt-16 sm:pb-20 lg:py-0">
      
      {/* Decorative blurred background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-secondary/40 rounded-full mix-blend-multiply blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-gold/20 rounded-full mix-blend-multiply blur-[100px] opacity-70 pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 w-full z-10">
        
        {/* Left Column (Content) */}
        <div className="space-y-8 sm:space-y-10 lg:pr-8">

          <Image src="/images/logo.png" alt="LilyPique" width={150} height={150} className="mx-auto md:mx-0" />
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/40 backdrop-blur-md px-4 py-1.5 shadow-sm">
            <Flower2 size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-text">
              Gift Worthy Premium Bouquet 
            </span>
          </div>

          {/* Typography */}
          <h1 className="max-w-2xl text-4xl font-light tracking-tight text-text sm:text-6xl lg:text-7xl leading-[1.1]">
            <span className="block mb-2 text-text/90">Fresh & Elegant</span>
            <span className="block font-serif italic text-primary">Floral Designs</span>
          </h1>

          <p className="max-w-md text-base font-light leading-relaxed text-text/80 sm:text-lg">
            {siteConfig.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-text hover:shadow-text/20 hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Browse Collection
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`tel:${siteConfig.phones[0]}`}
              className="inline-flex items-center justify-center rounded-full border border-gold/50 bg-white/50 backdrop-blur-sm px-8 py-4 text-xs font-semibold uppercase tracking-widest text-text transition-all hover:bg-secondary hover:border-primary hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>

          {/* Brand Pillars Grid */}
          <div className="grid grid-cols-3 gap-6 border-t border-gold/20 pt-8 mt-8">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Quality</h3>
              <p className="text-xs text-text/60 font-light">Fresh Blooms</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Artistry</h3>
              <p className="text-xs text-text/60 font-light">Custom Bouquets</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Service</h3>
              <p className="text-xs text-text/60 font-light">Event & Everyday</p>
            </div>
          </div>
        </div>

        {/* Right Column (Image Showcase) */}
        <div className="relative mt-12 lg:mt-0 px-4 sm:px-0">
          
          {/* Main Image Container - Arch Shape */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[3/4] overflow-hidden rounded-t-[12rem] rounded-b-3xl bg-secondary shadow-2xl shadow-primary/20 ring-1 ring-white/50">
            <Image
              src="/images/hero-floral.png"
              alt="LilyPique Floral Arrangements"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Soft inner glow overlay */}
            <div className="absolute inset-0 rounded-t-[12rem] rounded-b-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />
          </div>

          {/* Floating Glass Card */}
          <div className="absolute -bottom-6 -left-4 sm:bottom-12 sm:-left-12 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-black/5 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Flower2 size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                  Handcrafted
                </p>
                <h3 className="text-sm font-bold tracking-tight text-text mt-0.5">
                  New Arrivals
                </h3>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
}