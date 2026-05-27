import Link from "next/link";

const categories = [
  { slug: "business", icon: "💼", label: "Business", sub: "HP EliteBook, Dell, ThinkPad", color: "from-blue-3/30 to-blue/10" },
  { slug: "gaming", icon: "🎮", label: "Gaming", sub: "ASUS ROG, MSI, Acer Nitro", color: "from-purple-900/30 to-blue-3/10" },
  { slug: "student", icon: "🎓", label: "Student", sub: "Affordable & Lightweight", color: "from-green/10 to-cyan/5" },
  { slug: "ultrabook", icon: "✨", label: "Ultrabooks", sub: "Thin, Light, Premium", color: "from-cyan/10 to-blue/5" },
  { slug: "workstation", icon: "🖥️", label: "Workstation", sub: "High-End Professionals", color: "from-orange/10 to-blue-3/10" },
  { slug: "wholesale", icon: "📦", label: "Wholesale", sub: "Bulk Orders, Best Prices", color: "from-blue/20 to-blue-3/10" },
  { slug: "desktop", icon: "🖥️", label: "Desktop", sub: "All-in-One, Gaming PCs", color: "from-blue/20 to-cyan/10" },
  { slug: "printer", icon: "🖨️", label: "Printer", sub: "Inkjet, Laser, Multifunction", color: "from-green/10 to-blue/10" },
  { slug: "accessories", icon: "🎧", label: "Accessories", sub: "Mouse, Keyboard, Bags", color: "from-purple-900/30 to-blue/10" },
  { slug: "preorder", icon: "⏳", label: "Pre-Order", sub: "Reserve Before Arrival", color: "from-orange-500/20 to-blue/10", href: "/preorder" },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 px-4 max-w-[1280px] mx-auto">
      <div className="mb-10">
        <p className="text-cyan text-xs font-semibold tracking-[0.18em] uppercase flex items-center gap-3 mb-3">
          <span className="w-7 h-0.5 bg-cyan inline-block" /> Browse by Category
        </p>
        <h2 className="font-head text-4xl font-bold text-white">
          Find Your <span className="text-cyan">Perfect</span> Laptop
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.href || `/shop?category=${cat.slug}`}
            className={`group relative bg-gradient-to-br ${cat.color} border border-[rgba(26,107,255,0.15)] rounded-xl p-5 hover:border-[rgba(26,107,255,0.5)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,107,255,0.15)]`}
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </div>
            <p className="font-head font-bold text-white text-sm tracking-wide">{cat.label}</p>
            <p className="text-muted-2 text-[10px] mt-1 leading-snug">{cat.sub}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
