import React, { useState, useEffect } from 'react';
import './SententiaDiei.css';
import { getSententiaOfTheDay, SENTENTIAE, Sententia } from '../utils/sententiaeData';
import { getApophthegmaOfTheDay, APOPHTHEGMATA, Apophthegma } from '../utils/apophthegmataData';
import {
  getEgyptianWisdomOfTheDay,
  EGYPTIAN_WISDOM,
  EgyptianWisdom,
} from '../utils/egyptianWisdomData';
import {
  getBabylonianWisdomOfTheDay,
  BABYLONIAN_WISDOM,
  BabylonianWisdom,
} from '../utils/babylonianWisdomData';
import { Feather, RefreshCw } from 'lucide-react';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';

interface SententiaDieiProps {
  currentDate: Date;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const SententiaDiei: React.FC<SententiaDieiProps> = ({ currentDate }) => {
  const { civilization, labels } = useCivilization();
  const [sententia, setSententia] = useState<Sententia | null>(null);
  const [apophthegma, setApophthegma] = useState<Apophthegma | null>(null);
  const [egyptianWisdom, setEgyptianWisdom] = useState<EgyptianWisdom | null>(null);
  const [babylonianWisdom, setBabylonianWisdom] = useState<BabylonianWisdom | null>(null);

  const dateKey = currentDate.toDateString();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSententia(getSententiaOfTheDay(currentDate));
    setApophthegma(getApophthegmaOfTheDay(currentDate));
    setEgyptianWisdom(getEgyptianWisdomOfTheDay(currentDate));
    setBabylonianWisdom(getBabylonianWisdomOfTheDay(currentDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]); // currentDate object ref changes every render; dateKey re-runs only on actual date change

  const handleRandomize = () => {
    if (civilization === 'rome') {
      const randomIndex = Math.floor(Math.random() * SENTENTIAE.length);
      setSententia(SENTENTIAE[randomIndex]);
    } else if (civilization === 'hellas') {
      const randomIndex = Math.floor(Math.random() * APOPHTHEGMATA.length);
      setApophthegma(APOPHTHEGMATA[randomIndex]);
    } else if (civilization === 'babylonia') {
      const randomIndex = Math.floor(Math.random() * BABYLONIAN_WISDOM.length);
      setBabylonianWisdom(BABYLONIAN_WISDOM[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * EGYPTIAN_WISDOM.length);
      setEgyptianWisdom(EGYPTIAN_WISDOM[randomIndex]);
    }
  };

  const isBab = civilization === 'babylonia';

  let quoteText: string | undefined;
  if (civilization === 'rome') quoteText = sententia?.latin;
  else if (civilization === 'hellas') quoteText = apophthegma?.greek;
  else if (isBab) quoteText = babylonianWisdom?.text;
  else quoteText = egyptianWisdom?.text;

  let quoteAuthor: string | undefined;
  if (civilization === 'rome') quoteAuthor = sententia?.author;
  else if (civilization === 'hellas') quoteAuthor = apophthegma?.author;
  else if (isBab) quoteAuthor = babylonianWisdom?.author;
  else quoteAuthor = egyptianWisdom?.author;

  let quoteTranslation: string | undefined;
  if (civilization === 'rome') quoteTranslation = sententia?.translation;
  else if (civilization === 'hellas') quoteTranslation = apophthegma?.translation;

  let quoteSource: string | undefined;
  if (isBab) quoteSource = babylonianWisdom?.source;
  else if (civilization === 'aegyptus') quoteSource = egyptianWisdom?.source;
  const quoteAkkadian = isBab ? babylonianWisdom?.akkadian : undefined;
  const quoteTransliteration =
    civilization === 'hellas' && quoteText ? transliterateGreek(quoteText) : null;

  if (!quoteText) return null;

  return (
    <div className="sententia-diei">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={handleRandomize}
        className={`sd-card${civilization !== 'aegyptus' ? ' sd-card--default' : ''}`}
        style={
          civilization === 'aegyptus'
            ? {
                background: '#0c0804',
                borderColor: 'rgba(24,64,160,0.45)',
                borderRadius: '2px',
              }
            : undefined
        }
        title="Pulsa para ver otra cita al azar"
      >
        {civilization !== 'aegyptus' && <div className="sd-hatch woodcut-hatch"></div>}

        {/* Corner ornaments */}
        <div className="sd-corner sd-corner--tl"></div>
        <div className="sd-corner sd-corner--tr"></div>
        <div className="sd-corner sd-corner--bl"></div>
        <div className="sd-corner sd-corner--br"></div>

        {/* Cabecera / Título */}
        <div className="sd-header">
          <Feather className="sd-feather-icon" />
          <span className="sd-title">{labels.quoteTitle}</span>
          <div className="sd-title-rule"></div>
        </div>

        {/* Cita (Texto Principal) */}
        <div className="sd-quote-body">
          <p className="sd-quote-text">&quot;{quoteText}&quot;</p>
          {quoteTransliteration && <p className="sd-transliteration">{quoteTransliteration}</p>}
          {quoteAkkadian && <p className="sd-akkadian">{quoteAkkadian}</p>}
        </div>

        {/* Autor */}
        <div className="sd-author">
          <span className="sd-author-text">— {quoteAuthor} —</span>
        </div>

        <div className="sd-rule"></div>

        {/* Traducción / Fuente */}
        <div className="sd-translation">
          {quoteTranslation && <p className="sd-translation-text">{quoteTranslation}</p>}
          {quoteSource && <p className="sd-source-text">— {quoteSource} —</p>}
        </div>

        {/* Icono de refresco sutil */}
        <div className="sd-refresh-wrap">
          <RefreshCw className="sd-refresh-icon" />
        </div>
      </div>
    </div>
  );
};

export default SententiaDiei;
