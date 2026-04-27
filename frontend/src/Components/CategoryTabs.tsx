"use client";
import { useEffect, useState } from "react";

type Props = {
  active: string;
  setActive: (value: string) => void;
};

export default function CategoryTabs({ active, setActive }: Props) {
  const [categories, setCategories] = useState<string[]>(["All"]);

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

  return (
    <div className="max-w-7xl mx-auto overflow-x-auto py-3">
      <div className="flex gap-3 px-4 whitespace-nowrap">
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "border border-gray-300 hover:border-red-600"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}