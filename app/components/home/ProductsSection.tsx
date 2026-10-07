import Link from "next/link";
import ProductCarousel from "@/app/components/ProductCarousel";
import { products } from "@/app/data/products";
import { categories } from "@/app/data/categories";

export default function ProductSection() {
  return (
    <section className="py-16 bg-white">
      {/* 1. Global Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="border-b border-zinc-950 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Our Collections
          </span>
          <h2 className="mt-1 text-2xl font-light tracking-tight text-zinc-900 uppercase sm:text-3xl">
            Browse By Categories
          </h2>
        </div>
      </div>

      {/* 2. Clean Container Group */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        {categories.map((category) => {
          const filteredProducts = products.filter(
            (product) => product.categorySlug === category.slug
          );

          if (filteredProducts.length === 0) return null;

          return (
            <div key={category.id} className="w-full">
              {/* Category Sub-Label & Context Controls */}
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold tracking-wider uppercase text-zinc-500">
                  {category.title}
                </h3>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 hover:text-black transition-colors"
                >
                  View All →
                </Link>
              </div>

              {/* Modular Custom Interactive Component */}
              <ProductCarousel 
                products={filteredProducts} 
                categoryTitle={category.title} 
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}