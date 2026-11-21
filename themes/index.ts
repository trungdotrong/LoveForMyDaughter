import { birthdayParty } from "./birthday-party";
import { forestRescue } from "./forest-rescue";
import type { GameTheme } from "./types";

/** Register new Themes here. Order is the order shown on the Home screen. */
export const THEMES: GameTheme[] = [birthdayParty, forestRescue];

export function getTheme(id: string): GameTheme | undefined {
  return THEMES.find((t) => t.id === id);
}
