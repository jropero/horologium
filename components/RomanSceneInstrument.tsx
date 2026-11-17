import React from 'react';

/**
 * The timepiece at the centre of the Roman hero, standing on a marble plinth:
 * by day a bronze gnomon whose shadow sweeps the hour lines, by night a glass
 * clepsydra on a bronze tripod whose upper vessel empties into the lower one
 * over the twelve night hours.
 *
 * Geometry (300×200 viewBox): plinth top is an ellipse around (150, 181); the
 * clepsydra vessels keep the coordinates the water clipping is built on.
 */

interface Props {
  uid: string;
  isDay: boolean;
  /** 0–1 through the twelve hours of the current day or night. */
  progress: number;
}

const BRONZE_LIGHT = '#f0d98a';
const BRONZE = '#cfa53b';
const BRONZE_DARK = '#7d6220';

const HOUR_LINES = Array.from({ length: 13 }, (_, i) => {
  const a = (Math.PI * i) / 12;
  const x = 150 - Math.cos(a) * 29;
  const y = 181 + Math.sin(a) * 4.9;
  return `M150 181L${x.toFixed(2)} ${y.toFixed(2)}`;
}).join('');

const Plinth: React.FC<{ uid: string }> = ({ uid }) => (
  <g>
    <defs>
      <radialGradient id={`${uid}-plinth-top`} cx="50%" cy="40%" r="60%">
        <stop offset="0%" className="rs-stone-stop rs-stone-stop--light" />
        <stop offset="100%" className="rs-stone-stop" />
      </radialGradient>
    </defs>
    {/* Drum, then the top face. */}
    <path
      d="M 118 181 L 118 185.5 A 32 5.5 0 0 0 182 185.5 L 182 181 Z"
      className="rs-stone-side"
    />
    <ellipse
      cx="150"
      cy="181"
      rx="32"
      ry="5.5"
      fill={`url(#${uid}-plinth-top)`}
      className="rs-stone-top"
    />
    <ellipse cx="150" cy="181" rx="29" ry="4.9" className="rs-stone-ring" />
  </g>
);

const Gnomon: React.FC<{ uid: string; progress: number }> = ({ uid, progress }) => {
  const rad = Math.PI - progress * Math.PI;
  // The shadow falls away from the sun: long at dawn and dusk, short at noon.
  const tipX = 150 - Math.cos(rad) * 90;
  const tipY = 185 + (1 - Math.sin(rad)) * 14;
  const sunOnLeft = progress < 0.5;
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-finial`} cx="35%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fff6cf" />
          <stop offset="55%" stopColor={BRONZE} />
          <stop offset="100%" stopColor={BRONZE_DARK} />
        </radialGradient>
      </defs>
      <path d={HOUR_LINES} className="rs-hour-lines" />
      <path
        d={`M 148.6 181.6 L 151.4 181.6 L ${tipX + 0.5} ${tipY} L ${tipX - 0.5} ${tipY} Z`}
        className="rs-gnomon-shadow roman-clock__svg-transition"
      />
      {/* Base block, then the blade: one face lit, the other in shade. */}
      <path d="M 145.4 181.6 L 154.6 181.6 L 153.6 179.6 L 146.4 179.6 Z" fill={BRONZE_DARK} />
      <path
        d="M 147.2 179.8 L 150 179.8 L 150 146 L 149.4 146 Z"
        fill={sunOnLeft ? BRONZE_LIGHT : BRONZE_DARK}
      />
      <path
        d="M 150 179.8 L 152.8 179.8 L 150.6 146 L 150 146 Z"
        fill={sunOnLeft ? BRONZE_DARK : BRONZE_LIGHT}
      />
      <path
        d="M 147.2 179.8 L 152.8 179.8 L 150.6 146 L 149.4 146 Z"
        fill="none"
        stroke={BRONZE_DARK}
        strokeWidth="0.3"
      />
      <circle cx="150" cy="144.4" r="2.5" fill={`url(#${uid}-finial)`} />
    </g>
  );
};

const Clepsydra: React.FC<{ uid: string; progress: number }> = ({ uid, progress }) => {
  const upperLevel = 135 + 20 * progress;
  const lowerLevel = 180 - 20 * progress;
  const running = progress < 0.99;
  return (
    <g className="roman-clock__svg-transition">
      <defs>
        <clipPath id={`${uid}-upper`}>
          <path d="M 136 135 L 146 155 L 154 155 L 164 135 Z" />
        </clipPath>
        <clipPath id={`${uid}-lower`}>
          <path d="M 146 160 L 136 180 L 164 180 L 154 160 Z" />
        </clipPath>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fc4ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#254f9e" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dcebff" stopOpacity="0.3" />
          <stop offset="35%" stopColor="#dcebff" stopOpacity="0.05" />
          <stop offset="75%" stopColor="#dcebff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#dcebff" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`${uid}-bronze`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={BRONZE_DARK} />
          <stop offset="40%" stopColor={BRONZE_LIGHT} />
          <stop offset="100%" stopColor={BRONZE_DARK} />
        </linearGradient>
      </defs>

      {/* Tripod: two visible legs with paw feet. */}
      <g fill="none" stroke={BRONZE} strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        <path d="M 135 135 C 124 150, 126 170, 131.5 182.5" />
        <path d="M 165 135 C 176 150, 174 170, 168.5 182.5" />
      </g>
      <ellipse cx="130.8" cy="183" rx="2.2" ry="1" fill={BRONZE_DARK} />
      <ellipse cx="169.2" cy="183" rx="2.2" ry="1" fill={BRONZE_DARK} />

      {/* Upper vessel */}
      <path
        d="M 136 135 L 146 155 L 154 155 L 164 135 Z"
        fill={`url(#${uid}-glass)`}
        stroke="#dbeaff"
        strokeWidth="0.45"
        strokeOpacity="0.7"
      />
      <g clipPath={`url(#${uid}-upper)`}>
        <rect x="130" y={upperLevel} width="40" height="22" fill={`url(#${uid}-water)`} />
        {progress < 1 && (
          <ellipse
            cx="150"
            cy={upperLevel}
            rx={14 - 10 * progress}
            ry="1"
            fill="#b9e2ff"
            opacity="0.7"
          />
        )}
      </g>
      <path d="M 139.6 137.5 L 146.6 152" stroke="#ffffff" strokeWidth="0.6" opacity="0.35" />
      <ellipse
        cx="150"
        cy="135"
        rx="14.2"
        ry="3"
        fill="none"
        stroke={`url(#${uid}-bronze)`}
        strokeWidth="1"
      />

      {/* Lower vessel */}
      <path
        d="M 146 160 L 136 180 L 164 180 L 154 160 Z"
        fill={`url(#${uid}-glass)`}
        stroke="#dbeaff"
        strokeWidth="0.45"
        strokeOpacity="0.7"
      />
      <g clipPath={`url(#${uid}-lower)`}>
        <rect x="130" y={lowerLevel} width="40" height="30" fill={`url(#${uid}-water)`} />
        {progress > 0 && (
          <>
            <ellipse
              cx="150"
              cy={lowerLevel}
              rx={14 - 10 * (1 - progress)}
              ry="1"
              fill="#b9e2ff"
              opacity="0.7"
            />
            {/* Ripple where the drops land. */}
            {running && (
              <ellipse
                cx="150"
                cy={lowerLevel}
                rx="1"
                ry="0.3"
                fill="none"
                stroke="#e6f4ff"
                strokeWidth="0.3"
              >
                <animate
                  attributeName="rx"
                  values="0.6;5"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="ry"
                  values="0.2;0.9"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </ellipse>
            )}
          </>
        )}
      </g>
      <path d="M 138.6 177.5 L 146.4 162" stroke="#ffffff" strokeWidth="0.6" opacity="0.3" />

      {/* Falling drops */}
      {running && (
        <g fill="#b9e2ff">
          <line
            x1="150"
            y1="155"
            x2="150"
            y2={lowerLevel}
            stroke="#b9e2ff"
            strokeWidth="0.35"
            opacity="0.35"
          />
          {[0, 0.55].map(begin => (
            <circle key={begin} cx="150" cy="156" r="0.75">
              <animate
                attributeName="cy"
                values={`156;${lowerLevel}`}
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.55 0 1 1"
                dur="1.1s"
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}

      {/* Bronze collar between the vessels */}
      <rect x="144.6" y="155" width="10.8" height="5" rx="0.8" fill={`url(#${uid}-bronze)`} />
      <path
        d="M 144 155 L 156 155 M 144 160 L 156 160"
        stroke={BRONZE_LIGHT}
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* Hour scale with a pointer at the water level */}
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={i}
          x1={i % 3 === 0 ? 131.6 : 132.6}
          y1={180 - (20 / 12) * i}
          x2="134.4"
          y2={180 - (20 / 12) * i}
          stroke={BRONZE}
          strokeWidth="0.4"
          opacity="0.85"
        />
      ))}
      <path
        d={`M 134.8 ${lowerLevel} l -2.6 -1.1 l 0 2.2 Z`}
        fill={BRONZE_LIGHT}
        className="roman-clock__svg-transition"
      />
      <ellipse
        cx="150"
        cy="180"
        rx="14.2"
        ry="3"
        fill="none"
        stroke={`url(#${uid}-bronze)`}
        strokeWidth="1"
      />
    </g>
  );
};

const RomanSceneInstrument: React.FC<Props> = ({ uid, isDay, progress }) => (
  <g>
    <Plinth uid={uid} />
    {isDay ? (
      <Gnomon uid={uid} progress={progress} />
    ) : (
      <Clepsydra uid={uid} progress={progress} />
    )}
  </g>
);

export default RomanSceneInstrument;
