import React from 'react';
import { SolarTerm, ChineseCustom } from '../utils/chineseCalendarData';
import './ChineseCalendarInfo.css';

interface Props {
  term: SolarTerm;
  pentad: number;
}

const CustomCard: React.FC<{ custom: ChineseCustom }> = ({ custom }) => (
  <div className="cci-custom-card">
    <div className="cci-custom-card-header">
      <span className="cci-custom-card-icon">{custom.icon}</span>
      <div>
        <h4 className="cci-custom-card-name">{custom.title}</h4>
        <span className="cci-custom-card-type">{custom.type}</span>
      </div>
    </div>
    <p className="cci-custom-card-desc">
      {'"'}
      {custom.description}
      {'"'}
    </p>
  </div>
);

const ChineseCalendarInfo: React.FC<Props> = ({ term, pentad }) => {
  return (
    <div className="chinese-calendar-info">
      {/* Cabecera */}
      <div className="cci-header">
        <h2 className="cci-title">
          {term.hanzi} {term.pinyin}
        </h2>
        <p className="cci-translation">{term.translation}</p>
      </div>

      {/* Progreso de Pentadas */}
      <div className="cci-pentads">
        <div className="cci-pentad-labels">
          <span>1ª Pentada</span>
          <span>2ª Pentada</span>
          <span>3ª Pentada</span>
        </div>
        <div className="cci-pentad-bar">
          {[1, 2, 3].map(p => (
            <div
              key={p}
              className={`cci-pentad-segment${
                pentad >= p ? ' cci-pentad-segment--active' : ''
              }`}
            />
          ))}
        </div>

        {/* Elevated omen */}
        <div className="cci-omen">
          <div className="cci-omen-label">{pentad}ª Pentada · Fenómeno</div>
          <p className="cci-omen-text">
            {'"'}
            {term.pentads[pentad - 1]?.description || 'Sin datos'}
            {'"'}
          </p>
        </div>
      </div>

      {/* Sección de Ritos */}
      <div className="cci-rites">
        <h3 className="cci-rites-title">🏮 Ritos y Costumbres</h3>
        <div className="cci-customs-list">
          {term.customs.map((c, i) => (
            <CustomCard key={i} custom={c} />
          ))}
        </div>
      </div>

      {/* Sección Cultural Menor */}
      <div className="cci-grid">
        <div className="cci-flavors">
          <h4 className="cci-flavors-title">🥢 Sabores</h4>
          <ul className="cci-flavors-list">
            {term.traditionalFoods.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="cci-advice">
          <h4 className="cci-advice-title">🧘 Consejo</h4>
          <p className="cci-advice-text">{term.healthAdvice}</p>
        </div>
      </div>

      {/* Lunar reckoning note */}
      <div className="cci-footnote">
        <p className="cci-footnote-text">
          月朔 (día 1) coincide con la conjunción astronómica exacta — el instante de luna
          nueva. Este cómputo puede diferir ~2 días del calendario griego ático, que usa el
          primer creciente visible.
        </p>
      </div>
    </div>
  );
};

export default ChineseCalendarInfo;
