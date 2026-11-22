import type { GameTheme, SetStoryEvent } from "../types";
import { FARMER, HELPERS } from "./characters";
import { FishScene } from "./FishScene";

const HELPS: [title: string, lines: string[]][] = [
  ["Bear grabs on!", ["Bear grabs Farmer Ben!", "Heave-ho! Still too heavy!"]],
  ["Pig is here to help!", ["Oink! Pig grabs the rope!", "Pull, pull! The fish won't budge!"]],
  ["Duck joins in!", ["Quack! Duck holds on tight!", "The rod bends... but no fish yet!"]],
  ["Fox pulls too!", ["Fox grabs the rope!", "Splash! The fish is so strong!"]],
  ["Panda helps!", ["Panda pulls with a big grunt!", "Almost! But it slips back down!"]],
  ["Cat comes to help!", ["Meow! Cat grabs on!", "The giant fish wiggles and splashes!"]],
  ["Raccoon is here!", ["Raccoon holds the rope!", "Heave-ho! We need more friends!"]],
  ["Frog hops in!", ["Ribbit! Frog grabs on!", "So close! Who else can help?"]],
  ["Little Mouse helps!", ["Squeak! Tiny Mouse wants to help too!", "Now everyone is here. Ready... set..."]],
];

const setEvents: SetStoryEvent[] = HELPERS.map((character, i) => ({
  setNumber: i + 1,
  character,
  mission:
    i === 8
      ? "One tiny friend is left! Find the letters to call them!"
      : "Find the letters to call a friend to help pull!",
  title: HELPS[i][0],
  dialogue: HELPS[i][1],
  eventDescription: `${character.name} joins the line behind Farmer Ben.`,
}));

export const giantFish: GameTheme = {
  id: "giant-fish",
  title: "The Giant Fish",
  description: "Farmer Ben caught a giant fish! Call friends to help pull it out!",
  colors: { background: "#eaf6ff", accent: "#3a9ad9", accentDark: "#21709f", soft: "#d6ecfb" },
  host: FARMER,
  Scene: FishScene,
  coverStage: 3,
  unlockButton: "Help pull!",
  intro: {
    title: "The Giant Fish",
    dialogue: [
      "Farmer Ben went fishing at the pond.",
      "Tug, tug! Something is pulling his line!",
      "Whoa! It's a GIANT fish! He pulls and pulls...",
      "But it's too heavy! Let's find letters to call friends to help!",
    ],
  },
  setEvents,
  finale: {
    title: "Heave-ho!",
    message: "We caught it!",
    dialogue: [
      "Everyone holds on tight. Tiny Mouse too!",
      "Tap the picture to pull! Heave-ho! Heave-ho!",
      "POP! Out jumps the giant fish! Everyone falls down laughing!",
      "The fish says thank you, splashes everyone, and swims home. Teamwork!",
    ],
    celebration: "confetti",
    // An original bouncy tune for the big pull.
    melody: {
      bpm: 132,
      notes: [
        ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1], ["G5", 2],
        ["A5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["D5", 2],
        ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["A5", 1], ["G5", 1], ["E5", 1], ["D5", 1],
        ["C5", 1], ["D5", 1], ["E5", 1], ["G5", 1], ["C6", 4],
      ],
    },
  },
};
