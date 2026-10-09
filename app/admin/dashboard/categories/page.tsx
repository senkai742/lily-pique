"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Tag, Search, Loader2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  product_count: number;
  status: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setFormStatus("Active");
    setError("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormStatus(cat.status);
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    setError("");

    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories";
    const method = editingCategory ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, status: formStatus }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    } else {
      setCategories((prev) => [...prev, data]);
    }

    setSaving(false);
    setShowModal(false);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">Organise your products into categories.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 w-fit"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Loading categories...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Category Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Slug</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-sm">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <tr key={cat.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                            <Tag size={16} />
                          </div>
                          <span className="font-medium text-zinc-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-zinc-400">{cat.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border
                          ${cat.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-zinc-100 text-zinc-600 border-zinc-300"}`}
                        >
                          {cat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-zinc-100 px-6 py-4">
          <p className="text-sm text-zinc-500">{filtered.length} {filtered.length === 1 ? "category" : "categories"}</p>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Category Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Summer Collection"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
                {formName && (
                  <p className="text-xs text-zinc-400">
                    Slug: <span className="font-mono">{formName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formName.trim() || saving}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingCategory ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
