"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoSearch } from "react-icons/io5";
import { TbCalendarEvent } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { HiLocationMarker } from "react-icons/hi";
import { IoChevronDownOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function Herosections({ onLocationSelect }: { onLocationSelect?: (city: string) => void }) {
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
        const data = await res.json();
        setLocations(Array.isArray(data) ? data : []);
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

  const handleCitySelect = (cityName: string) => {
    setIsOpen(false);
    if (onLocationSelect) {
      onLocationSelect(cityName);
    } else {
      router.push(`/events?city=${encodeURIComponent(cityName)}`);
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

  return (
    <section
      className="relative max-w-7xl mx-auto h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-visible"
      style={{
        backgroundImage: "url('/heroimage.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative text-center text-white px-4 max-w-4xl z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Discover. Host. Connect.
        </h1>

        <p className="text-lg md:text-2xl mb-10 text-gray-100 font-medium leading-relaxed">
          Your hub for events that respect your values and build <br className="hidden md:block" /> thriving communities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
          <button 
            onClick={() => router.push('/events')}
            className="flex items-center justify-center gap-3 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-1"
          >
            <IoSearch size={22} /> Find Events
          </button>

          <button 
             onClick={() => router.push('/post-an-event')}
             className="flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:-translate-y-1"
          >
            <TbCalendarEvent size={22} /> Post an Event
          </button>
        </div>

        {/* Location Dropdown */}
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-6 py-3.5 rounded-full shadow-2xl text-gray-700 text-sm font-bold hover:bg-white transition-all border-2 border-transparent focus:border-red-500 group"
          >
            <HiLocationMarker className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
            <span className="min-w-[120px] text-left">find events in..</span>
            <IoChevronDownOutline className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={16} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Search Inside Dropdown */}
              <div className="p-4 bg-gray-50 border-bottom border-gray-100">
                <div className="relative">
                  <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border text-black border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Countries & Cities List */}
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((countryData, idx) => (
                    <div key={idx} className="border-b border-gray-50 last:border-0">
                      {/* Country Header (Togglable) */}
                      <button 
                        onClick={() => toggleCountry(countryData.country)}
                        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${expandedCountry === countryData.country ? 'bg-red-50' : 'bg-gray-50/50 hover:bg-gray-50'}`}
                      >
                         <div className="flex items-center gap-2">
                           <IoChevronForwardOutline className={`text-gray-400 transition-transform duration-300 ${expandedCountry === countryData.country ? 'rotate-90 text-red-500' : ''}`} size={12} />
                           <span className={`text-xs font-bold uppercase tracking-widest ${expandedCountry === countryData.country ? 'text-red-600' : 'text-gray-400'}`}>{countryData.country}</span>
                         </div>
                         <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-400 font-bold">{countryData.cities.length} cities</span>
                      </button>
                      
                      {/* Cities Accordion Content */}
                      <div className={`overflow-hidden transition-all duration-300 ${expandedCountry === countryData.country ? 'max-h-[500px] opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
                        {countryData.cities.map((city: any, cIdx: number) => (
                          <button
                            key={cIdx}
                            onClick={() => handleCitySelect(city.name)}
                            className="w-full px-8 py-2.5 text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-between transition-colors group border-l-2 border-transparent hover:border-red-500"
                          >
                            <span className="font-medium">{city.name}</span>
                            <span className="text-[10px] text-gray-300 group-hover:text-red-400">{city.count} events</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-400 font-medium">No locations found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
