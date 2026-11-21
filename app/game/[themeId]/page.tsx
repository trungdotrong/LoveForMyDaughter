import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameScreen } from "@/components/game/GameScreen";
import { THEME_IDS } from "@/themes/ids";

export function generateStaticParams() {
  return THEME_IDS.map((themeId) => ({ themeId }));
}

export const metadata: Metadata = { title: "ABC Adventure" };

export default async function GamePage({ params }: PageProps<"/game/[themeId]">) {
  const { themeId } = await params;
  if (!(THEME_IDS as readonly string[]).includes(themeId)) notFound();
  return <GameScreen themeId={themeId} />;
}
