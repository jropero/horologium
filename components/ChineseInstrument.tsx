import React from 'react';
import { fmt } from '../utils/sceneKit';
import './ChineseScene.css';

/**
 * The timepiece at the centre of the Zhongguo hero, on the Leyou plateau.
 *
 * Day: the guibiao 圭表. A gnomon (表) of 8 chi (八尺之表, Zhoubi suanjing;
 * the standard gnomon of Yi Xing's meridian survey of 724–725, Needham, SCC
 * vol. 3, 1959) at the south end of a stone scale (圭) running north, i.e.
 * towards the viewer. The shadow is computed from the sun's real altitude and
 * azimuth: length 8 / tan(alt) chi, pointing away from the sun. At noon it
 * lies along the scale and its tip reads the season (13 chi of scale cover the
 * winter-solstice shadow at Chang'an, ~12.7 chi). Gnomon material and the
 * scale's width are approximate reconstruction.
 *
 * Night: a multi-vessel inflow clepsydra (漏刻). Three supply tanks step down
 * on a stand and drip into the receiving vessel (箭壺), where a float raises
 * the arrow (箭). Inflow clepsydras are attested well before the Tang
 * (Needham, SCC vol. 3); a multi-tier design is traditionally attributed to
 * Lü Cai (呂才) in the early Tang (attribution and page not verified here).
 * Tank count, proportions and the arrow's graduation are approximate
 * reconstruction: the arrow is graduated in the twelve double hours (時辰) and
 * reset at the start of 子 (23:00), so the mark just emerged from the lid is
 * the current shíchén.
 *
 * Geometry (300×200 viewBox): gnomon foot (150, 181); 1 chi = 4.5 units
 * upright, 1.3 units of depth along the scale (foreshortened).
 */

export interface SunPos {
  altitude: number;
  azimuth: number;
}

interface Props {
  uid: string;
  isDay: boolean;
  sun: SunPos | null;
  /** 0–1 through the day counted from the start of 子 (23:00). */
  dayFrac: number;
}

const FOOT_X = 150;
const FOOT_Y = 181;
const CHI = 4.5;
const DEPTH = 1.3;
const GNOMON_CHI = 8;
const SCALE_CHI = 13;

/** Screen position of a point on the ground, `east` and `north` chi from the gnomon foot. */
const ground = (east: number, north: number) => {
  // Nearer the viewer the ground widens a little (perspective).
  const widen = 1 + Math.max(-0.4, north) * 0.035;
  return { x: FOOT_X - east * CHI * widen, y: FOOT_Y + north * DEPTH };
};

/** Tip of the gnomon's shadow, or null when the sun is too low to cast one. */
export const shadowTip = (sun: SunPos) => {
  if (sun.altitude < 0.5) return null;
  const len = Math.min(34, GNOMON_CHI / Math.tan((sun.altitude * Math.PI) / 180));
  const az = (sun.azimuth * Math.PI) / 180;
  const east = -len * Math.sin(az);
  const north = Math.max(-8, -len * Math.cos(az));
  return { ...ground(east, north), len };
};

const scaleEdge = (north: number, side: -1 | 1) => {
  const p = ground(0, north);
  return { x: p.x + side * (3.6 + north * 0.34), y: p.y };
};

/** One chi mark per chi across the scale; every fifth runs edge to edge. */
const SCALE_MARKS = Array.from({ length: SCALE_CHI }, (_, i) => {
  const n = i + 1;
  const l = scaleEdge(n, -1);
  const r = scaleEdge(n, 1);
  const inset = n % 5 === 0 ? 0 : (r.x - l.x) * 0.22;
  return `M${fmt(l.x + inset)} ${fmt(l.y)}L${fmt(r.x - inset)} ${fmt(r.y)}`;
}).join('');

const Guibiao: React.FC<{ uid: string; sun: SunPos | null }> = ({ uid, sun }) => {
  const a = scaleEdge(-0.8, -1);
  const b = scaleEdge(-0.8, 1);
  const c = scaleEdge(SCALE_CHI + 0.4, 1);
  const d = scaleEdge(SCALE_CHI + 0.4, -1);
  const marks = SCALE_MARKS;
  const tip = sun && shadowTip(sun);
  const top = FOOT_Y - GNOMON_CHI * CHI;
  // The face towards the sun is lit (morning sun in the east = screen left).
  const sunLeft = !sun || sun.azimuth < 180;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-gui`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="cs-stone-stop cs-stone-stop--far" />
          <stop offset="100%" className="cs-stone-stop" />
        </linearGradient>
      </defs>
      {/* Stone scale with its front edge. */}
      <path
        d={`M${fmt(a.x)} ${fmt(a.y)}L${fmt(b.x)} ${fmt(b.y)}L${fmt(c.x)} ${fmt(c.y)}L${fmt(d.x)} ${fmt(d.y)}Z`}
        fill={`url(#${uid}-gui)`}
        className="cs-gui"
      />
      <path
        d={`M${fmt(d.x)} ${fmt(d.y)}L${fmt(c.x)} ${fmt(c.y)}L${fmt(c.x)} ${fmt(c.y + 1.6)}L${fmt(d.x)} ${fmt(d.y + 1.6)}Z`}
        className="cs-gui-side"
      />
      <path d={marks} className="cs-gui-marks" />
      {/* Shadow, then the gnomon on its base block. */}
      {tip && (
        <path
          d={`M${FOOT_X - 1.6} ${FOOT_Y}L${FOOT_X + 1.6} ${FOOT_Y}L${fmt(tip.x + 1.2)} ${fmt(tip.y)}L${fmt(tip.x - 1.2)} ${fmt(tip.y)}Z`}
          className="cs-shadow sk-transition"
        />
      )}
      <path
        d={`M${FOOT_X - 4.6} ${FOOT_Y + 0.8}L${FOOT_X + 4.6} ${FOOT_Y + 0.8}L${FOOT_X + 3.6} ${FOOT_Y - 2.2}L${FOOT_X - 3.6} ${FOOT_Y - 2.2}Z`}
        className="cs-gnomon-base"
      />
      <path
        d={`M${FOOT_X - 2} ${FOOT_Y - 2.2}L${FOOT_X} ${FOOT_Y - 2.2}L${FOOT_X} ${top}L${FOOT_X - 1.4} ${top}Z`}
        className={sunLeft ? 'cs-gnomon cs-gnomon--lit' : 'cs-gnomon'}
      />
      <path
        d={`M${FOOT_X} ${FOOT_Y - 2.2}L${FOOT_X + 2} ${FOOT_Y - 2.2}L${FOOT_X + 1.4} ${top}L${FOOT_X} ${top}Z`}
        className={sunLeft ? 'cs-gnomon' : 'cs-gnomon cs-gnomon--lit'}
      />
      <path
        d={`M${FOOT_X - 2.4} ${top}L${FOOT_X + 2.4} ${top}L${FOOT_X + 1.8} ${top - 1.4}L${FOOT_X - 1.8} ${top - 1.4}Z`}
        className="cs-gnomon"
      />
    </g>
  );
};

// ── Clepsydra ────────────────────────────────────────────────────────────────
/** Supply tanks, top to bottom: left, top, width, height. */
const TANKS: [number, number, number, number][] = [
  [113, 131, 15, 9],
  [126, 141, 15, 9],
  [139, 151, 15, 9],
];
// The last tank's drip (x 156.4) falls just inside the receiver's rim.
const RECEIVER = { x: 155.5, top: 157, w: 18, bottom: 185 };
export const ARROW_X = RECEIVER.x + RECEIVER.w / 2;
/** Graduation spacing on the arrow. */
const STEP = 2.4;
const ARROW_REST = 4;

/** Height of the arrow's top and of each of its twelve marks for the day fraction. */
export const arrowMarks = (dayFrac: number) => {
  const f = Math.max(0, Math.min(0.9999, dayFrac));
  const top = RECEIVER.top - ARROW_REST - 12 * STEP * f;
  const marks = Array.from({ length: 12 }, (_, k) => top + ARROW_REST + STEP * k);
  return { top, marks, current: Math.floor(f * 12) };
};

/** Lacquered stand: three stepped shelves on legs (approximate reconstruction). */
const SHELVES: [number, number, number][] = [
  [110, 128.5, 140],
  [124, 141.5, 150],
  [137, 156, 160],
];
const FLOOR = RECEIVER.bottom - 2.4;
const STAND = SHELVES.map(
  ([l, r, y]) =>
    `M${l} ${y}H${r}V${y + 1.3}H${l}Z` +
    `M${l + 1} ${y + 1.3}h1.1V${FLOOR}h-1.1Z` +
    `M${r - 2.1} ${y + 1.3}h1.1V${FLOOR}h-1.1Z`,
).join('');
const STAND_EDGE = SHELVES.map(([l, r, y]) => `M${l} ${y}H${r}`).join('');

const Louke: React.FC<{ uid: string; dayFrac: number }> = ({ uid, dayFrac }) => {
  const { top, marks, current } = arrowMarks(dayFrac);
  const r = RECEIVER;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-bronze`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" className="cs-bronze-stop cs-bronze-stop--dark" />
          <stop offset="38%" className="cs-bronze-stop cs-bronze-stop--light" />
          <stop offset="100%" className="cs-bronze-stop cs-bronze-stop--dark" />
        </linearGradient>
        <clipPath id={`${uid}-arrow`}>
          <rect x={r.x - 4} y="100" width={r.w + 8} height={r.top - 100} />
        </clipPath>
      </defs>
      {/* Low stone base, then the lacquered stepped stand. */}
      <path
        d={`M104 ${r.bottom}L196 ${r.bottom}L193 ${r.bottom - 2.4}L107 ${r.bottom - 2.4}Z`}
        className="cs-plinth"
      />
      <path d={STAND} className="cs-stand" />
      <path d={STAND_EDGE} className="cs-stand-edge" />

      {TANKS.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="0.8"
            fill={`url(#${uid}-bronze)`}
            className="cs-vessel"
          />
          <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry="1.1" className="cs-vessel-rim" />
          <ellipse cx={x + w / 2} cy={y + 0.2} rx={w / 2 - 1} ry="0.7" className="cs-water" />
          <path d={`M${x + 2} ${y + 3}H${x + w - 2}`} className="cs-vessel-band" />
          {/* Spout and the falling drop into the next vessel. */}
          <path d={`M${x + w} ${y + 6}l2.6 -0.6l0 1.1l-2.6 0.5Z`} className="cs-spout" />
          <line
            x1={x + w + 2.4}
            y1={y + 6.3}
            x2={x + w + 2.4}
            y2={y + 10}
            className="cs-trickle"
          />
          <circle
            cx={x + w + 2.4}
            cy={y + 6.8}
            r="0.45"
            className="cs-drop"
            style={{ animationDelay: `${-i * 0.37}s` }}
          />
        </g>
      ))}

      {/* The arrow, rising out of the receiver's lid; marks hidden below the lid. */}
      <g clipPath={`url(#${uid}-arrow)`}>
        <rect
          x={ARROW_X - 0.55}
          y={top}
          width="1.1"
          height={r.top - top + 1}
          className="cs-arrow sk-transition"
        />
        {marks.map((y, k) => (
          <line
            key={k}
            x1={ARROW_X - (k % 3 === 0 ? 1.9 : 1.3)}
            y1={y}
            x2={ARROW_X + (k % 3 === 0 ? 1.9 : 1.3)}
            y2={y}
            className={k === current ? 'cs-arrow-mark cs-arrow-mark--now' : 'cs-arrow-mark'}
          />
        ))}
      </g>
      {/* Receiver vessel with lid. */}
      <rect
        x={r.x}
        y={r.top}
        width={r.w}
        height={r.bottom - 2.4 - r.top}
        rx="1"
        fill={`url(#${uid}-bronze)`}
        className="cs-vessel"
      />
      <ellipse cx={ARROW_X} cy={r.top} rx={r.w / 2 + 0.6} ry="1.4" className="cs-vessel-rim" />
      <path
        d={`M${r.x + 1.5} ${r.top + 4}H${r.x + r.w - 1.5}M${r.x + 1.5} ${r.bottom - 6}H${r.x + r.w - 1.5}`}
        className="cs-vessel-band"
      />
    </g>
  );
};

const ChineseInstrument: React.FC<Props> = ({ uid, isDay, sun, dayFrac }) =>
  isDay ? <Guibiao uid={uid} sun={sun} /> : <Louke uid={uid} dayFrac={dayFrac} />;

export default ChineseInstrument;
