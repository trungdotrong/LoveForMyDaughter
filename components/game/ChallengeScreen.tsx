import { getCurrentTasks, isTaskDone, type ThemeProgress } from "@/lib/game-engine";
import type { GameTheme } from "@/themes/types";
import { GameButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";
import { LetterCard } from "./LetterCard";
import { MysteryFriendCard } from "./MysteryFriend";
import { SceneFrame } from "./SceneFrame";

export function ChallengeScreen({
  theme,
  progress,
  onScan,
}: {
  theme: GameTheme;
  progress: ThemeProgress;
  onScan: () => void;
}) {
  const tasks = getCurrentTasks(progress);
  const found = tasks.filter((t) => isTaskDone(progress, t)).length;
  const event = theme.setEvents[progress.currentSet - 1];
  const { colors } = theme;

  return (
    <div className="flex flex-1 flex-col gap-4 ui-fade-in">
      <SceneFrame theme={theme} stage={progress.currentSet - 1} />

      <MysteryFriendCard
        character={event.character}
        mission={event.mission}
        found={found}
        total={tasks.length}
        colors={colors}
      />

      <h2 className="text-center text-2xl font-semibold">Find these letters!</h2>
      <div className="flex gap-3 px-1">
        {tasks.map((t) => (
          <LetterCard
            key={t.id}
            letter={t.letter}
            found={isTaskDone(progress, t)}
            review={t.kind === "review"}
            accent={colors.accent}
          />
        ))}
      </div>
      <p className="text-center text-lg text-ink-soft">
        {found} of {tasks.length} letters found
      </p>

      <div className="sticky bottom-0 mt-auto pb-4 pt-2">
        <GameButton color={colors.accent} shade={colors.accentDark} className="w-full ui-pulse" onClick={onScan}>
          <Icon name="camera" className="size-8" />
          Scan QR Code
        </GameButton>
      </div>
    </div>
  );
}
