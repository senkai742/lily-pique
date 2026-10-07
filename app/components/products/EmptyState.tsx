import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 py-20 text-center">

      <h2 className="text-2xl font-semibold text-zinc-900">
        No Products Found
      </h2>

      <p className="mt-3 text-zinc-600">
        There are no products available in this category.
      </p>

      <Link
        href="/products"
        className="mt-8 inline-flex rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-zinc-800"
      >
        View All Products
      </Link>

    </div>
  );
}