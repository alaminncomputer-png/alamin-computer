import { Shield, Truck, Award, HeadphonesIcon, RefreshCw, Package } from "lucide-react";

const features = [
  { icon: Shield, title: "Warranty Included", desc: "3–6 month warranty on all laptops. We stand behind every product we sell." },
  { icon: Truck, title: "Fast Delivery", desc: "Same-day and next-day delivery available in Addis Ababa." },
  { icon: Award, title: "Quality Guaranteed", desc: "Every laptop is tested and verified before sale. No hidden defects." },
  { icon: HeadphonesIcon, title: "Expert Support", desc: "WhatsApp and Telegram support. We help you choose the right laptop." },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy if you're not 100% satisfied with your purchase." },
  { icon: Package, title: "Wholesale Deals", desc: "Special bulk pricing for businesses. Contact us for wholesale quotes." },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 px-4 max-w-[1280px] mx-auto">
      <div className="text-center mb-14">
        <p className="text-cyan text-xs font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-3 mb-3">
          <span className="w-7 h-0.5 bg-cyan inline-block" /> Why Choose Us <span className="w-7 h-0.5 bg-cyan inline-block" />
        </p>
        <h2 className="font-head text-4xl font-bold text-white mb-3">
          The <span className="text-cyan">Alamin</span> Difference
        </h2>
        <p className="text-muted max-w-lg mx-auto text-[15px]">
          We&apos;ve built our reputation on trust, quality, and exceptional customer service.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card rounded-xl p-6 hover:border-[rgba(26,107,255,0.4)] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[rgba(26,107,255,0.1)] border border-[rgba(26,107,255,0.2)] flex items-center justify-center mb-5 group-hover:bg-[rgba(26,107,255,0.2)] transition-colors">
              <Icon className="w-6 h-6 text-blue" />
            </div>
            <h3 className="font-head font-bold text-white text-lg tracking-wide mb-2">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
