import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Landmark, Taxi, Language } from '../types';
import { MARRAKECH_CENTER } from '../data/marrakechData';
import { getLandmarkById } from '../utils/matching';

interface MarrakechMapProps {
  landmarks: Landmark[];
  taxis: Taxi[];
  language: Language;
  pickupId?: string;
  destinationId?: string;
  selectedTaxiId?: string;
  onSelectTaxi?: (taxiId: string) => void;
  onSelectLandmark?: (landmarkId: string) => void;
  heightClass?: string;
}

// Major Marrakech arterial road coordinates for guaranteed crisp vector road geometry
const MARRAKECH_ARTERIALS: Array<{ coords: [number, number][]; weight: number; color: string }> = [
  // Avenue Mohammed V (Guéliz -> Medina -> Koutoubia -> Jemaa)
  {
    coords: [
      [31.6485, -8.0178],
      [31.6350, -8.0108],
      [31.6305, -8.0020],
      [31.6258, -7.9891],
    ],
    weight: 4,
    color: '#CBD5E1',
  },
  // Avenue Hassan II (Gare ONCF -> Guéliz -> Bab Doukkala -> Palmeraie)
  {
    coords: [
      [31.6305, -8.0176],
      [31.6350, -8.0108],
      [31.6327, -7.9977],
      [31.6415, -8.0033],
      [31.6552, -7.9775],
    ],
    weight: 3.5,
    color: '#CBD5E1',
  },
  // Avenue Mohammed VI & Hivernage -> Menara -> Agdal
  {
    coords: [
      [31.6305, -8.0176],
      [31.6227, -8.0132],
      [31.6129, -8.0209],
      [31.6062, -7.9924],
      [31.6258, -7.9891],
    ],
    weight: 3.5,
    color: '#CBD5E1',
  },
  // Medina Ramparts subtle ring
  {
    coords: [
      [31.6390, -7.9960],
      [31.6330, -7.9820],
      [31.6210, -7.9830],
      [31.6190, -7.9960],
      [31.6327, -7.9977],
      [31.6390, -7.9960],
    ],
    weight: 2,
    color: '#E2E8F0',
  },
];

export const MarrakechMap: React.FC<MarrakechMapProps> = ({
  landmarks,
  taxis,
  language,
  pickupId,
  destinationId,
  selectedTaxiId,
  onSelectTaxi,
  onSelectLandmark,
  heightClass = 'h-[340px] lg:h-[460px]',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MARRAKECH_CENTER,
      zoom: 13.5,
      zoomControl: true,
      attributionControl: false,
    });

    // Load clean Carto Light / OSM tiles (fails silently to our clean vector road layer if offline)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Draw crisp Marrakech vector arterials underneath dynamic markers
    const roadLayer = L.layerGroup().addTo(map);
    MARRAKECH_ARTERIALS.forEach((road) => {
      L.polyline(road.coords, {
        color: road.color,
        weight: road.weight,
        opacity: 0.55,
      }).addTo(roadLayer);
    });

    const dynamicGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = dynamicGroup;

    // Ensure proper size calculation on first mount
    setTimeout(() => map.invalidateSize(), 120);

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Re-render markers & route polylines whenever state updates
  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Highlight selected taxi's active route polyline
    const selectedTaxi = taxis.find((tx) => tx.id === selectedTaxiId);
    if (selectedTaxi) {
      const routeCoords = selectedTaxi.stops
        .map((id) => getLandmarkById(landmarks, id)?.coords)
        .filter((c): c is [number, number] => Boolean(c));

      if (routeCoords.length >= 2) {
        L.polyline(routeCoords, {
          color: '#2563EB',
          weight: 5,
          opacity: 0.85,
          dashArray: '8 6',
        }).addTo(group);
      }
    } else if (pickupId && destinationId) {
      const pLm = getLandmarkById(landmarks, pickupId);
      const dLm = getLandmarkById(landmarks, destinationId);
      if (pLm && dLm) {
        L.polyline([pLm.coords, dLm.coords], {
          color: '#173B75',
          weight: 3,
          opacity: 0.55,
          dashArray: '6 6',
        }).addTo(group);
      }
    }

    // 2. Render Landmarks
    landmarks.forEach((lm) => {
      const isPickup = lm.id === pickupId;
      const isDest = lm.id === destinationId;

      if (isPickup || isDest) {
        const bg = isPickup ? '#2563EB' : '#173B75';
        const tag = isPickup
          ? language === 'ar'
            ? 'انطلاق'
            : language === 'fr'
            ? 'Départ'
            : 'Pickup'
          : language === 'ar'
          ? 'وجهة'
          : language === 'fr'
          ? 'Arrivée'
          : 'Dest.';

        const icon = L.divIcon({
          className: 'taxiseat-marker',
          iconSize: [96, 36],
          iconAnchor: [48, 32],
          html: `
            <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;">
              <div style="background:${bg};color:#fff;font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px;box-shadow:0 4px 12px rgba(23,59,117,0.3);white-space:nowrap;border:2px solid #fff;">
                ${tag}
              </div>
              <div style="width:10px;height:10px;border-radius:9999px;background:${bg};border:2px solid #fff;margin-top:2px;"></div>
            </div>
          `,
        });

        const marker = L.marker(lm.coords, { icon, zIndexOffset: 500 }).addTo(group);
        marker.bindPopup(`<div style="font-weight:700;color:#173B75;font-size:13px;">${lm.name[language]}</div><div style="font-size:11px;color:#64748B;">${lm.district[language]}</div>`);
      } else {
        const circle = L.circleMarker(lm.coords, {
          radius: lm.popular ? 5.5 : 4,
          color: '#173B75',
          weight: 1.5,
          fillColor: '#FFFFFF',
          fillOpacity: 0.95,
        }).addTo(group);

        circle.bindTooltip(lm.name[language], {
          direction: 'top',
          offset: [0, -6],
          opacity: 0.92,
        });

        if (onSelectLandmark) {
          circle.on('click', () => onSelectLandmark(lm.id));
        }
      }
    });

    // 3. Render Online Taxis
    taxis
      .filter((tx) => tx.isOnline)
      .forEach((tx) => {
        const openSeats = tx.seats.filter((s) => s.status === 'available').length;
        const isSelected = tx.id === selectedTaxiId;
        const isSmall = tx.type === 'small';
        const bg = isSelected ? '#173B75' : openSeats > 0 ? '#2563EB' : '#64748B';
        const typeChar = isSmall ? 'P' : 'G';

        const taxiIcon = L.divIcon({
          className: 'taxiseat-marker',
          iconSize: [58, 30],
          iconAnchor: [29, 15],
          html: `
            <div style="display:inline-flex;align-items:center;gap:4px;background:${bg};color:#FFFFFF;padding:4px 8px;border-radius:10px;border:2px solid #FFFFFF;box-shadow:0 4px 12px rgba(23,59,117,0.28);font-size:11px;font-weight:700;white-space:nowrap;cursor:pointer;transform:${isSelected ? 'scale(1.12)' : 'scale(1)'};">
              <span style="background:rgba(255,255,255,0.22);padding:0 4px;border-radius:4px;font-size:10px;">${typeChar}</span>
              <span style="font-variant-numeric:tabular-nums;">${openSeats}/${tx.capacity}</span>
            </div>
          `,
        });

        const m = L.marker(tx.currentPosition, {
          icon: taxiIcon,
          zIndexOffset: isSelected ? 600 : 300,
        }).addTo(group);

        m.bindPopup(`
          <div style="min-width:165px;">
            <div style="font-weight:700;color:#1E293B;font-size:13px;">${tx.model}</div>
            <div style="font-size:11px;color:#64748B;margin-top:2px;">${tx.headingLabel[language]}</div>
            <div style="font-size:11px;color:#2563EB;font-weight:600;margin-top:4px;">${openSeats} / ${tx.capacity} ${language === 'fr' ? 'places libres' : language === 'ar' ? 'مقاعد متاحة' : 'seats free'}</div>
          </div>
        `);

        if (onSelectTaxi) {
          m.on('click', () => onSelectTaxi(tx.id));
        }
      });
  }, [landmarks, taxis, language, pickupId, destinationId, selectedTaxiId, onSelectTaxi, onSelectLandmark]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 bg-[#EBF1F7]`}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="pointer-events-none absolute bottom-3 start-3 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-3 text-[11px] font-medium text-[#1E293B]">
        <span className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#2563EB] text-white text-[9px] font-bold">P</span>
          {language === 'fr' ? 'Petit Taxi' : language === 'ar' ? 'صغير' : 'Small'}
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#173B75] text-white text-[9px] font-bold">G</span>
          {language === 'fr' ? 'Grand Taxi' : language === 'ar' ? 'كبير' : 'Large'}
        </span>
      </div>
    </div>
  );
};
