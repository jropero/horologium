// Nilometer.tsx — Rhoda Island column, elevated SVG quality
// Cross-section: central granite column inside a limestone cistern,
// water filling both channels around it. Matches the app's SVG idiom:
// named gradients, glow filters, carved-mark double-line technique,
// double frame border (gold + Egyptian blue), caustic shimmer.

import React from 'react';

interface NilometerProps {
  monthIndex: number;
  seasonName: string;
}

const NILE_MONTHLY_DATA: Record<number, { level: number; sublabel: string; fact: string }> = {
  0:  { level: 80, sublabel: 'Crecida inicial — Las aguas de Hapy cubren los campos',    fact: 'Hapy, dios de la Inundación, trae fertilidad a Kemet.' },
  1:  { level: 92, sublabel: 'Plenitud de la crecida — Nivel máximo del Nilo',            fact: 'El Nilo alcanza su cima. Los sacerdotes miden en los Nilómetros.' },
  2:  { level: 75, sublabel: 'Las aguas comienzan a retirarse lentamente',                 fact: 'El limo negro (Kemet) empieza a aparecer bajo las aguas.' },
  3:  { level: 58, sublabel: 'Recesión clara — La tierra negra emerge',                    fact: 'Los campos resurgen cubiertos de limo fértil, listos para arar.' },
  4:  { level: 42, sublabel: 'Los campesinos comienzan la siembra en la Tierra Negra',     fact: 'Osiris germinante: los brotes emergen del limo sagrado.' },
  5:  { level: 32, sublabel: 'Los canales de irrigación distribuyen el agua restante',      fact: 'Los campesinos siembran en la rica Tierra Negra (Kemet).' },
  6:  { level: 25, sublabel: 'Los cultivos crecen — El río se retira a su cauce',          fact: 'Renenutet, diosa serpiente, protege los graneros.' },
  7:  { level: 20, sublabel: 'Últimas aguas de irrigación antes de la cosecha',             fact: 'Las acequias se secan. Los sacerdotes rezan por la próxima crecida.' },
  8:  { level: 17, sublabel: 'Cosecha temprana — El río está bajo',                         fact: 'Min protege los campos dorados listos para la siega.' },
  9:  { level: 13, sublabel: 'Plena cosecha — Nivel mínimo del Nilo',                      fact: 'Los graneros se llenan. Egipto reza a Hapy por una buena crecida.' },
  10: { level: 12, sublabel: 'Estiaje severo — El río apenas fluye',                       fact: 'Si la crecida no llega, habrá hambruna. Egipto contiene el aliento.' },
  11: { level: 30, sublabel: 'Primeras señales de la crecida — Sirio reaparece',            fact: 'La estrella Sopdet (Sirio) sale al alba: la Inundación se acerca.' },
};

const getNileState = (monthIndex: number) => {
  if (monthIndex === -1) {
    return {
      level: 55,
      waterColor: '#0e7490',
      waterColorLight: '#06b6d4',
      sublabel: 'Los días fuera del tiempo. La Inundación se acerca.',
      fact: 'Los 5 días epagómenos: nacen Osiris, Horus, Seth, Isis y Neftis.',
      icon: '𓈗',
    };
  }
  const data = NILE_MONTHLY_DATA[monthIndex] ?? { level: 50, sublabel: '', fact: '' };
  let waterColor: string, waterColorLight: string, icon: string;
  if (data.level >= 70) {
    waterColor = '#0f766e'; waterColorLight = '#14b8a6'; icon = '𓇗';
  } else if (data.level >= 35) {
    waterColor = '#155e75'; waterColorLight = '#0891b2'; icon = '𓉐𓂋𓏏𓇶';
  } else {
    waterColor = '#164e63'; waterColorLight = '#0e7490'; icon = '𓈙𓅓𓏱';
  }
  return { level: data.level, waterColor, waterColorLight, sublabel: data.sublabel, fact: data.fact, icon };
};

const Nilometer: React.FC<NilometerProps> = ({ monthIndex, seasonName }) => {
  const nile = getNileState(monthIndex);

  // ── Coordinate system (viewBox 0 0 112 170) ──────────────────────────────
  // Left wall:  x=0..12
  // Pit:        x=12..100 (w=88)
  //   Column:   x=42..70  (w=28, centered in pit)
  //   L-channel: x=12..42 (w=30)
  //   R-channel: x=70..100 (w=30)
  // Right wall: x=100..112
  // Pit height: y=0..158
  // Floor:      y=158..170

  const VW = 112, VH = 170;
  const wallT = 12, floorH = 12;
  const pitX = wallT;                       // 12
  const pitW = VW - wallT * 2;              // 88  (12..100)
  const pitH = VH - floorH;                 // 158 (0..158)
  const colW = 28, colX = 42;
  const lX = pitX, lW = colX - pitX;        // left:  12..42, w=30
  const rX = colX + colW;                   // right: 70..100
  const rW = pitX + pitW - rX;              // w=30

  const waterH = Math.max(0, (nile.level / 100) * pitH);
  const waterY = pitH - waterH;             // y where water surface starts

  const NUM_CUBITS = 8;
  const markStep = pitH / NUM_CUBITS;       // ~19.75px per cubit
  const courseH = 18;                       // stone block course height

  return (
    <div
      className="w-full p-4 rounded-sm"
      style={{ background: '#08100a', border: '1.5px solid rgba(24,64,160,0.45)' }}
    >
      {/* Header */}
      <h3
        className="font-serif text-xs uppercase tracking-widest mb-4 text-center flex items-center justify-center gap-2"
        style={{ color: 'rgba(212,168,50,0.85)' }}
      >
        <span style={{ color: '#10b981' }}>𓈗</span>
        Nilómetro — Isla de Roda
        <span style={{ color: '#10b981' }}>𓈗</span>
      </h3>

      <div className="flex items-stretch gap-4">

        {/* ── SVG Nilometer ── */}
        <div className="flex-shrink-0">
          <svg
            width={VW} height={VH}
            viewBox={`0 0 ${VW} ${VH}`}
            className="drop-shadow-2xl"
          >
            <defs>
              {/* Pit interior: deep lapis darkness */}
              <linearGradient id="nm-pit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0d1a2e" />
                <stop offset="100%" stopColor="#03080e" />
              </linearGradient>

              {/* Water column: surface bright → abyss dark */}
              <linearGradient id="nm-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={nile.waterColorLight} stopOpacity="0.9" />
                <stop offset="28%"  stopColor={nile.waterColor}      stopOpacity="0.85" />
                <stop offset="100%" stopColor="#020a12"              stopOpacity="0.97" />
              </linearGradient>

              {/* Left wall: inner-edge lighter (light from pit) → outer dark */}
              <linearGradient id="nm-wl" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#243040" />
                <stop offset="55%"  stopColor="#1a2436" />
                <stop offset="100%" stopColor="#121c2a" />
              </linearGradient>

              {/* Right wall: outer dark → inner-edge lighter */}
              <linearGradient id="nm-wr" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#121c2a" />
                <stop offset="45%"  stopColor="#1a2436" />
                <stop offset="100%" stopColor="#243040" />
              </linearGradient>

              {/* Floor */}
              <linearGradient id="nm-floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#182638" />
                <stop offset="100%" stopColor="#0b141e" />
              </linearGradient>

              {/* Column: directional light — highlight on left, shadow on right */}
              <linearGradient id="nm-col" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#5c6c82" />
                <stop offset="15%"  stopColor="#48596e" />
                <stop offset="50%"  stopColor="#384558" />
                <stop offset="82%"  stopColor="#263040" />
                <stop offset="100%" stopColor="#161e2c" />
              </linearGradient>

              {/* Pit vignette: push edges darker for depth */}
              <radialGradient id="nm-vig" cx="50%" cy="30%" r="70%">
                <stop offset="0%"   stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.50)" />
              </radialGradient>

              {/* Water surface glow */}
              <filter id="nm-glow" x="-30%" y="-120%" width="160%" height="340%">
                <feGaussianBlur stdDeviation="1.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Subtle drop shadow for column capital/base slabs */}
              <filter id="nm-slab-shadow" x="-10%" y="-20%" width="120%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.55" />
              </filter>
            </defs>

            {/* ══ Left wall ══ */}
            <rect x="0" y="0" width={wallT} height={VH} fill="url(#nm-wl)" />
            {/* Horizontal mortar joints */}
            {Array.from({ length: Math.ceil(VH / courseH) + 1 }, (_, i) => (
              <line key={i} x1="0" y1={i * courseH} x2={wallT} y2={i * courseH}
                stroke="#0a1220" strokeWidth="0.75" opacity="0.85" />
            ))}
            {/* Inner-edge highlight pair (stone face catching pit light) */}
            <rect x={wallT - 2.5} y="0" width="2" height={VH} fill="#304050" opacity="0.45" />
            <rect x={wallT - 0.5} y="0" width="0.5" height={VH} fill="rgba(207,181,59,0.18)" />

            {/* ══ Right wall ══ */}
            <rect x={VW - wallT} y="0" width={wallT} height={VH} fill="url(#nm-wr)" />
            {Array.from({ length: Math.ceil(VH / courseH) + 1 }, (_, i) => (
              <line key={i} x1={VW - wallT} y1={i * courseH} x2={VW} y2={i * courseH}
                stroke="#0a1220" strokeWidth="0.75" opacity="0.85" />
            ))}
            {/* Inner-edge shadow (right wall is in shade from column) */}
            <rect x={VW - wallT} y="0" width="0.5" height={VH} fill="rgba(0,0,0,0.35)" />
            <rect x={VW - wallT + 0.5} y="0" width="2" height={VH} fill="#1c2840" opacity="0.35" />

            {/* ══ Pit interior ══ */}
            <rect x={pitX} y="0" width={pitW} height={pitH} fill="url(#nm-pit)" />
            {/* Depth vignette */}
            <rect x={pitX} y="0" width={pitW} height={pitH} fill="url(#nm-vig)" />

            {/* ══ Floor ══ */}
            <rect x={pitX} y={pitH} width={pitW} height={floorH} fill="url(#nm-floor)" />
            <line x1={pitX} y1={pitH} x2={pitX + pitW} y2={pitH}
              stroke="#0a1220" strokeWidth="0.8" opacity="0.7" />
            <line x1={pitX} y1={pitH + 0.8} x2={pitX + pitW} y2={pitH + 0.8}
              stroke="#2a3c50" strokeWidth="0.5" opacity="0.45" />

            {/* ══ Water — left channel ══ */}
            {waterH > 0 && (
              <rect x={lX} y={waterY} width={lW} height={waterH} fill="url(#nm-water)" />
            )}
            {/* ══ Water — right channel ══ */}
            {waterH > 0 && (
              <rect x={rX} y={waterY} width={rW} height={waterH} fill="url(#nm-water)" />
            )}

            {/* ══ Caustic shimmer below water surface ══ */}
            {waterH > 20 && (
              <>
                <ellipse cx={lX + lW * 0.36} cy={waterY + 12} rx="4" ry="1.3"
                  fill={nile.waterColorLight} opacity="0.11">
                  <animate attributeName="opacity" values="0.05;0.18;0.05" dur="2.7s" repeatCount="indefinite" />
                  <animate attributeName="rx" values="4;5.5;4" dur="3.2s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx={lX + lW * 0.72} cy={waterY + 27} rx="2.5" ry="0.9"
                  fill={nile.waterColorLight} opacity="0.09">
                  <animate attributeName="opacity" values="0.04;0.15;0.04" dur="3.8s" begin="0.6s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx={rX + rW * 0.55} cy={waterY + 18} rx="3.2" ry="1.1"
                  fill={nile.waterColorLight} opacity="0.10">
                  <animate attributeName="opacity" values="0.06;0.17;0.06" dur="3.1s" begin="1.2s" repeatCount="indefinite" />
                  <animate attributeName="rx" values="3.2;4.4;3.2" dur="3.8s" begin="1.2s" repeatCount="indefinite" />
                </ellipse>
              </>
            )}

            {/* ══ Animated wave surfaces ══ */}
            {waterH > 0 && (
              <>
                {/* Left channel wave */}
                <path
                  d={`M${lX},${waterY} Q${lX + lW * 0.52},${waterY - 2.8} ${colX},${waterY}`}
                  fill="none" stroke={nile.waterColorLight} strokeWidth="1.35" opacity="0.9"
                  filter="url(#nm-glow)"
                >
                  <animate attributeName="d"
                    values={[
                      `M${lX},${waterY} Q${lX + lW * 0.52},${waterY - 2.8} ${colX},${waterY}`,
                      `M${lX},${waterY} Q${lX + lW * 0.52},${waterY + 2.2} ${colX},${waterY}`,
                      `M${lX},${waterY} Q${lX + lW * 0.52},${waterY - 2.8} ${colX},${waterY}`,
                    ].join(';')}
                    dur="3.8s" repeatCount="indefinite"
                  />
                </path>
                {/* Right channel wave — opposite phase */}
                <path
                  d={`M${rX},${waterY} Q${rX + rW * 0.48},${waterY + 2.2} ${rX + rW},${waterY}`}
                  fill="none" stroke={nile.waterColorLight} strokeWidth="1.35" opacity="0.9"
                  filter="url(#nm-glow)"
                >
                  <animate attributeName="d"
                    values={[
                      `M${rX},${waterY} Q${rX + rW * 0.48},${waterY + 2.2} ${rX + rW},${waterY}`,
                      `M${rX},${waterY} Q${rX + rW * 0.48},${waterY - 2.8} ${rX + rW},${waterY}`,
                      `M${rX},${waterY} Q${rX + rW * 0.48},${waterY + 2.2} ${rX + rW},${waterY}`,
                    ].join(';')}
                    dur="3.8s" repeatCount="indefinite"
                  />
                </path>
              </>
            )}

            {/* ══ Central column — granite body ══ */}
            <rect x={colX} y="0" width={colW} height={pitH} fill="url(#nm-col)" />
            {/* Subtle left-edge highlight (lit stone face) */}
            <rect x={colX} y="0" width="1.8" height={pitH} fill="rgba(180,210,240,0.10)" />
            {/* Natural granite horizontal banding */}
            {Array.from({ length: Math.floor(pitH / 28) }, (_, i) => (
              <line key={i}
                x1={colX + 2} y1={i * 28 + 14} x2={colX + colW - 2} y2={i * 28 + 14}
                stroke="#1e2838" strokeWidth="0.35" opacity="0.55" />
            ))}

            {/* ══ Cubit marks — carved incisions ══ */}
            {/* Double-line technique: dark shadow line + lighter highlight 1px below = 3D inset */}
            {Array.from({ length: NUM_CUBITS + 1 }, (_, i) => {
              const mY = Math.round(i * markStep);
              const cubit = NUM_CUBITS - i;
              const above = mY < waterY;
              const tOp = above ? 0.32 : 0.82;
              const textCol = above ? '#7a8fa8' : '#93c5fd';
              const textOp = above ? 0.38 : 0.86;

              return (
                <g key={i}>
                  {/* Left tick — shadow + highlight */}
                  <line x1={lX + 3} y1={mY}      x2={colX}    y2={mY}      stroke="#050c18" strokeWidth="1.2" opacity={tOp} />
                  <line x1={lX + 3} y1={mY + 0.9} x2={colX}   y2={mY + 0.9} stroke="rgba(140,185,220,0.4)" strokeWidth="0.5" opacity={tOp} />
                  {/* Right tick — shadow + highlight */}
                  <line x1={colX + colW} y1={mY}      x2={rX + rW - 3} y2={mY}      stroke="#050c18" strokeWidth="1.2" opacity={tOp} />
                  <line x1={colX + colW} y1={mY + 0.9} x2={rX + rW - 3} y2={mY + 0.9} stroke="rgba(140,185,220,0.4)" strokeWidth="0.5" opacity={tOp} />
                  {/* Numeral on column face: carved depth (dark offset) + bright face */}
                  {cubit > 0 && (
                    <>
                      <text x={colX + colW / 2 + 0.7} y={mY + 5.7}
                        textAnchor="middle" fill="#040c18" fontSize="12" fontFamily="serif" opacity={textOp * 0.95}>
                        {cubit}
                      </text>
                      <text x={colX + colW / 2} y={mY + 5}
                        textAnchor="middle" fill={textCol} fontSize="12" fontFamily="serif" opacity={textOp}>
                        {cubit}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* ══ Water-level indicator ══ */}
            {waterH > 0 && (
              <>
                {/* Dashed lines in each channel (skip over the column) */}
                <line x1={lX} y1={waterY} x2={colX} y2={waterY}
                  stroke={nile.waterColorLight} strokeWidth="1.4" strokeDasharray="3,2.5" opacity="0.72"
                  filter="url(#nm-glow)">
                  <animate attributeName="opacity" values="0.5;0.85;0.5" dur="2.6s" repeatCount="indefinite" />
                </line>
                <line x1={colX + colW} y1={waterY} x2={rX + rW} y2={waterY}
                  stroke={nile.waterColorLight} strokeWidth="1.4" strokeDasharray="3,2.5" opacity="0.72"
                  filter="url(#nm-glow)">
                  <animate attributeName="opacity" values="0.5;0.85;0.5" dur="2.6s" repeatCount="indefinite" />
                </line>
                {/* Small arrowhead on column left-face pointing at current cubit level */}
                <polygon
                  points={`${colX},${waterY - 3} ${colX + 5},${waterY} ${colX},${waterY + 3}`}
                  fill={nile.waterColorLight} opacity="0.80"
                  filter="url(#nm-glow)"
                />
              </>
            )}

            {/* ══ Column capital (top slab + gold accent) ══ */}
            {/* Neck molding */}
            <rect x={colX - 1} y="5" width={colW + 2} height="2.5" rx="0.5"
              fill="#2c3a4e" filter="url(#nm-slab-shadow)" />
            {/* Abacus slab */}
            <rect x={colX - 5} y="0" width={colW + 10} height="5.5" rx="1.2"
              fill="#404f62" filter="url(#nm-slab-shadow)" />
            {/* Gold crown line */}
            <rect x={colX - 5} y="0" width={colW + 10} height="1.2"
              fill="rgba(207,181,59,0.55)" />
            <rect x={colX - 5} y="1.2" width={colW + 10} height="0.6"
              fill="rgba(207,181,59,0.18)" />
            {/* Egyptian blue band below gold */}
            <rect x={colX - 4} y="4.5" width={colW + 8} height="1"
              fill="rgba(24,64,160,0.50)" />

            {/* ══ Column base (mirror of capital) ══ */}
            {/* Torus molding */}
            <rect x={colX - 1} y={pitH - 8} width={colW + 2} height="3" rx="0.5"
              fill="#2c3a4e" />
            {/* Plinth */}
            <rect x={colX - 5} y={pitH - 5} width={colW + 10} height="5" rx="1.2"
              fill="#364554" filter="url(#nm-slab-shadow)" />
            <rect x={colX - 5} y={pitH - 5.5} width={colW + 10} height="0.7"
              fill="rgba(207,181,59,0.20)" />

            {/* ══ Double frame border — gold outer + Egyptian blue inner ══ */}
            <rect x="0.6" y="0.6" width={VW - 1.2} height={VH - 1.2}
              fill="none" stroke="rgba(207,181,59,0.45)" strokeWidth="1.2" />
            <rect x="2.2" y="2.2" width={VW - 4.4} height={VH - 4.4}
              fill="none" stroke="rgba(24,64,160,0.38)" strokeWidth="0.8" />
          </svg>
        </div>

        {/* ── Info panel ── */}
        <div className="flex-1 flex flex-col justify-center gap-2.5">

          {/* Hieroglyphic season icon */}
          <div className="text-2xl tracking-widest drop-shadow-sm" style={{ color: 'rgba(212,168,50,0.9)' }}>
            {nile.icon}
          </div>

          {/* Season label */}
          <div className="font-serif text-xs font-bold uppercase tracking-widest"
            style={{ color: 'rgba(240,220,180,0.9)' }}>
            {seasonName}
          </div>

          {/* Level bar */}
          <div className="w-full">
            <div className="flex justify-between mb-1"
              style={{ fontSize: '12px', fontFamily: 'serif', color: 'rgba(207,181,59,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>Seco</span>
              <span>Pleno</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(6,12,22,0.7)', border: '1px solid rgba(24,64,160,0.3)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${nile.level}%`,
                  background: `linear-gradient(90deg, ${nile.waterColor}, ${nile.waterColorLight})`,
                  boxShadow: `0 0 8px ${nile.waterColorLight}45`,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '12px', fontFamily: 'serif', color: 'rgba(207,181,59,0.72)', fontStyle: 'italic', lineHeight: 1.4 }}>
            {nile.sublabel}
          </p>

          {/* Fact — Egyptian blue left border accent */}
          <div style={{
            marginTop: '2px',
            fontSize: '12px',
            fontFamily: 'serif',
            color: 'rgba(240,220,180,0.45)',
            lineHeight: 1.4,
            borderLeft: '2px solid rgba(24,64,160,0.45)',
            paddingLeft: '8px',
          }}>
            {nile.fact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nilometer;
