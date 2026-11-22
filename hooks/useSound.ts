"use client";

import { useCallback, useEffect } from "react";
import { estimateSpeechMs, playMelody, sfx, speak, speakAsync, type Melody } from "@/lib/sound";
import { setPreferredVoice } from "@/lib/voice";
import { updateSave } from "@/lib/storage";
import { useGameSave } from "./useGameProgress";

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Sound helpers that respect the player's mute setting. */
export function useSound() {
  const { save } = useGameSave();
  const enabled = save?.settings.sound ?? true;
  const voice = save?.settings.voice;
  useEffect(() => setPreferredVoice(voice), [voice]);

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
  /**
   * Speaks and resolves when done. It always takes at least most of the time
   * the phrase needs, so the pacing stays calm when muted or if speech fails.
   */
  const narrate = useCallback(
    async (text: string) => {
      const minimum = wait(estimateSpeechMs(text) * (enabled ? 0.75 : 1));
      await Promise.all([enabled ? speakAsync(text) : Promise.resolve(), minimum]);
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

  return { enabled, play, say, narrate, melody, toggle };
}
