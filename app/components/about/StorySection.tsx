import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function StorySection() {
  return (
    <section className="py-12 sm:py-24 overflow-hidden relative">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        
        {/* Image */}
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-3xl bg-secondary shadow-2xl ring-1 ring-gold/20">
            <Image
              src="/images/about.png"
              alt={siteConfig.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 rounded-t-[10rem] rounded-b-3xl ring-1 ring-inset ring-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-4">
            Our Heritage
          </p>

          <h2 className="text-4xl font-light leading-[1.2] text-text">
            <span className="block">Artistry That Blends</span>
            <span className="block font-serif italic text-primary mt-1">Nature With Elegance</span>
          </h2>

          <p className="mt-6 text-base font-light leading-relaxed text-text/80 sm:text-lg">
            LilyPique is committed to providing handcrafted, fresh floral arrangements for every occasion. Whether you're celebrating a wedding, an anniversary, or simply bringing nature into your home, we strive to offer blooms that inspire.
          </p>

          <p className="mt-6 text-base font-light leading-relaxed text-text/80 sm:text-lg">
            We proudly serve our community with a growing collection of exquisite florals, focusing on artistic integrity, sustainability, and long-term relationships with our clients.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-gold/20 bg-secondary/10 p-6 backdrop-blur-sm">
              <h3 className="text-4xl font-serif text-primary">
                100+
              </h3>
              <p className="mt-2 text-sm font-medium text-text/70 uppercase tracking-wider">
                Unique Blooms
              </p>
            </div>
            <div className="rounded-3xl border border-gold/20 bg-secondary/10 p-6 backdrop-blur-sm">
              <h3 className="text-4xl font-serif text-primary">
                5+
              </h3>
              <p className="mt-2 text-sm font-medium text-text/70 uppercase tracking-wider">
                Curated Collections
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-text hover:shadow-text/20 hover:-translate-y-0.5"
          >
            Browse Collections
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}