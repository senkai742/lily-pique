"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string | null;
  colors?: { name: string; hex: string }[];
};

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to delete product.");
    }
    setDeletingId(null);
  };

  if (products.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
          No products found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {products.map((product) => (
        <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors group">
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-zinc-300" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </span>
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {product.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1 bg-zinc-100 rounded border border-zinc-200 px-1.5 py-0.5" title={c.name}>
                        <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: c.hex || '#ccc' }} />
                        <span className="text-[10px] font-medium text-zinc-600">{c.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-zinc-500">{product.category}</td>
          <td className="px-6 py-4 font-medium text-zinc-900">{product.price}</td>
          <td className="px-6 py-4">
            <span className={`text-sm ${
              product.stock < 10 && product.stock > 0
                ? "text-orange-600 font-medium"
                : product.stock === 0
                ? "text-red-600 font-medium"
                : "text-zinc-600"
            }`}>
              {product.stock} in stock
            </span>
          </td>
          <td className="px-6 py-4">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${
              product.status === "Active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : product.status === "Draft"
                ? "bg-zinc-100 text-zinc-700 border-zinc-300"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {product.status}
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`/admin/dashboard/products/${product.id}`}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </Link>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                disabled={deletingId === product.id}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete"
              >
                {deletingId === product.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
