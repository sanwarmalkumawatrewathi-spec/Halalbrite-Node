"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, Calendar, Filter, X } from "lucide-react";

export default function FilterBar({ filters, setFilters }: { filters: any, setFilters: any }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: any) => ({ ...prev, search: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      city: "",
      upcoming: "true",
      startDate: "",
      endDate: "",
      minPrice: "",
      maxPrice: ""
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.city || filters.startDate || filters.endDate || filters.minPrice || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mb-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-white">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search events by name, organiser or venue..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white focus:border-red-500 transition-all text-sm font-medium"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap w-full md:w-auto ${
                open 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
              }`}
            >
              <SlidersHorizontal size={18} />
              {open ? 'Close Filters' : 'More Filters'}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                title="Clear all filters"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Extended Filter Panel */}
        {open && (
          <div className="px-6 pb-6 pt-2 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">
            
            {/* CATEGORY DROPDOWN */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Filter size={12} /> Category
              </label>
              <select
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer"
                value={filters.category}
                onChange={(e) => setFilters((prev: any) => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* LOCATION INPUT */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin size={12} /> City / Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g. London, Manchester"
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={filters.city}
                  onChange={(e) => setFilters((prev: any) => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>

            {/* DATE RANGE */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Calendar size={12} /> Starting After
              </label>
              <input
                type="date"
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none"
                value={filters.startDate}
                onChange={(e) => setFilters((prev: any) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            {/* PRICE RANGE */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <SlidersHorizontal size={12} /> Max Price
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder="No limit"
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev: any) => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>

          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
           <div className="px-6 py-3 bg-gray-50 flex items-center gap-3 overflow-x-auto border-t border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Active Filters:</span>
              {filters.search && <FilterBadge label={`"${filters.search}"`} onClear={() => setFilters((p:any)=>({...p, search:''}))} />}
              {filters.category && <FilterBadge label="Category Active" onClear={() => setFilters((p:any)=>({...p, category:''}))} />}
              {filters.city && <FilterBadge label={filters.city} onClear={() => setFilters((p:any)=>({...p, city:''}))} />}
              {filters.maxPrice && <FilterBadge label={`Max $${filters.maxPrice}`} onClear={() => setFilters((p:any)=>({...p, maxPrice:''}))} />}
              {filters.startDate && <FilterBadge label="Date Filter" onClear={() => setFilters((p:any)=>({...p, startDate:''}))} />}
           </div>
        )}
      </div>
    </div>
  );
}

function FilterBadge({ label, onClear }: { label: string, onClear: () => void }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold text-gray-600 shadow-sm animate-in zoom-in-50 duration-200">
      {label}
      <button onClick={onClear} className="hover:text-red-500 transition-colors">
        <X size={10} />
      </button>
    </div>
  );
}
