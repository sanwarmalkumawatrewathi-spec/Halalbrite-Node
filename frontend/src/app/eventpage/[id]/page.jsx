"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import TicketSelection from "@/Components/TicketSelection";
import MapComponent from "@/Components/MapComponent";
import Link from "next/link";
import { MapPin, Share2, Heart, Calendar, Clock, Users } from "lucide-react";

export default function EventDetails() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/events/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fef3f6]">
      <Header />
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-red-900 font-semibold animate-pulse text-lg">Loading Event Details...</div>
      </div>
      <Footer />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#fef3f6]">
      <Header />
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <p className="text-gray-600 text-xl">Event not found</p>
        <Link href="/" className="text-red-600 hover:underline">← Back to Events</Link>
      </div>
      <Footer />
    </div>
  );

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const bannerImage = event.banner?.startsWith('http') ? event.banner : `${baseUrl}${event.banner}`;

  return (
    <div className="bg-[#fef3f6] min-h-screen">
      <Header />
      
      <section>
        {/* Back */}
        <div className="max-w-7xl mx-auto p-4">
          <Link href="/" className="text-gray-600 text-sm hover:text-red-600 transition flex items-center gap-1">
            ← Back to Events
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[350px] md:h-[500px]">
          <img
            src={bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 text-white">
            <span className="bg-red-600 text-white text-xs px-4 py-1.5 rounded-full font-bold tracking-wide">
              {event.category?.name || "Event"}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mt-4 max-w-3xl leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 mt-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-red-400" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-red-400" />
                <span>{event.startTime || "TBA"} - {event.endTime || "End"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-red-400" />
                <span>{event.attendees?.length || 0} attending</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organiser Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl border border-red-50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg uppercase">
              {event.organizerName?.substring(0, 2) || event.organizer?.username?.substring(0, 2) || "OR"}
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Organised by</p>
              <h3 className="font-bold text-xl text-gray-900 mt-0.5">
                {event.organizerName || event.organizer?.username || "Organizer"}
              </h3>
              <p className="text-sm text-gray-500">Official Community Partner</p>
            </div>
          </div>
          <button className="mt-4 md:mt-0 bg-white border-2 border-red-600 text-red-600 px-8 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300">
            Follow
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-red-50 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                Event Overview
              </h2>

              <div className="prose prose-red max-w-none text-gray-700 leading-relaxed space-y-4">
                {event.description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* TICKETS SECTION */}
            <div id="tickets">
              <TicketSelection tickets={event.ticketTypes} />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* LOCATION CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-red-50 p-6">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-red-600" />
                Location
              </h3>

              <div className="space-y-2 mb-6">
                <p className="font-bold text-gray-800 text-lg">
                  {event.location?.venueName || "Venue Name"}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {event.location?.address}<br />
                  {event.location?.city}, {event.location?.postcode}<br />
                  {event.location?.country || "United Kingdom"}
                </p>
              </div>

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location?.venueName} ${event.location?.address} ${event.location?.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-bold bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl px-4 py-4 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 w-full justify-center"
              >
                View in Google Maps
              </a>
            </div>

            {/* ACTION BUTTONS */}
            <div className="bg-white rounded-3xl shadow-sm border border-red-50 p-6 space-y-4">
              <button className="flex items-center justify-center gap-3 font-bold text-gray-700 border border-gray-200 rounded-2xl px-4 py-4 w-full hover:bg-gray-50 transition-all">
                <Share2 size={20} className="text-red-600" />
                Share Event
              </button>

              <button className="flex items-center justify-center gap-3 font-bold text-gray-700 border border-gray-200 rounded-2xl px-4 py-4 w-full hover:bg-gray-50 transition-all">
                <Heart size={20} className="text-red-600" />
                Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-3xl shadow-sm border border-red-50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin size={24} className="text-red-600" />
            Event Map
          </h2>
          <div className="rounded-2xl overflow-hidden border border-gray-100">
            <MapComponent center={event.location?.geometry?.coordinates} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}