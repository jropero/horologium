// mayaSkylineGenerator.ts — Maya architecture SVG path generator
// Generates pyramids (temples), stelae, and jungle trees

export type MayaBuildingType = 'pyramid' | 'stele' | 'tree';

export interface MayaSkylineElement {
  id: string;
  type: MayaBuildingType;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

const PRNG = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = s * 16807 % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const generateMayaSkyline = (seed: number): MayaSkylineElement[] => {
  const rand = PRNG(seed);
  const elements: MayaSkylineElement[] = [];

  const leftZone = { start: 5, end: 100 };
  const rightZone = { start: 200, end: 295 };

  const generateElement = (xStart: number, zoneEnd: number): { el: MayaSkylineElement, nextX: number } | null => {
    const types: MayaBuildingType[] = ['pyramid', 'pyramid', 'stele', 'tree', 'tree', 'tree'];
    const type = types[Math.floor(rand() * types.length)];

    let width = 0;
    let height = 0;
    const scale = 0.5 + rand() * 0.7;

    switch (type) {
      case 'pyramid': width = 45 * scale; height = 30 * scale; break;
      case 'stele': width = 6 * scale; height = 20 * scale; break;
      case 'tree': width = 15 * scale; height = 30 * scale; break;
    }

    if (xStart + width > zoneEnd) return null;

    let path = '';
    const cx = xStart + width / 2;
    let baseY = 180;

    // Terrain curve (jungle hill)
    const t = cx / 300;
    baseY = 180 - 10 * Math.sin(t * Math.PI * 2) + 10;

    switch (type) {
      case 'pyramid': {
        // Step pyramid silhouette
        const steps = 5;
        const stepH = height / steps;
        for (let i = 0; i < steps; i++) {
          const w = width * (1 - (i / steps) * 0.4);
          const y = baseY - (i * stepH);
          path += `M ${cx - w / 2} ${y} L ${cx + w / 2} ${y} L ${cx + w / 2} ${y - stepH} L ${cx - w / 2} ${y - stepH} Z `;
        }
        // Temple on top
        path += `M ${cx - width * 0.2} ${baseY - height} L ${cx + width * 0.2} ${baseY - height} L ${cx + width * 0.2} ${baseY - height - 8} L ${cx - width * 0.2} ${baseY - height - 8} Z `;
        break;
      }
      case 'stele': {
        // Tall rectangular stone pillar
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height} L ${xStart} ${baseY - height} Z `;
        break;
      }
      case 'tree': {
        // Jungle tree
        path += `M ${cx} ${baseY} L ${cx} ${baseY - height * 0.6} `;
        path += `M ${cx} ${baseY - height * 0.6} q ${width} -${height * 0.5} 0 -${height * 0.4} q -${width} -${height * 0.5} 0 ${height * 0.4} Z `;
        break;
      }
    }

    return {
      el: {
        id: `skyline-${type}-${xStart}`,
        type,
        path,
        x: xStart,
        y: baseY - height,
        width,
        height,
        opacity: 0.7 + rand() * 0.3
      },
      nextX: xStart + width + 5 + rand() * 15
    };
  };

  let currentX = leftZone.start;
  while (currentX < leftZone.end) {
    const res = generateElement(currentX, leftZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  currentX = rightZone.start;
  while (currentX < rightZone.end) {
    const res = generateElement(currentX, rightZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  return elements;
};
