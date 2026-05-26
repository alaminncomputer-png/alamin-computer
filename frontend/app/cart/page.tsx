"use client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCartStore();
  const subtotal = total();
  const shipping = subtotal >= 10000 ? 0 : 200;
  const grandTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-20 h-20 text-muted-2 mx-auto mb-6" />
        <h2 className="font-head text-3xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-muted mb-8">Add some laptops to get started</p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
          Browse Laptops <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <h1 className="font-head text-4xl font-bold text-white mb-8">
        Shopping <span className="text-cyan">Cart</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="card rounded-xl p-4 flex gap-4"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#080f1c] flex-shrink-0">
                  <Image
                    src={item.image || "https://placehold.co/80x80/0b1527/1a6bff?text=💻"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="font-semibold text-white text-sm hover:text-cyan transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="font-head text-lg font-bold text-white mt-1">
                    ETB {item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-[rgba(26,107,255,0.2)] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-white text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)] transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-muted text-sm">
                      = ETB {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="ml-auto text-muted-2 hover:text-danger transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={clearCart}
            className="text-danger text-sm hover:text-white transition-colors flex items-center gap-1.5 mt-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div>
          <div className="card rounded-xl p-6 sticky top-20">
            <h2 className="font-head text-xl font-bold text-white mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal ({items.length} items)</span>
                <span className="text-white">ETB {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className={shipping === 0 ? "text-green font-semibold" : "text-white"}>
                  {shipping === 0 ? "FREE" : `ETB ${shipping.toLocaleString()}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-2">
                  Free shipping on orders over ETB 10,000
                </p>
              )}
              <div className="h-px bg-[rgba(26,107,255,0.15)] my-3" />
              <div className="flex justify-between">
                <span className="font-head font-bold text-white">Total</span>
                <span className="font-head font-bold text-xl text-white">
                  ETB {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/shop" className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
              Continue Shopping
            </Link>

            <div className="mt-5 pt-5 border-t border-[rgba(26,107,255,0.1)] space-y-2">
              <p className="text-xs text-muted flex items-center gap-2">
                <span className="text-green">✓</span> Secure checkout
              </p>
              <p className="text-xs text-muted flex items-center gap-2">
                <span className="text-green">✓</span> Cash on Delivery available
              </p>
              <p className="text-xs text-muted flex items-center gap-2">
                <span className="text-green">✓</span> Warranty on all laptops
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
