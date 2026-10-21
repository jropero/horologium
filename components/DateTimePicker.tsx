import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DateTimePickerProps {
  initialDate: Date;
  onConfirm: (date: Date) => void;
  onClose: () => void;
  /** When provided, renders a "Volver al presente" button inside the popup. */
  onReturnToLive?: () => void;
}

const MIN_YEAR = -1000;
const MAX_YEAR = 3000;

/** Week starts on Sunday, matching toLocaleDateString('es-ES') behaviour of the rest of the app. */
const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

const clampYear = (y: number) => Math.max(MIN_YEAR, Math.min(MAX_YEAR, y));

const pad2 = (n: number) => String(n).padStart(2, '0');

const buildGrid = (year: number, month: number): (number | null)[] => {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(42).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells[startOffset + d - 1] = d;
  return cells;
};

interface WheelColumnProps {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
  format?: (v: number) => string;
}

interface WheelColumnHandle {
  /** The item currently centred in the wheel, including a scroll not yet committed. */
  read: () => number;
}

/**
 * Scroll-snap wheel column. Pure DOM (no native control), so it renders
 * correctly inside the app's themed popup on Android WebView.
 */
const WheelColumn = forwardRef<WheelColumnHandle, WheelColumnProps>(({ items, value, onChange, label, format }, ref) => {
  const ITEM_H = 44;
  const listRef = useRef<HTMLDivElement>(null);
  const userScrolling = useRef(false);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the wheel centered on `value` when it changes outside of user scrolls.
  useEffect(() => {
    const el = listRef.current;
    if (!el || userScrolling.current) return;
    const idx = items.indexOf(value);
    if (idx >= 0 && el.scrollTop !== idx * ITEM_H) {
      el.scrollTop = idx * ITEM_H;
    }
  }, [value, items]);

  useEffect(
    () => () => {
      if (commitTimer.current) clearTimeout(commitTimer.current);
    },
    []
  );

  const centredItem = () => {
    const el = listRef.current;
    if (!el) return value;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
    return items[idx];
  };

  useImperativeHandle(ref, () => ({ read: centredItem }));

  const commit = () => {
    userScrolling.current = false;
    const next = centredItem();
    if (next !== value) onChange(next);
  };

  const handleScroll = () => {
    userScrolling.current = true;
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(commit, 180);
  };

  const fmt = format ?? pad2;

  return (
    <div className="flex-1 min-w-0">
      <div className="text-center font-serif text-[10px] uppercase tracking-[0.25em] text-gold-dim/70 mb-1.5">
        {label}
      </div>
      <div className="relative">
        <div className="h-[132px] overflow-hidden rounded-lg border border-gold-dim/20 bg-black/30">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto snap-y snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* One-row spacers so the first and last items can reach the centre bar;
                item i is centred at scrollTop = i * ITEM_H. */}
            <div aria-hidden="true" className="h-[44px] shrink-0" />
            {items.map((it) => (
              <div
                key={it}
                className={`h-[44px] snap-center flex items-center justify-center font-serif text-lg tabular-nums select-none transition-colors ${
                  it === value ? 'text-gold-leaf font-bold' : 'text-parchment/45'
                }`}
              >
                {fmt(it)}
              </div>
            ))}
            <div aria-hidden="true" className="h-[44px] shrink-0" />
          </div>
        </div>
        {/* Center selection bar */}
        <div className="pointer-events-none absolute inset-x-0 top-[44px] h-[44px] border-y border-gold-leaf/40 bg-gold-leaf/5" />
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[44px] bg-gradient-to-b from-ink to-transparent rounded-t-lg" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44px] bg-gradient-to-t from-ink to-transparent rounded-b-lg" />
      </div>
      <div className="mt-1.5 text-center font-serif text-sm text-gold-leaf tabular-nums">{fmt(value)}</div>
    </div>
  );
});

const DateTimePicker: React.FC<DateTimePickerProps> = ({ initialDate, onConfirm, onClose, onReturnToLive }) => {
  const [value, setValue] = useState<Date>(() => {
    const d = new Date(initialDate);
    d.setFullYear(clampYear(d.getFullYear()));
    return d;
  });
  const [view, setView] = useState<{ y: number; m: number }>(() => ({
    y: clampYear(initialDate.getFullYear()),
    m: initialDate.getMonth(),
  }));
  const [yearInput, setYearInput] = useState<string>(() => String(clampYear(initialDate.getFullYear())));
  const [yearEditing, setYearEditing] = useState(false);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const grid = useMemo(() => buildGrid(view.y, view.m), [view]);

  const monthLabel = useMemo(
    () => {
      const s = new Date(view.y, view.m, 1).toLocaleDateString('es-ES', { month: 'long' });
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    [view]
  );

  const hourWheelRef = useRef<WheelColumnHandle>(null);
  const minuteWheelRef = useRef<WheelColumnHandle>(null);

  useEffect(() => {
    if (yearEditing) return;
    setYearInput(String(view.y));
  }, [view.y, yearEditing]);

  const commitYear = (raw: string) => {
    const parsed = parseInt(raw.replace(/[^-0-9]/g, ''), 10);
    if (Number.isNaN(parsed)) {
      setYearInput(String(view.y));
      setYearEditing(false);
      return;
    }
    const clamped = clampYear(parsed);
    setView(v => ({ ...v, y: clamped }));
    setValue(v => clampYearDate(new Date(clamped, v.getMonth(), v.getDate(), v.getHours(), v.getMinutes())));
    setYearInput(String(clamped));
    setYearEditing(false);
  };
  // (that would revert a day picked in the meantime).
  const setTime = (h: number) => {
    setValue((v) => new Date(v.getFullYear(), v.getMonth(), v.getDate(), h, v.getMinutes()));
  };
  const setMinute = (m: number) => {
    setValue((v) => new Date(v.getFullYear(), v.getMonth(), v.getDate(), v.getHours(), m));
  };

  const pickDay = (day: number) => {
    setValue((v) => clampYearDate(new Date(view.y, view.m, day, v.getHours(), v.getMinutes())));
  };

  // Read the wheels directly so a scroll whose commit is still pending is not lost.
  const confirm = () => {
    const h = hourWheelRef.current?.read() ?? value.getHours();
    const m = minuteWheelRef.current?.read() ?? value.getMinutes();
    onConfirm(new Date(value.getFullYear(), value.getMonth(), value.getDate(), h, m));
  };

  const shiftMonth = (delta: number) => {
    setView((v) => {
      let m = v.m + delta;
      let y = v.y;
      while (m < 0) {
        m += 12;
        y -= 1;
      }
      while (m > 11) {
        m -= 12;
        y += 1;
      }
      return { y: clampYear(y), m };
    });
  };

  const shiftYear = (delta: number) => {
    setView((v) => ({ y: clampYear(v.y + delta), m: v.m }));
  };

  const isSelected = (day: number) =>
    value.getFullYear() === view.y && value.getMonth() === view.m && value.getDate() === day;

  const isToday = (day: number) => {
    const now = new Date();
    return now.getFullYear() === view.y && now.getMonth() === view.m && now.getDate() === day;
  };

  const summary = `${value.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${pad2(value.getHours())}:${pad2(value.getMinutes())}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-ink border-2 border-gold-dim/40 rounded-xl shadow-2xl w-full max-w-sm max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gold-dim/30 text-center shrink-0">
          <h3 className="font-serif text-sm text-gold-leaf uppercase tracking-[0.3em] font-bold">⏳ Viaje Temporal</h3>
          <p className="text-[10px] text-gold-dim/60 font-serif mt-1 tracking-wide">Simula cualquier fecha y hora</p>
          <div className="mt-2 mx-auto w-fit font-serif text-xs text-parchment/80 tabular-nums bg-gold-leaf/5 border border-gold-dim/20 rounded-full px-3 py-1">
            {summary}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Month / year navigation */}
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => shiftYear(-1)}
              disabled={view.y <= MIN_YEAR}
              className="p-2 rounded-lg text-gold-dim/70 hover:text-gold-leaf hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Año anterior"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => shiftMonth(-1)}
              className="p-2 rounded-lg text-gold-dim/70 hover:text-gold-leaf hover:bg-white/5 transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <div className="font-serif text-sm text-parchment font-bold tracking-wide capitalize">
                {monthLabel}{' '}
                {yearEditing ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={yearInput}
                    onChange={e => setYearInput(e.target.value)}
                    onBlur={() => commitYear(yearInput)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        setYearInput(String(view.y));
                        setYearEditing(false);
                      }
                    }}
                    className="w-16 text-center bg-black/30 border border-gold-leaf/40 rounded px-1 font-serif text-sm text-gold-leaf tabular-nums focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => {
                      setYearInput(String(view.y));
                      setYearEditing(true);
                    }}
                    className="text-gold-leaf hover:underline underline-offset-2 tabular-nums"
                    aria-label="Cambiar año"
                  >
                    {view.y}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => shiftMonth(1)}
              className="p-2 rounded-lg text-gold-dim/70 hover:text-gold-leaf hover:bg-white/5 transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => shiftYear(1)}
              disabled={view.y >= MAX_YEAR}
              className="p-2 rounded-lg text-gold-dim/70 hover:text-gold-leaf hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Año siguiente"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center font-serif text-[10px] uppercase tracking-wider text-gold-dim/60 py-1">
                {w}
              </div>
            ))}
            {grid.map((day, i) =>
              day === null ? (
                <div key={i} />
              ) : (
                <button
                  key={i}
                  onClick={() => pickDay(day)}
                  className={`h-9 rounded-lg font-serif text-sm transition-all active:scale-90 ${
                    isSelected(day)
                      ? 'bg-gold-leaf text-ink font-bold shadow-[0_0_10px_rgba(207,181,59,0.35)]'
                      : isToday(day)
                        ? 'text-gold-leaf border border-gold-leaf/50 hover:bg-gold-leaf/10'
                        : 'text-parchment/70 hover:bg-gold-leaf/10 hover:text-parchment'
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>

          {/* Time wheels */}
          <div className="flex items-stretch gap-3 pt-1 border-t border-gold-dim/20">
            <WheelColumn ref={hourWheelRef} items={hours} value={value.getHours()} onChange={setTime} label="Hora" />
            <div className="flex items-center justify-center font-serif text-2xl text-gold-dim/50 pt-6">:</div>
            <WheelColumn ref={minuteWheelRef} items={minutes} value={value.getMinutes()} onChange={setMinute} label="Minuto" />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 flex flex-col gap-2 shrink-0">
          <button
            onClick={confirm}
            className="w-full py-2.5 rounded-lg bg-gold-leaf/10 border border-gold-leaf/40 text-gold-leaf font-serif text-sm uppercase tracking-widest hover:bg-gold-leaf/20 transition-all font-bold active:scale-[0.98]"
          >
            Viajar a esta fecha
          </button>
          {onReturnToLive && (
            <button
              onClick={onReturnToLive}
              className="w-full py-2 rounded-lg border border-amber-700/40 text-amber-400 font-serif text-xs uppercase tracking-widest hover:bg-amber-900/20 transition-all active:scale-[0.98]"
            >
              Volver al presente
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full text-center text-[10px] text-gold-dim/50 font-serif uppercase tracking-widest py-1.5 hover:text-gold-dim transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

/** Type-safe variant of clampYear applied to a Date. */
function clampYearDate(d: Date): Date {
  d.setFullYear(clampYear(d.getFullYear()));
  return d;
}

export default DateTimePicker;