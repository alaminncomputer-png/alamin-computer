"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const ICONS = ["💻", "💼", "🎮", "🎓", "✨", "🖥️", "📦", "🔧", "⚡", "🏆"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "💻", order: "0" });

  const slugify = (t: string) => t.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const fetchCats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCats(); }, []);

  const openAdd = () => {
    setEditCat(null);
    setForm({ name: "", slug: "", description: "", icon: "💻", order: "0" });
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setEditCat(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", icon: cat.icon || "💻", order: String(cat.order || 0) });
    setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editCat ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editCat) {
        await api.put(`/categories/${editCat._id}`, payload);
        toast.success("Category updated!");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created!");
      }
      setShowForm(false);
      fetchCats();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-head text-2xl font-bold text-white">Categories</h2>
          <p className="text-muted text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="card rounded-xl h-24 animate-pulse" />)
        ) : categories.map(cat => (
          <div key={cat._id} className="card rounded-xl p-4 flex items-center justify-between hover:border-[rgba(26,107,255,0.4)] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-white font-semibold">{cat.name}</p>
                <p className="text-muted-2 text-xs">/{cat.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(cat)} className="p-1.5 text-muted hover:text-blue transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 text-muted hover:text-danger transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#080f1c] border border-[rgba(26,107,255,0.3)] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(26,107,255,0.15)]">
              <h3 className="font-head text-xl font-bold text-white">
                {editCat ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-text text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Name *</label>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="input"
                  placeholder="e.g. Business Laptops"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="input"
                  placeholder="e.g. business"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="input"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Icon</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setForm(f => ({ ...f, icon }))}
                      className={`text-2xl w-10 h-10 rounded-lg border transition-colors ${
                        form.icon === icon ? "border-blue bg-blue/10" : "border-[rgba(26,107,255,0.15)] hover:border-blue"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="input text-xs" placeholder="Or type any emoji" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} className="input" />
              </div>
            </div>
            <div className="p-5 border-t border-[rgba(26,107,255,0.15)] flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving..." : editCat ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
