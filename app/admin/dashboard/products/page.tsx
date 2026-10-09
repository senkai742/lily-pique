import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ProductsTable from "./ProductsTable";

export default async function AdminProducts() {
  const supabase = await createClient();

  const [
    { data: productsData, error },
    { data: variantsData },
    { data: categoriesData },
  ] = await Promise.all([
    supabase.from("products").select("id, name, status, category_id, created_at").order("created_at", { ascending: false }),
    supabase.from("product_variants").select("id, product_id, price, stock, images"),
    supabase.from("categories").select("id, name"),
  ]);

  const categoryMap = Object.fromEntries((categoriesData ?? []).map((c: any) => [c.id, c.name]));

  const products = (productsData ?? []).map((product: any) => {
    const variants = (variantsData ?? []).filter((v: any) => v.product_id === product.id);
    const prices = variants.map((v: any) => v.price).filter(Boolean);
    const displayPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
    const image = variants[0]?.images?.[0] ?? null;
    const colors = variants.map((v: any) => ({ name: v.color, hex: v.hex_code })).filter((c: any) => c.name);

    return {
      id: product.id,
      name: product.name,
      category: categoryMap[product.category_id] ?? "Uncategorized",
      price: `৳ ${displayPrice.toLocaleString("en-BD")}`,
      stock: totalStock,
      status: product.status || "Draft",
      image,
      colors,
    };
  });

  return (
    <div className="p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Products</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your store inventory.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard/products/new" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          Failed to load products. Please make sure your database tables are set up. ({error.message})
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 border-b border-zinc-200 px-6 py-4 sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors w-fit">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Product</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Category</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Price</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Stock</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              <ProductsTable initialProducts={products} />
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-zinc-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">Showing {products.length} {products.length === 1 ? 'result' : 'results'}</p>
          <div className="flex gap-2">
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50" disabled>Prev</button>
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
