import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="overflow-hidden rounded-[40px] bg-zinc-900 px-8 py-16 text-center lg:px-20">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Start Shopping
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white lg:text-5xl">
            Find Your Perfect Style Today
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Browse our latest collection or contact us for wholesale and
            retail inquiries.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              Browse Products

              <ArrowRight size={18} />

            </Link>

            <Link
              href={`tel:${siteConfig.phones[0]}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-8 py-4 font-medium text-white transition hover:bg-zinc-800"
            >
              <Phone size={18} />

              Call Now

            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}