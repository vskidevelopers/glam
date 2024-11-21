import CategoriesSection from "@/sections/CategoriesSection";
import Features from "@/sections/Features";
import HomeSlidersSection from "@/sections/HomeSliderSection";
import Introbanner from "@/sections/Introbanner";
import MonthlyOfferSection from "@/sections/MonthlyOfferSection";
import PromotionalSection from "@/sections/PromotionalSection";
import React from "react";

function Home() {
  return (
    <div>
      <Introbanner />
      <CategoriesSection />
      <HomeSlidersSection title="Top Trending" />
      <PromotionalSection />
      <MonthlyOfferSection />
      <Features />
    </div>
  );
}

export default Home;
