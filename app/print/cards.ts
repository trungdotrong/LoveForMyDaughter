import { ALPHABET } from "@/lib/alphabet";

/** Band colors, cycled across the cards. */
export const CARD_COLORS = ["#ff9fb6", "#8fd3ff", "#ffe27a", "#b9f0a8", "#cdb8ff", "#ffc48f"];

/** A4 holds 2 columns × 3 rows of cards, so 26 letters fill 5 pages. */
export const CARD_COLUMNS = 2;
export const CARD_ROWS = 3;
export const CARDS_PER_PAGE = CARD_COLUMNS * CARD_ROWS;

export function cardColor(letterIndex: number): string {
  return CARD_COLORS[letterIndex % CARD_COLORS.length];
}

/** Letters split into A4 pages: [A–F], [G–L], [M–R], [S–X], [Y–Z]. */
export const CARD_PAGES: string[][] = Array.from(
  { length: Math.ceil(ALPHABET.length / CARDS_PER_PAGE) },
  (_, i) => ALPHABET.slice(i * CARDS_PER_PAGE, (i + 1) * CARDS_PER_PAGE),
);
