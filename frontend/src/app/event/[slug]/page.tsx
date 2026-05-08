"use client";

import dynamic from 'next/dynamic';
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import { useAuth } from "@/context/authContext";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import TicketSelection from "@/Components/TicketSelection";
const MapComponent = dynamic(() => import("@/Components/MapComponent"), { ssr: false });
import Link from "next/link";
import { Share2, Heart, Calendar, Clock, Users } from "lucide-react";
import { LocationIcon } from "@/Components/Icons";
import ShareModal from "@/Components/ShareModal";

export default function EventDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, toggleFollowOrganizer, toggleSavedEvent } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/events/${slug}`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          setEvent(null);
        } else {
          setEvent(data.data || data);
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchEvent();
  }, [slug]);

  const formatDate = (dateStr: string) => {
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
    <div className=" bg-[#fef3f6]">
      <Header />
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-red-900 font-semibold animate-pulse text-lg">Loading Event Details...</div>
      </div>
      <Footer />
    </div>
  );

  if (!event) return (
    <div className=" bg-[#fef3f6]">
      <Header />
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <p className="text-gray-600 text-xl">Event not found</p>
        <Link href="/" className="text-red-600 hover:underline">← Back to Events</Link>
      </div>
      <Footer />
    </div>
  );

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const bannerImage = event.banner ? (event.banner.startsWith('http') ? event.banner : `${baseUrl}${event.banner}`) : "/images/noimage.jpg";

  return (
    <div className="bg-[#fef3f6] ">
      <Header />

      <section>
        {/* Back */}
        <div className="max-w-7xl mx-auto p-4">
          <Link href="/" className="text-gray-600 text-sm hover:text-red-600 transition flex items-center gap-1">
            ← Back to Events
          </Link>
        </div>

        {/* Hero Section */}
        <div
          className="relative w-full h-[350px] md:h-[500px] cursor-pointer group"
          onClick={() => setIsPopupOpen(true)}
        >
          <img
            src={bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "/images/noimage.jpg";
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

          {/* Content */}
          <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 text-white">
            <span className="bg-[#eeeceb] text-red-600 text-xs px-4 py-1 rounded-[8px] font-bold tracking-wide ">
              {event.category?.name || "Event"}
            </span>

            <h1 className="text-3xl md:text-2xl font-400 mt-4 max-w-3xl leading-tight mb-3">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-white-400" />
                <span> {formatDate(event.startDate)} @ {event.startTime || "TBA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-white-400" />
                <span> {formatDate(event.endDate)} @ {event.endTime || "TBA"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organiser Section Card */}
      <section className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border-0">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
                {event.organizer ? (
                  <Link href={`/organiser/${event.organizer.slug || (typeof event.organizer === 'object' ? event.organizer._id : event.organizer)}`} className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0 group">
                    <div className="relative flex-shrink-0">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 border-red-100 shadow-lg bg-white">
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                          <span className="text-red-700 text-base sm:text-lg md:text-xl font-bold">
                            {event.organizerName?.substring(0, 2) || event.organizer?.username?.substring(0, 2) || "OR"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 text-xs sm:text-sm">Organised by</p>
                      <h3 className="text-red-900 text-sm sm:text-base md:text-lg font-semibold truncate group-hover:text-red-600 transition-colors">
                        {event.organizerName || event.organizer?.username || "Organizer"}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">890 followers</p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-100 shadow-lg bg-white">
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-gray-400 text-base sm:text-lg md:text-xl font-bold">OR</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 text-xs sm:text-sm">Organised by</p>
                      <h3 className="text-gray-900 text-sm sm:text-base md:text-lg font-semibold truncate">
                        {event.organizerName || "Organizer"}
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              {event.organizer && (
                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto sm:flex-shrink-0">
                  <button
                    onClick={async () => {
                      if (!user) {
                        router.push('/login-register');
                        return;
                      }
                      const orgId = typeof event.organizer === 'object' ? event.organizer._id : event.organizer;
                      await toggleFollowOrganizer(orgId);
                    }}
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all px-6 py-2 border-2 text-sm sm:text-base h-10 sm:h-12 w-full sm:w-auto ${user?.followedOrganizers?.includes(typeof event.organizer === 'object' ? event.organizer._id : event.organizer)
                      ? "bg-red-600 text-white border-red-600 shadow-md"
                      : "border-red-500 text-red-700 hover:bg-red-50"
                      }`}
                  >
                    {user?.followedOrganizers?.includes(typeof event.organizer === 'object' ? event.organizer._id : event.organizer) ? "Following" : "Follow"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border-0">
              <div className="px-6 pt-6">
                <h2 className="text-xl font-semibold text-red-900 mb-4">Event Overview</h2>
              </div>
              <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                <h3 className="text-red-900 mb-4 text-lg">Overview:</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: event.description }}
                  className="prose prose-red max-w-none"
                />
              </div>
            </div>

            {/* TICKETS SECTION */}
            <div id="tickets" className="px-0 pb-6">
              <TicketSelection tickets={event.ticketTypes} eventId={event._id} />
              <p className="text-center text-gray-500 text-sm mt-4">Secure payment powered by Stripe</p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* LOCATION CARD */}
            <div className="bg-white rounded-2xl shadow-lg border-0">
              <div className="px-6 pt-6 pb-2">
                <h4 className="text-lg font-semibold text-red-900 leading-none">Event Details</h4>
              </div>
              <div className="px-6 pb-6 space-y-6">
                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">Date</p>
                      <p className="text-gray-600">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">Time</p>
                      <p className="text-gray-600">{event.startTime || "TBA"} - {event.endTime || "End"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <LocationIcon size={18} className="text-red-600" />
                    <h4 className="text-gray-900 font-bold">Location</h4>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium mb-1">{event.location?.venueName || "Venue Name"}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {event.location?.address}<br />
                      {event.location?.city}, {event.location?.postcode}<br />
                      {event.location?.country || "United Kingdom"}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location?.venueName} ${event.location?.address} ${event.location?.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all bg-white text-gray-900 hover:bg-gray-50 h-10 px-4 py-2 w-full rounded-xl border-1"
                >
                  <LocationIcon size={16} className="text-red-600" />
                  View in Google Maps
                </a>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="bg-white rounded-2xl shadow-lg border-0 p-4 space-y-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all bg-white text-gray-900 hover:bg-gray-50 h-10 px-4 py-2 w-full rounded-xl border-1"
              >
                <Share2 size={18} className="text-gray-600" />
                Share Event
              </button>

              <button
                onClick={async () => {
                  if (!user) {
                    router.push('/login-register');
                    return;
                  }
                  await toggleSavedEvent(event._id);
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all bg-white text-gray-900 hover:bg-gray-50 h-10 px-4 py-2 w-full rounded-xl border-1"
              >
                <Heart
                  size={18}
                  className={user?.savedEvents?.includes(event._id) ? "text-red-600" : "text-gray-600"}
                  fill={user?.savedEvents?.includes(event._id) ? "currentColor" : "none"}
                />
                {user?.savedEvents?.includes(event._id) ? "Saved Event" : "Save Event"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-lg border-0" id="map-section">
          <div className="px-6 pt-6">
            <h4 className="text-lg font-semibold text-red-900 leading-none">Map</h4>
          </div>
          <div className="px-6 pb-6 mt-4">
            <div className="h-64 rounded-xl overflow-hidden border border-gray-100">
              <MapComponent center={event.location?.geometry?.coordinates} />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        eventTitle={event.title}
        eventUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />

      {/* Image Popup / Lightbox */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsPopupOpen(false)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            {/* Close Button - Circular like reference */}
            <button
              className="absolute -top-12 right-0 md:-right-12 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/10 transition-all z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setIsPopupOpen(false);
              }}
            >
              <span className="text-2xl font-light leading-none">✕</span>
            </button>

            <img
              src={bannerImage}
              alt={event.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
