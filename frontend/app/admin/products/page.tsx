"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Upload, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = {
    name: "", description: "", shortDescription: "", price: "", oldPrice: "", category: "",
    condition: "Refurbished", stock: "0", warranty: "3 months",
    isFeatured: false, isBestSeller: false, isNewArrival: true, isActive: true,
    specs: { processor: "", processorGen: "", ram: "", storage: "", storageType: "SSD", display: "", graphics: "", battery: "", batteryCondition: "Good", os: "", weight: "" },
  };
  const [form, setForm] = useState<any>(emptyForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [{ data: pData }, { data: cData }] = await Promise.all([
        api.get("/products", { params: { limit: 100 } }),
        api.get("/categories"),
      ]);
      setProducts(pData.products);
      setCategories(cData);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setUploadedImages([]);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description, shortDescription: p.shortDescription || "",
      price: p.price, oldPrice: p.oldPrice || "", category: p.category?._id || p.category,
      condition: p.condition, stock: p.stock, warranty: p.warranty || "3 months",
      isFeatured: p.isFeatured, isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival, isActive: p.isActive,
      specs: { ...emptyForm.specs, ...p.specs },
    });
    setUploadedImages(p.images || []);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append("images", f));
      const { data } = await api.post("/upload/product-image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadedImages(prev => [...prev, ...data.images]);
      toast.success("Images uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price and category are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        stock: Number(form.stock),
        images: uploadedImages,
      };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success("Product updated!");
      } else {
        await api.post("/products", payload);
        toast.success("Product created!");
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const toggleActive = async (p: any) => {
    try {
      await api.put(`/products/${p._id}`, { isActive: !p.isActive });
      setProducts(prev => prev.map(x => x._id === p._id ? { ...x, isActive: !x.isActive } : x));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-head text-2xl font-bold text-white">Products</h2>
          <p className="text-muted text-sm">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input pl-9" />
      </div>

      {/* Table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(26,107,255,0.15)] bg-[rgba(26,107,255,0.04)]">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[rgba(26,107,255,0.08)]">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[rgba(26,107,255,0.06)] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">No products found</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p._id} className="border-b border-[rgba(26,107,255,0.08)] hover:bg-[rgba(26,107,255,0.03)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#080f1c] flex-shrink-0">
                          <Image src={p.images[0]?.url || "https://placehold.co/40x40/0b1527/1a6bff?text=💻"} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-semibold line-clamp-1">{p.name}</p>
                          <p className="text-muted-2 text-xs">{p.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold">ETB {p.price.toLocaleString()}</p>
                      {p.oldPrice && <p className="text-muted-2 text-xs line-through">ETB {p.oldPrice.toLocaleString()}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                        p.stock > 5 ? "text-green bg-green/10 border-green/20"
                          : p.stock > 0 ? "text-orange bg-orange/10 border-orange/20"
                          : "text-danger bg-danger/10 border-danger/20"
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(p)} className={`flex items-center gap-1.5 text-xs ${p.isActive ? "text-green" : "text-muted-2"}`}>
                        {p.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        {p.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/product/${p.slug}`} target="_blank" className="p-1.5 text-muted hover:text-cyan transition-colors rounded">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-muted hover:text-blue transition-colors rounded">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-muted hover:text-danger transition-colors rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-[#080f1c] border border-[rgba(26,107,255,0.3)] rounded-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(26,107,255,0.15)]">
              <h3 className="font-head text-xl font-bold text-white">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-text transition-colors text-xl">✕</button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Images */}
              <div>
                <label className="block text-xs text-muted mb-2 font-semibold uppercase tracking-wider">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#080f1c] group">
                      <Image src={img.url} alt="" fill className="object-cover" />
                      <button
                        onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-danger transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImg}
                    className="w-16 h-16 border-2 border-dashed border-[rgba(26,107,255,0.3)] rounded-lg flex flex-col items-center justify-center text-muted hover:border-blue hover:text-blue transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 mb-1" />
                    <span className="text-[9px]">{uploadingImg ? "..." : "Upload"}</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="admin-label">Product Name *</label>
                  <input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. HP EliteBook 840 G8 Core i7" />
                </div>
                <div>
                  <label className="admin-label">Category *</label>
                  <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} className="input">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Condition</label>
                  <select value={form.condition} onChange={e => setForm((f: any) => ({ ...f, condition: e.target.value }))} className="input">
                    {["New", "Refurbished", "Used-Excellent", "Used-Good"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Price (ETB) *</label>
                  <input type="number" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))} className="input" placeholder="45000" />
                </div>
                <div>
                  <label className="admin-label">Old Price (ETB)</label>
                  <input type="number" value={form.oldPrice} onChange={e => setForm((f: any) => ({ ...f, oldPrice: e.target.value }))} className="input" placeholder="55000" />
                </div>
                <div>
                  <label className="admin-label">Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="admin-label">Warranty</label>
                  <select value={form.warranty} onChange={e => setForm((f: any) => ({ ...f, warranty: e.target.value }))} className="input">
                    {["1 month", "3 months", "6 months", "1 year", "No warranty"].map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="admin-label">Description *</label>
                <textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} className="input resize-none h-24" placeholder="Full product description..." />
              </div>
              <div>
                <label className="admin-label">Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm((f: any) => ({ ...f, shortDescription: e.target.value }))} className="input" placeholder="Brief summary (shown in listings)" />
              </div>

              {/* Specs */}
              <div>
                <p className="font-head font-bold text-white text-sm mb-3">Specifications</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "processor", label: "Processor", placeholder: "Intel Core i7-1165G7" },
                    { key: "processorGen", label: "Gen", placeholder: "11th Gen" },
                    { key: "ram", label: "RAM", placeholder: "16GB DDR4" },
                    { key: "storage", label: "Storage", placeholder: "512GB" },
                    { key: "storageType", label: "Storage Type", type: "select", options: ["SSD", "HDD", "eMMC"] },
                    { key: "display", label: "Display", placeholder: "14\" FHD IPS" },
                    { key: "graphics", label: "Graphics", placeholder: "Intel Iris Xe" },
                    { key: "battery", label: "Battery", placeholder: "53Wh" },
                    { key: "batteryCondition", label: "Batt. Condition", type: "select", options: ["New", "Excellent", "Good", "Fair"] },
                    { key: "os", label: "OS", placeholder: "Windows 11 Pro" },
                    { key: "weight", label: "Weight", placeholder: "1.37 kg" },
                  ].map(({ key, label, placeholder, type, options }) => (
                    <div key={key}>
                      <label className="admin-label">{label}</label>
                      {type === "select" ? (
                        <select value={form.specs[key]} onChange={e => setForm((f: any) => ({ ...f, specs: { ...f.specs, [key]: e.target.value } }))} className="input text-xs py-2">
                          {options!.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input value={form.specs[key]} onChange={e => setForm((f: any) => ({ ...f, specs: { ...f.specs, [key]: e.target.value } }))} className="input text-xs py-2" placeholder={placeholder} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div>
                <p className="font-head font-bold text-white text-sm mb-3">Display Options</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: "isFeatured", label: "Featured" },
                    { key: "isBestSeller", label: "Best Seller" },
                    { key: "isNewArrival", label: "New Arrival" },
                    { key: "isActive", label: "Active (visible)" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.checked }))}
                        className="accent-blue w-4 h-4"
                      />
                      <span className="text-muted text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[rgba(26,107,255,0.15)] flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-label { display: block; font-size: 10px; color: #7a90b8; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
}
