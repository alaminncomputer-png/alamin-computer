"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import api from "@/lib/api";

type Tab = "featured" | "bestSellers" | "newArrivals";

const tabs: { key: Tab; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "bestSellers", label: "Best Sellers" },
  { key: "newArrivals", label: "New Arrivals" },
];

export default function FeaturedSection() {
  const [active, setActive] = useState<Tab>("featured");
  const [data, setData] = useState<Record<Tab, any[]>>({ featured: [], bestSellers: [], newArrivals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/featured")
      .then(({ data: d }) => setData({ featured: d.featured, bestSellers: d.bestSellers, newArrivals: d.newArrivals }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const products = data[active] || [];

  return (
    <section className="py-16 px-4 max-w-[1280px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-cyan text-xs font-semibold tracking-[0.18em] uppercase flex items-center gap-3 mb-3">
            <span className="w-7 h-0.5 bg-cyan inline-block" /> Our Laptops
          </p>
          <h2 className="font-head text-4xl font-bold text-white">
            Premium <span className="text-cyan">Selection</span>
          </h2>
        </div>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`font-head text-sm font-semibold px-4 py-2 rounded-lg transition-all tracking-wide ${
                active === t.key
                  ? "bg-blue text-white"
                  : "text-muted border border-[rgba(26,107,255,0.15)] hover:text-white hover:border-blue"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card rounded-xl h-72 animate-pulse bg-[rgba(26,107,255,0.04)]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <div className="text-5xl mb-4">💻</div>
          <p>No products available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link href="/shop" className="btn-outline inline-flex items-center gap-2">
          View All Laptops <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
