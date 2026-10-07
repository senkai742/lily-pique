import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function StorySection() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">

        {/* Image */}

        <div className="relative">

          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-xl">

            <Image
              src="/images/about.png"
              alt={siteConfig.name}
              fill
              className="object-cover"
            />

          </div>

        </div>

        {/* Content */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Our Story
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight text-zinc-900">
            Fashion That Blends Quality With Affordability
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            LilyPique is committed to providing stylish and quality clothing
            for men, women, boys and girls. Whether you're shopping for everyday
            wear or seasonal collections, we strive to offer products that
            combine comfort, quality and value.
          </p>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            We proudly serve both wholesale and retail customers with a growing
            collection of fashion items, focusing on customer satisfaction and
            long-term trust.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-zinc-200 p-5">
              <h3 className="text-3xl font-bold text-zinc-900">
                100+
              </h3>

              <p className="mt-2 text-zinc-600">
                Fashion Products
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5">
              <h3 className="text-3xl font-bold text-zinc-900">
                4
              </h3>

              <p className="mt-2 text-zinc-600">
                Product Categories
              </p>
            </div>

          </div>

          <Link
            href="/products"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 font-medium text-white transition hover:bg-zinc-800"
          >
            Browse Products

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />

          </Link>

        </div>

      </div>
    </section>
  );
}