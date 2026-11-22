import type { Species } from "@/components/art/Critter";
import { ALPHABET } from "./alphabet";

/**
 * ABC Race: a quiz mode. Each cup covers a few letters; every correct answer
 * closes in on the kart ahead, and two in a row past each rival wins the race.
 * Pure functions only, so the screens stay simple and this stays testable.
 */

export interface RaceCup {
  number: number;
  name: string;
  /** Letters this cup teaches. */
  letters: string[];
  /** The champion cup tops up its letters with a review of earlier ones. */
  review: boolean;
  /** The present in the gift box at the finish. */
  prize: { emoji: string; name: string };
}

export const RACE_CUPS: RaceCup[] = [
  { number: 1, name: "Cup A–F", letters: [..."ABCDEF"], review: false, prize: { emoji: "🧸", name: "a teddy bear" } },
  { number: 2, name: "Cup G–L", letters: [..."GHIJKL"], review: false, prize: { emoji: "🎈", name: "a big balloon" } },
  { number: 3, name: "Cup M–R", letters: [..."MNOPQR"], review: false, prize: { emoji: "🍭", name: "a rainbow lollipop" } },
  { number: 4, name: "Cup S–X", letters: [..."STUVWX"], review: false, prize: { emoji: "🦄", name: "a unicorn" } },
  { number: 5, name: "Champion Cup", letters: [..."YZ"], review: true, prize: { emoji: "🏆", name: "the champion trophy" } },
];

export function getCup(n: number): RaceCup | undefined {
  return RACE_CUPS.find((c) => c.number === n);
}

export interface Racer {
  name: string;
  species: Species;
  kart: string;
}

export const PLAYER: Racer = { name: "Bunny", species: "bunny", kart: "#ff7aa2" };

/** Overtaken in this order; Tiger is the champion at the front. */
export const RIVALS: Racer[] = [
  { name: "Duck", species: "duck", kart: "#ffd84d" },
  { name: "Pig", species: "pig", kart: "#7fd18a" },
  { name: "Fox", species: "fox", kart: "#8fd3ff" },
  { name: "Bear", species: "bear", kart: "#b9a3f5" },
  { name: "Tiger", species: "tiger", kart: "#ff6b5b" },
];

/** Correct answers needed to pass one rival. */
export const ANSWERS_PER_RIVAL = 2;
export const ANSWERS_TO_FINISH = RIVALS.length * ANSWERS_PER_RIVAL;

/**
 * - "hear": the letter is only said aloud; pick it.
 * - "picture": a picture word with its first letter hidden; pick the letter.
 * - "lowercase": a big capital letter; pick its small letter.
 */
export type QuestionKind = "hear" | "picture" | "lowercase";
const KINDS: QuestionKind[] = ["hear", "picture", "lowercase"];

export interface Question {
  id: number;
  kind: QuestionKind;
  letter: string;
  /** Labels on the three boxes (capitals, or small letters for "lowercase"). */
  choices: string[];
  answer: string;
}

/** Small letters that little ones mix up, used as tricky wrong answers. */
const LOOK_ALIKE: Record<string, string[]> = {
  b: ["d", "p", "q"], d: ["b", "q", "p"], p: ["q", "b", "d"], q: ["p", "d", "b"],
  m: ["n", "w"], n: ["m", "u", "h"], u: ["n", "v"], w: ["m", "v"], v: ["w", "u", "y"],
  i: ["j", "l"], j: ["i", "g"], l: ["i", "t"], h: ["n", "b"], g: ["q", "j"],
  c: ["o", "e"], o: ["c", "a"], e: ["c", "a"], a: ["o", "e"], t: ["f", "l"], f: ["t"],
};

export type Random = () => number;

function shuffle<T>(items: T[], rand: Random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Letters asked in this race, in a shuffled order. */
export function racePool(cup: RaceCup, rand: Random): string[] {
  const earlier = ALPHABET.filter((l) => !cup.letters.includes(l));
  const review = cup.review ? shuffle(earlier, rand).slice(0, 4) : [];
  return shuffle([...cup.letters, ...review], rand);
}

function pickDistractors(answer: string, kind: QuestionKind, pool: string[], rand: Random): string[] {
  const picked = new Set<string>();
  if (kind === "lowercase") {
    for (const l of shuffle(LOOK_ALIKE[answer] ?? [], rand)) if (picked.size < 1) picked.add(l);
  }
  // Prefer letters from this race so every box is something being learned.
  const candidates = [
    ...shuffle(pool, rand),
    ...shuffle(ALPHABET, rand),
  ].map((l) => (kind === "lowercase" ? l.toLowerCase() : l));
  for (const l of candidates) {
    if (picked.size >= 2) break;
    if (l !== answer) picked.add(l);
  }
  return [...picked];
}

/**
 * The n-th question of a race: letters cycle through the pool, question kinds
 * rotate. Pass `retry` after a wrong answer to ask the same letter another way.
 */
export function makeQuestion(n: number, pool: string[], rand: Random, retry?: Question): Question {
  const letter = retry ? retry.letter : pool[n % pool.length];
  const kind = retry
    ? KINDS[(KINDS.indexOf(retry.kind) + 1) % KINDS.length]
    : KINDS[(n + Math.floor(n / pool.length)) % KINDS.length];
  const answer = kind === "lowercase" ? letter.toLowerCase() : letter;
  const choices = shuffle([answer, ...pickDistractors(answer, kind, pool, rand)], rand);
  return { id: n, kind, letter, choices, answer };
}

export interface RaceState {
  correct: number;
  /** Wrong answers since the last correct one: the rival pulls a little further ahead. */
  lag: number;
  asked: number;
  /** The latest thing that happened, for animations. */
  event: { kind: "start" | "correct" | "wrong" | "pass" | "finish"; n: number };
}

export function startRace(): RaceState {
  return { correct: 0, lag: 0, asked: 0, event: { kind: "start", n: 0 } };
}

export function answerQuestion(state: RaceState, isCorrect: boolean): RaceState {
  const n = state.event.n + 1;
  if (!isCorrect) {
    return { ...state, lag: Math.min(state.lag + 1, 2), asked: state.asked + 1, event: { kind: "wrong", n } };
  }
  const correct = state.correct + 1;
  const kind = correct >= ANSWERS_TO_FINISH ? "finish" : correct % ANSWERS_PER_RIVAL === 0 ? "pass" : "correct";
  return { correct, lag: 0, asked: state.asked + 1, event: { kind, n } };
}

export const isFinished = (s: RaceState) => s.correct >= ANSWERS_TO_FINISH;

/** Index of the rival currently ahead (RIVALS.length once everyone is passed). */
export const currentRival = (s: RaceState) => Math.floor(s.correct / ANSWERS_PER_RIVAL);

/** How many more correct answers until the current rival is passed (1 or 2). */
export const answersToPass = (s: RaceState) => ANSWERS_PER_RIVAL - (s.correct % ANSWERS_PER_RIVAL);
