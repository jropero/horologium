import React, { useMemo } from 'react';
import { getUpcomingEclipses, EclipseEvent } from '../utils/eclipseUtils';

const KIND_LAT: Record<string, string> = {
  total:     'Totalis',
  partial:   'Partialis',
  annular:   'Annularis',
  penumbral: 'Penumbralis',
};

interface Props {
  currentDate: Date;
  latitude: number;
  longitude: number;
}

const STARS: [number, number][] = [
  [10, 12], [82, 16], [20, 74], [78, 68], [6, 50], [88, 44], [50, 8], [30, 86],
];

// Lunar eclipse: moon passing through Earth's umbra/penumbra
const LunarEclipseSVG: React.FC<{ kind: string; uid: string }> = ({ kind, uid }) => {
  const moonCx = 60, moonCy = 48, moonR = 20;
  const clipId = `lc-${uid}`;
  const gradId = `lg-${uid}`;

  const moonColor  = kind === 'total' ? '#8B1515' : kind === 'partial' ? '#B87030' : '#C4A882';
  const moonDark   = kind === 'total' ? '#3A0808' : kind === 'partial' ? '#6B3A10' : '#8A6040';

  // Shadow circle: how far Earth's umbra intrudes into the moon disk
  const shadowCx = kind === 'total' ? 47 : kind === 'partial' ? 43 : 34;
  const shadowR  = kind === 'penumbral' ? 30 : 22;
  const shadowA  = kind === 'penumbral' ? 0.32 : 0.90;

  return (
    <svg viewBox="0 0 96 96" width="68" height="68" aria-label={`${kind} lunar eclipse`}>
      <defs>
        <clipPath id={clipId}>
          <circle cx={moonCx} cy={moonCy} r={moonR} />
        </clipPath>
        <radialGradient id={gradId} cx="60%" cy="40%" r="65%">
          <stop offset="0%"   stopColor={moonColor} />
          <stop offset="100%" stopColor={moonDark} />
        </radialGradient>
      </defs>

      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} fill="rgba(210,195,160,0.5)" />
      ))}

      {/* Moon base */}
      <circle cx={moonCx} cy={moonCy} r={moonR} fill={`url(#${gradId})`} />
      {/* Craters */}
      <circle cx={moonCx - 7} cy={moonCy - 6} r={2.8} fill="rgba(0,0,0,0.10)" />
      <circle cx={moonCx + 5} cy={moonCy + 7} r={2.0} fill="rgba(0,0,0,0.08)" />
      <circle cx={moonCx + 9} cy={moonCy - 5} r={1.4} fill="rgba(0,0,0,0.09)" />
      <circle cx={moonCx - 2} cy={moonCy + 12} r={1.2} fill="rgba(0,0,0,0.07)" />

      {/* Earth's shadow — clipped to moon disk */}
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx={shadowCx - 5} cy={moonCy} rx={shadowR + 10} ry={shadowR + 14}
          fill="rgba(22,8,48,0.28)" />
        {kind !== 'penumbral' && (
          <circle cx={shadowCx} cy={moonCy} r={shadowR}
            fill={`rgba(8,4,18,${shadowA})`} />
        )}
      </g>

      {/* Total eclipse: atmospheric refraction glow ring (blood moon) */}
      {kind === 'total' && (
        <>
          <circle cx={moonCx} cy={moonCy} r={moonR + 3}
            fill="none" stroke="rgba(200,50,15,0.40)" strokeWidth="3" />
          <circle cx={moonCx} cy={moonCy} r={moonR + 7}
            fill="none" stroke="rgba(180,30,10,0.14)" strokeWidth="4" />
        </>
      )}
    </svg>
  );
};

// Solar eclipse: moon blocking the sun
const SolarEclipseSVG: React.FC<{ kind: string; obscuration?: number; uid: string }> = ({ kind, obscuration, uid }) => {
  const sunCx = 48, sunCy = 48, sunR = 19;
  const isTotal   = kind === 'total';
  const isAnnular = kind === 'annular';

  // Annular moon is slightly smaller; for partial, offset by obscuration
  const moonR  = isAnnular ? 15 : 19;
  const obs    = obscuration ?? 0.5;
  const moonCx = isTotal || isAnnular ? 48 : 48 + (1 - Math.min(obs * 1.8, 1)) * 22;
  const moonCy = 48;

  const maskId = `sm-${uid}`;
  const glowId = `sg-${uid}`;

  return (
    <svg viewBox="0 0 96 96" width="68" height="68" aria-label={`${kind} solar eclipse`}>
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF5C0" stopOpacity="0.9" />
          <stop offset="35%"  stopColor="#FFD050" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF8800" stopOpacity="0"   />
        </radialGradient>
        {/* Mask: punch out moon's silhouette from the sun disk */}
        {!isAnnular && (
          <mask id={maskId}>
            <rect width="96" height="96" fill="white" />
            <circle cx={moonCx} cy={moonCy} r={moonR} fill="black" />
          </mask>
        )}
      </defs>

      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} fill="rgba(210,195,160,0.5)" />
      ))}

      {/* Sun corona glow */}
      <circle cx={sunCx} cy={sunCy} r={isTotal ? 38 : 30} fill={`url(#${glowId})`} />

      {/* Corona rays — total eclipse */}
      {isTotal && Array.from({ length: 16 }, (_, i) => {
        const a   = (i * 22.5) * Math.PI / 180;
        const len = 13 + (i % 3) * 5;
        const r1  = sunR + 2;
        return (
          <line key={i}
            x1={sunCx + Math.cos(a) * r1}        y1={sunCy + Math.sin(a) * r1}
            x2={sunCx + Math.cos(a) * (r1 + len)} y2={sunCy + Math.sin(a) * (r1 + len)}
            stroke={i % 4 === 0 ? 'rgba(255,230,100,0.6)' : 'rgba(255,200,60,0.32)'}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Simple rays — partial / annular */}
      {!isTotal && Array.from({ length: 8 }, (_, i) => {
        const a  = (i * 45) * Math.PI / 180;
        const r1 = sunR + 2, r2 = sunR + 12;
        return (
          <line key={i}
            x1={sunCx + Math.cos(a) * r1} y1={sunCy + Math.sin(a) * r1}
            x2={sunCx + Math.cos(a) * r2} y2={sunCy + Math.sin(a) * r2}
            stroke="rgba(255,200,60,0.50)" strokeWidth="1.5" strokeLinecap="round"
          />
        );
      })}

      {/* Sun disk (masked for total/partial) */}
      {!isAnnular && (
        <circle cx={sunCx} cy={sunCy} r={sunR}
          fill={isTotal ? '#FF8C00' : '#FFC830'}
          mask={`url(#${maskId})`}
        />
      )}

      {/* Annular: full sun + smaller centred moon = ring of fire */}
      {isAnnular && (
        <>
          <circle cx={sunCx} cy={sunCy} r={sunR} fill="#FFC830" />
          <circle cx={moonCx} cy={moonCy} r={moonR} fill="#090914" />
          <circle cx={moonCx} cy={moonCy} r={moonR}
            fill="none" stroke="rgba(255,140,0,0.75)" strokeWidth="2.5" />
        </>
      )}

      {/* Moon disk — partial / total */}
      {!isAnnular && (
        <circle cx={moonCx} cy={moonCy} r={moonR} fill="#090914" />
      )}

      {/* Total: diamond-ring / limb glow suggestion */}
      {isTotal && (
        <circle cx={sunCx} cy={sunCy} r={moonR}
          fill="none" stroke="rgba(255,230,120,0.45)" strokeWidth="1.5" />
      )}
    </svg>
  );
};

const EclipseCard: React.FC<{ event: EclipseEvent; idx: number; last: boolean }> = ({ event, idx, last }) => {
  const isLunar  = event.type === 'lunar';
  const uid      = `${event.type[0]}${idx}`;
  const kindLabel = KIND_LAT[event.kind] ?? event.kind;

  const dateFmt = event.peak.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeFmt = event.peak.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={`px-4 py-3.5 flex items-center gap-3.5${last ? '' : ' border-b border-gold-dim/10'}`}>
      {/* SVG illustration */}
      <div className="flex-shrink-0">
        {isLunar
          ? <LunarEclipseSVG kind={event.kind} uid={uid} />
          : <SolarEclipseSVG kind={event.kind} obscuration={event.obscuration} uid={uid} />
        }
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0">
        {/* Kind badge */}
        <div className="mb-1">
          <span className={`font-serif text-xs uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
            isLunar
              ? 'bg-stone-900/60 text-gold-dim border-gold-dim/20'
              : 'bg-amber-950/40 text-amber-400 border-amber-600/25'
          }`}>
            {kindLabel}
          </span>
        </div>

        {/* Eclipse type */}
        <p className="font-serif text-xs uppercase tracking-[0.18em] text-gold-dim/50 leading-none mb-1">
          {isLunar ? 'Eclipsis Lunae' : 'Eclipsis Solis'}
        </p>

        {/* Date */}
        <p className="font-serif text-sm text-parchment">{dateFmt}</p>

        {/* Time + detail */}
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <span className="font-serif text-xs text-parchment/45">{timeFmt}</span>
          {isLunar && event.sdTotal != null && (
            <span className="font-serif text-xs text-gold-dim/50">
              ±{Math.round(event.sdTotal)} min
            </span>
          )}
          {!isLunar && event.obscuration != null && (
            <span className="font-serif text-xs text-amber-500/55">
              {Math.round(event.obscuration * 100)}% obscuratio
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const EclipseForecast: React.FC<Props> = ({ currentDate, latitude, longitude }) => {
  const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${Math.round(latitude)}-${Math.round(longitude)}`;
  const eclipses = useMemo(
    () => getUpcomingEclipses(currentDate, latitude, longitude, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  if (eclipses.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gold-dim/20">
          <div className="flex items-center justify-center gap-2.5">
            {/* Sun icon */}
            <svg viewBox="0 0 20 20" width="15" height="15">
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i * 45) * Math.PI / 180;
                return <line key={i}
                  x1={10 + Math.cos(a) * 5.5} y1={10 + Math.sin(a) * 5.5}
                  x2={10 + Math.cos(a) * 9}   y2={10 + Math.sin(a) * 9}
                  stroke="rgba(210,165,55,0.75)" strokeWidth="1.5" strokeLinecap="round" />;
              })}
              <circle cx="10" cy="10" r="4" fill="rgba(210,165,55,0.75)" />
            </svg>

            <p className="font-serif text-xs uppercase tracking-[0.28em] text-gold-dim">
              Eclipses Futurae
            </p>

            {/* Moon icon */}
            <svg viewBox="0 0 20 20" width="13" height="13">
              <circle cx="10" cy="10" r="7" fill="rgba(175,155,125,0.65)" />
              <circle cx="14.5" cy="8"  r="7" fill="rgba(7,16,29,0.95)" />
            </svg>
          </div>
          <p className="font-serif text-xs text-gold-dim/40 text-center tracking-wider mt-0.5">
            Quinque proxima phaenomena caeli
          </p>
        </div>

        {/* Eclipse list */}
        <div>
          {eclipses.map((ev, i) => (
            <EclipseCard key={i} event={ev} idx={i} last={i === eclipses.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EclipseForecast;
