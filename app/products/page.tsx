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
    <>
      <ProductsHero />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <CategoryFilter active={category} />

          {filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState />
          )}

        </div>
      </section>
    </>
  );
}