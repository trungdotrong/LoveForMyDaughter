"use client";

import { useEffect } from "react";
import { CritterIcon } from "@/components/art/Critter";
import { useSound } from "@/hooks/useSound";
import { TOTAL_SETS } from "@/lib/alphabet";
import type { GameTheme } from "@/themes/types";
import { Confetti } from "../ui/Confetti";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

/** The main reward: the scene changes as a new character joins the story. */
export function StoryProgression({
  theme,
  setNumber,
  onDone,
}: {
  theme: GameTheme;
  setNumber: number;
  onDone: () => void;
}) {
  const event = theme.setEvents[setNumber - 1];
  const { play } = useSound();
  const isLast = setNumber >= TOTAL_SETS;

  useEffect(() => {
    play("setComplete");
  }, [play]);

  return (
    <div className="flex flex-1 flex-col gap-4 ui-fade-in">
      <Confetti count={24} />
      <div className="flex items-center justify-center gap-3">
        <CritterIcon
          species={event.character.species}
          accessory={event.character.accessory}
          pose="wave"
          className="h-20 w-16 ui-bounce-in"
        />
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: theme.colors.accentDark }}>
          {event.title}
        </h1>
      </div>
      <SceneFrame theme={theme} stage={setNumber} mode="arrival" />
      <DialogueBox
        lines={event.dialogue}
        finalLabel={isLast ? "What happens next?" : "Keep going!"}
        onDone={onDone}
        colors={theme.colors}
      />
    </div>
  );
}
