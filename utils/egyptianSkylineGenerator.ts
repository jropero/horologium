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

  const leftZone  = { start: 5,   end: 100 };
  const rightZone = { start: 200, end: 295 };

  const generateElement = (xStart: number, zoneEnd: number): { el: EgyptianSkylineElement, nextX: number } | null => {
    const types: EgyptianBuildingType[] = ['pyramid', 'pyramid', 'obelisk', 'pylon', 'palm_tree', 'palm_tree', 'sphinx', 'obelisk'];
    const type = types[Math.floor(rand() * types.length)];

    let width = 0;
    let height = 0;
    const scale = 0.5 + rand() * 0.7;

    switch (type) {
      case 'pyramid':   width = 35 * scale; height = 25 * scale; break;
      case 'obelisk':   width = 6  * scale; height = 34 * scale; break;
      case 'pylon':     width = 30 * scale; height = 20 * scale; break;
      case 'palm_tree': width = 10 * scale; height = 24 * scale; break;
      case 'sphinx':    width = 30 * scale; height = 12 * scale; break;
    }

    if (xStart + width > zoneEnd) return null;

    let path = '';
    const cx = xStart + width / 2;
    let baseY = 180;

    if (cx >= 0 && cx <= 100) {
      const t = cx / 100;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    } else if (cx >= 200 && cx <= 300) {
      const t = (cx - 200) / 100;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    }

    switch (type) {

      case 'pyramid': {
        // Great Pyramid silhouette: triangle with subtle face division
        path += `M ${xStart} ${baseY} L ${cx} ${baseY - height} L ${xStart + width} ${baseY} Z `;
        // Slight face division from apex toward right base third
        const faceMid = xStart + width * 0.6;
        path += `M ${cx} ${baseY - height} L ${faceMid} ${baseY} `;
        break;
      }

      case 'obelisk': {
        // Historically accurate tapered obelisk:
        //   - square base pedestal (wider than shaft)
        //   - shaft narrows from bottom to top (~45% of base width at apex)
        //   - distinct pyramidion (≈15% of total height)
        const pedH   = Math.max(1.5, height * 0.07);
        const pyrH   = height * 0.15;
        const shaftH = height - pedH - pyrH;
        const pedW   = width * 1.6;            // pedestal wider than shaft
        const topW   = width * 0.45;           // shaft narrows to 45% at top

        const shaftBotY = baseY - pedH;
        const shaftTopY = shaftBotY - shaftH;
        const apexY     = shaftTopY - pyrH;

        // Pedestal
        path += `M ${cx - pedW / 2} ${baseY} L ${cx + pedW / 2} ${baseY} `;
        path += `L ${cx + pedW / 2} ${shaftBotY} L ${cx - pedW / 2} ${shaftBotY} Z `;
        // Tapered shaft (trapezoid — wide at base, narrow at top)
        path += `M ${cx - width / 2} ${shaftBotY} L ${cx - topW / 2} ${shaftTopY} `;
        path += `L ${cx + topW / 2} ${shaftTopY} L ${cx + width / 2} ${shaftBotY} Z `;
        // Pyramidion — clear sharp triangle
        path += `M ${cx - topW / 2} ${shaftTopY} L ${cx} ${apexY} L ${cx + topW / 2} ${shaftTopY} Z `;
        break;
      }

      case 'pylon': {
        // Temple gateway: two massive battered (inward-sloping) towers flanking a tall doorway.
        // No horizontal lintel — the towers are independent, the void between is the gate.
        const towerW  = width * 0.42;
        const gapW    = width * 0.16;          // narrow gate void
        const taper   = towerW * 0.22;         // strong batter (inward slope)
        const corniceH = Math.max(1.5, height * 0.07); // flat cap at top

        // Left tower (battered trapezoid — wider at base)
        const lt = xStart;
        path += `M ${lt} ${baseY} L ${lt + taper} ${baseY - height} `;
        path += `L ${lt + towerW - taper} ${baseY - height} L ${lt + towerW} ${baseY} Z `;
        // Left cavetto cornice (flat rectangular cap on top of tower)
        path += `M ${lt + taper - 1.5} ${baseY - height} `;
        path += `L ${lt + towerW - taper + 1.5} ${baseY - height} `;
        path += `L ${lt + towerW - taper + 1.5} ${baseY - height - corniceH} `;
        path += `L ${lt + taper - 1.5} ${baseY - height - corniceH} Z `;

        // Right tower
        const rt = xStart + towerW + gapW;
        path += `M ${rt} ${baseY} L ${rt + taper} ${baseY - height} `;
        path += `L ${rt + towerW - taper} ${baseY - height} L ${rt + towerW} ${baseY} Z `;
        // Right cavetto cornice
        path += `M ${rt + taper - 1.5} ${baseY - height} `;
        path += `L ${rt + towerW - taper + 1.5} ${baseY - height} `;
        path += `L ${rt + towerW - taper + 1.5} ${baseY - height - corniceH} `;
        path += `L ${rt + taper - 1.5} ${baseY - height - corniceH} Z `;
        break;
      }

      case 'palm_tree': {
        // Thin trunk with fan-shaped fronds at top
        const trunkW = width * 0.12;
        const trunkH = height * 0.55;
        const sway   = (rand() - 0.5) * 3;
        path += `M ${cx - trunkW / 2} ${baseY} L ${cx - trunkW / 2 + sway} ${baseY - trunkH} `;
        path += `L ${cx + trunkW / 2 + sway} ${baseY - trunkH} L ${cx + trunkW / 2} ${baseY} Z `;
        const topX    = cx + sway;
        const topY    = baseY - trunkH;
        const frondLen = height * 0.5;
        for (let i = 0; i < 5; i++) {
          const angle = -70 + i * 35;
          const r = (angle * Math.PI) / 180;
          const endX = topX + Math.sin(r) * frondLen;
          const endY = topY - Math.cos(r) * frondLen * 0.6;
          const cpX  = topX + Math.sin(r) * frondLen * 0.5;
          const cpY  = topY - Math.cos(r) * frondLen * 0.8;
          path += `M ${topX} ${topY} Q ${cpX} ${cpY} ${endX} ${endY} Q ${cpX + 1} ${cpY + 2} ${topX} ${topY} `;
        }
        break;
      }

      case 'sphinx': {
        // Recumbent sphinx: elongated lion body + human head with nemes headdress
        const bodyH  = height * 0.55;
        const headH  = height * 0.92;
        const bodyLen = width * 0.72;
        const headW  = width * 0.22;
        const nemesW = headW * 1.55;   // nemes wider than head (drapes over shoulders)

        // Body with gentle arch on back
        path += `M ${xStart} ${baseY} L ${xStart} ${baseY - bodyH} `;
        path += `Q ${xStart + bodyLen * 0.4} ${baseY - bodyH - 2} ${xStart + bodyLen} ${baseY - bodyH} `;
        path += `L ${xStart + bodyLen} ${baseY} Z `;
        // Extended paws in front
        path += `M ${xStart + bodyLen} ${baseY - bodyH * 0.4} L ${xStart + width} ${baseY - bodyH * 0.28} `;
        path += `L ${xStart + width} ${baseY} L ${xStart + bodyLen} ${baseY} Z `;

        // Head (rectangular block rising above body)
        const headX = xStart + bodyLen - headW * 0.3;
        path += `M ${headX} ${baseY - bodyH} L ${headX} ${baseY - headH} `;
        path += `L ${headX + headW} ${baseY - headH} L ${headX + headW} ${baseY - bodyH} Z `;

        // Nemes headdress: wider than head, slopes down on both sides
        const nemesX = headX - (nemesW - headW) / 2;
        path += `M ${headX} ${baseY - headH} L ${headX + headW} ${baseY - headH} `;                         // top of head
        path += `L ${headX + headW} ${baseY - bodyH - 1} L ${nemesX + nemesW} ${baseY - headH + 4} `;      // right side drape
        path += `L ${nemesX} ${baseY - headH + 4} L ${headX} ${baseY - bodyH - 1} Z `;                     // left side drape
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
        opacity: 0.8 + rand() * 0.2,
      },
      nextX: xStart + width + 2 + rand() * 10,
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
