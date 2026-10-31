import React, { useMemo } from 'react';
import { getAstronomicalEvents, AstroEvent, AstroEventType } from '../utils/astronomicalEvents';

interface Props {
  currentDate: Date;
  latitude: number;
  longitude: number;
}

// ─── Latin labels ──────────────────────────────────────────────────────────────

const CATEGORY: Record<AstroEventType, string> = {
  'moon-new':      'PHASAE LUNAE',
  'moon-fq':       'PHASAE LUNAE',
  'moon-full':     'PHASAE LUNAE',
  'moon-lq':       'PHASAE LUNAE',
  'moon-perigee':  'ORBIS LUNARIS',
  'moon-apogee':   'ORBIS LUNARIS',
  'elongation':    'STELLA ERRANS',
  'opposition':    'OPPOSITIO',
  'eclipse-lunar': 'ECLIPSIS LUNAE',
  'eclipse-solar': 'ECLIPSIS SOLIS',
};

const STATIC_LABEL: Partial<Record<AstroEventType, string>> = {
  'moon-new':     'Novilunium',
  'moon-fq':      'Quadratura Prima',
  'moon-full':    'Plenilunium',
  'moon-lq':      'Quadratura Tertia',
  'moon-perigee': 'Perigeium Lunae',
  'moon-apogee':  'Apogeium Lunae',
};

const KIND_LAT: Record<string, string> = {
  total:     'Totalis',
  partial:   'Partialis',
  annular:   'Annularis',
  penumbral: 'Penumbralis',
};

function eventLabel(ev: AstroEvent): string {
  if (STATIC_LABEL[ev.type]) return STATIC_LABEL[ev.type]!;
  if (ev.type === 'elongation') {
    const isMorn = ev.elongationDir === 'morning';
    if (ev.body === 'Venus') return `Venus ${isMorn ? 'Matutina' : 'Vespertina'}`;
    return `Mercurius ${isMorn ? 'Matutinus' : 'Vespertinus'}`;
  }
  if (ev.type === 'opposition') return `${ev.body} Oppositio`;
  if (ev.type === 'eclipse-lunar')
    return `Eclipsis Lunae ${KIND_LAT[ev.eclipseKind ?? ''] ?? ''}`.trim();
  if (ev.type === 'eclipse-solar')
    return `Eclipsis Solis ${KIND_LAT[ev.eclipseKind ?? ''] ?? ''}`.trim();
  return '';
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

// Phase moon — path-based halves to avoid clipPath ID collisions
const PhaseIcon: React.FC<{ q: 0 | 1 | 2 | 3 }> = ({ q }) => {
  const r = 13, cx = 20, cy = 20, top = cy - r, bot = cy + r;

  if (q === 0) return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r + 3} fill="rgba(175,155,125,0.06)" />
      <circle cx={cx} cy={cy} r={r} fill="#16101e" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(175,155,125,0.38)" strokeWidth="1.5" />
    </svg>
  );

  if (q === 2) return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r + 4} fill="rgba(210,190,120,0.07)" />
      <circle cx={cx} cy={cy} r={r} fill="#d4bf88" />
      <circle cx={cx - 4} cy={cy - 3} r={2}   fill="rgba(0,0,0,0.09)" />
      <circle cx={cx + 3} cy={cy + 4} r={1.5} fill="rgba(0,0,0,0.07)" />
      <circle cx={cx + 2} cy={cy - 7} r={1.1} fill="rgba(0,0,0,0.06)" />
    </svg>
  );

  // q=1 FQ: right half lit → dark shadow covers left half (sweep=0, CCW arc)
  // q=3 LQ: left half lit → dark shadow covers right half (sweep=1, CW arc)
  const sweep = q === 1 ? 0 : 1;
  return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="#c4ae78" />
      <path d={`M ${cx},${top} A ${r},${r} 0 0 ${sweep} ${cx},${bot} L ${cx},${top} Z`} fill="#16101e" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(175,155,125,0.18)" strokeWidth="1" />
    </svg>
  );
};

// Lunar apsis — Earth + Moon at varying distances
const ApsisIcon: React.FC<{ peri: boolean }> = ({ peri }) => {
  const moonR = peri ? 11 : 7.5;
  const moonX = peri ? 29  : 32;
  const earthX = peri ? 9  : 7;
  return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
      <ellipse cx={20} cy={20}
        rx={peri ? 14 : 18} ry={peri ? 10 : 13}
        fill="none" stroke="rgba(175,155,125,0.18)" strokeWidth="1"
        strokeDasharray={peri ? undefined : '3,2'} />
      <circle cx={earthX} cy={20} r={4} fill="#2a5080" />
      <circle cx={moonX}  cy={20} r={moonR} fill="#c4ae78" />
      <circle cx={moonX - Math.round(moonR * 0.28)} cy={20 - Math.round(moonR * 0.22)} r={1.5} fill="rgba(0,0,0,0.09)" />
    </svg>
  );
};

// Greatest elongation — Sun + inner planet at angle
const ElongationIcon: React.FC<{ body: string; dir: string }> = ({ body, dir }) => {
  const isEvening = dir === 'evening';
  const sunX = isEvening ? 11 : 30;
  const planetX = isEvening ? 31 : 10;
  const planetR = body === 'Venus' ? 5 : 3.2;
  const planetFill = body === 'Venus' ? 'rgba(215,195,155,0.95)' : 'rgba(175,155,125,0.95)';
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
      {rays.map((a, i) => {
        const rad = a * Math.PI / 180;
        return <line key={i}
          x1={sunX + Math.cos(rad) * 6} y1={20 + Math.sin(rad) * 6}
          x2={sunX + Math.cos(rad) * 9} y2={20 + Math.sin(rad) * 9}
          stroke="rgba(210,165,55,0.70)" strokeWidth="1.2" strokeLinecap="round" />;
      })}
      <circle cx={sunX}    cy={20} r={5}       fill="rgba(210,165,55,0.85)" />
      <circle cx={planetX} cy={20} r={planetR} fill={planetFill} />
    </svg>
  );
};

// Outer planet at opposition — Sun · Earth · Planet aligned
const OppositionIcon: React.FC<{ body: string }> = ({ body }) => {
  const color = body === 'Martis' ? '#c84820' : body === 'Iovis' ? '#c8a870' : '#a89878';
  const pR    = body === 'Iovis' ? 5.5 : body === 'Saturni' ? 4.5 : 3.5;
  return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
      <line x1="4" y1="20" x2="36" y2="20"
        stroke="rgba(175,155,125,0.18)" strokeWidth="1" strokeDasharray="3,2" />
      <circle cx={8}  cy={20} r={4.5} fill="rgba(210,165,55,0.80)" />
      <circle cx={20} cy={20} r={3.8} fill="#2a5080" />
      <circle cx={33} cy={20} r={pR}  fill={color} />
      {body === 'Saturni' && (
        <ellipse cx={33} cy={20} rx={8.5} ry={2.5}
          fill="none" stroke="rgba(168,152,120,0.55)" strokeWidth="1.5" />
      )}
    </svg>
  );
};

// Eclipse icons — shared star backdrop
const STARS_POS: [number, number][] = [
  [10, 12], [82, 16], [20, 74], [78, 68], [6, 50], [88, 44], [50, 8], [30, 86],
];

const LunarEclipseIcon: React.FC<{ kind: string; uid: string }> = ({ kind, uid }) => {
  const moonColor = kind === 'total' ? '#8B1515' : kind === 'partial' ? '#B87030' : '#C4A882';
  const moonDark  = kind === 'total' ? '#3A0808' : kind === 'partial' ? '#6B3A10' : '#8A6040';
  const shadowCx  = kind === 'total' ? 48 : kind === 'partial' ? 30 : 16;
  const shadowR   = kind === 'penumbral' ? 30 : 22;
  const shadowA   = kind === 'penumbral' ? 0.32 : 0.90;
  const clipId = `lc-${uid}`;
  const gradId = `lg-${uid}`;
  return (
    <svg viewBox="0 0 96 96" width="38" height="38" aria-hidden="true">
      <defs>
        <clipPath id={clipId}><circle cx={48} cy={48} r={20} /></clipPath>
        <radialGradient id={gradId} cx="60%" cy="40%" r="65%">
          <stop offset="0%"   stopColor={moonColor} />
          <stop offset="100%" stopColor={moonDark} />
        </radialGradient>
      </defs>
      {STARS_POS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} fill="rgba(210,195,160,0.5)" />
      ))}
      <circle cx={48} cy={48} r={20} fill={`url(#${gradId})`} />
      <circle cx={41} cy={42} r={2.8} fill="rgba(0,0,0,0.10)" />
      <circle cx={53} cy={55} r={2.0} fill="rgba(0,0,0,0.08)" />
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx={shadowCx - 5} cy={48} rx={shadowR + 10} ry={shadowR + 14} fill="rgba(22,8,48,0.28)" />
        {kind !== 'penumbral' && (
          <circle cx={shadowCx} cy={48} r={shadowR} fill={`rgba(8,4,18,${shadowA})`} />
        )}
      </g>
      {kind === 'total' && (
        <circle cx={48} cy={48} r={23} fill="none" stroke="rgba(200,50,15,0.40)" strokeWidth="3" />
      )}
    </svg>
  );
};

const SolarEclipseIcon: React.FC<{ kind: string; obscuration?: number; uid: string }> = ({ kind, obscuration, uid }) => {
  const isTotal = kind === 'total', isAnnular = kind === 'annular';
  const sunR = 19, moonR = isAnnular ? 15 : 19;
  const obs = obscuration ?? 0.5;
  const moonCx = isTotal || isAnnular ? 48 : 48 + (1 - Math.min(obs * 1.8, 1)) * 22;
  const maskId = `sm-${uid}`;
  const glowId = `sg-${uid}`;
  return (
    <svg viewBox="0 0 96 96" width="38" height="38" aria-hidden="true">
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF5C0" stopOpacity="0.9" />
          <stop offset="35%"  stopColor="#FFD050" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF8800" stopOpacity="0"   />
        </radialGradient>
        {!isAnnular && (
          <mask id={maskId}>
            <rect width="96" height="96" fill="white" />
            <circle cx={moonCx} cy={48} r={moonR} fill="black" />
          </mask>
        )}
      </defs>
      {STARS_POS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} fill="rgba(210,195,160,0.5)" />
      ))}
      <circle cx={48} cy={48} r={isTotal ? 38 : 30} fill={`url(#${glowId})`} />
      {!isAnnular && (
        <circle cx={48} cy={48} r={sunR} fill={isTotal ? '#FF8C00' : '#FFC830'} mask={`url(#${maskId})`} />
      )}
      {isAnnular && (
        <>
          <circle cx={48}     cy={48} r={sunR} fill="#FFC830" />
          <circle cx={moonCx} cy={48} r={moonR} fill="#090914" />
        </>
      )}
      {!isAnnular && <circle cx={moonCx} cy={48} r={moonR} fill="#090914" />}
    </svg>
  );
};

function getIcon(ev: AstroEvent, idx: number): React.ReactNode {
  const uid = `${idx}`;
  switch (ev.type) {
    case 'moon-new':     return <PhaseIcon q={0} />;
    case 'moon-fq':      return <PhaseIcon q={1} />;
    case 'moon-full':    return <PhaseIcon q={2} />;
    case 'moon-lq':      return <PhaseIcon q={3} />;
    case 'moon-perigee': return <ApsisIcon peri={true} />;
    case 'moon-apogee':  return <ApsisIcon peri={false} />;
    case 'elongation':   return <ElongationIcon body={ev.body!} dir={ev.elongationDir!} />;
    case 'opposition':   return <OppositionIcon body={ev.body!} />;
    case 'eclipse-lunar': return <LunarEclipseIcon kind={ev.eclipseKind ?? 'partial'} uid={uid} />;
    case 'eclipse-solar': return <SolarEclipseIcon kind={ev.eclipseKind ?? 'partial'} obscuration={ev.obscuration} uid={uid} />;
  }
}

// ─── Event row ────────────────────────────────────────────────────────────────

const EventRow: React.FC<{ ev: AstroEvent; idx: number; last: boolean }> = ({ ev, idx, last }) => {
  const isLunarEclipse = ev.type === 'eclipse-lunar';
  const isSolarEclipse = ev.type === 'eclipse-solar';

  const dateFmt = ev.time.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const timeFmt = ev.time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const catClass = isLunarEclipse
    ? 'text-stone-400 border-stone-500/30'
    : isSolarEclipse
    ? 'text-amber-400 border-amber-600/25'
    : 'text-gold-dim/60 border-gold-dim/20';

  let detail: React.ReactNode = null;
  if ((ev.type === 'moon-perigee' || ev.type === 'moon-apogee') && ev.distKm) {
    detail = <span className="font-serif text-xs text-parchment/38">{ev.distKm.toLocaleString()} km</span>;
  } else if (ev.type === 'elongation' && ev.elongationDeg != null) {
    const dir = ev.elongationDir === 'morning' ? 'Matut.' : 'Vespert.';
    detail = <span className="font-serif text-xs text-gold-dim/50">{ev.elongationDeg}° · {dir}</span>;
  } else if (ev.type === 'eclipse-lunar' && ev.sdTotal != null) {
    detail = <span className="font-serif text-xs text-gold-dim/50">±{Math.round(ev.sdTotal)} min</span>;
  } else if (ev.type === 'eclipse-solar' && ev.obscuration != null) {
    detail = <span className="font-serif text-xs text-amber-500/55">{Math.round(ev.obscuration * 100)}% obscuratio</span>;
  }

  return (
    <div className={`px-3 py-2.5 flex items-center gap-3${last ? '' : ' border-b border-gold-dim/10'}`}>
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
        {getIcon(ev, idx)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-0.5">
          <span className={`font-serif text-xs uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${catClass}`}>
            {CATEGORY[ev.type]}
          </span>
        </div>
        <p className="font-serif text-sm text-parchment leading-tight truncate">
          {eventLabel(ev)}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="font-serif text-xs text-parchment/45">{dateFmt} · {timeFmt}</span>
          {detail}
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const EclipseForecast: React.FC<Props> = ({ currentDate, latitude, longitude }) => {
  const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${Math.round(latitude)}-${Math.round(longitude)}`;
  const events = useMemo(
    () => getAstronomicalEvents(currentDate, latitude, longitude),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  if (events.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gold-dim/20">
          <div className="flex items-center justify-center gap-2.5">
            {/* Star */}
            <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
              <polygon
                points="10,2 11.8,7.8 18,7.8 13,11.5 15,17.5 10,14 5,17.5 7,11.5 2,7.8 8.2,7.8"
                fill="rgba(210,165,55,0.72)" />
            </svg>
            <p className="font-serif text-xs uppercase tracking-[0.28em] text-gold-dim">
              Phaenomena Caeli
            </p>
            {/* Moon */}
            <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
              <circle cx="10" cy="10" r="7"   fill="rgba(175,155,125,0.65)" />
              <circle cx="14.5" cy="8" r="7"  fill="rgba(7,16,29,0.95)" />
            </svg>
          </div>
          <p className="font-serif text-xs text-gold-dim/40 text-center tracking-wider mt-0.5">
            Tricinta Dies Proximi
          </p>
        </div>

        {/* Event list */}
        <div>
          {events.map((ev, i) => (
            <EventRow key={i} ev={ev} idx={i} last={i === events.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EclipseForecast;
