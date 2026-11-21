"use client";

import { useEffect, useState } from "react";
import { useSound } from "@/hooks/useSound";
import { stopSpeaking } from "@/lib/sound";
import type { ThemeColors } from "@/themes/types";
import { GameButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";

/** Shows story lines one at a time and reads each aloud (when sound is on). */
export function DialogueBox({
  lines,
  finalLabel,
  onDone,
  colors,
}: {
  lines: string[];
  finalLabel: string;
  onDone: () => void;
  colors: ThemeColors;
}) {
  const [index, setIndex] = useState(0);
  const { say, play } = useSound();
  const last = index >= lines.length - 1;

  useEffect(() => {
    say(lines[index]);
  }, [index, lines, say]);

  useEffect(() => stopSpeaking, []);

  return (
    <div className="flex flex-col gap-4">
      <div key={index} className="ui-slide-up rounded-3xl bg-white px-6 py-5 text-center text-2xl leading-snug shadow-[0_6px_0_#efe3d3] sm:text-3xl">
        {lines[index]}
      </div>
      {lines.length > 1 && (
        <div className="flex justify-center gap-2" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i} className="size-2.5 rounded-full" style={{ background: i <= index ? colors.accent : "#e9dccb" }} />
          ))}
        </div>
      )}
      <GameButton
        color={colors.accent}
        shade={colors.accentDark}
        className="w-full"
        onClick={() => {
          play("tap");
          if (last) onDone();
          else setIndex(index + 1);
        }}
      >
        {last ? finalLabel : "Next"}
        <Icon name="arrow" className="size-7" />
      </GameButton>
    </div>
  );
}
