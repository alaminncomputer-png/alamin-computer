"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Subscribed! You'll get the best deals.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-20 px-4 max-w-[1280px] mx-auto">
      <div className="bg-gradient-to-br from-[rgba(26,107,255,0.12)] to-[rgba(0,212,255,0.06)] border border-[rgba(26,107,255,0.25)] rounded-2xl p-10 md:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(26,107,255,0.15)] border border-[rgba(26,107,255,0.3)] flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-blue" />
        </div>
        <h2 className="font-head text-4xl font-bold text-white mb-3">
          Get <span className="text-cyan">Exclusive</span> Deals
        </h2>
        <p className="text-muted text-[15px] max-w-md mx-auto mb-8">
          Subscribe to get notified about new arrivals, special discounts, and wholesale offers before anyone else.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary whitespace-nowrap disabled:opacity-60"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        <p className="text-muted-2 text-xs mt-4">No spam, unsubscribe anytime. 100% free.</p>
      </div>
    </section>
  );
}
