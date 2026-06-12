import React, { useMemo } from 'react';
import { MayaDate } from '../utils/mayaCalendarUtils';
import { TZOLKIN_NAMES, HAAB_NAMES } from '../types/maya';

interface MayaCalendarGearsProps {
  mayaDate: MayaDate;
}

const Gear: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  cogs: number;
  cogDepth: number;
  rotation: number;
  color: string;
  labels: string[];
  isNumbers?: boolean;
}> = ({ cx, cy, radius, cogs, cogDepth, rotation, color, labels, isNumbers }) => {
  const points = useMemo(() => {
    let pts = '';
    const angleStep = (Math.PI * 2) / cogs;
    for (let i = 0; i < cogs; i++) {
      const angle = i * angleStep;
      const nextAngle = (i + 1) * angleStep;
      const midAngle1 = angle + angleStep * 0.2;
      const midAngle2 = angle + angleStep * 0.4;
      const midAngle3 = angle + angleStep * 0.6;
      const midAngle4 = angle + angleStep * 0.8;

      const r1 = radius - cogDepth;
      const r2 = radius;

      // Base point
      pts += `${cx + r1 * Math.cos(angle)},${cy + r1 * Math.sin(angle)} `;
      // Up to cog
      pts += `${cx + r1 * Math.cos(midAngle1)},${cy + r1 * Math.sin(midAngle1)} `;
      pts += `${cx + r2 * Math.cos(midAngle2)},${cy + r2 * Math.sin(midAngle2)} `;
      // Across cog
      pts += `${cx + r2 * Math.cos(midAngle3)},${cy + r2 * Math.sin(midAngle3)} `;
      // Down from cog
      pts += `${cx + r1 * Math.cos(midAngle4)},${cy + r1 * Math.sin(midAngle4)} `;
      pts += `${cx + r1 * Math.cos(nextAngle)},${cy + r1 * Math.sin(nextAngle)} `;
    }
    return pts;
  }, [cx, cy, radius, cogs, cogDepth]);

  return (
    <g transform={`rotate(${rotation} ${cx} ${cy})`} style={{ transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
      {/* Gear body */}
      <polygon points={points} fill="none" stroke={color} strokeWidth="2" className="drop-shadow-lg" />
      <circle cx={cx} cy={cy} r={radius - cogDepth - 5} fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <circle cx={cx} cy={cy} r={20} fill="none" stroke={color} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={5} fill={color} />
      
      {/* Center cross/spokes */}
      <line x1={cx - 20} y1={cy} x2={cx + 20} y2={cy} stroke={color} strokeWidth="2" />
      <line x1={cx} y1={cy - 20} x2={cx} y2={cy + 20} stroke={color} strokeWidth="2" />

      {/* Labels */}
      {labels.map((label, i) => {
        const angle = (i * (360 / cogs)) - 90; // Start at top
        const textRadius = radius - cogDepth - 20;
        const textCx = cx + textRadius * Math.cos(angle * (Math.PI / 180));
        const textCy = cy + textRadius * Math.sin(angle * (Math.PI / 180));
        
        return (
          <g key={i} transform={`translate(${textCx}, ${textCy}) rotate(${angle + 90})`}>
            <text 
              x="0" 
              y="0" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill={color} 
              fontSize={isNumbers ? "18" : "9"} 
              fontWeight="bold"
              className="font-serif uppercase"
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const MayaCalendarGears: React.FC<MayaCalendarGearsProps> = ({ mayaDate }) => {
  // SVG dimensions
  const width = 800;
  const height = 500;

  // Configuration for gears
  // We want the 13-gear to mesh with the 20-gear, and the 20-gear to mesh with the 19-gear (Haab abstraction)
  
  const cogs1 = 13;
  const cogs2 = 20;
  const cogs3 = 19; // 18 months + 1 Wayeb'

  // Radius is proportional to number of cogs for them to mesh properly
  const baseRadius = 8; 
  const r1 = cogs1 * baseRadius; // 104
  const r2 = cogs2 * baseRadius; // 160
  const r3 = cogs3 * baseRadius; // 152
  const cogDepth = 12;

  // Center points to make them interlock
  // Distance between centers should be rA + rB - cogDepth
  const cx1 = 150;
  const cy1 = 250;
  
  const cx2 = cx1 + r1 + r2 - cogDepth;
  const cy2 = 250;

  const cx3 = cx2 + r2 + r3 - cogDepth;
  const cy3 = 250;

  // Calculate rotations based on dates
  // Tzolk'in number (1-13)
  const numIndex = mayaDate.tzolkin.number - 1; 
  const angleStep1 = 360 / cogs1;
  const rotation1 = -(numIndex * angleStep1); // Negative so the top aligns

  // Tzolk'in name (1-20)
  const nameIndex = TZOLKIN_NAMES.indexOf(mayaDate.tzolkin.name);
  const angleStep2 = 360 / cogs2;
  // Meshing: If gear 1 turns +1 cog, gear 2 turns -1 cog.
  // Actually we just rotate to the correct index at the top.
  const rotation2 = -(nameIndex * angleStep2);

  // Haab' name (1-19)
  const haabIndex = HAAB_NAMES.indexOf(mayaDate.haab.name);
  const angleStep3 = 360 / cogs3;
  const rotation3 = -(haabIndex * angleStep3);

  // Generate labels
  const labels1 = Array.from({length: 13}, (_, i) => (i + 1).toString());
  
  return (
    <div className="w-full flex justify-center py-8 overflow-hidden bg-ink rounded-xl border-2 border-emerald-500/20 shadow-inner relative">
      <div className="absolute inset-0 woodcut-hatch opacity-10 pointer-events-none"></div>
      
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="max-w-4xl drop-shadow-2xl">
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Indicator arrows/markers */}
        <g stroke="white" strokeWidth="2" fill="none" opacity="0.8">
          {/* Top marker for Gear 1 */}
          <path d={`M${cx1},${cy1 - r1 - 15} L${cx1 - 10},${cy1 - r1 - 30} L${cx1 + 10},${cy1 - r1 - 30} Z`} fill="#10b981" stroke="none" />
          <text x={cx1} y={cy1 - r1 - 40} textAnchor="middle" fill="#10b981" fontSize="24" fontWeight="black" className="font-serif drop-shadow-md">{mayaDate.tzolkin.number}</text>

          {/* Top marker for Gear 2 */}
          <path d={`M${cx2},${cy2 - r2 - 15} L${cx2 - 10},${cy2 - r2 - 30} L${cx2 + 10},${cy2 - r2 - 30} Z`} fill="#34d399" stroke="none" />
          <text x={cx2} y={cy2 - r2 - 40} textAnchor="middle" fill="#34d399" fontSize="24" fontWeight="black" className="font-serif uppercase drop-shadow-md">{mayaDate.tzolkin.name}</text>

          {/* Top marker for Gear 3 */}
          <path d={`M${cx3},${cy3 - r3 - 15} L${cx3 - 10},${cy3 - r3 - 30} L${cx3 + 10},${cy3 - r3 - 30} Z`} fill="#f59e0b" stroke="none" />
          <text x={cx3} y={cy3 - r3 - 40} textAnchor="middle" fill="#f59e0b" fontSize="24" fontWeight="black" className="font-serif uppercase drop-shadow-md">{mayaDate.haab.number} {mayaDate.haab.name}</text>
        </g>

        <circle cx={cx1} cy={cy1} r={r1} fill="url(#glow1)" />
        <circle cx={cx2} cy={cy2} r={r2} fill="url(#glow2)" />
        <circle cx={cx3} cy={cy3} r={r3} fill="url(#glow3)" />

        <Gear 
          cx={cx1} cy={cy1} radius={r1} cogs={cogs1} cogDepth={cogDepth} 
          rotation={rotation1} color="#10b981" labels={labels1} isNumbers={true}
        />
        <Gear 
          cx={cx2} cy={cy2} radius={r2} cogs={cogs2} cogDepth={cogDepth} 
          rotation={rotation2} color="#34d399" labels={TZOLKIN_NAMES}
        />
        <Gear 
          cx={cx3} cy={cy3} radius={r3} cogs={cogs3} cogDepth={cogDepth} 
          rotation={rotation3} color="#f59e0b" labels={HAAB_NAMES}
        />

        <text x={cx1} y={cy1 + r1 + 30} textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold" className="font-serif tracking-widest uppercase">Números</text>
        <text x={cx2} y={cy2 + r2 + 30} textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold" className="font-serif tracking-widest uppercase">Tzolk'in</text>
        <text x={cx3} y={cy3 + r3 + 30} textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold" className="font-serif tracking-widest uppercase">Haab'</text>
      </svg>
    </div>
  );
};

export default MayaCalendarGears;
