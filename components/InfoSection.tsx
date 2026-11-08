import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react';
import { useCivilization } from '../contexts/CivilizationContext';
import './InfoSection.css';

const InfoSection: React.FC = () => {
  const { civilization, labels } = useCivilization();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="info-section">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="info-section-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="info-section-title-row">
          <Scroll className="info-section-scroll-icon" />
          <h3 className="info-section-title">{labels.infoTitle}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="info-section-chevron" />
        ) : (
          <ChevronDown className="info-section-chevron" />
        )}
      </div>

      {isOpen && (
        <div className="info-section-body">
          {/* Subtle background texture for the "scroll" */}
          <div className="woodcut-hatch info-section-hatch"></div>

          <div className="info-section-content">
            <p>
              <span className="info-section-dropcap">{labels.infoFirstLetter}</span>
              {labels.infoParagraph1}
            </p>
            <p>{labels.infoParagraph2}</p>
            <div className="info-section-fleuron">
              <span className="info-section-fleuron-mark">❦</span>
            </div>
            <p className="info-section-motto">{labels.infoBottomMotto}</p>
            {labels.infoBottomMottoEs && (
              <p className="info-section-motto-es">{labels.infoBottomMottoEs}</p>
            )}

            {civilization === 'hellas' && (
              <div className="info-section-civ-block info-section-civ-block--hellas">
                <h4 className="info-section-civ-title">
                  <span>🏛️</span>
                  Sobre el Tiempo Griego
                </h4>
                <div className="info-section-civ-text">
                  <p>
                    Los griegos de la antigüedad medían el día del mismo modo. El día comenzaba
                    al amanecer y terminaba al anochecer, dividido siempre en doce partes
                    iguales llamadas <em>ὧραι</em> (hōrai).
                  </p>
                  <p>
                    Así como el curso del sol varía con las estaciones, también varía la
                    duración de cada hora. En invierno una hora puede durar solo cuarenta y
                    cinco minutos; en verano se extiende hasta los setenta y cinco.
                  </p>
                  <p className="info-section-civ-motto">
                    Πάντα Ῥεῖ · Todo fluye • Γνῶθι Σεαυτόν · Conócete a ti mismo
                  </p>
                </div>
              </div>
            )}

            {civilization === 'aegyptus' && (
              <div className="info-section-civ-block info-section-civ-block--aegyptus">
                <h4 className="info-section-civ-title">
                  <span>𓂀</span>
                  El Secreto del Papiro de El Cairo 86637
                </h4>
                <p className="info-section-civ-text">
                  El calendario que estás viendo esconde el descubrimiento astrofísico más
                  antiguo de la humanidad (c. 1200 a.C.). Recientes estudios (PLOS ONE, 2015)
                  han demostrado que los días de &apos;buena&apos; y &apos;mala&apos; suerte de
                  este papiro no eran superstición aleatoria, sino el registro exacto de las
                  variaciones de brillo de la estrella binaria Algol (con un ciclo de 2.85 días)
                  y de la Luna (29.53 días). Para los egipcios, los eclipses de Algol
                  simbolizaban la debilidad del Ojo de Horus, mientras que la Luna representaba
                  al dios Seth.
                </p>
              </div>
            )}

            {civilization === 'zhongguo' && (
              <div className="info-section-civ-block info-section-civ-block--zhongguo">
                <h4 className="info-section-civ-title">
                  <span>🌾</span>
                  Patrimonio Inmaterial de la Humanidad
                </h4>
                <p className="info-section-civ-text">
                  En 2016, la UNESCO inscribió las Veinticuatro Divisiones Estacionales
                  (二十四节气) en la Lista del Patrimonio Cultural Inmaterial de la Humanidad
                  como &quot;conocimiento de China sobre el tiempo y las prácticas desarrolladas
                  a través de la observación del sol anual.&quot; Este sistema, de más de dos
                  mil años de antigüedad, sigue determinando las fechas de festividades, la
                  siembra y la recolección en el mundo agrícola chino, y guía la medicina
                  tradicional, la alimentación estacional y los rituales familiares de más de
                  mil millones de personas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;
