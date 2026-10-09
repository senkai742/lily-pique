import ProductsHero from "@/app/components/products/ProductsHero";
import CategoryFilter from "@/app/components/products/CategoryFilter";
import ProductGrid from "@/app/components/products/ProductsGrid";
import EmptyState from "@/app/components/products/EmptyState";
import { createClient } from "@/utils/supabase/server";
import { Product } from "@/app/types/product";

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: Props) {
  const { category } = await searchParams;
  const supabase = await createClient();

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

  let products: Product[] = rawProducts.map((p) => {
    const pCategory = categoryMap[p.category_id];
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
      category: pCategory?.name || "Uncategorized",
      categorySlug: pCategory?.slug || "uncategorized",
      description: p.description || "",
      variants,
    };
  }).filter((p) => p.variants.length > 0);

  if (category) {
    products = products.filter((p) => p.categorySlug === category);
  }

  return (
    <div className="relative bg-background overflow-hidden min-h-screen">
      {/* Decorative page background */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-secondary/20 blur-[150px] opacity-50" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-primary/10 blur-[120px] opacity-40" />

      <ProductsHero />

      <section className="relative z-10 pt-4 pb-12 sm:pt-8 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <CategoryFilter active={category} categories={categories} />

          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState />
          )}

        </div>
      </section>
    </div>
  );
}