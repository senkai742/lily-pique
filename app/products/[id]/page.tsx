import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { products } from "@/app/data/products";
import ProductGallery from "@/app/components/productDetails/ProductGallery";
import ProductInfo from "@/app/components/productDetails/ProductInfo";
import RelatedProducts from "@/app/components/productDetails/RelatedProducts";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="py-12 lg:py-16">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Link
          href="/products"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        {/* Product */}
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          <ProductGallery
            image={product.image}
            name={product.name}
          />

          <ProductInfo
            name={product.name}
            category={product.category}
            price={product.price}
            description={product.description}
          />

        </section>

        {/* Related Products */}
        <RelatedProducts
          currentId={product.id}
          categorySlug={product.categorySlug}
          category={product.category}
        />

      </div>

    </main>
  );
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: Props) {
  const { id } = await params;

  const product = products.find((item) => item.id === id);

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