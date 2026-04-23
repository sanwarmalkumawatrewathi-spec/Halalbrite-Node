"use client";

import { Heart, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

type MapEvent = {
  _id: string;
  title: string;
  organizerName: string;
  startDate: string;
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
      <div className="max-w-7xl mx-auto px-4 py-6">
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* HEADER */}
      <p className="mb-4 mt-4 text-sm text-gray-700">
        Showing <span className="text-red-600 font-semibold">{events.length}</span> events
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {events.map((event) => {
          const formattedDate = new Date(event.startDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const imageUrl = event.banner?.startsWith('http') ? event.banner : `${baseUrl}${event.banner}`;
          const isSaved = user?.savedEvents?.includes(event._id);
          
          return (
            <Link key={event._id} href={`/eventpage/${event._id}`} className="flex">
              <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden w-full flex flex-col">
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={imageUrl || "/featured.jpg"}
                    alt={event.title}
                    className="h-44 w-full object-cover"
                  />

                  {/* CATEGORY TAG */}
                  <span className="absolute top-2 right-2 bg-white text-red-600 text-xs px-2 py-1 rounded-full shadow">
                    {event.category?.name || "General"}
                  </span>

                  {/* LIKE ICON */}
                  <button 
                    onClick={(e) => handleSave(e, event._id)}
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
                  >
                    <Heart 
                      size={16} 
                      className={isSaved ? "text-red-600" : "text-gray-500"} 
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-red-600 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 truncate">{event.organizerName}</p>

                    <div className="space-y-1.5 text-xs text-gray-500">
                      <p className="flex items-center gap-2">
                        <Calendar size={13} /> {formattedDate}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={13} /> {event.location?.city || "Online"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users size={13} /> {event.attendees?.length || 0} attending
                      </p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <span className="text-red-600 font-semibold text-sm">
                      {event.price === 0 ? "Free" : `From ${formatPrice(event.price)}`}
                    </span>

                    <button className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-red-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}