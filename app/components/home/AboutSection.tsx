import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AboutSection() {
  return (
    <section className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">

        {/* Image Showcase Column */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-zinc-100">
            <Image
              src="/images/about.png"
              alt="LilyPique Store"
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-4 left-4 border border-zinc-100 bg-white/95 backdrop-blur-md p-4 shadow-sm sm:left-6 sm:bottom-6">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              Experience
            </p>
            <h3 className="mt-0.5 text-base font-semibold uppercase tracking-wider text-zinc-900">
              Quality Fashion
            </h3>
          </div>
        </div>

        {/* Content Column */}
        <div className="space-y-5 sm:space-y-6">
          <div>
            <span className="text-xl font-bold uppercase tracking-widest text-zinc-400">
              About Us
            </span>
            <h2 className="mt-2 text-2xl font-normal uppercase tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl leading-tight">
              Your Trusted Clothing Store
            </h2>
          </div>

          <p className="text-sm font-light leading-relaxed text-zinc-500 sm:text-base max-w-xl">
            LilyPique offers a wide collection of clothing for men, women,
            boys and girls. We focus on quality products, affordable pricing
            and customer satisfaction.
          </p>

          {/* Contact Details Grid */}
          <div className="pt-2 space-y-4 border-t border-zinc-200/60 max-w-md">
            {/* Phone Entry */}
            <div className="flex items-center gap-4">
              <div className="border border-zinc-200 bg-white p-3 text-zinc-800 rounded-none">
                <Phone size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Call Us
                </p>
                <p className="text-sm font-medium text-zinc-900 mt-0.5">
                  {siteConfig.phones[0]}
                </p>
              </div>
            </div>

            {/* Address Entry */}
            <div className="flex items-center gap-4">
              <div className="border border-zinc-200 bg-white p-3 text-zinc-800 rounded-none">
                <MapPin size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Address
                </p>
                <p className="text-sm font-medium text-zinc-900 mt-0.5">
                  {siteConfig.address}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center justify-center bg-zinc-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              Learn More
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}