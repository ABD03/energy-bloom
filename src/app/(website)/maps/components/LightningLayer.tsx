"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function LightningLayer() {
  const map = useMap();

  useEffect(() => {
    let markers: any[] = [];

    const fetchLightning = async () => {
      const lat = map.getCenter().lat;
      const lon = map.getCenter().lng;

      const res = await fetch(
        `https://api.open-meteo.com/v1/lightning?lat=${lat}&lon=${lon}&radius=500`
      );
      const data = await res.json();

      markers.forEach((m) => map.removeLayer(m));
      markers = [];

      data?.strikes?.forEach((s: any) => {
        const marker = L.circleMarker([s.latitude, s.longitude], {
          radius: 6,
          color: "yellow",
          fillColor: "yellow",
          fillOpacity: 0.9,
        }).bindPopup(`⚡ Lightning<br/>Time: ${s.timestamp}`);

        marker.addTo(map);
        markers.push(marker);
      });
    };

    fetchLightning();
    const interval = setInterval(fetchLightning, 5000);

    return () => clearInterval(interval);
  }, [map]);

  return null;
}
