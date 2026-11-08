import React from 'react';
import { STEMS, BRANCHES } from '../utils/chineseLunisolarUtils';
import { SHICHEN_DATA } from '../utils/chineseTimeUtils';
import './ChineseDatePillars.css';

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

const ELEMENT_CLASS: Record<string, string> = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water',
};

const XUN: [string, string][] = [
  ['上旬', 'días 1–10'],
  ['中旬', 'días 11–20'],
  ['下旬', 'días 21–30'],
];

const ChineseDatePillars: React.FC<Props> = ({
  yearStemIndex,
  yearBranchIndex,
  monthStemIndex,
  monthBranchIndex,
  dayStemIndex,
  dayBranchIndex,
  monthName,
  monthNumber,
  dayName,
  dayNumber,
  lunarNewYear,
  isLeapYear,
  isLeapMonth,
}) => {
  const pillars = [
    { label: '年', subLabel: 'AÑO', stemIdx: yearStemIndex, branchIdx: yearBranchIndex },
    { label: '月', subLabel: 'MES', stemIdx: monthStemIndex, branchIdx: monthBranchIndex },
    { label: '日', subLabel: 'DÍA', stemIdx: dayStemIndex, branchIdx: dayBranchIndex },
  ];

  return (
    <div className="chinese-date-pillars">
      {/* Header */}
      <div className="cdp__header">
        <div className="cdp__header-title">农历 · 天干地支</div>
        <div className="cdp__header-subtitle">Calendario Lunar · Ciclo Sexagenario</div>
      </div>

      {/* Date + xún progress */}
      <div className="cdp__date-section">
        <div className="cdp__date-center">
          <div className="cdp__date-hanzi">
            {monthName}&nbsp;&nbsp;{dayName}
          </div>
          <div className="cdp__date-sub">
            {isLeapMonth ? 'Mes intercalar · ' : ''}
            {monthNumber}º mes lunar · Día {dayNumber}
          </div>
        </div>

        {/* Three xún (旬): 上旬 days 1-10 · 中旬 11-20 · 下旬 21-30 */}
        <div className="cdp__xun-list">
          {XUN.map(([hanzi, es], xunIdx) => (
            <div key={xunIdx} className="cdp__xun-row">
              <div className="cdp__xun-label">
                <span className="cdp__xun-hanzi">{hanzi}</span>
                <span className="cdp__xun-es">{es}</span>
              </div>
              <div className="cdp__xun-bars">
                {Array.from({ length: 10 }, (_, i) => {
                  const day = xunIdx * 10 + i + 1;
                  const isCurrent = day === dayNumber;
                  const filled = day < dayNumber;
                  let barMod: string;
                  if (isCurrent) {
                    barMod = 'cdp__xun-bar--current';
                  } else if (filled) {
                    barMod = 'cdp__xun-bar--filled';
                  } else {
                    barMod = 'cdp__xun-bar--empty';
                  }
                  return <div key={i} className={`cdp__xun-bar ${barMod}`} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three pillars — 年柱 月柱 日柱 */}
      <div className="cdp__pillars">
        {pillars.map(({ label, subLabel, stemIdx, branchIdx }) => {
          const stem = STEMS[stemIdx];
          const branch = BRANCHES[branchIdx];
          const elemClass = ELEMENT_CLASS[stem.elementHanzi] ?? 'wood';
          const emoji = ANIMAL_EMOJI[branchIdx] ?? '';

          return (
            <div key={label} className={`cdp__pillar cdp__pillar--${elemClass}`}>
              <span className="cdp__pillar-label">{subLabel}</span>

              {/* Stem — large, element-colored */}
              <span className="cdp__stem">{stem.hanzi}</span>

              {/* Branch */}
              <span className="cdp__branch">{branch.hanzi}</span>

              {/* Animal emoji */}
              <span className="cdp__animal-emoji">{emoji}</span>

              {/* Element · Animal (Spanish) */}
              <div className="cdp__dim-text">
                <div>{stem.elementEs}</div>
                <div>{branch.animalEs}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="cdp__footer">
        <span>🌑 Año Nuevo Lunar: {lunarNewYear}</span>
        {isLeapYear && <span className="cdp__footer-leap">闰 Año bisiesto</span>}
      </div>
    </div>
  );
};

export default ChineseDatePillars;
