"use client";
import EventCardGrid from '@/Components/EventCardGrid'
import FeaturedEvents from '@/Components/FeaturedEvents'
import FilterBar from '@/Components/FilterBar'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import dynamic from 'next/dynamic'
import Herosections from '@/Components/Herosections'
const MapComponent = dynamic(() => import('@/Components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl" />
});
import React from 'react'

export default function Event() {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
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

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        // Only include non-empty filter values in the query string
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

    // Debounce search/filters
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="bg-[#fef3f6] min-h-screen">
      <Header/>
      
      <Herosections onLocationSelect={(city) => setFilters(prev => ({ ...prev, city }))} />

      <section className='pt-14 pb-7 px-6'>
        <MapComponent events={events} />
      </section>

      <FilterBar filters={filters} setFilters={setFilters} />

      <EventCardGrid events={events} loading={loading} />

      <Footer/>
    </div>
  );
}
