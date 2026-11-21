import { REVIEWABLE_LETTERS, TOTAL_SETS, getLetterSet } from "./alphabet";

/**
 * Theme-agnostic game rules. Every function here is pure: it takes a
 * ThemeProgress and returns a new one, so the same engine drives any Theme.
 */

export type GamePhase = "intro" | "challenge" | "story" | "finale";

export interface SessionRecord {
  sessionNumber: number;
  startedAt: string;
  completedAt: string;
}

export interface ThemeProgress {
  themeId: string;
  sessionNumber: number;
  phase: GamePhase;
  /** 1-based set the child is working on (or whose story event is showing). */
  currentSet: number;
  /** Task ids completed in this session: letters "A".."Z" plus "review". */
  completedTasks: string[];
  reviewLetter: string;
  finalePlayed: boolean;
  sessionStartedAt: string;
  history: SessionRecord[];
}

export const REVIEW_TASK_ID = "review";

export interface SetTask {
  id: string;
  letter: string;
  kind: "new" | "review";
}

export function getSetTasks(setNumber: number, reviewLetter: string): SetTask[] {
  const set = getLetterSet(setNumber);
  const tasks: SetTask[] = set.letters.map((letter) => ({ id: letter, letter, kind: "new" }));
  if (set.hasReview) {
    tasks.push({ id: REVIEW_TASK_ID, letter: reviewLetter, kind: "review" });
  }
  return tasks;
}

/** Deterministic per theme + session, so a refresh never changes the review letter. */
export function pickReviewLetter(themeId: string, sessionNumber: number): string {
  let hash = sessionNumber * 31;
  for (const ch of themeId) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return REVIEWABLE_LETTERS[hash % REVIEWABLE_LETTERS.length];
}

export function createSession(
  themeId: string,
  sessionNumber: number,
  history: SessionRecord[] = [],
): ThemeProgress {
  return {
    themeId,
    sessionNumber,
    phase: "intro",
    currentSet: 1,
    completedTasks: [],
    reviewLetter: pickReviewLetter(themeId, sessionNumber),
    finalePlayed: false,
    sessionStartedAt: new Date().toISOString(),
    history,
  };
}

export function isTaskDone(progress: ThemeProgress, task: SetTask): boolean {
  return progress.completedTasks.includes(task.id);
}

export function getCurrentTasks(progress: ThemeProgress): SetTask[] {
  return getSetTasks(progress.currentSet, progress.reviewLetter);
}

export type ScanResult =
  | { kind: "success"; progress: ThemeProgress; task: SetTask; setCompleted: boolean }
  | { kind: "already"; letter: string }
  | { kind: "wrong"; letter: string }
  | { kind: "inactive" };

/** Applies a scanned letter. Letters within a set may be found in any order. */
export function scanLetter(progress: ThemeProgress, letter: string): ScanResult {
  if (progress.phase !== "challenge") return { kind: "inactive" };

  const tasks = getCurrentTasks(progress);
  const open = tasks.find((t) => t.letter === letter && !isTaskDone(progress, t));
  if (!open) {
    const done = tasks.some((t) => t.letter === letter);
    return done ? { kind: "already", letter } : { kind: "wrong", letter };
  }

  const completedTasks = [...progress.completedTasks, open.id];
  const setCompleted = tasks.every((t) => completedTasks.includes(t.id));
  return {
    kind: "success",
    task: open,
    setCompleted,
    progress: { ...progress, completedTasks, phase: setCompleted ? "story" : "challenge" },
  };
}

export function startChallenge(progress: ThemeProgress): ThemeProgress {
  return progress.phase === "intro" ? { ...progress, phase: "challenge" } : progress;
}

/** Called after the set's story event has been shown. */
export function finishStoryEvent(progress: ThemeProgress): ThemeProgress {
  if (progress.phase !== "story") return progress;
  if (progress.currentSet >= TOTAL_SETS) return { ...progress, phase: "finale" };
  return { ...progress, phase: "challenge", currentSet: progress.currentSet + 1 };
}

export function markFinalePlayed(progress: ThemeProgress): ThemeProgress {
  if (progress.finalePlayed) return progress;
  return {
    ...progress,
    finalePlayed: true,
    history: [
      ...progress.history,
      {
        sessionNumber: progress.sessionNumber,
        startedAt: progress.sessionStartedAt,
        completedAt: new Date().toISOString(),
      },
    ],
  };
}

/** Starts the next session; completion history is kept. */
export function startNewSession(progress: ThemeProgress): ThemeProgress {
  return createSession(progress.themeId, progress.sessionNumber + 1, progress.history);
}

/** Restarts the current session from the beginning; history is kept. */
export function restartSession(progress: ThemeProgress): ThemeProgress {
  return createSession(progress.themeId, progress.sessionNumber, progress.history);
}

/** How many sets' story events have happened: drives which scene stage is shown. */
export function getSetsCompleted(progress: ThemeProgress): number {
  switch (progress.phase) {
    case "intro":
      return 0;
    case "challenge":
      return progress.currentSet - 1;
    case "story":
      return progress.currentSet;
    case "finale":
      return TOTAL_SETS;
  }
}

export function countLettersFound(progress: ThemeProgress): number {
  return progress.completedTasks.filter((id) => id !== REVIEW_TASK_ID).length;
}

export function hasStarted(progress: ThemeProgress): boolean {
  return progress.phase !== "intro" || progress.history.length > 0;
}
