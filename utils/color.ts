/** Linear blend of two `#rrggbb` colours; `t` = 0 gives `a`, 1 gives `b`. */
export const lerpColor = (a: string, b: string, t: number): string => {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const channel = (shift: number) => {
    const from = (ah >> shift) & 0xff;
    const to = (bh >> shift) & 0xff;
    return Math.round(from + (to - from) * t)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(16)}${channel(8)}${channel(0)}`;
};
