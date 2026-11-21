import Link from "next/link";
import { TOTAL_SETS } from "@/lib/alphabet";
import { getSetsCompleted, hasStarted, type ThemeProgress } from "@/lib/game-engine";
import type { GameTheme } from "@/themes/types";
import { ProgressIndicator } from "../ui/ProgressIndicator";
import { SceneFrame } from "./SceneFrame";

function statusLabel(progress: ThemeProgress): string {
  const timesFinished = progress.history.length;
  if (progress.phase === "finale" && progress.finalePlayed) {
    return `Finished ${timesFinished}× — play again!`;
  }
  if (!hasStarted(progress)) return "New adventure!";
  const done = getSetsCompleted(progress);
  return `Set ${Math.min(done + 1, TOTAL_SETS)} of ${TOTAL_SETS}`;
}

export function ThemeCard({ theme, progress }: { theme: GameTheme; progress: ThemeProgress }) {
  const done = getSetsCompleted(progress);
  return (
    <Link
      href={`/game/${theme.id}`}
      className="block rounded-[2rem] bg-white p-3 shadow-[0_8px_0_#efe3d3] transition-transform active:translate-y-1"
    >
      <SceneFrame theme={theme} stage={theme.coverStage} className="border-0! shadow-none!" />
      <div className="px-2 pb-1 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold" style={{ color: theme.colors.accentDark }}>
            {theme.title}
          </h2>
          <span className="shrink-0 text-sm text-ink-soft">{statusLabel(progress)}</span>
        </div>
        <p className="mt-1 text-ink-soft">{theme.description}</p>
        <ProgressIndicator completed={done} color={theme.colors.accent} className="mt-3" />
      </div>
    </Link>
  );
}
