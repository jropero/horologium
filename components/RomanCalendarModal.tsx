import React, { useMemo } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { getRomanDate, getNundinalLetter, LATIN_WEEKDAYS } from '../utils/romanTimeUtils';
import { getRomanDayInfo } from '../utils/romanCalendarData';

interface RomanCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date;
}

const RomanCalendarModal: React.FC<RomanCalendarModalProps> = ({ isOpen, onClose, startDate }) => {
  // Generar solo los próximos 7 días (una semana)
  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const romanDate = getRomanDate(d);
      const info = getRomanDayInfo(d);

      const nundinalLetter = getNundinalLetter(d);
      const isMarketDay = nundinalLetter === 'C'; // Usando 'C' basado en nuestra config temporal
      const dayOfWeek = LATIN_WEEKDAYS[d.getDay()];

      return {
        gregorianDate: d,
        romanShort: romanDate.short.split(' anno')[0],
        dayOfWeek,
        nundinalLetter,
        isMarketDay,
        info
      };
    });
  }, [startDate]);

  if (!isOpen) return null;

  return (
    // Fondo oscuro clickeable para cerrar fácilmente en móvil tocando fuera
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Contenedor principal de la modal (detiene el clic para no cerrar si tocas dentro) */}
      <div
        className="bg-ink border-2 border-gold-dim rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >

        {/* Header del Modal */}
        <div className="bg-ink p-3 sm:p-4 border-b border-gold-dim/50 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 text-gold-leaf">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="font-serif text-base sm:text-xl font-bold uppercase tracking-widest">
              Fasti Romani
            </h2>
          </div>
          {/* Botón de cierre más grande y táctil para móviles */}
          <button
            onClick={onClose}
            className="text-parchment/80 hover:text-roman-red hover:bg-white/10 transition-colors p-2 rounded-full"
            aria-label="Cerrar calendario"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de 7 días */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-4 custom-scrollbar bg-ink/5">
          <div className="text-center text-gold-dim font-serif text-xs uppercase tracking-[0.3em] mb-4">
            — Dies VII Sequentes —
          </div>

          {nextDays.map((day, idx) => {
            const isToday = idx === 0;
            const hasFestival = !!day.info.festivalName;

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-lg border-2 flex flex-col sm:flex-row gap-4 transition-all duration-300 ${isToday
                  ? 'border-gold-leaf bg-gold-leaf/15 shadow-[0_0_15px_rgba(207,181,59,0.2)]'
                  : hasFestival
                    ? 'border-amber-600/60 bg-amber-900/30'
                    : 'border-gold-dim/30 bg-ink/40'
                  }`}
              >
                {/* Fecha Gregoriana (Izquierda) */}
                <div className="flex sm:flex-col items-center sm:items-start sm:w-24 shrink-0 gap-2 sm:gap-1 border-b sm:border-b-0 sm:border-r border-gold-dim/40 pb-3 sm:pb-0 sm:pr-4">
                  <span className="text-parchment font-body text-base font-bold uppercase tracking-tight">
                    {day.gregorianDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <span className="text-gold-leaf text-xs uppercase tracking-[0.2em] font-black border border-gold-leaf/40 px-1.5 rounded-sm bg-gold-leaf/10">Hodie</span>}
                </div>

                {/* Info Romana (Derecha) */}
                <div className="flex-1 flex flex-col">
                  {/* Fila del día de la semana y nundinae */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gold-leaf font-serif text-xs uppercase tracking-[0.2em] font-bold">
                      {day.dayOfWeek}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] px-2 py-0.5 border border-gold-dim/50 rounded-sm bg-ink/10 uppercase font-bold text-gold-leaf shadow-sm" title="Littera Nundinalis">
                        {day.nundinalLetter}
                      </span>
                      {day.isMarketDay && (
                        <span className="text-[11px] px-2 py-0.5 border-2 border-roman-red bg-roman-red text-white uppercase font-black rounded-sm tracking-widest shadow-md">
                          Nundinae
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-parchment leading-tight drop-shadow-sm">
                      {day.romanShort}
                    </h3>
                    <span className={`font-serif text-xs font-bold px-2 py-1 rounded shrink-0 shadow-sm border ${['N', 'NP'].includes(day.info.status)
                      ? 'border-roman-red bg-roman-red/30 text-parchment'
                      : 'border-blue-500 bg-blue-900/50 text-blue-200'
                      }`}>
                      {day.info.status}
                    </span>
                  </div>

                  {hasFestival && (
                    <div className="text-festival font-serif text-sm sm:text-base uppercase tracking-[0.2em] mt-2 font-black flex items-center gap-2 drop-shadow-md">
                      <span className="text-lg">✧</span> {day.info.festivalName} <span className="text-lg">✧</span>
                    </div>
                  )}

                  <div className="text-parchment/90 font-serif text-xs sm:text-sm mt-2 italic flex items-center gap-2">
                    <span className="text-gold-dim not-italic uppercase tracking-widest text-[10px] font-bold">Deus:</span>
                    <span className="text-parchment font-bold tracking-wide">{day.info.god}</span>
                  </div>

                  {/* Descripción de la fiesta */}
                  {hasFestival && day.info.description && (
                    <div className="mt-3 pt-3 border-t border-gold-dim/40">
                      <p className="font-serif text-xs sm:text-sm text-parchment leading-relaxed text-justify opacity-90 italic">
                        "{day.info.description}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RomanCalendarModal;