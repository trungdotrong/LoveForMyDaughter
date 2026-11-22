import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RaceScreen } from "@/components/race/RaceScreen";
import { RACE_CUP_NUMBERS } from "@/lib/race-cups";

export function generateStaticParams() {
  return RACE_CUP_NUMBERS.map((n) => ({ cup: String(n) }));
}

export const metadata: Metadata = { title: "ABC Adventure · Race" };

export default async function RacePage({ params }: PageProps<"/race/[cup]">) {
  const { cup } = await params;
  const n = Number(cup);
  if (!RACE_CUP_NUMBERS.includes(n)) notFound();
  return <RaceScreen cupNumber={n} />;
}
