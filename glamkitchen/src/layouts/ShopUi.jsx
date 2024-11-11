import Categories from "@/components/Categories";
import HeroSection from "@/sections/HeroSection";
import ShopGrid from "@/sections/ShopGrid";
import React from "react";

function ShopUi() {
  return (
    <div>
      <HeroSection
        tagline="Shop Now and Glam Your Kitchen!"
        title="Shop"
        image="https://www.kitchen-outfitters.com/cdn/shop/files/KitchenOutfittersActon-SpecialtyKitchenware_1200x1200.jpg?v=1637341247"
      />

      <div className="w-full flex flex-col-reverse md:flex-row px-10">
        <div className="w-full md:w-1/3">
          <h2 className="font-bold text-3xl">Categories</h2>
          <Categories />
        </div>
        <div className="w-full md:w-2/3 ml-0 md:ml-3">
          <ShopGrid />
        </div>
      </div>
    </div>
  );
}

export default ShopUi;
