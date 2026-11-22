import Link from "next/link";
import { CritterIcon } from "@/components/art/Critter";
import type { GameSave } from "@/lib/progress";
import { PLAYER, RACE_CUPS, RIVALS } from "@/lib/race-engine";
import { RACE_COLORS } from "./QuizPanel";

/** Home screen in race mode: one card per cup, with the medals already won. */
export function RaceCups({ save }: { save: GameSave }) {
  const medals = save.race?.medals ?? {};
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-center gap-1">
        <CritterIcon species={PLAYER.species} pose="cheer" className="h-20 w-16" />
        <h2 className="pb-3 text-2xl font-semibold">Choose a race!</h2>
        <CritterIcon species={RIVALS[RIVALS.length - 1].species} pose="wave" className="h-20 w-16" />
      </div>
      {RACE_CUPS.map((cup) => {
        const won = medals[cup.number] ?? 0;
        return (
          <Link
            key={cup.number}
            href={`/race/${cup.number}`}
            className="flex items-center gap-4 rounded-[2rem] bg-white p-4 shadow-[0_8px_0_#efe3d3] transition-transform active:translate-y-1"
          >
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl text-4xl" style={{ background: RACE_COLORS.soft }} aria-hidden="true">
              {won > 0 ? "🥇" : "🏁"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-2xl font-semibold" style={{ color: RACE_COLORS.accentDark }}>
                {cup.name}
              </span>
              <span className="block text-lg tracking-widest">
                {cup.letters.join(" ")}
                {cup.review && <span className="text-base tracking-normal text-ink-soft"> + review</span>}
              </span>
            </span>
            <span className="shrink-0 text-right text-sm text-ink-soft">
              {won > 0 ? `Won ${won}×` : "New!"}
              <span className="block text-3xl leading-none" aria-hidden="true">{cup.prize.emoji}</span>
            </span>
          </Link>
        );
      })}
    </section>
  );
}
