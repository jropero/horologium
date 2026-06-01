import React, { useMemo } from 'react';
import { SHICHEN_DATA, getCurrentShichen } from '../utils/chineseTimeUtils';

interface ChineseAnimalClockProps {
  modernTime: Date;
}

const ChineseAnimalClock: React.FC<ChineseAnimalClockProps> = ({ modernTime }) => {
  const { current, progressPercent } = useMemo(() => getCurrentShichen(modernTime), [modernTime]);

  const totalMinutes = modernTime.getHours() * 60 + modernTime.getMinutes();
  const needleRotation = (totalMinutes / (24 * 60)) * 360;

  // SVG Configuration
  const size = 300;
  const center = size / 2;
  const radius = 120;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-4 bg-ink/80 rounded-xl border border-rose-600/20 shadow-2xl">
      <h3 className="text-gold-leaf font-serif text-sm uppercase tracking-widest mb-4">时辰 · Shíchen</h3>
      
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mb-6">
        {/* Sectors */}
        {SHICHEN_DATA.map((shichen, index) => {
          const isActive = shichen.id === current.id;
          
          // Start angle for sector i: -15deg (Rat start) + index * 30deg
          const startAngle = -15 + index * 30;
          const endAngle = startAngle + 30;

          // Convert to radians for path
          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (endAngle - 90) * Math.PI / 180;

          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);

          // Text position
          const midAngle = (startAngle + endAngle) / 2;
          const textRad = (midAngle - 90) * Math.PI / 180;
          const textRadius = radius * 0.75;
          const tx = center + textRadius * Math.cos(textRad);
          const ty = center + textRadius * Math.sin(textRad);

          return (
            <g key={shichen.id}>
              {/* Sector Background */}
              <path
                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                fill={isActive ? '#e11d48' : '#1e1b4b'}
                fillOpacity={isActive ? 0.3 : 0.1}
                stroke={isActive ? '#fb7185' : '#475569'}
                strokeWidth={isActive ? 2 : 1}
              />
              {/* Emoji & Hanzi */}
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xl ${isActive ? 'fill-gold-leaf' : 'fill-gold-dim/50'}`}
                transform={`rotate(${midAngle} ${tx} ${ty})`}
              >
                {shichen.animalEmoji}
              </text>
              <text
                x={tx}
                y={ty + 18}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[10px] ${isActive ? 'fill-gold-leaf' : 'fill-gold-dim/50'}`}
                transform={`rotate(${midAngle} ${tx} ${ty + 18})`}
              >
                {shichen.branchHanzi}
              </text>
            </g>
          );
        })}

        {/* Center Needle */}
        <g transform={`rotate(${needleRotation} ${center} ${center})`}>
          <line x1={center} y1={center} x2={center} y2={center - radius + 30} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" />
          <circle cx={center} cy={center} r="6" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
        </g>
      </svg>

      {/* Info Card */}
      <div className="w-full bg-ink border border-rose-600/30 rounded-lg p-4 text-center">
        <div className="flex justify-between items-center mb-2">
            <span className="text-2xl">{current.animalEmoji}</span>
            <div className="text-right">
                <div className="text-gold-leaf font-bold text-lg">{current.branchHanzi} {current.animalHanzi}</div>
                <div className="text-rose-400 text-xs uppercase">{current.animalName}</div>
            </div>
        </div>
        
        <div className="text-sm text-gold-dim/70 mb-3 font-serif italic">
            {current.startHour.toString().padStart(2, '0')}:00 - {current.endHour.toString().padStart(2, '0')}:00
        </div>

        {/* Meaning block */}
        <div className="text-left bg-rose-900/10 border-l-2 border-rose-600/50 p-3 mb-4 rounded-r">
          <p className="text-xs text-parchment/80 italic font-serif leading-relaxed">
            <span className="font-bold text-rose-500 mr-1 not-italic tracking-wider uppercase text-[10px]">📜 Tradición:</span>
            {current.meaning}
          </p>
        </div>

        <div className="h-1.5 w-full bg-ink-dark rounded-full overflow-hidden border border-gold-dim/10">
            <div className="h-full bg-rose-600 transition-all duration-1000" style={{ width: `${progressPercent * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ChineseAnimalClock;
