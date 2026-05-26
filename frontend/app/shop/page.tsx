"use client";
import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import api from "@/lib/api";

const CATEGORIES = [
  { slug: "", label: "All" },
  { slug: "business", label: "Business" },
  { slug: "gaming", label: "Gaming" },
  { slug: "student", label: "Student" },
  { slug: "ultrabook", label: "Ultrabook" },
  { slug: "workstation", label: "Workstation" },
  { slug: "wholesale", label: "Wholesale" },
];
const CONDITIONS = ["", "New", "Refurbished", "Used-Excellent", "Used-Good"];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Best Rated" },
];

function ShopPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (condition) params.condition = condition;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await api.get("/products", { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, condition, sort, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch(""); setCategory(""); setCondition("");
    setMinPrice(""); setMaxPrice(""); setPage(1); setSort("newest");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-head text-4xl font-bold text-white mb-2">
          All <span className="text-cyan">Laptops</span>
        </h1>
        <p className="text-muted">
          {loading ? "Loading..." : `${total} laptops available`}
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2 w-4 h-4" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search laptops, brands, specs..."
            className="input pl-9"
          />
        </form>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="input w-48 appearance-none cursor-pointer"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-[rgba(26,107,255,0.2)] text-muted hover:text-text hover:border-blue px-4 py-2.5 rounded-lg transition-colors text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c.slug}
            onClick={() => { setCategory(c.slug); setPage(1); }}
            className={`font-head font-semibold text-sm px-4 py-2 rounded-lg transition-all tracking-wide ${
              category === c.slug
                ? "bg-blue text-white"
                : "border border-[rgba(26,107,255,0.2)] text-muted hover:text-text hover:border-blue"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted mb-2 block font-semibold uppercase tracking-wider">Condition</label>
            <select value={condition} onChange={e => setCondition(e.target.value)} className="input">
              {CONDITIONS.map(c => <option key={c} value={c}>{c || "All Conditions"}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted mb-2 block font-semibold uppercase tracking-wider">Min Price (ETB)</label>
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="0"
              className="input"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-2 block font-semibold uppercase tracking-wider">Max Price (ETB)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="200000"
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button onClick={clearFilters} className="flex items-center gap-2 text-danger text-sm hover:text-white transition-colors px-4 py-2.5">
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card rounded-xl h-80 animate-pulse bg-[rgba(26,107,255,0.04)]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-head text-2xl font-bold text-white mb-2">No laptops found</h3>
          <p className="text-muted mb-6">Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="btn-primary btn-sm">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-[rgba(26,107,255,0.2)] text-muted rounded-lg disabled:opacity-40 hover:border-blue hover:text-text transition-colors"
          >
            Previous
          </button>
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                page === i + 1
                  ? "bg-blue text-white"
                  : "border border-[rgba(26,107,255,0.2)] text-muted hover:border-blue hover:text-text"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 text-sm border border-[rgba(26,107,255,0.2)] text-muted rounded-lg disabled:opacity-40 hover:border-blue hover:text-text transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageInner />
    </Suspense>
  );
}
