import { products } from "@/app/data/products";
import ProductsHero from "@/app/components/products/ProductsHero";
import CategoryFilter from "@/app/components/products/CategoryFilter";
import ProductGrid from "@/app/components/products/ProductsGrid";
import EmptyState from "@/app/components/products/EmptyState";

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: Props) {
  const { category } = await searchParams;

  const filteredProducts = category
    ? products.filter(
        (product) => product.categorySlug === category
      )
    : products;

  return (
    <div className="relative bg-background overflow-hidden min-h-screen">
      {/* Decorative page background */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-secondary/20 blur-[150px] opacity-50" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-primary/10 blur-[120px] opacity-40" />

      <ProductsHero />

      <section className="relative z-10 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <CategoryFilter active={category} />

          {filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState />
          )}

        </div>
      </section>
    </div>
  );
}