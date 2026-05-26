'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronRight, Shield, Truck, Award, Star, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { getWhatsAppLink, getTelegramLink, formatPrice } from '@/lib/api';
import api from '@/lib/api';

const TICKER_ITEMS = [
  'HP EliteBook Available', 'Dell Latitude In Stock', 'Lenovo ThinkPad', 'Gaming Laptops',
  'Core i7 & i9', 'Free Delivery Addis Ababa', 'Wholesale Prices', 'Warranty Included',
  'HP EliteBook Available', 'Dell Latitude In Stock', 'Lenovo ThinkPad', 'Gaming Laptops',
  'Core i7 & i9', 'Free Delivery Addis Ababa', 'Wholesale Prices', 'Warranty Included',
];

const HERO_STATS = [
  { num: '2000+', label: 'Laptops Sold' },
  { num: '500+', label: 'Happy Customers' },
  { num: '5 Yrs', label: 'In Business' },
  { num: '100%', label: 'Trusted' },
];

const CATEGORIES = [
  { icon: '🎮', label: 'Gaming', desc: 'High-performance', href: '/shop?category=gaming', color: 'from-red-500/20 to-orange-500/10' },
  { icon: '💼', label: 'Business', desc: 'Professional grade', href: '/shop?category=business', color: 'from-blue/20 to-cyan-brand/10' },
  { icon: '🎓', label: 'Student', desc: 'Budget friendly', href: '/shop?category=student', color: 'from-green-500/20 to-teal-500/10' },
  { icon: '🖥️', label: 'Workstation', desc: 'Maximum power', href: '/shop?category=workstation', color: 'from-purple-500/20 to-blue/10' },
];

const FEATURES = [
  { icon: <Shield className="w-6 h-6" />, title: 'Warranty Guaranteed', desc: '3-month warranty on all laptops with full after-sale support.' },
  { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Same-day delivery within Addis Ababa. Next-day to other cities.' },
  { icon: <Award className="w-6 h-6" />, title: 'Certified Quality', desc: 'Every laptop tested and graded before sale. No surprises.' },
];

const REVIEWS = [
  { name: 'Abebe T.', role: 'Wholesale Customer', rating: 5, text: 'Bought 20 laptops for my business. Quality is excellent and prices are unbeatable. Highly recommend!' },
  { name: 'Sara K.', role: 'Student', rating: 5, text: 'Got an HP EliteBook for university. Works perfectly. Delivery was same day. Very happy!' },
  { name: 'Dawit M.', role: 'IT Manager', rating: 5, text: 'Best laptop store in Addis Ababa. Always honest about conditions and very fast service.' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [countdown, setCountdown] = useState({ h: 8, m: 42, s: 17 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [feat, news, best] = await Promise.allSettled([
          api.get('/products/featured'),
          api.get('/products/new-arrivals'),
          api.get('/products/best-sellers'),
        ]);
        if (feat.status === 'fulfilled') setFeaturedProducts(feat.value.data.products || []);
        if (news.status === 'fulfilled') setNewArrivals(news.value.data.products || []);
        if (best.status === 'fulfilled') setBestSellers(best.value.data.products || []);
      } catch {
        // Silently fail - show demo UI
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <Navbar />
      <main>
        {/* Grid Background */}
        <div className="fixed inset-0 grid-bg bg-grid pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(26,107,255,0.1)_0%,transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(0,212,255,0.07)_0%,transparent_50%)]" />
        </div>

        {/* Hero */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 pt-16 pb-12 flex gap-14 flex-wrap items-center min-h-[82vh]">
          <motion.div
            className="flex-1 min-w-[280px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue/8 border border-blue/30 rounded-full px-4 py-2 text-xs text-cyan-brand font-semibold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-brand animate-pulse" />
              Ethiopia's #1 Laptop Store
            </div>
            <h1 className="font-head font-bold text-5xl sm:text-6xl lg:text-[72px] text-white leading-[1.05] mb-5">
              Trusted Laptop Store<br />
              for <em className="not-italic text-cyan-brand">Wholesale</em> &{' '}
              <em className="not-italic text-blue">Retail</em>
            </h1>
            <p className="text-lg text-white/50 max-w-md leading-relaxed mb-8">
              HP EliteBook · Dell Latitude · Lenovo ThinkPad · Gaming Laptops.<br />
              Best prices in Addis Ababa. Warranty included.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/shop" className="btn-primary flex items-center gap-2 text-base">
                Shop Now <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href={getWhatsAppLink("Hi! I'm interested in buying a laptop from Alamin Computer.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25d366] text-white rounded-xl px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.522 5.836L.057 23.856c-.079.23.146.455.376.376l6.064-1.474A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.861 0-3.601-.497-5.101-1.365l-.366-.216-3.752.911.928-3.679-.237-.383A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </a>
              <a
                href={getTelegramLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#229ed9] text-white rounded-xl px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/></svg>
                Telegram
              </a>
            </div>
            <div className="flex gap-8 flex-wrap">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-head font-bold text-2xl text-white">{s.num}</p>
                  <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="flex-1 min-w-[280px] max-w-[520px] relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-video bg-bg-3 rounded-2xl border border-blue/30 flex items-center justify-center text-[80px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue/10 to-transparent" />
              <span className="relative z-10">💻</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-blue/5 rounded-full blur-3xl" />
              </div>
            </div>
            {/* Float badges */}
            <div className="absolute -bottom-5 left-6 bg-bg-2 border border-blue/40 rounded-xl px-4 py-3 shadow-xl">
              <p className="text-[10px] text-white/40 mb-1">Today's Best Deal</p>
              <p className="font-head font-bold text-cyan-brand text-base">Up to 40% OFF</p>
            </div>
            <div className="absolute -top-5 right-6 bg-bg-2 border border-blue/40 rounded-xl px-4 py-3 shadow-xl">
              <p className="text-[10px] text-white/40 mb-1">Free Delivery</p>
              <p className="font-head font-bold text-white text-base">Addis Ababa</p>
            </div>
          </motion.div>
        </section>

        {/* Ticker */}
        <div className="relative z-10 border-y border-white/[0.06] bg-blue/[0.05] py-3 overflow-hidden">
          <div className="flex gap-12 animate-ticker w-max">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="font-head font-semibold text-sm text-cyan-brand tracking-widest uppercase flex items-center gap-2 whitespace-nowrap">
                <span className="text-blue text-[8px]">◆</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Daily Deals Countdown */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 py-10">
          <div className="bg-gradient-to-r from-blue/15 to-cyan-brand/5 border border-blue/30 rounded-2xl p-6 sm:p-8 flex flex-wrap gap-5 items-center justify-between">
            <div>
              <p className="text-xs text-cyan-brand font-semibold uppercase tracking-widest mb-1">🔥 Flash Sale Ends In</p>
              <div className="flex gap-3 items-center">
                {[['h', countdown.h], ['m', countdown.m], ['s', countdown.s]].map(([label, val]) => (
                  <div key={label as string} className="text-center">
                    <div className="font-head font-bold text-3xl text-white bg-bg-3/80 rounded-xl w-16 h-14 flex items-center justify-center border border-white/10">
                      {pad(val as number)}
                    </div>
                    <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-head font-bold text-2xl text-white mb-1">Today's Deals</h2>
              <p className="text-sm text-white/50 mb-4">Limited stock. Don't miss out!</p>
              <Link href="/shop?sort=price-asc" className="btn-primary text-sm">View Deals →</Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
          <div className="sec-label">Categories</div>
          <h2 className="font-head font-bold text-4xl text-white mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href}>
                <div className={`bg-gradient-to-br ${cat.color} border border-white/[0.08] rounded-2xl p-6 hover:border-blue/40 transition-all hover:-translate-y-1 duration-300 group`}>
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-head font-bold text-white text-lg">{cat.label}</h3>
                  <p className="text-xs text-white/40">{cat.desc}</p>
                  <ChevronRight className="w-4 h-4 text-white/20 mt-3 group-hover:text-blue transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="sec-label">Featured</div>
              <h2 className="font-head font-bold text-4xl text-white">Featured Laptops</h2>
            </div>
            <Link href="/shop" className="text-sm text-blue hover:text-cyan-brand flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-bg-2/80 border border-white/[0.08] rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-white/30">
              <p className="text-5xl mb-4">💻</p>
              <p className="font-head text-xl">Products loading...</p>
              <p className="text-sm mt-2">Connect your backend to see real products</p>
            </div>
          )}
        </section>

        {/* Features */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 bg-bg-2/50 border border-white/[0.06] rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue/10 border border-blue/20 rounded-xl flex items-center justify-center text-blue flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-head font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        {!loading && newArrivals.length > 0 && (
          <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="sec-label">New</div>
                <h2 className="font-head font-bold text-4xl text-white">New Arrivals</h2>
              </div>
              <Link href="/shop?sort=-createdAt" className="text-sm text-blue hover:text-cyan-brand flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </section>
        )}

        {/* Wholesale CTA */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
          <div className="bg-gradient-to-br from-bg-3 to-bg-2 border border-blue/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,107,255,0.1)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 bg-blue/10 border border-blue/30 rounded-full px-4 py-2 text-xs text-cyan-brand font-semibold tracking-widest uppercase mb-5">
                🏢 Wholesale Available
              </span>
              <h2 className="font-head font-bold text-4xl sm:text-5xl text-white mb-4">
                Buy in Bulk, Save More
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
                Special wholesale prices for businesses, schools, and resellers. Minimum 5 units.
                Contact us for a custom quote.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a
                  href={getWhatsAppLink("Hi! I'm interested in wholesale laptop pricing.")}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25d366] text-white rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  📲 WhatsApp for Wholesale
                </a>
                <Link href="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
          <div className="text-center mb-10">
            <div className="sec-label justify-center">Reviews</div>
            <h2 className="font-head font-bold text-4xl text-white">What Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-2/80 border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue/20 rounded-full flex items-center justify-center font-head font-bold text-blue">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{r.name}</p>
                    <p className="text-xs text-white/40">{r.role}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-brand-green ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        {!loading && bestSellers.length > 0 && (
          <section className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="sec-label">Popular</div>
                <h2 className="font-head font-bold text-4xl text-white">Best Sellers</h2>
              </div>
              <Link href="/shop?sort=best-seller" className="text-sm text-blue hover:text-cyan-brand flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
