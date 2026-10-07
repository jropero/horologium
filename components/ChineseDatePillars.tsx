import React from 'react';
import { STEMS, BRANCHES } from '../utils/chineseLunisolarUtils';
import { SHICHEN_DATA } from '../utils/chineseTimeUtils';

interface Props {
  yearStemIndex: number;
  yearBranchIndex: number;
  monthStemIndex: number;
  monthBranchIndex: number;
  dayStemIndex: number;
  dayBranchIndex: number;
  monthName: string;
  monthNumber: number;
  dayName: string;
  dayNumber: number;
  lunarNewYear: string;
  isLeapYear: boolean;
  isLeapMonth: boolean;
}

// Indexed by branch index (0=子…11=亥), same order as SHICHEN_DATA
const ANIMAL_EMOJI = SHICHEN_DATA.map(s => s.animalEmoji);

const ELEMENT_STYLE: Record<string, { text: string; dimText: string; bg: string; border: string }> = {
  '木': { text: 'text-emerald-400', dimText: 'text-emerald-300/60', bg: 'bg-emerald-900/20', border: 'border-emerald-500/25' },
  '火': { text: 'text-red-400',     dimText: 'text-red-300/60',     bg: 'bg-red-900/20',     border: 'border-red-500/25'     },
  '土': { text: 'text-amber-400',   dimText: 'text-amber-300/60',   bg: 'bg-amber-900/20',   border: 'border-amber-500/25'   },
  '金': { text: 'text-yellow-400',  dimText: 'text-yellow-300/60',  bg: 'bg-yellow-900/20',  border: 'border-yellow-500/25'  },
  '水': { text: 'text-cyan-400',    dimText: 'text-cyan-300/60',    bg: 'bg-cyan-900/20',    border: 'border-cyan-500/25'    },
};

const XUN: [string, string][] = [
  ['上旬', 'días 1–10'],
  ['中旬', 'días 11–20'],
  ['下旬', 'días 21–30'],
];

const ChineseDatePillars: React.FC<Props> = ({
  yearStemIndex, yearBranchIndex,
  monthStemIndex, monthBranchIndex,
  dayStemIndex, dayBranchIndex,
  monthName, monthNumber, dayName, dayNumber,
  lunarNewYear, isLeapYear, isLeapMonth,
}) => {
  const pillars = [
    { label: '年', subLabel: 'AÑO', stemIdx: yearStemIndex,  branchIdx: yearBranchIndex  },
    { label: '月', subLabel: 'MES', stemIdx: monthStemIndex, branchIdx: monthBranchIndex },
    { label: '日', subLabel: 'DÍA', stemIdx: dayStemIndex,   branchIdx: dayBranchIndex   },
  ];

  return (
    <div className="w-full bg-ink/90 border border-gold-leaf/30 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="text-center pt-4 pb-3 px-4 border-b border-gold-leaf/20">
        <div className="text-gold-leaf font-serif text-sm uppercase tracking-[0.3em]">农历 · 天干地支</div>
        <div className="text-parchment/50 text-xs uppercase tracking-widest mt-0.5">Calendario Lunar · Ciclo Sexagenario</div>
      </div>

      {/* Date + xún progress */}
      <div className="px-5 pt-4 pb-4 border-b border-gold-dim/20">
        <div className="text-center mb-4">
          <div className="text-3xl font-serif text-gold-leaf">
            {isLeapMonth ? '闰' : ''}{monthName}&nbsp;&nbsp;{dayName}
          </div>
          <div className="text-xs text-parchment/50 mt-1">
            {isLeapMonth ? 'Mes intercalar · ' : ''}{monthNumber}º mes lunar · Día {dayNumber}
          </div>
        </div>

        {/* Three xún (旬): 上旬 days 1-10 · 中旬 11-20 · 下旬 21-30 */}
        <div className="space-y-2">
          {XUN.map(([hanzi, es], xunIdx) => (
            <div key={xunIdx} className="flex items-center gap-2">
              <div className="shrink-0 text-right whitespace-nowrap">
                <span className="text-xs text-parchment/60">{hanzi}</span>
                <span className="text-xs text-parchment/35 ml-1">{es}</span>
              </div>
              <div className="flex gap-1 flex-1">
                {Array.from({ length: 10 }, (_, i) => {
                  const day = xunIdx * 10 + i + 1;
                  const isCurrent = day === dayNumber;
                  const filled = day < dayNumber;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        isCurrent ? 'h-2.5 bg-gold-leaf' :
                        filled    ? 'h-1.5 bg-gold-dim/50' :
                                    'h-1.5 bg-parchment/10'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three pillars — 年柱 月柱 日柱 */}
      <div className="grid grid-cols-3 divide-x divide-gold-dim/15">
        {pillars.map(({ label, subLabel, stemIdx, branchIdx }) => {
          const stem   = STEMS[stemIdx];
          const branch = BRANCHES[branchIdx];
          const style  = ELEMENT_STYLE[stem.elementHanzi] ?? ELEMENT_STYLE['木'];
          const emoji  = ANIMAL_EMOJI[branchIdx] ?? '';

          return (
            <div key={label} className={`flex flex-col items-center py-5 px-1 gap-1 ${style.bg}`}>
              <span className="text-xs text-parchment/40 uppercase tracking-widest mb-1">{subLabel}</span>

              {/* Stem — large, element-colored */}
              <span className={`text-4xl font-serif font-bold leading-none ${style.text}`}>
                {stem.hanzi}
              </span>

              {/* Branch */}
              <span className="text-4xl font-serif text-parchment/80 leading-none">
                {branch.hanzi}
              </span>

              {/* Animal emoji */}
              <span className="text-2xl mt-1">{emoji}</span>

              {/* Element · Animal (Spanish) */}
              <div className={`text-xs text-center leading-snug mt-0.5 ${style.dimText}`}>
                <div>{stem.elementEs}</div>
                <div>{branch.animalEs}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-center flex-wrap gap-3 text-xs text-parchment/45 py-3 px-4 border-t border-gold-dim/20">
        <span>🌑 Año Nuevo Lunar: {lunarNewYear}</span>
        {isLeapYear && <span className="text-amber-400/70">闰 Año bisiesto</span>}
      </div>
    </div>
  );
};

export default ChineseDatePillars;
