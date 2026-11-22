"use client";

import { useState, type MouseEvent } from "react";
import type { GameTheme, SceneMode } from "@/themes/types";

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

/**
 * Draws a Theme's scene at a given stage inside a rounded picture-book frame.
 * When `interactive`, every tap is passed to the scene as `poke` so the
 * characters can react, and a sparkle pops where the finger landed.
 */
export function SceneFrame({
  theme,
  stage,
  mode,
  className = "",
  interactive = false,
}: {
  theme: GameTheme;
  stage: number;
  mode?: SceneMode;
  className?: string;
  interactive?: boolean;
}) {
  const { Scene } = theme;
  const [poke, setPoke] = useState(0);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  function tap(e: MouseEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const id = poke + 1;
    setPoke(id);
    // Keep only the latest few; finished sparkles are invisible anyway.
    setSparkles((s) => [
      ...s.slice(-4),
      { id, x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100 },
    ]);
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_8px_0_#efe3d3] ${
        interactive ? "cursor-pointer touch-manipulation select-none" : ""
      } ${className}`}
      onClick={interactive ? tap : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? "Tap the picture to play" : undefined}
    >
      <Scene stage={stage} mode={mode} poke={interactive ? poke : 0} className="block h-auto w-full" />
      {interactive && (
        <>
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="tap-sparkle pointer-events-none absolute text-4xl"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-hidden="true"
            >
              ✨
            </span>
          ))}
          {poke === 0 && (
            <span
              className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-base font-semibold shadow-[0_3px_0_#efe3d3] ui-pulse"
              style={{ color: theme.colors.accentDark }}
              aria-hidden="true"
            >
              👆 Tap!
            </span>
          )}
        </>
      )}
    </div>
  );
}
