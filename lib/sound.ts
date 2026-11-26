/**
 * Tiny synthesized sound effects (Web Audio) and speech, so the game needs no
 * audio files. Every function is a no-op on the server or without audio support.
 */

import { narratorUtterance } from "./voice";

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
  // iOS uses "interrupted" after a call, screen lock or tab switch, not only "suspended".
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return ctx;
}

const hasSpeech = () => typeof window !== "undefined" && "speechSynthesis" in window;

/*
 * Mobile browsers only allow sound that starts from a tap. The game often
 * plays sound from timers and effects, so the first sound may be blocked, and
 * after the tab is hidden the audio and speech can stay paused. To fix this,
 * every tap wakes both audio and speech up again.
 */

let unlockInstalled = false;
let speechPrimed = false;

function wakeAudio() {
  const ac = audio();
  if (ac) {
    // A silent one-sample buffer played inside a tap unlocks Web Audio on iOS.
    const source = ac.createBufferSource();
    source.buffer = ac.createBuffer(1, 1, 22050);
    source.connect(ac.destination);
    source.start(0);
  }
  if (!hasSpeech()) return;
  const synth = window.speechSynthesis;
  // Chrome can leave speech paused after the tab was in the background.
  if (synth.paused) synth.resume();
  if (!speechPrimed) {
    // iOS only allows speech after a first speak() call made inside a tap.
    speechPrimed = true;
    if (!synth.speaking && !synth.pending) {
      const primer = new SpeechSynthesisUtterance(" ");
      primer.volume = 0;
      synth.speak(primer);
    }
  }
}

/** Installs the tap and visibility listeners once. Safe to call many times. */
export function installAudioUnlock(): void {
  if (unlockInstalled || typeof window === "undefined") return;
  unlockInstalled = true;
  // On iOS 16.4+, play even when the phone's silent switch is on, like a video does.
  const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
  if (session) session.type = "playback";
  for (const event of ["pointerdown", "touchend", "keydown"]) {
    window.addEventListener(event, wakeAudio, { capture: true, passive: true });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    // Clear speech that got stuck while hidden, and try to resume audio.
    if (hasSpeech()) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }
    if (ctx && ctx.state !== "running") void ctx.resume().catch(() => {});
  });
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

/** One note gliding from f0 to f1, for boings and zaps. */
function sweep(f0: number, f1: number, start: number, duration: number, type: OscillatorType = "sine", volume = 0.14) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(f1, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** A burst of filtered noise: splashes and whooshes. */
function noise(start: number, duration: number, volume: number, frequency: number) {
  const ac = audio();
  if (!ac) return;
  const length = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  const gain = ac.createGain();
  gain.gain.value = volume;
  source.connect(filter).connect(gain).connect(ac.destination);
  source.start(ac.currentTime + start);
}

export const sfx = {
  /** Everyone pulls together: a low "heave". */
  heave() {
    sweep(130, 240, 0, 0.4, "triangle", 0.14);
  },
  splash() {
    noise(0, 0.45, 0.5, 900);
    sweep(700, 180, 0.02, 0.25, "sine", 0.06);
  },
  tap() {
    tone(660, 0, 0.08, "triangle", 0.1);
  },
  /** A small bell that says "look at this letter". */
  ting() {
    tone(noteToFreq("E6"), 0, 0.5, "sine", 0.12);
    tone(noteToFreq("B6"), 0.06, 0.6, "sine", 0.07);
  },
  boing() {
    sweep(220, 520, 0, 0.22, "sine", 0.16);
  },
  zap() {
    sweep(1400, 380, 0, 0.3, "triangle", 0.1);
    tone(noteToFreq("A6"), 0.32, 0.12, "sine", 0.06);
  },
  /** Magic bouncing off a shield. */
  bonk() {
    sweep(520, 260, 0, 0.18, "square", 0.05);
  },
  chime() {
    ["C6", "E6", "G6"].forEach((n, i) => tone(noteToFreq(n), i * 0.07, 0.35, "sine", 0.1));
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

/*
 * Narration text can mark words to stress with asterisks, e.g.
 * "Find the letter *E*!". Stressed words are said on their own, slower and
 * brighter, with a short pause before them, so a single letter is never
 * swallowed at the end of a quick sentence.
 */

interface SpeechPart {
  text: string;
  stressed: boolean;
}

/** Pause before a stressed word, and a shorter one after it. */
const PAUSE_BEFORE_STRESS_MS = 320;
const PAUSE_AFTER_STRESS_MS = 160;

function parseSpeech(text: string): SpeechPart[] {
  const parts: SpeechPart[] = [];
  text.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const stressed = chunk.startsWith("*") && chunk.endsWith("*") && chunk.length > 2;
    let body = (stressed ? chunk.slice(1, -1) : chunk).trim();
    // Punctuation right after a stressed word ("*Apple*! Which...") belongs to that word, for the right tone.
    const lead = /^[^\p{L}\p{N}]+/u.exec(body)?.[0] ?? "";
    if (lead && parts.length) {
      parts[parts.length - 1].text += lead.trim();
      body = body.slice(lead.length).trim();
    }
    if (body) parts.push({ text: body, stressed });
  });
  return parts;
}

/** Rough time a phrase takes to say at the narrator's pace, used as a fallback. */
export function estimateSpeechMs(text: string): number {
  return parseSpeech(text).reduce(
    (ms, p) => ms + (p.stressed ? 900 + PAUSE_BEFORE_STRESS_MS : 350 + p.text.length * 72),
    300,
  );
}

const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Bumped whenever speech starts or stops, so an older sentence stops mid-way. */
let speechRun = 0;

/** Says one part and resolves when done. iOS doesn't always fire `end`, so it also times out. */
function sayPart(part: SpeechPart): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(finish, estimateSpeechMs(part.stressed ? `*${part.text}*` : part.text) + 2000);
    const utterance = narratorUtterance(part.text, part.stressed);
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  });
}

/** Speaks the whole text and resolves when finished (or when interrupted by other speech). */
export async function speakAsync(text: string): Promise<void> {
  if (!hasSpeech()) return pause(estimateSpeechMs(text));
  const run = ++speechRun;
  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) {
    synth.cancel();
    // Some Android Chrome versions drop a speak() called right after cancel().
    await pause(60);
    if (run !== speechRun) return;
  }
  if (synth.paused) synth.resume();
  const parts = parseSpeech(text);
  for (let i = 0; i < parts.length; i++) {
    if (run !== speechRun) return;
    if (parts[i].stressed && i > 0) await pause(PAUSE_BEFORE_STRESS_MS);
    if (run !== speechRun) return;
    await sayPart(parts[i]);
    if (parts[i].stressed && i < parts.length - 1) await pause(PAUSE_AFTER_STRESS_MS);
  }
}

export function speak(text: string): void {
  void speakAsync(text);
}

export function stopSpeaking(): void {
  speechRun++;
  if (hasSpeech()) window.speechSynthesis.cancel();
}
