"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

type SavedEvent = {
  _id: string;
  title: string;
  startDate: string;
  location: {
    venueName: string;
    city: string;
  };
  banner: string;
  priceLabel: string;
};

export default function SavedEvents() {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const fetchSavedEvents = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/events/saved-events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setSavedEvents(data);
      } else {
        console.error("Failed to fetch saved events:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch saved events:", error);
    } finally {
      setLoading(false);
    }
  };

  const unsaveEvent = async (id: string) => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/events/${id}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSavedEvents(prev => prev.filter(ev => ev._id !== id));
      }
    } catch (error) {
      console.error("Failed to unsave event:", error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading saved events...</div>;

  return (
    <div className="p-0 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Saved Events</h1>
        <p className="text-sm text-gray-500">
          Events you're interested in
        </p>
      </div>

      {/* Content Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 min-h-[300px]">
        {savedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <FaCalendarAlt size={32} />
            </div>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              No saved events yet. Start exploring events and save your favorites!
            </p>
            <Link href="/events" className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition">
                Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {savedEvents.map((event) => (
              <div key={event._id} className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                {/* Banner */}
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={event.banner.startsWith('http') ? event.banner : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}${event.banner}`} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <button 
                        onClick={() => unsaveEvent(event._id)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
                        title="Remove from saved"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase mb-2">
                    <FaCalendarAlt />
                    <span>{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                    <FaMapMarkerAlt />
                    <span className="line-clamp-1">{event.location.venueName || event.location.city}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="font-bold text-gray-900 text-sm">{event.priceLabel}</span>
                    <Link href={`/eventpage/${event._id}`} className="text-red-600 text-xs font-bold hover:underline">
                        Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}