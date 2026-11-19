import React from 'react';
import { SCENE_W, SCENE_X0, moonRotation, seededRandom } from '../utils/sceneKit';
import './SceneKit.css';

/**
 * Sky of the hero scenes: stars with the Milky Way and the Big Dipper, the
 * path of the sun or moon with its twelve hours, and the body itself.
 * Coordinates are the 300×200 viewBox; the path is a half circle of radius 120
 * around (150, 180).
 */

const CX = 150;
const CY = 180;
const R = 120;

const f = (v: number) => Math.round(v * 100) / 100;
const onPath = (angle: number, radius = R) => ({
  x: f(CX + radius * Math.cos(angle)),
  y: f(CY - radius * Math.sin(angle)),
});
/** Angle of the body after `progress` (0–1) of the twelve hours: left → top → right. */
const angleAt = (progress: number) => Math.PI - progress * Math.PI;

// ── Stars (fixed: the same sky every night) ────────────────────────────────
const rand = seededRandom(354);
const STAR_COLORS = ['#ffffff', '#dbe7ff', '#ffe9c4', '#ffffff'];
const FIELD = Array.from({ length: 120 }, () => ({
  x: f(SCENE_X0 + rand() * SCENE_W),
  y: f(rand() * 168),
  r: f(0.18 + rand() * rand() * 0.5),
  o: f(0.35 + rand() * 0.6),
  c: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
}));
// The Milky Way runs from lower left to upper right; its stars crowd the axis.
const BAND = Array.from({ length: 70 }, () => {
  const t = rand();
  return {
    x: f(SCENE_X0 + SCENE_W * t),
    y: f(128 - 104 * t + (rand() - rand()) * 15),
    r: f(0.12 + rand() * 0.22),
    o: f(0.3 + rand() * 0.45),
  };
});
const SPARKS = Array.from({ length: 9 }, () => ({
  x: f(SCENE_X0 + 15 + rand() * (SCENE_W - 30)),
  y: f(8 + rand() * 120),
  s: f(1.3 + rand() * 1.2),
  dur: f(2.6 + rand() * 3),
  delay: f(-rand() * 5),
}));
const sparkle = (s: number) => {
  const q = f(s / 5);
  return `M0 ${-s}Q${q} ${-q} ${s} 0Q${q} ${q} 0 ${s}Q${-q} ${q} ${-s} 0Q${-q} ${-q} 0 ${-s}Z`;
};

/** The Big Dipper: Latin Septentriones ("seven plough oxen"), Greek Ἄρκτος / Ἅμαξα (Il. 18.487), Babylonian MUL.MAR.GÍD.DA "the Wagon" (MUL.APIN). */
const BIG_DIPPER: [number, number][] = [
  [41, 34],
  [49, 30],
  [57, 33],
  [66, 35],
  [69, 42],
  [80, 40],
  [82, 32],
];
const BIG_DIPPER_LINES = 'M41 34L49 30L57 33L66 35L69 42L80 40L82 32L66 35';

// ── Path of the sun / moon: thin arc with a tick per hour ─────────────────
const ARC = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
const TICKS = Array.from({ length: 13 }, (_, i) => {
  const major = i % 3 === 0;
  const a = angleAt(i / 12);
  const inner = onPath(a, R - (major ? 3.6 : 2.2));
  const outer = onPath(a, R + (major ? 3.6 : 2.2));
  return `M${inner.x} ${inner.y}L${outer.x} ${outer.y}`;
}).join('');

const RAYS_LONG = Array.from({ length: 12 }, (_, i) => i * 30);
const RAYS_SHORT = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

interface Props {
  /** Prefix for gradient / clip ids. */
  uid: string;
  isDay: boolean;
  progress: number;
  moonPhase: number;
  /** Bright-limb tilt from `getMoonLimbTilt`; the lit side then faces the real direction. */
  moonTilt?: number;
  starOpacity: number;
  /** Sun near the horizon: warmer disc and glow. */
  golden: boolean;
  /** Weather in front of the sun or moon (`sceneFlags().veil`). */
  veil?: React.CSSProperties;
}

export const Stars: React.FC<{ uid: string; opacity: number }> = ({ uid, opacity }) => (
  <g className="sk-stars" style={{ opacity }}>
    <defs>
      <radialGradient id={`${uid}-milky`}>
        <stop offset="0%" stopColor="#dfe8ff" stopOpacity={0.16} />
        <stop offset="60%" stopColor="#c8d6ff" stopOpacity={0.06} />
        <stop offset="100%" stopColor="#c8d6ff" stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse
      cx="150"
      cy="76"
      rx="200"
      ry="24"
      transform="rotate(-17 150 76)"
      fill={`url(#${uid}-milky)`}
    />
    {BAND.map((s, i) => (
      <circle key={`b${i}`} cx={s.x} cy={s.y} r={s.r} fill="#e6edff" opacity={s.o} />
    ))}
    {FIELD.map((s, i) => (
      <circle key={`f${i}`} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
    ))}
    <path d={BIG_DIPPER_LINES} className="sk-constellation" />
    {BIG_DIPPER.map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#ffffff" />
    ))}
    {SPARKS.map((s, i) => (
      <path
        key={`s${i}`}
        d={sparkle(s.s)}
        transform={`translate(${s.x} ${s.y})`}
        fill="#fff8e1"
        className="sk-twinkle"
        style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
      />
    ))}
  </g>
);

export const HourArc: React.FC<{ isDay: boolean; progress: number }> = ({
  isDay,
  progress,
}) => {
  const hour = Math.min(11, Math.floor(progress * 12));
  const from = onPath(angleAt(hour / 12));
  const to = onPath(angleAt((hour + 1) / 12));
  const now = onPath(angleAt(progress));
  return (
    <g className={`sk-arc ${isDay ? 'sk-arc--day' : 'sk-arc--night'}`}>
      <path d={ARC} className="sk-arc__line" />
      <path d={TICKS} className="sk-arc__ticks" />
      {/* The part already travelled, then the current hour. */}
      <path
        d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${now.x} ${now.y}`}
        className="sk-arc__travelled"
      />
      <path
        d={`M ${from.x} ${from.y} A ${R} ${R} 0 0 1 ${to.x} ${to.y}`}
        className="sk-arc__hour"
      />
    </g>
  );
};

export const Sun: React.FC<{ uid: string; golden: boolean }> = ({ uid, golden }) => {
  const core = golden ? '#fff0d2' : '#fffdf0';
  const mid = golden ? '#ffab5e' : '#f8d766';
  const edge = golden ? '#e0642c' : '#d6a01f';
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-sun-halo`}>
          <stop offset="0%" stopColor={mid} stopOpacity={0.6} />
          <stop offset="32%" stopColor={mid} stopOpacity={0.2} />
          <stop offset="100%" stopColor={mid} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${uid}-sun-disc`} cx="42%" cy="40%" r="62%">
          <stop offset="0%" stopColor={core} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={edge} />
        </radialGradient>
      </defs>
      <circle r="34" fill={`url(#${uid}-sun-halo)`} className="sk-sun__halo" />
      <g className="sk-sun__rays" fill={mid}>
        {RAYS_LONG.map(a => (
          <path key={a} d="M-1.15 -12.6L0 -21.5L1.15 -12.6Z" transform={`rotate(${a})`} />
        ))}
        {RAYS_SHORT.map(a => (
          <path
            key={a}
            d="M-0.8 -12.4L0 -16.8L0.8 -12.4Z"
            transform={`rotate(${a})`}
            opacity="0.75"
          />
        ))}
      </g>
      <circle r="10.4" fill={`url(#${uid}-sun-disc)`} stroke={edge} strokeWidth="0.4" />
      <circle r="7.6" fill="none" stroke={edge} strokeWidth="0.25" opacity="0.45" />
    </g>
  );
};

/**
 * Moon of radius 14 with the lit part cut by the phase (0 = new, 0.5 = full).
 * `tilt` (from `getMoonLimbTilt`) turns the lit side to where the observer sees
 * it; without it the old fixed −15° is kept.
 */
export const Moon: React.FC<{ uid: string; phase: number; tilt?: number }> = ({
  uid,
  phase,
  tilt,
}) => {
  const r = 14;
  const p = ((phase % 1) + 1) % 1;
  const waxing = p <= 0.5;
  // Half-width of the terminator ellipse, and which way it bulges.
  const rx = Math.max(0.1, r * Math.abs(Math.cos(p * Math.PI * 2)));
  const bulge = (p > 0.25 && p <= 0.5) || p > 0.75 ? 1 : 0;
  const lit = `M 0 ${-r} A ${r} ${r} 0 0 ${waxing ? 1 : 0} 0 ${r} A ${f(rx)} ${r} 0 0 ${bulge} 0 ${-r} Z`;
  const illuminated = (1 - Math.cos(p * Math.PI * 2)) / 2;
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-moon-halo`}>
          <stop offset="0%" stopColor="#dfe7ff" stopOpacity={0.5} />
          <stop offset="45%" stopColor="#c9d6ff" stopOpacity={0.14} />
          <stop offset="100%" stopColor="#c9d6ff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${uid}-moon-lit`} cx="38%" cy="36%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f2ead0" />
          <stop offset="100%" stopColor="#c9bd98" />
        </radialGradient>
        <radialGradient id={`${uid}-moon-dark`} cx="38%" cy="36%" r="68%">
          <stop offset="0%" stopColor="#343c57" />
          <stop offset="100%" stopColor="#151a2c" />
        </radialGradient>
        <clipPath id={`${uid}-moon-clip`}>
          <path d={lit} />
        </clipPath>
        <filter id={`${uid}-moon-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>
      <circle r="32" fill={`url(#${uid}-moon-halo)`} opacity={0.25 + 0.75 * illuminated} />
      <g transform={`rotate(${moonRotation(p, tilt)})`}>
        {/* Night side, faintly visible by earthshine. */}
        <circle r={r} fill={`url(#${uid}-moon-dark)`} />
        <g clipPath={`url(#${uid}-moon-clip)`}>
          <g filter={`url(#${uid}-moon-soft)`}>
            <circle r={r} fill={`url(#${uid}-moon-lit)`} />
            {/* Maria */}
            <g fill="#8f8468" opacity="0.42">
              <ellipse cx="-4.6" cy="-4.4" rx="3.6" ry="2.9" />
              <ellipse cx="1.4" cy="-6" rx="2.6" ry="2" />
              <ellipse cx="5.4" cy="-3" rx="2.3" ry="2.8" transform="rotate(24 5.4 -3)" />
              <ellipse cx="-6.6" cy="1.6" rx="2.2" ry="3.4" transform="rotate(-14 -6.6 1.6)" />
              <ellipse cx="2.4" cy="0.6" rx="2.4" ry="1.7" />
              <ellipse cx="6.8" cy="3.4" rx="1.5" ry="1.2" />
            </g>
            {/* Bright ray craters */}
            <circle cx="-1.6" cy="8.2" r="1" fill="#ffffff" opacity="0.55" />
            <circle cx="-8.4" cy="-1.2" r="0.6" fill="#ffffff" opacity="0.45" />
          </g>
        </g>
        <circle r={r} fill="none" stroke="#e3d6b3" strokeWidth="0.35" opacity="0.35" />
      </g>
    </g>
  );
};

const SceneSky: React.FC<Props> = ({
  uid,
  isDay,
  progress,
  moonPhase,
  moonTilt,
  starOpacity,
  golden,
  veil,
}) => {
  const body = onPath(angleAt(progress));
  return (
    <>
      <Stars uid={uid} opacity={starOpacity} />
      <HourArc isDay={isDay} progress={progress} />
      <g transform={`translate(${body.x}, ${body.y})`} style={veil}>
        {isDay ? (
          <Sun uid={uid} golden={golden} />
        ) : (
          <Moon uid={uid} phase={moonPhase} tilt={moonTilt} />
        )}
      </g>
    </>
  );
};

export default SceneSky;
