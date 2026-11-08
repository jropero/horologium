import React, { useState, useEffect } from 'react';
import {
  getRomanDayInfo,
  RomanDayInfo,
  getNextRomanFestivals,
} from '../utils/romanCalendarData';
import { ROMAN_YEAR_DATA, YearDayEntry } from '../utils/romanYearData';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import {
  getAtticFestivalInfo,
  getDefaultAtticDeity,
  AtticFestivalInfo,
} from '../utils/atticCalendarData';
import { getHistoricalEvents } from '../utils/romanHistoryData';
import { useCivilization } from '../contexts/CivilizationContext';
import {
  OVID_MOS_MAIORUM,
  OVID_ANNALES_BELLI,
  OVID_PRECES_ET_SACRA,
  OVID_AEDES_ET_MONUMENTA,
  OVID_STATUS_EXPLANATIONS,
  OVID_SACRIFICIA,
} from '../utils/ovidFastiData';
import { Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './RomanCalendarInfo.css';

// ─── Roman Monthly Day Grid ──────────────────────────────────────────────────

const STATUS_RING: Record<string, string> = {
  NP_fest: 'rdg-cell--NP-fest',
  NP: 'rdg-cell--NP',
  N: 'rdg-cell--N',
  EN: 'rdg-cell--EN',
  F: 'rdg-cell--F',
  C: 'rdg-cell--C',
};

const STATUS_TEXT_COLOR: Record<string, string> = {
  NP: 'rdg-num--NP',
  N: 'rdg-num--N',
  EN: 'rdg-num--EN',
  F: 'rdg-num--F',
  C: 'rdg-num--C',
};

const STATUS_BADGE_CLS: Record<string, string> = {
  NP: 'rdg-badge--NP',
  N: 'rdg-badge--N',
  EN: 'rdg-badge--EN',
  F: 'rdg-badge--F',
  C: 'rdg-badge--C',
};

const STATUS_NAMES: Record<string, string> = {
  F: 'Fastus',
  C: 'Comitialis',
  N: 'Nefastus',
  NP: 'NP',
  EN: 'Endotercissus',
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function RomanDayGrid({ month, year, today }: { month: number; year: number; today: number }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getDayEntry = (day: number): YearDayEntry | undefined =>
    ROMAN_YEAR_DATA[`${month}-${day}`];

  // Nones: day 7 in March, May, July, October; day 5 all others
  const nones = [2, 4, 6, 9].includes(month) ? 7 : 5;
  // Ides: day 15 in those same months; day 13 otherwise
  const ides = [2, 4, 6, 9].includes(month) ? 15 : 13;

  const panels = [
    {
      days: Array.from({ length: nones - 1 }, (_, i) => i + 1),
      label: 'Kalendae',
      sublabel: 'Ante Nonas',
    },
    {
      days: Array.from({ length: ides - nones }, (_, i) => i + nones),
      label: 'Nonae',
      sublabel: 'Ante Idvs',
    },
    {
      days: Array.from({ length: daysInMonth - ides + 1 }, (_, i) => i + ides),
      label: 'Idvs',
      sublabel: 'Post Idvs',
    },
  ];

  let activePanel = 0;
  if (today >= ides) activePanel = 2;
  else if (today >= nones) activePanel = 1;

  const selEntry = selectedDay !== null ? getDayEntry(selectedDay) : null;

  const cellCls = (day: number): string => {
    const entry = getDayEntry(day);
    if (day === selectedDay) return 'rdg-cell--selected';
    if (day === today) return 'rdg-cell--today';
    if (!entry) return 'rdg-cell--no-entry';
    const key = entry.status === 'NP' && entry.festivalName ? 'NP_fest' : entry.status;
    return STATUS_RING[key] ?? 'rdg-cell--default';
  };

  const numCls = (day: number): string => {
    const entry = getDayEntry(day);
    if (day === selectedDay) return 'rdg-num--selected';
    if (day === today) return 'rdg-num--today';
    if (day < today) return 'rdg-num--past';
    return STATUS_TEXT_COLOR[entry?.status ?? ''] ?? 'rdg-num--default';
  };

  return (
    <div
      role="presentation"
      className="roman-day-grid"
      onClick={e => e.stopPropagation()}
      onKeyDown={e => e.stopPropagation()}
    >
      <div className="rdg-header">
        <div className="rdg-divider" />
        <span className="rdg-title">Calendarium Mensis</span>
        <div className="rdg-divider" />
      </div>

      <div className="rdg-panels">
        {panels.map(({ days, label, sublabel }, panelIdx) => {
          const active = panelIdx === activePanel;
          return (
            <div
              key={label}
              style={{ flex: days.length }}
              className={`rdg-panel${active ? ' rdg-panel--active' : ''}`}
            >
              {active && <div className="rdg-panel-glow" />}
              <div className="rdg-panel-head">
                <div className={`rdg-panel-label${active ? ' rdg-panel-label--active' : ''}`}>
                  {label}
                </div>
                <div className="rdg-panel-sublabel">{sublabel}</div>
              </div>
              <div className={`rdg-cells${panelIdx === 2 ? ' rdg-cells--wide' : ''}`}>
                {days
                  .filter(d => d <= daysInMonth)
                  .map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`rdg-cell ${cellCls(day)}`}
                      onClick={() => setSelectedDay(prev => (prev === day ? null : day))}
                    >
                      <span className={`rdg-cell-num ${numCls(day)}`}>{day}</span>
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      <div className={`rdg-info${selEntry && selectedDay !== null ? ' rdg-info--open' : ''}`}>
        {selEntry && selectedDay !== null ? (
          <div className="rdg-info-content">
            <div className="rdg-info-row">
              <div className="rdg-info-left">
                <span className="rdg-info-day">Dies {selectedDay}</span>
                <span
                  className={`rdg-badge ${
                    STATUS_BADGE_CLS[selEntry.status] ?? 'rdg-badge--default'
                  }`}
                >
                  {STATUS_NAMES[selEntry.status] ?? selEntry.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="rdg-info-close"
              >
                ✕
              </button>
            </div>
            {selEntry.festivalName ? (
              <div>
                <span className="rdg-info-festival-name">{selEntry.festivalName}</span>
                {selEntry.festivalDesc && (
                  <p className="rdg-info-festival-desc">{selEntry.festivalDesc}</p>
                )}
              </div>
            ) : (
              <span className="rdg-info-statusfull">{selEntry.statusFull}</span>
            )}
            {selEntry.deity && selEntry.deity !== 'Ninguna' && (
              <div className="rdg-info-deity">
                <span className="rdg-info-deity-name">{selEntry.deity}</span>
                <p className="rdg-info-deity-desc">{selEntry.deityDesc}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="rdg-info-empty">Toca un día para ver su información</p>
        )}
      </div>

      {/* Legend */}
      <div className="rdg-legend">
        {(
          [
            { swatchCls: 'rdg-swatch--NP-fest', label: 'Festum NP' },
            { swatchCls: 'rdg-swatch--NP', label: 'NP' },
            { swatchCls: 'rdg-swatch--N', label: 'Nefastus' },
            { swatchCls: 'rdg-swatch--EN', label: 'Endotercissus' },
          ] as const
        ).map(({ swatchCls, label }) => (
          <div key={label} className="rdg-legend-item">
            <span className={`rdg-legend-swatch ${swatchCls}`} />
            <span className="rdg-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface RomanCalendarInfoProps {
  currentDate?: Date;
  /** Observer location for the Attic comparison date (defaults to Athens). */
  lat?: number;
  lng?: number;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function RomanCalendarInfo({ currentDate = new Date(), lat, lng }: RomanCalendarInfoProps) {
  const { civilization, labels } = useCivilization();
  const [info, setInfo] = useState<RomanDayInfo | null>(null);
  const [showFestivals, setShowFestivals] = useState(false);
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [fontesOpen, setFontesOpen] = useState(false);
  const [greekInfo, setGreekInfo] = useState<{
    festival: AtticFestivalInfo | null;
    defaultDeity: AtticFestivalInfo;
    atticDate: AtticDateResult;
  } | null>(null);
  const [activeSacrificeIdx, setActiveSacrificeIdx] = useState(0);

  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const isApril = month === 4;
  const isMay = month === 5;
  const isFloralia = isMay && day >= 1 && day <= 3;
  const isLemuria = isMay && (day === 9 || day === 11 || day === 13);
  const isJune = month === 6;

  const sacrificesForDay = OVID_SACRIFICIA.filter(e => e.month === month && e.day === day);
  const hasMultipleSacrifices = sacrificesForDay.length > 1;

  const sacrifice = sacrificesForDay.length > 0 ? sacrificesForDay[0] : null;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInfo(getRomanDayInfo(currentDate));

    const atticDate = getAtticDate(currentDate, lat, lng);
    const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
    const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
    setGreekInfo({ festival, defaultDeity, atticDate });
    setActiveSacrificeIdx(0);
    setFontesOpen(false);
  }, [currentDate, lat, lng]);

  if (!info && !greekInfo) return null;

  const getStatusIcon = (status: string) => {
    if (status === 'F' || status === 'C') return '⚖️';
    if (status === 'N' || status === 'NP') return '🏛️';
    return '📜';
  };

  const getStatusColor = (status: string) => {
    if (status === 'F') return 'rci-status-color--F';
    if (status === 'C') return 'rci-status-color--C';
    if (status === 'N') return 'rci-status-color--N';
    if (status === 'NP') return 'rci-status-color--NP';
    return 'rci-status-color--default';
  };

  const mosMaiorum = OVID_MOS_MAIORUM.find(e => e.month === month && e.day === day);
  const annalesBelli = OVID_ANNALES_BELLI.find(e => e.month === month && e.day === day);

  const preces = OVID_PRECES_ET_SACRA.find(e => {
    if (e.startMonth === e.endMonth) {
      return month === e.startMonth && day >= e.startDay && day <= e.endDay;
    }
    if (month === e.startMonth) return day >= e.startDay;
    if (month === e.endMonth) return day <= e.endDay;
    return month > e.startMonth && month < e.endMonth;
  });

  const monument = OVID_AEDES_ET_MONUMENTA.find(e => e.month === month && e.day === day);

  const statusExplanation =
    OVID_STATUS_EXPLANATIONS.find(e => e.status === info?.status) ||
    (info?.status.startsWith('N')
      ? OVID_STATUS_EXPLANATIONS.find(e => e.status === 'N')
      : null);

  // Roman mode
  if (civilization === 'rome' && info) {
    let sacBoxClsMulti = 'rci-sac-multi';
    if (isApril) sacBoxClsMulti = 'rci-sac-multi rci-sac-multi--april';
    else if (isFloralia) sacBoxClsMulti = 'rci-sac-multi rci-sac-multi--floralia';
    else if (isLemuria) sacBoxClsMulti = 'rci-sac-multi rci-sac-multi--lemuria';
    else if (isJune) sacBoxClsMulti = 'rci-sac-multi rci-sac-multi--june';

    let sacBoxClsSingle = 'rci-sac-single';
    if (isApril) sacBoxClsSingle = 'rci-sac-single rci-sac-single--april';
    else if (isFloralia) sacBoxClsSingle = 'rci-sac-single rci-sac-single--floralia';
    else if (isLemuria) sacBoxClsSingle = 'rci-sac-single rci-sac-single--lemuria';
    else if (isJune) sacBoxClsSingle = 'rci-sac-single rci-sac-single--june';

    return (
      <div className="roman-calendar-info">
        <div
          role="button"
          tabIndex={0}
          className="rci-card"
          onClick={() => setShowFestivals(true)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setShowFestivals(true);
          }}
        >
          {info.isMajorFestival && <div className="rci-festival-glow" />}

          <div className="rci-inner">
            {/* TOP: Status & Date Type */}
            <div className="rci-status-bar">
              <span className="rci-status-icon">{getStatusIcon(info.status)}</span>
              <h3 className={`rci-status-name ${getStatusColor(info.status)}`}>
                {info.statusFull}
              </h3>
              {statusExplanation && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setShowStatusInfo(true);
                  }}
                  className="rci-info-btn"
                  title="Explicación de Ovidio"
                >
                  <Info className="rci-info-icon" />
                </button>
              )}
            </div>

            {/* MAIN: Deus Diei */}
            <div className="rci-god-box">
              <div className="rci-god-label">
                <span className="rci-god-label-dash">—</span>
                {labels.godOfDayTitle}
                <span className="rci-god-label-dash">—</span>
              </div>
              <h2 className="rci-god-name">{info.god}</h2>
              <p className="rci-god-desc">&quot;{info.description}&quot;</p>
            </div>

            {/* MONTHLY CALENDAR */}
            <RomanDayGrid
              month={currentDate.getMonth()}
              year={currentDate.getFullYear()}
              today={currentDate.getDate()}
            />

            {/* BOTTOM: Festival */}
            {info.festivalName && (
              <div className="rci-festival-section animate-fadeIn">
                <div className="rci-festival-label">{labels.festivalLabel}</div>
                <h2 className="rci-festival-name">{info.festivalName.toUpperCase()}</h2>
              </div>
            )}

            {/* FONTES ANTIQUI */}
            {info.fontes && info.fontes.length > 0 && (
              <div
                role="presentation"
                className="rci-fontes"
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              >
                {/* Collapsed header — always visible */}
                <button
                  type="button"
                  className="rci-fontes-toggle"
                  onClick={() => setFontesOpen(o => !o)}
                  aria-expanded={fontesOpen}
                >
                  <div className="rci-fontes-toggle-left">
                    <span className="rci-fontes-label">Fontes Antiqui</span>
                    {!fontesOpen && (
                      <span className="rci-fontes-preview">
                        · {info.fontes[0].author}, {info.fontes[0].work}
                        {info.fontes[0].book ? ` ${info.fontes[0].book}` : ''}
                        {info.fontes[0].lines ? `.${info.fontes[0].lines}` : ''}
                      </span>
                    )}
                  </div>
                  <span
                    className="rci-fontes-chevron"
                    style={{ transform: fontesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {/* Expanded body */}
                {fontesOpen && (
                  <div className="rci-fontes-body">
                    {info.fontes.map((fonte, idx) => {
                      const typeBadge =
                        fonte.type !== 'description'
                          ? fonte.type.charAt(0).toUpperCase() + fonte.type.slice(1)
                          : null;
                      const citHeader = [
                        fonte.author,
                        fonte.work,
                        fonte.book ? `Lib. ${fonte.book}` : null,
                        fonte.lines ? `vv. ${fonte.lines}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ');
                      return (
                        <div
                          key={idx}
                          className={`rci-fonte-item${idx > 0 ? ' rci-fonte-item--sep' : ''}`}
                        >
                          <div className="rci-fonte-cit-row">
                            <span className="rci-fonte-cit-label">{citHeader}</span>
                            {typeBadge && (
                              <span className="rci-fonte-type-badge">{typeBadge}</span>
                            )}
                          </div>
                          {fonte.textLa && <p className="rci-fonte-latin">{fonte.textLa}</p>}
                          {fonte.textLa && <div className="rci-fonte-divider" />}
                          <p className="rci-fonte-es">{fonte.textEs}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* EPIC 4: Mos Maiorum (Curiosidad del Día) */}
            {mosMaiorum && (
              <div className="rci-mos animate-fadeIn">
                <div className="rci-mos-header">
                  <span className="rci-mos-icon">🍷</span>
                  <span className="rci-mos-title">Mos Maiorum: {mosMaiorum.title}</span>
                </div>
                <p className="rci-mos-text">&quot;{mosMaiorum.text}&quot;</p>
                <span className="rci-mos-ref">— Ovidio, {mosMaiorum.reference}</span>
              </div>
            )}

            {/* EPIC 5: Annales Belli (Memoria del Imperio) */}
            {annalesBelli && (
              <div className="rci-annales animate-fadeIn">
                <div className="rci-annales-header">
                  <span className="rci-annales-icon">⚔️</span>
                  <span className="rci-annales-title">Annales Belli: {annalesBelli.title}</span>
                </div>
                <p className="rci-annales-text">&quot;{annalesBelli.text}&quot;</p>
                <span className="rci-annales-ref">— Ovidio, {annalesBelli.reference}</span>
              </div>
            )}

            {/* EPIC 6: Preces et Sacra */}
            {preces && (
              <div className="rci-preces animate-fadeIn">
                <div className="rci-preces-header">
                  <span className="rci-preces-icon">{preces.icon || '🙏'}</span>
                  <span className="rci-preces-title">Preces et Sacra: {preces.title}</span>
                  <span className="rci-preces-icon">{preces.icon || '🌬️'}</span>
                </div>
                <p className="rci-preces-text">&quot;{preces.text}&quot;</p>
                <span className="rci-preces-ref">— Ovidio, {preces.reference}</span>
              </div>
            )}

            {/* EPIC 7: Aedes et Monumenta */}
            {monument && (
              <div className="rci-monument animate-fadeIn">
                <div className="rci-monument-header">
                  <span className="rci-monument-icon">🏛️</span>
                  <span className="rci-monument-title">
                    Aedes et Monumenta: {monument.title}
                  </span>
                </div>
                <p className="rci-monument-text">&quot;{monument.text}&quot;</p>
                <span className="rci-monument-ref">— Fasti, {monument.reference}</span>
              </div>
            )}

            {/* EPIC 10: Hostiae et Sacrificia */}
            {hasMultipleSacrifices ? (
              <div
                role="presentation"
                className={`${sacBoxClsMulti} animate-fadeIn`}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              >
                <div className="rci-sac-multi-top">
                  <div className="rci-sac-multi-icon">
                    {sacrificesForDay[activeSacrificeIdx].icon || '🗡️'}
                    {isApril && (
                      <span
                        className="rci-sac-multi-secondary"
                        title="Sangre purificadora o Fuego lustral de Abril"
                      >
                        {sacrificesForDay[activeSacrificeIdx].icon?.includes('🔥') ||
                        sacrificesForDay[activeSacrificeIdx].title
                          .toLowerCase()
                          .includes('zorra')
                          ? '🔥'
                          : '🩸'}
                      </span>
                    )}
                    {isLemuria && (
                      <span
                        className="rci-sac-multi-secondary rci-sac-multi-secondary--lemuria"
                        title="Espectro / Lemur de los Muertos"
                      >
                        👻
                      </span>
                    )}
                    {isJune && sacrificesForDay[activeSacrificeIdx].icon === '🫏' && (
                      <span
                        className="rci-sac-multi-secondary rci-sac-multi-secondary--june"
                        title="Pan de la Vestalia"
                      >
                        🍞
                      </span>
                    )}
                  </div>
                  <span className="rci-sac-multi-title">
                    {sacrificesForDay[activeSacrificeIdx].title}
                  </span>
                  {sacrificesForDay[activeSacrificeIdx].crime && (
                    <div className="rci-sac-multi-crime">
                      Crimen: {sacrificesForDay[activeSacrificeIdx].crime}
                    </div>
                  )}
                </div>

                <div className="rci-sac-multi-body">
                  <blockquote className="rci-sac-multi-quote animate-fadeIn">
                    &quot;{sacrificesForDay[activeSacrificeIdx].text}&quot;
                  </blockquote>
                  <span className="rci-sac-multi-ref">
                    — Ovidio, {sacrificesForDay[activeSacrificeIdx].reference}
                  </span>
                </div>

                <div className="rci-sac-multi-nav">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setActiveSacrificeIdx(prev =>
                        prev === 0 ? sacrificesForDay.length - 1 : prev - 1,
                      );
                    }}
                    className="rci-sac-nav-btn"
                    title="Anterior"
                  >
                    <ChevronLeft className="rci-nav-icon" />
                  </button>

                  <div className="rci-sac-dots">
                    {sacrificesForDay.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={e => {
                          e.stopPropagation();
                          setActiveSacrificeIdx(idx);
                        }}
                        className={`rci-sac-dot${
                          idx === activeSacrificeIdx ? ' rci-sac-dot--active' : ''
                        }`}
                        title={item.title}
                      />
                    ))}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setActiveSacrificeIdx(prev =>
                        prev === sacrificesForDay.length - 1 ? 0 : prev + 1,
                      );
                    }}
                    className="rci-sac-nav-btn"
                    title="Siguiente"
                  >
                    <ChevronRight className="rci-nav-icon" />
                  </button>
                </div>
              </div>
            ) : (
              sacrifice && (
                <div
                  role="presentation"
                  className={`${sacBoxClsSingle} animate-fadeIn`}
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => e.stopPropagation()}
                >
                  <div className="rci-sac-single-header">
                    <div className="rci-sac-single-icon-row">
                      <span className="rci-sac-single-icon">
                        {sacrifice.icon || '🗡️'}
                        {isApril && (
                          <span
                            className="rci-sac-single-secondary"
                            title="Sangre purificadora o Fuego lustral de Abril"
                          >
                            {sacrifice.icon?.includes('🔥') ||
                            sacrifice.title.toLowerCase().includes('zorra')
                              ? '🔥'
                              : '🩸'}
                          </span>
                        )}
                        {isLemuria && (
                          <span
                            className="rci-sac-single-secondary"
                            title="Espectro / Lemur de los Muertos"
                          >
                            👻
                          </span>
                        )}
                        {isJune && sacrifice.icon === '🫏' && (
                          <span className="rci-sac-single-secondary" title="Pan de la Vestalia">
                            🍞
                          </span>
                        )}
                      </span>
                      <span className="rci-sac-single-title">
                        {isLemuria
                          ? 'Lemuria: Ofrenda Lustral'
                          : `Sacrificia: ${sacrifice.title}`}
                      </span>
                    </div>
                  </div>
                  <div className="rci-sac-single-body">
                    <p className="rci-sac-single-text">&quot;{sacrifice.text}&quot;</p>
                    <span className="rci-sac-single-ref">— Ovidio, {sacrifice.reference}</span>
                  </div>
                </div>
              )
            )}

            {/* EPHEMERIDES */}
            {getHistoricalEvents(currentDate).length > 0 && (
              <div className="rci-ephemerides animate-fadeIn">
                <div className="rci-ephem-title">
                  <span>📜</span> {labels.calendarInfoTitle} <span>📜</span>
                </div>
                <ul className="rci-ephem-list">
                  {getHistoricalEvents(currentDate).map((evt: any, i: number) => (
                    <li key={i} className="rci-ephem-item">
                      <span className="rci-ephem-latin">&quot;{evt.latin}&quot;</span>
                      <span className="rci-ephem-es">{evt.spanish}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* NEXT FESTIVALS MODAL */}
        {showFestivals && (
          <div
            role="presentation"
            className="rci-modal-overlay animate-fadeIn"
            onClick={() => setShowFestivals(false)}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowFestivals(false);
            }}
          >
            <div
              role="presentation"
              className="rci-festivals-modal"
              onClick={e => e.stopPropagation()}
              onKeyDown={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="rci-festivals-header">
                <div className="rci-festivals-icon">🏛️</div>
                <h2 className="rci-festivals-title">Proxima Festa</h2>
                <p className="rci-festivals-subtitle">Calendarium Romanum</p>
              </div>

              {/* List */}
              <div className="rci-festivals-list custom-scrollbar">
                {getNextRomanFestivals(currentDate, 3).map((f, i) => (
                  <div key={i} className="rci-festival-item">
                    <div className="rci-festival-item-header">
                      <div className="rci-festival-item-left">
                        <h4 className="rci-festival-item-name">{f.name}</h4>
                        <span className="rci-festival-item-date">{f.date}</span>
                      </div>
                      <div className="rci-festival-countdown">
                        <div className="rci-festival-countdown-num">{f.daysRemaining}</div>
                        <div className="rci-festival-countdown-label">dies</div>
                      </div>
                    </div>
                    <p className="rci-festival-item-desc">{f.description}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <button className="rci-festivals-close" onClick={() => setShowFestivals(false)}>
                Claudere Fastos
              </button>
            </div>
          </div>
        )}

        {/* EPIC 9: Status Info Modal */}
        {showStatusInfo && statusExplanation && (
          <div
            role="presentation"
            className="rci-modal-overlay rci-status-modal-overlay animate-fadeIn"
            onClick={() => setShowStatusInfo(false)}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowStatusInfo(false);
            }}
          >
            <div
              role="presentation"
              className="rci-status-modal"
              onClick={e => e.stopPropagation()}
              onKeyDown={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowStatusInfo(false)}
                className="rci-status-modal-close"
              >
                <X className="rci-close-icon" />
              </button>

              <div className="rci-status-modal-inner">
                <div className="rci-status-modal-icon">{getStatusIcon(info.status)}</div>
                <h3 className={`rci-status-modal-title ${getStatusColor(info.status)}`}>
                  Día {info.statusFull}
                </h3>
                <div className="rci-status-modal-divider" />
                <p className="rci-status-modal-text">&quot;{statusExplanation.text}&quot;</p>
                <span className="rci-status-modal-ref">
                  — Fastos, {statusExplanation.reference}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default RomanCalendarInfo;
