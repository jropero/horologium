import React, { useState, useCallback } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { getRandomSors, SorsVergiliana } from '../utils/sortesVergilianae';
import { getRandomDiosemeia, Diosemeia } from '../utils/diosemeiaData';
import { EGYPTIAN_WISDOM, EgyptianWisdom } from '../utils/egyptianWisdomData';
import { useCivilization } from '../contexts/CivilizationContext';
import './SortesVergilianae.css';

// eslint-disable-next-line sonarjs/cognitive-complexity
const SortesVergilianae: React.FC = () => {
  const { civilization, labels } = useCivilization();
  const [sors, setSors] = useState<SorsVergiliana | null>(null);
  const [diosemeia, setDiosemeia] = useState<Diosemeia | null>(null);
  const [sorsAegyptiaca, setSorsAegyptiaca] = useState<EgyptianWisdom | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasConsulted, setHasConsulted] = useState(false);

  const handleConsult = useCallback(() => {
    setIsRevealing(true);
    setSors(null);
    setDiosemeia(null);
    setSorsAegyptiaca(null);

    // Small delay for dramatic effect
    setTimeout(() => {
      if (civilization === 'rome') {
        setSors(getRandomSors());
      } else if (civilization === 'hellas') {
        setDiosemeia(getRandomDiosemeia());
      } else {
        const randomIndex = Math.floor(Math.random() * EGYPTIAN_WISDOM.length);
        setSorsAegyptiaca(EGYPTIAN_WISDOM[randomIndex]);
      }
      setIsRevealing(false);
      setHasConsulted(true);
    }, 800);
  }, [civilization]);

  const currentSors = civilization === 'rome' ? sors : null;
  const currentDiosemeia = civilization === 'hellas' ? diosemeia : null;
  const currentAegyptiaca = civilization === 'aegyptus' ? sorsAegyptiaca : null;
  const hasSors = currentSors || currentDiosemeia || currentAegyptiaca;

  return (
    <div className="sortes-vergilianae animate-fadeIn">
      <div
        className={`sv-card${civilization !== 'aegyptus' ? ' sv-card--default' : ''}`}
        style={
          civilization === 'aegyptus'
            ? {
                background: '#0c0804',
                borderColor: 'rgba(24,64,160,0.45)',
                borderRadius: '2px',
              }
            : undefined
        }
      >
        {civilization !== 'aegyptus' && <div className="sv-hatch woodcut-hatch"></div>}

        {/* Header */}
        <div className="sv-header">
          <div className="sv-header-left">
            <BookOpen />
            <span className="sv-header-title">{labels.oracleTitle}</span>
          </div>
          <span className="sv-header-subtitle">{labels.oracleSubtitle}</span>
        </div>

        {/* Oracle content */}
        <div className="sv-content">
          {/* Revealed verse — Roman */}
          {currentSors && !isRevealing && (
            <div className="sv-roman-verse animate-fadeIn">
              <blockquote className="sv-blockquote">«{currentSors.latin}»</blockquote>
              <div className="sv-divider"></div>
              <p className="sv-translation">{currentSors.spanish}</p>
              <cite className="sv-source">— {currentSors.source} —</cite>
            </div>
          )}

          {/* Revealed omen — Greek (Diosemeia) */}
          {currentDiosemeia && !isRevealing && (
            <div className="sv-greek-omen animate-fadeIn">
              {/* Esquinas ornamentales */}
              <div className="sv-omen-corner sv-omen-corner--tl"></div>
              <div className="sv-omen-corner sv-omen-corner--tr"></div>
              <div className="sv-omen-corner sv-omen-corner--bl"></div>
              <div className="sv-omen-corner sv-omen-corner--br"></div>

              <div className="sv-omen-header">
                <span className="sv-omen-icon animate-pulse">🌩️</span>
                <span className="sv-omen-label">Diosemeia</span>
                <span className="sv-omen-sublabel">(Señal Divina)</span>
              </div>

              <div className="sv-omen-quote-wrapper">
                <span className="sv-omen-quote-mark">«</span>
                <p className="sv-omen-event">{currentDiosemeia.event}</p>
              </div>

              <div className="sv-omen-sky-divider"></div>

              <div className="sv-omen-meaning">
                <span className="sv-omen-meaning-label">Pronóstico del Oráculo:</span>
                <p className="sv-omen-meaning-text">{currentDiosemeia.meaning}</p>
              </div>

              <cite className="sv-omen-source">— {currentDiosemeia.source} —</cite>
            </div>
          )}

          {/* Revealed verse — Egyptian */}
          {currentAegyptiaca && !isRevealing && (
            <div className="sv-egyptian-verse animate-fadeIn">
              <blockquote className="sv-blockquote">«{currentAegyptiaca.text}»</blockquote>
              <div className="sv-egyptian-divider"></div>
              <cite className="sv-source">— {currentAegyptiaca.author} —</cite>
              <p className="sv-egyptian-note">({currentAegyptiaca.source})</p>
            </div>
          )}

          {/* Loading state */}
          {isRevealing && (
            <div className="sv-loading">
              <Sparkles className="animate-spin" />
              <span className="sv-loading-text animate-pulse">{labels.oracleConsulting}</span>
            </div>
          )}

          {/* Initial state */}
          {!hasSors && !isRevealing && (
            <div className="sv-initial">
              <div className="sv-book-circle">
                <BookOpen />
              </div>
              <p className="sv-prompt">{labels.oraclePrompt}</p>
            </div>
          )}

          {/* Consult button */}
          <button onClick={handleConsult} disabled={isRevealing} className="sv-consult-btn">
            <span className="sv-consult-btn-inner">
              <BookOpen className="sv-consult-icon" />
              {hasConsulted ? labels.oracleConsultAgain : labels.oracleOpenBook}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortesVergilianae;
