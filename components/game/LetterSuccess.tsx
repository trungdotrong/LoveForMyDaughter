"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { getLetterInfo } from "@/lib/alphabet";
import type { ThemeColors } from "@/themes/types";
import { Confetti } from "../ui/Confetti";
import { GameButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";

const AUTO_CONTINUE_MS = 7000;

export function LetterSuccess({
  letter,
  review,
  colors,
  onContinue,
}: {
  letter: string;
  review: boolean;
  colors: ThemeColors;
  onContinue: () => void;
}) {
  const info = getLetterInfo(letter);
  const { say, play } = useSound();

  useEffect(() => {
    play("success");
    const t = setTimeout(() => say(`${info.upper}! ${info.upper} is for ${info.word}!`), 500);
    return () => clearTimeout(t);
  }, [info.upper, info.word, play, say]);

  useEffect(() => {
    const t = setTimeout(onContinue, AUTO_CONTINUE_MS);
    return () => clearTimeout(t);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto p-6 ui-fade-in" style={{ background: colors.soft }}>
      <Confetti count={30} />
      <p className="text-3xl font-bold sm:text-4xl" style={{ color: colors.accentDark }}>
        {review ? "Great memory!" : "Amazing!"}
      </p>
      <div className="ui-bounce-in flex items-baseline gap-4 rounded-[2.5rem] bg-white px-10 py-6 shadow-[0_10px_0_#efe3d3]">
        <span className="text-[9rem] font-bold leading-none sm:text-[11rem]" style={{ color: colors.accent }}>
          {info.upper}
        </span>
        <span className="text-7xl font-semibold leading-none text-ink-soft sm:text-8xl">{info.lower}</span>
      </div>
      <p className="text-center text-2xl">
        You found <strong>{info.upper}</strong>!
      </p>
      <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-2xl shadow-[0_5px_0_#efe3d3] ui-slide-up">
        <span className="text-4xl" aria-hidden="true">{info.emoji}</span>
        <span>
          {info.upper} is for <strong>{info.word}</strong>
        </span>
      </div>
      <GameButton color={colors.accent} shade={colors.accentDark} className="w-full max-w-sm" onClick={onContinue}>
        Continue
        <Icon name="arrow" className="size-7" />
      </GameButton>
    </div>
  );
}
