import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const WA = process.env.NEXT_PUBLIC_WHATSAPP || "+251933264444";
  const TG = process.env.NEXT_PUBLIC_TELEGRAM || "Al_Aminn_computer";
  const FB = process.env.NEXT_PUBLIC_FACEBOOK || "https://facebook.com/Al_Aminn_computer";

  return (
    <footer className="border-t border-[rgba(26,107,255,0.15)] bg-[rgba(8,15,28,0.8)] mt-20">
      {/* Top CTA */}
      <div className="bg-gradient-to-r from-blue-3/20 to-blue/10 border-b border-[rgba(26,107,255,0.2)]">
        <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-head text-2xl font-bold text-white">Need Help Choosing a Laptop?</h3>
            <p className="text-muted text-sm mt-1">Our experts are ready to help you find the perfect match.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href={`https://wa.me/${WA.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25d366] text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href={`https://t.me/${TG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#229ed9] text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              ✈️ Message on Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-3 to-blue rounded-lg flex items-center justify-center text-lg">
              💻
            </div>
            <span className="font-head text-xl font-bold text-white">
              ALAMIN<span className="text-cyan">.</span>
            </span>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Ethiopia's trusted laptop store for wholesale and retail customers. Quality laptops, competitive prices, excellent service.
          </p>
          <div className="flex gap-3">
            <a
              href={FB}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-[rgba(26,107,255,0.2)] flex items-center justify-center text-muted hover:text-blue hover:border-blue transition-colors text-sm"
            >
              f
            </a>
            <a
              href={`https://wa.me/${WA.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-[rgba(26,107,255,0.2)] flex items-center justify-center text-muted hover:text-[#25d366] hover:border-[#25d366] transition-colors text-xs"
            >
              WA
            </a>
            <a
              href={`https://t.me/${TG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-[rgba(26,107,255,0.2)] flex items-center justify-center text-muted hover:text-[#229ed9] hover:border-[#229ed9] transition-colors text-xs"
            >
              TG
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-head font-bold text-white tracking-wide mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "All Laptops" },
              { href: "/shop?category=business", label: "Business Laptops" },
              { href: "/shop?category=gaming", label: "Gaming Laptops" },
              { href: "/shop?category=student", label: "Student Laptops" },
              { href: "/about", label: "About Us" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted text-sm hover:text-cyan transition-colors hover:ml-1 inline-block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-head font-bold text-white tracking-wide mb-5">Customer Service</h4>
          <ul className="space-y-3">
            {[
              { href: "/contact", label: "Contact Us" },
              { href: "/dashboard", label: "My Orders" },
              { href: "/auth/register", label: "Create Account" },
              { href: "/auth/login", label: "Login" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted text-sm hover:text-cyan transition-colors hover:ml-1 inline-block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t border-[rgba(26,107,255,0.15)]">
            <p className="text-xs text-muted-2 flex items-center gap-2 mb-2">
              <span className="text-green">●</span> Delivery in Addis Ababa
            </p>
            <p className="text-xs text-muted-2 flex items-center gap-2">
              <span className="text-blue">●</span> 3–6 month warranty
            </p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-head font-bold text-white tracking-wide mb-5">Contact Us</h4>
          <div className="space-y-4">
            <a
              href={`tel:${WA}`}
              className="flex items-start gap-3 text-muted text-sm hover:text-text transition-colors group"
            >
              <Phone className="w-4 h-4 mt-0.5 text-blue flex-shrink-0" />
              <span>{WA}</span>
            </a>
            <a
              href="mailto:info@Al_Aminn_computer.com"
              className="flex items-start gap-3 text-muted text-sm hover:text-text transition-colors"
            >
              <Mail className="w-4 h-4 mt-0.5 text-blue flex-shrink-0" />
              <span>info@Al_Aminn_computer.com</span>
            </a>
            <div className="flex items-start gap-3 text-muted text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-blue flex-shrink-0" />
              <span>Addis Ababa, Ethiopia<br />Bole Sub-City</span>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-lg bg-[rgba(26,107,255,0.07)] border border-[rgba(26,107,255,0.15)]">
            <p className="text-xs text-muted">
              <span className="text-cyan font-semibold">Business Hours</span><br />
              Mon–Sat: 8:00 AM – 7:00 PM<br />
              Sunday: 10:00 AM – 5:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(26,107,255,0.1)] bg-[rgba(4,8,15,0.5)]">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-2 text-xs">
            © {year} Alamin Computer. All rights reserved. | Addis Ababa, Ethiopia
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-2 flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#635BFF] rounded text-white text-[9px] flex items-center justify-center font-bold">S</span>
              Stripe Secured
            </span>
            <span className="text-muted-2 text-xs">🔒 SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
