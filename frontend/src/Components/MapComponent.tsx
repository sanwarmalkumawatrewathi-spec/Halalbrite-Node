"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

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
  price?: number;
  banner?: string;
  thumbnail?: string;
  category?: { name: string };
  startDate?: string | Date;
  startTime?: string;
};

type MapComponentProps = {
  center?: [number, number]; // [lng, lat] from MongoDB
  events?: MapEvent[];
  onMarkerClick?: (eventId: string | null) => void;
  selectedEventId?: string | null;
  height?: string;
  containerClassName?: string;
};

const defaultCenter = {
  lat: 20,
  lng: 0,
};

export default function MapComponent(props: MapComponentProps) {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
  const [isSettingsLoading, setIsSettingsLoading] = useState(!apiKey);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/api/admin/settings/public`);
        const result = await res.json();
        if (result.data?.maps?.googleMapsApiKey) {
          setApiKey(result.data.maps.googleMapsApiKey);
        }
      } catch (error) {
        console.error("Failed to fetch map settings:", error);
      } finally {
        setIsSettingsLoading(false);
      }
    };
    if (!apiKey) fetchSettings();
    else setIsSettingsLoading(false);
  }, [apiKey]);

  if (isSettingsLoading) {
    return (
      <div className="h-[500px] w-full bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center mb-20 max-w-7xl mx-auto shadow-sm animate-in fade-in duration-300">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-red-600 text-sm font-semibold tracking-wide animate-pulse">Loading Maps...</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="h-[500px] w-full bg-amber-50 rounded-2xl flex flex-col items-center justify-center border-2 border-amber-200 p-6 text-center mb-20 max-w-7xl mx-auto">
        <div className="text-amber-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h3 className="text-amber-900 font-bold text-lg mb-2">Google Maps API Key Missing</h3>
        <p className="text-amber-700 text-sm max-w-md">
          Please provide a valid Google Maps API Key in your environment variables (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) or in the admin settings.
        </p>
      </div>
    );
  }

  return <GoogleMapLoader apiKey={apiKey} {...props} />;
}

function GoogleMapLoader({ apiKey, center, events, onMarkerClick, selectedEventId, height = "500px", containerClassName = "rounded-2xl overflow-hidden shadow-xl max-w-7xl mx-auto border-4 border-white mb-20" }: MapComponentProps & { apiKey: string }) {
  const { formatPrice } = useCurrency();
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ['places'] as any,
  });

  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const getInitialCenter = () => {
    if (center && center.length === 2) {
      return { lat: center[1], lng: center[0] };
    }
    return defaultCenter;
  };

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(getInitialCenter);
  const [zoom, setZoom] = useState<number>(center ? 13 : 2);

  const prevSelectedEventId = useRef<string | null | undefined>(selectedEventId);
  const prevEvents = useRef<MapEvent[]>(events || []);

  // Sync selectedEvent with selectedEventId prop from parent
  useEffect(() => {
    if (selectedEventId === null || selectedEventId === undefined) {
      setSelectedEvent(null);
    } else if (selectedEventId && events) {
      const found = events.find((e) => e._id === selectedEventId);
      if (found) {
        setSelectedEvent(found);
      }
    }
  }, [selectedEventId, events]);

  useEffect(() => {
    // 1. Center prop takes highest priority
    if (center && center.length === 2) {
      setMapCenter({ lat: center[1], lng: center[0] });
      setZoom(13);
    }
    // 2. If selectedEventId changed to a truthy ID, center on that event
    else if (selectedEventId && selectedEventId !== prevSelectedEventId.current) {
      const selected = events?.find(e => e._id === selectedEventId);
      const coords = selected?.location?.geometry?.coordinates;
      if (coords && coords.length === 2) {
        setMapCenter({ lat: coords[1], lng: coords[0] });
        setZoom(13);
      }
    }
    // 3. If selectedEventId did NOT just change from truthy to null,
    // and events changed, do not auto-center/zoom into any event
    else if (
      (!selectedEventId) &&
      (prevSelectedEventId.current === null) &&
      (JSON.stringify(events?.map(e => e._id)) !== JSON.stringify(prevEvents.current?.map(e => e._id)))
    ) {
      // Keep showing the whole world map by default
    }

    prevSelectedEventId.current = selectedEventId;
    prevEvents.current = events || [];
  }, [selectedEventId, center, events]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleIdle = () => {
    if (map) {
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      if (currentCenter) {
        setMapCenter({ lat: currentCenter.lat(), lng: currentCenter.lng() });
      }
      if (currentZoom !== undefined) {
        setZoom(currentZoom);
      }
    }
  };

  if (loadError) {
    return (
      <div className={`w-full bg-red-50 rounded-2xl flex flex-col items-center justify-center border-2 border-red-200 p-6 text-center ${containerClassName}`} style={{ height }}>
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h3 className="text-red-900 font-bold text-lg mb-2">Map Load Error</h3>
        <p className="text-red-700 text-sm max-w-md">
          There was an error loading Google Maps. This usually happens if the API key is missing, invalid, or the Maps JavaScript API is not enabled in the Google Cloud Console.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center shadow-sm animate-in fade-in duration-300 ${containerClassName}`} style={{ height }}>
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-red-600 text-sm font-semibold tracking-wide animate-pulse">Loading Maps...</p>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={handleIdle}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          mapTypeId: 'roadmap' // Default view type
        }}
      >
        {/* Display single center marker if provided AND no events are provided */}
        {center && (!events || events.length === 0) && (
          <Marker
            position={mapCenter}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: "#dc2626",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#ffffff",
              scale: 1.5,
              anchor: typeof google !== 'undefined' ? new google.maps.Point(12, 22) : undefined,
            }}
          />
        )}

        {/* Display all events markers if provided */}
        {events && events.map((event, index) => {
          const coords = event.location?.geometry?.coordinates;
          if (!coords || coords.length !== 2) return null;

          const position = { lat: coords[1], lng: coords[0] };

          return (
            <Marker
              key={event._id || `marker-${index}`}
              position={position}
              onClick={() => {
                setSelectedEvent(event);
                if (onMarkerClick) onMarkerClick(event._id);
              }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: "#dc2626",
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#ffffff",
                scale: 1.2,
                anchor: new google.maps.Point(12, 22),
              }}
            />
          );
        })}

        {selectedEvent && (
          <InfoWindow
            position={{
              lat: selectedEvent.location!.geometry!.coordinates[1],
              lng: selectedEvent.location!.geometry!.coordinates[0]
            }}
            onCloseClick={() => {
              setSelectedEvent(null);
              if (onMarkerClick) onMarkerClick(null);
            }}
          >
            <div className="w-64 p-0 bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-100">
              <div className="relative h-32 w-full">
                <img
                  src={selectedEvent.banner ? (selectedEvent.banner.startsWith('http') ? selectedEvent.banner : `${baseUrl}${selectedEvent.banner}`) : "/images/noimage.jpg"}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold text-red-700 shadow-sm">
                  {selectedEvent.category?.name || "Event"}
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-red-900 text-sm leading-tight mb-2 line-clamp-2">{selectedEvent.title}</h3>

                <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <span>{selectedEvent.startDate ? new Date(selectedEvent.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "TBA"} • {selectedEvent.startTime || ""}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-red-700 font-bold text-sm">
                    {(() => {
                      const price = selectedEvent.price || 0;
                      const priceLabel = selectedEvent.priceLabel;
                      const displayPrice = formatPrice(price);
                      if (priceLabel && typeof price === 'number') {
                        const isFrom = priceLabel.toLowerCase().startsWith('from ');
                        if (price === 0) {
                          return isFrom ? 'From Free' : 'Free';
                        }
                        return isFrom ? `From ${displayPrice}` : displayPrice;
                      }
                      return priceLabel || (price === 0 ? 'Free' : displayPrice);
                    })()}
                  </span>
                  <Link
                    href={`/event/${selectedEvent.slug || selectedEvent._id}`}
                    className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-red-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}