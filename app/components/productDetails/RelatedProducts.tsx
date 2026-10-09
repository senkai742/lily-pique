import ProductCarousel from "@/app/components/ProductCarousel";
import { createClient } from "@/utils/supabase/server";
import { Product } from "@/app/types/product";

interface Props {
  currentId: string;
  categorySlug: string;
  category: string;
}

export default async function RelatedProducts({
  currentId,
  categorySlug,
  category,
}: Props) {
  const supabase = await createClient();

  // Find category ID by slug
  const { data: catData } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
  
  if (!catData) return null;

  // Fetch products in the same category (excluding current)
  const [
    { data: dbProducts },
    { data: dbVariants },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("category_id", catData.id).neq("id", currentId).ilike("status", "active").limit(10),
    supabase.from("product_variants").select("*"),
  ]);

  if (!dbProducts || dbProducts.length === 0) return null;

  const rawVariants = dbVariants ?? [];

  const relatedProducts: Product[] = dbProducts.map((p) => {
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
      category: category,
      categorySlug: categorySlug,
      description: p.description || "",
      variants,
    };
  }).filter((p) => p.variants.length > 0);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 border-t border-zinc-200 pt-16">

      <div className="mb-10 flex flex-col items-center text-center">
        <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
          Explore More
        </span>

        <h2 className="text-3xl font-serif text-text md:text-5xl">
          Related Products
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-text/70 md:text-base">
          Discover more exquisite pieces from our {category} collection to complement your choice.
        </p>
      </div>

      <ProductCarousel
        products={relatedProducts}
        categoryTitle={category}
      />

    </section>
  );
}