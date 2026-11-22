"use client";

import { useEffect, useRef, useState } from "react";
import { useSound, wait } from "@/hooks/useSound";
import { getLetterInfo } from "@/lib/alphabet";
import { stopSpeaking } from "@/lib/sound";
import type { ThemeColors } from "@/themes/types";
import { Confetti } from "../ui/Confetti";
import { GameButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";

/** After the word is shown, move on by itself if nobody taps Continue. */
const AUTO_CONTINUE_MS = 8000;

/** "letter": the big letter is said. "word": it zooms to the picture word. "done": Continue appears. */
type Step = "letter" | "word" | "done";

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
  const sound = useSound();
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  });
  const [step, setStep] = useState<Step>("letter");

  // Two beats: "A!" ... then focus on the picture: "A is for Apple!"
  useEffect(() => {
    let alive = true;
    (async () => {
      const { play, narrate } = soundRef.current;
      play("success");
      await wait(450);
      if (!alive) return;
      await narrate(`*${info.upper}*!`);
      await wait(900);
      if (!alive) return;
      setStep("word");
      soundRef.current.play("ting");
      await wait(700);
      if (!alive) return;
      await soundRef.current.narrate(`*${info.upper}* is for *${info.word}*!`);
      await wait(300);
      if (alive) setStep("done");
    })();
    return () => {
      alive = false;
      stopSpeaking();
    };
  }, [info.upper, info.word]);

  useEffect(() => {
    if (step !== "done") return;
    const t = setTimeout(onContinue, AUTO_CONTINUE_MS);
    return () => clearTimeout(t);
  }, [step, onContinue]);

  const showWord = step !== "letter";
  const rest = info.word.slice(1);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto overflow-x-clip p-6 ui-fade-in"
      style={{ background: colors.soft }}
    >
      <Confetti count={30} />
      <p className="text-3xl font-bold sm:text-4xl" style={{ color: colors.accentDark }}>
        {review ? "Great memory!" : "Amazing!"}
      </p>

      <div
        className={`ui-bounce-in flex items-baseline gap-4 rounded-[2.5rem] bg-white px-10 py-6 shadow-[0_10px_0_#efe3d3] transition-[scale,margin] duration-500 ease-out ${
          showWord ? "-my-8 scale-[0.62]" : "scale-100"
        }`}
      >
        <span className="text-[8rem] font-bold leading-none sm:text-[11rem]" style={{ color: colors.accent }}>
          {info.upper}
        </span>
        <span className="text-6xl font-semibold leading-none text-ink-soft sm:text-8xl">{info.lower}</span>
      </div>

      {showWord ? (
        <div className="flex flex-col items-center gap-2">
          <span className="ui-zoom-in text-[7.5rem] leading-none drop-shadow-[0_8px_0_rgba(0,0,0,0.08)]" aria-hidden="true">
            {info.emoji}
          </span>
          <p className="ui-slide-up text-center text-2xl" style={{ animationDelay: "0.25s" }}>
            {info.upper} is for
          </p>
          <p className="ui-slide-up text-5xl font-bold" style={{ animationDelay: "0.4s" }}>
            <span style={{ color: colors.accent }}>{info.word[0]}</span>
            {rest}
          </p>
        </div>
      ) : (
        <p className="text-center text-2xl">
          You found <strong>{info.upper}</strong>!
        </p>
      )}

      <div className="h-16 w-full max-w-sm">
        {step === "done" && (
          <GameButton color={colors.accent} shade={colors.accentDark} className="w-full ui-slide-up" onClick={onContinue}>
            Continue
            <Icon name="arrow" className="size-7" />
          </GameButton>
        )}
      </div>
    </div>
  );
}
