export const dynamic = 'force-dynamic';

"use client";
import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import api from "@/lib/api";

const CATEGORIES = [
  { slug: "", label: "All" },
  { slug: "business", label: "Business" },
  { slug: "gaming", label: "Gaming" },
  { slug: "student", label: "Student" },
  { slug: "ultrabook", label: "Ultrabook" },
  { slug: "workstation", label: "Workstation" },
];
const CONDITIONS = ["", "New", "Refurbished", "Used-Excellent", "Used-Good"];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.q = search;
      if (category) params.category = category;
      if (condition) params.condition = condition;
      if (sort) params.sort = sort;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || res.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#04080f] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Shop Laptops</h1>
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Search laptops..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" value={condition} onChange={e => setCondition(e.target.value)}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c || "Any Condition"}</option>)}
            </select>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" value={sort} onChange={e => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#04080f] flex items-center justify-center text-white">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
