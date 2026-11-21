"use client";

import { useState } from "react";
import { CritterIcon } from "@/components/art/Critter";
import { TOTAL_SETS } from "@/lib/alphabet";
import type { GameTheme } from "@/themes/types";
import { DialogueBox } from "./DialogueBox";
import { FriendUnlock } from "./FriendUnlock";
import { SceneFrame } from "./SceneFrame";

/**
 * The main reward for a finished set: first the mystery friend is unlocked,
 * then the scene changes as that friend joins the story.
 */
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
  const isLast = setNumber >= TOTAL_SETS;
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <FriendUnlock
        character={event.character}
        colors={theme.colors}
        buttonLabel={theme.unlockButton}
        onDone={() => setUnlocked(true)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 ui-fade-in">
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
