"use client";
import EventCardGrid from '@/Components/EventCardGrid'
import FeaturedEvents from '@/Components/FeaturedEvents'
import FilterBar from '@/Components/FilterBar'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import dynamic from 'next/dynamic'
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
    upcoming: "true"
  });

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const queryParams = new URLSearchParams(filters as any).toString();
        const response = await fetch(`${baseUrl}/api/events?${queryParams}`);
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
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="bg-[#fef3f6] min-h-screen">
      <Header/>
      <section className='pt-14 pb-7'>
        <MapComponent events={events} />
      </section>

      <FilterBar filters={filters} setFilters={setFilters} />

      <EventCardGrid events={events} loading={loading} />

      <Footer/>
    </div>
  );
}
