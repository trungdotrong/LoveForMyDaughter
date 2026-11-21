"use client";

import { useState } from "react";
import { CARD_PAGES } from "./cards";
import { canvasToPngBlob, renderCardPage } from "./render-page";

function pageLabel(letters: string[]): string {
  return letters.length > 1 ? `${letters[0]}–${letters[letters.length - 1]}` : letters[0];
}

async function downloadPage(index: number) {
  const letters = CARD_PAGES[index];
  const blob = await canvasToPngBlob(await renderCardPage(letters));
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `abc-cards-page-${index + 1}-${letters[0]}-${letters[letters.length - 1]}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** One A4 PNG (300 DPI) per page of cards. */
export function ExportPngButtons() {
  const [busy, setBusy] = useState<number | "all" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(target: number | "all") {
    setBusy(target);
    setError(null);
    try {
      if (target === "all") {
        for (let i = 0; i < CARD_PAGES.length; i++) {
          await downloadPage(i);
          // Small pause so the browser accepts each download.
          await new Promise((r) => setTimeout(r, 400));
        }
      } else {
        await downloadPage(target);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "PNG export failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mb-6 rounded-3xl bg-white p-4 shadow-[0_4px_0_#e9dccb] print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Export as PNG</h2>
          <p className="text-sm text-ink-soft">
            {CARD_PAGES.length} A4 images · 6 cards each · 300 DPI
          </p>
        </div>
        <button
          type="button"
          onClick={() => run("all")}
          disabled={busy !== null}
          className="rounded-full bg-[#8fd3ff] px-5 py-3 font-semibold text-ink shadow-[0_4px_0_#5fb3e6] disabled:opacity-60"
        >
          {busy === "all" ? "Exporting..." : `Download all ${CARD_PAGES.length} PNGs`}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {CARD_PAGES.map((letters, i) => (
          <button
            key={i}
            type="button"
            onClick={() => run(i)}
            disabled={busy !== null}
            className="rounded-full bg-cream px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {busy === i ? "..." : `Page ${i + 1} · ${pageLabel(letters)}`}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-[#d9507b]">{error}</p>}
    </section>
  );
}
