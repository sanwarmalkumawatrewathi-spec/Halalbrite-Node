"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Calendar, Filter } from "lucide-react";

export default function FilterBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md max-w-7xl mx-auto">
      
      {/* TOP SEARCH + BUTTON */}
      <div className="flex items-center gap-3 p-3.5">
        <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search events by name or organiser..."
            className="outline-none w-full text-sm "
          />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* FILTER PANEL */}
      {open && (
        <div className="mt-4 border-t border-gray-300 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* CATEGORY */}
          <div>
            <p className="text-sm mb-2">Category</p>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <Filter size={14} className="mr-2 text-gray-400" />
              <input
                placeholder="Select categories"
                className="outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <p className="text-sm mb-2">Location</p>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <MapPin size={14} className="mr-2 text-gray-400" />
              <input
                placeholder="Select cities"
                className="outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* DATE */}
          <div>
            <p className="text-sm mb-2">Date Range</p>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <Calendar size={14} className="mr-2 text-gray-400" />
              <input
                placeholder="Select date range"
                className="outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* PRICE */}
          <div>
            <p className="text-sm mb-2">Price Range</p>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <SlidersHorizontal size={14} className="mr-2 text-gray-400" />
              <input
                placeholder="Select price range"
                className="outline-none w-full text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}