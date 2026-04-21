


import Link from "next/link";
import EventCard from "./EventCard";

type Props = {
  activeCategory: string;
};

const events = [
  {
    id:"1",
    title: "Islamic Education Workshop",
    organizer: "Knowledge Institute",
    date: "May 2-3, 2026 · 10:00 AM",
    location: "Leeds, UK",
    price: "From €10",
    image: "/featured.jpg",
    category: "Workshop",
  },
  {
    id:"2",
    title: "Food Festival",
    organizer: "Halal Food Network",
    date: "Apr 22-24, 2026",
    location: "Birmingham, UK",
    price: "From €15",
    image: "/featured.jpg",
    category: "Food Festival",
  },
];

export default function FeaturedEvents({ activeCategory }: Props) {
  
  // ✅ FILTER LOGIC
  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter(
          (event) =>
            event.category?.toLowerCase() === activeCategory?.toLowerCase()
        );

  return (
    <section className="p-6 rounded-xl max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-red-900 font-bold text-lg mb-2.5">
            Featured Events
          </h2>
          <p className="text-gray-600 text-[15px] mb-3">
            Discover upcoming events in your community
          </p>
        </div>

        <button className="text-red-600 text-xl">↗</button>
      </div>

      {/* Cards */}
      <div className="flex gap-5 overflow-x-auto">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, i) => (
            <EventCard key={i} {...event} />
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