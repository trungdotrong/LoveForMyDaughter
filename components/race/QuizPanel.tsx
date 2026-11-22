import { getLetterInfo } from "@/lib/alphabet";
import type { Question } from "@/lib/race-engine";
import { Icon } from "../ui/Icon";

export const RACE_COLORS = { accent: "#ff8a3d", accentDark: "#d9661f", soft: "#ffe9d6", background: "#fff6ec" };

export interface Feedback {
  choice: string;
  correct: boolean;
}

/** What the narrator says for each kind of question. */
export function questionPrompt(q: Question): string {
  const { word } = getLetterInfo(q.letter);
  switch (q.kind) {
    case "hear":
      return `Find the letter *${q.letter}*!`;
    case "picture":
      return `*${word}*! Which letter does ${word} start with?`;
    case "lowercase":
      return `This is big *${q.letter}*. Find little *${q.letter}*!`;
  }
}

export function QuizPanel({
  question,
  feedback,
  onChoose,
  onHear,
}: {
  question: Question;
  feedback: Feedback | null;
  onChoose: (choice: string) => void;
  onHear: () => void;
}) {
  const info = getLetterInfo(question.letter);

  return (
    <div className="flex flex-col gap-4">
      <div key={question.id} className="ui-slide-up flex items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_6px_0_#efe3d3]">
        <button
          type="button"
          onClick={onHear}
          aria-label="Hear the question again"
          className="grid size-16 shrink-0 place-items-center rounded-full text-white shadow-[0_4px_0_#d9661f]"
          style={{ background: RACE_COLORS.accent }}
        >
          <Icon name="sound" className="size-8" />
        </button>
        {question.kind === "hear" && <p className="text-2xl font-semibold leading-snug">Find the letter you hear!</p>}
        {question.kind === "picture" && (
          <div className="flex items-center gap-3">
            <span className="text-6xl leading-none" aria-hidden="true">{info.emoji}</span>
            <p className="text-4xl font-bold tracking-wide">
              <span className="mr-0.5 inline-block w-[0.8em] rounded-lg border-[3px] border-dashed text-center" style={{ borderColor: RACE_COLORS.accent }}>
                &nbsp;
              </span>
              {info.word.slice(1)}
            </p>
          </div>
        )}
        {question.kind === "lowercase" && (
          <div className="flex items-center gap-3">
            <span className="grid size-16 place-items-center rounded-2xl text-5xl font-bold" style={{ background: RACE_COLORS.soft, color: RACE_COLORS.accentDark }}>
              {question.letter}
            </span>
            <p className="text-2xl font-semibold leading-snug">Find the little letter!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {question.choices.map((c) => {
          const chosen = feedback?.choice === c;
          const isAnswer = c === question.answer;
          const state = !feedback ? "idle" : chosen ? (feedback.correct ? "right" : "wrong") : isAnswer && !feedback.correct ? "reveal" : "dim";
          return (
            <button
              key={`${question.id}-${c}`}
              type="button"
              disabled={feedback !== null}
              onClick={() => onChoose(c)}
              className={`grid aspect-square place-items-center rounded-3xl text-7xl font-bold transition-[transform,opacity,background-color] duration-300 ${
                state === "wrong" ? "ui-wiggle" : state === "right" || state === "reveal" ? "scale-110" : ""
              } ${state === "dim" ? "opacity-40" : ""}`}
              style={{
                background: state === "right" || state === "reveal" ? "#e3f8dc" : state === "wrong" ? "#ffe1e6" : "#fff",
                color: state === "right" || state === "reveal" ? "#3f9a52" : state === "wrong" ? "#d9507b" : RACE_COLORS.accentDark,
                border: `4px solid ${state === "right" || state === "reveal" ? "#4cbf6a" : state === "wrong" ? "#ff8fb1" : "#fff"}`,
                boxShadow: "0 7px 0 #efe3d3",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
