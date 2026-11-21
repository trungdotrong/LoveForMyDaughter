import type { Character } from "../types";

export const BUNNY: Character = { id: "bunny", name: "Bunny", species: "bunny", accessory: "bow" };

/** In arrival order: friend N arrives when set N is completed. */
export const BIRTHDAY_FRIENDS: Character[] = [
  { id: "bear", name: "Bear", species: "bear", accessory: "party-hat" },
  { id: "fox", name: "Fox", species: "fox", accessory: "party-hat" },
  { id: "cat", name: "Cat", species: "cat", accessory: "party-hat" },
  { id: "panda", name: "Panda", species: "panda", accessory: "party-hat" },
  { id: "frog", name: "Frog", species: "frog", accessory: "party-hat" },
  { id: "owl", name: "Owl", species: "owl", accessory: "party-hat" },
  { id: "pig", name: "Pig", species: "pig", accessory: "party-hat" },
  { id: "mouse", name: "Mouse", species: "mouse", accessory: "party-hat" },
  { id: "lion", name: "Lion", species: "lion", accessory: "crown" },
];
