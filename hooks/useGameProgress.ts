"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ThemeProgress } from "@/lib/game-engine";
import { getThemeProgress, withThemeProgress, type GameSave } from "@/lib/progress";
import { readSave, subscribe, updateSave } from "@/lib/storage";

/** The persisted save, or null during server render and hydration. */
export function useGameSave() {
  const save = useSyncExternalStore<GameSave | null>(subscribe, readSave, () => null);
  return { save, update: updateSave };
}

export function useGameProgress(themeId: string) {
  const { save } = useGameSave();
  const progress = save ? getThemeProgress(save, themeId) : null;

  const updateProgress = useCallback(
    (updater: (p: ThemeProgress) => ThemeProgress) =>
      updateSave((s) => withThemeProgress(s, themeId, updater(getThemeProgress(s, themeId)))),
    [themeId],
  );

  return { save, progress, updateProgress };
}
