import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="border-b border-zinc-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-black">
            Home
          </Link>

          <span>/</span>

          <span className="text-zinc-900">
            About
          </span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          About LilyPique
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          Delivering quality clothing for men, women and children with
          affordable prices and trusted service.
        </p>

      </div>
    </section>
  );
}