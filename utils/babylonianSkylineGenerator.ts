// babylonianSkylineGenerator.ts — Babylonian architecture SVG path generator
// Generates ziggurats (step pyramids), mudbrick walls and date palms.
// Interface mirrors mayaSkylineGenerator.ts.

import { BabylonianBuildingType, BabylonianSkylineElement } from '../types/babylonia';

// ─── Seeded PRNG ──────────────────────────────────────────────────────────────

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

// ─── Path builders ────────────────────────────────────────────────────────────

const buildZiggurat = (cx: number, baseY: number, width: number, height: number): string => {
  const steps = 3 + Math.round(width / 30); // 3-5 steps
  let path = '';

  for (let i = 0; i < steps; i++) {
    const ratio = (steps - i) / steps;
    const w = width * ratio;
    const stepH = height / steps;
    const y = baseY - i * stepH;
    path += `M ${cx - w / 2} ${y} L ${cx + w / 2} ${y} `
          + `L ${cx + w / 2} ${y - stepH} L ${cx - w / 2} ${y - stepH} Z `;
  }

  // Small temple cap on top
  const capW = width * 0.18;
  const capH = height * 0.15;
  const topY = baseY - height;
  path += `M ${cx - capW} ${topY} L ${cx + capW} ${topY} `
        + `L ${cx + capW} ${topY - capH} L ${cx - capW} ${topY - capH} Z `;

  return path;
};

const buildWall = (xStart: number, baseY: number, width: number, height: number): string => {
  // Rectangular mudbrick base
  let path = `M ${xStart} ${baseY} L ${xStart + width} ${baseY} `
           + `L ${xStart + width} ${baseY - height} L ${xStart} ${baseY - height} Z `;

  // Merlons (crenellations) on top
  const merlonW = Math.max(4, width / 7);
  const merlonH = height * 0.22;
  const merlonCount = Math.floor(width / (merlonW * 2));
  const gapW = (width - merlonCount * merlonW) / (merlonCount + 1);
  for (let i = 0; i < merlonCount; i++) {
    const mx = xStart + gapW + i * (merlonW + gapW);
    const my = baseY - height;
    path += `M ${mx} ${my} L ${mx + merlonW} ${my} `
          + `L ${mx + merlonW} ${my - merlonH} L ${mx} ${my - merlonH} Z `;
  }

  return path;
};

const buildPalm = (cx: number, baseY: number, _width: number, height: number): string => {
  const trunkW = 3;
  const trunkH = height * 0.65;

  // Trunk
  let path = `M ${cx - trunkW / 2} ${baseY} L ${cx + trunkW / 2} ${baseY} `
           + `L ${cx + trunkW / 2} ${baseY - trunkH} L ${cx - trunkW / 2} ${baseY - trunkH} Z `;

  // Fronds — four arcing curves around the crown
  const crownY = baseY - trunkH;
  const frondLen = height * 0.4;
  const frondAngles = [-60, -30, 0, 30, 60, 90, 120, 150];
  for (const angle of frondAngles) {
    const rad = (angle * Math.PI) / 180;
    const ex = cx + Math.cos(rad) * frondLen;
    const ey = crownY - Math.abs(Math.sin(rad)) * frondLen * 0.8;
    const cpx = cx + Math.cos(rad) * frondLen * 0.5;
    const cpy = crownY - Math.abs(Math.sin(rad)) * frondLen * 0.3 - 4;
    path += `M ${cx} ${crownY} Q ${cpx} ${cpy} ${ex} ${ey} `;
  }

  return path;
};

// ─── Main generator ───────────────────────────────────────────────────────────

export const generateBabylonianSkyline = (seed: number): BabylonianSkylineElement[] => {
  const rand = seededRandom(seed);
  const elements: BabylonianSkylineElement[] = [];

  const leftZone  = { start: 5,   end: 110 };
  const rightZone = { start: 190, end: 295 };

  const generateElement = (
    xStart: number, zoneEnd: number
  ): { el: BabylonianSkylineElement; nextX: number } | null => {
    const types: BabylonianBuildingType[] = ['ziggurat', 'ziggurat', 'wall', 'wall', 'palm', 'palm'];
    const type = types[Math.floor(rand() * types.length)];

    const scale = 0.45 + rand() * 0.75;
    let width = 0;
    let height = 0;

    switch (type) {
      case 'ziggurat': width = 52 * scale; height = 38 * scale; break;
      case 'wall':     width = 40 * scale; height = 22 * scale; break;
      case 'palm':     width = 12 * scale; height = 32 * scale; break;
    }

    if (xStart + width > zoneEnd) return null;

    const cx = xStart + width / 2;

    // Subtle terrain undulation
    const t = cx / 300;
    const baseY = 182 - 8 * Math.sin(t * Math.PI * 1.5) + 6;

    let path = '';
    switch (type) {
      case 'ziggurat': path = buildZiggurat(cx, baseY, width, height); break;
      case 'wall':     path = buildWall(xStart, baseY, width, height); break;
      case 'palm':     path = buildPalm(cx, baseY, width, height); break;
    }

    return {
      el: {
        id: `bab-${type}-${Math.round(xStart)}`,
        type,
        path,
        x: xStart,
        y: baseY - height,
        width,
        height,
        opacity: 0.65 + rand() * 0.35,
      },
      nextX: xStart + width + 4 + rand() * 14,
    };
  };

  for (const zone of [leftZone, rightZone]) {
    let x = zone.start;
    while (x < zone.end) {
      const res = generateElement(x, zone.end);
      if (!res) { x += 6; continue; }
      elements.push(res.el);
      x = res.nextX;
    }
  }

  return elements;
};
