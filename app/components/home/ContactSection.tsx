import Link from "next/link";
import { Phone, ArrowRight, Flower2, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 sm:py-16 lg:py-24">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-[130px] opacity-70" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[450px] w-[450px] rounded-full bg-primary/15 blur-[120px] opacity-60" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[100px] opacity-50" />

      {/* Subtle floral petal watermark */}
      <div className="pointer-events-none absolute right-0 top-0 select-none overflow-hidden opacity-[0.035]">
        <Flower2
          size={520}
          strokeWidth={0.5}
          className="translate-x-1/3 -translate-y-1/4 text-primary"
        />
      </div>
      <div className="pointer-events-none absolute left-0 bottom-0 select-none overflow-hidden opacity-[0.03]">
        <Flower2
          size={380}
          strokeWidth={0.5}
          className="-translate-x-1/3 translate-y-1/4 text-primary"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/40 backdrop-blur-sm px-4 py-1.5 shadow-sm">
            <Flower2 size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Get in Touch
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-light tracking-tight text-text sm:text-4xl lg:text-5xl leading-[1.2]">
            <span className="block">Let&apos;s Create Something</span>
            <span className="block font-serif italic text-primary">Beautiful Together</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-text/70 sm:text-lg">
            Whether it&apos;s a bouquet for a loved one or a full event arrangement,
            we&apos;re here to bring your floral vision to life.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 sm:mt-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#c49ecb] to-[#a070af] shadow-2xl shadow-primary/25 ring-1 ring-white/10">
          {/* Inner decorative shimmer */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

          <div className="relative grid gap-6 sm:gap-8 px-6 sm:px-10 py-8 sm:py-10 lg:grid-cols-2 lg:items-center lg:gap-12">

            {/* Left text */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">
                Ready to order?
              </p>
              <h3 className="mt-2 text-2xl font-light text-white sm:text-3xl leading-snug">
                <span className="block">Bring Your Floral</span>
                <span className="block font-serif italic">Dreams to Life</span>
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/75 max-w-sm">
                From elegant centerpieces to handcrafted bouquets — we&apos;ll
                craft the perfect arrangement for your moment.
              </p>
            </div>

            {/* Right buttons */}
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href={`tel:${siteConfig.phones[0]}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-primary shadow-md transition-all duration-200 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Phone size={15} strokeWidth={2} />
                Call Now
              </Link>

              <Link
                href={`https://wa.me/${siteConfig.socials.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                <MessageCircle size={15} strokeWidth={2} />
                WhatsApp
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                Contact Page
                <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}