'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useAuthStore } from '@/store';
import { getWhatsAppLink, getTelegramLink } from '@/lib/api';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Gaming', href: '/shop?category=gaming' },
  { label: 'Business', href: '/shop?category=business' },
  { label: 'Student', href: '/shop?category=student' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-bg/95 border-b border-white/[0.06] backdrop-blur-xl">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-dim to-blue rounded-lg flex items-center justify-center text-lg">💻</div>
            <span className="font-head font-bold text-lg text-white hidden sm:block">
              Alamin <span className="text-cyan-brand">Computer</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-2 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-blue/50 transition-colors"
            />
          </form>

          {/* Nav Links */}
          <ul className="hidden lg:flex gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-head font-semibold text-sm px-3 py-2 rounded-md tracking-wide transition-colors ${
                    pathname === link.href ? 'text-white bg-blue/15' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* WhatsApp */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25d366] text-white rounded-lg px-3 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.522 5.836L.057 23.856c-.079.23.146.455.376.376l6.064-1.474A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.861 0-3.601-.497-5.101-1.365l-.366-.216-3.752.911.928-3.679-.237-.383A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>

            {/* Wishlist */}
            <Link href="/dashboard/wishlist" className="relative p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-sm hidden md:block">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 bg-bg-3 border border-white/10 rounded-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.06]">
                    <User className="w-4 h-4" /> My Dashboard
                  </Link>
                  {user.role !== 'user' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-brand hover:bg-white/[0.06]">
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-white/10" />
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/[0.06] w-full text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-1.5 border border-blue/40 text-white/70 hover:text-white hover:border-blue rounded-lg px-3 py-2 text-sm transition-colors">
                <User className="w-4 h-4" /> Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/50 hover:text-white rounded-lg border border-white/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/[0.06] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search laptops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30"
                  />
                </form>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block font-head font-semibold text-sm px-3 py-2.5 rounded-lg ${
                      pathname === link.href ? 'text-white bg-blue/15' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 pt-2">
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#25d366] text-white rounded-lg py-2.5 text-sm font-semibold">
                    WhatsApp
                  </a>
                  <a href={getTelegramLink()} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#229ed9] text-white rounded-lg py-2.5 text-sm font-semibold">
                    Telegram
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
