"use client";
import EventCardGrid from '@/Components/EventCardGrid'
import FeaturedEvents from '@/Components/FeaturedEvents'
import FilterBar from '@/Components/FilterBar'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import dynamic from 'next/dynamic'
import Herosections from '@/Components/Herosections'
import { ChevronDown, ChevronUp } from "lucide-react";
const MapComponent = dynamic(() => import('@/Components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl" />
});
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react'

function EventContent() {
  const [expanded, setExpanded] = useState(false);

  const searchParams = useSearchParams();
  const urlEventId = searchParams.get('eventId');

  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(urlEventId);
  const [filters, setFilters] = React.useState({
    search: "",
    category: "",
    city: "",
    upcoming: "",
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: ""
  });

  // Effect to handle URL-based selection
  useEffect(() => {
    if (urlEventId) {
      setSelectedEventId(urlEventId);
    }
  }, [urlEventId]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
        );
        const queryParams = new URLSearchParams(activeFilters as any).toString();
        const url = queryParams ? `${baseUrl}/api/events?${queryParams}` : `${baseUrl}/api/events`;
        const response = await fetch(url);
        const data = await response.json();
        const eventData = Array.isArray(data) ? data : data.data || [];
        setEvents(eventData);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(v => v !== "");
    if (hasActiveFilters && !urlEventId) {
      setSelectedEventId(null);
    }
  }, [filters, urlEventId]);

  const displayedEvents = selectedEventId
    ? events.filter((e: any) => e._id === selectedEventId)
    : events;

  return (
    <div className="bg-[#fef3f6] ">
      <Header />

      <section className="pt-0  pb-0 sm:pb-7 px-[40px] sm:px-5">
        <div className="max-w-7xl mx-auto mb-9 pt-6 sm:px-5 px-0">
          <div
            className={`relative rounded-sm overflow-hidden transition-all duration-500 ${expanded ? "h-[500px]" : "h-[200px]"
              }`}
          >
            <div className="absolute inset-0 z-0  ">
              <MapComponent
                events={events}
                onMarkerClick={(id) => setSelectedEventId(id)}
                selectedEventId={selectedEventId}
              />
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-red-700 transition"
            >
              {expanded ? "Collapse Map" : "Expand Map"}
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </section>

      <FilterBar filters={filters} setFilters={setFilters} />

      {selectedEventId && (
        <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-red-50">
          <div className="text-gray-700 font-medium italic">
            Showing selected event from map
          </div>
          <button
            onClick={() => setSelectedEventId(null)}
            className="text-red-600 font-bold hover:underline"
          >
            Show All Events
          </button>
        </div>
      )}

      <EventCardGrid events={displayedEvents} loading={loading} />

      <Footer />
    </div>
  );
}

export default function Event() {
  return (
    <Suspense fallback={null}>
      <EventContent />
    </Suspense>
  );
}
