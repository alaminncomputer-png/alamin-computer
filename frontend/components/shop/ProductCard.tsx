"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: { url: string; publicId: string }[];
  specs?: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    batteryCondition?: string;
  };
  condition?: string;
  rating?: number;
  numReviews?: number;
  stock?: number;
  warranty?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.stock || product.stock < 1) {
      toast.error("Out of stock");
      return;
    }
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  const img = product.images[0]?.url || "https://placehold.co/400x400/0b1527/1a6bff?text=Laptop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="card rounded-xl overflow-hidden hover:border-[rgba(26,107,255,0.5)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(26,107,255,0.15)] transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-[#080f1c] overflow-hidden">
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.discount && product.discount > 0 && (
                <span className="bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> Best Seller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>

            {/* Stock badge */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-[rgba(4,8,15,0.7)] flex items-center justify-center">
                <span className="bg-[rgba(255,59,59,0.15)] border border-danger text-danger text-sm font-semibold px-4 py-2 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Quick Add (hover) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-[rgba(4,8,15,0.95)] to-transparent">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-blue text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-2 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Specs chips */}
            {product.specs && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {product.specs.processor && (
                  <span className="text-[10px] text-muted-2 bg-[rgba(26,107,255,0.07)] border border-[rgba(26,107,255,0.15)] px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    {product.specs.processor.split(" ").slice(0, 3).join(" ")}
                  </span>
                )}
                {product.specs.ram && (
                  <span className="text-[10px] text-muted-2 bg-[rgba(26,107,255,0.07)] border border-[rgba(26,107,255,0.15)] px-2 py-0.5 rounded-full">
                    {product.specs.ram}
                  </span>
                )}
                {product.specs.storage && (
                  <span className="text-[10px] text-muted-2 bg-[rgba(26,107,255,0.07)] border border-[rgba(26,107,255,0.15)] px-2 py-0.5 rounded-full">
                    {product.specs.storage}
                  </span>
                )}
              </div>
            )}

            <h3 className="font-head font-semibold text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-cyan transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.numReviews && product.numReviews > 0 ? (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= Math.round(product.rating || 0)
                          ? "text-orange fill-orange"
                          : "text-muted-2"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-2">({product.numReviews})</span>
              </div>
            ) : null}

            {/* Condition & warranty */}
            <div className="flex items-center gap-2 mb-3">
              {product.condition && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    product.condition === "New"
                      ? "text-green border-green/30 bg-green/10"
                      : "text-cyan border-cyan/30 bg-cyan/10"
                  }`}
                >
                  {product.condition}
                </span>
              )}
              {product.warranty && (
                <span className="text-[10px] text-muted-2">🛡️ {product.warranty}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-head font-bold text-lg text-white">
                ETB {product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-muted-2 line-through">
                  ETB {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.stock && product.stock > 0 ? "bg-green" : "bg-danger"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  product.stock && product.stock > 0 ? "text-green" : "text-danger"
                }`}
              >
                {product.stock && product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
