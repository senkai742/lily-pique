"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Save } from "lucide-react";

export default function AddProductPage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard/products"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Add New Product</h1>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link 
            href="/admin/dashboard/products"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            Cancel
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
            <Save size={16} />
            Save Product
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Information */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">General Information</h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Classic Blush Rose Bouquet" 
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Description</label>
                <textarea 
                  rows={5}
                  placeholder="Describe your product..."
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">Product Media</h2>
            
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-colors
                ${dragActive ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50'}
              `}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200">
                <UploadCloud size={24} className="text-zinc-500" />
              </div>
              <h3 className="text-sm font-medium text-zinc-900">Click to upload or drag and drop</h3>
              <p className="mt-1 text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
              
              <input type="file" className="absolute inset-0 cursor-pointer opacity-0" multiple accept="image/*" />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">Pricing</h2>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Regular Price (৳)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Sale Price (৳)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Side Details) */}
        <div className="space-y-8">
          
          {/* Status */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">Status</h2>
            <select className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white cursor-pointer">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Organization */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">Organization</h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Category</label>
                <select className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white cursor-pointer">
                  <option value="">Select category...</option>
                  <option value="bouquets">Bouquets</option>
                  <option value="arrangements">Arrangements</option>
                  <option value="gifts">Gifts & Add-ons</option>
                  <option value="weddings">Weddings</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Tags</label>
                <input 
                  type="text" 
                  placeholder="e.g. Roses, Valentine" 
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">Inventory</h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">SKU (Stock Keeping Unit)</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Available Quantity</label>
                <input 
                  type="number" 
                  defaultValue="0"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
