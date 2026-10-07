import Link from "next/link";
import { categories } from "@/app/data/categories";

interface Props {
  active?: string;
}

export default function CategoryFilter({ active }: Props) {
  return (
    <div 
      className="flex gap-4 overflow-x-auto border-b border-zinc-100 pb-3 pt-1 scrollbar-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* "All" Filter Option */}
      <Link
        href="/products"
        className={`whitespace-nowrap px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition duration-150 rounded-none border ${
          !active
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-900 hover:text-zinc-900"
        }`}
      >
        All
      </Link>

      {/* Dynamic Category Option Loop */}
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className={`whitespace-nowrap px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition duration-150 rounded-none border ${
            active === category.slug
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-900 hover:text-zinc-900"
          }`}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
}