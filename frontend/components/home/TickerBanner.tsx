"use client";

export default function TickerBanner() {
  const items = [
    "HP EliteBook Core i7", "Dell Latitude i5", "Lenovo ThinkPad X1",
    "ASUS ROG Gaming", "MacBook Pro", "Acer Student Laptops",
    "Wholesale Prices Available", "6 Month Warranty", "Fast Delivery Addis Ababa",
    "HP EliteBook Core i7", "Dell Latitude i5", "Lenovo ThinkPad X1",
    "ASUS ROG Gaming", "MacBook Pro", "Acer Student Laptops",
    "Wholesale Prices Available", "6 Month Warranty", "Fast Delivery Addis Ababa",
  ];

  return (
    <div className="bg-[rgba(26,107,255,0.06)] border-y border-[rgba(26,107,255,0.12)] py-3 overflow-hidden">
      <div className="flex gap-12 ticker-animate" style={{ width: "max-content" }}>
        {items.map((item, i) => (
          <span
            key={i}
            className="font-head text-[13px] font-semibold text-cyan tracking-wide uppercase whitespace-nowrap flex items-center gap-3"
          >
            <span className="text-blue text-[8px]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
