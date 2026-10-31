// Layout helpers for the SVG figures that draw rows of "token" chips.
// Fonts are not measured at build time, so widths are estimated per character
// (a CJK glyph is about twice as wide as a Latin one at the figures' 15px label
// size), keeping each label comfortably inside its box.

export interface Chip {
  t: string;
  x: number;
  w: number;
}

export const CHIP_H = 30;
export const CHIP_GAP = 6;

const WIDE = /[\u3000-\u9fff\uf900-\ufaff\uff00-\uffef]|\p{Extended_Pictographic}/u;

/** Estimated width of a chip holding `t`, padding included. */
export function chipWidth(t: string): number {
  let w = 0;
  for (const c of t) {
    if (WIDE.test(c)) {
      w += 16;
    } else if (c === " ") {
      w += 5;
    } else {
      w += 8.5;
    }
  }
  return Math.round(w + 18);
}

/** Total width of a row of chips. */
export function chipsWidth(toks: string[], gap = CHIP_GAP): number {
  return toks.reduce((sum, t) => sum + chipWidth(t), 0) + gap * (toks.length - 1);
}

/** Lay chips out left to right, starting at `x0`. */
export function chipsFrom(toks: string[], x0: number, gap = CHIP_GAP): Chip[] {
  let x = x0;
  return toks.map((t) => {
    const w = chipWidth(t);
    const chip = { t, x, w };
    x += w + gap;
    return chip;
  });
}

/** Lay chips out centred on `cx`. */
export function chipsCentred(toks: string[], cx: number, gap = CHIP_GAP): Chip[] {
  return chipsFrom(toks, cx - chipsWidth(toks, gap) / 2, gap);
}
