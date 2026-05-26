import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Award, Users, Truck, Star, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Alamin Computer Ethiopia",
  description:
    "Learn about Alamin Computer — Ethiopia's trusted laptop store for wholesale and retail customers. Quality laptops, fair prices, excellent service.",
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP || "+251900000000";
const TG = process.env.NEXT_PUBLIC_TELEGRAM || "alamincomputer";

export default function AboutPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-cyan text-xs font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-3 mb-4">
          <span className="w-7 h-0.5 bg-cyan inline-block" /> Our Story <span className="w-7 h-0.5 bg-cyan inline-block" />
        </p>
        <h1 className="font-head text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
          Ethiopia&apos;s Most{" "}
          <span className="text-cyan">Trusted</span>
          <br />
          Laptop Store
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Alamin Computer was founded with a single mission: to provide quality, affordable laptops
          to businesses and individuals across Ethiopia — with transparency, warranty, and real after-sale support.
        </p>
      </div>

      {/* Story section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-24">
        <div>
          <h2 className="font-head text-4xl font-bold text-white mb-5">
            Why We <span className="text-cyan">Exist</span>
          </h2>
          <p className="text-muted text-[15px] leading-relaxed mb-4">
            In Ethiopia, finding a quality refurbished laptop at a fair price — with warranty — was nearly impossible.
            Markets were flooded with overpriced imports and untested machines. Customers had no recourse when
            things went wrong.
          </p>
          <p className="text-muted text-[15px] leading-relaxed mb-4">
            We changed that. Alamin Computer sources premium refurbished HP EliteBooks, Dell Latitudes,
            Lenovo ThinkPads, and more directly — tests each machine, provides warranty, and stands behind
            every sale.
          </p>
          <p className="text-muted text-[15px] leading-relaxed mb-8">
            Whether you&apos;re a student buying your first laptop, a business owner equipping a team,
            or an IT buyer sourcing wholesale — we have the right laptop for you, at the right price.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/shop" className="btn-primary">Browse Laptops</Link>
            <Link href="/contact" className="btn-outline">Get Wholesale Quote</Link>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue/10 to-cyan/5 border border-[rgba(26,107,255,0.25)] rounded-2xl p-10 text-center">
            <div className="text-8xl mb-5">💻</div>
            <p className="font-head text-3xl font-bold text-white mb-2">ALAMIN COMPUTER</p>
            <p className="text-cyan text-sm tracking-widest uppercase">Addis Ababa, Ethiopia</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { num: "500+", label: "Laptops Sold" },
                { num: "3+", label: "Years Active" },
                { num: "4.9★", label: "Rating" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-[rgba(26,107,255,0.08)] border border-[rgba(26,107,255,0.15)] rounded-xl p-3">
                  <p className="font-head text-xl font-bold text-white">{num}</p>
                  <p className="text-muted-2 text-[10px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="font-head text-4xl font-bold text-white mb-3">
            Our <span className="text-cyan">Values</span>
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            Everything we do is guided by these core principles.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Shield,
              title: "Quality First",
              desc: "Every laptop is tested, cleaned, and verified before listing. No hidden defects, ever.",
            },
            {
              icon: Award,
              title: "Fair Pricing",
              desc: "We believe quality laptops should be accessible. Our prices reflect the real market value.",
            },
            {
              icon: Users,
              title: "Customer Trust",
              desc: "Our reputation is built on repeat customers. We treat every buyer like a long-term partner.",
            },
            {
              icon: Truck,
              title: "Reliable Service",
              desc: "Fast delivery, responsive support on WhatsApp and Telegram, and warranty on all products.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card rounded-xl p-6 text-center hover:border-[rgba(26,107,255,0.4)] transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[rgba(26,107,255,0.1)] border border-[rgba(26,107,255,0.2)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(26,107,255,0.2)] transition-colors">
                <Icon className="w-7 h-7 text-blue" />
              </div>
              <h3 className="font-head font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wholesale & Retail */}
      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wholesale */}
          <div className="bg-gradient-to-br from-blue/15 to-blue-3/10 border border-blue/30 rounded-2xl p-8">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-head text-3xl font-bold text-white mb-3">Wholesale Buyers</h3>
            <p className="text-muted text-[15px] leading-relaxed mb-5">
              We supply laptops in bulk to businesses, schools, NGOs, and IT companies across Ethiopia.
              Get competitive pricing with as few as 5 units.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Special bulk discounts from 5+ units",
                "Consistent stock across models",
                "Invoices and receipts provided",
                "Flexible payment terms",
                "Dedicated account manager",
                "Priority delivery",
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle className="w-4 h-4 text-green flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/${WA.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I'm interested in wholesale pricing for laptops.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25d366] text-white font-head font-bold tracking-wide px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              💬 Get Wholesale Quote
            </a>
          </div>

          {/* Retail */}
          <div className="bg-gradient-to-br from-cyan/10 to-blue/5 border border-cyan/20 rounded-2xl p-8">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="font-head text-3xl font-bold text-white mb-3">Retail Customers</h3>
            <p className="text-muted text-[15px] leading-relaxed mb-5">
              Whether you&apos;re a student, freelancer, designer, or professional — we have the right laptop
              for your needs and budget. All come with warranty and support.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "3 to 6 month warranty included",
                "Full testing before sale",
                "Same-day delivery in Addis Ababa",
                "Cash on delivery available",
                "WhatsApp after-sale support",
                "Easy returns within 7 days",
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle className="w-4 h-4 text-cyan flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
              Browse Laptops →
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="font-head text-4xl font-bold text-white mb-3">
            Why Customers <span className="text-cyan">Trust Us</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: "🔍",
              title: "Thorough Testing",
              desc: "Battery, screen, keyboard, ports, CPU — everything is tested before listing.",
            },
            {
              icon: "📋",
              title: "Honest Listings",
              desc: "Accurate condition ratings, genuine photos, and real specifications on every product.",
            },
            {
              icon: "🛡️",
              title: "Warranty Coverage",
              desc: "All laptops come with 3–6 months warranty. Hardware failures are covered.",
            },
            {
              icon: "📞",
              title: "Responsive Support",
              desc: "WhatsApp and Telegram support 7 days a week. Fast response guaranteed.",
            },
            {
              icon: "🚚",
              title: "Reliable Delivery",
              desc: "Same-day delivery in Addis Ababa. Safe packaging for every shipment.",
            },
            {
              icon: "⭐",
              title: "Proven Track Record",
              desc: "500+ happy customers with 4.9/5 average rating and hundreds of reviews.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="card rounded-xl p-5 hover:border-[rgba(26,107,255,0.4)] transition-colors"
            >
              <span className="text-3xl mb-4 block">{icon}</span>
              <h3 className="font-head font-bold text-white mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue/15 to-cyan/5 border border-blue/25 rounded-2xl p-12 text-center">
        <div className="flex justify-center mb-5">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className="w-6 h-6 text-orange fill-orange" />
          ))}
        </div>
        <h2 className="font-head text-4xl font-bold text-white mb-4">
          Ready to Find Your <span className="text-cyan">Perfect Laptop</span>?
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8 text-[15px]">
          Browse our collection or contact us on WhatsApp and we&apos;ll find exactly what you need.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/shop" className="btn-primary">Shop Now</Link>
          <a
            href={`https://wa.me/${WA.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25d366] text-white font-head font-bold tracking-wide px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            💬 Chat on WhatsApp
          </a>
          <a
            href={`https://t.me/${TG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#229ed9] text-white font-head font-bold tracking-wide px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            ✈️ Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
