"use client";

import { Heart, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

type EventCardProps = {
    id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  price: number | string;
  image: string;
  category: string;
};

export default function EventCard({
  id,
  title,
  organizer,
  date,
  location,
  price,
  image,
  category,
}: EventCardProps) {
  const { formatPrice } = useCurrency();
  const { user, toggleSavedEvent } = useAuth();
  const router = useRouter();
  
  const displayPrice = typeof price === 'number' ? formatPrice(price) : price;
  const isSaved = user?.savedEvents?.includes(id);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to event details
    if (!user) {
      router.push('/authpage');
      return;
    }
    await toggleSavedEvent(id);
  };

  return (

      <Link href={`/eventpage/${id}`}>
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-[300px]">
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-44 w-full object-cover"
        />

        {/* Favorite Icon */}
        <button 
          onClick={handleSaveToggle}
          className="absolute top-3 left-3 bg-white rounded-full p-2 shadow hover:scale-110 transition-transform z-10"
        >
          <Heart 
            size={16} 
            className={isSaved ? "text-red-600" : "text-gray-600"} 
            fill={isSaved ? "currentColor" : "none"} 
          />
        </button>

        {/* Category Tag */}
        <span className="absolute top-3 right-3 bg-white text-red-700 text-xs px-3 py-1 rounded-full font-medium">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className=" text-red-900 text-sm font-bold">
          {title}
        </h3>

        <p className="text-gray-500 text-sm">{organizer}</p>

        {/* Date */}
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Calendar size={14} color="red"/>
          <span>{date}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <MapPin size={14} color="red" />
          <span>{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-red-700 text-sm font-medium">
            {price === 0 ? 'Free' : displayPrice}
          </span>

          <button className="bg-red-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-700 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
   </Link>
  
  );
}