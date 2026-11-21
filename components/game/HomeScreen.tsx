"use client";

import { useState } from "react";
import { CritterIcon } from "@/components/art/Critter";
import { useGameSave } from "@/hooks/useGameProgress";
import { TOTAL_SETS } from "@/lib/alphabet";
import { getSetsCompleted, hasStarted } from "@/lib/game-engine";
import { getThemeProgress } from "@/lib/progress";
import { getTheme, THEMES } from "@/themes";
import { GameLink, IconButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";
import { Backdrop } from "./Backdrop";
import { Logo } from "./Logo";
import { SettingsPanel } from "./SettingsPanel";
import { ThemeCard } from "./ThemeSelector";

export function HomeScreen() {
  const { save } = useGameSave();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const continueTheme = save?.selectedThemeId ? getTheme(save.selectedThemeId) : undefined;
  const continueProgress = save && continueTheme ? getThemeProgress(save, continueTheme.id) : null;
  const canContinue =
    continueTheme && continueProgress && hasStarted(continueProgress) && !continueProgress.finalePlayed;

  return (
    <div className="relative flex flex-1 flex-col">
      <Backdrop />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-5">
        <div className="flex justify-end">
          <IconButton label="Grown-up settings" onClick={() => setSettingsOpen(true)}>
            <Icon name="gear" />
          </IconButton>
        </div>

        <div className="flex items-end justify-center gap-1">
          <CritterIcon species="bunny" accessory="bow" pose="wave" className="h-24 w-20" />
          <Logo />
          <CritterIcon species="bear" pose="bounce" className="h-24 w-20" />
        </div>

        {canContinue && (
          <GameLink
            href={`/game/${continueTheme.id}`}
            color={continueTheme.colors.accent}
            shade={continueTheme.colors.accentDark}
            className="w-full ui-pulse"
          >
            Continue · Set {Math.min(getSetsCompleted(continueProgress) + 1, TOTAL_SETS)}
            <Icon name="arrow" className="size-7" />
          </GameLink>
        )}

        <section className="flex flex-col gap-5">
          <h2 className="text-center text-2xl font-semibold">Choose an adventure</h2>
          {save
            ? THEMES.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} progress={getThemeProgress(save, theme.id)} />
              ))
            : THEMES.map((theme) => <div key={theme.id} className="aspect-[4/3] rounded-[2rem] bg-white/60" />)}
        </section>
      </main>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
