import React from 'react';
import { STEMS, BRANCHES } from '../utils/chineseLunisolarUtils';
import './SexagenaryCycleCard.css';

interface ElementChip {
  bgColor: string;
  borderColor: string;
  color: string;
  label: string;
}

const ELEMENT_CHIP: Record<string, ElementChip> = {
  木: {
    bgColor: 'rgb(16 185 129 / 15%)',
    borderColor: 'rgb(16 185 129 / 30%)',
    color: '#6ee7b7',
    label: 'Madera',
  },
  火: {
    bgColor: 'rgb(239 68 68 / 15%)',
    borderColor: 'rgb(239 68 68 / 30%)',
    color: '#fca5a5',
    label: 'Fuego',
  },
  土: {
    bgColor: 'rgb(245 158 11 / 15%)',
    borderColor: 'rgb(245 158 11 / 30%)',
    color: '#fcd34d',
    label: 'Tierra',
  },
  金: {
    bgColor: 'rgb(234 179 8 / 15%)',
    borderColor: 'rgb(234 179 8 / 30%)',
    color: '#fde047',
    label: 'Metal',
  },
  水: {
    bgColor: 'rgb(6 182 212 / 15%)',
    borderColor: 'rgb(6 182 212 / 30%)',
    color: '#67e8f9',
    label: 'Agua',
  },
};

interface SexagenaryCycleCardProps {
  yearStemIndex: number;
  yearBranchIndex: number;
  monthStemIndex: number;
  monthBranchIndex: number;
  dayStemIndex: number;
  dayBranchIndex: number;
}

const SexagenaryCycleCard: React.FC<SexagenaryCycleCardProps> = ({
  yearStemIndex,
  yearBranchIndex,
  monthStemIndex,
  monthBranchIndex,
  dayStemIndex,
  dayBranchIndex,
}) => {
  return (
    <div className="sexagenary-cycle-card">
      {/* Header */}
      <div className="scc__header">
        <div className="scc__header-title">天干地支</div>
        <div className="scc__header-subtitle">CICLO SEXAGENARIO</div>
      </div>

      <div className="scc__content">
        {/* Heavenly Stems */}
        <div>
          <div className="scc__section-heading-row">
            <span className="scc__section-hanzi">天干</span>
            <span className="scc__section-sub">TRONCOS CELESTIALES</span>
          </div>
          <div className="scc__chip-grid">
            {STEMS.map((s, i) => {
              const isActive =
                i === yearStemIndex || i === monthStemIndex || i === dayStemIndex;
              const chip = ELEMENT_CHIP[s.elementHanzi];
              return (
                <div
                  key={s.hanzi}
                  className={`scc__stem-chip ${
                    isActive ? 'scc__stem-chip--active' : 'scc__stem-chip--inactive'
                  }`}
                  style={
                    isActive
                      ? ({
                          '--chip-bg': chip.bgColor,
                          '--chip-border': chip.borderColor,
                          '--chip-text': chip.color,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <span className="scc__chip-hanzi">{s.hanzi}</span>
                  <span className="scc__chip-pinyin">{s.pinyin}</span>
                  <span className="scc__chip-element">{s.elementEs}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earthly Branches */}
        <div>
          <div className="scc__section-heading-row">
            <span className="scc__section-hanzi">地支</span>
            <span className="scc__section-sub">RAMAS TERRESTRES</span>
          </div>
          <div className="scc__chip-grid">
            {BRANCHES.map((b, i) => {
              const isActive =
                i === yearBranchIndex || i === monthBranchIndex || i === dayBranchIndex;
              const chip = ELEMENT_CHIP[b.elementHanzi];
              return (
                <div
                  key={b.hanzi}
                  className={`scc__branch-chip ${
                    isActive ? 'scc__branch-chip--active' : 'scc__branch-chip--inactive'
                  }`}
                  style={
                    isActive
                      ? ({
                          '--chip-bg': chip.bgColor,
                          '--chip-border': chip.borderColor,
                          '--chip-text': chip.color,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <div className="scc__branch-inner">
                    <span className="scc__branch-hanzi">{b.hanzi}</span>
                    <span className="scc__branch-animal">{b.animal}</span>
                  </div>
                  <span className="scc__branch-pinyin">
                    {b.pinyin} {b.animalEs}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current cycle summary */}
        <div className="scc__summary">
          <span className="scc__summary-label">Año</span>
          <span className="scc__summary-value">
            {STEMS[yearStemIndex].hanzi}
            {BRANCHES[yearBranchIndex].hanzi}
          </span>
          <span className="scc__summary-dot">·</span>
          <span className="scc__summary-label">Mes</span>
          <span className="scc__summary-value">
            {STEMS[monthStemIndex].hanzi}
            {BRANCHES[monthBranchIndex].hanzi}
          </span>
          <span className="scc__summary-dot">·</span>
          <span className="scc__summary-label">Día</span>
          <span className="scc__summary-value">
            {STEMS[dayStemIndex].hanzi}
            {BRANCHES[dayBranchIndex].hanzi}
          </span>
        </div>

        {/* 五行 Element legend */}
        <div>
          <div className="scc__section-heading-row">
            <span className="scc__section-hanzi">五行</span>
            <span className="scc__section-sub">CINCO ELEMENTOS</span>
          </div>
          <div className="scc__legend-grid">
            {Object.entries(ELEMENT_CHIP).map(([el, c]) => (
              <div
                key={el}
                className="scc__legend-item"
                style={{
                  backgroundColor: c.bgColor,
                  borderColor: c.borderColor,
                }}
              >
                <div className="scc__legend-dot" style={{ backgroundColor: c.color }} />
                <span className="scc__legend-hanzi" style={{ color: c.color }}>
                  {el}
                </span>
                <span className="scc__legend-label" style={{ color: c.color }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cycle explanation */}
        <div className="scc__explanation">
          <p className="scc__explanation-text">
            10 troncos × 12 ramas = 60 combinaciones · Ciclo de 60 años, meses, días y horas
            (Shíchen)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SexagenaryCycleCard;
