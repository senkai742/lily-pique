import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import navItems from "@/config/navItems";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-text text-background">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px] opacity-60" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-gold/10 blur-[120px] opacity-50" />

      {/* Large floral watermark */}
      <div className="pointer-events-none absolute right-0 top-0 select-none overflow-hidden opacity-[0.04]">
        <Flower2 size={600} strokeWidth={0.4} className="translate-x-1/3 -translate-y-1/4 text-secondary" />
      </div>
      <div className="pointer-events-none absolute -bottom-12 left-1/2 select-none overflow-hidden opacity-[0.03]">
        <Flower2 size={320} strokeWidth={0.4} className="-translate-x-1/2 text-secondary" />
      </div>

      {/* Decorative top petal divider */}
      <div className="relative flex items-center justify-center pt-8 sm:pt-12 pb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="mx-5 flex items-center gap-2 text-gold/50">
          <Flower2 size={10} strokeWidth={1.5} className="rotate-45" />
          <Flower2 size={16} strokeWidth={1.5} />
          <Flower2 size={10} strokeWidth={1.5} className="-rotate-45" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Main footer body */}
      <div className="relative z-10 mx-auto max-w-7xl px-6  lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">

          {/* ── Brand Column ── */}
          <div className="col-span-2 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="group inline-flex transition-all duration-300 hover:opacity-80">
              <Image
                src="/images/navlogo.png"
                alt={siteConfig.name}
                width={400}
                height={120}
                className="h-auto w-[180px] object-contain brightness-0 invert opacity-90 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="max-w-xs text-sm font-light leading-7 text-background/60">
              Handcrafted bouquets and artisan floral arrangements for every
              special moment. Bringing natural elegance to your everyday life.
            </p>

            {/* Social Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {siteConfig.socials.facebook && (
                <Link
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-background/70 backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/15 hover:text-primary"
                >
                  {/* Facebook "f" icon */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </Link>
              )}
              <Link
                href={`https://wa.me/${siteConfig.socials.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-background/70 backdrop-blur-sm transition-all duration-200 hover:border-green-400/50 hover:bg-green-400/10 hover:text-green-300"
              >
                <MessageCircle size={13} strokeWidth={2} />
                WhatsApp
              </Link>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="mb-3 sm:mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              <Flower2 size={11} strokeWidth={2} className="opacity-70" />
              Explore
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-light text-background/60 transition-all duration-200 hover:text-primary"
                  >
                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Shop Links ── */}
          <div className="mb-4">
            <h3 className="mb-3 sm:mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              <Flower2 size={11} strokeWidth={2} className="opacity-70" />
              Shop
            </h3>
            <ul className="space-y-3">
              {["Fresh Bouquets", "Seasonal Blooms", "Event Decor", "Gift Sets", "Custom Orders"].map((item) => (
                <li key={item}>
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-1.5 text-sm font-light text-background/60 transition-all duration-200 hover:text-primary"
                  >
                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/[0.06]">
        {/* Thin gold gradient rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] font-light text-background/40 md:flex-row lg:px-8">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-background/60">LilyPique</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <Flower2 size={10} className="text-gold/40" />
            <p>
              Designed &amp; Developed by{" "}
              <a
                href="https://my-portfolio-nine-zeta-62.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-background/60 transition-colors hover:text-primary"
              >
                Senkai
              </a>
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}