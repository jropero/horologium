import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './DateTimePicker.css';

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
const WheelColumn = forwardRef<WheelColumnHandle, WheelColumnProps>(
  ({ items, value, onChange, label, format }, ref) => {
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
      [],
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
      <div className="wheel-col">
        <div className="wheel-col__label">{label}</div>
        <div className="wheel-col__track-wrap">
          <div className="wheel-col__track">
            <div ref={listRef} onScroll={handleScroll} className="wheel-col__scroll">
              {/* One-row spacers so the first and last items can reach the centre bar;
                item i is centred at scrollTop = i * ITEM_H. */}
              <div aria-hidden="true" className="wheel-col__spacer" />
              {items.map(it => (
                <div
                  key={it}
                  className={`wheel-col__item ${
                    it === value ? 'wheel-item--selected' : 'wheel-item--inactive'
                  }`}
                >
                  {fmt(it)}
                </div>
              ))}
              <div aria-hidden="true" className="wheel-col__spacer" />
            </div>
          </div>
          {/* Center selection bar */}
          <div className="wheel-col__bar" />
          {/* Edge fades */}
          <div className="wheel-col__fade-top" />
          <div className="wheel-col__fade-bottom" />
        </div>
        <div className="wheel-col__value">{fmt(value)}</div>
      </div>
    );
  },
);
WheelColumn.displayName = 'WheelColumn';

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  initialDate,
  onConfirm,
  onClose,
  onReturnToLive,
}) => {
  const [value, setValue] = useState<Date>(() => {
    const d = new Date(initialDate);
    d.setFullYear(clampYear(d.getFullYear()));
    return d;
  });
  const [view, setView] = useState<{ y: number; m: number }>(() => ({
    y: clampYear(initialDate.getFullYear()),
    m: initialDate.getMonth(),
  }));
  const [yearInput, setYearInput] = useState<string>(() =>
    String(clampYear(initialDate.getFullYear())),
  );
  const [yearEditing, setYearEditing] = useState(false);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const grid = useMemo(() => buildGrid(view.y, view.m), [view]);

  const monthLabel = useMemo(() => {
    const s = new Date(view.y, view.m, 1).toLocaleDateString('es-ES', { month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [view]);

  const hourWheelRef = useRef<WheelColumnHandle>(null);
  const minuteWheelRef = useRef<WheelColumnHandle>(null);

  useEffect(() => {
    if (yearEditing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setValue(v =>
      clampYearDate(new Date(clamped, v.getMonth(), v.getDate(), v.getHours(), v.getMinutes())),
    );
    setYearInput(String(clamped));
    setYearEditing(false);
  };
  // (that would revert a day picked in the meantime).
  const setTime = (h: number) => {
    setValue(v => new Date(v.getFullYear(), v.getMonth(), v.getDate(), h, v.getMinutes()));
  };
  const setMinute = (m: number) => {
    setValue(v => new Date(v.getFullYear(), v.getMonth(), v.getDate(), v.getHours(), m));
  };

  const pickDay = (day: number) => {
    setValue(v => clampYearDate(new Date(view.y, view.m, day, v.getHours(), v.getMinutes())));
  };

  // Read the wheels directly so a scroll whose commit is still pending is not lost.
  const confirm = () => {
    const h = hourWheelRef.current?.read() ?? value.getHours();
    const m = minuteWheelRef.current?.read() ?? value.getMinutes();
    onConfirm(new Date(value.getFullYear(), value.getMonth(), value.getDate(), h, m));
  };

  const shiftMonth = (delta: number) => {
    setView(v => {
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
    setView(v => ({ y: clampYear(v.y + delta), m: v.m }));
  };

  const isSelected = (day: number) =>
    value.getFullYear() === view.y && value.getMonth() === view.m && value.getDate() === day;

  const isToday = (day: number) => {
    const now = new Date();
    return now.getFullYear() === view.y && now.getMonth() === view.m && now.getDate() === day;
  };

  const summary = `${value.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} · ${pad2(value.getHours())}:${pad2(value.getMinutes())}`;

  const renderDay = (day: number | null, i: number) => {
    if (day === null) return <div key={i} />;
    const dayMod = isSelected(day)
      ? 'dtp-day--selected'
      : // eslint-disable-next-line sonarjs/no-nested-conditional
      isToday(day)
      ? 'dtp-day--today'
      : 'dtp-day--default';
    return (
      <button key={i} onClick={() => pickDay(day)} className={`dtp-day ${dayMod}`}>
        {day}
      </button>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="date-time-picker animate-fadeIn"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <div role="presentation" className="dtp-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dtp-header">
          <h3 className="dtp-title">⏳ Viaje Temporal</h3>
          <p className="dtp-subtitle">Simula cualquier fecha y hora</p>
          <div className="dtp-summary">{summary}</div>
        </div>

        {/* Body */}
        <div className="dtp-body">
          {/* Month / year navigation */}
          <div className="dtp-nav">
            <button
              onClick={() => shiftYear(-1)}
              disabled={view.y <= MIN_YEAR}
              className="dtp-nav-btn"
              aria-label="Año anterior"
            >
              <ChevronsLeft />
            </button>
            <button
              onClick={() => shiftMonth(-1)}
              className="dtp-nav-btn"
              aria-label="Mes anterior"
            >
              <ChevronLeft />
            </button>
            <div className="dtp-nav-center">
              <div className="dtp-month-year">
                {monthLabel}{' '}
                {yearEditing ? (
                  <input
                    type="text"
                    inputMode="numeric"
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
                    className="dtp-year-input"
                  />
                ) : (
                  <button
                    onClick={() => {
                      setYearInput(String(view.y));
                      setYearEditing(true);
                    }}
                    className="dtp-year-btn"
                    aria-label="Cambiar año"
                  >
                    {view.y}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => shiftMonth(1)}
              className="dtp-nav-btn"
              aria-label="Mes siguiente"
            >
              <ChevronRight />
            </button>
            <button
              onClick={() => shiftYear(1)}
              disabled={view.y >= MAX_YEAR}
              className="dtp-nav-btn"
              aria-label="Año siguiente"
            >
              <ChevronsRight />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="dtp-weekday-grid">
            {WEEKDAYS.map(w => (
              <div key={w} className="dtp-weekday">
                {w}
              </div>
            ))}
            {grid.map(renderDay)}
          </div>

          {/* Time wheels */}
          <div className="dtp-time-section">
            <WheelColumn
              ref={hourWheelRef}
              items={hours}
              value={value.getHours()}
              onChange={setTime}
              label="Hora"
            />
            <div className="dtp-time-sep">:</div>
            <WheelColumn
              ref={minuteWheelRef}
              items={minutes}
              value={value.getMinutes()}
              onChange={setMinute}
              label="Minuto"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="dtp-actions">
          <button onClick={confirm} className="dtp-confirm">
            Viajar a esta fecha
          </button>
          {onReturnToLive && (
            <button onClick={onReturnToLive} className="dtp-return">
              Volver al presente
            </button>
          )}
          <button onClick={onClose} className="dtp-cancel">
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
