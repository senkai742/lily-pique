"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/app/components/home/ProductCard";

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

interface ProductCarouselProps {
  products: Product[];
  categoryTitle: string;
}

export default function ProductCarousel({
  products,
  categoryTitle,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollContainerRef.current;

    if (!container) return;

    setIsScrollable(container.scrollWidth > container.clientWidth + 5);

    setCanScrollLeft(container.scrollLeft > 5);

    setCanScrollRight(
      container.scrollLeft + container.clientWidth <
        container.scrollWidth - 5
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    updateScrollState();

    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products]);

  const getScrollAmount = () => {
    const container = scrollContainerRef.current;

    if (!container) return 0;

    const card = container.querySelector(
      "[data-card]"
    ) as HTMLDivElement | null;

    return card ? card.offsetWidth + 12 : container.clientWidth;
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();

    const container = scrollContainerRef.current;

    if (!container || !isScrollable) return;

    autoScrollRef.current = setInterval(() => {
      const amount = getScrollAmount();

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollTo({
          left: Math.min(container.scrollLeft + amount, maxScroll),
          behavior: "smooth",
        });
      }
    }, 4000);
  };

  useEffect(() => {
    startAutoScroll();

    return () => stopAutoScroll();
  }, [isScrollable]);

  const scroll = (direction: "left" | "right") => {
    stopAutoScroll();

    const container = scrollContainerRef.current;

    if (!container) return;

    const amount = getScrollAmount();

    const maxScroll = container.scrollWidth - container.clientWidth;

    const target =
      direction === "left"
        ? Math.max(0, container.scrollLeft - amount)
        : Math.min(maxScroll, container.scrollLeft + amount);

    container.scrollTo({
      left: target,
      behavior: "smooth",
    });

    setTimeout(startAutoScroll, 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      {isScrollable && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-[34%] z-30 -translate-y-1/2 rounded-full border border-zinc-200 bg-white/95 p-2 shadow transition ${
              canScrollLeft
                ? "text-zinc-600 hover:bg-white hover:text-black active:scale-95"
                : "cursor-not-allowed opacity-40"
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-2 top-[34%] z-30 -translate-y-1/2 rounded-full border border-zinc-200 bg-white/95 p-2 shadow transition ${
              canScrollRight
                ? "text-zinc-600 hover:bg-white hover:text-black active:scale-95"
                : "cursor-not-allowed opacity-40"
            }`}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={scrollContainerRef}
        onTouchStart={stopAutoScroll}
        onTouchEnd={startAutoScroll}
        onMouseDown={stopAutoScroll}
        onMouseUp={startAutoScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4 scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-card
            className="
              w-[72%]
              min-[360px]:w-[68%]
              min-[390px]:w-[64%]
              sm:w-[220px]
              md:w-[250px]
              shrink-0
              snap-start
            "
          >
            <ProductCard
              id={product.id}
              name={product.name}
              category={categoryTitle}
              price={product.price}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}