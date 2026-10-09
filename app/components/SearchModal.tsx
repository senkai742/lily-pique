"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type SearchResultProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* Search trigger button in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-secondary/30 text-primary transition-all duration-200 hover:bg-secondary active:scale-95 border border-primary/20 shrink-0"
        aria-label="Search blooms and products"
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 sm:pt-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gold/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center border-b border-gold/20 px-3 sm:px-4 py-3 bg-zinc-50/50 gap-2">
              <Search size={18} className="text-primary/70 shrink-0 ml-1" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-zinc-100 hover:bg-zinc-200 p-1.5 text-zinc-500 transition-colors shrink-0"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </form>

            {/* Results / Suggestions dropdown */}
            <div className="max-h-96 overflow-y-auto p-4 divide-y divide-zinc-100">
              {loading && (
                <div className="py-8 text-center text-xs text-zinc-400">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
                  <p>Searching collections...</p>
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium text-zinc-700">No blooms matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-zinc-400 mt-1">Try searching for generic terms like &ldquo;lily&rdquo;, &ldquo;rose&rdquo;, or bouquet style.</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-2 pb-2 flex items-center justify-between">
                    <span>Products found ({results.length})</span>
                    <Link
                      href={`/products?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setIsOpen(false)}
                      className="text-primary hover:underline font-bold"
                    >
                      View all in catalog &rarr;
                    </Link>
                  </div>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3.5 rounded-xl p-2.5 hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <Sparkles size={18} className="m-auto text-zinc-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-zinc-900">
                          ৳ {product.price.toLocaleString("en-BD")}
                        </span>
                        <ArrowRight size={14} className="text-zinc-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-auto mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="py-6 px-2 text-center">
                  <div className="flex justify-center mb-2">
                    <Sparkles className="text-primary/40" size={24} />
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">Quick suggestions</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {["Lily", "Rose", "Bouquet", "Box", "Exclusive"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setQuery(tag)}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
