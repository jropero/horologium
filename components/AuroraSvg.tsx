import React, { useId } from 'react';

/**
 * Aurora borealis drawn into a 300×200 weather viewBox. Shown when there is no
 * weather data (offline, failed fetch, or a fetch slower than 1 s).
 *
 * Each curtain is a ribbon with a sinuous lower edge that ripples sideways
 * (SMIL morph of `d`), tapered tips and a top that fades to transparent. Rays
 * are a thick dashed stroke along the lower edge: every dash is a bar
 * perpendicular to the curve, so the rays follow the folds. Far curtains are
 * higher, dimmer and slower; near ones are brighter, faster and sway more.
 * Hue: red and blue curtains keep their colour; the green ones cycle
 * green → teal → violet → rose and back over HUE_CYCLE_S.
 *
 * On top of that: surges (a band of brighter colour runs along the rays of each
 * curtain every few seconds), pulsating patches below the arcs, a breathing
 * airglow over the horizon, and an occasional meteor. One small Gaussian blur
 * over the curtain group softens their outlines and ray stripes; everything
 * else is gradient-filled paths.
 */

interface Wave {
  amp: number;
  freq: number;
  speed: number;
  offset: number;
}

interface Curtain {
  x0: number;
  x1: number;
  /** Mean y of the lower edge. */
  base: number;
  /** Peak ribbon height at the middle of the curtain. */
  height: number;
  waves: Wave[];
  rayLen: number;
  rayDash: string;
  opacity: number;
  morphS: number;
  swayS: number;
  swayX: number;
  swaySkew: number;
  /** Fixed colours, or `null` to follow the shared hue cycle. */
  colors: { top: string; main: string; bright: string } | null;
  /** Colour of the ribbon top for hue-cycling curtains (e.g. a red fringe). */
  fringe?: string;
  hueBegin?: number;
  /**
   * Auroral surge: a band of the curtain's own bright colour (no white core) that runs along the rays and lower edge.
   * `dur` = full cycle (the band is visible for SURGE_ACTIVE of it), `dir` = 1 left→right.
   */
  surge?: { dur: number; begin: number; dir: 1 | -1 };
}

const HUE_CYCLE_S = 240;
const HUE_KEY_TIMES = '0;0.3;0.42;0.52;0.6;0.68;0.8;1';
// Ping-pong through violet so green → rose never interpolates through grey.
const HUE_MAIN = '#10b981;#10b981;#14b8a6;#8b5cf6;#e11d48;#8b5cf6;#14b8a6;#10b981';
const HUE_BRIGHT = '#6ee7b7;#6ee7b7;#5eead4;#c4b5fd;#fda4af;#c4b5fd;#5eead4;#6ee7b7';

// Back to front: far curtains first.
const CURTAINS: Curtain[] = [
  {
    // high red — real aurora is red above the green band
    x0: -40,
    x1: 340,
    base: 50,
    height: 34,
    rayLen: 22,
    rayDash: '0.7 3.1 1.4 4.6 0.5 2.4 1.9 5.2',
    waves: [
      { amp: 5, freq: 1.1, speed: 1, offset: 0.3 },
      { amp: 2.2, freq: 2.6, speed: -1, offset: 1.7 },
    ],
    opacity: 0.34,
    morphS: 27,
    swayS: 37,
    swayX: 3,
    swaySkew: 0.8,
    colors: { top: '#be123c', main: '#e11d48', bright: '#fb7185' },
  },
  {
    // blue, right half
    x0: 70,
    x1: 360,
    base: 70,
    height: 40,
    rayLen: 26,
    rayDash: '0.9 2.7 1.6 3.9 0.6 3.3 2.1 4.4',
    waves: [
      { amp: 6, freq: 1.3, speed: -1, offset: 2.1 },
      { amp: 2.5, freq: 3.1, speed: 1, offset: 0.4 },
    ],
    opacity: 0.4,
    morphS: 22,
    swayS: 31,
    swayX: 4,
    swaySkew: 1,
    colors: { top: '#4338ca', main: '#6366f1', bright: '#93c5fd' },
    surge: { dur: 17, begin: -9, dir: -1 },
  },
  {
    // mid teal-green, left
    x0: -70,
    x1: 220,
    base: 92,
    height: 52,
    rayLen: 32,
    rayDash: '1 2.4 1.8 3.6 0.6 2 2.4 4.2',
    waves: [
      { amp: 8, freq: 1.4, speed: 1, offset: 1.1 },
      { amp: 3, freq: 3.4, speed: -1, offset: 2.6 },
    ],
    opacity: 0.55,
    morphS: 17,
    swayS: 23,
    swayX: 7,
    swaySkew: 1.6,
    colors: null,
    fringe: '#0e7490',
    hueBegin: -40,
    surge: { dur: 13, begin: -4, dir: 1 },
  },
  {
    // mid green, right
    x0: 40,
    x1: 350,
    base: 104,
    height: 60,
    rayLen: 36,
    rayDash: '0.8 2.2 2 3.2 0.6 1.8 1.4 3.8',
    waves: [
      { amp: 9, freq: 1.2, speed: -1, offset: 0.2 },
      { amp: 3.5, freq: 2.9, speed: 1, offset: 1.4 },
    ],
    opacity: 0.62,
    morphS: 14,
    swayS: 19,
    swayX: 8,
    swaySkew: 2,
    colors: null,
    fringe: '#047857',
    surge: { dur: 11, begin: -1, dir: -1 },
  },
  {
    // near bright green with a pink top fringe
    x0: -60,
    x1: 360,
    base: 122,
    height: 76,
    rayLen: 46,
    rayDash: '1.2 2 2.4 3 0.7 1.6 1.8 3.6',
    waves: [
      { amp: 11, freq: 1.5, speed: 1, offset: 2.4 },
      { amp: 4, freq: 3.7, speed: -2, offset: 0.9 },
    ],
    opacity: 0.82,
    morphS: 10,
    swayS: 13,
    swayX: 12,
    swaySkew: 2.6,
    colors: null,
    fringe: '#f472b6',
    surge: { dur: 9, begin: -6, dir: 1 },
  },
];

/** Blur of the curtain group in viewBox units; hides the hard outlines and ray stripes. */
const CURTAIN_BLUR = 1.2;

/** Share of each surge cycle in which the band is crossing; the rest is quiet. */
const SURGE_ACTIVE = 0.55;
/** Width of the surge band in viewBox units. */
const SURGE_W = 110;

/**
 * Pulsating aurora: diffuse patches below the arcs that blink on and off
 * irregularly (seconds-scale), as seen after a substorm breakup.
 */
const PATCHES = [
  { cx: 48, cy: 142, rx: 22, ry: 7, dur: 6.3, begin: -1.2 },
  { cx: 112, cy: 152, rx: 16, ry: 5, dur: 4.7, begin: -3.1 },
  { cx: 176, cy: 138, rx: 26, ry: 8, dur: 7.9, begin: -0.4 },
  { cx: 238, cy: 150, rx: 18, ry: 6, dur: 5.4, begin: -2.6 },
  { cx: 282, cy: 136, rx: 14, ry: 5, dur: 8.6, begin: -5.3 },
];
const PATCH_VALUES = '0;0;0.85;0.25;0.7;0;0;0';
const PATCH_TIMES = '0;0.38;0.44;0.5;0.56;0.66;0.9;1';

/** Meteors: start point, angle (deg, 0 = rightwards), travel, cycle and delay (s). */
const METEORS = [
  { x: 40, y: 18, angle: 24, dist: 120, dur: 19, delay: 6 },
  { x: 270, y: 30, angle: 152, dist: 95, dur: 27, delay: 15 },
];

/** Multiplies every motion duration (morph, sway, ray drift); 2 = half speed. */
const MOTION_SLOWDOWN = 2;

const SAMPLES = 28;
const FRAMES = 6;

const round = (n: number) => Math.round(n * 10) / 10;

/** Quadratic midpoint smoothing; command structure is constant so SMIL can morph it. */
const smooth = (pts: [number, number][], move: boolean): string => {
  const mid = (a: [number, number], b: [number, number]) =>
    `${round((a[0] + b[0]) / 2)} ${round((a[1] + b[1]) / 2)}`;
  let d = `${move ? 'M' : 'L'} ${round(pts[0][0])} ${round(pts[0][1])} L ${mid(
    pts[0],
    pts[1],
  )}`;
  for (let i = 1; i < pts.length - 1; i++)
    d += ` Q ${round(pts[i][0])} ${round(pts[i][1])} ${mid(pts[i], pts[i + 1])}`;
  const last = pts[pts.length - 1];
  return `${d} L ${round(last[0])} ${round(last[1])}`;
};

const edges = (c: Curtain, phase: number) => {
  const bottom: [number, number][] = [];
  const top: [number, number][] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1);
    const x = c.x0 + (c.x1 - c.x0) * t;
    let y = c.base;
    for (const w of c.waves)
      y += w.amp * Math.sin(2 * Math.PI * w.freq * t + w.speed * phase + w.offset);
    // Tapered tips; the top edge has fine "fingers" that read as rays once the gradient fades them.
    const envelope = Math.pow(Math.sin(Math.PI * t), 0.7);
    const h =
      c.height *
      envelope *
      (0.78 +
        0.16 * Math.sin(2 * Math.PI * 1.3 * t - phase + c.base) +
        0.06 * Math.sin(2 * Math.PI * 9 * t + 2 * phase));
    bottom.push([x, y]);
    top.push([x, y - h]);
  }
  return { bottom, top };
};

const frames = (build: (phase: number) => string) => {
  const out: string[] = [];
  for (let k = 0; k <= FRAMES; k++) out.push(build((2 * Math.PI * (k % FRAMES)) / FRAMES));
  return out.join(';');
};

// Geometry is static — compute once per module load.
const GEOMETRY = CURTAINS.map(c => ({
  body: frames(phase => {
    const { bottom, top } = edges(c, phase);
    return `${smooth(bottom, true)} ${smooth(top.reverse(), false)} Z`;
  }),
  rays: frames(phase =>
    smooth(
      edges(c, phase).bottom.map(([x, y]) => [x, y - c.rayLen / 2]),
      true,
    ),
  ),
  rayTop: c.base - c.waves.reduce((s, w) => s + w.amp, 0) - c.rayLen,
  rayBottom: c.base + c.waves.reduce((s, w) => s + w.amp, 0),
}));

const Stop: React.FC<{
  offset: string;
  color: string;
  opacity: number;
  cycle?: string;
  begin?: number;
}> = ({ offset, color, opacity, cycle, begin = 0 }) => (
  <stop offset={offset} stopColor={color} stopOpacity={opacity}>
    {cycle && (
      <animate
        attributeName="stop-color"
        values={cycle}
        keyTimes={HUE_KEY_TIMES}
        dur={`${HUE_CYCLE_S}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
    )}
  </stop>
);

const AuroraSvg: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string, i?: number) => `aurora-${uid}-${name}${i ?? ''}`;

  return (
    <g className={className} style={style}>
      <defs>
        <radialGradient id={id('glow')} cx="0.5" cy="0.15" r="0.75">
          <Stop offset="0%" color="#10b981" opacity={0.16} cycle={HUE_MAIN} />
          <Stop offset="100%" color="#10b981" opacity={0} cycle={HUE_MAIN} />
        </radialGradient>
        {/* Light the curtains throw onto the lower sky, behind the skyline. */}
        <radialGradient id={id('airglow')}>
          <Stop offset="0%" color="#34d399" opacity={0.34} cycle={HUE_MAIN} />
          <Stop offset="55%" color="#10b981" opacity={0.12} cycle={HUE_MAIN} />
          <Stop offset="100%" color="#10b981" opacity={0} cycle={HUE_MAIN} />
        </radialGradient>
        <radialGradient id={id('patch')}>
          <Stop offset="0%" color="#6ee7b7" opacity={0.5} cycle={HUE_BRIGHT} />
          <Stop offset="100%" color="#10b981" opacity={0} cycle={HUE_MAIN} />
        </radialGradient>
        {/* Meteor tail: userSpaceOnUse in the meteor's own (moving, rotated) frame. */}
        <linearGradient
          id={id('meteor')}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="-30"
          y2="0"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="30%" stopColor="#d1fae5" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity={0} />
        </linearGradient>
        {CURTAINS.map((c, i) => {
          if (!c.surge) return null;
          const bright = c.colors?.bright ?? '#a7f3d0';
          const brightCycle = c.colors ? undefined : HUE_BRIGHT;
          const from = c.surge.dir === 1 ? c.x0 - SURGE_W : c.x1;
          const to = c.surge.dir === 1 ? c.x1 : c.x0 - SURGE_W;
          return (
            <linearGradient
              key={`surge-${i}`}
              id={id('surge', i)}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={SURGE_W}
              y2="0"
            >
              <Stop offset="0%" color={bright} opacity={0} cycle={brightCycle} />
              <Stop offset="35%" color={bright} opacity={0.35} cycle={brightCycle} />
              <Stop offset="50%" color={bright} opacity={0.7} cycle={brightCycle} />
              <Stop offset="65%" color={bright} opacity={0.35} cycle={brightCycle} />
              <Stop offset="100%" color={bright} opacity={0} cycle={brightCycle} />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values={`${from} 0;${to} 0;${to} 0`}
                keyTimes={`0;${SURGE_ACTIVE};1`}
                calcMode="spline"
                keySplines="0.45 0 0.55 1;0 0 1 1"
                dur={`${c.surge.dur * MOTION_SLOWDOWN}s`}
                begin={`${c.surge.begin * MOTION_SLOWDOWN}s`}
                repeatCount="indefinite"
              />
            </linearGradient>
          );
        })}
        {CURTAINS.map((c, i) => {
          const main = c.colors?.main ?? '#10b981';
          const bright = c.colors?.bright ?? '#6ee7b7';
          const top = c.colors?.top ?? c.fringe ?? main;
          const mainCycle = c.colors ? undefined : HUE_MAIN;
          const brightCycle = c.colors ? undefined : HUE_BRIGHT;
          const g = GEOMETRY[i];
          return (
            <React.Fragment key={i}>
              {/* Body: transparent top → colour → bright lower border. */}
              <linearGradient id={id('body', i)} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" color={top} opacity={0} />
                <Stop offset="35%" color={top} opacity={0.16} />
                <Stop
                  offset="70%"
                  color={main}
                  opacity={0.5}
                  cycle={mainCycle}
                  begin={c.hueBegin}
                />
                <Stop
                  offset="86%"
                  color={bright}
                  opacity={0.78}
                  cycle={brightCycle}
                  begin={c.hueBegin}
                />
                <Stop
                  offset="100%"
                  color={bright}
                  opacity={0.15}
                  cycle={brightCycle}
                  begin={c.hueBegin}
                />
              </linearGradient>
              <linearGradient
                id={id('ray', i)}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1={g.rayTop}
                x2="0"
                y2={g.rayBottom}
              >
                <Stop
                  offset="0%"
                  color={main}
                  opacity={0}
                  cycle={mainCycle}
                  begin={c.hueBegin}
                />
                <Stop
                  offset="55%"
                  color={main}
                  opacity={0.18}
                  cycle={mainCycle}
                  begin={c.hueBegin}
                />
                <Stop
                  offset="100%"
                  color={bright}
                  opacity={0.5}
                  cycle={brightCycle}
                  begin={c.hueBegin}
                />
              </linearGradient>
            </React.Fragment>
          );
        })}
        {/* Softens the curtain outlines and ray stripes. One pass over all curtains. */}
        <filter id={id('soft')} x="-5%" y="-10%" width="110%" height="120%">
          <feGaussianBlur stdDeviation={CURTAIN_BLUR} />
        </filter>
      </defs>

      {/* Ambient glow from above: fades out before any viewBox edge, so nothing clips. */}
      <ellipse cx="150" cy="40" rx="190" ry="95" fill={`url(#${id('glow')})`} />

      {/* Horizon airglow, breathing slowly; stays inside the viewBox. */}
      <ellipse cx="150" cy="176" rx="150" ry="52" fill={`url(#${id('airglow')})`}>
        <animate
          attributeName="opacity"
          values="0.65;1;0.75;0.95;0.65"
          keyTimes="0;0.3;0.5;0.75;1"
          dur="26s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Pulsating patches below the arcs. */}
      {PATCHES.map(p => (
        <ellipse
          key={`${p.cx}-${p.cy}`}
          cx={p.cx}
          cy={p.cy}
          rx={p.rx}
          ry={p.ry}
          fill={`url(#${id('patch')})`}
          opacity={0}
        >
          <animate
            attributeName="opacity"
            values={PATCH_VALUES}
            keyTimes={PATCH_TIMES}
            dur={`${p.dur}s`}
            begin={`${p.begin}s`}
            repeatCount="indefinite"
          />
        </ellipse>
      ))}

      <g filter={`url(#${id('soft')})`}>
        {CURTAINS.map((c, i) => {
          const g = GEOMETRY[i];
          const morphDur = `${c.morphS * MOTION_SLOWDOWN}s`;
          const dashDur = `${c.morphS * 2 * MOTION_SLOWDOWN}s`;
          const clip = `url(#${id('clip', i)})`;
          const bodyShape = (
            <path d={g.body.slice(0, g.body.indexOf(';'))}>
              <animate
                attributeName="d"
                values={g.body}
                dur={morphDur}
                repeatCount="indefinite"
              />
            </path>
          );
          return (
            <g key={i} opacity={c.opacity}>
              <g
                className="anim-aurora-drift"
                style={
                  {
                    '--dur': `${c.swayS * MOTION_SLOWDOWN}s`,
                    '--ax': `${c.swayX}px`,
                    '--sk': `${c.swaySkew}deg`,
                    animationDelay: `${-i * 3.7 * MOTION_SLOWDOWN}s`,
                  } as React.CSSProperties
                }
              >
                {/* The ray stroke is offset perpendicular to the curve, so on slopes its dashes
                  poke below the lower edge; clip them to the (identically morphing) body. */}
                <clipPath id={id('clip', i)}>{bodyShape}</clipPath>
                {React.cloneElement(bodyShape, { fill: `url(#${id('body', i)})` })}
                <path
                  d={g.rays.slice(0, g.rays.indexOf(';'))}
                  fill="none"
                  stroke={`url(#${id('ray', i)})`}
                  strokeWidth={c.rayLen}
                  strokeDasharray={c.rayDash}
                  clipPath={clip}
                >
                  <animate
                    attributeName="d"
                    values={g.rays}
                    dur={morphDur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-60"
                    dur={dashDur}
                    repeatCount="indefinite"
                  />
                </path>
                {c.surge && (
                  <>
                    {/* Surge: the same rays (same dashes, same drift), lit only where the band is. */}
                    <path
                      d={g.rays.slice(0, g.rays.indexOf(';'))}
                      fill="none"
                      stroke={`url(#${id('surge', i)})`}
                      strokeWidth={c.rayLen}
                      strokeDasharray={c.rayDash}
                      strokeOpacity={0.5}
                      clipPath={clip}
                    >
                      <animate
                        attributeName="d"
                        values={g.rays}
                        dur={morphDur}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-60"
                        dur={dashDur}
                        repeatCount="indefinite"
                      />
                    </path>
                  </>
                )}
              </g>
            </g>
          );
        })}
      </g>

      {/* Occasional meteors crossing the aurora. */}
      {METEORS.map(m => (
        <g key={`${m.x}-${m.y}`} transform={`translate(${m.x} ${m.y}) rotate(${m.angle})`}>
          <g
            className="anim-aurora-meteor"
            style={
              {
                '--dist': `${m.dist}px`,
                '--dur': `${m.dur}s`,
                animationDelay: `${m.delay}s`,
              } as React.CSSProperties
            }
          >
            <path
              d="M 0 -0.7 L -30 -0.15 L -30 0.15 L 0 0.7 Z"
              fill={`url(#${id('meteor')})`}
            />
            <circle r="0.9" fill="#ffffff" />
          </g>
        </g>
      ))}
    </g>
  );
};

export default AuroraSvg;
