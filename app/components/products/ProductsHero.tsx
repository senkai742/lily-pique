import Link from "next/link";

export default function ProductsHero() {
  return (
    <section className="border-b border-zinc-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">

          <Link
            href="/"
            className="hover:text-black"
          >
            Home
          </Link>

          <span>/</span>

          <span className="text-zinc-900">
            Products
          </span>

        </div>

        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          Our Collection
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
          Browse our complete collection of premium clothing for men,
          women, boys and girls.
        </p>

      </div>
    </section>
  );
}