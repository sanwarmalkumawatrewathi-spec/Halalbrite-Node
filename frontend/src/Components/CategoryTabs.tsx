"use client";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  active: string;
  setActive: (value: string) => void;
};

export default function CategoryTabs({ active, setActive }: Props) {
  const [categories, setCategories] = useState<string[]>(["All"]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Function to check if scrolling is possible in either direction
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/categories`);
        const result = await response.json();
        const categoryData = Array.isArray(result) ? result : result.data || [];
        const names = categoryData.map((cat: any) => cat.name);
        setCategories(["All", ...names]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Update arrows state when categories load or window resizes
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust scroll distance
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 relative group px-2">
      {/* Left Arrow Button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 p-1 rounded-md shadow-md hover:bg-gray-50 transition-all flex items-center justify-center text-gray-700 hover:text-red-500"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Categories Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="flex gap-3 px-4 whitespace-nowrap overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`inline-flex items-center justify-center border font-medium w-fit shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground cursor-pointer px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-500
                ${isActive
                  ? "bg-red-500 text-white"
                  : "border border-gray-300 hover:border-red-600 hover:text-red-600"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Right Arrow Button */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 p-1 rounded-md shadow-md hover:bg-gray-50 transition-all flex items-center justify-center text-gray-700 hover:text-red-500"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
