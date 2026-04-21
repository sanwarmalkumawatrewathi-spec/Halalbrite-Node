


"use client";

import "leaflet/dist/leaflet.css"; 
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";

const locations: [number, number][] = [
  [51.5074, -0.1278],
  [53.4808, -2.2426],
  [52.4862, -1.8904],
  [48.8566, 2.3522],
  [52.52, 13.405],
  [40.7128, -74.006],
];

export default function MapComponent() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm max-w-7xl mx-auto">
      <MapContainer center={[40, 0]} zoom={3} className="h-[400px] w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {locations.map((pos, i) => (
          <CircleMarker
            key={i}
            center={pos}
            radius={8}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#ef4444",
              fillOpacity: 1,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}