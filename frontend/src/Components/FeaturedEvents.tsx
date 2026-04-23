"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "./EventCard";

type Props = {
  activeCategory: string;
  selectedCity?: string | null;
};

export default function FeaturedEvents({ activeCategory, selectedCity }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/events`);
        const result = await response.json();
        const eventData = Array.isArray(result) ? result : result.data || [];
        setEvents(eventData);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // ✅ FILTER LOGIC
  const filteredEvents = events.filter((event) => {
    const categoryMatch = activeCategory === "All" ||
      event.category?.name?.toLowerCase() === activeCategory?.toLowerCase();

    const cityMatch = !selectedCity ||
      event.location?.city?.toLowerCase() === selectedCity?.toLowerCase();

    return categoryMatch && cityMatch;
  });

  if (loading) return <div className="p-6 text-center">Loading events...</div>;

  return (
    <section className="p-6 rounded-xl max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-red-900 font-bold text-lg mb-2.5">
            Featured Events
          </h2>
          <p className="text-gray-600 text-[15px] mb-3">
            {selectedCity ? `Discover upcoming events in ${selectedCity}` : 'Discover upcoming events in your community'}
          </p>
        </div>

        <button className="text-red-600 text-xl">↗</button>
      </div>

      {/* Cards */}
      <div className="flex gap-5 overflow-x-auto">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, i) => (
            <EventCard
              key={i}
              id={event._id}
              title={event.title}
              organizer={event.organizerName || event.organizer?.username || "Organizer"}
              date={`${formatDate(event.startDate)} ${event.startTime || ""}`}
              location={`${event.location?.city || ""}, ${event.location?.country || "UK"}`}
              price={event.price}
              image={event.banner?.startsWith('http') ? event.banner : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")}${event.banner}`}
              category={event.category?.name || "Event"}
            />
          ))
        ) : (
          <p className="text-gray-500">No events found</p>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-6 mb-4">
        <Link href={"/events"}>
          <button className="bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-red-700 transition">
            View All Events
          </button>
        </Link>
      </div>
    </section>
  );
}