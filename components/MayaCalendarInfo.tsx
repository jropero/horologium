import React, { useState, useMemo } from 'react';
import { getMayaDate } from '../utils/mayaCalendarUtils';
import { getHaabLore } from '../utils/mayaLoreData';
import { HAAB_NAMES } from '../types/maya';
import { useCivilization } from '../contexts/CivilizationContext';
import MayaCalendarGears from './MayaCalendarGears';

interface MayaCalendarInfoProps {
  currentDate?: Date;
}

const TZOLKIN_LORE = [
  { name: 'Imix', meaning: 'Dragón / Cocodrilo', icon: '🐊', desc: 'Origen, agua primordial, el inicio de todas las cosas.' },
  { name: 'Ik\'', meaning: 'Viento', icon: '💨', desc: 'El aliento divino, la vida, la comunicación.' },
  { name: 'Ak\'b\'al', meaning: 'Noche', icon: '🌌', desc: 'La oscuridad, el inframundo, el misterio y los sueños.' },
  { name: 'K\'an', meaning: 'Semilla / Maíz', icon: '🌽', desc: 'Abundancia, madurez, la red que sostiene la vida.' },
  { name: 'Chikchan', meaning: 'Serpiente', icon: '🐍', desc: 'Fuerza vital, energía kundalini, conexión entre la tierra y el cielo.' },
  { name: 'Kimi', meaning: 'Muerte', icon: '💀', desc: 'Transformación, renacimiento, el consejo de los ancestros.' },
  { name: 'Manik', meaning: 'Venado / Mano', icon: '🦌', desc: 'Curación, nobleza, la mano que agarra.' },
  { name: 'Lamat', meaning: 'Estrella / Conejo', icon: '⭐', desc: 'El planeta Venus, la siembra, fertilidad y abundancia.' },
  { name: 'Muluk', meaning: 'Agua / Lluvia', icon: '💧', desc: 'Emociones, ofrendas, la gota de agua que purifica.' },
  { name: 'Ok', meaning: 'Perro', icon: '🐕', desc: 'El guía leal a través del inframundo, justicia.' },
  { name: 'Chuwen', meaning: 'Mono', icon: '🐒', desc: 'El tejedor del tiempo, el artista, la magia y el juego.' },
  { name: 'Eb', meaning: 'Camino / Hierba', icon: '🌿', desc: 'El destino, la vitalidad, el viaje de la vida.' },
  { name: 'Ben', meaning: 'Caña', icon: '🎋', desc: 'Poder, autoridad, los pilares que sostienen el cielo.' },
  { name: 'Ix', meaning: 'Jaguar', icon: '🐆', desc: 'Magia, energía femenina, el sol nocturno, el misterio.' },
  { name: 'Men', meaning: 'Águila', icon: '🦅', desc: 'Visión elevada, la mente superior, el sol diurno.' },
  { name: 'K\'ib', meaning: 'Búho / Cera', icon: '🦉', desc: 'Sabiduría kármica, los guerreros antiguos, el perdón.' },
  { name: 'Kab\'an', meaning: 'Tierra', icon: '🌍', desc: 'Movimiento, terremoto, sincronía, la fuerza del planeta.' },
  { name: 'Etz\'nab', meaning: 'Pedernal / Cuchillo', icon: '🗡️', desc: 'La espada de la verdad, el corte de ilusiones, el espejo.' },
  { name: 'Kawak', meaning: 'Tormenta', icon: '⛈️', desc: 'Purificación, transformación radical, el trueno.' },
  { name: 'Ajaw', meaning: 'Señor / Sol', icon: '🌞', desc: 'La consciencia solar, la luz, el todo, el florecimiento.' }
];

const MayaCalendarInfo: React.FC<MayaCalendarInfoProps> = ({ currentDate = new Date() }) => {
  const { civilization } = useCivilization();
  const [activeTab, setActiveTab] = useState<'tzolkin' | 'haab' | 'longcount' | 'forecast'>('tzolkin');
  
  const mayaDate = useMemo(() => getMayaDate(currentDate), [currentDate]);

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + i);
      const { tzolkin, haab, tzolkinIndex } = getMayaDate(d);
      const monthIndex = HAAB_NAMES.indexOf(haab.name);
      return {
        gregorianDate: d,
        tzolkin,
        haab,
        isWayeb: haab.name === 'Wayeb\'',
        monthIndex,
        tzolkinIndex,
      };
    });
  }, [currentDate]);

  if (civilization !== 'maya') return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-6 px-2 cursor-default transition-all">
      <div className="bg-ink/90 border-[4px] border-emerald-700/50 p-0 rounded-xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/80 transition-colors">
        
        {/* Top Border Pattern */}
        <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderBottom: '2px solid rgba(16,185,129,0.3)' }}>
          <defs>
            <pattern id="maya-step" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,20 L0,15 L5,15 L5,10 L10,10 L10,5 L15,5 L15,0 L20,0" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="1" />
              <path d="M0,15 L5,15 L5,10 L10,10 L10,5 L15,5" fill="none" stroke="var(--gold-leaf)" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="20" fill="url(#maya-step)" />
        </svg>

        {/* Gears Section */}
        <div className="p-5 md:p-8 flex flex-col items-center gap-6 text-center">
          <div className="w-full">
            <h3 className="text-emerald-400 font-serif text-lg uppercase tracking-widest font-bold mb-4 drop-shadow-md">
              La Rueda Calendárica
            </h3>
            <MayaCalendarGears mayaDate={mayaDate} />
            <p className="text-gold-dim/80 text-xs font-serif mt-4 italic max-w-xl mx-auto">
              El calendario maya clásico se representa como una serie de engranajes interconectados. 
              El engranaje pequeño de 13 números se entrelaza con el de 20 signos para formar el Tzolk'in (260 días), 
              que a su vez gira junto al Haab' (365 días) formando un ciclo mayor de 52 años.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full bg-ink/80 border-y border-emerald-500/30 sticky top-0 z-10 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('tzolkin')}
            className={`flex-1 min-w-[120px] py-3 text-sm font-serif uppercase tracking-widest font-bold transition-all border-b-4 ${activeTab === 'tzolkin' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gold-dim hover:bg-white/5'}`}
          >
            Tzolk'in
          </button>
          <button
            onClick={() => setActiveTab('haab')}
            className={`flex-1 min-w-[120px] py-3 text-sm font-serif uppercase tracking-widest font-bold transition-all border-b-4 ${activeTab === 'haab' ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-transparent text-gold-dim hover:bg-white/5'}`}
          >
            Haab'
          </button>
          <button
            onClick={() => setActiveTab('longcount')}
            className={`flex-1 min-w-[120px] py-3 text-sm font-serif uppercase tracking-widest font-bold transition-all border-b-4 ${activeTab === 'longcount' ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-transparent text-gold-dim hover:bg-white/5'}`}
          >
            Cuenta Larga
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex-1 min-w-[120px] py-3 text-sm font-serif uppercase tracking-widest font-bold transition-all border-b-4 ${activeTab === 'forecast' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-transparent text-gold-dim hover:bg-white/5'}`}
          >
            Próximos Días
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 md:p-8">
          
          {/* TZOLKIN TAB */}
          {activeTab === 'tzolkin' && (
            <div className="animate-fadeIn space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h3 className="text-2xl font-black text-emerald-400 font-serif mb-2">El Calendario Sagrado (Tzolk'in)</h3>
                <p className="text-parchment/90 font-serif leading-relaxed text-sm">
                  El Tzolk'in dura <strong>260 días</strong>, que coincide con el período de gestación humana. 
                  No tiene meses, sino que combina un ciclo de <strong>13 números</strong> con un ciclo de <strong>20 nahuales (signos)</strong>. 
                  Visualízalo como dos engranajes girando juntos: cuando el engranaje de 13 números da 20 vueltas, y el de 20 signos da 13 vueltas, el ciclo vuelve a empezar.
                </p>
              </div>

              <div className="bg-emerald-900/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-center gap-6 text-center max-w-lg mx-auto">
                <div>
                  <div className="text-3xl text-emerald-300 font-black">13</div>
                  <div className="text-xs uppercase tracking-widest text-emerald-500/80">Números</div>
                </div>
                <div className="text-2xl text-gold-dim">×</div>
                <div>
                  <div className="text-3xl text-emerald-300 font-black">20</div>
                  <div className="text-xs uppercase tracking-widest text-emerald-500/80">Signos</div>
                </div>
                <div className="text-2xl text-gold-dim">=</div>
                <div>
                  <div className="text-3xl text-parchment font-black">260</div>
                  <div className="text-xs uppercase tracking-widest text-gold-leaf">Días</div>
                </div>
              </div>

              <h4 className="text-center font-bold text-gold-leaf uppercase tracking-widest mt-8 mb-4">Los 20 Signos (Nahuales)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {TZOLKIN_LORE.map((t, i) => {
                  const isCurrent = t.name.toLowerCase() === mayaDate.tzolkin.name.toLowerCase();
                  return (
                    <div key={i} className={`p-3 rounded-lg border transition-all text-center group cursor-pointer ${isCurrent ? 'bg-emerald-900/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105 z-10' : 'bg-ink border-gold-dim/20 hover:border-emerald-500/50 hover:bg-emerald-900/20'}`}>
                      {isCurrent && <div className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full mb-2 w-max mx-auto uppercase font-bold tracking-wider animate-pulse">Hoy</div>}
                      <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{t.icon}</div>
                      <div className={`font-serif font-bold text-sm uppercase ${isCurrent ? 'text-emerald-400' : 'text-emerald-300'}`}>{t.name}</div>
                      <div className={`text-[10px] font-bold tracking-wider mb-2 ${isCurrent ? 'text-parchment' : 'text-parchment/80'}`}>{t.meaning}</div>
                      <div className="text-[9px] text-gold-dim italic leading-tight">{t.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HAAB TAB */}
          {activeTab === 'haab' && (
            <div className="animate-fadeIn space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h3 className="text-2xl font-black text-amber-400 font-serif mb-2">El Calendario Solar (Haab')</h3>
                <p className="text-parchment/90 font-serif leading-relaxed text-sm">
                  El Haab' es el calendario civil agrícola de <strong>365 días</strong>. 
                  Consta de <strong>18 meses (uinales) de 20 días</strong> cada uno, sumando 360 días. 
                  Al final del año, se añaden <strong>5 días nefastos</strong> conocidos como el <em>Wayeb'</em>.
                  El Haab' marca las estaciones, las lluvias y los rituales comunitarios.
                </p>
              </div>

              <div className="bg-amber-900/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-center gap-6 text-center max-w-lg mx-auto">
                <div>
                  <div className="text-3xl text-amber-300 font-black">18</div>
                  <div className="text-xs uppercase tracking-widest text-amber-500/80">Meses</div>
                </div>
                <div className="text-2xl text-gold-dim">×</div>
                <div>
                  <div className="text-3xl text-amber-300 font-black">20</div>
                  <div className="text-xs uppercase tracking-widest text-amber-500/80">Días</div>
                </div>
                <div className="text-2xl text-gold-dim">+</div>
                <div>
                  <div className="text-3xl text-red-400 font-black">5</div>
                  <div className="text-xs uppercase tracking-widest text-red-400/80">Wayeb'</div>
                </div>
                <div className="text-2xl text-gold-dim">=</div>
                <div>
                  <div className="text-3xl text-parchment font-black">365</div>
                  <div className="text-xs uppercase tracking-widest text-gold-leaf">Días</div>
                </div>
              </div>

              <h4 className="text-center font-bold text-gold-leaf uppercase tracking-widest mt-8 mb-4">Los 19 Períodos del Haab'</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {HAAB_NAMES.map((name, i) => {
                  const lore = getHaabLore(name);
                  const isWayeb = name === 'Wayeb\'';
                  const isCurrent = name === mayaDate.haab.name;
                  return (
                    <div key={i} className={`p-3 rounded-lg border flex flex-col items-center text-center transition-all cursor-pointer relative ${isCurrent ? (isWayeb ? 'bg-red-900/60 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105 z-10' : 'bg-amber-900/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10') : (isWayeb ? 'bg-red-900/20 border-red-500/40 hover:bg-red-900/40' : 'bg-ink border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-900/20')}`}>
                      {isCurrent && <div className={`text-[10px] px-2 py-0.5 rounded-full mb-2 w-max mx-auto uppercase font-bold tracking-wider animate-pulse ${isWayeb ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>Mes Actual</div>}
                      <div className="text-2xl mb-1">{lore?.icon}</div>
                      <div className={`font-serif font-bold text-sm uppercase ${isCurrent ? (isWayeb ? 'text-red-300' : 'text-amber-300') : (isWayeb ? 'text-red-400' : 'text-amber-500/80')}`}>{name}</div>
                      <div className={`text-[10px] font-bold tracking-wider mb-2 ${isWayeb ? 'text-red-300/80' : 'text-parchment/80'}`}>{lore?.title}</div>
                      <div className="text-[9px] text-gold-dim italic leading-tight">{lore?.ritual}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LONG COUNT TAB */}
          {activeTab === 'longcount' && (
            <div className="animate-fadeIn space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h3 className="text-2xl font-black text-blue-400 font-serif mb-2">La Cuenta Larga</h3>
                <p className="text-parchment/90 font-serif leading-relaxed text-sm">
                  La Cuenta Larga es un registro lineal y continuo del tiempo desde una fecha mítica de creación (11 de agosto de 3114 a.C.). 
                  Utiliza un sistema vigesimal modificado (base 20). Su estructura piramidal permite contar vastos océanos de tiempo.
                </p>
              </div>

              <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                {/* B'ak'tun */}
                <div className="bg-blue-900/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] p-4 rounded-xl flex items-center justify-between group hover:bg-blue-900/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-bl-lg">Actual</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex flex-col items-center justify-center border-2 border-blue-400/80">
                      <span className="text-2xl font-black text-blue-300 drop-shadow-md leading-none">{mayaDate.longCount.baktun}</span>
                    </div>
                    <div>
                      <div className="text-xl font-serif font-black text-blue-300 uppercase tracking-widest">B'ak'tun</div>
                      <div className="text-sm text-parchment/80 italic">Valor base: 144,000 días</div>
                    </div>
                  </div>
                </div>

                {/* K'atun */}
                <div className="bg-blue-900/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] p-4 rounded-xl flex items-center justify-between group hover:bg-blue-900/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-bl-lg">Actual</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex flex-col items-center justify-center border-2 border-blue-400/80">
                      <span className="text-2xl font-black text-blue-300 drop-shadow-md leading-none">{mayaDate.longCount.katun}</span>
                    </div>
                    <div>
                      <div className="text-xl font-serif font-black text-blue-300 uppercase tracking-widest">K'atun</div>
                      <div className="text-sm text-parchment/80 italic">Valor base: 7,200 días</div>
                    </div>
                  </div>
                </div>

                {/* Tun */}
                <div className="bg-blue-900/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] p-4 rounded-xl flex items-center justify-between group hover:bg-blue-900/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-bl-lg">Actual</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex flex-col items-center justify-center border-2 border-blue-400/80">
                      <span className="text-2xl font-black text-blue-300 drop-shadow-md leading-none">{mayaDate.longCount.tun}</span>
                    </div>
                    <div>
                      <div className="text-xl font-serif font-black text-blue-300 uppercase tracking-widest">Tun</div>
                      <div className="text-sm text-parchment/80 italic">Valor base: 360 días</div>
                    </div>
                  </div>
                </div>

                {/* Winal */}
                <div className="bg-blue-900/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] p-4 rounded-xl flex items-center justify-between group hover:bg-blue-900/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-bl-lg">Actual</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex flex-col items-center justify-center border-2 border-blue-400/80">
                      <span className="text-2xl font-black text-blue-300 drop-shadow-md leading-none">{mayaDate.longCount.uinal}</span>
                    </div>
                    <div>
                      <div className="text-xl font-serif font-black text-blue-300 uppercase tracking-widest">Winal</div>
                      <div className="text-sm text-parchment/80 italic">Valor base: 20 días</div>
                    </div>
                  </div>
                </div>

                {/* K'in */}
                <div className="bg-blue-900/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] p-4 rounded-xl flex items-center justify-between group hover:bg-blue-900/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-bl-lg">Actual</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex flex-col items-center justify-center border-2 border-blue-400/80">
                      <span className="text-2xl font-black text-blue-300 drop-shadow-md leading-none">{mayaDate.longCount.kin}</span>
                    </div>
                    <div>
                      <div className="text-xl font-serif font-black text-blue-300 uppercase tracking-widest">K'in</div>
                      <div className="text-sm text-parchment/80 italic">Valor base: 1 día</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORECAST TAB */}
          {activeTab === 'forecast' && (
            <div className="animate-fadeIn space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-8 bg-purple-900/10 border border-purple-500/20 p-6 rounded-xl">
                <h3 className="text-2xl font-black text-purple-400 font-serif mb-4">El Avance de los Engranajes</h3>
                <p className="text-parchment/90 font-serif text-sm leading-relaxed mb-4">
                  Observa cómo funciona físicamente la Rueda Calendárica. Cada amanecer, el engranaje del <strong>Tzolk'in</strong> y el del <strong>Haab'</strong> giran un solo "diente".
                </p>
                <ul className="text-left text-xs font-serif text-gold-dim space-y-2 max-w-md mx-auto bg-ink/50 p-4 rounded-lg border border-gold-dim/10">
                  <li className="flex gap-2">
                    <span className="text-emerald-400">►</span> 
                    El número sagrado suma 1 (al llegar a 13, vuelve a 1).
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400">►</span> 
                    El signo sagrado avanza al siguiente en la lista de 20.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400">►</span> 
                    El día solar suma 1 (al llegar a 19, cambia al siguiente mes).
                  </li>
                </ul>
              </div>

              <div className="relative max-w-3xl mx-auto">
                {/* Línea vertical de tiempo */}
                <div className="absolute left-6 sm:left-14 top-8 bottom-8 w-px bg-gradient-to-b from-purple-500/50 via-gold-dim/20 to-transparent z-0 hidden sm:block"></div>

                <div className="space-y-4">
                  {nextDays.map((day, idx) => {
                    const isToday = idx === 0;
                    return (
                      <div key={idx} className="relative z-10 flex flex-col sm:flex-row gap-4 items-center group">
                        
                        {/* Indicador de línea de tiempo */}
                        <div className={`hidden sm:flex w-8 h-8 rounded-full border-4 border-ink shrink-0 items-center justify-center text-xs font-black z-10 ${isToday ? 'bg-purple-500 text-ink shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-gold-dim/20 text-gold-dim'}`}>
                          {idx === 0 ? 'H' : `+${idx}`}
                        </div>

                        <div className={`w-full p-4 rounded-xl border flex flex-col md:flex-row gap-4 md:items-center transition-all ${isToday ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]' : day.isWayeb ? 'bg-red-900/20 border-red-500/40 hover:bg-red-900/30' : 'bg-ink border-gold-dim/20 hover:border-gold-dim/40'}`}>
                          
                          {/* Fecha Gregoriana */}
                          <div className="flex flex-col md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-gold-dim/20 pb-3 md:pb-0 text-center md:text-left">
                            <span className="text-parchment font-bold uppercase">{day.gregorianDate.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            {isToday ? (
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full mt-1 w-max mx-auto md:mx-0 uppercase font-bold tracking-wider">Hoy</span>
                            ) : (
                              <span className="text-[10px] text-gold-dim mt-1 uppercase font-serif tracking-widest">{idx === 1 ? 'Mañana' : `En ${idx} días`}</span>
                            )}
                          </div>

                          {/* Combinación de la Rueda */}
                          <div className="flex-1 flex flex-row items-center justify-center md:justify-around gap-2">
                            
                            {/* Tzolk'in */}
                            <div className="flex flex-col items-center flex-1 bg-emerald-900/10 p-2 rounded-lg border border-emerald-500/20">
                              <div className="text-[9px] uppercase tracking-widest text-emerald-500/80 font-bold mb-1">Tzolk'in</div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-emerald-400 drop-shadow-md">{day.tzolkin.number}</span>
                                <span className="font-serif font-black text-sm text-parchment uppercase">{day.tzolkin.name}</span>
                              </div>
                            </div>

                            <div className="text-xl text-gold-dim/40 shrink-0 font-light">+</div>

                            {/* Haab */}
                            <div className={`flex flex-col items-center flex-1 p-2 rounded-lg border ${day.isWayeb ? 'bg-red-900/10 border-red-500/20' : 'bg-amber-900/10 border-amber-500/20'}`}>
                              <div className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${day.isWayeb ? 'text-red-400/80' : 'text-amber-500/80'}`}>Haab'</div>
                              <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black drop-shadow-md ${day.isWayeb ? 'text-red-400' : 'text-amber-400'}`}>{day.haab.number}</span>
                                <span className={`font-serif font-black text-sm uppercase ${day.isWayeb ? 'text-red-300' : 'text-parchment'}`}>{day.haab.name}</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Border Pattern */}
        <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderTop: '2px solid rgba(16,185,129,0.3)' }}>
          <rect x="0" y="0" width="100%" height="20" fill="url(#maya-step)" transform="scale(1, -1) translate(0, -20)" />
        </svg>

      </div>
    </div>
  );
};

export default MayaCalendarInfo;
