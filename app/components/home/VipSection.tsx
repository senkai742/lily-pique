import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VIP_DISCOUNT_PERCENT, VIP_FEE } from "@/config/vip";

const banner = "/images/vip-bloom-banner.jpg";

export default function VipSection() {
  const hasBanner = existsSync(join(process.cwd(), "public", banner));

  return (
    <section aria-labelledby="vip-bloom-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-[#27202a] text-white shadow-xl shadow-text/10">
        {hasBanner && (
          <Image src={banner} alt="" width={2064} height={512} sizes="(min-width: 1280px) 1216px, 100vw" className="h-auto w-full" />
        )}
        <div className="relative isolate grid items-end gap-8 px-6 py-10 sm:px-12 sm:py-14 md:grid-cols-[1fr_auto]">
          {!hasBanner && (
            <>
              <Image src="/images/hero-floral.png" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover object-[center_45%]" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#27202a] via-[#27202a]/95 to-[#27202a]/65" />
            </>
          )}
          <div>
            <h2 id="vip-bloom-heading" className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2d8a5]">
              VIP Bloom Club
            </h2>
            <p className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-6xl">
              {VIP_DISCOUNT_PERCENT}% off products for life
            </p>
            <p className="mt-4 text-base text-white/85">Lifetime membership for one payment of ৳{VIP_FEE.toLocaleString("en-BD")}.</p>
          </div>
          <Link href="/vip-membership" className="inline-flex w-fit items-center gap-3 rounded-full bg-[#f2d8a5] px-6 py-3.5 text-sm font-semibold text-[#27202a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Explore VIP Membership <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
