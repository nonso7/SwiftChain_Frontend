'use client';

import { useEffect, useRef } from 'react';
import type { Driver } from '@/services/fleetService';

/**
 * Dynamically imports Leaflet on the client only (SSR-safe).
 * Renders clustered driver pins via a canvas approach for performance.
 */

interface FleetMapProps {
  drivers: Driver[];
}

/* ──────────────────────────────────────────────
   Cluster helper — groups nearby pins
   ────────────────────────────────────────────── */
interface Cluster {
  lat: number;
  lng: number;
  count: number;
  drivers: Driver[];
}

function clusterDrivers(drivers: Driver[], gridSize = 0.5): Cluster[] {
  const grid = new Map<string, Driver[]>();

  for (const d of drivers) {
    const key = `${Math.floor(d.currentLocation.lat / gridSize)}_${Math.floor(d.currentLocation.lng / gridSize)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(d);
  }

  return Array.from(grid.values()).map((group) => {
    const lat = group.reduce((s, d) => s + d.currentLocation.lat, 0) / group.length;
    const lng = group.reduce((s, d) => s + d.currentLocation.lng, 0) / group.length;
    return { lat, lng, count: group.length, drivers: group };
  });
}

/* ──────────────────────────────────────────────
   Status colour for individual pins
   ────────────────────────────────────────────── */
const STATUS_COLOUR: Record<Driver['status'], string> = {
  active: '#22c55e',
  on_delivery: '#f59e0b',
  inactive: '#ef4444',
};

export function FleetMap({ drivers }: FleetMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Leaflet is client-only
    if (typeof window === 'undefined' || !mapContainer.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (cancelled || !mapContainer.current) return;

      // Prevent duplicate init
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainer.current, {
        center: [9.06, 7.49], // Abuja, Nigeria as default
        zoom: 6,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const clusters = clusterDrivers(drivers);

      for (const cluster of clusters) {
        if (cluster.count === 1) {
          // Single driver — coloured circle marker
          const d = cluster.drivers[0];
          const colour = STATUS_COLOUR[d.status];
          L.circleMarker([cluster.lat, cluster.lng], {
            radius: 8,
            fillColor: colour,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          })
            .addTo(map)
            .bindPopup(
              `<strong>${d.name}</strong><br/>Status: ${d.status}<br/>Vehicle: ${d.vehicleType}<br/>Plate: ${d.licensePlate}`,
            );
        } else {
          // Cluster bubble
          const icon = L.divIcon({
            html: `<div style="
              background: linear-gradient(135deg,#6366f1,#818cf8);
              color:#fff;
              border-radius:50%;
              width:36px;
              height:36px;
              display:flex;
              align-items:center;
              justify-content:center;
              font-weight:700;
              font-size:13px;
              box-shadow:0 2px 6px rgba(0,0,0,.3);
              border:2px solid #fff;
            ">${cluster.count}</div>`,
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          L.marker([cluster.lat, cluster.lng], { icon })
            .addTo(map)
            .bindPopup(
              `<strong>${cluster.count} drivers</strong><br/>${cluster.drivers
                .map((d) => d.name)
                .join(', ')}`,
            );
        }
      }

      // Auto-fit bounds if we have drivers
      if (clusters.length > 0) {
        const bounds = L.latLngBounds(clusters.map((c) => [c.lat, c.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [drivers]);

  return (
    <div id="fleet-map" className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <h3 className="bg-white px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
        Live Driver Map
      </h3>
      <div ref={mapContainer} style={{ height: 420, width: '100%' }} />
    </div>
  );
}
