import {
  SearchLunarEclipse, NextLunarEclipse,
  SearchLocalSolarEclipse, NextLocalSolarEclipse,
  SearchGlobalSolarEclipse, NextGlobalSolarEclipse,
  Observer, EclipseKind,
} from 'astronomy-engine';

export interface EclipseEvent {
  type: 'lunar' | 'solar';
  kind: EclipseKind;
  peak: Date;
  partialBegin?: Date;
  partialEnd?: Date;
  totalBegin?: Date;
  totalEnd?: Date;
  obscuration?: number;
  sdTotal?: number;
  sdPartial?: number;
}

// Returns the next `count` eclipses (lunar + solar) after `startDate`.
// Solar eclipses use local visibility when lat/lng are provided; otherwise global tracks.
export const getUpcomingEclipses = (
  startDate: Date,
  lat: number | null,
  lng: number | null,
  count: number = 6,
): EclipseEvent[] => {
  const lunar: EclipseEvent[] = [];
  const solar: EclipseEvent[] = [];
  const need = count * 2; // gather extra to ensure enough after merge

  // ── Lunar eclipses ────────────────────────────────────────────────────────
  try {
    let info = SearchLunarEclipse(startDate);
    for (let i = 0; i < need; i++) {
      lunar.push({
        type: 'lunar',
        kind: info.kind,
        peak: info.peak.date,
        sdTotal:   info.sd_total   > 0 ? info.sd_total   : undefined,
        sdPartial: info.sd_partial > 0 ? info.sd_partial : undefined,
      });
      info = NextLunarEclipse(info.peak);
    }
  } catch { /* skip on out-of-range input */ }

  // ── Solar eclipses ────────────────────────────────────────────────────────
  try {
    if (lat !== null && lng !== null) {
      const observer = new Observer(lat, lng, 0);
      let info = SearchLocalSolarEclipse(startDate, observer);
      for (let i = 0; i < need * 2; i++) { // extra iterations to fill after filtering
        if (info.obscuration >= 0.01) {
          solar.push({
            type: 'solar',
            kind: info.kind,
            peak:         info.peak.time.date,
            partialBegin: info.partial_begin.time.date,
            partialEnd:   info.partial_end.time.date,
            totalBegin:   info.total_begin?.time.date,
            totalEnd:     info.total_end?.time.date,
            obscuration:  info.obscuration,
          });
          if (solar.length >= need) break;
        }
        info = NextLocalSolarEclipse(info.peak.time, observer);
      }
    } else {
      let info = SearchGlobalSolarEclipse(startDate);
      for (let i = 0; i < need; i++) {
        solar.push({
          type: 'solar',
          kind:        info.kind as EclipseKind,
          peak:        info.peak.date,
          obscuration: info.obscuration,
        });
        info = NextGlobalSolarEclipse(info.peak);
      }
    }
  } catch { /* skip on out-of-range input */ }

  return [...lunar, ...solar]
    .sort((a, b) => a.peak.getTime() - b.peak.getTime())
    .slice(0, count);
};
