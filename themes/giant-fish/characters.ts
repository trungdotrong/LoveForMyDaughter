import type { Character } from "../types";

export const FARMER: Character = { id: "farmer", name: "Farmer Ben", species: "farmer", accessory: "straw-hat" };

/** In joining order: friend N grabs the rope when set N is completed. The tiniest comes last. */
export const HELPERS: Character[] = [
  { id: "bear", name: "Bear", species: "bear" },
  { id: "pig", name: "Pig", species: "pig" },
  { id: "duck", name: "Duck", species: "duck" },
  { id: "fox", name: "Fox", species: "fox" },
  { id: "panda", name: "Panda", species: "panda" },
  { id: "cat", name: "Cat", species: "cat" },
  { id: "raccoon", name: "Raccoon", species: "raccoon" },
  { id: "frog", name: "Frog", species: "frog" },
  { id: "mouse", name: "Mouse", species: "mouse", accessory: "flower" },
];
