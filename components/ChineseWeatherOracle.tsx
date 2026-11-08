import React, { useMemo } from 'react';
import { WeatherData, WeatherCondition } from '../types';
import './ChineseWeatherOracle.css';

// ─── Celestial Bureaucracy Oracle Data ───────────────────────────────────────

interface ConditionOracle {
  chars: string[];
  charColor: string; // CSS color value
  charAnimation:
    | 'fall'
    | 'drift-slow'
    | 'drift-fast'
    | 'float'
    | 'dragon'
    | 'glow'
    | 'lightning';
  skyGradient: string; // CSS gradient value
  elementHanzi: string;
  elementName: string;
  elementColor: string; // CSS color value
  official: string;
  officialTitle: string;
  dispatch: string;
}

const ORACLE: Record<WeatherCondition, ConditionOracle> = {
  clear: {
    chars: ['日', '光', '曦'],
    charColor: '#fcd34d',
    charAnimation: 'glow',
    skyGradient:
      'linear-gradient(to bottom, rgb(69 26 3 / 80%), rgb(124 45 18 / 60%), rgb(8 47 73 / 80%))',
    elementHanzi: '金',
    elementName: 'Metal',
    elementColor: '#fcd34d',
    official: '太陽星官',
    officialTitle: 'Oficial Estelar Solar',
    dispatch:
      '太陽星官 certifica: el Qi de esta jornada fluye limpio y ascendente. El Dragon Rey se ha tomado el día libre sin avisar. Se investiga el asunto.',
  },
  cloudy: {
    chars: ['雲', '雲', '雲', '雲'],
    charColor: '#cbd5e1',
    charAnimation: 'drift-slow',
    skyGradient:
      'linear-gradient(to bottom, rgb(30 41 59 / 90%), rgb(41 37 36 / 70%), rgb(15 23 42 / 90%))',
    elementHanzi: '土',
    elementName: 'Tierra',
    elementColor: '#a8a29e',
    official: '雲師',
    officialTitle: 'Maestro de las Nubes',
    dispatch:
      '雲師 informa: las nubes están siendo reordenadas según el nuevo protocolo del Ministerio del Cielo. Ni lluvia confirmada ni sol garantizado. Mantenga expectativas moderadas.',
  },
  'partly-cloudy': {
    chars: ['雲', '雲'],
    charColor: '#cbd5e1',
    charAnimation: 'drift-slow',
    skyGradient:
      'linear-gradient(to bottom, rgb(30 41 59 / 90%), rgb(41 37 36 / 70%), rgb(15 23 42 / 90%))',
    elementHanzi: '土',
    elementName: 'Tierra',
    elementColor: '#fcd34d',
    official: '雲師',
    officialTitle: 'Maestro de las Nubes',
    dispatch:
      '雲師 y 太陽星官 comparten el cielo por turnos. Las nubes cubren el sol de manera intermitente; el Ministerio del Cielo pide disculpas por la falta de decisión.',
  },
  rain: {
    chars: ['雨', '雨', '雨', '雨', '雨', '雨', '雨', '雨'],
    charColor: '#93c5fd',
    charAnimation: 'fall',
    skyGradient:
      'linear-gradient(to bottom, rgb(30 41 59 / 90%), rgb(30 58 95 / 70%), rgb(2 6 23 / 90%))',
    elementHanzi: '水',
    elementName: 'Agua',
    elementColor: '#93c5fd',
    official: '龍王',
    officialTitle: 'Rey Dragón',
    dispatch:
      '龍王 ha aprobado la solicitud de lluvia nº 47 del Ministerio Agrícola. Declara que los mortales no agradecen suficientemente su trabajo. Llueve de todos modos.',
  },
  storm: {
    chars: ['雷', '龍', '電', '雷'],
    charColor: '#fb7185',
    charAnimation: 'dragon',
    skyGradient:
      'linear-gradient(to bottom, rgb(24 24 27 / 90%), rgb(15 23 42 / 90%), rgb(9 9 11 / 90%))',
    elementHanzi: '木',
    elementName: 'Madera',
    elementColor: '#fb7185',
    official: '雷公電母',
    officialTitle: 'Duque del Trueno y Señora del Relámpago',
    dispatch:
      '雷公電母 emiten aviso conjunto: disputa matrimonial activa en el Ministerio del Trueno. El Dragon Rey aprovecha el caos para añadir lluvia extra sin permiso. Quédese en casa.',
  },
  snow: {
    chars: ['雪', '雪', '雪', '雪', '雪'],
    charColor: '#e0f2fe',
    charAnimation: 'fall',
    skyGradient:
      'linear-gradient(to bottom, rgb(51 65 85 / 80%), rgb(12 74 110 / 70%), rgb(15 23 42 / 90%))',
    elementHanzi: '水',
    elementName: 'Agua',
    elementColor: '#bae6fd',
    official: '雪官',
    officialTitle: 'Oficial de la Nieve',
    dispatch:
      '雪官 declara: la nieve es un augurio auspicioso y un regalo del Cielo. Queda terminantemente prohibido quejarse del frío. (El 雪官 trabaja desde la corte celestial del sur.)',
  },
  fog: {
    chars: ['霧', '雲', '霧'],
    charColor: '#d6d3d1',
    charAnimation: 'drift-slow',
    skyGradient:
      'linear-gradient(to bottom, rgb(68 64 60 / 70%), rgb(41 37 36 / 80%), rgb(28 25 23 / 90%))',
    elementHanzi: '土',
    elementName: 'Tierra',
    elementColor: '#d6d3d1',
    official: '霧神',
    officialTitle: 'Espíritu de la Niebla',
    dispatch:
      '霧神 comunica: los espíritus de la montaña celebran reunión privada. La niebla es la cortina oficial. Se ruega no mirar ni fotografiar. Gracias.',
  },
};

// ─── Deterministic particle positions ────────────────────────────────────────

interface Particle {
  x: number;
  dur: number;
  delay: number;
  drift: number;
  size: number;
}

function makeParticles(count: number, seed = 42): Particle[] {
  // Simple LCG for deterministic "random" positions
  let s = seed;
  const rng = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  return Array.from({ length: count }, () => ({
    x: rng() * 90 + 2,
    dur: 4 + rng() * 4,
    delay: -(rng() * 8),
    drift: (rng() - 0.5) * 12,
    size: 0.85 + rng() * 0.6,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  weather: WeatherData;
}

const ChineseWeatherOracle: React.FC<Props> = ({ weather }) => {
  const { condition, windSpeed, temperature } = weather.current;
  const chineseDesc = weather.current.chineseDescription ?? '天氣未詳';
  const windName = weather.current.chineseWindName ?? '風 Fēng';
  const oracle = ORACLE[condition];

  const particles = useMemo(
    () => makeParticles(oracle.chars.length * 2 + 2),
    [oracle.chars.length],
  );

  // eslint-disable-next-line sonarjs/no-nested-conditional
  const yinYang = temperature > 22 ? '陽 Yang' : temperature < 5 ? '陰 Yin' : '陰陽 Equilibrio';

  // Split chineseDesc at space — first token is the 4-char idiom, rest is pinyin
  const [idiom, ...pinyinParts] = chineseDesc.split(' ');
  const pinyin = pinyinParts.join(' ');

  return (
    <div className="chinese-weather-oracle">
      {/* ── Animated sky panel ── */}
      <div className="cwo__sky-panel" style={{ background: oracle.skyGradient }}>
        {/* Floating / drifting / falling characters */}
        {/* eslint-disable sonarjs/cognitive-complexity */}
        {oracle.chars.map((char, i) => {
          const p = particles[i] ?? particles[0];
          const anim = oracle.charAnimation;

          if (anim === 'fall') {
            return (
              <span
                key={i}
                className="cwo__char anim-fall"
                style={
                  {
                    color: oracle.charColor,
                    left: `${p.x}%`,
                    top: '-1.5rem',
                    fontSize: `${p.size * 1.4}rem`,
                    opacity: 0.85,
                    '--dur': `${p.dur}s`,
                    '--drift': `${p.drift}px`,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties
                }
              >
                {char}
              </span>
            );
          }

          if (anim === 'drift-slow' || anim === 'drift-fast') {
            return (
              <span
                key={i}
                className={`cwo__char ${
                  anim === 'drift-fast' ? 'anim-cloud-fast' : 'anim-cloud-slow'
                }`}
                style={
                  {
                    color: oracle.charColor,
                    left: `${p.x}%`,
                    top: `${15 + (i % 3) * 22}%`,
                    fontSize: `${p.size * 1.8}rem`,
                    opacity: 0.45 + (i % 2) * 0.2,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties
                }
              >
                {char}
              </span>
            );
          }

          if (anim === 'glow') {
            return (
              <span
                key={i}
                className="cwo__char anim-glow-pulse anim-float"
                style={
                  {
                    color: oracle.charColor,
                    left: `${15 + i * 28}%`,
                    top: '20%',
                    fontSize: `${2.2 + i * 0.3}rem`,
                    animationDelay: `${i * 0.8}s`,
                  } as React.CSSProperties
                }
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
                  className="cwo__char anim-dragon"
                  style={
                    {
                      color: '#fda4af',
                      top: '30%',
                      left: 0,
                      fontSize: '2rem',
                      '--dragon-dur': '13s',
                      animationDelay: `${i * 2}s`,
                    } as React.CSSProperties
                  }
                >
                  🐉
                </span>
              );
            }
            return (
              <span
                key={i}
                className="cwo__char anim-lightning"
                style={
                  {
                    color: oracle.charColor,
                    left: `${20 + i * 22}%`,
                    top: `${10 + (i % 2) * 30}%`,
                    fontSize: '1.8rem',
                    animationDelay: `${i * 1.1}s`,
                  } as React.CSSProperties
                }
              >
                {char}
              </span>
            );
          }

          return null;
        })}

        {/* Overlay label */}
        <div className="cwo__sky-overlay-label">
          <span className="cwo__sky-label-text">天氣 · TIĀNQÌ</span>
        </div>
      </div>

      {/* ── Oracle body ── */}
      <div className="cwo__body">
        {/* Idiom + condition */}
        <div className="cwo__idiom-section">
          <div className="cwo__idiom">{idiom}</div>
          <div className="cwo__pinyin">{pinyin}</div>
        </div>

        {/* Five Elements + Yin/Yang row */}
        <div className="cwo__badges">
          <div className="cwo__badge cwo__element-badge" style={{ color: oracle.elementColor }}>
            <span className="cwo__badge-hanzi">{oracle.elementHanzi}</span>
            <span className="cwo__badge-label">{oracle.elementName}</span>
          </div>
          <div className="cwo__badge cwo__neutral-badge">
            <span className="cwo__badge-yin-yang">{yinYang}</span>
            <span className="cwo__badge-temp">{Math.round(temperature)}°C</span>
          </div>
          <div className="cwo__badge cwo__wind-badge">
            <span className="cwo__badge-wind-name">{windName.split(' ')[0]}</span>
            <span className="cwo__badge-wind-speed">{Math.round(windSpeed)} km/h</span>
          </div>
        </div>

        {/* Official + dispatch */}
        <div className="cwo__dispatch">
          <div className="cwo__official-row">
            <span className="cwo__official-name">{oracle.official}</span>
            <span className="cwo__official-title">{oracle.officialTitle}</span>
          </div>
          <p className="cwo__dispatch-text">
            {'"'}
            {oracle.dispatch}
            {'"'}
          </p>
        </div>

        {/* Wind name full */}
        <div className="cwo__wind-footer">
          <span className="cwo__wind-footer-text">八風 · {windName}</span>
        </div>
      </div>
    </div>
  );
};

export default ChineseWeatherOracle;
