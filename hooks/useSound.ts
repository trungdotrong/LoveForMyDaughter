"use client";

import { useCallback } from "react";
import { playMelody, sfx, speak, type Melody } from "@/lib/sound";
import { updateSave } from "@/lib/storage";
import { useGameSave } from "./useGameProgress";

/** Sound helpers that respect the player's mute setting. */
export function useSound() {
  const { save } = useGameSave();
  const enabled = save?.settings.sound ?? true;

  const play = useCallback(
    (name: keyof typeof sfx) => {
      if (enabled) sfx[name]();
    },
    [enabled],
  );
  const say = useCallback(
    (text: string) => {
      if (enabled) speak(text);
    },
    [enabled],
  );
  const melody = useCallback(
    (m: Melody) => (enabled ? playMelody(m) : () => {}),
    [enabled],
  );
  const toggle = useCallback(
    () => updateSave((s) => ({ ...s, settings: { ...s.settings, sound: !s.settings.sound } })),
    [],
  );

  return { enabled, play, say, melody, toggle };
}
