import React from 'react';
import { Landmark, Columns3, Pyramid } from 'lucide-react';
import { useCivilization, Civilization } from '../contexts/CivilizationContext';

const civs: { id: Civilization; icon: typeof Landmark; label: string; activeColor: string; activeGlow: string }[] = [
  { id: 'rome', icon: Landmark, label: 'Roma', activeColor: 'text-roman-red', activeGlow: 'shadow-[0_0_12px_rgba(255,82,82,0.4)]' },
  { id: 'hellas', icon: Columns3, label: 'Ἑλλάς', activeColor: 'text-sky-400', activeGlow: 'shadow-[0_0_12px_rgba(56,189,248,0.4)]' },
  { id: 'aegyptus', icon: Pyramid, label: 'Kemet', activeColor: 'text-emerald-400', activeGlow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]' },
];

const BottomNav: React.FC = () => {
  const { civilization, setCivilization } = useCivilization();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="bg-ink/90 backdrop-blur-xl border-t border-gold-dim/20">
        <div className="max-w-md mx-auto flex items-stretch justify-around h-[60px]">
          {civs.map(({ id, icon: Icon, label, activeColor, activeGlow }) => {
            const isActive = civilization === id;
            return (
              <button
                key={id}
                onClick={() => setCivilization(id)}
                className={`
                  relative flex-1 flex flex-col items-center justify-center gap-1
                  transition-all duration-300 active:scale-90
                  ${isActive ? activeColor : 'text-parchment/30'}
                `}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <div className={`absolute top-1.5 w-1 h-1 rounded-full bg-current ${activeGlow}`} />
                )}
                <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-serif uppercase tracking-widest transition-all ${isActive ? 'opacity-100 font-bold' : 'opacity-60'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
