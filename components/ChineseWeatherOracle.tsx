import React, { useMemo } from 'react';
import { WeatherData, WeatherCondition } from '../types';

// ─── Celestial Bureaucracy Oracle Data ───────────────────────────────────────

interface ConditionOracle {
  chars: string[];
  charColor: string;
  charAnimation: 'fall' | 'drift-slow' | 'drift-fast' | 'float' | 'dragon' | 'glow' | 'lightning';
  skyGradient: string;
  elementHanzi: string;
  elementName: string;
  elementColor: string;
  official: string;
  officialTitle: string;
  dispatch: string;
}

const ORACLE: Record<WeatherCondition, ConditionOracle> = {
  clear: {
    chars: ['日', '光', '曦'],
    charColor: 'text-amber-300',
    charAnimation: 'glow',
    skyGradient: 'from-amber-950/80 via-orange-900/60 to-sky-950/80',
    elementHanzi: '金', elementName: 'Metal', elementColor: 'text-amber-300',
    official: '太陽星官',
    officialTitle: 'Oficial Estelar Solar',
    dispatch: '太陽星官 certifica: el Qi de esta jornada fluye limpio y ascendente. El Dragon Rey se ha tomado el día libre sin avisar. Se investiga el asunto.',
  },
  cloudy: {
    chars: ['雲', '雲', '雲', '雲'],
    charColor: 'text-slate-300',
    charAnimation: 'drift-slow',
    skyGradient: 'from-slate-800/90 via-stone-800/70 to-slate-900/90',
    elementHanzi: '土', elementName: 'Tierra', elementColor: 'text-stone-400',
    official: '雲師',
    officialTitle: 'Maestro de las Nubes',
    dispatch: '雲師 informa: las nubes están siendo reordenadas según el nuevo protocolo del Ministerio del Cielo. Ni lluvia confirmada ni sol garantizado. Mantenga expectativas moderadas.',
  },
  rain: {
    chars: ['雨', '雨', '雨', '雨', '雨', '雨', '雨', '雨'],
    charColor: 'text-blue-300',
    charAnimation: 'fall',
    skyGradient: 'from-slate-800/90 via-blue-900/70 to-slate-950/90',
    elementHanzi: '水', elementName: 'Agua', elementColor: 'text-blue-300',
    official: '龍王',
    officialTitle: 'Rey Dragón',
    dispatch: '龍王 ha aprobado la solicitud de lluvia nº 47 del Ministerio Agrícola. Declara que los mortales no agradecen suficientemente su trabajo. Llueve de todos modos.',
  },
  storm: {
    chars: ['雷', '龍', '電', '雷'],
    charColor: 'text-rose-400',
    charAnimation: 'dragon',
    skyGradient: 'from-zinc-900/90 via-slate-900/90 to-zinc-950/90',
    elementHanzi: '木', elementName: 'Madera', elementColor: 'text-rose-400',
    official: '雷公電母',
    officialTitle: 'Duque del Trueno y Señora del Relámpago',
    dispatch: '雷公電母 emiten aviso conjunto: disputa matrimonial activa en el Ministerio del Trueno. El Dragon Rey aprovecha el caos para añadir lluvia extra sin permiso. Quédese en casa.',
  },
  snow: {
    chars: ['雪', '雪', '雪', '雪', '雪'],
    charColor: 'text-sky-100',
    charAnimation: 'fall',
    skyGradient: 'from-slate-700/80 via-sky-900/70 to-slate-900/90',
    elementHanzi: '水', elementName: 'Agua', elementColor: 'text-sky-200',
    official: '雪官',
    officialTitle: 'Oficial de la Nieve',
    dispatch: '雪官 declara: la nieve es un augurio auspicioso y un regalo del Cielo. Queda terminantemente prohibido quejarse del frío. (El 雪官 trabaja desde la corte celestial del sur.)',
  },
  fog: {
    chars: ['霧', '雲', '霧'],
    charColor: 'text-stone-300',
    charAnimation: 'drift-slow',
    skyGradient: 'from-stone-700/70 via-stone-800/80 to-stone-900/90',
    elementHanzi: '土', elementName: 'Tierra', elementColor: 'text-stone-300',
    official: '霧神',
    officialTitle: 'Espíritu de la Niebla',
    dispatch: '霧神 comunica: los espíritus de la montaña celebran reunión privada. La niebla es la cortina oficial. Se ruega no mirar ni fotografiar. Gracias.',
  },
};

// ─── Deterministic particle positions ────────────────────────────────────────

interface Particle { x: number; dur: number; delay: number; drift: number; size: number; }

function makeParticles(count: number, seed = 42): Particle[] {
  // Simple LCG for deterministic "random" positions
  let s = seed;
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  return Array.from({ length: count }, () => ({
    x: rng() * 90 + 2,
    dur: 4 + rng() * 4,
    delay: -(rng() * 8),
    drift: (rng() - 0.5) * 12,
    size: 0.85 + rng() * 0.6,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { weather: WeatherData; }

const ChineseWeatherOracle: React.FC<Props> = ({ weather }) => {
  const { condition, code, windSpeed, temperature } = weather.current;
  const chineseDesc = weather.current.chineseDescription ?? '天氣未詳';
  const windName = weather.current.chineseWindName ?? '風 Fēng';
  const oracle = ORACLE[condition];

  const particles = useMemo(() =>
    makeParticles(oracle.chars.length * 2 + 2),
    [oracle.chars.length],
  );

  const yinYang = temperature > 22 ? '陽 Yang' : temperature < 5 ? '陰 Yin' : '陰陽 Equilibrio';

  // Split chineseDesc at space — first token is the 4-char idiom, rest is pinyin
  const [idiom, ...pinyinParts] = chineseDesc.split(' ');
  const pinyin = pinyinParts.join(' ');

  return (
    <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-rose-900/40 mb-8">
      {/* ── Animated sky panel ── */}
      <div className={`relative h-28 overflow-hidden bg-gradient-to-b ${oracle.skyGradient}`}>

        {/* Floating / drifting / falling characters */}
        {oracle.chars.map((char, i) => {
          const p = particles[i] ?? particles[0];
          const anim = oracle.charAnimation;

          if (anim === 'fall') {
            return (
              <span
                key={i}
                className={`absolute select-none pointer-events-none font-serif ${oracle.charColor} anim-fall`}
                style={{
                  left: `${p.x}%`,
                  top: '-1.5rem',
                  fontSize: `${p.size * 1.4}rem`,
                  opacity: 0.85,
                  '--dur': `${p.dur}s`,
                  '--drift': `${p.drift}px`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              >
                {char}
              </span>
            );
          }

          if (anim === 'drift-slow' || anim === 'drift-fast') {
            return (
              <span
                key={i}
                className={`absolute select-none pointer-events-none font-serif ${oracle.charColor} ${anim === 'drift-fast' ? 'anim-cloud-fast' : 'anim-cloud-slow'}`}
                style={{
                  left: `${p.x}%`,
                  top: `${15 + (i % 3) * 22}%`,
                  fontSize: `${p.size * 1.8}rem`,
                  opacity: 0.45 + (i % 2) * 0.2,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              >
                {char}
              </span>
            );
          }

          if (anim === 'glow') {
            return (
              <span
                key={i}
                className={`absolute select-none pointer-events-none font-serif ${oracle.charColor} anim-glow-pulse anim-float`}
                style={{
                  left: `${15 + i * 28}%`,
                  top: '20%',
                  fontSize: `${2.2 + i * 0.3}rem`,
                  animationDelay: `${i * 0.8}s`,
                } as React.CSSProperties}
              >
                {char}
              </span>
            );
          }

          if (anim === 'dragon') {
            // 龍 flies across; 雷/電 flash in place
            if (char === '龍') {
              return (
                <span
                  key={i}
                  className={`absolute select-none pointer-events-none font-serif text-rose-300 anim-dragon`}
                  style={{
                    top: '30%',
                    left: 0,
                    fontSize: '2rem',
                    '--dragon-dur': '13s',
                    animationDelay: `${i * 2}s`,
                  } as React.CSSProperties}
                >
                  🐉
                </span>
              );
            }
            return (
              <span
                key={i}
                className={`absolute select-none pointer-events-none font-serif ${oracle.charColor} anim-lightning`}
                style={{
                  left: `${20 + i * 22}%`,
                  top: `${10 + (i % 2) * 30}%`,
                  fontSize: '1.8rem',
                  animationDelay: `${i * 1.1}s`,
                } as React.CSSProperties}
              >
                {char}
              </span>
            );
          }

          return null;
        })}

        {/* Overlay label */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
          <span className="text-[10px] tracking-[0.3em] uppercase text-parchment/30 font-serif">天氣 · TIĀNQÌ</span>
        </div>
      </div>

      {/* ── Oracle body ── */}
      <div className="bg-ink/95 px-4 pt-4 pb-5">

        {/* Idiom + condition */}
        <div className="text-center mb-4">
          <div className="text-3xl font-serif tracking-wider text-gold-leaf mb-0.5">{idiom}</div>
          <div className="text-xs text-parchment/50 italic tracking-wide">{pinyin}</div>
        </div>

        {/* Five Elements + Yin/Yang row */}
        <div className="flex justify-center gap-4 mb-4">
          <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg border border-current/20 bg-current/5 ${oracle.elementColor}`}>
            <span className="text-2xl font-serif leading-none">{oracle.elementHanzi}</span>
            <span className="text-[9px] mt-0.5 tracking-widest uppercase opacity-70">{oracle.elementName}</span>
          </div>
          <div className="flex flex-col items-center px-3 py-1.5 rounded-lg border border-parchment/10 bg-parchment/5 text-parchment/60">
            <span className="text-xs font-serif">{yinYang}</span>
            <span className="text-[9px] mt-0.5 tracking-widest uppercase opacity-70">{Math.round(temperature)}°C</span>
          </div>
          <div className="flex flex-col items-center px-3 py-1.5 rounded-lg border border-parchment/10 bg-parchment/5 text-parchment/50">
            <span className="text-[10px] font-serif leading-snug text-center">{windName.split(' ')[0]}</span>
            <span className="text-[9px] mt-0.5 opacity-60 tracking-wide">{Math.round(windSpeed)} km/h</span>
          </div>
        </div>

        {/* Official + dispatch */}
        <div className="rounded-lg border border-rose-900/30 bg-rose-950/20 px-3 py-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-serif text-gold-leaf">{oracle.official}</span>
            <span className="text-[9px] text-parchment/40 uppercase tracking-widest">{oracle.officialTitle}</span>
          </div>
          <p className="text-xs text-parchment/75 leading-relaxed italic">
            "{oracle.dispatch}"
          </p>
        </div>

        {/* Wind name full */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-parchment/30 tracking-widest">八風 · {windName}</span>
        </div>
      </div>
    </div>
  );
};

export default ChineseWeatherOracle;
