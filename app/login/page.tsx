import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CritterIcon } from "@/components/art/Critter";
import { Backdrop } from "@/components/game/Backdrop";
import { Logo } from "@/components/game/Logo";
import { SignIn } from "./SignIn";

export const metadata: Metadata = { title: "ABC Adventure · Sign in" };

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <Backdrop />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
        <Logo />
        <div className="flex gap-2">
          <CritterIcon species="bunny" accessory="bow" pose="wave" className="h-28 w-24" />
          <CritterIcon species="fox" pose="bounce" className="h-28 w-24" />
          <CritterIcon species="bear" pose="wave" className="h-28 w-24" />
        </div>
        <div className="w-full rounded-[2rem] bg-white p-6 text-center shadow-[0_8px_0_#efe3d3]">
          <p className="text-xl font-semibold">Hello, grown-up!</p>
          <p className="mt-1 text-ink-soft">Sign in to start the adventure.</p>
          <Suspense>
            <SignIn />
          </Suspense>
        </div>
        <Link href="/privacy" className="text-sm text-ink-soft underline underline-offset-4">
          Privacy Policy
        </Link>
      </main>
    </div>
  );
}
