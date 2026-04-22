"use client";
// @ts-nocheck

import "leaflet/dist/leaflet.css"; 
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import Link from "next/link";

type MapEvent = {
  _id: string;
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
};

export default function MapComponent({ center, events }: MapComponentProps) {
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
  const CircleMarkerAny = CircleMarker as any;
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
          <CircleMarkerAny
            center={mapCenter}
            radius={12}
            pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 1 }}
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
            : null;

          return (
            <CircleMarkerAny
              key={event._id}
              center={position}
              radius={10}
              pathOptions={{
                color: "#991b1b",
                fillColor: "#dc2626",
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <TooltipAny direction="top" offset={[0, -10]} opacity={1}>
                <div className="flex items-center gap-3 p-1 min-w-[150px]">
                  {thumbUrl && (
                    <img 
                      src={thumbUrl} 
                      alt="" 
                      className="w-10 h-10 rounded object-cover border border-gray-100"
                    />
                  )}
                  <div>
                    <div className="font-bold text-red-900 leading-tight mb-0.5">{event.title}</div>
                    <div className="text-[10px] text-gray-600">{event.location?.venueName || event.location?.city}</div>
                  </div>
                </div>
              </TooltipAny>
              
              <PopupAny>
                <div className="w-48 p-1">
                  {event.banner && (
                    <img 
                      src={event.banner.startsWith('http') ? event.banner : `${baseUrl}${event.banner}`} 
                      alt={event.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="font-bold text-red-900 text-sm leading-tight mb-1">{event.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{event.location?.city}</p>
                  <Link 
                    href={`/eventpage/${event._id}`}
                    className="block text-center bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </PopupAny>
            </CircleMarkerAny>
          );
        })}
      </MapContainerAny>
    </div>
  );
}