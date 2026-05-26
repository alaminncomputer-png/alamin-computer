import { Star } from "lucide-react";

const reviews = [
  { name: "Abebe Tadesse", role: "Business Owner", rating: 5, comment: "Bought 10 HP EliteBooks for my office. Excellent quality, fast delivery, and great after-sale support. Will order again!", location: "Addis Ababa" },
  { name: "Selam Haile", role: "University Student", rating: 5, comment: "Got an Acer laptop for my studies. Perfect condition, great price. The warranty gave me peace of mind.", location: "Addis Ababa" },
  { name: "Dawit Bekele", role: "Software Developer", rating: 5, comment: "ThinkPad X1 Carbon in perfect condition. Excellent battery, fast SSD. Alamin Computer is my go-to for laptops.", location: "Addis Ababa" },
  { name: "Mekdes Girma", role: "Entrepreneur", rating: 5, comment: "Ordered via WhatsApp, delivered the same day! The Dell Latitude is working perfectly. Highly recommend.", location: "Addis Ababa" },
  { name: "Yonas Tesfaye", role: "IT Manager", rating: 4, comment: "Great selection of business laptops. Competitive wholesale pricing. The team is very responsive and professional.", location: "Addis Ababa" },
  { name: "Tigist Alemu", role: "Graphic Designer", rating: 5, comment: "Bought a gaming laptop for design work. Excellent performance. The 3-month warranty gives great confidence.", location: "Addis Ababa" },
];

export default function ReviewsSection() {
  return (
    <section className="py-20 px-4 bg-[rgba(8,15,28,0.4)] border-y border-[rgba(26,107,255,0.1)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-cyan text-xs font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-3 mb-3">
            <span className="w-7 h-0.5 bg-cyan inline-block" /> Testimonials <span className="w-7 h-0.5 bg-cyan inline-block" />
          </p>
          <h2 className="font-head text-4xl font-bold text-white mb-3">
            What Our <span className="text-cyan">Customers</span> Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-orange fill-orange" />)}
            <span className="text-white font-bold ml-2">4.9</span>
            <span className="text-muted text-sm">/ 5 (300+ reviews)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="card rounded-xl p-6 hover:border-[rgba(26,107,255,0.4)] transition-colors">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-orange fill-orange" : "text-muted-2"}`} />
                ))}
              </div>
              <p className="text-text text-sm leading-relaxed mb-5 italic">&ldquo;{r.comment}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[rgba(26,107,255,0.1)]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-3 to-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  <p className="text-muted-2 text-xs">{r.role} · {r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
