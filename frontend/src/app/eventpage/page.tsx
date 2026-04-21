"use client";

import { useState } from "react";
import CategoryTabs from "@/Components/CategoryTabs";
import FeaturedEvents from "@/Components/FeaturedEvents";

export default function Eventpage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div>
      {/* Pass BOTH props */}
      <CategoryTabs
        active={activeCategory}
        setActive={setActiveCategory}
      />

      <FeaturedEvents activeCategory={activeCategory} />
    </div>
  );
}