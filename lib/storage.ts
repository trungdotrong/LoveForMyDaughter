import { createEmptySave, type GameSave } from "./progress";

/**
 * LocalStorage-backed store for the game save. The rest of the app only uses
 * readSave/updateSave/subscribe, so swapping this for Supabase stays local.
 */

const STORAGE_KEY = "abc-adventure:save:v1";

const listeners = new Set<() => void>();
let cache: GameSave | undefined;

function load(): GameSave {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptySave();
    const parsed = JSON.parse(raw) as GameSave;
    if (parsed?.version !== 1 || typeof parsed.themes !== "object") return createEmptySave();
    return { ...createEmptySave(), ...parsed };
  } catch {
    return createEmptySave();
  }
}

export function readSave(): GameSave {
  cache ??= load();
  return cache;
}

export function updateSave(updater: (save: GameSave) => GameSave): void {
  cache = updater(readSave());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or blocked: keep playing with the in-memory copy.
  }
  listeners.forEach((l) => l());
}

export function clearSave(): void {
  updateSave(() => createEmptySave());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = undefined;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
