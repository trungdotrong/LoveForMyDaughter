export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface LetterInfo {
  upper: string;
  lower: string;
  word: string;
  emoji: string;
}

const WORDS: Record<string, [word: string, emoji: string]> = {
  A: ["Apple", "🍎"],
  B: ["Ball", "⚽"],
  C: ["Cat", "🐱"],
  D: ["Dog", "🐶"],
  E: ["Egg", "🥚"],
  F: ["Fish", "🐟"],
  G: ["Grapes", "🍇"],
  H: ["Hat", "🎩"],
  I: ["Ice cream", "🍦"],
  J: ["Juice", "🧃"],
  K: ["Kite", "🪁"],
  L: ["Lemon", "🍋"],
  M: ["Moon", "🌙"],
  N: ["Nut", "🥜"],
  O: ["Orange", "🍊"],
  P: ["Pig", "🐷"],
  Q: ["Queen", "👑"],
  R: ["Rainbow", "🌈"],
  S: ["Sun", "☀️"],
  T: ["Tree", "🌳"],
  U: ["Umbrella", "☂️"],
  V: ["Van", "🚐"],
  W: ["Whale", "🐳"],
  X: ["Xylophone", "🎶"],
  Y: ["Yo-yo", "🪀"],
  Z: ["Zebra", "🦓"],
};

export function getLetterInfo(letter: string): LetterInfo {
  const upper = letter.toUpperCase();
  const [word, emoji] = WORDS[upper];
  return { upper, lower: upper.toLowerCase(), word, emoji };
}

export function isLetter(value: string): boolean {
  return value.length === 1 && ALPHABET.includes(value);
}

export interface LetterSet {
  number: number;
  letters: string[];
  /** The final set adds a review task: find one letter learned earlier. */
  hasReview: boolean;
}

export const LETTER_SETS: LetterSet[] = [
  { number: 1, letters: ["A", "B", "C"], hasReview: false },
  { number: 2, letters: ["D", "E", "F"], hasReview: false },
  { number: 3, letters: ["G", "H", "I"], hasReview: false },
  { number: 4, letters: ["J", "K", "L"], hasReview: false },
  { number: 5, letters: ["M", "N", "O"], hasReview: false },
  { number: 6, letters: ["P", "Q", "R"], hasReview: false },
  { number: 7, letters: ["S", "T", "U"], hasReview: false },
  { number: 8, letters: ["V", "W", "X"], hasReview: false },
  { number: 9, letters: ["Y", "Z"], hasReview: true },
];

export const TOTAL_SETS = LETTER_SETS.length;

export function getLetterSet(setNumber: number): LetterSet {
  return LETTER_SETS[setNumber - 1];
}

/** Letters taught before the final set; the review task picks from these. */
export const REVIEWABLE_LETTERS = LETTER_SETS.filter((s) => !s.hasReview).flatMap(
  (s) => s.letters,
);
