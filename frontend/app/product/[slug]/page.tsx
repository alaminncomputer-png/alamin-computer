"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Zap, Shield, Truck, Star, ChevronLeft, Check, Heart
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/api";
import ReviewForm from "@/components/ReviewForm";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/shop/ProductCard";

const WA = process.env.NEXT_PUBLIC_WHATSAPP || "+251933264444";
const TG = process.env.NEXT_PUBLIC_TELEGRAM || "Al_Aminn_computer";

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"specs" | "reviews">("specs");
  const [reviews, setReviews] = useState<any[]>([]);

  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.related);
        return api.get(`/reviews/product/${data.product._id}`);
      })
      .then(({ data }) => setReviews(data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product.stock || product.stock < 1) { toast.error("Out of stock"); return; }
    for (let i = 0; i < qty; i++) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || "",
        slug: product.slug,
        stock: product.stock,
      });
    }
    toast.success(`${qty} × ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const waMsg = encodeURIComponent(`Hi! I'm interested in: ${product?.name}\nPrice: ETB ${product?.price?.toLocaleString()}\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const tgMsg = encodeURIComponent(`Hi! Interested in: ${product?.name}`);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-[rgba(26,107,255,0.04)] rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-[rgba(26,107,255,0.04)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="font-head text-2xl font-bold text-white mb-4">Product not found</h2>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const specs = product.specs || {};

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-text transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-text transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-text truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#080f1c] border border-[rgba(26,107,255,0.2)] mb-3">
            <Image
              src={product.images[activeImg]?.url || "https://placehold.co/600x600/0b1527/1a6bff?text=Laptop"}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-danger text-white font-bold text-sm px-3 py-1 rounded-full">
                -{product.discount}% OFF
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImg === i ? "border-blue" : "border-[rgba(26,107,255,0.15)]"
                  }`}
                >
                  <Image src={img.url} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-4">
            {product.isBestSeller && (
              <span className="badge bg-[rgba(255,140,0,0.1)] border-orange/30 text-orange">
                <Zap className="w-3 h-3" /> Best Seller
              </span>
            )}
            <span className={`badge ${
              product.condition === "New"
                ? "bg-green/10 border-green/30 text-green"
                : "bg-cyan/10 border-cyan/30 text-cyan"
            }`}>
              {product.condition}
            </span>
            {product.warranty && (
              <span className="badge bg-[rgba(26,107,255,0.08)] border-blue/30 text-blue">
                🛡️ {product.warranty} warranty
              </span>
            )}
          </div>

          <h1 className="font-head text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-orange fill-orange" : "text-muted-2"}`} />
                ))}
              </div>
              <span className="text-white font-semibold text-sm">{product.rating}</span>
              <span className="text-muted text-sm">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-head text-4xl font-bold text-white">
              ETB {product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-muted text-xl line-through">
                ETB {product.oldPrice.toLocaleString()}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-green font-semibold text-sm">
                Save ETB {(product.oldPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-6 ${
            product.stock > 0
              ? "bg-green/10 text-green border border-green/20"
              : "bg-danger/10 text-danger border border-danger/20"
          }`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green" : "bg-danger"} pulse-dot`} />
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-muted text-sm leading-relaxed mb-6">{product.shortDescription}</p>
          )}

          {/* Qty & Actions */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center border border-[rgba(26,107,255,0.2)] rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-11 text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)] transition-colors text-xl"
              >
                −
              </button>
              <span className="w-12 text-center text-white font-semibold">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="w-10 h-11 text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)] transition-colors text-xl"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-cyan text-bg font-head font-bold tracking-wide py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              Buy Now
            </button>
          </div>

          {/* WhatsApp / Telegram inquiry */}
          <div className="flex gap-2 mb-6">
            <a
              href={`https://wa.me/${WA.replace(/\D/g,"")}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25d366]/10 border border-[#25d366]/30 text-[#25d366] text-sm font-semibold py-2.5 rounded-lg hover:bg-[#25d366]/20 transition-colors"
            >
              💬 Inquire on WhatsApp
            </a>
            <a
              href={`https://t.me/${TG}?text=${tgMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#229ed9]/10 border border-[#229ed9]/30 text-[#229ed9] text-sm font-semibold py-2.5 rounded-lg hover:bg-[#229ed9]/20 transition-colors"
            >
              ✈️ Inquire on Telegram
            </a>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "Warranty Included" },
              { icon: Truck, label: "Fast Delivery" },
              { icon: Check, label: "Tested & Verified" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 bg-[rgba(26,107,255,0.05)] border border-[rgba(26,107,255,0.1)] rounded-xl p-3 text-center">
                <Icon className="w-4 h-4 text-cyan" />
                <span className="text-[10px] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-2 mb-6 border-b border-[rgba(26,107,255,0.15)]">
          {["specs", "reviews"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as "specs" | "reviews")}
              className={`font-head font-semibold text-sm px-5 py-3 transition-all capitalize border-b-2 ${
                tab === t
                  ? "text-cyan border-cyan"
                  : "text-muted border-transparent hover:text-text"
              }`}
            >
              {t === "reviews" ? `Reviews (${reviews.length})` : "Specifications"}
            </button>
          ))}
        </div>

        {tab === "specs" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Processor", specs.processor],
              ["Generation", specs.processorGen],
              ["RAM", specs.ram],
              ["Storage", `${specs.storage} ${specs.storageType || "SSD"}`],
              ["Display", specs.display],
              ["Graphics", specs.graphics],
              ["Battery", specs.battery],
              ["Battery Condition", specs.batteryCondition],
              ["Operating System", specs.os],
              ["Weight", specs.weight],
              ["Condition", product.condition],
              ["Warranty", product.warranty],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k as string} className="flex gap-3 py-3 border-b border-[rgba(26,107,255,0.1)] last:border-0">
                <span className="text-muted text-sm w-40 flex-shrink-0">{k}</span>
                <span className="text-white text-sm font-medium">{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((r: any) => (
                <div key={r._id} className="card rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-3 flex items-center justify-center text-white font-bold text-sm">
                        {r.user?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{r.user?.name || "Customer"}</p>
                        <p className="text-muted-2 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-orange fill-orange" : "text-muted-2"}`} />
                      ))}
                    </div>
                  </div>
                  {r.title && <p className="text-white text-sm font-semibold mb-1">{r.title}</p>}
                  <p className="text-muted text-sm">{r.comment}</p>
                </div>
              ))
            )}

            {/* Write Review Form */}
            <div style={{marginTop:'24px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(26,107,255,0.2)',borderRadius:'16px',padding:'20px'}}>
              <h3 style={{color:'white',fontWeight:'bold',fontSize:'16px',marginBottom:'16px'}}>⭐ Write a Review</h3>
              <ReviewForm productId={product._id} onReviewAdded={(r: any) => setReviews((prev: any[]) => [r, ...prev])} />
            </div>
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-head text-3xl font-bold text-white mb-6">
            Related <span className="text-cyan">Laptops</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
