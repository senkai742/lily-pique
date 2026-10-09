import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProductDetailClient from "@/app/components/productDetails/ProductDetailClient";
import RelatedProducts from "@/app/components/productDetails/RelatedProducts";
import { createClient } from "@/utils/supabase/server";
import { Product } from "@/app/types/product";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product, variants, and category
  const [
    { data: dbProduct },
    { data: dbVariants },
  ] = await Promise.all([
    supabase.from("products").select("*, categories(*)").eq("id", id).single(),
    supabase.from("product_variants").select("*").eq("product_id", id),
  ]);

  if (!dbProduct || !dbVariants || dbVariants.length === 0) {
    notFound();
  }

  const category = Array.isArray(dbProduct.categories) ? dbProduct.categories[0] : dbProduct.categories;

  const product: Product = {
    id: dbProduct.id,
    name: dbProduct.name,
    category: category?.name || "Uncategorized",
    categorySlug: category?.slug || "uncategorized",
    description: dbProduct.description || "",
    variants: dbVariants.map((v) => ({
      color: v.color,
      hex: v.hex_code,
      price: v.price,
      images: v.images || [],
    })),
  };

  return (
    <main className="relative py-12 lg:py-16 overflow-hidden min-h-screen bg-background/50">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-secondary/30 rounded-full mix-blend-multiply blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply blur-[100px] opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

        {/* Breadcrumb */}
        <Link
          href="/products"
          className="group mb-12 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text/50 transition-colors hover:text-primary"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-text/20 transition-all group-hover:border-primary group-hover:bg-primary/5">
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
          </div>
          Back to Collection
        </Link>

        {/* Product */}
        <ProductDetailClient product={product} />

        {/* Related Products */}
        <RelatedProducts
          currentId={product.id}
          categorySlug={product.categorySlug}
          category={product.category}
        />

        {/* Flower Care Guide (Static extra content to fill out the page) */}
        <section className="mt-24 border-t border-zinc-200 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Care Instructions
            </span>
            <h2 className="text-3xl font-serif text-text md:text-4xl mb-10">
              How to care for your blooms
            </h2>
            
            <div className="grid gap-8 sm:grid-cols-3 text-left">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 text-xl">💧</div>
                <h3 className="font-bold text-zinc-900 mb-2">Fresh Water</h3>
                <p className="text-sm text-zinc-600">Change the water every 2-3 days and clean the vase thoroughly to prevent bacteria growth.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4 text-xl">✂️</div>
                <h3 className="font-bold text-zinc-900 mb-2">Trim Stems</h3>
                <p className="text-sm text-zinc-600">Cut 1-2 inches off the stems at a 45-degree angle before placing them in fresh water.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary mb-4 text-xl">☀️</div>
                <h3 className="font-bold text-zinc-900 mb-2">Avoid Direct Sun</h3>
                <p className="text-sm text-zinc-600">Keep your arrangement away from direct sunlight, heating vents, and ripening fruit.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

    </main>
  );
}

export async function generateMetadata({
  params,
}: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase.from("products").select("name, description").eq("id", id).single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | LilyPique`,
    description: product.description,
  };
}