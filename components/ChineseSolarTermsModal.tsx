import React from 'react';
import { SOLAR_TERMS } from '../utils/chineseCalendarData';
import './ChineseSolarTermsModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTermIndex: number;
}

const ChineseSolarTermsModal: React.FC<Props> = ({ isOpen, onClose, currentTermIndex }) => {
  if (!isOpen) return null;

  const seasons = [
    { name: 'Primavera', seasonKey: 'spring', terms: SOLAR_TERMS.slice(0, 6) },
    { name: 'Verano', seasonKey: 'summer', terms: SOLAR_TERMS.slice(6, 12) },
    { name: 'Otoño', seasonKey: 'autumn', terms: SOLAR_TERMS.slice(12, 18) },
    { name: 'Invierno', seasonKey: 'winter', terms: SOLAR_TERMS.slice(18, 24) },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      className="chinese-solar-terms-modal"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <div role="presentation" className="cstm__inner" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="cstm__close-btn">
          ✕
        </button>

        <h2 className="cstm__title">24 Términos Solares</h2>

        <div className="cstm__seasons-grid">
          {seasons.map((season, sIdx) => (
            <div key={season.name} className={`cstm__season cstm__season--${season.seasonKey}`}>
              <h3 className="cstm__season-heading">{season.name}</h3>
              <div className="cstm__terms-grid">
                {season.terms.map((term, tIdx) => {
                  const globalIndex = sIdx * 6 + tIdx;
                  const isActive = globalIndex === currentTermIndex;
                  const isPast = globalIndex < currentTermIndex;

                  return (
                    <div
                      key={term.id}
                      className={[
                        'cstm__term',
                        isActive ? 'cstm__term--active' : 'cstm__term--inactive',
                        isPast ? 'cstm__term--past' : '',
                      ]
                        .join(' ')
                        .trim()}
                    >
                      <div className="cstm__term-header">
                        <span className="cstm__term-hanzi">{term.hanzi}</span>
                        <span className="cstm__term-pinyin">{term.pinyin}</span>
                      </div>
                      <div className="cstm__term-translation">{term.translation}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChineseSolarTermsModal;
