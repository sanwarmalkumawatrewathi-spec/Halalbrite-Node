"use client";

import { useEffect, useState } from 'react';
import Eventpage from '@/app/eventpage/page'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import Herosections from '@/Components/Herosections'
import dynamic from 'next/dynamic'
const MapComponent = dynamic(() => import('@/Components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl" />
});
import React from 'react'

export default function Page() {
  const [events, setEvents] = useState([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const query = selectedCity ? `?city=${encodeURIComponent(selectedCity)}` : '';
        const response = await fetch(`${baseUrl}/api/events${query}`);
        const data = await response.json();
        const eventData = Array.isArray(data) ? data : data.data || [];
        setEvents(eventData);
      } catch (error) {
        console.error("Failed to fetch events for map:", error);
      }
    };
    fetchEvents();
  }, [selectedCity]);

  // Filter events for map based on active category
  const mapEvents = events.filter((event: any) => {
    return activeCategory === "All" || 
      event.category?.name?.toLowerCase() === activeCategory?.toLowerCase();
  });

  return (
    <div className="bg-[#fef3f6]">
      <Header />
      <Herosections onLocationSelect={(city) => setSelectedCity(city)} />

      <Eventpage 
        selectedCity={selectedCity} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-red-900 mb-2">
          {selectedCity ? `Event Map: ${selectedCity}` : 'Event Map'}
          {activeCategory !== 'All' && ` - ${activeCategory}`}
        </h2>
        <p className="text-gray-600 mb-6">Explore events happening near you</p>
        <MapComponent events={mapEvents} />
      </div>

      <Footer />
    </div>
  )
}
