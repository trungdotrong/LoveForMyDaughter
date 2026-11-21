import { createSession, type ThemeProgress } from "./game-engine";

export interface GameSettings {
  sound: boolean;
}

/** Everything persisted for one player. Shaped so it can later move to a Supabase row. */
export interface GameSave {
  version: 1;
  selectedThemeId: string | null;
  themes: Record<string, ThemeProgress>;
  settings: GameSettings;
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
