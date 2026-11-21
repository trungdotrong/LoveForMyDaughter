import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { ALPHABET, getLetterInfo } from "@/lib/alphabet";
import { encodeLetterPayload } from "@/lib/qr";
import { cardColor } from "./cards";
import { ExportPngButtons } from "./ExportPngButtons";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = { title: "ABC Adventure · Printable cards" };

export default async function PrintPage() {
  // Generated at build time: the payload format is the same one the scanner parses.
  const cards = await Promise.all(
    ALPHABET.map(async (letter) => ({
      info: getLetterInfo(letter),
      svg: await QRCode.toString(encodeLetterPayload(letter), {
        type: "svg",
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#2f2a3d", light: "#ffffff" },
      }),
    })),
  );

  return (
    <div className="mx-auto w-full max-w-4xl p-4 print:max-w-none print:p-0">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Alphabet QR cards</h1>
          <p className="text-ink-soft">Print, cut along the dashed lines, and hide the cards around the house.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="rounded-full bg-white px-5 py-3 font-semibold shadow-[0_4px_0_#e9dccb]">
            Back
          </Link>
          <PrintButton />
        </div>
      </header>

      <ExportPngButtons />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-0">
        {cards.map(({ info, svg }, i) => (
          <article
            key={info.upper}
            className="flex h-[92mm] flex-col overflow-hidden rounded-3xl border-[3px] bg-white break-inside-avoid print:rounded-none print:border-2 print:border-dashed print:border-[#b9b2c6]"
            style={{ borderColor: cardColor(i) }}
          >
            <div className="flex flex-1 items-center gap-4 px-5 pt-3">
              <div className="flex flex-1 items-baseline justify-center gap-3">
                <span className="text-[34mm] font-bold leading-none" style={{ color: "#2f2a3d" }}>
                  {info.upper}
                </span>
                <span className="text-[20mm] font-semibold leading-none text-ink-soft">{info.lower}</span>
              </div>
              <div
                className="w-[38mm] shrink-0 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
                role="img"
                aria-label={`QR code for letter ${info.upper}`}
              />
            </div>
            <div
              className="flex items-center justify-center gap-3 py-2 text-2xl font-semibold"
              style={{ background: cardColor(i) }}
            >
              <span className="text-3xl" aria-hidden="true">{info.emoji}</span>
              {info.word}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
