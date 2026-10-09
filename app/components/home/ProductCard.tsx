"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/app/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const variant = product.variants[activeVariantIdx];
  const images = variant.images;

  // Reset image index when variant changes
  useEffect(() => {
    setActiveImageIdx(0);
  }, [activeVariantIdx]);

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIdx((i) => (i + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [images]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `${product.id}-${variant.color}`,
      name: `${product.name} – ${variant.color}`,
      category: product.category,
      price: variant.price,
      image: images[0],
      color: variant.color,
      colorHex: variant.hex,
    });
  };

  // Price range label
  const prices = product.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceLabel =
    minPrice === maxPrice
      ? `৳ ${minPrice.toLocaleString("en-BD")}`
      : `৳ ${minPrice.toLocaleString("en-BD")} – ${maxPrice.toLocaleString("en-BD")}`;

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col h-full relative">

      {/* Image Slideshow */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[5rem] rounded-b-xl bg-secondary/20 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 ring-1 ring-gold/10">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${product.name} – ${variant.color} ${i + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-700 ${
              i === activeImageIdx ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          />
        ))}

        {/* Inner glow overlay */}
        <div className="absolute inset-0 rounded-t-[5rem] rounded-b-xl ring-1 ring-inset ring-white/40 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Prev/Next arrows — only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-text shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-text shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight size={14} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setActiveImageIdx(i); }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeImageIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-4 px-1">
        <div className="space-y-1.5">
          <span className="inline-flex w-fit rounded-full border border-primary/20 bg-secondary/30 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary shadow-sm">
            {product.category}
          </span>

          <h3 className="line-clamp-2 text-base font-serif tracking-wide text-text transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </div>

        {/* Color Swatches */}
        {product.variants.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.variants.map((v, i) => (
              <button
                key={v.color}
                title={v.color}
                onClick={(e) => { e.preventDefault(); setActiveVariantIdx(i); }}
                className={`h-5 w-5 rounded-full border-2 transition-all ${
                  i === activeVariantIdx
                    ? "border-primary scale-110 shadow-md"
                    : "border-white/80 ring-1 ring-zinc-300 hover:scale-105"
                }`}
                style={{ backgroundColor: v.hex }}
              />
            ))}
            <span className="ml-1 self-center text-[10px] text-text/50">{variant.color}</span>
          </div>
        )}

        <div className="mt-auto pt-3 flex flex-col gap-2.5">
          <p className="text-base font-semibold text-text/90">
            {variant.price !== minPrice || variant.price !== maxPrice
              ? `৳ ${variant.price.toLocaleString("en-BD")}`
              : priceLabel}
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