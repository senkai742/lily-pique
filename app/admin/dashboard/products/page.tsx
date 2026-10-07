import { Search, Filter, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminProducts() {
  const products = [
    { id: 1, name: "Camel Beige Smart Blazer", category: "Men's Fashion", price: "৳ 12,990", stock: 15, status: "Active", image: "/images/flowerabout.png" },
    { id: 2, name: "Forest Green Premium Blazer", category: "Men's Fashion", price: "৳ 15,990", stock: 8, status: "Active", image: "/images/flowerabout.png" },
    { id: 3, name: "Classic Blush Rose Bouquet", category: "Bouquets", price: "৳ 4,500", stock: 24, status: "Active", image: "/images/flowerabout.png" },
    { id: 4, name: "Vintage Denim Jeans", category: "Women's Fashion", price: "৳ 3,200", stock: 0, status: "Out of Stock", image: "/images/flowerabout.png" },
    { id: 5, name: "Midnight Elegance Arrangement", category: "Arrangements", price: "৳ 6,200", stock: 5, status: "Draft", image: "/images/flowerabout.png" },
  ];

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

        {/* Table */}
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-zinc-300" />
                        )}
                      </div>
                      <span className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${product.stock < 10 && product.stock > 0 ? 'text-orange-600 font-medium' : product.stock === 0 ? 'text-red-600 font-medium' : 'text-zinc-600'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border
                      ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        product.status === 'Draft' ? 'bg-zinc-100 text-zinc-700 border-zinc-300' : 
                        'bg-red-50 text-red-700 border-red-200'}
                    `}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-zinc-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">Showing 1 to 5 of 48 results</p>
          <div className="flex gap-2">
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50" disabled>Prev</button>
            <button className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
