import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary via-[#c49ecb] to-[#a070af] px-8 py-20 text-center lg:px-20 shadow-2xl shadow-primary/25 ring-1 ring-white/20">
          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/70">
              Start Shopping
            </p>

            <h2 className="mt-4 text-4xl font-light text-white lg:text-5xl leading-tight">
              <span className="block">Find Your Perfect</span>
              <span className="block font-serif italic mt-1">Floral Arrangement</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-white/90 sm:text-lg">
              Browse our latest collection or contact us for custom designs and event inquiries. Let us craft something unforgettable for you.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary shadow-lg transition hover:bg-secondary hover:-translate-y-0.5"
              >
                Browse Products
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href={`tel:${siteConfig.phones[0]}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm shadow-sm transition hover:bg-white/20 hover:-translate-y-0.5"
              >
                <Phone size={14} />
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}