"use client";
// @ts-nocheck

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import Link from "next/link";

// Custom Location Icon for Map
const createLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="color: #dc2626; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>
    `,
    className: 'custom-location-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

type MapEvent = {
  _id: string;
  slug?: string;
  title: string;
  location?: {
    venueName?: string;
    city?: string;
    geometry?: {
      coordinates: [number, number]; // [lng, lat]
    };
  };
  priceLabel?: string;
  banner?: string;
  thumbnail?: string;
};

type MapComponentProps = {
  center?: [number, number]; // [lat, lng] or [lng, lat] depending on usage
  events?: MapEvent[];
  onMarkerClick?: (eventId: string) => void;
};

export default function MapComponent({ center, events, onMarkerClick }: MapComponentProps) {
  // Determine map center
  let mapCenter: [number, number] = [54.5, -2]; // Default UK center
  let zoom = 6;

  if (center && center.length === 2) {
    // MongoDB stores [lng, lat], Leaflet needs [lat, lng]
    mapCenter = [center[1], center[0]];
    zoom = 13;
  } else if (events && events.length > 0) {
    // Try to center on the first event with coordinates
    const firstWithCoords = events.find(e => e.location?.geometry?.coordinates);
    if (firstWithCoords) {
      const coords = firstWithCoords.location!.geometry!.coordinates;
      mapCenter = [coords[1], coords[0]];
    }
  }

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;
  const MarkerAny = Marker as any;
  const TooltipAny = Tooltip as any;
  const PopupAny = Popup as any;

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl max-w-7xl mx-auto border-4 border-white mb-10">
      <MapContainerAny
        center={mapCenter}
        zoom={zoom}
        className="h-[500px] w-full"
        scrollWheelZoom={false}
      >
        <TileLayerAny
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Display single center marker if provided */}
        {center && (
          <MarkerAny
            position={mapCenter}
            icon={createLocationIcon()}
          />
        )}

        {/* Display all events markers if provided */}
        {events && events.map((event, index) => {
          const coords = event.location?.geometry?.coordinates;
          if (!coords || coords.length !== 2) return null;

          // Add a jitter to avoid perfect stacking for events at the same location
          const jitterLat = (Math.random() - 0.5) * 0.01;
          const jitterLng = (Math.random() - 0.5) * 0.01;
          const position: [number, number] = [coords[1] + jitterLat, coords[0] + jitterLng];

          const thumbUrl = event.thumbnail
            ? (event.thumbnail.startsWith('http') ? event.thumbnail : `${baseUrl}${event.thumbnail}`)
            : "/images/noimage.jpg";

          const bannerUrl = event.banner
            ? (event.banner.startsWith('http') ? event.banner : `${baseUrl}${event.banner}`)
            : "/images/noimage.jpg";

          return (
            <MarkerAny
              key={event._id}
              position={position}
              icon={createLocationIcon()}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(event._id)
              }}
            >
              <TooltipAny direction="top" offset={[0, -20]} opacity={1}>
                <div className="flex items-center gap-3 p-2 min-w-[200px] max-w-[250px]">
                  <img
                    src={thumbUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg flex-shrink-0 object-cover border border-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-red-900 text-xs leading-tight mb-1 break-words">
                      {event.title}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {event.location?.venueName || event.location?.city}
                    </div>
                  </div>
                </div>
              </TooltipAny>

              <PopupAny>
                <div className="w-48 p-1">
                  <img
                    src={bannerUrl}
                    alt={event.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-red-900 text-sm leading-tight mb-1">{event.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{event.location?.city}</p>
                  <Link
                    href={`/event/${event.slug || event._id}`}
                    className="block text-center bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </PopupAny>
            </MarkerAny>
          );
        })}
      </MapContainerAny>
    </div>
  );
}