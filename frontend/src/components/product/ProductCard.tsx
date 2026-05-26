'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/store';
import { formatPrice, getWhatsAppLink } from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  condition: string;
  price: number;
  discountPrice?: number;
  images: { url: string; alt?: string }[];
  ratings: { average: number; count: number };
  stock: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  specifications?: {
    processor?: string;
    ram?: string;
    storage?: string;
  };
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);
  const effectivePrice = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: product._id,
      name: product.name,
      price: effectivePrice,
      image: product.images[0]?.url || '',
      stock: product.stock,
      slug: product.slug,
    });
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product._id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="group relative bg-bg-2/80 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue/5">
          
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-md">-{discount}%</span>
            )}
            {product.isBestSeller && (
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Hot
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-blue/80 text-white text-[10px] font-bold px-2 py-1 rounded-md">New</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm border transition-all ${
              isWishlisted
                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Image */}
          <div className="aspect-[4/3] relative bg-bg-3 overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl">💻</div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-white/40 font-medium mb-1">{product.brand} · {product.condition}</p>
            <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-2 group-hover:text-cyan-brand transition-colors">
              {product.name}
            </h3>

            {/* Specs Pills */}
            {product.specifications && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.specifications.processor && (
                  <span className="text-[10px] bg-white/[0.06] border border-white/[0.08] text-white/50 px-2 py-0.5 rounded-full">
                    {product.specifications.processor.split(' ').slice(0, 3).join(' ')}
                  </span>
                )}
                {product.specifications.ram && (
                  <span className="text-[10px] bg-white/[0.06] border border-white/[0.08] text-white/50 px-2 py-0.5 rounded-full">
                    {product.specifications.ram}
                  </span>
                )}
                {product.specifications.storage && (
                  <span className="text-[10px] bg-white/[0.06] border border-white/[0.08] text-white/50 px-2 py-0.5 rounded-full">
                    {product.specifications.storage}
                  </span>
                )}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.round(product.ratings.average)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-white/40">({product.ratings.count})</span>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                <p className="font-head font-bold text-white text-lg leading-none">
                  {formatPrice(effectivePrice)}
                </p>
                {product.discountPrice && (
                  <p className="text-xs text-white/30 line-through mt-0.5">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              <div className="flex gap-1.5">
                {/* WhatsApp Inquiry */}
                <a
                  href={getWhatsAppLink(`Hi, I'm interested in ${product.name}. Can you share more details?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] rounded-lg hover:bg-[#25d366]/20 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.522 5.836L.057 23.856c-.079.23.146.455.376.376l6.064-1.474A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.861 0-3.601-.497-5.101-1.365l-.366-.216-3.752.911.928-3.679-.237-.383A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                </a>
                {/* Add to Cart */}
                {product.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="p-2 bg-blue/15 border border-blue/30 text-blue rounded-lg hover:bg-blue hover:text-white transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="px-2 py-1 text-[10px] bg-white/[0.06] text-white/40 rounded-lg">Out of stock</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
