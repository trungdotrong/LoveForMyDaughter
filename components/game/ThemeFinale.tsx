"use client";

import { useEffect, useState } from "react";
import { useSound } from "@/hooks/useSound";
import type { GameTheme } from "@/themes/types";
import { Confetti } from "../ui/Confetti";
import { GameButton, GameLink } from "../ui/GameButton";
import { Icon } from "../ui/Icon";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

export function ThemeFinale({
  theme,
  sessionNumber,
  onPlayed,
  onReplay,
}: {
  theme: GameTheme;
  sessionNumber: number;
  onPlayed: () => void;
  onReplay: () => void;
}) {
  const { finale, colors } = theme;
  const { melody, enabled } = useSound();
  const [storyDone, setStoryDone] = useState(false);

  useEffect(() => {
    onPlayed();
  }, [onPlayed]);

  useEffect(() => {
    if (finale.audioSrc) {
      if (!enabled) return;
      const audio = new Audio(finale.audioSrc);
      void audio.play().catch(() => {});
      return () => audio.pause();
    }
    const tune = finale.melody;
    if (tune) {
      let stop = () => {};
      const t = setTimeout(() => {
        stop = melody(tune);
      }, 600);
      return () => {
        clearTimeout(t);
        stop();
      };
    }
  }, [finale, melody, enabled]);

  return (
    <div className="flex flex-1 flex-col gap-4 ui-fade-in">
      <Confetti loop count={40} variant={finale.celebration} />
      <h1 className="ui-bounce-in text-center text-4xl font-bold sm:text-5xl" style={{ color: colors.accentDark }}>
        {finale.message}
      </h1>
      <SceneFrame theme={theme} stage={theme.setEvents.length} mode="finale" interactive />
      {storyDone ? (
        <div className="flex flex-col gap-4 ui-slide-up">
          <p className="rounded-3xl bg-white px-6 py-4 text-center text-xl shadow-[0_6px_0_#efe3d3]">
            You found all 26 letters! 🎉
            <br />
            <span className="text-base text-ink-soft">Adventure #{sessionNumber} complete</span>
          </p>
          <GameButton color={colors.accent} shade={colors.accentDark} className="w-full" onClick={onReplay}>
            <Icon name="replay" className="size-7" />
            Play again
          </GameButton>
          <GameLink href="/" variant="secondary" className="w-full">
            Back to themes
          </GameLink>
        </div>
      ) : (
        <DialogueBox lines={finale.dialogue} finalLabel="Hooray!" onDone={() => setStoryDone(true)} colors={colors} />
      )}
    </div>
  );
}
