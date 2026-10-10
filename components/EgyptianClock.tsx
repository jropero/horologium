import React, { useMemo } from 'react';
import { RomanTimeData, WeatherData } from '../types';
import { useCivilization } from '../contexts/CivilizationContext';
import { getEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEgyptianMonthDeity } from '../utils/egyptianCalendarData';
import { getHemerologyForDate, Prognosis } from '../utils/egyptianHemerologyData';

interface EgyptianClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const EgyptianClock: React.FC<EgyptianClockProps> = ({
  modernTime,
  romanTime,
  loading,
  weather: _weather,
  onUpdateLocation: _onUpdateLocation,
  currentLat: _currentLat,
  currentLng: _currentLng,
}) => {
  const { labels } = useCivilization();

  const egyptianDateInfo = useMemo(() => {
    const eDate = getEgyptianDate(modernTime);
    const deity = getEgyptianMonthDeity(eDate.monthIndex);
    const hemerology = getHemerologyForDate(modernTime, eDate.monthIndex, eDate.dayOfMonth);

    let currentPrognosis: Prognosis = 'none';
    let partName = '';

    if (!romanTime.isDay) {
      currentPrognosis = hemerology.evening;
      partName = 'Noche';
    } else {
      if (romanTime.romanHour <= 4) {
        currentPrognosis = hemerology.morning;
        partName = 'Mañana';
      } else if (romanTime.romanHour <= 8) {
        currentPrognosis = hemerology.midday;
        partName = 'Mediodía';
      } else {
        currentPrognosis = hemerology.evening;
        partName = 'Tarde';
      }
    }

    return { eDate, deity, hemerology, currentPrognosis, partName };
  }, [modernTime.getDate(), romanTime.romanHour, romanTime.isDay]);

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-ink border-4 border-gold-dim rounded-lg">
        <span className="font-serif text-2xl text-gold-leaf">{labels.loadingText}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto shadow-2xl animate-fadeIn" style={{ background: '#0c0804', border: '4px solid rgba(24,64,160,0.55)', borderRadius: '2px' }}>
      <div className="p-5 text-center">
        {/* Hour + prognosis */}
        <h2 className="responsive-wrap text-2xl xs:text-3xl md:text-5xl font-serif font-bold text-parchment mb-3 uppercase tracking-wide items-center justify-center gap-3 xs:gap-4">
          <span>Hora {romanTime.romanHour}</span>
          {egyptianDateInfo.currentPrognosis !== 'none' && (
            <div className={`text-[9px] xs:text-[10px] md:text-xs px-2 py-1 rounded border flex items-center gap-1.5 transition-all animate-fadeIn
              ${egyptianDateInfo.currentPrognosis === 'nefer'
                ? 'bg-emerald-900/30 text-emerald-300 border-emerald-500/40'
                : 'bg-red-900/20 text-red-300 border-red-500/35'}`}
            >
              <span className="text-xs xs:text-sm">{egyptianDateInfo.currentPrognosis === 'nefer' ? '☀️' : '🦂'}</span>
              <span className="font-bold uppercase tracking-widest">
                {egyptianDateInfo.currentPrognosis === 'nefer' ? 'Nefer' : 'Aha'}
              </span>
            </div>
          )}
        </h2>

        {/* Date tracker */}
        {egyptianDateInfo.eDate.isEpagomenal ? (
          <div className="mb-5">
            <span className="font-bold uppercase tracking-widest text-sm" style={{ color: 'rgba(212,168,50,0.85)' }}>
              {egyptianDateInfo.eDate.seasonHieroglyphic} Días Epagómenos {egyptianDateInfo.eDate.seasonHieroglyphic}
            </span>
            <div className="font-serif text-xs mt-1 text-parchment/60">Día {egyptianDateInfo.eDate.dayOfMonth}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full max-w-sm mx-auto mb-5 px-2">
            {[
              {
                label: 'Estación',
                items: [0, 1, 2],
                active: Math.floor(egyptianDateInfo.eDate.monthIndex / 4),
                text: egyptianDateInfo.eDate.seasonName,
                activeClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
                doneClass: 'bg-emerald-700/40',
              },
              {
                label: 'Mes',
                items: [0, 1, 2, 3],
                active: egyptianDateInfo.eDate.monthIndex % 4,
                text: egyptianDateInfo.eDate.monthName,
                activeClass: 'bg-[#1840a0] shadow-[0_0_8px_rgba(24,64,160,0.5)]',
                doneClass: 'bg-[#1840a0]/30',
              },
              {
                label: 'Década',
                items: [0, 1, 2],
                active: egyptianDateInfo.eDate.decade - 1,
                text: `Día ${egyptianDateInfo.eDate.dayOfMonth}`,
                activeClass: 'bg-gold-leaf shadow-[0_0_8px_rgba(212,168,50,0.4)]',
                doneClass: 'bg-gold-leaf/25',
              },
            ].map(({ label, items, active, text, activeClass, doneClass }) => (
              <div key={label} className="responsive-wrap items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest font-bold w-14 text-right" style={{ color: 'rgba(212,168,50,0.60)' }}>{label}</span>
                <div className="flex flex-1 gap-1">
                  {items.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                      i === active ? activeClass : i < active ? doneClass : 'bg-[#1840a0]/10'
                    }`} />
                  ))}
                </div>
                <span className="w-16 text-left text-xs font-serif text-parchment/75 font-bold">{text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Day/night + vigilia */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-6 font-serif font-bold tracking-[0.3em] text-base text-egypt-primary">
              <span style={{ color: 'rgba(212,168,50,0.55)' }}>❧</span>
              <span>{romanTime.isDay ? labels.dayLabel : labels.nightLabel}</span>
              <span style={{ color: 'rgba(212,168,50,0.55)' }}>☙</span>
            </div>
            {romanTime.vigilia && (
              <div className="text-xs font-serif uppercase tracking-[0.2em] text-egypt-primary font-bold mt-1">
                𓊹 {romanTime.vigilia.name} 𓊹
              </div>
            )}
          </div>

          {/* Civil day part */}
          <div className="font-serif mt-2 mb-2 px-6 py-2.5 rounded border flex flex-col items-center w-full max-w-[260px] mx-auto"
               style={{ background: 'rgba(24,64,160,0.12)', borderColor: 'rgba(24,64,160,0.35)' }}>
            <div className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(212,168,50,0.65)' }}>{labels.civilDayPartLabel}</div>
            <div className="flex flex-col items-center text-center px-1">
              <span className="font-bold text-parchment text-base md:text-lg leading-tight">{romanTime.civilDayPart.name}</span>
              <span className="text-[11px] md:text-sm font-bold italic text-egypt-primary mt-1 leading-snug">{romanTime.civilDayPart.desc}</span>
            </div>
          </div>

          {/* Planetary ruler + deity */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-2 px-4 pb-2">
            <div className="flex flex-col items-center text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(212,168,50,0.55)' }}>{labels.planetaryRulerLabel}</div>
              <span className="font-bold text-parchment text-sm uppercase">{romanTime.planetaryRuler}</span>
            </div>
            <div className="hidden sm:block w-px h-10" style={{ background: 'rgba(24,64,160,0.30)' }}></div>
            <div className="w-16 h-px sm:hidden" style={{ background: 'rgba(24,64,160,0.30)' }}></div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(212,168,50,0.55)' }}>{labels.monthTutelaLabel}</div>
              <span className="font-bold text-parchment text-lg">{egyptianDateInfo.deity.deity}</span>
              <span className="text-xs font-bold text-gold-leaf">{egyptianDateInfo.deity.deityHieroglyphic}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EgyptianClock;
