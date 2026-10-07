import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/app/data/categories";

export default function CategoryShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Shop By Category
          </p>

          <h2 className="mt-4 text-4xl font-bold text-zinc-900">
            Explore Our Collections
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Discover premium fashion collections for every member of your
            family.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

          {categories.map((category) => (

            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="relative aspect-[4/5] overflow-hidden">

                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              </div>

              <div className="flex items-center justify-between p-6">

                <div>

                  <h3 className="text-xl font-semibold text-zinc-900">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Browse Collection
                  </p>

                </div>

                <div className="rounded-full bg-black p-3 text-white transition-transform duration-300 group-hover:translate-x-1">

                  <ArrowRight size={18} />

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}