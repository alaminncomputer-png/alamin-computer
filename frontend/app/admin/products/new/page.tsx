"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    discountPrice: "",
    stock: "1",
    condition: "Like New",
    category: "",
    description: "",
    shortDescription: "",
    warranty: "3 months",
    processor: "",
    ram: "",
    storage: "",
    display: "",
    graphics: "",
    battery: "",
    os: "Windows 11",
    isFeatured: false,
    isNewArrival: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageUpload = async (e: any) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file: any) => formData.append("images", file));
      const res = await api.post("/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages(prev => [...prev, ...res.data.images]);
    } catch (err: any) {
      alert("Image upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.brand) {
      alert("Please fill name, brand and price!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        images,
        specifications: {
          processor: form.processor,
          ram: form.ram,
          storage: form.storage,
          display: form.display,
          graphics: form.graphics,
          battery: form.battery,
          os: form.os,
        },
      });
      alert("Product added successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      alert("Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04080f] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h2 className="font-bold text-blue-400">Basic Info</h2>
            <input name="name" placeholder="Product Name *" value={form.name} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="brand" placeholder="Brand * (e.g. HP, Dell)" value={form.brand} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="model" placeholder="Model (e.g. EliteBook 840)" value={form.model} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <select name="condition" value={form.condition} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              <option>New</option>
              <option>Like New</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
            <textarea name="description" placeholder="Description *" value={form.description} onChange={handleChange} rows={3} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="shortDescription" placeholder="Short Description" value={form.shortDescription} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>

          {/* Pricing */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h2 className="font-bold text-blue-400">Pricing & Stock</h2>
            <input name="price" type="number" placeholder="Price (ETB) *" value={form.price} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="discountPrice" type="number" placeholder="Discount Price (ETB)" value={form.discountPrice} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="stock" type="number" placeholder="Stock Quantity" value={form.stock} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="warranty" placeholder="Warranty (e.g. 3 months)" value={form.warranty} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>

          {/* Specifications */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h2 className="font-bold text-blue-400">Specifications</h2>
            <input name="processor" placeholder="Processor (e.g. Intel Core i5-10th)" value={form.processor} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="ram" placeholder="RAM (e.g. 8GB DDR4)" value={form.ram} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="storage" placeholder="Storage (e.g. 256GB SSD)" value={form.storage} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="display" placeholder="Display (e.g. 14 inch FHD)" value={form.display} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="graphics" placeholder="Graphics (e.g. Intel UHD 620)" value={form.graphics} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="battery" placeholder="Battery (e.g. 45Wh)" value={form.battery} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="os" placeholder="OS (e.g. Windows 11)" value={form.os} onChange={handleChange} className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>

          {/* Images */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h2 className="font-bold text-blue-400">Images</h2>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, i) => (
                <img key={i} src={img.url} className="w-20 h-20 object-cover rounded-lg" />
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h2 className="font-bold text-blue-400">Options</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              Featured Product
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} />
              New Arrival
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-base"
            style={{ background: loading ? "#555" : "#1a6bff" }}
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
