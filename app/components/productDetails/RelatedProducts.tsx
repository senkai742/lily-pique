import ProductCarousel from "@/app/components/ProductCarousel";
import { products } from "@/app/data/products";

interface Props {
  currentId: string;
  categorySlug: string;
  category: string;
}

export default function RelatedProducts({
  currentId,
  categorySlug,
  category,
}: Props) {
  const relatedProducts = products.filter(
    (product) =>
      product.categorySlug === categorySlug &&
      product.id !== currentId
  );

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 border-t border-zinc-200 pt-16">

      <div className="mb-10">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-600">
          Explore More
        </p>

        <h2 className="mt-3 text-3xl font-bold text-black md:text-4xl">
          Related Products
        </h2>

        <p className="mt-3 max-w-2xl text-zinc-700">
          Discover more products from our {category} collection.
        </p>

      </div>

      <ProductCarousel
        products={relatedProducts}
        categoryTitle={category}
      />

    </section>
  );
}