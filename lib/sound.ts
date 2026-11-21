/**
 * Tiny synthesized sound effects (Web Audio) and speech, so the game needs no
 * audio files. Every function is a no-op on the server or without audio support.
 */

export interface Melody {
  bpm: number;
  /** [note, beats]; note like "C4", "F#5", or "R" for a rest. */
  notes: [string, number][];
}

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

const NOTE_INDEX: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

function noteToFreq(note: string): number {
  const match = /^([A-G]#?)(\d)$/.exec(note);
  if (!match) return 0;
  const midi = NOTE_INDEX[match[1]] + (Number(match[2]) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Schedules one note; returns the oscillator so callers can stop it early. */
function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "triangle",
  volume = 0.16,
): OscillatorNode | null {
  const ac = audio();
  if (!ac || freq <= 0) return null;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
  return osc;
}

export const sfx = {
  tap() {
    tone(660, 0, 0.08, "triangle", 0.1);
  },
  success() {
    ["C5", "E5", "G5", "C6"].forEach((n, i) => tone(noteToFreq(n), i * 0.09, 0.25));
  },
  oops() {
    tone(noteToFreq("E4"), 0, 0.18, "sine", 0.14);
    tone(noteToFreq("C4"), 0.16, 0.28, "sine", 0.14);
  },
  setComplete() {
    ["G4", "C5", "E5", "G5", "E5", "G5", "C6"].forEach((n, i) =>
      tone(noteToFreq(n), i * 0.11, 0.3),
    );
  },
};

/** Plays a melody and returns a function that stops it. */
export function playMelody(melody: Melody): () => void {
  const beat = 60 / melody.bpm;
  let t = 0.1;
  const oscs: OscillatorNode[] = [];
  for (const [note, beats] of melody.notes) {
    const dur = beats * beat;
    if (note !== "R") {
      const osc = tone(noteToFreq(note), t, dur * 0.95, "triangle", 0.15);
      if (osc) oscs.push(osc);
    }
    t += dur;
  }
  return () =>
    oscs.forEach((o) => {
      try {
        o.stop();
      } catch {
        // already stopped
      }
    });
}

export function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.15;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
