import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  image,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100 shadow-sm transition-all duration-300 group-hover:shadow-lg">
        <Image
          src={image}
          alt={name}
          fill
          priority={false}
          sizes="
            (max-width: 399px) 72vw,
            (max-width: 640px) 190px,
            (max-width: 768px) 220px,
            260px
          "
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="space-y-2 pt-4">
        <span className="inline-flex w-fit rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
          {category}
        </span>

        <h3 className="line-clamp-2 text-[15px] font-medium leading-5 tracking-tight text-zinc-900 transition-colors group-hover:text-black">
          {name}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <p className="text-base font-bold text-zinc-950">
            ৳ {price.toLocaleString("en-BD")}
          </p>

          <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-900">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}