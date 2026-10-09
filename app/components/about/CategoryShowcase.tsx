import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function CategoryShowcase() {
  const supabase = await createClient();

  const [
    { data: dbCategories },
    { data: dbProducts },
    { data: dbVariants },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase.from("products").select("id, category_id").ilike("status", "active"),
    supabase.from("product_variants").select("product_id, images"),
  ]);

  const categories = (dbCategories ?? []).map((cat) => {
    // Find the first product in this category
    const productIds = (dbProducts ?? []).filter((p) => p.category_id === cat.id).map((p) => p.id);
    
    // Find the first image from those products
    const image = (dbVariants ?? [])
      .filter((v) => productIds.includes(v.product_id))
      .flatMap((v) => v.images || [])[0] || null;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image,
    };
  });

  return (
    <section className="py-12 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Shop By Collection
          </p>
          <h2 className="mt-4 text-4xl font-light text-text">
            <span className="block">Explore Our</span>
            <span className="block font-serif italic text-primary mt-1">Floral Collections</span>
          </h2>
          <p className="mt-5 text-base font-light leading-relaxed text-text/70 sm:text-lg">
            Discover premium floral designs curated for weddings, anniversaries, and everyday elegance.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group overflow-hidden rounded-[2.5rem] border border-gold/20 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30 flex items-center justify-center">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                ) : (
                  <ImageIcon className="text-primary/30 w-16 h-16" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 pb-8 flex items-end justify-between z-10">
                  <div>
                    <h3 className="text-2xl font-serif text-white tracking-wide">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gold/80">
                      Browse Collection
                    </p>
                  </div>
                  <div className="rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/50 group-hover:scale-110">
                    <ArrowRight size={18} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}