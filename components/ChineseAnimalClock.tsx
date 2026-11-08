import React, { useMemo } from 'react';
import { SHICHEN_DATA, getCurrentShichen } from '../utils/chineseTimeUtils';
import './ChineseAnimalClock.css';

interface ChineseAnimalClockProps {
  modernTime: Date;
}

const ChineseAnimalClock: React.FC<ChineseAnimalClockProps> = ({ modernTime }) => {
  const { current, progressPercent } = useMemo(
    () => getCurrentShichen(modernTime),
    [modernTime],
  );

  const totalMinutes = modernTime.getHours() * 60 + modernTime.getMinutes();
  const needleRotation = (totalMinutes / (24 * 60)) * 360;

  // SVG Configuration
  const size = 300;
  const center = size / 2;
  const radius = 120;

  return (
    <div className="chinese-animal-clock">
      <h3 className="chinese-animal-clock__heading">时辰 · Shíchen</h3>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="chinese-animal-clock__svg"
      >
        {/* Sectors */}
        {SHICHEN_DATA.map((shichen, index) => {
          const isActive = shichen.id === current.id;

          // Start angle for sector i: -15deg (Rat start) + index * 30deg
          const startAngle = -15 + index * 30;
          const endAngle = startAngle + 30;

          // Convert to radians for path
          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;

          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);

          // Text position
          const midAngle = (startAngle + endAngle) / 2;
          const textRad = ((midAngle - 90) * Math.PI) / 180;
          const textRadius = radius * 0.75;
          const tx = center + textRadius * Math.cos(textRad);
          const ty = center + textRadius * Math.sin(textRad);

          return (
            <g key={shichen.id}>
              {/* Sector Background */}
              <path
                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                className={isActive ? 'cac__sector--active' : 'cac__sector--inactive'}
                strokeWidth={isActive ? 2 : 1}
              />
              {/* Emoji & Hanzi */}
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`cac__emoji-text ${
                  isActive ? 'cac__emoji-text--active' : 'cac__emoji-text--inactive'
                }`}
                transform={`rotate(${midAngle} ${tx} ${ty})`}
              >
                {shichen.animalEmoji}
              </text>
              <text
                x={tx}
                y={ty + 18}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`cac__branch-text ${
                  isActive ? 'cac__branch-text--active' : 'cac__branch-text--inactive'
                }`}
                transform={`rotate(${midAngle} ${tx} ${ty + 18})`}
              >
                {shichen.branchHanzi}
              </text>
            </g>
          );
        })}

        {/* Center Needle */}
        <g transform={`rotate(${needleRotation} ${center} ${center})`}>
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius + 30}
            className="cac__needle-line"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx={center}
            cy={center}
            r="6"
            className="cac__needle-center"
            strokeWidth="2"
          />
        </g>
      </svg>

      {/* Info Card */}
      <div className="chinese-animal-clock__info-card">
        <div className="chinese-animal-clock__info-header">
          <span className="chinese-animal-clock__emoji">{current.animalEmoji}</span>
          <div className="chinese-animal-clock__info-right">
            <div className="chinese-animal-clock__name">
              {current.branchHanzi} {current.animalHanzi}
            </div>
            <div className="chinese-animal-clock__animal-label">{current.animalName}</div>
          </div>
        </div>

        <div className="chinese-animal-clock__time-range">
          {current.startHour.toString().padStart(2, '0')}:00 —{' '}
          {current.endHour.toString().padStart(2, '0')}:00
        </div>

        {/* Meaning block */}
        <div className="chinese-animal-clock__meaning-block">
          <p className="chinese-animal-clock__meaning-text">
            <span className="chinese-animal-clock__tradition-label">📜 Tradición:</span>
            {current.meaning}
          </p>
        </div>

        <div className="chinese-animal-clock__progress-track">
          <div
            className="chinese-animal-clock__progress-fill"
            style={{ width: `${progressPercent * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChineseAnimalClock;
