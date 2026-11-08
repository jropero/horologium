import React from 'react';
import { SOLAR_TERMS } from '../utils/chineseCalendarData';
import './ChineseYearCycle.css';

interface Props {
  currentTermIndex: number;
}

const ChineseYearCycle: React.FC<Props> = ({ currentTermIndex }) => {
  const seasons = [
    { name: 'Primavera', key: 'spring', terms: SOLAR_TERMS.slice(0, 6) },
    { name: 'Verano', key: 'summer', terms: SOLAR_TERMS.slice(6, 12) },
    { name: 'Otoño', key: 'autumn', terms: SOLAR_TERMS.slice(12, 18) },
    { name: 'Invierno', key: 'winter', terms: SOLAR_TERMS.slice(18, 24) },
  ];

  return (
    <div className="chinese-year-cycle">
      <h3 className="cyc__heading">Ciclo del Año 节气</h3>
      <div className="cyc__seasons-grid">
        {seasons.map((season, sIdx) => (
          <div key={season.name} className="cyc__season">
            <h4 className={`cyc__season-heading cyc__season-heading--${season.key}`}>
              {season.name}
            </h4>
            <div className="cyc__terms-list">
              {season.terms.map((term, tIdx) => {
                const globalIndex = sIdx * 6 + tIdx;
                const isActive = globalIndex === currentTermIndex;
                const isPast = globalIndex < currentTermIndex;

                const termClasses = [
                  'cyc__term',
                  isActive ? `cyc__term--active cyc__term--active-${season.key}` : '',
                  isPast ? 'cyc__term--past' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div key={term.id} className={termClasses}>
                    <span className="cyc__term-id">{term.id}</span>
                    <span className="cyc__term-hanzi">{term.hanzi}</span>
                    <span className="cyc__term-translation">{term.translation}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChineseYearCycle;
