import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  getProvinceMeta,
  getRomanProvince,
  loadRomanMapData,
  RomanMapData,
} from "../utils/romanProvinces";
import {
  CREATURES,
  CREATURE_ART_PX,
  MapCreature,
  paintCreature,
} from "../utils/romanMapCreatures";

/**
 * Canvas map of the Roman Empire (AD 117) shown in the ProvinciaInfo modal.
 * Plate carrée projection. The canvas keeps the geographic 55:35 aspect ratio and
 * is wider than a phone screen; its container scrolls horizontally with native
 * scrolling, while vertical pan (when zoomed) and zoom are handled here. Layers
 * are fetched at runtime by loadRomanMapData() and turned into Path2D objects
 * once per session.
 */

interface RomanMapCanvasProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  onClose: () => void;
}

// Map window at zoom 1: 55° of longitude × 35° of latitude.
const LNG_MIN = -11;
const LNG_SPAN = 55;
const LAT_MAX = 58;
const LAT_SPAN = 35;
const INITIAL_LNG = 15; // scroll to the Mediterranean on open
const MIN_ZOOM = 1;
const MAX_ZOOM = 40;
const REGIO_ZOOM = 2; // below this, Italy gets one "Italia" label instead of 11 regiones
const CREATURE_ZOOM = 3; // mythological creatures exist only from this zoom on
const CREATURE_FADE = 0.6; // zoom range over which they fade from faint to full
/** On-screen creature size in px: grows a little with zoom. */
const creatureSize = (zoom: number) => 44 + 12 * (zoom - CREATURE_ZOOM);
const MIN_CITIES = 50; // cities shown at minimum zoom; all of them at MAX_ZOOM
const HIT_RADIUS = 16; // px, regardless of the drawn dot size
const CLICK_SLOP = 6; // px of pointer travel before a press stops counting as a tap
const MAX_CANVAS_PIXELS = 16_000_000; // iOS Safari refuses larger canvases

const SEA = "#3a6186";
const RIVER = "rgba(58,97,134,0.8)";
const FORTIFICATION = "rgba(196,120,24,0.95)";
const PROVINCE_LABEL = "rgba(122,84,24,0.8)";
const MARKER = "#d62828";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** Canvas height: most of the modal, capped; the width follows from the geographic ratio. */
const baseHeight = () => Math.round(Math.min(window.innerHeight * 0.82, 600));

interface City {
  latin: string;
  modern: string;
  fortress: boolean;
  lng: number;
  lat: number;
}

interface ProvinceLabel {
  text: string;
  lng: number;
  lat: number;
  regio: boolean;
  widthDeg: number; // province extent, to hide labels that would swamp a tiny province
}

interface Scene {
  provinces: Path2D[];
  lakes: Path2D;
  rivers: Path2D;
  fortifications: Path2D;
  labels: ProvinceLabel[];
  italia: { lng: number; lat: number } | null;
  cities: City[]; // most significant first
}

// Famous cities pinned to the top of the ranking, matched by name near these coordinates.
const SEED_CITIES: [string, number, number][] = [
  ["Roma", 12.5, 41.9],
  ["Alexandria", 29.9, 31.2],
  ["Carthago", 10.3, 36.9],
  ["Antiochia", 36.2, 36.2],
  ["Byzantium", 29.0, 41.0],
  ["Athenae", 23.7, 38.0],
  ["Londinium", -0.1, 51.5],
  ["Lugdunum", 4.8, 45.8],
  ["Ephesos", 27.3, 37.9],
  ["Tarraco", 1.2, 41.1],
  ["Gades", -6.3, 36.5],
  ["Augusta Emerita", -6.3, 38.9],
  ["Massalia", 5.4, 43.3],
  ["Mediolanum", 9.2, 45.5],
  ["Aquileia", 13.4, 45.8],
  ["Augusta Treverorum", 6.6, 49.8],
  ["Eburacum", -1.1, 54.0],
  ["Sirmium", 19.6, 45.0],
  ["Thessalonica", 22.9, 40.6],
  ["Lepcis Magna", 14.3, 32.6],
  ["Syracusae", 15.3, 37.1],
  ["Caesarea", 34.9, 32.5],
  ["Damascus", 36.3, 33.5],
  ["Cyrene", 21.9, 32.8],
];

/**
 * Orders cities by significance: the seeds, then location accuracy (20 m first),
 * and within each accuracy tier by farthest-point sampling, so any prefix of the
 * list is spread evenly over the empire instead of clustering in one province.
 */
const rankCities = (places: RomanMapData["places"]): City[] => {
  const all = places.features
    .filter((f) => {
      const [lng, lat] = f.geometry.coordinates;
      return (
        f.properties.latin &&
        lng >= LNG_MIN &&
        lng <= LNG_MIN + LNG_SPAN &&
        lat <= LAT_MAX &&
        lat >= LAT_MAX - LAT_SPAN
      );
    })
    .map((f) => ({
      city: {
        latin: f.properties.latin!,
        modern: f.properties.modern,
        fortress: f.properties.type === "17",
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
      },
      accuracy: f.properties.accuracy,
    }));
  const used = new Uint8Array(all.length);
  const order: number[] = [];
  const take = (i: number) => {
    used[i] = 1;
    order.push(i);
  };
  const d2 = (i: number, j: number) => {
    const dx = all[i].city.lng - all[j].city.lng,
      dy = all[i].city.lat - all[j].city.lat;
    return dx * dx + dy * dy;
  };

  for (const [name, lng, lat] of SEED_CITIES) {
    const i = all.findIndex(
      (c, k) =>
        !used[k] &&
        c.city.latin === name &&
        Math.abs(c.city.lng - lng) < 2 &&
        Math.abs(c.city.lat - lat) < 2,
    );
    if (i >= 0) take(i);
  }

  const tiers = [...new Set(all.map((c) => c.accuracy))].sort((a, b) => a - b);
  for (const accuracy of tiers) {
    const tier = all
      .map((_, i) => i)
      .filter((i) => !used[i] && all[i].accuracy === accuracy);
    const minD = tier.map((i) =>
      order.reduce((m, j) => Math.min(m, d2(i, j)), Infinity),
    );
    for (let left = tier.length; left > 0; left--) {
      let best = -1;
      for (let k = 0; k < tier.length; k++)
        if (!used[tier[k]] && (best < 0 || minD[k] > minD[best])) best = k;
      const pick = tier[best];
      take(pick);
      for (let k = 0; k < tier.length; k++)
        if (!used[tier[k]]) minD[k] = Math.min(minD[k], d2(tier[k], pick));
    }
  }
  return order.map((i) => all[i].city);
};

const addRing = (path: Path2D, ring: [number, number][]) => {
  ring.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
  path.closePath();
};

const addLine = (path: Path2D, line: [number, number][]) => {
  line.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
};

/** Paths are built in degrees (x = lng, y = lat); draw() maps them with a canvas transform. */
const buildScene = (data: RomanMapData): Scene => {
  const provinces = data.provinces.features.map((f) => {
    const path = new Path2D();
    for (const polygon of f.geometry.coordinates)
      polygon.forEach((ring) => addRing(path, ring));
    return path;
  });
  const extent = new Map(
    data.provinces.features.map((f) => {
      let lo = Infinity,
        hi = -Infinity;
      for (const polygon of f.geometry.coordinates)
        for (const [lng] of polygon[0]) {
          lo = Math.min(lo, lng);
          hi = Math.max(hi, lng);
        }
      return [f.properties.name, hi - lo] as const;
    }),
  );

  const lakes = new Path2D();
  for (const f of data.lakes.features)
    f.geometry.coordinates.forEach((ring) => addRing(lakes, ring));
  const rivers = new Path2D();
  for (const f of data.rivers.features)
    f.geometry.coordinates.forEach((line) => addLine(rivers, line));
  const fortifications = new Path2D();
  for (const f of data.fortifications.features)
    addLine(fortifications, f.geometry.coordinates);

  const labels = data.labels.features.map((f) => {
    const geoName = f.properties.name;
    const regio = /^[IVX]+$/.test(geoName);
    return {
      text: (regio
        ? `Regio ${geoName}`
        : getProvinceMeta(geoName).name
      ).toUpperCase(),
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
      regio,
      widthDeg: extent.get(geoName) ?? 0,
    };
  });
  const regiones = labels.filter((l) => l.regio);
  const italia = regiones.length
    ? {
        lng: regiones.reduce((s, l) => s + l.lng, 0) / regiones.length,
        lat: regiones.reduce((s, l) => s + l.lat, 0) / regiones.length,
      }
    : null;

  return {
    provinces,
    lakes,
    rivers,
    fortifications,
    labels,
    italia,
    cities: rankCities(data.places),
  };
};

// The data is cached in romanProvinces.ts; the derived paths are cached here so a reopen is instant.
let sceneCache: { data: RomanMapData["provinces"]; scene: Scene } | null = null;
const getScene = (data: RomanMapData) => {
  if (sceneCache?.data !== data.provinces)
    sceneCache = { data: data.provinces, scene: buildScene(data) };
  return sceneCache.scene;
};

/** Visible city count grows geometrically from MIN_CITIES at zoom 1 to all at MAX_ZOOM. */
const visibleCityCount = (zoom: number, total: number) =>
  Math.min(
    total,
    Math.round(
      MIN_CITIES *
        Math.pow(total / MIN_CITIES, (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)),
    ),
  );

const readColors = () => {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  return {
    ink: v("--ink", "#1a1a1a"),
    parchment: v("--parchment", "#e3d6b3"),
    goldDim: v("--gold-dim", "#a09040"),
    goldLeaf: v("--gold-leaf", "#cfb53b"),
  };
};

type Status = "loading" | "ready" | "error";

type Selection =
  | { kind: "city"; city: City }
  | { kind: "creature"; creature: MapCreature };
const selectionPoint = (s: Selection) =>
  s.kind === "city" ? s.city : s.creature;

const RomanMapCanvas: React.FC<RomanMapCanvasProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<Scene | null>(null);
  const colorsRef = useRef(readColors());
  const baseHRef = useRef(baseHeight());
  const zoomRef = useRef(MIN_ZOOM);
  const panYRef = useRef(0); // px scrolled down from LAT_MAX (only non-zero when zoomed)
  const dprRef = useRef(1);
  const frameRef = useRef<number | null>(null);
  const zoomFrameRef = useRef<number | null>(null);
  const pendingZoomRef = useRef<{ zoom: number; x: number; y: number } | null>(
    null,
  );
  const hitsRef = useRef<{ city: City; x: number; y: number }[]>([]);
  const creatureLayerRef = useRef<HTMLDivElement>(null);
  const creatureElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const creatureHitsRef = useRef<
    { creature: MapCreature; x: number; y: number; r: number }[]
  >([]);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const userRef = useRef({ lat: latitude, lng: longitude });
  userRef.current = { lat: latitude, lng: longitude };

  const [status, setStatus] = useState<Status>("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM); // mirrors zoomRef for the zoom buttons
  const [selected, setSelected] = useState<Selection | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const scale = () => (baseHRef.current / LAT_SPAN) * zoomRef.current; // px per degree
  const canvasSize = () => ({
    w: Math.round(LNG_SPAN * scale()),
    h: baseHRef.current,
  });

  const draw = useCallback(() => {
    frameRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = canvasSize();
    const s = scale();
    const z = zoomRef.current;
    const panY = panYRef.current;
    const dpr = dprRef.current;
    const colors = colorsRef.current;
    const xOf = (lng: number) => (lng - LNG_MIN) * s;
    const yOf = (lat: number) => (LAT_MAX - lat) * s - panY;

    // 1. Sea.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = SEA;
    ctx.fillRect(0, 0, w, h);

    const scene = sceneRef.current;
    const hits: { city: City; x: number; y: number }[] = [];
    if (scene) {
      // Geographic layers in degree space; line widths and dashes are divided by s to stay in px.
      ctx.setTransform(
        dpr * s,
        0,
        0,
        -dpr * s,
        -dpr * s * LNG_MIN,
        dpr * (LAT_MAX * s - panY),
      );
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // 2. Land.
      ctx.fillStyle = colors.parchment;
      for (const p of scene.provinces) ctx.fill(p, "evenodd");
      // 3. Lakes.
      ctx.fillStyle = SEA;
      ctx.fill(scene.lakes, "evenodd");
      // 4. Rivers.
      ctx.strokeStyle = RIVER;
      ctx.lineWidth = (0.5 + 0.2 * z) / s;
      ctx.stroke(scene.rivers);
      // 5. Fortifications.
      ctx.strokeStyle = FORTIFICATION;
      ctx.lineWidth = 1.5 / s;
      ctx.setLineDash([4 / s, 3 / s]);
      ctx.stroke(scene.fortifications);
      ctx.setLineDash([]);
      // 6. Province borders.
      ctx.strokeStyle = colors.goldDim;
      ctx.lineWidth = 0.9 / s;
      for (const p of scene.provinces) ctx.stroke(p);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 7. Province labels.
      const fontPx = Math.round(Math.min(18, 9 + 3 * (z - 1)));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = PROVINCE_LABEL;
      for (const l of scene.labels) {
        if (l.regio && z < REGIO_ZOOM) continue;
        ctx.font = `${
          l.regio ? Math.round(fontPx * 0.8) : fontPx
        }px Cinzel, serif`;
        if (z < 3 && l.widthDeg * s < ctx.measureText(l.text).width * 0.5)
          continue;
        ctx.fillText(l.text, xOf(l.lng), yOf(l.lat));
      }
      if (z < REGIO_ZOOM && scene.italia) {
        ctx.font = `${fontPx}px Cinzel, serif`;
        ctx.fillText("ITALIA", xOf(scene.italia.lng), yOf(scene.italia.lat));
      }

      // 8. Cities: filled circles for towns, hollow squares for legionary fortresses.
      const n = visibleCityCount(z, scene.cities.length);
      const r = 1.6 + 0.35 * z;
      const towns = new Path2D();
      const forts = new Path2D();
      for (let i = 0; i < n; i++) {
        const city = scene.cities[i];
        const x = xOf(city.lng),
          y = yOf(city.lat);
        if (y < -HIT_RADIUS || y > h + HIT_RADIUS) continue;
        hits.push({ city, x, y });
        if (city.fortress) forts.rect(x - r, y - r, r * 2, r * 2);
        else {
          towns.moveTo(x + r, y);
          towns.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = colors.ink;
      ctx.fill(towns);
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1.2;
      ctx.stroke(forts);

      // Names for the most significant visible cities, with a parchment halo.
      const named = Math.min(hits.length, Math.round(16 * z * z));
      ctx.font = `${Math.round(9 + z)}px Cinzel, serif`;
      ctx.textBaseline = "bottom";
      ctx.lineWidth = 3;
      ctx.strokeStyle = colors.parchment;
      ctx.fillStyle = colors.ink;
      for (let i = 0; i < named; i++) {
        const { city, x, y } = hits[i];
        ctx.strokeText(city.latin, x, y - r - 2);
        ctx.fillText(city.latin, x, y - r - 2);
      }

      const sel = selectedRef.current;
      if (sel?.kind === "city") {
        ctx.strokeStyle = colors.goldLeaf;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xOf(sel.city.lng), yOf(sel.city.lat), r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    hitsRef.current = hits;

    // Creatures: a DOM layer mounted only from CREATURE_ZOOM (its idle motion is CSS),
    // positioned here like the location pulse.
    const creatureHits: {
      creature: MapCreature;
      x: number;
      y: number;
      r: number;
    }[] = [];
    const layer = creatureLayerRef.current;
    if (layer && z >= CREATURE_ZOOM) {
      layer.style.opacity = String(
        0.25 + 0.75 * clamp((z - CREATURE_ZOOM) / CREATURE_FADE, 0, 1),
      );
      const size = creatureSize(z);
      CREATURES.forEach((creature, i) => {
        const el = creatureElsRef.current[i];
        if (!el) return;
        const x = xOf(creature.lng),
          y = yOf(creature.lat);
        const onCanvas = y > -size && y < h + size;
        el.style.visibility = onCanvas ? "visible" : "hidden";
        el.style.transform = `translate(${x - CREATURE_ART_PX / 2}px, ${
          y - CREATURE_ART_PX / 2
        }px) scale(${size / CREATURE_ART_PX})`;
        if (onCanvas)
          creatureHits.push({
            creature,
            x,
            y,
            r: Math.max(HIT_RADIUS, size * 0.45),
          });
      });
    }
    creatureHitsRef.current = creatureHits;

    // 9. Current location: crosshair here, pulse as a CSS-animated element.
    const ux = xOf(userRef.current.lng),
      uy = yOf(userRef.current.lat);
    const userVisible = ux >= 0 && ux <= w && uy >= 0 && uy <= h;
    if (userVisible) {
      ctx.strokeStyle = MARKER;
      ctx.fillStyle = MARKER;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ux, uy, 6, 0, Math.PI * 2);
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        ctx.moveTo(ux + dx * 8, uy + dy * 8);
        ctx.lineTo(ux + dx * 13, uy + dy * 13);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ux, uy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    const marker = markerRef.current;
    if (marker) {
      marker.style.display = userVisible ? "block" : "none";
      marker.style.transform = `translate(${ux}px, ${uy}px)`;
    }

    // Keep the card attached to its dot or creature (it lives in the canvas wrapper, so horizontal scroll is free).
    const card = cardRef.current;
    const sel = selectedRef.current;
    if (card && sel) {
      const p = selectionPoint(sel);
      const gap = sel.kind === "creature" ? creatureSize(z) / 2 + 2 : 14;
      const x = clamp(
        xOf(p.lng),
        card.offsetWidth / 2 + 4,
        w - card.offsetWidth / 2 - 4,
      );
      const y = yOf(p.lat);
      const above = y - card.offsetHeight - gap - 4 >= 0;
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.transform = above
        ? `translate(-50%, calc(-100% - ${gap}px))`
        : `translate(-50%, ${gap}px)`;
    }
  }, []);

  const scheduleDraw = useCallback(() => {
    if (frameRef.current === null)
      frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  /** Resizes the canvas for the current zoom and redraws at once (a resize clears the backing store). */
  const applySize = useCallback(() => {
    const container = containerRef.current,
      wrapper = wrapperRef.current,
      canvas = canvasRef.current;
    if (!container || !wrapper || !canvas) return;
    const { w, h } = canvasSize();
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2,
      Math.sqrt(MAX_CANVAS_PIXELS / (w * h)),
    );
    dprRef.current = dpr;
    wrapper.style.width = `${w}px`;
    wrapper.style.height = `${h}px`;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // Desktop: no scrollbar when the whole map fits.
    container.style.scrollbarWidth =
      w <= container.clientWidth ? "none" : "thin";
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    draw();
  }, [draw]);

  /** Zooms keeping the map point under (clientX, clientY) fixed on screen. */
  const zoomAt = useCallback(
    (target: number, clientX: number, clientY: number) => {
      const container = containerRef.current,
        canvas = canvasRef.current;
      if (!container || !canvas) return;
      const z = clamp(target, MIN_ZOOM, MAX_ZOOM);
      if (Math.abs(z - zoomRef.current) < 1e-3) return;
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left,
        py = clientY - rect.top;
      const s0 = scale();
      const lng = px / s0 + LNG_MIN;
      const degFromTop = (py + panYRef.current) / s0;

      zoomRef.current = z;
      const s1 = scale();
      panYRef.current = clamp(
        degFromTop * s1 - py,
        0,
        baseHRef.current * (z - 1),
      );
      applySize();
      const margin = Math.max(0, (container.clientWidth - canvasSize().w) / 2);
      container.scrollLeft =
        margin +
        (lng - LNG_MIN) * s1 -
        (clientX - container.getBoundingClientRect().left);
      setZoom(z);
      if (z < CREATURE_ZOOM && selectedRef.current?.kind === "creature")
        setSelected(null);
    },
    [applySize],
  );

  /** The zoom the map is heading to, including a request not yet applied this frame. */
  const targetZoom = () => pendingZoomRef.current?.zoom ?? zoomRef.current;

  /** Coalesces pinch / wheel zoom requests to one resize per frame. */
  const requestZoom = useCallback(
    (zoom: number, x: number, y: number) => {
      pendingZoomRef.current = { zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM), x, y };
      if (zoomFrameRef.current !== null) return;
      zoomFrameRef.current = requestAnimationFrame(() => {
        zoomFrameRef.current = null;
        const p = pendingZoomRef.current;
        pendingZoomRef.current = null;
        if (p) zoomAt(p.zoom, p.x, p.y);
      });
    },
    [zoomAt],
  );

  const zoomButton = (factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect)
      requestZoom(
        targetZoom() * factor,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
  };

  // Initial layout, centred on the Mediterranean.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    applySize();
    const margin = Math.max(0, (container.clientWidth - canvasSize().w) / 2);
    container.scrollLeft =
      margin + (INITIAL_LNG - LNG_MIN) * scale() - container.clientWidth / 2;
  }, [applySize]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadRomanMapData()
      .then((data) => {
        if (cancelled) return;
        sceneRef.current = getScene(data);
        setStatus("ready");
        scheduleDraw();
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt, scheduleDraw]);

  useEffect(() => {
    const onResize = () => {
      baseHRef.current = baseHeight();
      panYRef.current = clamp(
        panYRef.current,
        0,
        baseHRef.current * (zoomRef.current - 1),
      );
      applySize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applySize]);

  // Wheel / trackpad pinch zooms; horizontal wheel deltas keep scrolling natively.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      requestZoom(
        targetZoom() * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
        e.clientX,
        e.clientY,
      );
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [requestZoom]);

  // Escape closes an open city card first. Capture phase, so it runs before the modal's
  // own Escape handler, which skips events marked defaultPrevented.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !selectedRef.current) return;
      e.preventDefault();
      setSelected(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const creaturesShown = status === "ready" && zoom >= CREATURE_ZOOM;

  // Draw synchronously when the card opens (or the creature layer mounts) so nothing
  // shows at its unpositioned origin.
  useLayoutEffect(() => {
    draw();
  }, [selected, latitude, longitude, creaturesShown, draw]);

  useEffect(() => {
    document.fonts?.ready.then(() => scheduleDraw());
  }, [scheduleDraw]);

  useEffect(
    () => () => {
      // Reset the refs too: StrictMode re-runs effects, and a stale frame id would
      // make scheduleDraw think a frame is still pending.
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (zoomFrameRef.current !== null)
        cancelAnimationFrame(zoomFrameRef.current);
      frameRef.current = null;
      zoomFrameRef.current = null;
    },
    [],
  );

  const tapAt = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = clientX - rect.left,
      py = clientY - rect.top;
    // Distances are relative to each target's hit radius, so a tap on a creature's body
    // beats a city dot at its edge, while a tap right on a dot still picks the city.
    let best: Selection | null = null;
    let bestD = 1;
    for (const { city, x, y } of hitsRef.current) {
      const d = ((x - px) ** 2 + (y - py) ** 2) / (HIT_RADIUS * HIT_RADIUS);
      if (d <= bestD) {
        bestD = d;
        best = { kind: "city", city };
      }
    }
    for (const { creature, x, y, r } of creatureHitsRef.current) {
      const d = ((x - px) ** 2 + (y - py) ** 2) / (r * r);
      if (d <= bestD) {
        bestD = d;
        best = { kind: "creature", creature };
      }
    }
    setSelected(best);
  };

  const pinchMetrics = () => {
    const [a, b] = [...pointersRef.current.values()];
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      gestureRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    } else if (pointersRef.current.size === 2) {
      if (gestureRef.current) gestureRef.current.moved = true;
      pinchRef.current = { dist: pinchMetrics().dist, zoom: zoomRef.current };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointersRef.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x,
      dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    const pinch = pinchRef.current;
    if (pinch && pointersRef.current.size >= 2) {
      const m = pinchMetrics();
      if (pinch.dist > 0)
        requestZoom((pinch.zoom * m.dist) / pinch.dist, m.x, m.y);
      return;
    }
    const g = gestureRef.current;
    if (!g) return;
    if (
      !g.moved &&
      Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > CLICK_SLOP
    )
      g.moved = true;
    // Mouse drags pan both ways; on touch the browser pans horizontally itself
    // (touch-action: pan-x) and only vertical drags reach this handler.
    const container = containerRef.current;
    if (container && dx) container.scrollLeft -= dx;
    const panY = clamp(
      panYRef.current - dy,
      0,
      baseHRef.current * (zoomRef.current - 1),
    );
    if (panY !== panYRef.current) {
      panYRef.current = panY;
      scheduleDraw();
    }
  };

  const endPointer = (
    e: React.PointerEvent<HTMLCanvasElement>,
    cancelled: boolean,
  ) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const tap =
      !cancelled &&
      pointersRef.current.size === 1 &&
      gestureRef.current &&
      !gestureRef.current.moved;
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) gestureRef.current = null;
    if (tap) tapAt(e.clientX, e.clientY);
  };

  const province =
    selected?.kind === "city"
      ? getRomanProvince(selected.city.lat, selected.city.lng)
      : null;

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-sm border border-gold-dim/40"
        // pan-x: native horizontal scrolling pans east–west; vertical drags and pinches come to the canvas.
        style={
          {
            touchAction: "pan-x",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties
        }
      >
        <div ref={wrapperRef} className="relative mx-auto">
          <canvas
            ref={canvasRef}
            className="block select-none cursor-grab active:cursor-grabbing"
            role="img"
            aria-label="Mapa del Imperio Romano — toque una ciudad para elegirla como ubicación"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endPointer(e, false)}
            onPointerCancel={(e) => endPointer(e, true)}
          />
          {creaturesShown && (
            <div
              ref={creatureLayerRef}
              className="absolute inset-0 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              {CREATURES.map((creature, i) => (
                <div
                  key={creature.key}
                  ref={(el) => {
                    creatureElsRef.current[i] = el;
                  }}
                  className="absolute left-0 top-0"
                  style={{
                    width: CREATURE_ART_PX,
                    height: CREATURE_ART_PX,
                    transformOrigin: "50% 50%",
                  }}
                >
                  <canvas
                    ref={(el) => {
                      if (el && !el.dataset.painted) {
                        paintCreature(el, creature);
                        el.dataset.painted = "1";
                      }
                    }}
                    className={`block ${
                      creature.sea ? "creature-bob" : "creature-breathe"
                    }`}
                    // Staggered so the creatures never move in step.
                    style={{
                      width: "100%",
                      height: "100%",
                      animationDuration: `${5 + (i % 4) * 0.9}s`,
                      animationDelay: `${-i * 0.73}s`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div
            ref={markerRef}
            className="absolute left-0 top-0 pointer-events-none"
            style={{ display: "none" }}
          >
            <span
              className="absolute -left-3 -top-3 w-6 h-6 rounded-full border-2 animate-ping"
              style={{ borderColor: MARKER }}
            />
          </div>

          {status !== "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <span className="font-body italic text-lg text-parchment/80">
                {status === "loading"
                  ? "Desplegando el mapa del Imperio…"
                  : "No se pudo cargar el mapa."}
              </span>
              {status === "error" && (
                <button
                  type="button"
                  onClick={() => setLoadAttempt((n) => n + 1)}
                  className="pointer-events-auto font-serif text-xs uppercase tracking-[0.25em] px-4 py-2 border border-gold-dim/60 text-gold-leaf hover:bg-gold-leaf/10 rounded-sm"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {selected && (
            <div
              ref={cardRef}
              className="absolute z-10 w-60 p-3 rounded-sm border border-gold-dim/60 bg-ink/95 shadow-2xl"
              style={{ left: 0, top: 0 }}
              role="dialog"
              aria-label={
                selected.kind === "city"
                  ? selected.city.latin
                  : selected.creature.name
              }
            >
              {selected.kind === "city" ? (
                <>
                  <div className="font-serif text-xl font-bold text-gold-leaf leading-tight">
                    {selected.city.latin}
                  </div>
                  <div className="font-body italic text-base text-parchment/80 leading-snug">
                    {selected.city.modern}
                  </div>
                  <div className="font-body text-sm text-parchment/60 mt-1">
                    {selected.city.fortress ? "Castra" : "Urbs"}
                    {province ? ` · ${province.name}` : ""}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLocationChange(selected.city.lat, selected.city.lng);
                      onClose();
                    }}
                    className="mt-3 w-full font-serif text-xs uppercase tracking-[0.2em] px-3 py-2 rounded-sm border border-gold-leaf/60 text-gold-leaf hover:bg-gold-leaf/10"
                  >
                    Fijar como mi ubicación
                  </button>
                </>
              ) : (
                <>
                  <div className="font-serif text-lg font-bold tracking-[0.12em] text-gold-leaf leading-tight">
                    {selected.creature.name}
                  </div>
                  <div className="font-body italic text-base text-parchment/85 leading-snug mt-1">
                    {selected.creature.desc}
                  </div>
                  <div className="font-body text-sm text-parchment/50 mt-1">
                    {selected.creature.source}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <span className="font-body italic text-sm text-parchment/50 leading-tight">
          Imperium Romanum, 117 d. C. · Datos: Digital Atlas of the Roman Empire
          (DARE), vía klokantech/roman-empire
        </span>
        <div className="flex gap-2 shrink-0">
          {(
            [
              [1 / 1.5, "−", "Alejar", zoom <= MIN_ZOOM],
              [1.5, "+", "Acercar", zoom >= MAX_ZOOM],
            ] as const
          ).map(([factor, glyph, label, disabled]) => (
            <button
              key={glyph}
              type="button"
              onClick={() => zoomButton(factor)}
              disabled={disabled}
              aria-label={label}
              title={label}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gold-dim/50 text-gold-leaf text-lg leading-none hover:bg-gold-leaf/10 disabled:opacity-30"
            >
              {glyph}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RomanMapCanvas;
