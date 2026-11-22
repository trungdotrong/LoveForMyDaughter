import { createSession, type ThemeProgress } from "./game-engine";

export interface GameSettings {
  sound: boolean;
  /** Grown-up testing: shows buttons that pretend to scan a card. */
  testMode?: boolean;
  /** Narrator voice name picked by a grown-up; empty means pick automatically. */
  voice?: string;
  /** "scan": find printed cards and unlock friends. "race": answer quiz questions in a kart race. */
  gameMode?: GameMode;
}

export type GameMode = "scan" | "race";

export interface RaceRecord {
  /** Medals won per cup number. */
  medals: Record<string, number>;
}

/** Everything persisted for one player. Shaped so it can later move to a Supabase row. */
export interface GameSave {
  version: 1;
  selectedThemeId: string | null;
  themes: Record<string, ThemeProgress>;
  settings: GameSettings;
  race?: RaceRecord;
}

export function addRaceMedal(save: GameSave, cup: number): GameSave {
  const medals = save.race?.medals ?? {};
  return { ...save, race: { medals: { ...medals, [cup]: (medals[cup] ?? 0) + 1 } } };
}

export function createEmptySave(): GameSave {
  return { version: 1, selectedThemeId: null, themes: {}, settings: { sound: true } };
}

export function getThemeProgress(save: GameSave, themeId: string): ThemeProgress {
  return save.themes[themeId] ?? createSession(themeId, 1);
}

export function withThemeProgress(
  save: GameSave,
  themeId: string,
  progress: ThemeProgress,
): GameSave {
  return { ...save, themes: { ...save.themes, [themeId]: progress } };
}
