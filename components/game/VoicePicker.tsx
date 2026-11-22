"use client";

import { useSyncExternalStore } from "react";
import { useGameSave } from "@/hooks/useGameProgress";
import { speak } from "@/lib/sound";
import { autoVoice, onVoicesChanged, setPreferredVoice, voiceListSnapshot } from "@/lib/voice";
import { Icon } from "../ui/Icon";

const SAMPLE = "Hooray! You found *A*! *A* is for *Apple*!";

/** Grown-up setting: which narrator voice reads the story, with a try-it button. */
export function VoicePicker({ rowClassName }: { rowClassName: string }) {
  const { save, update } = useGameSave();
  const list = useSyncExternalStore(onVoicesChanged, voiceListSnapshot, () => "");
  const voices = list ? list.split("\n").map((line) => line.split("|") as [string, string]) : [];
  const chosen = save?.settings.voice ?? "";

  function choose(name: string) {
    setPreferredVoice(name);
    update((s) => ({ ...s, settings: { ...s.settings, voice: name || undefined } }));
    speak(SAMPLE);
  }

  return (
    <div className={`${rowClassName} flex-wrap`}>
      <label htmlFor="voice" className="flex items-center gap-3">
        <Icon name="sound" />
        Voice
      </label>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <select
          id="voice"
          value={chosen}
          onChange={(e) => choose(e.target.value)}
          className="min-w-0 max-w-52 flex-1 truncate rounded-xl border-2 border-[#f1e6d8] bg-white px-2 py-1.5 text-base"
        >
          <option value="">Auto{voices.length ? ` (${autoVoice()?.name.replace(/^Microsoft /, "") ?? "default"})` : ""}</option>
          {voices.map(([name, lang]) => (
            <option key={name} value={name}>
              {name.replace(/^Microsoft /, "")} · {lang}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => speak(SAMPLE)}
          className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-[0_3px_0_#e9dccb]"
        >
          Try it
        </button>
      </div>
    </div>
  );
}
