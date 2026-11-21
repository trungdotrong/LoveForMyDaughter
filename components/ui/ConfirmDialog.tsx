"use client";

import { useState, type FormEvent } from "react";
import { GameButton } from "./GameButton";

/**
 * Grown-up check before destructive actions: answer a simple sum.
 * Mount it only while open so each opening gets a fresh question.
 */
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [[a, b]] = useState(() => [6 + Math.floor(Math.random() * 7), 3 + Math.floor(Math.random() * 6)]);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (Number(answer) === a + b) onConfirm();
    else setWrong(true);
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4 ui-fade-in" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl ui-slide-up">
        <h2 id="confirm-title" className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-ink-soft">{message}</p>
        <label className="mt-5 block font-medium">
          Grown-ups only: what is {a} + {b}?
          <input
            inputMode="numeric"
            autoFocus
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setWrong(false);
            }}
            className="mt-2 block w-full rounded-2xl border-2 border-[#f1e6d8] px-4 py-3 text-xl outline-none focus:border-sky"
          />
        </label>
        {wrong && <p className="mt-2 text-sm text-[#d9507b]">That’s not quite right.</p>}
        <div className="mt-6 flex gap-3">
          <GameButton variant="secondary" size="md" className="flex-1" onClick={onCancel}>
            Cancel
          </GameButton>
          <GameButton type="submit" size="md" className="flex-1" color="#ff7a7a" shade="#d95757">
            {confirmLabel}
          </GameButton>
        </div>
      </form>
    </div>
  );
}
