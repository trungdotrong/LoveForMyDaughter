import QRCode from "qrcode";
import { ALPHABET, getLetterInfo } from "@/lib/alphabet";
import { encodeLetterPayload } from "@/lib/qr";
import { CARD_COLUMNS, CARD_ROWS, cardColor } from "./cards";

/**
 * Draws one A4 page of letter cards onto a canvas at print resolution.
 * Browser-only. Uses the same QR payload the in-game scanner reads.
 */

const DPI = 300;
const PX_PER_MM = DPI / 25.4;
const A4 = { width: 210, height: 297 };
/** Side margin keeps the cards inside what home printers can reach. */
const MARGIN_X = 8;
const CARD = { width: (A4.width - MARGIN_X * 2) / CARD_COLUMNS, height: 92 };
const MARGIN_Y = (A4.height - CARD.height * CARD_ROWS) / 2;
const BAND_HEIGHT = 16;
const QR_SIZE = 38;
const PAD = 6;

const INK = "#2f2a3d";
const INK_SOFT = "#7a7290";
const CUT_LINE = "#b9b2c6";
const EMOJI_FONTS = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';

const mm = (v: number) => v * PX_PER_MM;

/** The page's font stack, which includes the loaded Fredoka face. */
async function loadFont(): Promise<string> {
  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  await Promise.all([
    document.fonts.load(`700 100px ${family}`),
    document.fonts.load(`600 100px ${family}`),
  ]);
  await document.fonts.ready;
  return family;
}

function drawQr(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const quiet = 1;
  const cell = size / (modules.size + quiet * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = INK;
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (modules.get(row, col)) {
        // Overlap by a hair so adjacent modules never show seams.
        ctx.fillRect(x + (col + quiet) * cell, y + (row + quiet) * cell, cell + 0.5, cell + 0.5);
      }
    }
  }
}

function drawCard(ctx: CanvasRenderingContext2D, letter: string, x: number, y: number, font: string) {
  const info = getLetterInfo(letter);
  const w = mm(CARD.width);
  const h = mm(CARD.height);
  const band = mm(BAND_HEIGHT);
  const top = h - band;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, w, h);

  // QR on the right, centered in the top area.
  const qr = mm(QR_SIZE);
  const qrX = x + w - mm(PAD) - qr;
  drawQr(ctx, encodeLetterPayload(letter), qrX, y + (top - qr) / 2, qr);

  // Upper + lower letter, baseline-aligned and centered in the space left of the QR.
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  const upperFont = `700 ${mm(34)}px ${font}`;
  const lowerFont = `600 ${mm(20)}px ${font}`;
  ctx.font = upperFont;
  const upperW = ctx.measureText(info.upper).width;
  ctx.font = lowerFont;
  const lowerW = ctx.measureText(info.lower).width;
  const gap = mm(4);
  const areaW = qrX - x - mm(PAD);
  const startX = x + mm(PAD) + (areaW - (upperW + gap + lowerW)) / 2;
  const baseline = y + top / 2 + mm(12);
  ctx.fillStyle = INK;
  ctx.font = upperFont;
  ctx.fillText(info.upper, startX, baseline);
  ctx.fillStyle = INK_SOFT;
  ctx.font = lowerFont;
  ctx.fillText(info.lower, startX + upperW + gap, baseline);

  // Colored band with emoji + word.
  ctx.fillStyle = cardColor(ALPHABET.indexOf(letter));
  ctx.fillRect(x, y + top, w, band);
  const emojiFont = `${mm(9)}px ${EMOJI_FONTS}`;
  const wordFont = `600 ${mm(8)}px ${font}`;
  ctx.font = emojiFont;
  const emojiW = ctx.measureText(info.emoji).width;
  ctx.font = wordFont;
  const wordW = ctx.measureText(info.word).width;
  const bandGap = mm(3);
  const bandX = x + (w - (emojiW + bandGap + wordW)) / 2;
  ctx.textBaseline = "middle";
  const bandMid = y + top + band / 2;
  ctx.font = emojiFont;
  ctx.fillText(info.emoji, bandX, bandMid);
  ctx.fillStyle = INK;
  ctx.font = wordFont;
  ctx.fillText(info.word, bandX + emojiW + bandGap, bandMid + mm(0.5));

  // Dashed cut line.
  ctx.save();
  ctx.strokeStyle = CUT_LINE;
  ctx.lineWidth = mm(0.4);
  ctx.setLineDash([mm(2.5), mm(1.8)]);
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

export async function renderCardPage(letters: string[]): Promise<HTMLCanvasElement> {
  const font = await loadFont();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(mm(A4.width));
  canvas.height = Math.round(mm(A4.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  letters.forEach((letter, i) => {
    const col = i % CARD_COLUMNS;
    const row = Math.floor(i / CARD_COLUMNS);
    drawCard(ctx, letter, mm(MARGIN_X + col * CARD.width), mm(MARGIN_Y + row * CARD.height), font);
  });
  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed."))), "image/png"),
  );
}
