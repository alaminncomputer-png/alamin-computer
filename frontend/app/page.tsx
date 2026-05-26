import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TickerBanner from "@/components/home/TickerBanner";
import FeaturedSection from "@/components/home/FeaturedSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import StatsSection from "@/components/home/StatsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Alamin Computer — Trusted Laptop Store | Wholesale & Retail Ethiopia",
  description:
    "Buy quality laptops in Addis Ababa Ethiopia. HP EliteBook, Dell Latitude, Lenovo ThinkPad for wholesale & retail. Best prices, warranty included.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TickerBanner />
      <CategoryGrid />
      <FeaturedSection />
      <StatsSection />
      <WhyUsSection />
      <ReviewsSection />
      <NewsletterSection />
    </>
  );
}
