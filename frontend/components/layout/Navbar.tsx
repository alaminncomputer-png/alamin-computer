"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, LogOut, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=business", label: "Business" },
  { href: "/shop?category=gaming", label: "Gaming" },
  { href: "/shop?category=student", label: "Student" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const router = useRouter();
  const count = useCartStore((s) => s.count());
  const { user, logout, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const WA = process.env.NEXT_PUBLIC_WHATSAPP || "+251933264444";
  const TG = process.env.NEXT_PUBLIC_TELEGRAM || "Al_Aminn_computer";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(4,8,15,0.98)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-[rgba(4,8,15,0.95)]"
      } border-b border-[rgba(26,107,255,0.15)] backdrop-blur-xl`}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center gap-3 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-3 to-blue rounded-lg flex items-center justify-center text-lg shadow-[0_0_15px_rgba(26,107,255,0.4)] group-hover:shadow-[0_0_25px_rgba(26,107,255,0.6)] transition-shadow">
            💻
          </div>
          <span className="font-head text-lg font-bold tracking-wide text-white">
            ALAMIN<span className="text-cyan">.</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xs relative mx-2"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search laptops..."
            className="w-full input pl-9 py-2.5 text-sm"
          />
        </form>

        {/* Nav links (desktop) */}
        <ul className="hidden lg:flex gap-0.5 flex-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-head text-sm font-semibold text-muted px-3 py-2 rounded-md hover:text-white hover:bg-[rgba(26,107,255,0.12)] transition-all tracking-wide block"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <a
            href={`https://wa.me/${WA.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25d366] text-white text-xs font-semibold px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <span>💬</span> WhatsApp
          </a>
          <a
            href={`https://t.me/${TG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#229ed9] text-white text-xs font-semibold px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <span>✈️</span> Telegram
          </a>
        </div>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-1.5 bg-[rgba(26,107,255,0.1)] border border-[rgba(26,107,255,0.2)] text-text text-sm px-3 py-2 rounded-md hover:border-blue transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:block">Cart</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-3 border border-blue flex items-center justify-center text-xs font-bold text-white">
                {user.name[0].toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
            </button>
            <AnimatePresence>
              {userMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-48 card rounded-xl overflow-hidden shadow-xl"
                >
                  <div className="p-3 border-b border-[rgba(26,107,255,0.15)]">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)] rounded-md transition-colors"
                    >
                      <User className="w-4 h-4" /> My Orders
                    </Link>
                    <Link
                      href="/dashboard/wishlist"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-text hover:bg-[rgba(26,107,255,0.1)] rounded-md transition-colors"
                    >
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-cyan hover:text-white hover:bg-[rgba(26,107,255,0.1)] rounded-md transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setUserMenu(false); router.push("/"); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-[rgba(255,59,59,0.1)] rounded-md transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-text transition-colors px-3 py-2"
          >
            <User className="w-4 h-4" /> Login
          </Link>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden border border-[rgba(26,107,255,0.2)] text-text rounded-md p-2"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-[rgba(26,107,255,0.15)] overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2 w-4 h-4" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search laptops..."
                  className="input pl-9"
                />
              </form>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block font-head font-semibold text-muted hover:text-white px-3 py-2.5 rounded-lg hover:bg-[rgba(26,107,255,0.1)] transition-all tracking-wide"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <a
                  href={`https://wa.me/${WA.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#25d366] text-white text-sm font-semibold py-2.5 rounded-lg"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`https://t.me/${TG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#229ed9] text-white text-sm font-semibold py-2.5 rounded-lg"
                >
                  ✈️ Telegram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
