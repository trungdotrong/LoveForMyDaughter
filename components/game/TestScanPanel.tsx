"use client";

import { useState } from "react";
import { ALPHABET } from "@/lib/alphabet";
import type { ThemeColors } from "@/themes/types";
import type { ScanFeedback } from "./QRScanner";

/**
 * Test mode only: buttons that act exactly like scanning a card, for trying
 * the game without printed cards or a camera.
 */
export function TestScanPanel({
  openLetters,
  setLetters,
  colors,
  onScan,
}: {
  /** Letters still to find in this set. */
  openLetters: string[];
  /** All letters of this set, so "wrong letter" picks one outside it. */
  setLetters: string[];
  colors: ThemeColors;
  onScan: (letter: string) => ScanFeedback;
}) {
  const [note, setNote] = useState<string | null>(null);
  const wrong = ALPHABET.find((l) => !setLetters.includes(l)) ?? "Z";

  function scan(letter: string) {
    const result = onScan(letter);
    setNote(
      result.kind === "wrong"
        ? `${letter} is not in this set (the child would see "Oops!").`
        : result.kind === "already"
          ? `${letter} was already found.`
          : result.kind === "invalid"
            ? "Not accepted right now."
            : null,
    );
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-[#d9cde6] bg-white/95 p-3 shadow-[0_4px_0_#efe3d3]">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">🧪 Test mode · pretend to scan</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {openLetters.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => scan(l)}
            className="min-h-11 rounded-full px-4 font-semibold text-white"
            style={{ background: colors.accent, boxShadow: `0 3px 0 ${colors.accentDark}` }}
          >
            Scan {l}
          </button>
        ))}
        <button
          type="button"
          onClick={() => scan(wrong)}
          className="min-h-11 rounded-full bg-white px-4 font-semibold text-ink-soft shadow-[0_3px_0_#e9dccb]"
        >
          Wrong letter ({wrong})
        </button>
      </div>
      {note && <p className="mt-2 text-sm text-ink-soft">{note}</p>}
    </div>
  );
}
