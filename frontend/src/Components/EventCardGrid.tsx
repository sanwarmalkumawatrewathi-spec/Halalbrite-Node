"use client";

import { Heart, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import EventCard from "./EventCard";

type MapEvent = {
  _id: string;
  slug?: string;
  title: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location?: {
    venueName?: string;
    city?: string;
  };
  attendees?: any[];
  price: number;
  priceLabel: string;
  category: {
    name: string;
  };
  banner: string;
};

type EventCardGridProps = {
  events: MapEvent[];
  loading?: boolean;
};

export default function EventCardGrid({ events, loading }: EventCardGridProps) {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const { formatPrice } = useCurrency();
  const { user, toggleSavedEvent } = useAuth();
  const router = useRouter();

  const handleSave = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!user) { router.push('/authpage'); return; }
    await toggleSavedEvent(id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-[380px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        <p>No events found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">

      {/* HEADER */}
      <p className="mb-4 mt-4 text-sm text-gray-700">
        Showing <span className="text-red-600 font-semibold">{events.length}</span> events
      </p>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {events.map((event) => {
          return (
            <EventCard
              key={event._id}
              id={event._id}
              slug={event.slug}
              title={event.title}
              organizer={event.organizerName}
              location={`${event.location?.city || "Online"}`}
              startDate={event.startDate}
              endDate={event.endDate}
              startTime={event.startTime}
              endTime={event.endTime}
              price={event.price}
              priceLabel={event.priceLabel}
              image={event.banner}
              category={event.category?.name || "General"}
            />
          );
        })}
      </div>
    </div>
  );
}
