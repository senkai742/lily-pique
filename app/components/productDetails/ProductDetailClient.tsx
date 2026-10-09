"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, ShoppingBag, ChevronLeft, ChevronRight, Truck, FileText, ShieldCheck } from "lucide-react";
import { Product } from "@/app/types/product";
import { useCart } from "@/app/context/CartContext";
import { siteConfig } from "@/config/site";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const variant = product.variants[activeVariantIdx];
  const images = variant.images;

  useEffect(() => {
    setActiveImageIdx(0);
  }, [activeVariantIdx]);

  const prevImage = useCallback(() => {
    setActiveImageIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setActiveImageIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${variant.color}`,
      name: `${product.name} - ${variant.color}`,
      category: product.category,
      price: variant.price,
      image: images[0],
      color: variant.color,
      colorHex: variant.hex,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/5 p-4 sm:p-6 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/10 group border border-primary/10">
            <Image
              src={images[activeImageIdx]}
              alt={`${product.name} - ${variant.color} ${activeImageIdx + 1}`}
              fill
              priority
              quality={95}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeImageIdx ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Thumbnails below the main image if there are multiple */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImageIdx ? "border-primary shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="Thumbnail" fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col h-full">
          {/* Header Info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-text font-serif">
              {product.name}
            </h1>
            
            {/* Description Subtitle */}
            <p className="mt-2 text-sm sm:text-base text-zinc-500 font-light line-clamp-2">
              {product.description || "Classic vibrant aesthetic, fresh blossom guarantee"}
            </p>

            {/* Price section */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-3xl font-bold tracking-tight text-primary">
                ৳ {variant.price.toLocaleString("en-BD")}
              </span>
              <span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold border border-gold/20">
                Standard Pricing
              </span>
            </div>
          </div>

          <div className="my-6 border-b border-zinc-100" />

          {/* Color Selection - Pill Style */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-800 mb-3">
                Select {product.category} Color:
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v, i) => {
                  const isActive = i === activeVariantIdx;
                  return (
                    <button
                      key={v.color}
                      onClick={() => setActiveVariantIdx(i)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      <span 
                        className="h-3.5 w-3.5 rounded-full shadow-inner border border-black/10" 
                        style={{ backgroundColor: v.hex }}
                      />
                      {v.color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feature List */}
          <div className="mb-8 flex flex-col gap-3 text-sm text-zinc-600">
            <div className="flex items-center gap-3">
              <Truck size={18} className="text-primary" />
              <span>Cash On Delivery (COD) Available</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-primary" />
              <span>Delivery Note Attached with Order</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-primary" />
              <span>Freshness Guarantee Upon Handover</span>
            </div>
          </div>
          
          <div className="mt-auto pt-4 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-text hover:shadow-lg active:scale-[0.98]"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`https://wa.me/${siteConfig.socials.whatsapp.replace("+", "")}`}
                target="_blank"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#1DA851] hover:shadow-md active:scale-[0.98]"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Link>

              <Link
                href={`tel:${siteConfig.phones[0]}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm transition-all hover:bg-primary/5 hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
              >
                <Phone size={16} />
                Call Now
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      {/* Full Description Section */}
      {product.description && (
        <div className="mt-12 pt-10 border-t border-zinc-100">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 font-serif">
            Product Details
          </h2>
          <p className="text-zinc-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
