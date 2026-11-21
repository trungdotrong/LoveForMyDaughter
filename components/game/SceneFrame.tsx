import type { GameTheme, SceneMode } from "@/themes/types";

/** Draws a Theme's scene at a given stage inside a rounded picture-book frame. */
export function SceneFrame({
  theme,
  stage,
  mode,
  className = "",
}: {
  theme: GameTheme;
  stage: number;
  mode?: SceneMode;
  className?: string;
}) {
  const { Scene } = theme;
  return (
    <div className={`overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_8px_0_#efe3d3] ${className}`}>
      <Scene stage={stage} mode={mode} className="block h-auto w-full" />
    </div>
  );
}
