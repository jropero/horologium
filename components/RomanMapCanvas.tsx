import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { ROMAN_CITIES, RomanCity } from '../utils/romanCities';
import { getAllProvinces } from '../utils/romanProvinces';

// ── Map projection bounds ─────────────────────────────────────────────────────
const LNG_MIN = -14;
const LNG_MAX = 63;
const LAT_MIN = 19;
const LAT_MAX = 62;
const LNG_RANGE = LNG_MAX - LNG_MIN;
const LAT_RANGE = LAT_MAX - LAT_MIN;
const MID_LNG = (LNG_MIN + LNG_MAX) / 2;
const MID_LAT = (LAT_MIN + LAT_MAX) / 2;

// ── Colors ────────────────────────────────────────────────────────────────────
const C_SEA     = '#8baab8';   // muted Roman sea blue
const C_LAND    = '#e0cc96';   // antique parchment
const C_EMPIRE  = '#dfc98a';   // slightly warmer parchment for empire territory
const C_BORDER  = 'rgba(180,130,40,0.75)';   // amber province border
const C_OUTER   = 'rgba(140,70,20,0.85)';    // thicker empire outer limit
const C_RIVER   = 'rgba(100,155,200,0.70)';  // river blue
const C_CITY_DOT = '#7a2e10';  // burnt sienna
const C_LABEL   = '#2a1408';   // near-ink brown
const C_USER    = '#cc2020';   // user location red

// ── Simplified sea polygons (lat,lng) ─────────────────────────────────────────
// Drawn ON TOP of land background to carve out water bodies.
const SEA_POLYS: [number, number][][] = [
  // Atlantic + Bay of Biscay + N Sea + English Channel
  [
    [62,-14],[62,-4],[56,-4],[52,2],[51,2],[50,0],[49,-2],[48,-4],
    [46,-3],[43,-3],[36,-5.6],[28,-5.6],[20,-14],
  ],
  // Mediterranean (main body) + Adriatic + Aegean + E Mediterranean
  [
    // N coast (E direction): Gibraltar → Spain → S France → Ligurian → W Italy
    [36.1,-5.4],[43.4,3.2],[43.7,7.3],[44.4,8.9],
    [43.5,10.5],[41.5,12.4],
    // Up Adriatic W coast (Italy E side), around top, down Dalmatia coast
    [41.5,12.5],[44.5,12.5],[45.5,13.5],[46.0,13.0],
    [44.5,14.0],[43.5,16.5],[42.0,16.5],[41.3,19.5],[40.5,19.5],
    // Continue S along Greek W coast
    [39.5,20.5],[38.5,20.5],[39.0,21.5],[39.5,22.0],
    // Aegean N coast → Bosphorus → W Anatolia
    [40.8,26.5],[41.0,27.5],[40.5,27.5],
    [38.5,26.5],[37.0,27.0],[36.5,28.5],
    // S Anatolia coast → Levant
    [36.0,32.5],[35.5,36.0],
    [33.5,35.5],[32.5,34.5],[31.5,34.5],
    // S coast: Egypt → Libya → Tunisia → Algeria → Morocco → Gibraltar
    [31.5,25.0],[31.5,19.5],[31.5,14.5],[32.5,14.5],[33.0,13.0],
    [33.5,12.0],[37.1,11.5],[37.5,10.0],[37.1,9.0],[36.5,7.5],
    [36.0,6.5],[35.0,6.5],[35.0,3.0],[36.0,-1.0],[35.9,-5.5],
  ],
  // Black Sea
  [
    [41.0,27.5],[42.0,28.0],[43.2,28.5],[44.5,29.3],
    [45.5,30.0],[46.0,33.5],[46.5,36.5],[43.5,41.5],
    [41.0,41.0],[41.0,38.0],[41.0,36.5],[40.5,36.5],
    [40.5,38.0],[41.5,41.5],[43.5,41.0],[46.0,37.0],[46.0,32.0],
    [45.0,30.0],[44.5,29.3],[43.0,28.5],[41.7,28.0],[41.0,27.5],
  ],
  // Red Sea (N portion)
  [
    [30.0,32.5],[30.0,35.0],[29.5,35.0],[26.0,38.0],[22.5,37.5],
    [20.0,37.5],[20.0,32.5],
  ],
  // Caspian Sea (partial)
  [
    [47.0,49.5],[47.0,53.0],[44.0,53.5],[37.5,50.0],[37.5,49.5],
    [38.5,49.0],[40.5,50.0],[43.0,51.0],[47.0,51.0],[47.0,49.5],
  ],
];

// ── Major rivers (lat,lng polylines) ─────────────────────────────────────────
const RIVERS: { name: string; pts: [number, number][] }[] = [
  {
    name: 'Nilus',
    pts: [
      [22.0,31.0],[24.0,32.5],[26.0,32.7],[28.0,30.5],[29.5,31.0],[30.5,31.2],[31.2,30.0],
    ],
  },
  {
    name: 'Rhenus',
    pts: [
      [47.6,7.6],[48.6,7.8],[49.5,7.7],[50.0,8.3],[50.3,7.6],[50.9,7.0],
      [51.5,6.5],[52.0,5.5],[52.5,4.8],
    ],
  },
  {
    name: 'Danuvius',
    pts: [
      [47.8,8.2],[48.5,10.0],[49.0,12.1],[48.6,13.4],[48.3,14.3],
      [48.2,16.4],[48.1,17.1],[47.5,19.1],[46.0,18.7],[45.3,19.0],
      [44.8,20.5],[44.7,22.5],[44.1,26.7],[45.5,28.0],[45.2,29.7],
    ],
  },
  {
    name: 'Euphrates',
    pts: [
      [39.0,39.5],[37.5,38.5],[36.5,40.0],[35.5,42.0],[34.5,43.5],
      [33.5,44.5],[31.5,47.5],[30.5,48.0],
    ],
  },
  {
    name: 'Tigris',
    pts: [
      [38.5,40.0],[37.5,40.5],[36.0,43.0],[34.5,44.0],[33.1,44.5],[31.0,47.5],
    ],
  },
];

// ── City HIT radius (in base canvas pixels before zoom) ─────────────────────
const DOT_RADIUS = 4;
const HIT_RADIUS = 12; // 24px diameter at scale=1

// ── View state ────────────────────────────────────────────────────────────────
// scale = pixels per geographic degree (same for x and y → correct aspect ratio)
interface ViewState {
  scale: number;
  panX: number;
  panY: number;
}

function project(lat: number, lng: number, v: ViewState, w: number, h: number): [number, number] {
  return [
    w / 2 + (lng - MID_LNG) * v.scale + v.panX,
    h / 2 - (lat - MID_LAT) * v.scale + v.panY,
  ];
}

function unproject(cx: number, cy: number, v: ViewState, w: number, h: number): [number, number] {
  return [
    MID_LAT - (cy - h / 2 - v.panY) / v.scale,
    (cx - w / 2 - v.panX) / v.scale + MID_LNG,
  ];
}

// Zoom keeping the geographic point under (cx, cy) fixed.
// offCx = cx - w/2, offCy = cy - h/2 (offset from canvas centre).
function zoomAt(v: ViewState, offCx: number, offCy: number, factor: number, minScale: number, maxScale: number): ViewState {
  const newScale = Math.max(minScale, Math.min(maxScale, v.scale * factor));
  const f = newScale / v.scale;
  return {
    scale: newScale,
    panX: offCx * (1 - f) + v.panX * f,
    panY: offCy * (1 - f) + v.panY * f,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface RomanMapCanvasProps {
  userLat: number;
  userLng: number;
  onLocationChange: (lat: number, lng: number) => void;
  onClose: () => void;
}

const PROVINCES = getAllProvinces();

const RomanMapCanvas: React.FC<RomanMapCanvasProps> = ({
  userLat, userLng, onLocationChange, onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const sizeRef      = useRef({ w: 0, h: 0 });
  const frameRef     = useRef<number | null>(null);
  const viewRef      = useRef<ViewState>({ scale: 0, panX: 0, panY: 0 }); // scale=0 = not yet initialised
  // Pointer tracking for pan and pinch
  const pointersRef  = useRef<Map<number, { x: number; y: number }>>(new Map());
  const panStartRef  = useRef<{ x: number; y: number } | null>(null);

  const [selectedCity, setSelectedCity] = useState<(RomanCity & { cx: number; cy: number }) | null>(null);
  const [minScale, setMinScale] = useState(1);
  const [maxScale, setMaxScale] = useState(200);

  // ── Draw ─────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    frameRef.current = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { w, h } = sizeRef.current;
    if (!w || !h) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const v = viewRef.current;

    const px = (lat: number, lng: number): [number, number] => project(lat, lng, v, w, h);

    function drawPoly(poly: [number, number][], fillStyle?: string, strokeStyle?: string, lineWidth = 1) {
      if (poly.length < 2) return;
      ctx.beginPath();
      const [x0, y0] = px(poly[0][0], poly[0][1]);
      ctx.moveTo(x0, y0);
      for (let i = 1; i < poly.length; i++) {
        const [xi, yi] = px(poly[i][0], poly[i][1]);
        ctx.lineTo(xi, yi);
      }
      ctx.closePath();
      if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
      if (strokeStyle) { ctx.strokeStyle = strokeStyle; ctx.lineWidth = lineWidth; ctx.stroke(); }
    }

    function drawLine(pts: [number, number][], strokeStyle: string, lineWidth: number) {
      if (pts.length < 2) return;
      ctx.beginPath();
      const [x0, y0] = px(pts[0][0], pts[0][1]);
      ctx.moveTo(x0, y0);
      for (let i = 1; i < pts.length; i++) {
        const [xi, yi] = px(pts[i][0], pts[i][1]);
        ctx.lineTo(xi, yi);
      }
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    // 1. Fill canvas with land/sea base — land is parchment
    ctx.fillStyle = C_LAND;
    ctx.fillRect(0, 0, w, h);

    // 2. Sea areas
    for (const sea of SEA_POLYS) {
      drawPoly(sea, C_SEA);
    }

    // 3. Province fills (warm empire parchment)
    for (const prov of PROVINCES) {
      for (const ring of prov.polygons) drawPoly(ring, C_EMPIRE);
    }

    // 4. Province borders
    const borderW = Math.max(0.5, Math.min(2.5, v.scale * 0.12));
    for (const prov of PROVINCES) {
      for (const ring of prov.polygons) drawPoly(ring, undefined, C_BORDER, borderW);
    }

    // 5. Rivers
    const riverW = Math.max(0.8, Math.min(3, v.scale * 0.18));
    ctx.setLineDash([Math.max(3, v.scale * 0.8), Math.max(2, v.scale * 0.6)]);
    for (const r of RIVERS) drawLine(r.pts, C_RIVER, riverW);
    ctx.setLineDash([]);

    // 6. City dots and labels
    const dotR = Math.max(2, Math.min(6, v.scale * 0.55));
    const fontSize = Math.max(9, Math.min(13, v.scale * 1.8));
    ctx.font = `${fontSize}px Cinzel, Georgia, serif`;
    ctx.textBaseline = 'middle';

    for (const city of ROMAN_CITIES) {
      const [cx, cy] = px(city.lat, city.lng);
      if (cx < -20 || cx > w + 20 || cy < -20 || cy > h + 20) continue;

      // Dot
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      const isSelected = selectedCity?.name === city.name;
      ctx.fillStyle = isSelected ? C_USER : C_CITY_DOT;
      ctx.fill();

      const showLabel = city.type === 'capital' || v.scale > 12 || (v.scale > 6 && city.type === 'major');
      if (showLabel) {
        const label = city.name;
        const tw = ctx.measureText(label).width;
        const lx = cx + dotR + 3;
        const ly = cy;
        // label background
        ctx.fillStyle = 'rgba(224,204,150,0.80)';
        ctx.fillRect(lx - 2, ly - 7, tw + 4, 14);
        ctx.fillStyle = C_LABEL;
        ctx.fillText(label, lx, ly);
      }
    }

    // 7. User location marker
    const [ux, uy] = px(userLat, userLng);
    if (ux >= -20 && ux <= w + 20 && uy >= -20 && uy <= h + 20) {
      const r = Math.max(5, Math.min(16, v.scale * 1.4));
      ctx.beginPath();
      ctx.arc(ux, uy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,20,20,0.25)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ux, uy, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = C_USER;
      ctx.fill();
      // crosshair
      ctx.strokeStyle = C_USER;
      ctx.lineWidth = 1.5;
      const cr = r * 1.6;
      ctx.beginPath(); ctx.moveTo(ux - cr, uy); ctx.lineTo(ux + cr, uy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ux, uy - cr); ctx.lineTo(ux, uy + cr); ctx.stroke();
    }

    // 8. Compass rose (top-right corner)
    const margin = 28;
    const cr2 = margin - 6;
    ctx.font = `bold ${cr2 * 0.55}px Cinzel, Georgia, serif`;
    ctx.fillStyle = 'rgba(90,50,10,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('N', w - margin, margin - cr2 - 4);
    ctx.fillText('S', w - margin, margin + cr2 + 10);
    ctx.textAlign = 'left';
    ctx.font = `${Math.max(9, 10)}px Cinzel, Georgia, serif`;
    ctx.textBaseline = 'middle';
  }, [userLat, userLng, selectedCity]);

  const scheduleDraw = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => { scheduleDraw(); }, [scheduleDraw]);

  // ── ResizeObserver ────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { w: width, h: height };
      canvas.width  = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // Fit the full extent into the canvas, preserving geographic aspect ratio.
      // scale = px per degree; use the more constraining axis.
      const initScale = Math.min(width / LNG_RANGE, height / LAT_RANGE) * 0.96;
      setMinScale(initScale * 0.45);
      setMaxScale(initScale * 25);
      if (viewRef.current.scale === 0) {
        viewRef.current = { scale: initScale, panX: 0, panY: 0 };
      }
      scheduleDraw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [scheduleDraw]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── City hit test ─────────────────────────────────────────────────────────
  function hitTestCity(canvasX: number, canvasY: number): RomanCity | null {
    const v = viewRef.current;
    const { w, h } = sizeRef.current;
    let best: RomanCity | null = null;
    let bestDist2 = (Math.max(HIT_RADIUS, v.scale * 1.5)) ** 2;
    for (const city of ROMAN_CITIES) {
      const [cx, cy] = project(city.lat, city.lng, v, w, h);
      const d2 = (cx - canvasX) ** 2 + (cy - canvasY) ** 2;
      if (d2 < bestDist2) { bestDist2 = d2; best = city; }
    }
    return best;
  }

  // ── Pointer events ────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      panStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const prev = pointersRef.current.get(e.pointerId);
    if (!prev) return;
    const ptrs = pointersRef.current;

    if (ptrs.size === 2) {
      // Pinch-to-zoom
      const [idA, idB] = [...ptrs.keys()];
      const a = idA === e.pointerId ? { x: e.clientX, y: e.clientY } : ptrs.get(idA)!;
      const b = idB === e.pointerId ? { x: e.clientX, y: e.clientY } : ptrs.get(idB)!;
      const prevA = ptrs.get(idA)!;
      const prevB = ptrs.get(idB)!;
      const prevDist = Math.hypot(prevA.x - prevB.x, prevA.y - prevB.y);
      const newDist  = Math.hypot(a.x - b.x, a.y - b.y);
      if (prevDist > 0) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const { w, h } = sizeRef.current;
        const cx = (a.x + b.x) / 2 - rect.left;
        const cy = (a.y + b.y) / 2 - rect.top;
        viewRef.current = zoomAt(viewRef.current, cx - w / 2, cy - h / 2, newDist / prevDist, minScale, maxScale);
        scheduleDraw();
      }
    } else if (ptrs.size === 1) {
      // Pan
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      viewRef.current = {
        ...viewRef.current,
        panX: viewRef.current.panX + dx,
        panY: viewRef.current.panY + dy,
      };
      scheduleDraw();
    }

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = panStartRef.current;
    const prev  = pointersRef.current.get(e.pointerId);
    pointersRef.current.delete(e.pointerId);

    // Treat as click if barely moved
    if (start && prev && pointersRef.current.size === 0) {
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (moved < 6) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const hit = hitTestCity(e.clientX - rect.left, e.clientY - rect.top);
        if (hit) {
          const { w, h } = sizeRef.current;
          const [cx, cy] = project(hit.lat, hit.lng, viewRef.current, w, h);
          setSelectedCity({ ...hit, cx, cy });
        } else {
          setSelectedCity(null);
        }
      }
    }
    panStartRef.current = null;
  };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const { w, h } = sizeRef.current;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    viewRef.current = zoomAt(viewRef.current, cx - w / 2, cy - h / 2, factor, minScale, maxScale);
    scheduleDraw();
  };

  // ── City card position ────────────────────────────────────────────────────
  const cardStyle = (() => {
    if (!selectedCity) return {};
    const { cx, cy } = selectedCity;
    const { w, h } = sizeRef.current;
    const CARD_W = 220;
    const CARD_H = 160;
    let left = cx + 12;
    let top  = cy - 20;
    if (left + CARD_W > w - 8)  left  = cx - CARD_W - 12;
    if (top  + CARD_H > h - 8)  top   = h - CARD_H - 8;
    if (top  < 8)                top   = 8;
    return { left, top };
  })();

  const handleSetLocation = () => {
    if (!selectedCity) return;
    onLocationChange(selectedCity.lat, selectedCity.lng);
    onClose();
  };

  const cityTypeLabel: Record<string, string> = {
    capital: 'Caput provinciae',
    major: 'Urbs magna',
    port: 'Portus',
    fortress: 'Castra legionis',
    colony: 'Colonia',
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-ink/95 backdrop-blur-sm"
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gold-dim/30 shrink-0 bg-ink/90">
        <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold-dim/80">
          Imperium Romanum · 117 CE
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gold-dim/60 hover:text-parchment hover:bg-white/10 transition-colors"
          aria-label="Claudere"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
        />

        {/* City info card */}
        {selectedCity && (
          <div
            className="absolute bg-ink/95 border border-gold-dim/50 rounded-lg shadow-2xl p-3 w-[220px] z-10 animate-fadeIn"
            style={cardStyle as React.CSSProperties}
            onClick={e => e.stopPropagation()}
          >
            <p className="font-serif text-base text-parchment font-bold leading-tight">
              {selectedCity.name}
            </p>
            {selectedCity.modern && (
              <p className="font-body text-xs text-parchment/50 italic mt-0.5">
                {selectedCity.modern}
              </p>
            )}
            <p className="font-serif text-[10px] uppercase tracking-widest text-gold-dim/70 mt-1.5">
              {cityTypeLabel[selectedCity.type] || selectedCity.type}
            </p>
            <p className="font-body text-xs text-parchment/70 mt-0.5">
              {selectedCity.province}
            </p>
            <button
              onClick={handleSetLocation}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded border border-gold-dim/40 bg-gold-leaf/10 hover:bg-gold-leaf/20 active:bg-gold-leaf/30 transition-colors text-parchment font-serif text-xs uppercase tracking-widest"
            >
              <MapPin className="w-3.5 h-3.5 text-gold-leaf" />
              Hic sum
            </button>
          </div>
        )}

        {/* Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-serif text-[10px] text-parchment/30 uppercase tracking-widest pointer-events-none select-none">
          Tange · Volvendo zoomas
        </div>
      </div>
    </div>
  );
};

export default RomanMapCanvas;
