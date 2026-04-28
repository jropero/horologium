import React, { useMemo } from 'react';
import { X, Eye, Sun } from 'lucide-react';
import { isAlgolEclipsed, getAlgolEclipses } from '../utils/egyptianAstronomy';
import { getEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getHemerologyForDate } from '../utils/egyptianHemerologyData';

interface HorusEclipseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
}

export interface ExceptionalDay {
  date: Date;
  type: 'good' | 'bad';
  isPast: boolean;
}

const HorusEclipseModal: React.FC<HorusEclipseModalProps> = ({ isOpen, onClose, currentDate }) => {
  const exceptionalDays = useMemo(() => {
    if (!isOpen) return [];

    const findGoodDays = (start: Date, count: number, direction: 'back' | 'forward'): ExceptionalDay[] => {
      const results: ExceptionalDay[] = [];
      const dayOffset = direction === 'back' ? -1 : 1;
      let checkDate = new Date(start);

      // Ajustar para empezar desde el día anterior/siguiente si buscamos pasado/futuro
      checkDate.setDate(checkDate.getDate() + dayOffset);

      let safety = 0;
      while (results.length < count && safety < 100) {
        safety++;
        const eDate = getEgyptianDate(checkDate);
        const hem = getHemerologyForDate(checkDate, eDate.monthIndex, eDate.dayOfMonth);

        if (hem.morning === 'nefer' && hem.midday === 'nefer' && hem.evening === 'nefer') {
          // Día excepcionalmente bueno
          // Solo si no hay eclipse de Algol en TODO el día
          const eclipsesNear = getAlgolEclipses(checkDate, 1, 1);
          const hasEclipseThatDay = eclipsesNear.some(e =>
            e.date.getFullYear() === checkDate.getFullYear() &&
            e.date.getMonth() === checkDate.getMonth() &&
            e.date.getDate() === checkDate.getDate()
          );

          if (!hasEclipseThatDay) {
            results.push({
              date: new Date(checkDate),
              type: 'good',
              isPast: checkDate.getTime() < currentDate.getTime()
            });
          }
        }
        checkDate.setDate(checkDate.getDate() + dayOffset);
      }
      return results;
    };

    const futureBad = getAlgolEclipses(currentDate, 0, 5).filter(e => e.date.getTime() > currentDate.getTime()).map(e => ({ ...e, type: 'bad' as const }));
    const futureGood = findGoodDays(currentDate, 5, 'forward');

    const all = [...futureBad, ...futureGood] as ExceptionalDay[];

    return all.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [currentDate, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-ink border-2 border-gold-dim rounded-xl shadow-[0_0_30px_rgba(207,181,59,0.2)] w-full max-w-xl max-h-[85vh] flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ink p-4 border-b border-gold-dim/50 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3 text-gold-leaf">
            <Eye className="w-6 h-6" />
            <h2 className="font-serif text-xl font-bold uppercase tracking-widest">
              Próximos Eventos de Horus
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-parchment/80 hover:text-roman-red hover:bg-white/10 transition-colors p-2 rounded-full"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>



        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar bg-ink/5">
          <div className="grid grid-cols-1 gap-3">
            {exceptionalDays.map((day, idx) => {
              const eDate = getEgyptianDate(day.date);
              const isBad = day.type === 'bad';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 flex flex-col sm:flex-row gap-4 transition-all duration-300 ${isBad
                      ? 'border-roman-red/50 bg-roman-red/10 shadow-[0_0_10px_rgba(220,38,38,0.1)]'
                      : 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    }`}
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col">
                        <span className="text-parchment font-body text-base font-bold uppercase tracking-tight">
                          {day.date.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', hour: isBad ? '2-digit' : undefined, minute: isBad ? '2-digit' : undefined })}
                        </span>
                        <span className="text-gold-leaf font-serif text-[11px] font-bold uppercase tracking-widest mt-0.5">
                          {eDate.isEpagomenal ? `Epagomenai ${eDate.dayOfMonth}` : `${eDate.dayOfMonth} de ${eDate.monthName}`}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className={`mobile-fit-content flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-black uppercase tracking-widest ${isBad ? 'border-roman-red/50 text-roman-red bg-roman-red/20' : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/20'
                          }`}>
                          {isBad ? <Eye className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                          {isBad ? 'Eclipse Nefasto' : 'Suerte Suprema'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gold-dim/10">
                      <div className="text-[10px] text-parchment/60 font-serif uppercase tracking-widest">Pronóstico:</div>
                      <div className="flex gap-1">
                        {isBad ? (
                          <>
                            <span className="text-roman-red text-xs">🦂</span>
                            <span className="text-roman-red text-xs">🦂</span>
                            <span className="text-roman-red text-xs">🦂</span>
                          </>
                        ) : (
                          <>
                            <span className="text-emerald-500 text-xs">☀️</span>
                            <span className="text-emerald-500 text-xs">☀️</span>
                            <span className="text-emerald-500 text-xs">☀️</span>
                          </>
                        )}
                      </div>
                      <div className="ml-auto text-[10px] italic text-parchment/70">
                        {isBad ? 'El Ojo de Horus se oscurece' : 'El Ojo de Horus brilla con fuerza'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorusEclipseModal;
