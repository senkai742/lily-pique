"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Save, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type ExistingVariant = {
  id: string;
  color: string;
  hex_code: string;
  price: number;
  stock: number;
  images: string[];
};

type FormVariant = {
  id?: string;           // existing variant id (undefined = new)
  color: string;
  hex: string;
  price: string;
  stock: string;
  existingImages: string[]; // URLs already in storage
  newImageFiles: File[];
  newImagePreviews: string[];
};

function dbVariantToForm(v: ExistingVariant): FormVariant {
  return {
    id: v.id,
    color: v.color,
    hex: v.hex_code,
    price: String(v.price),
    stock: String(v.stock),
    existingImages: v.images ?? [],
    newImageFiles: [],
    newImagePreviews: [],
  };
}

const emptyVariant = (): FormVariant => ({
  color: "",
  hex: "#e11d48",
  price: "",
  stock: "0",
  existingImages: [],
  newImageFiles: [],
  newImagePreviews: [],
});

interface Props {
  product: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    category_id: string | null;
    product_variants: ExistingVariant[];
  };
  categories: { id: string; name: string; slug: string }[];
}

export default function EditProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [status, setStatus] = useState(product.status);
  const [categoryId, setCategoryId] = useState(product.category_id ?? "");
  const [variants, setVariants] = useState<FormVariant[]>(
    product.product_variants.length > 0
      ? product.product_variants.map(dbVariantToForm)
      : [emptyVariant()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateVariant(index: number, field: keyof FormVariant, value: any) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function handleNewImages(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              newImageFiles: [...v.newImageFiles, ...files],
              newImagePreviews: [...v.newImagePreviews, ...previews],
            }
          : v
      )
    );
  }

  function removeExistingImage(variantIdx: number, imgIdx: number) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIdx
          ? { ...v, existingImages: v.existingImages.filter((_, j) => j !== imgIdx) }
          : v
      )
    );
  }

  function removeNewImage(variantIdx: number, imgIdx: number) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIdx
          ? {
              ...v,
              newImageFiles: v.newImageFiles.filter((_, j) => j !== imgIdx),
              newImagePreviews: v.newImagePreviews.filter((_, j) => j !== imgIdx),
            }
          : v
      )
    );
  }

  async function handleSave() {
    setError("");
    if (!name.trim()) return setError("Product name is required.");
    if (variants.some((v) => !v.color.trim())) return setError("Every variant needs a color name.");
    if (variants.some((v) => !v.price || isNaN(Number(v.price))))
      return setError("Every variant needs a valid price.");

    setSaving(true);
    try {
      const supabase = createClient();

      // 1. Update the product row
      const { error: updateErr } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          description: description.trim(),
          status,
          category_id: categoryId || null,
        })
        .eq("id", product.id);

      if (updateErr) throw new Error(updateErr.message);

      // 2. Upsert variants
      for (const v of variants) {
        // Upload any new images
        const newUrls: string[] = [];
        for (const file of v.newImageFiles) {
          const ext = file.name.split(".").pop();
          const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("product-images")
            .upload(path, file);
          if (upErr) throw new Error(`Image upload failed: ${upErr.message}`);
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(path);
          newUrls.push(urlData.publicUrl);
        }

        const allImages = [...v.existingImages, ...newUrls];

        if (v.id) {
          // Update existing variant
          const { error: varErr } = await supabase
            .from("product_variants")
            .update({
              color: v.color,
              hex_code: v.hex,
              price: Number(v.price),
              stock: Number(v.stock),
              images: allImages,
            })
            .eq("id", v.id);
          if (varErr) throw new Error(varErr.message);
        } else {
          // Insert new variant
          const { error: varErr } = await supabase
            .from("product_variants")
            .insert({
              product_id: product.id,
              color: v.color,
              hex_code: v.hex,
              price: Number(v.price),
              stock: Number(v.stock),
              images: allImages,
            });
          if (varErr) throw new Error(varErr.message);
        }
      }

      // 3. Delete variants that were removed from the form
      const keptIds = variants.filter((v) => v.id).map((v) => v.id!);
      const allOriginalIds = product.product_variants.map((v) => v.id);
      const deletedIds = allOriginalIds.filter((id) => !keptIds.includes(id));
      if (deletedIds.length > 0) {
        await supabase.from("product_variants").delete().in("id", deletedIds);
      }

      router.push("/admin/dashboard/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto mb-20 sm:mb-0">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/dashboard/products"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Edit Product</h1>
          <p className="text-sm text-zinc-500 mt-0.5">ID: {product.id}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">General Information</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Blush Rose Bouquet"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">Product Variants</h2>
            <div className="space-y-6">
              {variants.map((v, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-600">Variant {idx + 1}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-start sm:items-end">
                    <div className="space-y-2 w-full sm:flex-1 sm:min-w-[200px]">
                      <label className="text-sm font-medium text-zinc-700">Color Name</label>
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(idx, "color", e.target.value)}
                        placeholder="e.g. Blush Pink"
                        className="w-full rounded-xl border border-zinc-300 px-4 py-3 sm:py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white"
                      />
                    </div>

                    <div className="flex gap-4 w-full sm:w-auto">
                      <div className="space-y-2 flex-1 sm:flex-none sm:w-24">
                        <label className="text-sm font-medium text-zinc-700 block">Color</label>
                        <div className="relative h-[46px] sm:h-[42px] w-full rounded-xl border border-zinc-300 overflow-hidden cursor-pointer bg-white">
                          <input
                            type="color"
                            value={v.hex}
                            onChange={(e) => updateVariant(idx, "hex", e.target.value)}
                            className="absolute -top-2 -left-2 h-16 w-full cursor-pointer opacity-100"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 flex-[2] sm:flex-none sm:w-28">
                        <label className="text-sm font-medium text-zinc-700">Price (৳)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => updateVariant(idx, "price", e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-xl border border-zinc-300 px-4 py-3 sm:py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white"
                        />
                      </div>

                      <div className="space-y-2 flex-[2] sm:flex-none sm:w-24">
                        <label className="text-sm font-medium text-zinc-700">Stock</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                          placeholder="0"
                          className="w-full rounded-xl border border-zinc-300 px-4 py-3 sm:py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-700">Variant Images</label>
                    <div className="flex flex-wrap gap-3">
                      {/* Existing images from storage */}
                      {v.existingImages.map((url, imgIdx) => (
                        <div key={`existing-${imgIdx}`} className="relative h-20 w-20 rounded-lg border border-zinc-200 overflow-hidden shadow-sm group">
                          <img src={url} alt="existing" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx, imgIdx)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <span className="text-xs font-medium">Remove</span>
                          </button>
                        </div>
                      ))}
                      {/* New image previews */}
                      {v.newImagePreviews.map((preview, imgIdx) => (
                        <div key={`new-${imgIdx}`} className="relative h-20 w-20 rounded-lg border border-zinc-200 overflow-hidden shadow-sm group">
                          <img src={preview} alt="preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx, imgIdx)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <span className="text-xs font-medium">Remove</span>
                          </button>
                        </div>
                      ))}
                      <label className="relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white hover:bg-zinc-50 transition-colors">
                        <UploadCloud size={20} className="text-zinc-400 mb-1" />
                        <span className="text-[10px] font-medium text-zinc-500">Upload</span>
                        <input
                          type="file"
                          className="absolute inset-0 cursor-pointer opacity-0"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleNewImages(idx, e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
                className="w-full h-[42px] rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Another Variant
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Status */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">Status</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Organization */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">Organization</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white cursor-pointer"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-3 border-t border-zinc-200 pt-8">
        <Link
          href="/admin/dashboard/products"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-3 sm:py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 sm:py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
