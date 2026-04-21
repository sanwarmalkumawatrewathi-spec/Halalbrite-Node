"use client";

import { useParams } from "next/navigation";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import TicketSelection from "@/Components/TicketSelection"
import MapComponent from "@/Components/MapComponent"

import Link from "next/link";
import { MapPin, Share2, Heart } from "lucide-react";



const events = [
  {
    id: "1",
    title: "Annual Islamic Conference 2025",
    category: "Conference",
    date: "Dec 15, 2025",
    time: "2:00 PM - 8:00 PM",
    attendees: "250 attending",
    location: "London, UK",
    price: "€25",
    image: "/featured.jpg",
    description:
      "Join us for an inspiring Islamic conference with scholars and community leaders.",
  },
  {
    id: "2", // ✅ NOW THIS WILL WORK
    title: "Food Festival",
    category: "Food Festival",
    date: "Apr 22, 2026",
    time: "11:00 AM - 6:00 PM",
    attendees: "500 attending",
    location: "Birmingham, UK",
    price: "€15",
    image: "/featured.jpg",
    description: "Enjoy halal food and community vibes.",
  },
];

export default function EventDetails() {
  const params = useParams();
 
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const event = events.find((e) => e.id === id);

  if (!event) return <p className="p-6">Event not found</p>;

  return (
    <div>
      <Header />
<section>
      {/* Back */}
      <div className="max-w-7xl mx-auto p-4">
        <Link href="/" className="text-gray-600 text-sm">
          ← Back to Events
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Content */}
        <div className="absolute bottom-6 left-80 text-white ">
          <span className="bg-white text-red-600 text-xs px-3 py-1 rounded-full">
            {event.category}
          </span>

          <h1 className="text-2xl md:text-3xl font-semibold mt-3">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-200 mx-auto">
            <span>📅 {event.date}</span>
            <span>⏰ {event.time}</span>
            <span>👥 {event.attendees}</span>
          </div>
        </div>
      </div>
</section>




<section>

    <div className="max-w-6xl mx-auto px-6 mt-6">
  <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
    
    {/* Left */}
    <div className="flex items-center gap-4">
      
      {/* Logo */}
      <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg shadow">
        IS
      </div>

      {/* Text */}
      <div>
        <p className="text-sm text-gray-500">Organised by</p>
        <h3 className="font-semibold text-red-900">
          Islamic Conference Society
        </h3>
        <p className="text-sm text-gray-500">1,250 followers</p>
      </div>
    </div>

    {/* Follow Button */}
    <button className="border border-red-500 text-red-600 px-5 py-2 rounded-lg font-medium hover:bg-red-50 transition">
      Follow
    </button>
  </div>
</div>
</section>



<section>
<div className="  flex justify-center items-start py-10 px-4">
      <div className="max-w-6xl w-full h-[568px] grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT CONTENT */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-red-900 mb-4">
            Annual Islamic Conference 2025
          </h2>

          <h3 className="font-semibold mb-2 text-red-900 text-xl">Overview:</h3>

          <p className="text-md text-gray-700 mb-5">
            Join us for our Annual Islamic Conference 2025, a full-day event
            featuring renowned scholars, inspiring talks, and networking opportunities.
          </p>

          <p className="text-md text-gray-700 mb-3">
            This year's conference will focus on "Building Stronger Communities"
            with sessions covering topics such as:
          </p>

          <ul className="list-disc ml-5 text-md text-gray-700 mb-5 space-y-1">
            <li>Islamic finance and economics</li>
            <li>Youth engagement and education</li>
            <li>Community building and social responsibility</li>
            <li>Interfaith dialogue and understanding</li>
          </ul>

          <p className="text-md text-gray-700 mb-3">The conference includes:</p>

          <ul className="list-dash ml-5 text-md text-gray-700 space-y-1">
            <li>8+ keynote speakers</li>
            <li>Panel discussions</li>
            <li>Networking sessions</li>
            <li>Halal lunch and refreshments</li>
            <li>Exhibition area with 20+ vendors</li>
            <li>Prayer facilities available</li>
          </ul>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          
          {/* LOCATION CARD */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold mb-2 text-red-900 mb-4">Location</h3>

            <p className="text-sm text-gray-700">
              Community Center Hall
            </p>
            <p className="text-sm text-gray-600">
              123 Main Street, London, SW1A 1AA
            </p>
            <p className="text-sm text-gray-600 mb-3">London, UK</p>

            <button className="flex items-center gap-2 text-sm border border-gray-300 rounded-full px-3 py-2 hover:bg-red-200  hover:text-red-900 w-full justify-center">
              <MapPin size={16} />
              View in Google Maps
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full hover:bg-red-200 hover:text-red-900 ">
              <Share2 size={16} />
              Share Event
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full hover:bg-red-200 hover:text-red-900 ">
              <Heart size={16} />
              Save Event
            </button>
          </div>
        </div>
      </div>
</div>


</section>



<TicketSelection/>

<section className="max-w-6xl mx-auto p-6 shadow-md mt-4 mb-6">
  <h1 className="text-red-900 mb-3.5">Map</h1>
<MapComponent/>

</section>





      

      <Footer />
    </div>
  );
}