'use client';

import Link from 'next/link';
import { getWhatsAppLink, getTelegramLink } from '@/lib/api';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All Laptops', href: '/shop' },
  { label: 'Gaming Laptops', href: '/shop?category=gaming' },
  { label: 'Business Laptops', href: '/shop?category=business' },
  { label: 'Student Laptops', href: '/shop?category=student' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Warranty Info', href: '/warranty' },
  { label: 'Delivery Info', href: '/delivery' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-bg-2/50 mt-20">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-dim to-blue rounded-lg flex items-center justify-center text-lg">💻</div>
              <span className="font-head font-bold text-lg text-white">
                Alamin <span className="text-cyan-brand">Computer</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Ethiopia's trusted laptop store for wholesale & retail. Premium laptops at the best prices in Addis Ababa.
            </p>
            <div className="flex gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25d366]/10 border border-[#25d366]/30 text-[#25d366] rounded-lg px-3 py-2 text-xs font-semibold hover:bg-[#25d366]/20 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.522 5.836L.057 23.856c-.079.23.146.455.376.376l6.064-1.474A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.861 0-3.601-.497-5.101-1.365l-.366-.216-3.752.911.928-3.679-.237-.383A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </a>
              <a
                href={getTelegramLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#229ed9]/10 border border-[#229ed9]/30 text-[#229ed9] rounded-lg px-3 py-2 text-xs font-semibold hover:bg-[#229ed9]/20 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/></svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-head font-bold text-white tracking-wide mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-head font-bold text-white tracking-wide mb-5">Policies</h3>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-head font-bold text-white tracking-wide mb-5">Contact Us</h3>
            <div className="space-y-3 text-sm text-white/50">
              <p>📍 Addis Ababa, Ethiopia</p>
              <p>📞 +251 91 234 5678</p>
              <p>📧 alamincomputer@gmail.com</p>
              <p className="pt-2">
                <a href={`https://facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_URL || 'alamincomputer'}`}
                   target="_blank" rel="noopener noreferrer"
                   className="text-[#1877f2] hover:underline">
                  📘 Facebook Page
                </a>
              </p>
            </div>

            {/* Newsletter */}
            <div className="mt-5">
              <p className="text-xs text-white/40 mb-2">Subscribe for deals & offers</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 min-w-0"
                />
                <button className="bg-blue text-white rounded-lg px-3 py-2 text-xs font-semibold hover:bg-blue-dim transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Alamin Computer. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            🔒 Secure Payments · Fast Delivery · Trusted Store
          </p>
        </div>
      </div>
    </footer>
  );
}
