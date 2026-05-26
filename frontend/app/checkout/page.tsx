"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

type PaymentMethod = "cod" | "stripe";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "Addis Ababa",
    region: "",
    country: "Ethiopia",
    notes: "",
  });

  const subtotal = total();
  const shipping = subtotal >= 10000 ? 0 : 200;
  const grandTotal = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!user) { toast.error("Please login to place an order"); router.push("/auth/login"); return; }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        product: i._id,
        quantity: i.quantity,
      }));
      const { data: order } = await api.post("/orders", {
        items: orderItems,
        shippingAddress: { fullName: form.fullName, phone: form.phone, address: form.address, city: form.city, region: form.region, country: form.country },
        paymentMethod: payMethod,
        notes: form.notes,
      });

      if (payMethod === "cod") {
        clearCart();
        setStep("success");
      } else {
        // Stripe flow
        const { data: pi } = await api.post("/payment/create-intent", { orderId: order._id });
        // For full Stripe integration, redirect to Stripe Elements checkout
        // Here we show a placeholder success for demo
        clearCart();
        setStep("success");
        toast.success("Order placed! Complete payment via Stripe.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
        <h2 className="font-head text-2xl font-bold text-white mb-4">Your cart is empty</h2>
        <Link href="/shop" className="btn-primary">Browse Laptops</Link>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green/10 border-2 border-green flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green" />
        </div>
        <h2 className="font-head text-4xl font-bold text-white mb-3">Order Placed!</h2>
        <p className="text-muted mb-2">Thank you for your order. We&apos;ll contact you shortly to confirm delivery.</p>
        <p className="text-muted text-sm mb-8">Check your email for order details.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/dashboard" className="btn-primary">View My Orders</Link>
          <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
        <div className="mt-8 p-4 card rounded-xl text-sm">
          <p className="text-muted mb-2">Need help? Contact us:</p>
          <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g,"")}`}
            target="_blank" rel="noopener noreferrer"
            className="text-green hover:underline">💬 WhatsApp Support</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart" className="text-muted hover:text-text transition-colors flex items-center gap-1.5 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="font-head text-3xl font-bold text-white">Checkout</h1>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Shipping", "Payment"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              (i === 0 && step === "shipping") || (i === 1 && step === "payment")
                ? "bg-blue text-white"
                : i === 0 && step === "payment"
                ? "bg-green text-white"
                : "bg-[rgba(26,107,255,0.1)] text-muted"
            }`}>
              {i === 0 && step === "payment" ? "✓" : i + 1}
            </div>
            <span className={`text-sm font-semibold ${step === (i === 0 ? "shipping" : "payment") ? "text-white" : "text-muted"}`}>
              {s}
            </span>
            {i === 0 && <div className="w-8 h-px bg-[rgba(26,107,255,0.2)]" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          {step === "shipping" ? (
            <form onSubmit={handleShippingSubmit} className="card rounded-xl p-6 space-y-4">
              <h2 className="font-head text-xl font-bold text-white mb-2">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Full Name *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} required className="input" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className="input" placeholder="+251..." />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Address *</label>
                <input name="address" value={form.address} onChange={handleChange} required className="input" placeholder="Street, building, area..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Region</label>
                  <input name="region" value={form.region} onChange={handleChange} className="input" placeholder="Sub-city / Woreda" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-wider">Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} className="input resize-none h-20" placeholder="Any special instructions..." />
              </div>
              <button type="submit" className="btn-primary w-full mt-2">
                Continue to Payment →
              </button>
            </form>
          ) : (
            <div className="card rounded-xl p-6">
              <h2 className="font-head text-xl font-bold text-white mb-5">Payment Method</h2>

              <div className="space-y-3 mb-6">
                {[
                  { value: "cod", label: "Cash on Delivery", desc: "Pay when your laptop arrives", icon: "💵" },
                  { value: "stripe", label: "Online Payment (Card)", desc: "Secure payment via Stripe", icon: "💳" },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    payMethod === opt.value
                      ? "border-blue bg-[rgba(26,107,255,0.08)]"
                      : "border-[rgba(26,107,255,0.15)] hover:border-[rgba(26,107,255,0.3)]"
                  }`}>
                    <input
                      type="radio"
                      name="payMethod"
                      value={opt.value}
                      checked={payMethod === opt.value as PaymentMethod}
                      onChange={() => setPayMethod(opt.value as PaymentMethod)}
                      className="accent-blue"
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{opt.label}</p>
                      <p className="text-muted text-xs">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted mb-6">
                <Lock className="w-3.5 h-3.5 text-green" />
                Your payment information is encrypted and secure
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("shipping")} className="btn-outline flex-1 text-sm">
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {loading ? "Placing Order..." : "Place Order →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="card rounded-xl p-5 h-fit sticky top-20">
          <h2 className="font-head text-lg font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {items.map(item => (
              <div key={item._id} className="flex gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#080f1c] flex-shrink-0">
                  <Image src={item.image || "https://placehold.co/48x48/0b1527/1a6bff?text=💻"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold line-clamp-1">{item.name}</p>
                  <p className="text-muted text-xs">Qty: {item.quantity}</p>
                  <p className="text-white text-xs font-bold">ETB {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(26,107,255,0.15)] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-white">ETB {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              <span className={shipping === 0 ? "text-green" : "text-white"}>
                {shipping === 0 ? "FREE" : `ETB ${shipping}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-[rgba(26,107,255,0.15)]">
              <span className="text-white">Total</span>
              <span className="text-white">ETB {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
