import type { ComponentType } from "react";
import type { Accessory, Species } from "@/components/art/Critter";
import type { Melody } from "@/lib/sound";

/**
 * A Theme is a self-contained content package. The game engine only reads
 * these fields; adding a Theme means adding a folder here and registering it
 * in themes/index.ts, never changing components/game or lib/game-engine.
 */

export interface Character {
  id: string;
  name: string;
  /** Characters are drawn by the shared Critter art so all Themes match. */
  species: Species;
  accessory?: Accessory;
}

export interface StoryScene {
  title: string;
  dialogue: string[];
}

export interface SetStoryEvent {
  setNumber: number;
  /** Who joins the story when this set is completed. */
  character: Character;
  /** Shown while the child hunts for this set's letters. */
  mission: string;
  title: string;
  dialogue: string[];
  eventDescription: string;
}

export interface FinaleConfig extends StoryScene {
  /** Big completion message, e.g. "Happy Birthday!". */
  message: string;
  celebration: "confetti" | "sparkles";
  /** Synthesized tune played during the finale. */
  melody?: Melody;
  /** Optional user-provided audio file in /public, played instead of the melody. */
  audioSrc?: string;
}

export type SceneMode = "normal" | "arrival" | "finale";

export interface SceneProps {
  /** Number of sets completed, 0–9. Each stage visibly changes the scene. */
  stage: number;
  /** "arrival" animates the newest character in; "finale" plays the ending. */
  mode?: SceneMode;
  className?: string;
}

export interface ThemeColors {
  /** Page background behind the scene. */
  background: string;
  /** Primary button and highlight color. */
  accent: string;
  /** Darker edge of the accent, used for button depth and text. */
  accentDark: string;
  /** Soft tint for cards and panels. */
  soft: string;
}

export interface GameTheme {
  id: string;
  title: string;
  description: string;
  colors: ThemeColors;
  /** Main character who guides the child through the Theme. */
  host: Character;
  /** The Theme's illustrated scene, rendered for any stage. */
  Scene: ComponentType<SceneProps>;
  /** Stage used to draw the cover illustration on the Theme card. */
  coverStage: number;
  intro: StoryScene;
  setEvents: SetStoryEvent[];
  finale: FinaleConfig;
}
