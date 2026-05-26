"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP || "+251933264444";
const TG = process.env.NEXT_PUBLIC_TELEGRAM || "Al_Aminn_computer";

export default function HeroSection() {
  return (
    <section className="min-h-[88vh] flex items-center py-20 px-4 max-w-[1280px] mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[rgba(26,107,255,0.08)] border border-[rgba(26,107,255,0.3)] rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green pulse-dot" />
              <span className="text-cyan text-xs font-semibold tracking-widest uppercase">
                Ethiopia&apos;s Trusted Laptop Store
              </span>
            </div>

            <h1 className="font-head text-[clamp(36px,5vw,68px)] font-bold text-white leading-[1.08] mb-5">
              Trusted Laptop Store{" "}
              <br className="hidden sm:block" />
              for{" "}
              <em className="not-italic text-cyan">Wholesale</em>
              {" & "}
              <em className="not-italic text-cyan">Retail</em>
            </h1>

            <p className="text-[17px] text-muted leading-relaxed max-w-md mb-9">
              Premium refurbished and new laptops in Addis Ababa. HP EliteBook, Dell Latitude,
              Lenovo ThinkPad & Gaming laptops — with warranty, at unbeatable prices.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/shop" className="btn-primary flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${WA.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25d366] text-white font-head font-bold tracking-wide px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                💬 WhatsApp
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

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: Shield, label: "Up to 6 Month Warranty" },
                { icon: Truck, label: "Delivery in Addis Ababa" },
                { icon: Award, label: "Genuine Products Only" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-muted text-sm">
                  <Icon className="w-4 h-4 text-cyan" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — Visual */}
        <motion.div
          className="flex-1 min-w-0 max-w-[540px] w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative">
            {/* Main card */}
            <div className="rounded-2xl border border-[rgba(26,107,255,0.3)] bg-[rgba(8,15,28,0.8)] overflow-hidden shadow-[0_0_80px_rgba(26,107,255,0.15)] aspect-video flex items-center justify-center backdrop-blur-sm">
              <div className="text-center px-8">
                <div className="text-8xl mb-4">💻</div>
                <div className="font-head text-2xl font-bold text-white mb-2">
                  ALAMIN COMPUTER
                </div>
                <div className="text-cyan text-sm tracking-widest uppercase">
                  Wholesale & Retail Laptops
                </div>
                <div className="mt-4 flex justify-center gap-3 flex-wrap">
                  {["HP", "Dell", "Lenovo", "ASUS", "Acer"].map((b) => (
                    <span
                      key={b}
                      className="text-xs text-muted-2 border border-[rgba(26,107,255,0.2)] rounded-full px-3 py-1"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge 1 */}
            <motion.div
              className="absolute -bottom-4 left-6 bg-[#080f1c] border border-[rgba(0,212,255,0.4)] rounded-xl p-3 shadow-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Starting From</p>
              <p className="font-head text-lg font-bold text-cyan">ETB 15,000</p>
            </motion.div>

            {/* Floating badge 2 */}
            <motion.div
              className="absolute -top-4 right-6 bg-[#080f1c] border border-[rgba(26,107,255,0.4)] rounded-xl p-3 shadow-xl"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
            >
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Bulk Orders</p>
              <p className="font-head text-lg font-bold text-blue">Wholesale Price</p>
            </motion.div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue/5 to-cyan/5 pointer-events-none" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { num: "500+", label: "Laptops Sold" },
              { num: "4.9★", label: "Customer Rating" },
              { num: "3+", label: "Years Experience" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="bg-[rgba(8,15,28,0.6)] border border-[rgba(26,107,255,0.15)] rounded-xl p-3 text-center"
              >
                <div className="font-head text-xl font-bold text-white">{num}</div>
                <div className="text-[10px] text-muted mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
