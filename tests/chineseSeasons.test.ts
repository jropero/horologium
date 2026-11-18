import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vite-plus/test';
import { chineseCalendarData } from '../utils/chineseCalendarData';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { CLEAR_X0, CLEAR_X1, generateChineseLandscape } from '../utils/chineseLandscape';
import {
  PENTAD_DETAILS,
  POOL_FROZEN_TERMS,
  TERM_DETAILS,
  detailBox,
  detailVisible,
  isPoolFrozen,
  pentadDetail,
  seasonBase,
  termDetail,
} from '../utils/chineseSeasons';

const SEEDS = [20261117, 20270101, 20270615, 1, 99999999];

/** Corner where the 長安 seal sits (measured at 390–1280 px, with margin). */
const SEAL_BOX = { x0: 292, y0: 8, x1: 320, y1: 54 };

type Box = { x0: number; x1: number; y0: number; y1: number };
const overlap = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const boxOf = (d: string) => detailBox([{ cls: '', d }]);

describe('solar-term details', () => {
  it('has exactly one detail for each of the 24 terms', () => {
    expect(TERM_DETAILS).toHaveLength(24);
    for (let id = 1; id <= 24; id++) expect(termDetail(id), `term ${id}`).toBeDefined();
  });

  it('draws a pentad of its own term, as written in chineseCalendarData', () => {
    for (const d of TERM_DETAILS) {
      const term = chineseCalendarData.find(t => t.id === d.termId)!;
      expect(term.hanzi).toBe(d.term);
      expect(term.pentads[d.pentadIndex - 1].description).toContain(d.pentad);
    }
  });

  it('never emits NaN and stays inside the picture', () => {
    for (const seed of SEEDS) {
      const crown = generateChineseLandscape(seed).willows[0].crown;
      for (const d of TERM_DETAILS) {
        const strokes = d.draw({ willowCrown: crown });
        for (const s of strokes) expect(s.d).not.toMatch(/NaN|undefined|Infinity/);
        const b = detailBox(strokes);
        expect(b.x0, d.term).toBeGreaterThanOrEqual(-46);
        expect(b.x1, d.term).toBeLessThanOrEqual(340);
        expect(b.y0, d.term).toBeGreaterThanOrEqual(0);
        expect(b.y1, d.term).toBeLessThanOrEqual(206);
      }
    }
  });

  it('keeps out of the instrument strip, the pagoda, the gate and the seal', () => {
    for (const seed of SEEDS) {
      const land = generateChineseLandscape(seed);
      const pagoda = boxOf(land.pagoda.body);
      const gate = boxOf(land.gate.body);
      for (const d of TERM_DETAILS) {
        const b = detailBox(d.draw({ willowCrown: land.willows[0].crown }));
        expect(b.x1 < CLEAR_X0 || b.x0 > CLEAR_X1, `${d.term}: x ${b.x0}..${b.x1}`).toBe(true);
        expect(overlap(b, pagoda), `${d.term} overlaps the pagoda`).toBe(false);
        expect(overlap(b, gate), `${d.term} overlaps the gate`).toBe(false);
        expect(overlap(b, SEAL_BOX), `${d.term} overlaps the seal`).toBe(false);
      }
    }
  });

  it('hides details that contradict the hour or the weather', () => {
    const rainbow = termDetail(5)!;
    expect(detailVisible(rainbow, true, 'clear', false)).toBe(true);
    expect(detailVisible(rainbow, true, 'fog', false)).toBe(false);
    expect(detailVisible(rainbow, true, 'rain', false)).toBe(false);
    expect(detailVisible(rainbow, false, 'clear', false)).toBe(false);
    const swallows = termDetail(4)!;
    expect(detailVisible(swallows, true, 'storm', false)).toBe(false);
    expect(detailVisible(swallows, true, 'partly-cloudy', false)).toBe(true);
    const fireflies = termDetail(12)!;
    expect(detailVisible(fireflies, true, 'clear', false)).toBe(false);
    expect(detailVisible(fireflies, false, 'clear', false)).toBe(true);
    expect(detailVisible(fireflies, true, 'clear', true)).toBe(true);
    // Ground details that don't depend on the weather stay, e.g. a snowy 立夏.
    expect(detailVisible(termDetail(7)!, true, 'snow', false)).toBe(true);
  });
});

describe('frozen pool', () => {
  it('is frozen exactly in 冬至, 小寒 and 大寒', () => {
    const frozen = chineseCalendarData.filter(t => isPoolFrozen(t.id)).map(t => t.hanzi);
    expect(frozen).toEqual(['冬至', '小寒', '大寒']);
    expect([...POOL_FROZEN_TERMS].sort((a, b) => a - b)).toEqual([22, 23, 24]);
  });

  it('agrees with the term card: frozen in mid-January, open in July', () => {
    expect(isPoolFrozen(getChineseCalendarData(new Date(2027, 0, 15, 12)).term.id)).toBe(true);
    expect(isPoolFrozen(getChineseCalendarData(new Date(2027, 6, 15, 12)).term.id)).toBe(false);
    expect(isPoolFrozen(getChineseCalendarData(new Date(2027, 1, 10, 12)).term.id)).toBe(false);
  });
});

describe('seasonal base', () => {
  const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

  it('changes smoothly from day to day over the whole year', () => {
    const step = 360 / 365.2422;
    let prev = seasonBase(0);
    for (let day = 1; day <= 366; day++) {
      const cur = seasonBase(day * step);
      expect(Math.abs(cur.foliage - prev.foliage)).toBeLessThan(0.04);
      expect(Math.abs(cur.warmth - prev.warmth)).toBeLessThan(0.02);
      const a = channels(cur.leaf);
      const b = channels(prev.leaf);
      for (let i = 0; i < 3; i++) expect(Math.abs(a[i] - b[i])).toBeLessThanOrEqual(6);
      prev = cur;
    }
  });

  it('is bare in winter, full in summer, and warmest in 大暑', () => {
    expect(seasonBase(270).foliage).toBe(0); // 冬至
    expect(seasonBase(90).foliage).toBe(1); // 夏至
    expect(seasonBase(120).warmth).toBeCloseTo(1, 5); // 大暑
    expect(seasonBase(300).warmth).toBeCloseTo(-1, 5); // 大寒
  });
});

/** Jesús's 24 term captions (formerly TERM_CAPTIONS in ChineseClock.tsx); 14 with the article fixed. */
const JESUS_CAPTIONS: Record<number, string> = {
  1: "El viento del este rompe el hielo del Qujiang: Chang'an despierta al primer aliento de la primavera.",
  2: 'Los gansos salvajes emprenden el vuelo hacia el norte sobre la bruma de tinta que envuelve el Qinling.',
  3: "El melocotonero estalla en flor y los insectos despiertan bajo la tierra aún húmeda de Chang'an.",
  4: 'Las golondrinas regresan rasando el Qujiang: el día y la noche se equilibran sobre la capital eterna.',
  5: "Un arco de luz atraviesa el Qinling tras la lluvia, y el aire de Chang'an brilla como jade recién lavado.",
  6: "La lenteja de agua florece en el Qujiang y la lluvia de los cereales bendice los campos de Chang'an.",
  7: "La enredadera trepa sobre la roca y el calor comienza a posarse sobre los tejados rojos de Chang'an.",
  8: "El trigo dora la meseta y Chang'an respira el olor de la cosecha que se acerca bajo el sol alto.",
  9: "El alcaudón canta desde la roca al pie del pino y los campos de Chang'an se llenan de espigas maduras.",
  10: "El ciervo suelta su cornamenta en el solsticio más largo: el sol alcanza su cenit sobre Chang'an.",
  11: 'Los jóvenes halcones aprenden a remontar el vuelo sobre el Leyou mientras el calor hace temblar el aire.',
  12: 'Las luciérnagas flotan sobre el Qujiang en la noche más cálida del año, hilos de luz entre la tinta.',
  13: "El rocío blanco toca la hierba del Leyou: el otoño llega sin avisar y Chang'an muda de piel.",
  14: "Las gavillas reposan sobre la meseta y el calor se retira; Chang'an recibe la abundancia del año.",
  15: "Los gansos emprenden el vuelo hacia el sur sobrevolando el Qinling: el otoño ya es dueño de Chang'an.",
  16: 'El Qujiang retrocede y deja al descubierto la orilla de barro: el equinoccio divide el año en silencio.',
  17: 'El crisantemo abre su flor amarilla en la meseta y el rocío frío anuncia el fin del tiempo cálido.',
  18: 'Las hojas amarillas caen en remolinos alrededor de los sauces y la escarcha pinta el amanecer de blanco.',
  19: "El primer hielo bordea las orillas del Qujiang y el invierno pone su mano sobre Chang'an.",
  20: 'El vapor del frío asciende del Qujiang como espíritus de tinta hacia el cielo gris de la pequeña nieve.',
  21: 'Los brotes de 荔 rompen la tierra helada: incluso en la gran nevada, la vida empuja hacia la luz.',
  22: 'Una grieta en el hielo revela el agua viva del Qujiang: el solsticio más oscuro guarda la semilla de la luz.',
  23: 'La urraca comienza su nido en el sauce desnudo: el frío más profundo no apaga el instinto de crear.',
  24: 'El gran frío agrieta el hielo del Qujiang bajo la nieve acumulada en sus orillas: el año llega a su último aliento.',
};

/** Tone-marked pinyin: one syllable per hanzi, letters and tone marks only. */
const PINYIN_SYLLABLE = /^[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/;

describe('72 pentads', () => {
  it('has exactly three entries for each of the 24 terms, in order', () => {
    expect(PENTAD_DETAILS).toHaveLength(72);
    for (let id = 1; id <= 24; id++) {
      const entries = PENTAD_DETAILS.filter(d => d.termId === id);
      expect(entries.map(d => d.pentadIndex)).toEqual([1, 2, 3]);
      for (let p = 1; p <= 3; p++) expect(pentadDetail(id, p), `${id}-${p}`).toBeDefined();
    }
  });

  it('names each pentad as in chineseCalendarData, with one pinyin syllable per character', () => {
    for (const d of PENTAD_DETAILS) {
      const term = chineseCalendarData.find(t => t.id === d.termId)!;
      expect(term.hanzi, `${d.termId}-${d.pentadIndex}`).toBe(d.term);
      expect(term.pentads[d.pentadIndex - 1].description).toContain(`(${d.pentad})`);
      const syllables = d.pinyin.split(' ');
      expect(syllables, d.pentad).toHaveLength(d.pentad.length);
      for (const s of syllables) expect(s, d.pentad).toMatch(PINYIN_SYLLABLE);
    }
  });

  it('gives every pentad a Spanish caption', () => {
    for (const d of PENTAD_DETAILS) {
      expect(d.caption.trim().length, d.pentad).toBeGreaterThan(40);
      expect(d.caption).not.toMatch(/\b(the|and|of)\b/i);
    }
  });

  it('keeps each of Jesús’s captions on the pentad its term scene shows', () => {
    for (let id = 1; id <= 24; id++) {
      const scene = termDetail(id)!;
      expect(scene.termScene).toBe(true);
      expect(scene.caption, `term ${id}`).toBe(JESUS_CAPTIONS[id]);
      expect(PENTAD_DETAILS.filter(d => d.caption === JESUS_CAPTIONS[id])).toEqual([scene]);
    }
    expect(TERM_DETAILS).toHaveLength(24);
  });

  it('keeps every detail out of the instrument strip, the pagoda, the gate and the seal', () => {
    for (const seed of SEEDS) {
      const land = generateChineseLandscape(seed);
      const ctx = { willowCrown: land.willows[0].crown, pinePerch: land.pine.perch };
      const pagoda = boxOf(land.pagoda.body);
      const gate = boxOf(land.gate.body);
      for (const d of PENTAD_DETAILS) {
        const strokes = d.draw(ctx);
        for (const st of strokes) expect(st.d).not.toMatch(/NaN|undefined|Infinity/);
        const b = detailBox(strokes);
        const id = `${d.term} ${d.pentad}`;
        expect(b.x1 < CLEAR_X0 || b.x0 > CLEAR_X1, `${id}: x ${b.x0}..${b.x1}`).toBe(true);
        expect(overlap(b, pagoda), `${id} overlaps the pagoda`).toBe(false);
        expect(overlap(b, gate), `${id} overlaps the gate`).toBe(false);
        expect(overlap(b, SEAL_BOX), `${id} overlaps the seal`).toBe(false);
        expect(b.x0, id).toBeGreaterThanOrEqual(-46);
        expect(b.x1, id).toBeLessThanOrEqual(340);
        expect(b.y0, id).toBeGreaterThanOrEqual(0);
        expect(b.y1, id).toBeLessThanOrEqual(206);
      }
    }
  });

  it('hides weather- and hour-bound details when they would contradict the scene', () => {
    const birds = PENTAD_DETAILS.filter(d => d.replacesBirds);
    expect(birds.length).toBeGreaterThanOrEqual(6);
    for (const d of birds) {
      expect(detailVisible(d, true, 'storm', false), d.pentad).toBe(false);
      expect(detailVisible(d, false, 'clear', false), d.pentad).toBe(false);
    }
    // Lightning and thunderheads don't show through fog or snow.
    for (const [t, p] of [
      [4, 2],
      [4, 3],
      [12, 3],
    ]) {
      expect(detailVisible(pentadDetail(t, p)!, true, 'fog', false)).toBe(false);
      expect(detailVisible(pentadDetail(t, p)!, true, 'snow', false)).toBe(false);
    }
    // 虹藏不見 is the empty sky: it shows in every weather.
    const hidden = pentadDetail(20, 1)!;
    for (const w of ['clear', 'rain', 'fog', 'snow'] as const)
      expect(detailVisible(hidden, true, w, false)).toBe(true);
  });

  it('agrees with the pentad the term card computes', () => {
    for (const date of [
      new Date(2027, 2, 6, 12),
      new Date(2027, 2, 12, 12),
      new Date(2027, 2, 18, 12),
    ]) {
      const { term, pentad } = getChineseCalendarData(date);
      const d = pentadDetail(term.id, pentad)!;
      expect(term.pentads[pentad - 1].description).toContain(d.pentad);
    }
  });

  it('styles every class a detail uses (unstyled paths would be invisible)', () => {
    const css = readFileSync(
      new URL('../components/ChineseScene.css', import.meta.url),
      'utf8',
    );
    const land = generateChineseLandscape(1);
    const ctx = { willowCrown: land.willows[0].crown, pinePerch: land.pine.perch };
    const classes = new Set(
      PENTAD_DETAILS.flatMap(d => d.draw(ctx).flatMap(st => st.cls.split(' '))),
    );
    for (const c of classes) expect(css, c).toMatch(new RegExp(`\\.${c}(?![\\w-])`));
  });
});
