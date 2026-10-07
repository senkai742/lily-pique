"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

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
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, name, category, price, image });
  };

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col h-full relative"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[5rem] rounded-b-xl bg-secondary/20 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 ring-1 ring-gold/10">
        <Image
          src={image}
          alt={name}
          fill
          priority={false}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        {/* Soft inner glow overlay */}
        <div className="absolute inset-0 rounded-t-[5rem] rounded-b-xl ring-1 ring-inset ring-white/40 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-5 px-1">
        <div className="space-y-2">
          <span className="inline-flex w-fit rounded-full border border-primary/20 bg-secondary/30 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary shadow-sm">
            {category}
          </span>

          <h3 className="line-clamp-2 text-base font-serif tracking-wide text-text transition-colors group-hover:text-primary">
            {name}
          </h3>
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-3">
          <p className="text-base font-semibold text-text/90">
            ৳ {price.toLocaleString("en-BD")}
          </p>

          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-md transition-all duration-300 hover:bg-text hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}