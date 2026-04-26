// egyptianSkylineGenerator.ts — Egyptian architecture SVG path generator
// Generates pyramids, obelisks, pylons, palm trees and sphinxes

export type EgyptianBuildingType = 'pyramid' | 'obelisk' | 'pylon' | 'palm_tree' | 'sphinx';

export interface EgyptianSkylineElement {
  id: string;
  type: EgyptianBuildingType;
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

export const generateEgyptianSkyline = (seed: number): EgyptianSkylineElement[] => {
  const rand = PRNG(seed);
  const elements: EgyptianSkylineElement[] = [];

  const leftZone = { start: 5, end: 100 };
  const rightZone = { start: 200, end: 295 };

  const generateElement = (xStart: number, zoneEnd: number): { el: EgyptianSkylineElement, nextX: number } | null => {
    const types: EgyptianBuildingType[] = ['pyramid', 'pyramid', 'obelisk', 'pylon', 'palm_tree', 'palm_tree', 'sphinx', 'obelisk'];
    const type = types[Math.floor(rand() * types.length)];

    let width = 0;
    let height = 0;
    const scale = 0.5 + rand() * 0.7;

    switch (type) {
      case 'pyramid': width = 35 * scale; height = 25 * scale; break;
      case 'obelisk': width = 5 * scale; height = 32 * scale; break;
      case 'pylon': width = 28 * scale; height = 18 * scale; break;
      case 'palm_tree': width = 10 * scale; height = 24 * scale; break;
      case 'sphinx': width = 30 * scale; height = 12 * scale; break;
    }

    if (xStart + width > zoneEnd) return null;

    let path = '';
    const cx = xStart + width / 2;
    let baseY = 180;

    // Terrain curve matching greekSkylineGenerator
    if (cx >= 0 && cx <= 100) {
      const t = cx / 100;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    } else if (cx >= 200 && cx <= 300) {
      const t = (cx - 200) / 100;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    }

    switch (type) {
      case 'pyramid': {
        // Large triangle — the Great Pyramid silhouette
        path += `M ${xStart} ${baseY} L ${cx} ${baseY - height} L ${xStart + width} ${baseY} Z `;
        // Subtle face division line from apex to base midpoint
        const faceMid = xStart + width * 0.6;
        path += `M ${cx} ${baseY - height} L ${faceMid} ${baseY} `;
        break;
      }

      case 'obelisk': {
        // Tall thin pillar with pyramidion (pointed tip)
        const halfW = width / 2;
        const pyramidionH = height * 0.12;
        const shaftTop = baseY - height + pyramidionH;
        // Shaft
        path += `M ${cx - halfW} ${baseY} L ${cx - halfW} ${shaftTop} L ${cx + halfW} ${shaftTop} L ${cx + halfW} ${baseY} Z `;
        // Pyramidion (small pyramid on top)
        path += `M ${cx - halfW - 0.5} ${shaftTop} L ${cx} ${baseY - height} L ${cx + halfW + 0.5} ${shaftTop} Z `;
        // Base pedestal
        path += `M ${cx - halfW - 2} ${baseY} L ${cx + halfW + 2} ${baseY} L ${cx + halfW + 2} ${baseY - 2} L ${cx - halfW - 2} ${baseY - 2} Z `;
        break;
      }

      case 'pylon': {
        // Temple gateway — two trapezoidal towers with a gap
        const towerW = width * 0.35;
        const gapW = width * 0.3;
        const taper = towerW * 0.15; // inward taper at top (battered walls)
        // Left tower (trapezoid — wider at base, narrower at top)
        const lt = xStart;
        path += `M ${lt} ${baseY} L ${lt + taper} ${baseY - height} L ${lt + towerW - taper} ${baseY - height} L ${lt + towerW} ${baseY} Z `;
        // Right tower
        const rt = xStart + towerW + gapW;
        path += `M ${rt} ${baseY} L ${rt + taper} ${baseY - height} L ${rt + towerW - taper} ${baseY - height} L ${rt + towerW} ${baseY} Z `;
        // Lintel connecting the two towers
        const lintelY = baseY - height * 0.6;
        path += `M ${lt + towerW} ${lintelY} L ${rt} ${lintelY} L ${rt} ${lintelY + 2} L ${lt + towerW} ${lintelY + 2} Z `;
        // Cavetto cornice on each tower (small triangle at top)
        path += `M ${lt + taper - 1} ${baseY - height} L ${lt + towerW - taper + 1} ${baseY - height} L ${lt + towerW - taper + 1} ${baseY - height - 2} L ${lt + taper - 1} ${baseY - height - 2} Z `;
        path += `M ${rt + taper - 1} ${baseY - height} L ${rt + towerW - taper + 1} ${baseY - height} L ${rt + towerW - taper + 1} ${baseY - height - 2} L ${rt + taper - 1} ${baseY - height - 2} Z `;
        break;
      }

      case 'palm_tree': {
        // Thin trunk with fan-shaped fronds at top
        const trunkW = width * 0.12;
        const trunkH = height * 0.55;
        // Trunk (slightly curved)
        const sway = (rand() - 0.5) * 3;
        path += `M ${cx - trunkW / 2} ${baseY} L ${cx - trunkW / 2 + sway} ${baseY - trunkH} L ${cx + trunkW / 2 + sway} ${baseY - trunkH} L ${cx + trunkW / 2} ${baseY} Z `;
        // Fronds (5 curved leaf shapes radiating from top)
        const topX = cx + sway;
        const topY = baseY - trunkH;
        const frondLen = height * 0.5;
        for (let i = 0; i < 5; i++) {
          const angle = -70 + i * 35; // spread from -70 to +70 degrees
          const rad = (angle * Math.PI) / 180;
          const endX = topX + Math.sin(rad) * frondLen;
          const endY = topY - Math.cos(rad) * frondLen * 0.6;
          const cpX = topX + Math.sin(rad) * frondLen * 0.5;
          const cpY = topY - Math.cos(rad) * frondLen * 0.8;
          path += `M ${topX} ${topY} Q ${cpX} ${cpY} ${endX} ${endY} Q ${cpX + 1} ${cpY + 2} ${topX} ${topY} `;
        }
        break;
      }

      case 'sphinx': {
        // Recumbent lion body with human head
        const bodyH = height * 0.6;
        const headH = height;
        const bodyLen = width * 0.8;
        const headW = width * 0.2;
        // Body (elongated rectangle with rounded back)
        path += `M ${xStart} ${baseY} L ${xStart} ${baseY - bodyH} Q ${xStart + bodyLen * 0.5} ${baseY - bodyH - 3} ${xStart + bodyLen} ${baseY - bodyH} L ${xStart + bodyLen} ${baseY} Z `;
        // Paws extending forward
        path += `M ${xStart + bodyLen} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - bodyH * 0.4} L ${xStart + bodyLen} ${baseY - bodyH * 0.5} Z `;
        // Head (taller section at front)
        const headX = xStart + bodyLen - headW * 0.5;
        path += `M ${headX} ${baseY - bodyH} L ${headX} ${baseY - headH} L ${headX + headW} ${baseY - headH} L ${headX + headW} ${baseY - bodyH} Z `;
        // Nemes headdress flare
        path += `M ${headX - 1} ${baseY - headH + 2} L ${headX + headW + 1} ${baseY - headH + 2} L ${headX + headW + 1} ${baseY - headH} L ${headX - 1} ${baseY - headH} Z `;
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
        opacity: 0.8 + rand() * 0.2
      },
      nextX: xStart + width + 2 + rand() * 10
    };
  };

  // Left side
  let currentX = leftZone.start;
  while (currentX < leftZone.end) {
    const res = generateElement(currentX, leftZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  // Right side
  currentX = rightZone.start;
  while (currentX < rightZone.end) {
    const res = generateElement(currentX, rightZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  return elements;
};
