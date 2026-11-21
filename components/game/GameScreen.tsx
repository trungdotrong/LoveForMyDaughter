"use client";

import { useCallback, useEffect, useState } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useSound } from "@/hooks/useSound";
import { TOTAL_SETS } from "@/lib/alphabet";
import {
  finishStoryEvent,
  markFinalePlayed,
  scanLetter,
  startChallenge,
  startNewSession,
} from "@/lib/game-engine";
import { parseQrPayload } from "@/lib/qr";
import { updateSave } from "@/lib/storage";
import { getTheme } from "@/themes";
import { ChallengeScreen } from "./ChallengeScreen";
import { LetterSuccess } from "./LetterSuccess";
import { QRScanner, type ScanFeedback } from "./QRScanner";
import { StoryIntro } from "./StoryIntro";
import { StoryProgression } from "./StoryProgression";
import { ThemeFinale } from "./ThemeFinale";
import { TopBar } from "./TopBar";

interface Found {
  letter: string;
  review: boolean;
}

/** Drives one Theme through the engine's phases: intro → challenge ⇄ story → finale. */
export function GameScreen({ themeId }: { themeId: string }) {
  const theme = getTheme(themeId);
  const { progress, updateProgress } = useGameProgress(themeId);
  const { play } = useSound();
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<Found | null>(null);

  useEffect(() => {
    updateSave((s) => (s.selectedThemeId === themeId ? s : { ...s, selectedThemeId: themeId }));
  }, [themeId]);

  const onPlayed = useCallback(() => updateProgress(markFinalePlayed), [updateProgress]);
  const closeSuccess = useCallback(() => setFound(null), []);

  if (!theme) return null;
  if (!progress) {
    return <div className="flex-1" style={{ background: theme.colors.background }} />;
  }

  function handleDetect(payload: string): ScanFeedback {
    const letter = parseQrPayload(payload);
    if (!letter || !progress) {
      play("oops");
      return { kind: "invalid" };
    }
    const result = scanLetter(progress, letter);
    if (result.kind === "success") {
      updateProgress(() => result.progress);
      setScanning(false);
      setFound({ letter, review: result.task.kind === "review" });
      return { kind: "success" };
    }
    play("oops");
    if (result.kind === "inactive") return { kind: "invalid" };
    return result;
  }

  let content;
  let heading: string | null = null;
  switch (progress.phase) {
    case "intro":
      content = <StoryIntro theme={theme} onDone={() => updateProgress(startChallenge)} />;
      break;
    case "challenge":
      heading = `SET ${String(progress.currentSet).padStart(2, "0")} / ${String(TOTAL_SETS).padStart(2, "0")}`;
      content = <ChallengeScreen theme={theme} progress={progress} onScan={() => setScanning(true)} />;
      break;
    case "story":
      content = (
        <StoryProgression
          key={progress.currentSet}
          theme={theme}
          setNumber={progress.currentSet}
          onDone={() => updateProgress(finishStoryEvent)}
        />
      );
      break;
    case "finale":
      content = (
        <ThemeFinale
          key={progress.sessionNumber}
          theme={theme}
          sessionNumber={progress.sessionNumber}
          onPlayed={onPlayed}
          onReplay={() => updateProgress(startNewSession)}
        />
      );
      break;
  }

  return (
    <div className="flex flex-1 flex-col" style={{ background: theme.colors.background }}>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-4">
        <TopBar>
          {heading && (
            <span className="inline-block rounded-full bg-white px-4 py-2 text-lg font-semibold tracking-wide shadow-[0_4px_0_#efe3d3]" style={{ color: theme.colors.accentDark }}>
              {heading}
            </span>
          )}
        </TopBar>
        {/* Hold the next screen until the child leaves the success overlay, so a set's story starts fresh. */}
        {found ? <div className="flex-1" /> : content}
        <div className="pb-4" />
      </main>

      {scanning && (
        <QRScanner onDetect={handleDetect} onClose={() => setScanning(false)} colors={theme.colors} />
      )}
      {found && (
        <LetterSuccess letter={found.letter} review={found.review} colors={theme.colors} onContinue={closeSuccess} />
      )}
    </div>
  );
}
