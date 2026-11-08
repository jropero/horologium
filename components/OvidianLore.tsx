import React, { useState, useMemo } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import {
  OVID_MONTH_ETYMOLOGIES,
  OVID_DIVINE_DIALOGUES,
  OVID_TABOOS,
} from '../utils/ovidFastiData';
import InterrogatioDivina from './InterrogatioDivina';
import './OvidianLore.css';

interface OvidianLoreProps {
  modernTime: Date;
}

const OvidianLore: React.FC<OvidianLoreProps> = ({ modernTime }) => {
  const { civilization } = useCivilization();
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const currentMonth = modernTime.getMonth();
  const currentDay = modernTime.getDate();

  const ovidMonthInfo = useMemo(() => {
    if (civilization !== 'rome') return null;
    return OVID_MONTH_ETYMOLOGIES.find(m => m.month === currentMonth + 1);
  }, [currentMonth, civilization]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const ovidDialogue = useMemo(() => {
    if (civilization !== 'rome') return null;
    const month = currentMonth + 1;
    const day = currentDay;

    // 1. Janus: All January
    if (month === 1) return OVID_DIVINE_DIALOGUES.find(d => d.god === 'Jano');

    // 2. Marte: March 1st (Matronalia)
    if (month === 3 && day === 1) return OVID_DIVINE_DIALOGUES.find(d => d.god === 'Marte');

    // 3. Flora: Mensis Maius (Floralia range + rest of May)
    if ((month === 4 && day >= 28) || month === 5)
      return OVID_DIVINE_DIALOGUES.find(d => d.god === 'Flora');

    // 4. Minerva: June 13th (Quinquatrus Minusculae)
    if (month === 6 && day === 13)
      return OVID_DIVINE_DIALOGUES.find(d => d.god.includes('Minerva'));

    return null;
  }, [currentDay, currentMonth, civilization]);

  const activeTaboos = useMemo(() => {
    if (civilization !== 'rome') return [];
    const month = currentMonth + 1;
    const day = currentDay;

    return OVID_TABOOS.filter(t => {
      if (t.startMonth === t.endMonth) {
        return month === t.startMonth && day >= t.startDay && day <= t.endDay;
      }
      if (month === t.startMonth) return day >= t.startDay;
      if (month === t.endMonth) return day <= t.endDay;
      return month > t.startMonth && month < t.endMonth;
    });
  }, [currentDay, currentMonth, civilization]);

  if (
    civilization !== 'rome' ||
    (!ovidMonthInfo && !ovidDialogue && activeTaboos.length === 0)
  ) {
    return null;
  }

  return (
    <div className="ovidian-lore animate-fadeIn">
      <div className="ov-container">
        <div className="ov-bg-overlay"></div>

        <div className="ov-title-row">
          <span className="ov-title-ornament">❧</span>
          <span className="ov-title-text">Fasti Ovidiani</span>
          <span className="ov-title-ornament">☙</span>
        </div>

        {/* Epic 1: Month Etymology Subtitle */}
        {ovidMonthInfo && (
          <div className="ov-etymology">
            <p className="ov-etymology-text">&quot;{ovidMonthInfo.text}&quot;</p>
            <div className="ov-etymology-attr">— Fasti, {ovidMonthInfo.reference}</div>
          </div>
        )}

        {/* Epic 4: Divine Dialogue Trigger */}
        {ovidDialogue && (
          <button onClick={() => setIsDialogueOpen(true)} className="ov-dialogue-btn">
            <span className="ov-btn-icon">🏛️</span>
            <div className="ov-btn-labels">
              <span className="ov-btn-label">Coloquio Divino</span>
              <span className="ov-btn-sublabel">Interrogar a {ovidDialogue.god}</span>
            </div>
          </button>
        )}

        {/* Epic 3: Omina et Signa (Taboos) */}
        {activeTaboos.length > 0 && (
          <div className="ov-taboos">
            <div className="ov-taboos-header">
              <span className="ov-taboos-warning">⚠️</span>
              <span className="ov-taboos-title">{activeTaboos[0].title}</span>
            </div>
            <p className="ov-taboos-text">&quot;{activeTaboos[0].text}&quot;</p>
            <span className="ov-taboos-attr">— Ovidio, {activeTaboos[0].reference}</span>
          </div>
        )}
      </div>

      {ovidDialogue && (
        <InterrogatioDivina
          isOpen={isDialogueOpen}
          onClose={() => setIsDialogueOpen(false)}
          dialogue={ovidDialogue}
        />
      )}
    </div>
  );
};

export default OvidianLore;
