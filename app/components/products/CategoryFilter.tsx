import Link from "next/link";
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  active?: string;
  categories: Category[];
}

export default function CategoryFilter({ active, categories }: Props) {
  return (
    <div className="relative mb-4">
      <div 
        className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* "All" Filter Option */}
        <Link
          href="/products"
          className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${
            !active
              ? "bg-primary text-white shadow-primary/25 ring-1 ring-primary"
              : "bg-white text-text/60 ring-1 ring-gold/20 hover:bg-secondary/40 hover:text-primary hover:ring-primary/30"
          }`}
        >
          All Blooms
        </Link>

        {/* Dynamic Category Option Loop */}
        {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${
                active === category.slug
                  ? "bg-primary text-white shadow-primary/25 ring-1 ring-primary"
                  : "bg-white text-text/60 ring-1 ring-gold/20 hover:bg-secondary/40 hover:text-primary hover:ring-primary/30"
              }`}
            >
              {category.name}
            </Link>
        ))}
      </div>
      
      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  );
}