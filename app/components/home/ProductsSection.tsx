import Link from "next/link";
import ProductCarousel from "@/app/components/ProductCarousel";
import { Flower2, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Product } from "@/app/types/product";

export default async function ProductSection() {
  const supabase = await createClient();

  // Separate queries to avoid schema cache join issues
  const [
    { data: dbCategories },
    { data: dbProducts },
    { data: dbVariants },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase.from("products").select("*").ilike("status", "active").order("created_at", { ascending: false }),
    supabase.from("product_variants").select("*"),
  ]);

  const categories = dbCategories ?? [];
  const rawProducts = dbProducts ?? [];
  const rawVariants = dbVariants ?? [];

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  // Map DB products to UI Product type
  const products: Product[] = rawProducts.map((p) => {
    const category = categoryMap[p.category_id];
    const variants = rawVariants
      .filter((v) => v.product_id === p.id)
      .map((v) => ({
        color: v.color,
        hex: v.hex_code,
        price: v.price,
        images: v.images || [],
      }));

    return {
      id: p.id,
      name: p.name,
      category: category?.name || "Uncategorized",
      categorySlug: category?.slug || "uncategorized",
      description: p.description || "",
      variants,
    };
  }).filter((p) => p.variants.length > 0); // Only show products with at least one variant

  return (
    <section className="relative py-12 sm:py-24 overflow-hidden bg-background/50">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-secondary/30 rounded-full mix-blend-multiply blur-[100px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply blur-[100px] opacity-60 pointer-events-none" />

      {/* 1. Global Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16 z-10 relative">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm px-4 py-1.5 shadow-sm">
            <Flower2 size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Our Collections
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-text font-serif italic">
            Browse By Category
          </h2>
          <p className="text-text/70 font-light max-w-md">
            Discover our carefully crafted collections designed to suit every occasion and sentiment.
          </p>
        </div>
      </div>

      {/* 2. Clean Container Group */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-20 z-10">
        {categories.map((category) => {
          const filteredProducts = products.filter(
            (product) => product.categorySlug === category.slug
          );

          if (filteredProducts.length === 0) return null;

          return (
            <div key={category.id} className="w-full group/category">
              {/* Category Sub-Label & Context Controls */}
              <div className="mb-6 flex justify-between items-end border-b border-gold/30 pb-4">
                <div>
                  <h3 className="text-2xl font-serif italic text-text group-hover/category:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/50 border border-primary/20 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-text shadow-sm backdrop-blur-sm transition-all hover:bg-primary hover:text-white hover:border-primary"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    View All
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              {/* Modular Custom Interactive Component */}
              <ProductCarousel 
                products={filteredProducts} 
                categoryTitle={category.name} 
              />
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="text-center text-zinc-500 py-12">
            No products available yet.
          </div>
        )}
      </div>
    </section>
  );
}