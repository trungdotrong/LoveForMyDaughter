"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSound } from "@/hooks/useSound";
import { IconButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";

export function TopBar({ children }: { children?: ReactNode }) {
  const { enabled, toggle } = useSound();
  return (
    <header className="flex items-center justify-between gap-3">
      <Link
        href="/"
        aria-label="Back to themes"
        title="Back to themes"
        className="grid size-12 place-items-center rounded-full bg-white/90 shadow-[0_4px_0_#e9dccb] transition-transform active:translate-y-1"
      >
        <Icon name="home" />
      </Link>
      <div className="min-w-0 flex-1 text-center">{children}</div>
      <IconButton label={enabled ? "Turn sound off" : "Turn sound on"} onClick={toggle}>
        <Icon name={enabled ? "sound" : "mute"} />
      </IconButton>
    </header>
  );
}
