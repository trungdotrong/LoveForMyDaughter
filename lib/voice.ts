/**
 * Picks the narrator voice: a warm, lively female English voice. Browsers
 * expose different voices per device, so we score what is available instead
 * of hard-coding one. A grown-up can override the pick in Settings.
 */

/** Known female voices, best first, across Windows/Edge, Apple and Android/Chrome. */
const FEMALE_VOICES = [
  "jenny", "aria", "ana", "michelle", "emma", "ava", "samantha", "allison", "susan",
  "zoe", "karen", "moira", "tessa", "serena", "kate", "nicky", "joanna", "salli",
  "kendra", "kimberly", "ivy", "libby", "sonia", "natasha", "clara",
  // Chrome's online voices sound livelier than the older built-in Windows ones below.
  "google us english", "google uk english female",
  "victoria", "fiona", "veena", "zira", "hazel", "female",
];
/** Never pick these on our own: they sound flat for a children's story. */
const MALE_VOICES = [
  "male", "david", "mark", "guy", "ryan", "eric", "brian", "christopher", "andrew",
  "roger", "steffan", "daniel", "alex", "fred", "tom", "aaron", "arthur", "oliver",
  "thomas", "gordon", "rishi", "lee", "james", "william", "george", "albert", "ralph",
];
/** Higher-quality engines usually say so in the name. */
const QUALITY_HINTS = ["natural", "neural", "premium", "enhanced", "online"];

function englishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
}

function score(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  if (MALE_VOICES.some((m) => new RegExp(`\\b${m}\\b`).test(name))) return -1;
  const female = FEMALE_VOICES.findIndex((f) => name.includes(f));
  let s = female >= 0 ? 100 - female : 10;
  if (QUALITY_HINTS.some((q) => name.includes(q))) s += 60;
  if (voice.lang.toLowerCase().replace("_", "-") === "en-us") s += 15;
  if (voice.localService) s += 2;
  return s;
}

/** English voices for the Settings picker, likely-female and higher quality first. */
export function listEnglishVoices(): SpeechSynthesisVoice[] {
  return englishVoices().sort((a, b) => score(b) - score(a));
}

/**
 * Stable snapshot of the picker list for useSyncExternalStore: one
 * "name|lang" per line, best first. Same string while voices are unchanged.
 */
export function voiceListSnapshot(): string {
  return listEnglishVoices()
    .map((v) => `${v.name}|${v.lang}`)
    .join("\n");
}

/** The chosen voice name from Settings, if any. */
let preferred: string | null = null;

export function setPreferredVoice(name: string | null | undefined) {
  preferred = name || null;
}

/** The best-scoring female voice, ignoring any Settings choice. */
export function autoVoice(): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  for (const v of englishVoices()) if (score(v) >= 0 && (!best || score(v) > score(best))) best = v;
  return best;
}

export function pickVoice(): SpeechSynthesisVoice | null {
  if (preferred) {
    const chosen = englishVoices().find((v) => v.name === preferred);
    if (chosen) return chosen;
  }
  return autoVoice();
}

/** Calls back whenever the browser finishes loading (or changes) its voices. */
export function onVoicesChanged(callback: () => void): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", callback);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", callback);
}

/**
 * An utterance in the narrator's cheerful style. A `stressed` word (usually a
 * single letter) is said slowly and brightly so a small child can catch it.
 */
export function narratorUtterance(text: string, stressed = false): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = stressed ? 0.7 : 0.88;
  utterance.pitch = stressed ? 1.4 : 1.25;
  return utterance;
}
