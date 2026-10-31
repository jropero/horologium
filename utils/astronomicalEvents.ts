import {
  SearchMoonQuarter, NextMoonQuarter,
  SearchLunarApsis, NextLunarApsis, ApsisKind,
  SearchMaxElongation,
  SearchRelativeLongitude,
  Body,
} from 'astronomy-engine';
import { getUpcomingEclipses } from './eclipseUtils';

export type AstroEventType =
  | 'moon-new' | 'moon-fq' | 'moon-full' | 'moon-lq'
  | 'moon-perigee' | 'moon-apogee'
  | 'elongation'
  | 'opposition'
  | 'eclipse-lunar' | 'eclipse-solar';

export interface AstroEvent {
  type: AstroEventType;
  time: Date;
  body?: string;           // 'Mercurius' | 'Venus' | 'Martis' | 'Iovis' | 'Saturni'
  elongationDeg?: number;
  elongationDir?: string;  // 'morning' | 'evening'
  distKm?: number;
  eclipseKind?: string;    // 'total' | 'partial' | 'annular' | 'penumbral'
  obscuration?: number;
  sdTotal?: number;
}

const PHASE_TYPES: AstroEventType[] = ['moon-new', 'moon-fq', 'moon-full', 'moon-lq'];

export function getAstronomicalEvents(
  startDate: Date,
  lat: number | null,
  lng: number | null,
): AstroEvent[] {
  const end = new Date(startDate.getTime() + 30 * 86_400_000);
  const events: AstroEvent[] = [];

  // Moon quarters (4 per month, always present)
  try {
    let mq = SearchMoonQuarter(startDate);
    while (mq.time.date <= end) {
      events.push({ type: PHASE_TYPES[mq.quarter]!, time: mq.time.date });
      mq = NextMoonQuarter(mq);
    }
  } catch { /* skip on out-of-range */ }

  // Lunar apsides (~2 per month)
  try {
    let ap = SearchLunarApsis(startDate);
    while (ap.time.date <= end) {
      events.push({
        type: ap.kind === ApsisKind.Pericenter ? 'moon-perigee' : 'moon-apogee',
        time: ap.time.date,
        distKm: Math.round(ap.dist_km),
      });
      ap = NextLunarApsis(ap);
    }
  } catch { /* skip */ }

  // Greatest elongation of inner planets (if within 30 days)
  for (const [body, name] of [
    [Body.Mercury, 'Mercurius'],
    [Body.Venus,   'Venus'],
  ] as [Body, string][]) {
    try {
      const el = SearchMaxElongation(body, startDate);
      if (el.time.date <= end) {
        events.push({
          type: 'elongation',
          time: el.time.date,
          body: name,
          elongationDeg: Math.round(el.elongation * 10) / 10,
          elongationDir: el.visibility,
        });
      }
    } catch { /* skip */ }
  }

  // Outer planet oppositions (if within 30 days — infrequent but spectacular)
  for (const [body, name] of [
    [Body.Mars,    'Martis'],
    [Body.Jupiter, 'Iovis'],
    [Body.Saturn,  'Saturni'],
  ] as [Body, string][]) {
    try {
      const t = SearchRelativeLongitude(body, 180.0, startDate);
      if (t.date <= end) {
        events.push({ type: 'opposition', time: t.date, body: name });
      }
    } catch { /* skip */ }
  }

  // Eclipses visible in the 30-day window
  try {
    const eclipses = getUpcomingEclipses(startDate, lat, lng, 6);
    for (const ec of eclipses) {
      if (ec.peak <= end) {
        events.push({
          type: ec.type === 'lunar' ? 'eclipse-lunar' : 'eclipse-solar',
          time: ec.peak,
          eclipseKind: ec.kind as string,
          obscuration: ec.obscuration,
          sdTotal: ec.sdTotal,
        });
      }
    }
  } catch { /* skip */ }

  return events.sort((a, b) => a.time.getTime() - b.time.getTime());
}
