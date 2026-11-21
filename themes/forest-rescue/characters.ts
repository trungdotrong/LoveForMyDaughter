import type { Character } from "../types";

export const OWL_GUIDE: Character = { id: "owl", name: "Owl", species: "owl" };

/** In joining order: animal N joins the rescue team when set N is completed. */
export const RESCUE_TEAM: Character[] = [
  { id: "bunny", name: "Bunny", species: "bunny", accessory: "scarf" },
  { id: "bear", name: "Bear", species: "bear", accessory: "scarf" },
  { id: "fox", name: "Fox", species: "fox", accessory: "scarf" },
  { id: "frog", name: "Frog", species: "frog", accessory: "scarf" },
  { id: "mouse", name: "Mouse", species: "mouse", accessory: "scarf" },
  { id: "raccoon", name: "Raccoon", species: "raccoon", accessory: "scarf" },
  { id: "duck", name: "Duck", species: "duck", accessory: "scarf" },
  { id: "pig", name: "Pig", species: "pig", accessory: "scarf" },
  { id: "cat", name: "Cat", species: "cat", accessory: "scarf" },
];
