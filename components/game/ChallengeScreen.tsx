"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useSound, wait } from "@/hooks/useSound";
import { getCurrentTasks, isTaskDone, type ThemeProgress } from "@/lib/game-engine";
import { stopSpeaking } from "@/lib/sound";
import type { GameTheme } from "@/themes/types";
import { GameButton, IconButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";
import { LetterCard } from "./LetterCard";
import { MysteryFriendCard } from "./MysteryFriend";
import type { ScanFeedback } from "./QRScanner";
import { TestScanPanel } from "./TestScanPanel";
import { SceneFrame } from "./SceneFrame";

/** "A, B and C" */
function listLetters(letters: string[]): string {
  const stressed = letters.map((l) => `*${l}*`);
  return stressed.length > 1 ? `${stressed.slice(0, -1).join(", ")} and ${stressed[stressed.length - 1]}` : stressed[0];
}

const TAP_FOCUS_MS = 1300;

type Sound = ReturnType<typeof useSound>;

async function introduceLetters(
  letters: string[],
  { sound, setFocus, alive }: { sound: () => Sound; setFocus: (i: number | null) => void; alive: () => boolean },
) {
  await wait(400);
  if (!alive()) return;
  await sound().narrate(`You need to find ${listLetters(letters)} to unlock this friend!`);
  for (let i = 0; i < letters.length; i++) {
    if (!alive()) return;
    setFocus(i);
    sound().play("ting");
    await wait(450);
    if (!alive()) return;
    await sound().narrate(`*${letters[i]}*!`);
    await wait(600);
  }
  if (alive()) setFocus(null);
}

export function ChallengeScreen({
  theme,
  progress,
  onScan,
  onTestScan,
}: {
  theme: GameTheme;
  progress: ThemeProgress;
  onScan: () => void;
  /** Present only in test mode: pretend a card with this letter was scanned. */
  onTestScan?: (letter: string) => ScanFeedback;
}) {
  const tasks = getCurrentTasks(progress);
  const found = tasks.filter((t) => isTaskDone(progress, t)).length;
  const event = theme.setEvents[progress.currentSet - 1];
  const { colors } = theme;
  const letters = tasks.map((t) => t.letter);

  const sound = useSound();
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  });

  /** Index of the spotlighted letter card. */
  const [focus, setFocus] = useState<number | null>(null);
  /** Bumped to cancel whatever introduction or tap is in progress. */
  const runId = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** Slowly introduces the set: the sentence, then each letter with a ting. */
  function present() {
    const id = ++runId.current;
    clearTimeout(tapTimer.current);
    void introduceLetters(letters, {
      sound: () => soundRef.current,
      setFocus,
      alive: () => runId.current === id,
    });
  }

  // Introduce a new set once; after a letter is found the set is already known.
  const introduce = useRef(found === 0);
  const onEnter = useEffectEvent(() => {
    if (introduce.current) present();
  });
  useEffect(() => {
    onEnter();
    const runs = runId;
    return () => {
      runs.current++;
      stopSpeaking();
    };
  }, []);

  useEffect(() => () => clearTimeout(tapTimer.current), []);

  /** Silences the introduction before scanning starts. */
  function stopIntro() {
    runId.current++;
    clearTimeout(tapTimer.current);
    stopSpeaking();
    setFocus(null);
  }

  function tapLetter(i: number) {
    runId.current++;
    clearTimeout(tapTimer.current);
    setFocus(i);
    sound.play("ting");
    sound.say(`*${letters[i]}*!`);
    tapTimer.current = setTimeout(() => setFocus(null), TAP_FOCUS_MS);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 ui-fade-in">
      <SceneFrame theme={theme} stage={progress.currentSet - 1} interactive />

      <MysteryFriendCard
        character={event.character}
        mission={event.mission}
        found={found}
        total={tasks.length}
        colors={colors}
      />

      <div className="flex items-center justify-center gap-3">
        <h2 className="text-2xl font-semibold">Find these letters!</h2>
        <IconButton label="Hear the letters again" onClick={present} className="size-10!">
          <Icon name="sound" className="size-5" />
        </IconButton>
      </div>
      <div className="flex gap-3 px-1">
        {tasks.map((t, i) => (
          <LetterCard
            key={t.id}
            letter={t.letter}
            found={isTaskDone(progress, t)}
            review={t.kind === "review"}
            accent={colors.accent}
            focused={focus === i}
            onTap={() => tapLetter(i)}
          />
        ))}
      </div>
      <p className="text-center text-lg text-ink-soft">
        {found} of {tasks.length} letters found
      </p>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 pb-4 pt-2">
        {onTestScan && (
          <TestScanPanel
            openLetters={tasks.filter((t) => !isTaskDone(progress, t)).map((t) => t.letter)}
            setLetters={letters}
            colors={colors}
            onScan={(letter) => {
              stopIntro();
              return onTestScan(letter);
            }}
          />
        )}
        <GameButton
          color={colors.accent}
          shade={colors.accentDark}
          className="w-full ui-pulse"
          onClick={() => {
            stopIntro();
            onScan();
          }}
        >
          <Icon name="camera" className="size-8" />
          Scan QR Code
        </GameButton>
      </div>
    </div>
  );
}
