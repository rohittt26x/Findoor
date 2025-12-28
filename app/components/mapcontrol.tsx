"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapControlProps {
  center: [number, number];
  markerPos: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapControl({ center, markerPos, onLocationSelect }: MapControlProps) {
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return markerPos ? <Marker position={markerPos} /> : null;
  }

  return (
    <MapContainer
      center={center}
      zoom={18} // 18 is the "sweet spot" for campus building names
      style={{ height: "100%", width: "100%" }}
      zoomControl={true} // Enabled zoom control so users can find specific rooms/areas
      scrollWheelZoom={true}
    >
      {/* VOYAGER THEME: This style shows clear building names, icons, and roads */}
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        attribution='&copy; <a href="https://carto.com/">MIT ADT Campus Map</a>'
      />
      <MapClickHandler />
    </MapContainer>
  );
}