export default function StatsSection() {
  const stats = [
    { num: "500+", label: "Laptops Sold", icon: "💻" },
    { num: "300+", label: "Happy Customers", icon: "😊" },
    { num: "50+", label: "Wholesale Clients", icon: "🏢" },
    { num: "4.9/5", label: "Average Rating", icon: "⭐" },
  ];
  return (
    <section className="py-16 px-4 bg-[rgba(8,15,28,0.5)] border-y border-[rgba(26,107,255,0.1)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-head text-4xl font-bold text-white mb-1">{s.num}</div>
            <div className="text-muted text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
