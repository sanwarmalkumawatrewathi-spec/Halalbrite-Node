"use client";

import { Heart, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

type Event = {
  id: number;
  title: string;
  org: string;
  date: string;
  location: string;
  attendees: number;
  price: string;
  category: string;
  image: string;
};

const events: Event[] = [
  {
    id: 1,
    title: "Annual Islamic Conference 2025",
    org: "Islamic Conference Society",
    date: "Dec 15, 2025",
    location: "London, UK",
    attendees: 250,
    price: "€25",
    category: "Conference",
    image: "/featured.jpg",
  },
  {
    id: 2,
    title: "Halal Food Festival",
    org: "Halal Food Network",
    date: "Dec 20, 2025",
    location: "Birmingham, UK",
    attendees: 500,
    price: "€15",
    category: "Food Festival",
    image: "/featured.jpg",
  },
  {
    id: 3,
    title: "Community Gathering & Iftar",
    org: "Local Masjid Community",
    date: "Jan 5, 2026",
    location: "Manchester, UK",
    attendees: 150,
    price: "Free",
    category: "Community",
    image: "/featured.jpg",
  },
  {
    id: 4,
    title: "Islamic Education Workshop",
    org: "Knowledge Institute",
    date: "Jan 12, 2026",
    location: "Leeds, UK",
    attendees: 80,
    price: "€10",
    category: "Workshop",
    image: "/featured.jpg",
  },
  {
    id: 5,
    title: "Youth Leadership Summit",
    org: "Islamic Conference Society",
    date: "Jan 18, 2026",
    location: "Bristol, UK",
    attendees: 120,
    price: "€20",
    category: "Educational",
    image: "/featured.jpg",
  },
];

export default function EventCardGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* HEADER */}
      <p className="mb-4 mt-4 text-sm text-gray-700">
        Showing <span className="text-red-600 font-semibold">{events.length}</span> events
      </p>

      {/* GRID */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
        {events.map((event) => (
            <Link href={`/eventpage/${event.id}`}>
          <div
            key={event.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden w-[224px] h-[460px] "
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover"
              />

              {/* CATEGORY TAG */}
              <span className="absolute top-2 right-2 bg-white text-red-600 text-xs px-2 py-1 rounded-full shadow">
                {event.category}
              </span>

              {/* LIKE ICON */}
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow">
                <Heart size={16} className="text-gray-600" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col justify-between ">
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-4">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3.5">{event.org}</p>

                <div className="mt-2 space-y-1 text-sm text-gray-600 mb-2">
                  <p className="flex items-center gap-2 mb-3">
                    <Calendar size={14} /> {event.date}
                  </p>
                  <p className="flex items-center gap-2 mb-3">
                    <MapPin size={14} /> {event.location}
                  </p>
                  <p className="flex items-center gap-2 mb-3">
                    <Users size={14} /> {event.attendees} attending
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-5">
                <span className="text-red-600 font-semibold">
                  {event.price}
                </span>

                <button className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-red-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
</Link>
        ))}
      </div>


    </div>
  );
}