"use client";

import { useEffect, useState } from "react";
import { CritterIcon } from "@/components/art/Critter";
import { useSound } from "@/hooks/useSound";
import type { Character, ThemeColors } from "@/themes/types";
import { Confetti } from "../ui/Confetti";
import { GameButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";
import { FriendSilhouette, LockBadge } from "./MysteryFriend";

type Step = "locked" | "opening" | "revealed";

const SHAKE_MS = 650;

/** All letters found: the child taps the lock and the mystery friend is revealed. */
export function FriendUnlock({
  character,
  colors,
  buttonLabel,
  onDone,
}: {
  character: Character;
  colors: ThemeColors;
  buttonLabel: string;
  onDone: () => void;
}) {
  const [step, setStep] = useState<Step>("locked");
  const { play, say } = useSound();

  useEffect(() => {
    if (step !== "opening") return;
    const t = setTimeout(() => setStep("revealed"), SHAKE_MS);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "revealed") return;
    play("setComplete");
    const t = setTimeout(() => say(`Hooray! It's ${character.name}!`), 700);
    return () => clearTimeout(t);
  }, [step, play, say, character.name]);

  function open() {
    if (step !== "locked") return;
    play("tap");
    setStep("opening");
  }

  const revealed = step === "revealed";

  return (
    <div className="-mx-4 flex flex-1 flex-col items-center justify-center gap-6 overflow-x-clip px-4 py-4 text-center ui-fade-in">
      {revealed && <Confetti count={36} />}

      <div>
        <p className="text-lg font-semibold uppercase tracking-wide" style={{ color: colors.accentDark }}>
          {revealed ? "Friend unlocked!" : "You found all the letters!"}
        </p>
        <h1 className="mt-1 text-4xl font-bold sm:text-5xl" style={{ color: colors.accentDark }}>
          {revealed ? `It's ${character.name}!` : "Who is it?"}
        </h1>
      </div>

      <button
        type="button"
        onClick={open}
        disabled={step !== "locked"}
        aria-label={revealed ? character.name : "Tap the lock to meet your new friend"}
        className="relative grid size-64 place-items-center rounded-full sm:size-72"
      >
        <span className="absolute inset-0 rounded-full ui-glow" style={{ background: colors.soft }} />
        {revealed && (
          <span className="absolute inset-0 rounded-full ui-burst" style={{ background: colors.accent }} />
        )}

        {revealed ? (
          <div className="relative h-56 w-48 ui-reveal">
            <CritterIcon
              species={character.species}
              accessory={character.accessory}
              pose="cheer"
              className="size-full"
            />
          </div>
        ) : (
          <div className={`relative h-56 w-48 ${step === "opening" ? "ui-shake" : ""}`}>
            <FriendSilhouette character={character} clarity={1} className="size-full" />
            <LockBadge
              colors={colors}
              className={`absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 ${
                step === "opening" ? "ui-lock-pop" : "ui-pulse"
              }`}
            />
          </div>
        )}
      </button>

      {revealed ? (
        <GameButton
          color={colors.accent}
          shade={colors.accentDark}
          className="w-full max-w-sm ui-slide-up"
          style={{ animationDelay: "0.6s" }}
          onClick={() => {
            play("tap");
            onDone();
          }}
        >
          {buttonLabel}
          <Icon name="arrow" className="size-7" />
        </GameButton>
      ) : (
        <p className="text-2xl font-semibold text-ink-soft">
          {step === "locked" ? "Tap the lock to open it!" : "Opening..."}
        </p>
      )}
    </div>
  );
}
