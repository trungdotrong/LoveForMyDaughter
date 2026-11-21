import type { GameTheme, SetStoryEvent } from "../types";
import { OWL_GUIDE, RESCUE_TEAM } from "./characters";
import { ForestScene } from "./ForestScene";

const JOINS: [lines: string[], description: string][] = [
  [["Bunny hops out of the bush!", "Bunny joins the rescue team!"], "Bunny is the first team member."],
  [["Bear peeks out. Hello, Bear!", "Bear joins the team!"], "Bear joins the formation."],
  [["Fox was hiding here!", "Fox joins the team!"], "Fox joins the formation."],
  [["Ribbit! Frog jumps out!", "Frog joins the team!"], "Frog joins the formation."],
  [["Squeak! Little Mouse is brave!", "Mouse joins the team!"], "Mouse joins the formation."],
  [["Raccoon has a great idea!", "Raccoon joins the team!"], "Raccoon joins the formation."],
  [["Quack! Duck waddles over!", "Duck joins the team!"], "Duck joins the formation."],
  [["Oink! Pig is ready to help!", "Pig joins the team!"], "Pig joins the formation."],
  [["Cat was the last one hiding!", "The rescue team is ready!"], "Cat completes the rescue team."],
];

const setEvents: SetStoryEvent[] = RESCUE_TEAM.map((character, i) => ({
  setNumber: i + 1,
  character,
  mission:
    i === 8
      ? "One friend is still hiding! Find the letters!"
      : "Find the letters to call a friend to the team!",
  title: `${character.name} joins the team!`,
  dialogue: JOINS[i][0],
  eventDescription: JOINS[i][1],
}));

export const forestRescue: GameTheme = {
  id: "forest-rescue",
  title: "Forest Rescue",
  description: "Gather animal friends to help the silly forest monster!",
  colors: { background: "#effae8", accent: "#3fb27f", accentDark: "#2a8a5f", soft: "#d8f5d0" },
  host: OWL_GUIDE,
  Scene: ForestScene,
  coverStage: 3,
  intro: {
    title: "Forest Rescue",
    dialogue: [
      "Hoot! Welcome to the Magic Forest!",
      "A silly monster named Wobble made a big mess.",
      "Our animal friends are hiding in the bushes.",
      "Let's find letters to build a rescue team!",
    ],
  },
  setEvents,
  finale: {
    title: "The Forest Is Saved!",
    message: "The forest is saved!",
    dialogue: [
      "The rescue team marches to Wobble.",
      "Wobble giggles: \"I just wanted friends to play with!\"",
      "Everyone tidies up the forest together.",
      "Wobble joins the team. Hooray!",
    ],
    celebration: "sparkles",
    melody: {
      bpm: 150,
      notes: [
        ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["F5", 1], ["A5", 1], ["G5", 2],
        ["E5", 1], ["G5", 1], ["C6", 1], ["G5", 1], ["A5", 1], ["G5", 1], ["E5", 2],
        ["D5", 1], ["E5", 1], ["F5", 1], ["D5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["B4", 1],
        ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C6", 4],
      ],
    },
  },
};
