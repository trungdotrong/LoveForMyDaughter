"use client";

import jsQR from "jsqr";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getLetterInfo, isLetter } from "@/lib/alphabet";
import { encodeLetterPayload } from "@/lib/qr";
import type { ThemeColors } from "@/themes/types";
import { IconButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";

export type ScanFeedback =
  | { kind: "success" }
  | { kind: "wrong"; letter: string }
  | { kind: "already"; letter: string }
  | { kind: "invalid" };

type CameraError = "denied" | "no-camera" | "insecure" | "unsupported" | "failed";

const SCAN_INTERVAL_MS = 180;
/** Ignore the same code for this long so a card held in view isn't counted twice. */
const SAME_CODE_COOLDOWN_MS = 3000;
const FEEDBACK_MS = 2600;

const CAMERA_ERRORS: Record<CameraError, string> = {
  denied: "We need the camera to scan cards. Ask a grown-up to allow camera access in the browser settings.",
  "no-camera": "We couldn't find a camera on this device.",
  insecure: "The camera only works on a secure (https) page. Ask a grown-up to open the game with https.",
  unsupported: "This browser can't use the camera. Try Chrome or Safari.",
  failed: "The camera didn't start. Close this and try again.",
};

function feedbackMessage(f: Exclude<ScanFeedback, { kind: "success" }>): { title: string; body: string } {
  switch (f.kind) {
    case "wrong":
      return {
        title: `That's ${f.letter}!`,
        body: "Oops! That's not the letter we're looking for. Let's try again!",
      };
    case "already":
      return { title: `${f.letter} again!`, body: `You already found ${f.letter}! Let's look for another one.` };
    case "invalid":
      return { title: "Hmm...", body: "That's not an ABC Adventure card. Try a letter card!" };
  }
}

export function QRScanner({
  onDetect,
  onClose,
  colors,
}: {
  /** Handles a raw QR payload; return feedback to show (success closes the scanner). */
  onDetect: (payload: string) => ScanFeedback;
  onClose: () => void;
  colors: ThemeColors;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDetectRef = useRef(onDetect);
  const pausedRef = useRef(false);
  const [error, setError] = useState<CameraError | null>(null);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState<Exclude<ScanFeedback, { kind: "success" }> | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState("");

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  function handle(payload: string) {
    const result = onDetectRef.current(payload);
    if (result.kind === "success") return;
    pausedRef.current = true;
    setFeedback(result);
    setTimeout(() => {
      pausedRef.current = false;
      setFeedback(null);
    }, FEEDBACK_MS);
  }
  const handleRef = useRef(handle);
  useEffect(() => {
    handleRef.current = handle;
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    let last = { text: "", at: 0 };
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    function tick() {
      const video = videoRef.current;
      if (cancelled || !video || !ctx) return;
      if (!pausedRef.current && video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth) {
        const scale = Math.min(1, 640 / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" });
        const now = Date.now();
        if (code?.data && !(code.data === last.text && now - last.at < SAME_CODE_COOLDOWN_MS)) {
          last = { text: code.data, at: now };
          handleRef.current(code.data);
        }
      }
      timer = setTimeout(tick, SCAN_INTERVAL_MS);
    }

    async function start() {
      if (!window.isSecureContext) return setError("insecure");
      if (!navigator.mediaDevices?.getUserMedia) return setError("unsupported");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch (e) {
        const name = e instanceof DOMException ? e.name : "";
        setError(name === "NotAllowedError" ? "denied" : name === "NotFoundError" ? "no-camera" : "failed");
        return;
      }
      const video = videoRef.current;
      if (cancelled || !video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        // Autoplay quirks: the stream still renders once the user interacts.
      }
      setReady(true);
      tick();
    }

    void start();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function submitManual(e: FormEvent) {
    e.preventDefault();
    const value = manual.trim().toUpperCase();
    if (!value) return;
    setManual("");
    handle(isLetter(value) ? encodeLetterPayload(value) : value);
  }

  const message = feedback ? feedbackMessage(feedback) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#2f2a3d] text-white ui-fade-in" role="dialog" aria-modal="true" aria-label="QR scanner">
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold">Find and scan the letter!</p>
        <IconButton label="Close scanner" onClick={onClose}>
          <Icon name="close" />
        </IconButton>
      </div>

      <div className="relative mx-4 flex-1 overflow-hidden rounded-[2rem] bg-black">
        <video ref={videoRef} playsInline muted className="absolute inset-0 size-full object-cover" />

        {!error && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div
              className="aspect-square w-[68%] max-w-80 rounded-[2rem] border-[6px] ui-pulse"
              style={{ borderColor: colors.accent, boxShadow: "0 0 0 9999px rgba(30,25,45,0.45)" }}
            />
          </div>
        )}
        {!ready && !error && (
          <p className="absolute inset-x-0 top-1/2 text-center text-lg">Starting camera...</p>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div className="rounded-3xl bg-white p-6 text-ink">
              <p className="text-4xl" aria-hidden="true">📷</p>
              <p className="mt-2 text-lg">{CAMERA_ERRORS[error]}</p>
            </div>
          </div>
        )}

        {message && feedback && (
          <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-white p-5 text-center text-ink ui-wiggle">
            {feedback.kind !== "invalid" && (
              <p className="text-6xl font-bold leading-none" style={{ color: colors.accent }}>
                {feedback.letter}
                <span className="ml-2 text-3xl text-ink-soft">{getLetterInfo(feedback.letter).lower}</span>
              </p>
            )}
            <p className="mt-2 text-2xl font-semibold">{message.title}</p>
            <p className="text-lg">{message.body}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        {manualOpen ? (
          <form onSubmit={submitManual} className="flex gap-2">
            <input
              autoFocus
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Letter (A) or full code"
              aria-label="Type a letter or QR code"
              className="min-w-0 flex-1 rounded-full px-5 py-3 text-lg text-ink outline-none"
            />
            <button type="submit" className="rounded-full px-5 font-semibold" style={{ background: colors.accent }}>
              Check
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setManualOpen(true)}
            className="mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/70"
          >
            <Icon name="keyboard" className="size-5" />
            Grown-ups: type a code instead
          </button>
        )}
      </div>
    </div>
  );
}
