'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';

const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Best Sellers', value: 'best-seller' },
];

const CONDITION_OPTIONS = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, sort, category, brand, condition, minPrice, maxPrice, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch {}
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/products/meta/brands');
      setBrands(data.brands);
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (brand) params.brand = brand;
      if (condition) params.condition = condition;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const hasFilters = search || category || brand || condition || minPrice || maxPrice;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-head font-bold text-white mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => setCategory('')}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-blue/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setCategory(cat._id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${category === cat._id ? 'bg-blue/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-head font-bold text-white mb-3">Brand</h3>
          <div className="space-y-2">
            <button onClick={() => setBrand('')} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!brand ? 'bg-blue/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'}`}>
              All Brands
            </button>
            {brands.map((b) => (
              <button key={b} onClick={() => setBrand(b)} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${brand === b ? 'bg-blue/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'}`}>
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Condition */}
      <div>
        <h3 className="font-head font-bold text-white mb-3">Condition</h3>
        <div className="space-y-2">
          <button onClick={() => setCondition('')} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!condition ? 'bg-blue/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'}`}>
            Any Condition
          </button>
          {CONDITION_OPTIONS.map((c) => (
            <button key={c} onClick={() => setCondition(c)} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${condition === c ? 'bg-blue/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-head font-bold text-white mb-3">Price Range (ETB)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full border border-red-500/30 text-red-400 rounded-lg py-2 text-sm hover:bg-red-500/10 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        <div className="fixed inset-0 grid-bg bg-grid pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(26,107,255,0.08)_0%,transparent_55%)]" />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-head font-bold text-4xl text-white mb-2">Shop All Laptops</h1>
            <p className="text-white/40">
              {loading ? 'Loading...' : `${pagination.total} laptops available`}
            </p>
          </div>

          {/* Search + Sort Bar */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search laptops, brands, specs..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-bg-2/80 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/30"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-bg-2/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 min-w-[160px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: '#0b1527' }}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 bg-bg-2/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasFilters && <span className="bg-blue text-white text-[10px] px-1.5 py-0.5 rounded-full">!</span>}
            </button>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="bg-bg-2/60 border border-white/[0.06] rounded-2xl p-5 sticky top-20">
                <h2 className="font-head font-bold text-white mb-5 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                  {hasFilters && (
                    <button onClick={clearFilters} className="ml-auto text-red-400 text-xs hover:underline">Clear</button>
                  )}
                </h2>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="fixed inset-y-0 left-0 z-50 w-72 bg-bg-3 border-r border-white/10 p-6 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-head font-bold text-white text-lg">Filters</h2>
                    <button onClick={() => setFiltersOpen(false)} className="text-white/40 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterPanel />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-bg-2/80 border border-white/[0.08] rounded-2xl h-72 animate-pulse" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-blue/40 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                            page === i + 1 ? 'bg-blue text-white' : 'border border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-blue/40 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24">
                  <p className="text-5xl mb-4">🔍</p>
                  <h3 className="font-head text-2xl text-white mb-2">No laptops found</h3>
                  <p className="text-white/40 mb-6">Try adjusting your filters</p>
                  <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center text-white">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
