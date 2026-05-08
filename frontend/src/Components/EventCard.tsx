"use client";

import { Heart, Calendar } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { LocationIcon } from "./Icons";

type EventCardProps = {
  id: string;
  slug?: string;
  title: string;
  organizer: string;
  organizerId?: string;
  organizerSlug?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location: string;
  price: number | string;
  priceLabel?: string;
  image: string;
  category: string;
};

export default function EventCard({
  id,
  slug,
  title,
  organizer,
  organizerId,
  organizerSlug,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  price,
  priceLabel,
  image,
  category,
}: EventCardProps) {
  const { formatPrice } = useCurrency();
  const { user, toggleSavedEvent } = useAuth();
  const router = useRouter();

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const bannerImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : "/images/noimage.jpg";

  const formatEventDate = (dateStr: string, timeStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const dayPart = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${datePart} • ${dayPart} ${timeStr || ""}`;
  };

  const displayPrice = typeof price === 'number' ? formatPrice(price) : price;
  const isSaved = user?.savedEvents?.includes(id);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      router.push('/login-register');
      return;
    }
    await toggleSavedEvent(id);
  };

  const handleCardClick = () => {
    router.push(`/event/${slug || id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden w-full h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
    >
      {/* Image */}
      <div className="relative ">
        <img
          src={bannerImage}
          alt={title}
          className="h-55 sm:h-45 w-full object-cover"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "/images/noimage.jpg";
          }}
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
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h3 className="text-red-900 mb-0.5 line-clamp-2 text-sm sm:text-base font-bold">
          {title}
        </h3>

        {organizerId ? (
          <Link href={`/organiser/${organizerSlug || organizerId}`} onClick={(e) => e.stopPropagation()}>
            <p className="text-gray-600 mb-1 text-xs sm:text-sm">{organizer}</p>
          </Link>
        ) : (
          <p className="text-gray-600 mb-1 text-xs sm:text-sm">{organizer}</p>
        )}

        {/* Date */}
        <div className="flex items-start gap-2 text-gray-500 text-[11px] leading-tight">
          <Calendar size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="whitespace-nowrap flex gap-2 items-center"><span className="flex flex-col text-[13px]">Start:</span> {formatEventDate(startDate, startTime)}</p>
            <p className="whitespace-nowrap flex gap-2 items-center"><span className="flex flex-col text-[13px]">End:</span> {formatEventDate(endDate, endTime)}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
          <LocationIcon size={14} className="text-red-600" />
          <span className="text-[13px] break-words">{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <span className="text-red-700 text-sm font-medium">
            {priceLabel || (price === 0 ? 'Free' : displayPrice)}
          </span>

          <button className="bg-red-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-700 transition">
            View Details
          </button>
        </div>
      </div>
    </div>

  );
}