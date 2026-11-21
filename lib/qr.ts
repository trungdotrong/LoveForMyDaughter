import { isLetter } from "./alphabet";

export const QR_PREFIX = "ABCADVENTURE:LETTER:";

/** Payload printed on the physical card, e.g. "ABCADVENTURE:LETTER:A". */
export function encodeLetterPayload(letter: string): string {
  return `${QR_PREFIX}${letter.toUpperCase()}`;
}

/** Returns the uppercase letter from a scanned payload, or null if it isn't one of our cards. */
export function parseQrPayload(raw: string): string | null {
  const text = raw.trim().toUpperCase();
  if (!text.startsWith(QR_PREFIX)) return null;
  const letter = text.slice(QR_PREFIX.length);
  return isLetter(letter) ? letter : null;
}
