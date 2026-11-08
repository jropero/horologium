import React from 'react';
import { useCivilization, Civilization } from '../contexts/CivilizationContext';
import './BottomNav.css';

// Roman temple with pediment, entablature, and fluted columns
const RomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
    {/* Pediment triangle */}
    <path
      d="M4 11 L14 3 L24 11 Z"
      stroke="currentColor"
      strokeWidth={active ? 1.6 : 1.2}
      strokeLinejoin="round"
      fill="none"
    />
    {/* Entablature frieze */}
    <rect
      x="4"
      y="11"
      width="20"
      height="2.5"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    {/* Columns (4 fluted shafts) */}
    {[6, 10.5, 15, 19.5].map((x, i) => (
      <g key={i}>
        <rect
          x={x}
          y="13.5"
          width="2.5"
          height="9"
          stroke="currentColor"
          strokeWidth={active ? 1.2 : 0.9}
          fill="none"
        />
        {/* Single flute line */}
        <line
          x1={x + 1.25}
          y1="13.5"
          x2={x + 1.25}
          y2="22.5"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </g>
    ))}
    {/* Stylobate (stepped base) */}
    <rect
      x="3.5"
      y="22.5"
      width="21"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
    <rect
      x="2.5"
      y="24"
      width="23"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
  </svg>
);

// Greek Ionic column with volute capital and abacus
// eslint-disable-next-line sonarjs/cognitive-complexity
const HellasIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
    {/* Abacus (top slab) */}
    <rect
      x="6"
      y="3.5"
      width="16"
      height="2"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1.1}
      fill="none"
    />
    {/* Volute capital — two scrolls */}
    <path
      d="M8 5.5 Q6 7 7.5 8.5 Q9 10 10.5 8.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 5.5 Q22 7 20.5 8.5 Q19 10 17.5 8.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
      strokeLinecap="round"
    />
    {/* Echinus (egg-and-dart simplified as curved band) */}
    <path
      d="M8 9 Q14 10.5 20 9"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
    />
    {/* Shaft with entasis (slight curve) */}
    <path
      d="M10 10.5 Q9 18 9.5 23"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    <path
      d="M18 10.5 Q19 18 18.5 23"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    {/* Flutes (3 lines) */}
    {[11.5, 14, 16.5].map((x, i) => (
      <line
        key={i}
        x1={x}
        y1="11"
        x2={x}
        y2="22.5"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.55"
      />
    ))}
    {/* Torus base */}
    <path
      d="M8.5 23 Q14 24.5 19.5 23"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
    {/* Plinth */}
    <rect
      x="7"
      y="24.5"
      width="14"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
  </svg>
);

// Egyptian obelisk with pyramidion and cartouche band
// eslint-disable-next-line sonarjs/cognitive-complexity
const AegyptusIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
    {/* Pyramidion apex */}
    <path
      d="M14 2 L10.5 7.5 L17.5 7.5 Z"
      stroke="currentColor"
      strokeWidth={active ? 1.6 : 1.2}
      strokeLinejoin="round"
      fill="none"
    />
    {/* Obelisk shaft (wider, tapering) */}
    <path
      d="M10.5 7.5 L8.5 23 L19.5 23 L17.5 7.5 Z"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1.1}
      strokeLinejoin="round"
      fill="none"
    />
    {/* Cartouche (oval, prominent) */}
    <rect
      x="10.5"
      y="11"
      width="7"
      height="6"
      rx="3"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    {/* Wadjet eye — eyeball + pupil + brow line */}
    <ellipse
      cx="14"
      cy="13.8"
      rx="2.2"
      ry="1.3"
      stroke="currentColor"
      strokeWidth={active ? 1.1 : 0.85}
      fill="none"
    />
    <circle cx="14" cy="13.8" r="0.6" fill="currentColor" />
    {/* Tear-drop cosmetic line */}
    <path
      d="M16.2 14.5 Q15 15.8 14 15.5"
      stroke="currentColor"
      strokeWidth="0.7"
      fill="none"
      strokeLinecap="round"
    />
    {/* Base plinth */}
    <rect
      x="7.5"
      y="23"
      width="13"
      height="2"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    <rect
      x="6"
      y="25"
      width="16"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
  </svg>
);

// Chinese pagoda (3-tier) with upturned eaves
// eslint-disable-next-line sonarjs/cognitive-complexity
const ZhongguoIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
    {/* Spire */}
    <line
      x1="14"
      y1="2"
      x2="14"
      y2="6"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1.1}
      strokeLinecap="round"
    />
    <circle cx="14" cy="2" r="0.8" fill="currentColor" />
    {/* Top tier roof with upturned ends */}
    <path
      d="M9 9 Q14 6 19 9"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1.1}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M8 9 Q8 9.8 9 10"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 9 Q20 9.8 19 10"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
      strokeLinecap="round"
    />
    {/* Top tier body */}
    <rect
      x="11"
      y="9.5"
      width="6"
      height="3.5"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
    />
    {/* Mid tier roof */}
    <path
      d="M7 15.5 Q14 12.5 21 15.5"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1.1}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M6 15.5 Q6 16.5 7.5 17"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M22 15.5 Q22 16.5 20.5 17"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
      strokeLinecap="round"
    />
    {/* Mid tier body */}
    <rect
      x="10"
      y="16"
      width="8"
      height="3"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
    />
    {/* Base tier roof */}
    <path
      d="M5 21.5 Q14 18 23 21.5"
      stroke="currentColor"
      strokeWidth={active ? 1.5 : 1.1}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M4 21.5 Q4 22.5 6 23"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M24 21.5 Q24 22.5 22 23"
      stroke="currentColor"
      strokeWidth={active ? 1.2 : 0.9}
      fill="none"
      strokeLinecap="round"
    />
    {/* Base platform */}
    <rect
      x="8"
      y="22.5"
      width="12"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
    <rect
      x="6"
      y="24"
      width="16"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
  </svg>
);

// Babylonian ziggurat with 3 tiers and eight-pointed Ishtar star above
const BabiloniaIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
    {/* 8-pointed Ishtar star — two overlapping filled diamonds, stroked for crispness */}
    {/* Vertical diamond */}
    <path d="M14 1 L15.6 5.4 L14 9.8 L12.4 5.4 Z" fill="currentColor" opacity="0.9" />
    {/* Horizontal diamond */}
    <path d="M9.1 5.4 L13.5 3.8 L17.9 5.4 L13.5 7 Z" fill="currentColor" opacity="0.9" />
    {/* Diagonal diamonds for full 8-point */}
    <path d="M10.4 2.3 L14.3 4.6 L12 8.5 L12 4.6 Z" fill="currentColor" opacity="0.55" />
    <path d="M17.6 2.3 L13.7 4.6 L16 8.5 L16 4.6 Z" fill="currentColor" opacity="0.55" />
    {/* Outer ring for definition */}
    <circle
      cx="14"
      cy="5.4"
      r="4.6"
      stroke="currentColor"
      strokeWidth={active ? 1.0 : 0.7}
      fill="none"
      opacity="0.5"
    />
    {/* Ziggurat tier 1 (top/smallest) */}
    <rect
      x="11"
      y="13"
      width="6"
      height="3"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    {/* Tier 2 */}
    <rect
      x="8.5"
      y="16"
      width="11"
      height="3"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    {/* Tier 3 (base) */}
    <rect
      x="6"
      y="19"
      width="16"
      height="3.5"
      stroke="currentColor"
      strokeWidth={active ? 1.4 : 1.0}
      fill="none"
    />
    {/* Ground platform */}
    <rect
      x="4"
      y="22.5"
      width="20"
      height="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.3 : 1.0}
      fill="none"
    />
    {/* Staircase accent lines */}
    <line
      x1="13"
      y1="13"
      x2="12"
      y2="16"
      stroke="currentColor"
      strokeWidth="0.6"
      opacity="0.7"
    />
    <line
      x1="15"
      y1="13"
      x2="16"
      y2="16"
      stroke="currentColor"
      strokeWidth="0.6"
      opacity="0.7"
    />
  </svg>
);

const civs: {
  id: Civilization;
  Icon: React.FC<{ active: boolean }>;
  label: string;
}[] = [
  { id: 'rome', Icon: RomeIcon, label: 'Roma' },
  { id: 'hellas', Icon: HellasIcon, label: 'Ἑλλάς' },
  { id: 'aegyptus', Icon: AegyptusIcon, label: 'Kemet' },
  { id: 'babylonia', Icon: BabiloniaIcon, label: 'Bābilim' },
  { id: 'zhongguo', Icon: ZhongguoIcon, label: '中国' },
];

const BottomNav: React.FC = () => {
  const { civilization, setCivilization } = useCivilization();

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        <div className="tabs">
          {civs.map(({ id, Icon, label }) => {
            const isActive = civilization === id;
            return (
              <button
                key={id}
                data-civ={id}
                onClick={() => setCivilization(id)}
                className={`tab${isActive ? ' active' : ''}`}
              >
                {isActive && <div className="tab-indicator" />}
                <div className="tab-icon">
                  <Icon active={isActive} />
                </div>
                <span className="tab-label">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
