// Nilometer.tsx — Dynamic Nile water level indicator
// Based on the three Egyptian seasons: Akhet (Inundation), Peret (Sowing), Shemu (Harvest)
// Visual: A stylized stepped well (Nilometer) with animated water level

import React from 'react';

interface NilometerProps {
  /** Month index 0-11, or -1 for epagomenal days */
  monthIndex: number;
  /** Season name for display */
  seasonName: string;
}

/**
 * Historically accurate Nile water level model, month by month.
 * 
 * The Alexandrian calendar year begins with Thoth (~Sept 11).
 * The Nile flood cycle:
 *   - Waters begin rising in late Mesore (~August) as the Blue Nile surges
 *   - Peak inundation occurs in Phaophi (~October)
 *   - Gradual recession through Athyr and Choiak (~Nov-Dec)
 *   - Peret season (Tybi-Pharmuthi, ~Jan-Apr): fields emerge, sowing begins
 *   - Shemu season (Pachon-Mesore, ~May-Aug): harvest, river at minimum
 *   - By late Mesore the cycle restarts as Ethiopian monsoon rains arrive
 */
const NILE_MONTHLY_DATA: Record<number, { level: number; sublabel: string; fact: string }> = {
  // ═══ AKHET — Inundación ═══
  0:  { level: 80, sublabel: 'Crecida inicial — Las aguas de Hapy cubren los campos',      fact: 'Hapy, dios de la Inundación, trae fertilidad a Kemet.' },
  1:  { level: 92, sublabel: 'Plenitud de la crecida — Nivel máximo del Nilo',              fact: 'El Nilo alcanza su cima. Los sacerdotes miden en los Nilómetros.' },
  2:  { level: 75, sublabel: 'Las aguas comienzan a retirarse lentamente',                   fact: 'El limo negro (Kemet) empieza a aparecer bajo las aguas.' },
  3:  { level: 58, sublabel: 'Recesión clara — La tierra negra emerge',                      fact: 'Los campos resurgen cubiertos de limo fértil, listos para arar.' },
  // ═══ PERET — Siembra ═══
  4:  { level: 42, sublabel: 'Los campesinos comienzan la siembra en la Tierra Negra',       fact: 'Osiris germinante: los brotes emergen del limo sagrado.' },
  5:  { level: 32, sublabel: 'Los canales de irrigación distribuyen el agua restante',        fact: 'Los campesinos siembran en la rica Tierra Negra (Kemet).' },
  6:  { level: 25, sublabel: 'Los cultivos crecen — El río se retira a su cauce',            fact: 'Renenutet, diosa serpiente, protege los graneros.' },
  7:  { level: 20, sublabel: 'Últimas aguas de irrigación antes de la cosecha',               fact: 'Las acequias se secan. Los sacerdotes rezan por la próxima crecida.' },
  // ═══ SHEMU — Cosecha ═══
  8:  { level: 17, sublabel: 'Cosecha temprana — El río está bajo',                           fact: 'Min protege los campos dorados listos para la siega.' },
  9:  { level: 13, sublabel: 'Plena cosecha — Nivel mínimo del Nilo',                        fact: 'Los graneros se llenan. Egipto reza a Hapy por una buena crecida.' },
  10: { level: 12, sublabel: 'Estiaje severo — El río apenas fluye',                         fact: 'Si la crecida no llega, habrá hambruna. Egipto contiene el aliento.' },
  11: { level: 30, sublabel: 'Primeras señales de la crecida — Sirio reaparece',              fact: 'La estrella Sopdet (Sirio) sale al alba: la Inundación se acerca.' },
};

const getNileState = (monthIndex: number) => {
  if (monthIndex === -1) {
    // Epagomenal days — between Mesore and Thoth, river rising
    return {
      level: 55,
      waterColor: '#0e7490',
      waterColorLight: '#06b6d4',
      landColor: '#1e3a5f',
      label: 'Crecida inminente',
      sublabel: 'Los días fuera del tiempo. La Inundación se acerca.',
      fact: 'Los 5 días epagómenos: nacen Osiris, Horus, Seth, Isis y Neftis.',
      icon: '𓈗',
    };
  }

  const data = NILE_MONTHLY_DATA[monthIndex] || { level: 50, sublabel: '', fact: '' };

  // Determine visual theme based on actual water level
  let waterColor: string, waterColorLight: string, landColor: string, icon: string;

  if (data.level >= 70) {
    // High water — deep teal
    waterColor = '#0f766e';
    waterColorLight = '#14b8a6';
    landColor = '#1e3a5f';
    icon = '𓇗';
  } else if (data.level >= 35) {
    // Medium water — cyan, fertile soil visible
    waterColor = '#155e75';
    waterColorLight = '#0891b2';
    landColor = '#292524';
    icon = '𓉐𓂋𓏏𓇶';
  } else {
    // Low water — dark cyan, dry golden earth
    waterColor = '#164e63';
    waterColorLight = '#0e7490';
    landColor = '#a16207';
    icon = '𓈙𓅓𓏱';
  }

  return {
    level: data.level,
    waterColor,
    waterColorLight,
    landColor,
    label: monthIndex <= 3 ? 'Inundación' : monthIndex <= 7 ? 'Siembra' : 'Cosecha',
    sublabel: data.sublabel,
    fact: data.fact,
    icon,
  };
};

const Nilometer: React.FC<NilometerProps> = ({ monthIndex, seasonName }) => {
  const nile = getNileState(monthIndex);
  const waterTop = 100 - nile.level; // SVG y-position where water starts (0 = top)

  return (
    <div className="w-full bg-ink/40 p-4 rounded-lg border border-gold-dim/30 hover:border-emerald-500/50 transition-all">
      <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim mb-4 text-center flex items-center justify-center gap-2">
        <span className="text-emerald-400">𓈗</span>
        Nilómetro — Nivel del Nilo
        <span className="text-emerald-400">𓈗</span>
      </h3>

      <div className="flex items-stretch gap-4">
        {/* SVG Nilometer Well */}
        <div className="flex-shrink-0">
          <svg width="60" height="140" viewBox="0 0 60 140" className="drop-shadow-lg">
            {/* Well structure — stone walls */}
            <rect x="5" y="0" width="50" height="140" rx="2" fill="none" stroke="var(--gold-dim)" strokeWidth="2" opacity="0.6" />
            
            {/* Stone step marks (cubit marks) */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <React.Fragment key={i}>
                <line x1="5" y1={i * 20} x2="15" y2={i * 20} stroke="var(--gold-leaf)" strokeWidth="1" opacity="0.5" />
                <line x1="45" y1={i * 20} x2="55" y2={i * 20} stroke="var(--gold-leaf)" strokeWidth="1" opacity="0.5" />
                {/* Cubit number */}
                <text x="30" y={i * 20 + 4} textAnchor="middle" fill="var(--gold-dim)" fontSize="6" fontFamily="serif" opacity="0.4">
                  {7 - i}
                </text>
              </React.Fragment>
            ))}
            
            {/* Land/earth above water */}
            <rect
              x="6"
              y="1"
              width="48"
              height={Math.max(0, (waterTop / 100) * 138)}
              fill={nile.landColor}
              opacity="0.3"
              rx="1"
            />
            
            {/* Water body */}
            <rect
              x="6"
              y={(waterTop / 100) * 138 + 1}
              width="48"
              height={Math.max(0, (nile.level / 100) * 138)}
              fill={nile.waterColor}
              opacity="0.7"
              rx="1"
            >
              <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite" />
            </rect>
            
            {/* Animated water surface line */}
            <path
              d={`M6,${(waterTop / 100) * 138 + 1} Q18,${(waterTop / 100) * 138 - 3} 30,${(waterTop / 100) * 138 + 1} T54,${(waterTop / 100) * 138 + 1}`}
              fill="none"
              stroke={nile.waterColorLight}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            >
              <animate
                attributeName="d"
                values={`M6,${(waterTop / 100) * 138 + 1} Q18,${(waterTop / 100) * 138 - 3} 30,${(waterTop / 100) * 138 + 1} T54,${(waterTop / 100) * 138 + 1};M6,${(waterTop / 100) * 138 + 1} Q18,${(waterTop / 100) * 138 + 3} 30,${(waterTop / 100) * 138 + 1} T54,${(waterTop / 100) * 138 + 1};M6,${(waterTop / 100) * 138 + 1} Q18,${(waterTop / 100) * 138 - 3} 30,${(waterTop / 100) * 138 + 1} T54,${(waterTop / 100) * 138 + 1}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Water shine/highlight */}
            <rect
              x="20"
              y={(waterTop / 100) * 138 + 10}
              width="8"
              height="2"
              rx="1"
              fill={nile.waterColorLight}
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <rect
              x="34"
              y={(waterTop / 100) * 138 + 25}
              width="6"
              height="1.5"
              rx="1"
              fill={nile.waterColorLight}
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3.5s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>

        {/* Info panel */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {/* Season hieroglyphic */}
          <div className="text-2xl text-gold-leaf drop-shadow-sm tracking-widest">
            {nile.icon}
          </div>
          
          {/* Season name */}
          <div className="font-serif text-sm font-bold text-parchment uppercase tracking-widest">
            {seasonName}
          </div>
          
          {/* Water level bar */}
          <div className="w-full">
            <div className="flex justify-between text-[9px] font-serif text-gold-dim/60 uppercase tracking-widest mb-1">
              <span>Seco</span>
              <span>Pleno</span>
            </div>
            <div className="w-full h-2 bg-ink/60 border border-gold-dim/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${nile.level}%`,
                  background: `linear-gradient(90deg, ${nile.waterColor}, ${nile.waterColorLight})`,
                  boxShadow: `0 0 8px ${nile.waterColorLight}40`,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-[10px] sm:text-[11px] font-serif text-gold-dim italic leading-snug">
            {nile.sublabel}
          </p>

          {/* Fun fact */}
          <div className="mt-1 text-[9px] font-serif text-parchment/50 leading-tight border-l-2 border-emerald-500/20 pl-2">
            {nile.fact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nilometer;
