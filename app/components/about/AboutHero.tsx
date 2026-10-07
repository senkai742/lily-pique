import Link from "next/link";
import { Flower2, ChevronRight } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-gold/10">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute top-0 left-0 h-[400px] w-[400px] -translate-y-1/2 -translate-x-1/3 rounded-full bg-primary/10 blur-[100px] opacity-60" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] translate-y-1/3 translate-x-1/3 rounded-full bg-secondary/40 blur-[80px] opacity-60" />

      {/* Subtle floral watermark */}
      <div className="pointer-events-none absolute left-[10%] top-1/2 select-none overflow-hidden opacity-[0.03] -translate-y-1/2">
        <Flower2 size={350} strokeWidth={0.5} className="text-primary -rotate-12" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/80">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight size={12} strokeWidth={2} className="opacity-50" />
          <span className="text-primary">About Us</span>
        </div>

        {/* Title Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/30 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <Flower2 size={14} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Our Story
          </span>
        </div>

        <h1 className="mt-2 text-4xl font-light tracking-tight text-text sm:text-5xl lg:text-6xl leading-[1.1]">
          <span className="block">About</span>
          <span className="block font-serif italic text-primary mt-1">LilyPique</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-text/70 sm:text-lg">
          Crafting natural beauty and delivering fresh, elegant floral arrangements for every special moment in your life.
        </p>
      </div>
    </section>
  );
}