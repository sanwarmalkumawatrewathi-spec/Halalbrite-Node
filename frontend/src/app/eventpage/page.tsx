"use client";

import { useState } from "react";
import CategoryTabs from "@/Components/CategoryTabs";
import FeaturedEvents from "@/Components/FeaturedEvents";

export default function Eventpage({ 
  selectedCity, 
  activeCategory, 
  setActiveCategory 
}: { 
  selectedCity?: string | null, 
  activeCategory: string, 
  setActiveCategory: (cat: string) => void 
}) {

  return (
    <div>
      {/* Pass BOTH props */}
      <CategoryTabs
        active={activeCategory}
        setActive={setActiveCategory}
      />

      <FeaturedEvents activeCategory={activeCategory} selectedCity={selectedCity} />
    </div>
  );
}