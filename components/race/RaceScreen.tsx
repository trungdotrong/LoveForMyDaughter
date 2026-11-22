"use client";

import { useEffect, useRef, useState } from "react";
import { useGameSave } from "@/hooks/useGameProgress";
import { useSound } from "@/hooks/useSound";
import { getLetterInfo } from "@/lib/alphabet";
import { addRaceMedal } from "@/lib/progress";
import {
  RIVALS,
  answerQuestion,
  currentRival,
  getCup,
  isFinished,
  makeQuestion,
  racePool,
  startRace,
  type RaceCup,
} from "@/lib/race-engine";
import { estimateSpeechMs, stopSpeaking } from "@/lib/sound";
import { TopBar } from "../game/TopBar";
import { QuizPanel, RACE_COLORS, questionPrompt, type Feedback } from "./QuizPanel";
import { RaceFinish } from "./RaceFinish";
import { RaceTrack } from "./RaceTrack";

const NEXT_AFTER_RIGHT_MS = 1300;
const NEXT_AFTER_WRONG_MS = 2600;
const PODIUM_AFTER_FINISH_MS = 2600;

type Phase = "racing" | "finishing" | "podium";

function RaceGame({ cup, onRaceAgain }: { cup: RaceCup; onRaceAgain: () => void }) {
  const { update } = useGameSave();
  const sound = useSound();
  // Mounted only on the client (after the save loads), so random questions can't cause a hydration mismatch.
  const [pool] = useState(() => racePool(cup, Math.random));
  const [question, setQuestion] = useState(() => makeQuestion(0, pool, Math.random));
  const [race, setRace] = useState(startRace);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [phase, setPhase] = useState<Phase>("racing");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => {
    clearTimeout(timer.current);
    stopSpeaking();
  }, []);

  // Read each new question aloud.
  const say = sound.say;
  useEffect(() => {
    if (phase !== "racing") return;
    const t = setTimeout(() => say(questionPrompt(question)), 350);
    return () => clearTimeout(t);
  }, [question, phase, say]);

  function choose(choice: string) {
    if (feedback || phase !== "racing") return;
    const correct = choice === question.answer;
    const nextRace = answerQuestion(race, correct);
    setFeedback({ choice, correct });
    setRace(nextRace);
    const { word } = getLetterInfo(question.letter);

    if (correct) {
      sound.play("success");
      const passed = nextRace.event.kind === "pass" ? RIVALS[currentRival(nextRace) - 1] : null;
      const cheer =
        question.kind === "picture"
          ? `Yes! ${word} starts with *${question.letter}*!`
          : passed
            ? `*${question.letter}*! You passed ${passed.name}!`
            : `*${question.letter}*! Great job!`;
      sound.say(cheer);
      // Let the narrator finish before moving on.
      const wait = Math.max(NEXT_AFTER_RIGHT_MS, estimateSpeechMs(cheer) + 300);
      if (isFinished(nextRace)) {
        update((s) => addRaceMedal(s, cup.number));
        timer.current = setTimeout(() => {
          setFeedback(null);
          setPhase("finishing");
          sound.play("setComplete");
          sound.say("You crossed the finish line! You are the winner!");
          timer.current = setTimeout(() => setPhase("podium"), PODIUM_AFTER_FINISH_MS);
        }, wait);
        return;
      }
      timer.current = setTimeout(() => {
        setFeedback(null);
        setQuestion(makeQuestion(question.id + 1, pool, Math.random));
      }, wait);
    } else {
      sound.play("oops");
      const correction = `Oops! That's *${choice.toUpperCase()}*. This one is *${question.letter}*!`;
      sound.say(correction);
      // Ask the same letter again a different way, so the right answer sticks.
      timer.current = setTimeout(() => {
        setFeedback(null);
        setQuestion(makeQuestion(question.id + 1, pool, Math.random, question));
      }, Math.max(NEXT_AFTER_WRONG_MS, estimateSpeechMs(correction) + 400));
    }
  }

  if (phase === "podium") return <RaceFinish cup={cup} onRaceAgain={onRaceAgain} />;

  return (
    <div className="flex flex-1 flex-col gap-4 ui-fade-in">
      <div className="overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_8px_0_#efe3d3]">
        <RaceTrack race={race} />
      </div>
      {phase === "racing" ? (
        <QuizPanel question={question} feedback={feedback} onChoose={choose} onHear={() => sound.say(questionPrompt(question))} />
      ) : (
        <p className="ui-bounce-in text-center text-4xl font-bold" style={{ color: RACE_COLORS.accentDark }}>
          🏁 You win! 🏁
        </p>
      )}
    </div>
  );
}

/** ABC Race: answer letter questions to overtake each rival and reach the finish line. */
export function RaceScreen({ cupNumber }: { cupNumber: number }) {
  const cup = getCup(cupNumber);
  const { save } = useGameSave();
  const [attempt, setAttempt] = useState(0);
  if (!cup) return null;

  return (
    <div className="flex flex-1 flex-col" style={{ background: RACE_COLORS.background }}>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-4">
        <TopBar>
          <span
            className="inline-block rounded-full bg-white px-4 py-2 text-lg font-semibold tracking-wide shadow-[0_4px_0_#efe3d3]"
            style={{ color: RACE_COLORS.accentDark }}
          >
            {cup.name}
          </span>
        </TopBar>
        {save ? <RaceGame key={`${cup.number}-${attempt}`} cup={cup} onRaceAgain={() => setAttempt((a) => a + 1)} /> : <div className="flex-1" />}
        <div className="pb-4" />
      </main>
    </div>
  );
}
