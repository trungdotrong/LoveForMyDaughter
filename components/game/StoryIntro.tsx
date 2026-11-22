import type { GameTheme } from "@/themes/types";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

export function StoryIntro({ theme, onDone }: { theme: GameTheme; onDone: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-5 ui-fade-in">
      <h1 className="text-center text-3xl font-bold sm:text-4xl" style={{ color: theme.colors.accentDark }}>
        {theme.intro.title}
      </h1>
      <SceneFrame theme={theme} stage={0} interactive />
      <DialogueBox lines={theme.intro.dialogue} finalLabel="Let's go!" onDone={onDone} colors={theme.colors} />
    </div>
  );
}
