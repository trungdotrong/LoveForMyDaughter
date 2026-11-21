import type { GameTheme, SetStoryEvent } from "../types";
import { BirthdayScene } from "./BirthdayScene";
import { BIRTHDAY_FRIENDS, BUNNY } from "./characters";

const ARRIVALS: [title: string, lines: string[], description: string][] = [
  ["Bear is here!", ["Yay! Bear is here!", "Bear brought a big present!"], "Bear sits down at the party table."],
  ["Fox has arrived!", ["Look! Fox has arrived!", "Fox hangs up more balloons."], "Fox joins the table and the room gets more colorful."],
  ["Cat came too!", ["Meow! Cat came too!", "Cat loves birthday cake."], "Cat takes a seat next to the cake."],
  ["Hello, Panda!", ["Hello, Panda!", "Panda gives Bunny a big hug."], "Panda fills another chair."],
  ["Frog hopped in!", ["Ribbit! Frog hopped in!", "Frog brought party streamers."], "Frog hops into the party."],
  ["Owl flew in!", ["Hoot hoot! Owl flew in!", "Owl knows lots of party songs."], "Owl arrives and the party gets louder."],
  ["Pig is here!", ["Oink! Pig is here!", "Pig wants to dance."], "Pig joins the fun."],
  ["Mouse is here!", ["Squeak! Little Mouse is here!", "Mouse brought a tiny gift."], "Mouse takes the last seat at the table."],
  ["Lion is here!", ["Roar! Lion is here!", "Now everyone is at the party!"], "Lion arrives with a shiny crown. All friends are here."],
];

const setEvents: SetStoryEvent[] = BIRTHDAY_FRIENDS.map((character, i) => ({
  setNumber: i + 1,
  character,
  mission: i === 8 ? "One last friend! Find the letters to invite them!" : "Find the letters to invite a friend!",
  title: ARRIVALS[i][0],
  dialogue: ARRIVALS[i][1],
  eventDescription: ARRIVALS[i][2],
}));

export const birthdayParty: GameTheme = {
  id: "birthday-party",
  title: "Bunny's Birthday",
  description: "Help Bunny invite friends to the birthday party!",
  colors: { background: "#fff1f4", accent: "#ff7aa2", accentDark: "#d9507b", soft: "#ffe0ea" },
  host: BUNNY,
  Scene: BirthdayScene,
  coverStage: 3,
  unlockButton: "Go to the party!",
  intro: {
    title: "Bunny's Birthday",
    dialogue: [
      "Today is Bunny's birthday!",
      "Bunny made a yummy cake and blew up balloons.",
      "But oh no... nobody has come yet!",
      "Let's find letters to invite Bunny's friends!",
    ],
  },
  setEvents,
  finale: {
    title: "Happy Birthday, Bunny!",
    message: "Happy Birthday!",
    dialogue: [
      "Everyone is here!",
      "Let's sing for Bunny!",
      "Thank you for inviting all my friends!",
    ],
    celebration: "confetti",
    // "Happy Birthday to You" melody (public domain composition), synthesized.
    melody: {
      bpm: 120,
      notes: [
        ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
        ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
        ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
        ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
      ],
    },
  },
};
