import React, { useMemo } from 'react';
import './GreekDaysList.css';
import { getAtticDateForDisplay } from '../utils/atticCalendarUtils';
import {
  getAtticFestivalInfo,
  getDefaultAtticDeity,
  getDailyAtticDeity,
} from '../utils/atticCalendarData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

interface GreekDaysListProps {
  startDate: Date;
  lat?: number;
  lng?: number;
}

// Moon phase emoji helper
const moonEmoji = (phase: number) => {
  if (phase < 0.03 || phase > 0.97) return '🌑';
  if (phase < 0.28) return '🌒';
  if (phase < 0.47) return '🌓';
  if (phase < 0.53) return '🌕';
  if (phase < 0.78) return '🌗';
  return '🌘';
};

/**
 * The seven following Attic days with their god (Θεὸς τῆς Ἡμέρας) and, when one
 * falls, their festival. Formerly the body of `GreekCalendarModal`; folded into
 * the Greek page so the deity is visible without opening a modal.
 */
const GreekDaysList: React.FC<GreekDaysListProps> = ({ startDate, lat, lng }) => {
  const { labels } = useCivilization();

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const { atticDate, moonPhase } = getAtticDateForDisplay(d, lat, lng);
      const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
      const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
      const dailyDeity = getDailyAtticDeity(atticDate.dayOfMonth, atticDate.monthLength);

      return { atticDate, moonPhase, festival, defaultDeity, dailyDeity };
    });
  }, [startDate, lat, lng]);

  return (
    <div className="greek-days-list">
      <div className="greek-days-list__subtitle">{labels.calendarSubtitle}</div>

      <div className="greek-days-list__days">
        {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
        {nextDays.map((day, idx) => {
          const isToday = idx === 0;
          const hasFestival = !!day.festival?.festivalName;
          const isSacredDay = day.atticDate.dayOfMonth >= 1 && day.atticDate.dayOfMonth <= 8;
          const deity = day.festival?.deity || day.dailyDeity?.deity || day.defaultDeity.deity;
          const deityDesc = day.festival?.festivalDesc || day.dailyDeity?.deityDesc || '';

          // Detect month boundary
          const isNewMonth =
            idx > 0 && day.atticDate.monthName !== nextDays[idx - 1].atticDate.monthName;

          let rowModifier: string;
          if (isToday) {
            rowModifier = 'greek-days-list__day-row--today';
          } else if (isSacredDay) {
            rowModifier = 'greek-days-list__day-row--sacred';
          } else if (hasFestival) {
            rowModifier = 'greek-days-list__day-row--festival';
          } else {
            rowModifier = 'greek-days-list__day-row--plain';
          }

          return (
            <React.Fragment key={idx}>
              {/* Month boundary marker */}
              {isNewMonth && (
                <div className="greek-days-list__month-boundary">
                  <div className="greek-days-list__month-boundary-line" />
                  <span className="greek-days-list__month-boundary-name">
                    {day.atticDate.monthName} — {transliterateGreek(day.atticDate.monthName)}
                  </span>
                  <div className="greek-days-list__month-boundary-line" />
                </div>
              )}

              <div className={`greek-days-list__day-row ${rowModifier}`}>
                {/* LEFT: Day number + moon */}
                <div className="greek-days-list__day-num">
                  <span className="greek-days-list__day-numeral">
                    {day.atticDate.dayOfMonth}
                  </span>
                  <span className="greek-days-list__moon">{moonEmoji(day.moonPhase)}</span>
                  {isToday && (
                    <span className="greek-days-list__today-badge">{labels.todayLabel}</span>
                  )}
                  {isSacredDay && !isToday && (
                    <span className="greek-days-list__sacred-badge">
                      Día
                      <br />
                      Sagrado
                    </span>
                  )}
                </div>

                {/* RIGHT: Day info */}
                <div className="greek-days-list__day-info">
                  {/* Day name (Attic) */}
                  <div className="greek-days-list__day-heading">
                    <h3 className="greek-days-list__day-title">{day.atticDate.short}</h3>
                    <span className="greek-days-list__day-subtitle">
                      {day.atticDate.spanishShort}
                    </span>
                  </div>

                  {/* Deity line - MORE PROMINENT */}
                  <div
                    className={`greek-days-list__deity-box${
                      isSacredDay ? ' greek-days-list__deity-box--sacred' : ''
                    }`}
                  >
                    <div className="greek-days-list__deity-row">
                      <span className="greek-days-list__deity-label">Θεός:</span>
                      <span className="greek-days-list__deity-name">{deity}</span>
                      <span className="greek-days-list__deity-translit">
                        ({transliterateGreek(deity)})
                      </span>
                    </div>
                    <div className="greek-days-list__deity-translation">
                      <span className="greek-days-list__deity-sep" />
                      {translateGreekUI(deity)}
                    </div>

                    {/* Deity description */}
                    {deityDesc && (
                      <p className="greek-days-list__deity-desc">&quot;{deityDesc}&quot;</p>
                    )}
                  </div>

                  {/* ═══ FESTIVAL BLOCK ═══ */}
                  {hasFestival && (
                    <div className="greek-days-list__festival">
                      <div className="greek-days-list__festival-header">
                        <span className="greek-days-list__festival-icon">🏛️</span>
                        <span className="greek-days-list__festival-title">
                          {day.festival!.festivalName}
                        </span>
                      </div>

                      {/* Festival day name */}
                      {day.festival!.festivalDayName && (
                        <span className="greek-days-list__festival-day-name">
                          {day.festival!.festivalDayName}
                        </span>
                      )}

                      {/* Tags row: category + apaphrades */}
                      <div className="greek-days-list__festival-tags">
                        {day.festival!.category && (
                          <span className="greek-days-list__festival-tag">
                            {day.festival!.category}
                          </span>
                        )}
                        {day.festival!.isApaphrades && (
                          <span className="greek-days-list__festival-apaphrades">
                            🏺 Día Tabú (Apaphrades)
                          </span>
                        )}
                      </div>

                      {/* Festival description */}
                      {day.festival!.festivalDesc && (
                        <p className="greek-days-list__festival-desc">
                          &quot;{day.festival!.festivalDesc}&quot;
                        </p>
                      )}

                      {/* Compact festival extras */}
                      <div className="greek-days-list__festival-extras">
                        {day.festival!.ritualOffering && (
                          <div className="greek-days-list__festival-extra greek-days-list__festival-extra--offering">
                            <span className="greek-days-list__festival-extra-icon">
                              {day.festival!.ritualOffering.icon}
                            </span>
                            <div className="greek-days-list__festival-extra-content">
                              <span className="greek-days-list__festival-extra-label">
                                Ofrenda
                              </span>
                              <span className="greek-days-list__festival-extra-text">
                                {day.festival!.ritualOffering.item}
                              </span>
                            </div>
                          </div>
                        )}
                        {day.festival!.pannychisDesc && (
                          <div className="greek-days-list__festival-extra greek-days-list__festival-extra--vigil">
                            <span className="greek-days-list__festival-extra-icon greek-days-list__festival-extra-icon--pulse">
                              🕯️
                            </span>
                            <div className="greek-days-list__festival-extra-content">
                              <span className="greek-days-list__festival-extra-label">
                                Vigilia
                              </span>
                              <span className="greek-days-list__festival-extra-text">
                                {day.festival!.pannychisDesc}
                              </span>
                            </div>
                          </div>
                        )}
                        {day.festival!.agonDesc && (
                          <div className="greek-days-list__festival-extra greek-days-list__festival-extra--agon">
                            <span className="greek-days-list__festival-extra-icon">🌿</span>
                            <div className="greek-days-list__festival-extra-content">
                              <span className="greek-days-list__festival-extra-label">
                                Competición
                              </span>
                              <span className="greek-days-list__festival-extra-text">
                                {day.festival!.agonDesc}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Aition */}
                      {day.festival!.aition && (
                        <div className="greek-days-list__festival-aition">
                          <span className="greek-days-list__festival-aition-icon">📜</span>
                          <span className="greek-days-list__festival-aition-text">
                            {day.festival!.aition}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default GreekDaysList;
