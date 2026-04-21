

"use client";

type Props = {
  active: string;
  setActive: (value: string) => void;
};

const categories = ["All", "Conference", "Workshop", "Community"];

export default function CategoryTabs({ active, setActive }: Props) {
  return (
    <div className="max-w-7xl mx-auto overflow-x-auto py-3">
      <div className="flex gap-3 px-4 whitespace-nowrap">
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <button
              key={category}
              onClick={() => setActive(category)}   // ✅ important
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