import React, { useMemo } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { getRomanDate } from '../utils/romanTimeUtils';
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
      
      return {
        gregorianDate: d,
        romanShort: romanDate.short.split(' anno')[0],
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
        <div className="overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar">
          <div className="text-center text-parchment/60 font-serif text-[10px] sm:text-xs uppercase tracking-widest mb-2">
            — Dies VII Sequentes —
          </div>

          {nextDays.map((day, idx) => {
            const isToday = idx === 0;
            const hasFestival = !!day.info.festivalName;
            
            return (
              <div 
                key={idx} 
                className={`p-3 sm:p-4 rounded-lg border flex flex-col sm:flex-row gap-3 transition-colors ${
                  isToday 
                    ? 'border-gold-leaf bg-gold-leaf/10' 
                    : hasFestival 
                      ? 'border-amber-600/50 bg-amber-900/20' 
                      : 'border-gold-dim/20 bg-white/5'
                }`}
              >
                {/* Fecha Gregoriana (Izquierda) */}
                <div className="flex sm:flex-col items-center sm:items-start sm:w-20 shrink-0 gap-2 sm:gap-0 border-b sm:border-b-0 sm:border-r border-gold-dim/30 pb-2 sm:pb-0 sm:pr-3">
                  <span className="text-parchment/60 font-body text-sm uppercase">
                    {day.gregorianDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <span className="text-gold-leaf text-[10px] uppercase tracking-widest font-bold">Hodie</span>}
                </div>

                {/* Info Romana (Derecha) */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-sm font-bold text-parchment leading-tight">
                      {day.romanShort}
                    </h3>
                    <span className={`font-serif text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      ['N', 'NP'].includes(day.info.status) ? 'bg-roman-red/20 text-roman-red' : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {day.info.status}
                    </span>
                  </div>
                  
                  {hasFestival && (
                    <div className="text-amber-500 font-serif text-xs sm:text-sm uppercase tracking-widest mt-1.5 font-bold flex items-center gap-1">
                      <span>✧</span> {day.info.festivalName} <span>✧</span>
                    </div>
                  )}
                  
                  <div className="text-parchment/70 font-serif text-[11px] mt-1 italic">
                    Deus: <span className="text-parchment font-semibold">{day.info.god}</span>
                  </div>

                  {/* Descripción de la fiesta */}
                  {hasFestival && day.info.description && (
                    <div className="mt-2 pt-2 border-t border-gold-dim/30">
                      <p className="font-serif text-[11px] sm:text-xs text-parchment/80 leading-relaxed text-justify">
                        {day.info.description}
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