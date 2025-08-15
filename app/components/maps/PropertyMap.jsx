//app/components/maps/PropertyMap.jsx
"use client";

import { useMemo, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

export default function PropertyMap({ lat, lng, title = "Location" }) {
 
  const apiKey = process.env.NEXT_PUBLIC_Maps_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",                
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const center = useMemo(
    () => ({
      lat: Number(lat) || -1.286389,        
      lng: Number(lng) || 36.817223,
    }),
    [lat, lng]
  );

  const [infoOpen, setInfoOpen] = useState(false);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-600">
        Failed to load map: {String(loadError?.message || loadError)}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker position={center} title={title} onClick={() => setInfoOpen(true)} />
      {infoOpen && (
        <InfoWindow position={center} onCloseClick={() => setInfoOpen(false)}>
          <div style={{ maxWidth: 220 }}>
            <strong>{title}</strong>
            <div>Lat: {center.lat}</div>
            <div>Lng: {center.lng}</div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
