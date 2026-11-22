"use client";

import { useState } from "react";
import { CritterIcon, INK } from "@/components/art/Critter";
import { useSound } from "@/hooks/useSound";
import { PLAYER, RIVALS, getCup, type RaceCup } from "@/lib/race-engine";
import { Confetti } from "../ui/Confetti";
import { GameButton, GameLink } from "../ui/GameButton";
import { Icon } from "../ui/Icon";
import { RACE_COLORS } from "./QuizPanel";

function GoldMedal() {
  return (
    <svg viewBox="0 0 100 128" className="h-36 w-28" aria-hidden="true">
      <path d="M30 0 L50 50 L70 0 Z" fill="#ff7aa2" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M38 0 L50 30 L62 0 Z" fill="#8fd3ff" />
      <circle cx="50" cy="84" r="40" fill="#ffd84d" stroke={INK} strokeWidth="2.8" />
      <circle cx="50" cy="84" r="30" fill="#ffe98f" stroke="#e0a800" strokeWidth="2.5" />
      <path d="M50 64 L55.5 76 L68 77 L58.5 85 L61.5 98 L50 91 L38.5 98 L41.5 85 L32 77 L44.5 76 Z" fill="#ffb400" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/** Finish line reward: podium, then a present to tap open with a gold medal inside. */
export function RaceFinish({ cup, onRaceAgain }: { cup: RaceCup; onRaceAgain: () => void }) {
  const [opened, setOpened] = useState(false);
  const { play, say } = useSound();
  const next = getCup(cup.number + 1);
  const tiger = RIVALS[RIVALS.length - 1];
  const bear = RIVALS[RIVALS.length - 2];

  function open() {
    if (opened) return;
    setOpened(true);
    play("setComplete");
    setTimeout(() => say(`Hooray! You won the gold medal, and ${cup.prize.name}!`), 600);
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-5 pb-6 text-center ui-fade-in">
      <Confetti count={opened ? 48 : 24} loop={opened} />
      <div>
        <p className="text-lg font-semibold uppercase tracking-wide" style={{ color: RACE_COLORS.accentDark }}>{cup.name}</p>
        <h1 className="text-4xl font-bold" style={{ color: RACE_COLORS.accentDark }}>You won the race!</h1>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2">
        {[
          { racer: tiger, place: 2, h: "h-20", color: "#d9d4e3" },
          { racer: PLAYER, place: 1, h: "h-28", color: "#ffd84d" },
          { racer: bear, place: 3, h: "h-14", color: "#f0b483" },
        ].map(({ racer, place, h, color }) => (
          <div key={racer.name} className="flex w-24 flex-col items-center">
            <CritterIcon species={racer.species} pose={place === 1 ? "cheer" : "clap"} className={place === 1 ? "h-24 w-20" : "h-20 w-16"} />
            <div className={`${h} grid w-full place-items-center rounded-t-2xl border-[3px] text-3xl font-bold`} style={{ background: color, borderColor: INK, color: INK }}>
              {place}
            </div>
          </div>
        ))}
      </div>

      {opened ? (
        <div className="flex items-center justify-center gap-4">
          <div className="ui-bounce-in">
            <GoldMedal />
          </div>
          <div className="flex w-36 flex-col items-center">
            <span className="ui-zoom-in text-8xl leading-none" style={{ animationDelay: "0.3s" }} aria-hidden="true">
              {cup.prize.emoji}
            </span>
            <span className="mt-2 text-lg font-semibold leading-tight">{cup.prize.name}</span>
          </div>
        </div>
      ) : (
        <button type="button" onClick={open} className="flex flex-col items-center gap-2" aria-label="Open your present">
          <span className="gift-idle text-[7rem] leading-none" aria-hidden="true">🎁</span>
          <span className="text-2xl font-semibold" style={{ color: RACE_COLORS.accentDark }}>Tap to open your present!</span>
        </button>
      )}

      {opened && (
        <div className="flex w-full max-w-sm flex-col gap-3 ui-slide-up" style={{ animationDelay: "0.8s" }}>
          {next && (
            <GameLink href={`/race/${next.number}`} color={RACE_COLORS.accent} shade={RACE_COLORS.accentDark} className="w-full">
              Next race: {next.name}
              <Icon name="arrow" className="size-7" />
            </GameLink>
          )}
          <GameButton variant="secondary" className="w-full" onClick={onRaceAgain}>
            <Icon name="replay" className="size-7" />
            Race again
          </GameButton>
          <GameLink href="/" variant="secondary" className="w-full">
            Home
          </GameLink>
        </div>
      )}
    </div>
  );
}
