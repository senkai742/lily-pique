import Image from "next/image";
import Link from "next/link";
import { Flower2, ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-24 lg:py-32">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full mix-blend-multiply blur-[120px] opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply blur-[100px] opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 z-10">

        {/* Image Showcase Column */}
        <div className="relative order-2 lg:order-1 mt-10 lg:mt-0 px-4 sm:px-0">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-3xl bg-secondary shadow-2xl shadow-primary/10 ring-1 ring-gold/20">
            <Image
              src="/images/flowerabout.png"
              alt="LilyPique Floral Studio"
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Soft inner glow overlay */}
            <div className="absolute inset-0 rounded-t-[12rem] rounded-b-3xl ring-1 ring-inset ring-white/30 pointer-events-none" />
          </div>

          <div className="absolute -bottom-6 -right-4 sm:-bottom-6 sm:-right-6 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-xl shadow-black/5 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 text-primary">
                <Flower2 size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                  Experience
                </p>
                <h3 className="text-sm font-bold tracking-tight text-text mt-0.5">
                  Artisan Floristry
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="space-y-8 sm:space-y-10 order-1 lg:order-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/30 backdrop-blur-sm px-4 py-1.5 shadow-sm">
              <Flower2 size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                About Our Studio
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-text leading-[1.2]">
              <span className="block mb-2">Crafting Beauty</span>
              <span className="block font-serif italic text-primary">Through Flowers</span>
            </h2>
          </div>

          <p className="text-base font-light leading-relaxed text-text/80 sm:text-lg max-w-xl">
            LilyPique offers a curated collection of fresh, handcrafted floral arrangements for every occasion. We focus on premium blooms, artistic design, and bringing natural elegance to your everyday life.
          </p>

          {/* Action Button */}
          <div className="pt-4">
            <Link
              href="/about"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-text hover:shadow-text/20 hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Discover Our Story
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}