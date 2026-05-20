"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryTabs from '@/Components/CategoryTabs'
import FeaturedEvents from '@/Components/FeaturedEvents'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import Herosections from '@/Components/Herosections'
import dynamic from 'next/dynamic'
const MapComponent = dynamic(() => import('@/Components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center mb-20 max-w-7xl mx-auto shadow-sm">
      <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-red-600 text-sm font-semibold tracking-wide animate-pulse">Loading Maps...</p>
    </div>
  )
});
import React from 'react'

export default function Page() {
  const [events, setEvents] = useState([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const query = selectedCities.length > 0 ? `?city=${encodeURIComponent(selectedCities.join(','))}` : '';
        const response = await fetch(`${baseUrl}/api/events${query}`);
        const data = await response.json();
        const eventData = Array.isArray(data) ? data : data.data || [];
        setEvents(eventData);
      } catch (error) {
        console.error("Failed to fetch events for map:", error);
      }
    };
    fetchEvents();
  }, [selectedCities]);

  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Filter events for map based on active category
  const mapEvents = events.filter((event: any) => {
    return activeCategory === "All" ||
      event.category?.name?.toLowerCase() === activeCategory?.toLowerCase();
  });

  return (
    <div className="bg-[#fef3f6]">
      <Header />
      <Herosections 
        selectedCities={selectedCities}
        onLocationSelect={(cities) => setSelectedCities(cities)} 
      />

      <div className="max-w-7xl mx-auto pt-3">
        <CategoryTabs active={activeCategory} setActive={setActiveCategory} />
        
        {selectedEventId && (
          <div className="max-w-7xl mx-auto px-6 mb-6 mt-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-red-50">
            <div className="text-gray-700 font-medium italic text-sm">
              Showing selected event from map
            </div>
            <button
              onClick={() => setSelectedEventId(null)}
              className="text-red-600 font-bold hover:underline text-sm"
            >
              Show All Events
            </button>
          </div>
        )}

        <FeaturedEvents
          activeCategory={activeCategory}
          selectedCities={selectedCities}
          selectedEventId={selectedEventId}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-2">
        <MapComponent 
          events={mapEvents} 
          onMarkerClick={(id) => setSelectedEventId(id)}
          selectedEventId={selectedEventId}
        />
      </div>

      <Footer />
    </div>
  )
}
