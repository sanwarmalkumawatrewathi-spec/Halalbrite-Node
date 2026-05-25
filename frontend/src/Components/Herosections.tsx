"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoSearch } from "react-icons/io5";
import { TbCalendarEvent } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { IoChevronDownOutline, IoChevronForwardOutline } from "react-icons/io5";
import { LocationIcon } from './Icons';

export default function Herosections({
  onLocationSelect,
  selectedCities = []
}: {
  onLocationSelect?: (cities: string[]) => void,
  selectedCities?: string[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/api/events/locations`);
        const result = await res.json();
        // Handle both direct array response and { data: [...] } structure
        const data = Array.isArray(result) ? result : (result.data || []);
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setLocations([]);
      }
    };
    fetchLocations();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleCity = (cityName: string) => {
    const newSelected = selectedCities.includes(cityName)
      ? selectedCities.filter(c => c !== cityName)
      : [...selectedCities, cityName];

    if (onLocationSelect) {
      onLocationSelect(newSelected);
    } else {
      // Fallback if no handler provided (usually won't happen in the main app)
      const query = newSelected.join(',');
      router.push(`/events?city=${encodeURIComponent(query)}`);
    }
  };

  const toggleCountry = (country: string) => {
    setExpandedCountry(expandedCountry === country ? null : country);
  };

  const safeLocations = Array.isArray(locations) ? locations : [];

  const filteredLocations = safeLocations.map(countryData => ({
    ...countryData,
    cities: (countryData.cities || []).filter((city: any) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      countryData.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(countryData => countryData.cities.length > 0);

  const buttonLabel = selectedCities.length > 0
    ? (selectedCities.length <= 2
      ? selectedCities.join(', ')
      : `${selectedCities.slice(0, 2).join(', ')} +${selectedCities.length - 2}`)
    : "find events in..";

  return (
    <section className="relative z-[100]">
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative' style={{
        backgroundImage: "url('/images/heroimage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="mb-6 text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
            Discover. Host. Connect.
          </h1>

          <p className="text-white max-w-2xl mx-auto text-[22px] font-bold mx-[48px] mt-[0px] mb-[32px]hadow-md">
            Your hub for events that respect your values  and build <br className="hidden sm:block" /> community.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8 w-full sm:w-auto">
            <button
              onClick={() => router.push('/events')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-10 rounded-md px-6 has-[>svg]:px-4 border-2 border-red-600 text-red-700 hover:bg-red-50 bg-white sm:w-auto"
            >
              <IoSearch size={20} className="group-hover:scale-110 transition-transform" />
              Find Events
            </button>

            <button
              onClick={() => router.push('/post-an-event')}
              className="inline-flex text-white cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 has-[>svg]:px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 sm:w-auto"
            >
              <TbCalendarEvent size={20} className="group-hover:scale-110 transition-transform" />
              Post an Event
            </button>
          </div>

          {/* Location Dropdown */}
          <div className='mt-8 relative z-[100] flex justify-center items-center'>
            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className={`min-h-[32px] border border-gray-300 rounded-md bg-white cursor-pointer flex flex-wrap gap-1 items-center px-3 py-1.5 mt-2 opacity-90 w-full max-w-96 ${isOpen ? 'border-red-500 ring-4 ring-red-500/10' : 'border-transparent hover:bg-white'} group`}
              >
                <LocationIcon size={22} className={`${selectedCities.length > 0 ? 'text-red-500' : 'text-gray-400'} group-hover:scale-110 transition-all`} />
                <span className="flex-1 text-left truncate">
                  {selectedCities.length > 0 ? (
                    <span className="text-red-600 font-extrabold">{buttonLabel}</span>
                  ) : (
                    <span className="text-gray-500">Find events in..</span>
                  )}
                </span>
                <IoChevronDownOutline className={`text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-red-500' : ''}`} size={18} />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute top-full w-[300px] left-0 right-0 mt-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">

                  {/* Search Inside Dropdown */}
                  <div className="p-5 bg-gray-50/50 border-b border-gray-100">
                    <div className="relative group">
                      <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="Search city or country..."
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 text-gray-800 rounded-2xl text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/5 outline-none transition-all placeholder:text-gray-400 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Countries & Cities List */}
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((countryData, idx) => (
                        <div key={idx} className="border-b border-gray-50 last:border-0">
                          {/* Country Header */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCountry(countryData.country);
                            }}
                            className={`w-full px-5 py-4 flex items-center justify-between transition-all ${expandedCountry === countryData.country ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1 rounded-lg transition-colors ${expandedCountry === countryData.country ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                <IoChevronForwardOutline className={`transition-transform duration-300 ${expandedCountry === countryData.country ? 'rotate-90' : ''}`} size={14} />
                              </div>
                              <span className={`text-sm font-bold tracking-wide uppercase ${expandedCountry === countryData.country ? 'text-red-700' : 'text-gray-600'}`}>
                                {countryData.country}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-gray-400 shadow-sm">
                                {countryData.cities.length} CITIES
                              </span>
                            </div>
                          </button>

                          {/* Cities Content */}
                          {expandedCountry === countryData.country && (
                            <div className="pb-2 bg-gray-50/20 border-t border-gray-100/50 animate-in fade-in duration-200">
                              {countryData.cities.map((city: any, cIdx: number) => {
                                const isSelected = selectedCities.includes(city.name);
                                return (
                                  <div
                                    key={cIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleCity(city.name);
                                    }}
                                    className={`w-full px-12 py-3.5 text-left text-sm cursor-pointer flex items-center justify-between transition-all group ${isSelected ? 'bg-red-50/60' : 'hover:bg-gray-50/50'}`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${isSelected ? 'bg-red-500 border-red-500 shadow-lg shadow-red-500/30' : 'border-gray-200 group-hover:border-red-300 bg-white'}`}>
                                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                                      </div>
                                      <div className="flex flex-col gap-0.5">
                                        <span className={`font-bold text-sm ${isSelected ? 'text-red-700' : 'text-gray-700 group-hover:text-red-600'}`}>
                                          {city.name}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-400">
                                          Discover events in this city
                                        </span>
                                      </div>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${isSelected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400 group-hover:bg-red-100 group-hover:text-red-600'}`}>
                                      <span className="text-[10px] font-black">{city.count}</span>
                                      <span className="text-[8px] font-bold uppercase tracking-tighter">Events</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-20 px-10 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <IoSearch size={32} />
                        </div>
                        <p className="text-gray-500 font-bold">No locations matching your search</p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-red-600 text-xs font-bold hover:underline"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Selection Footer */}
                  {selectedCities.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-gray-700 uppercase tracking-tight">
                          {selectedCities.length} {selectedCities.length === 1 ? 'City' : 'Cities'} selected
                        </span>
                      </div>
                      <button
                        onClick={() => onLocationSelect?.([])}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-black hover:bg-red-200 transition-colors uppercase tracking-widest"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
