"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGameSave } from "@/hooks/useGameProgress";
import { useSound } from "@/hooks/useSound";
import { restartSession } from "@/lib/game-engine";
import { getThemeProgress, withThemeProgress } from "@/lib/progress";
import { clearSave } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { THEMES } from "@/themes";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { IconButton } from "../ui/GameButton";
import { Icon } from "../ui/Icon";

type Pending = { kind: "restart"; themeId: string; title: string } | { kind: "clear" } | null;

const ROW =
  "flex w-full items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 text-left text-lg transition-colors hover:bg-[#fbefe0]";

/** Grown-up settings. Destructive actions go through a ConfirmDialog. */
export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { save, update } = useGameSave();
  const { enabled, toggle } = useSound();
  const [pending, setPending] = useState<Pending>(null);

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  function confirm() {
    if (pending?.kind === "restart") {
      update((s) => withThemeProgress(s, pending.themeId, restartSession(getThemeProgress(s, pending.themeId))));
    } else if (pending?.kind === "clear") {
      clearSave();
    }
    setPending(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center ui-fade-in" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white p-6 sm:rounded-[2rem] ui-slide-up">
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="text-2xl font-semibold">Grown-up settings</h2>
          <IconButton label="Close settings" onClick={onClose}>
            <Icon name="close" />
          </IconButton>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button type="button" className={ROW} onClick={toggle} aria-pressed={enabled}>
            <span className="flex items-center gap-3">
              <Icon name={enabled ? "sound" : "mute"} />
              Sound
            </span>
            <span className="rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ background: enabled ? "#4cbf6a" : "#b9b2c6" }}>
              {enabled ? "On" : "Off"}
            </span>
          </button>
          <Link href="/print" className={ROW}>
            <span className="flex items-center gap-3">
              <Icon name="printer" />
              Print alphabet QR cards
            </span>
            <Icon name="arrow" className="size-5" />
          </Link>
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Progress</h3>
        <div className="mt-2 flex flex-col gap-2">
          {THEMES.map((theme) => {
            const progress = save ? getThemeProgress(save, theme.id) : null;
            return (
              <button
                key={theme.id}
                type="button"
                className={ROW}
                onClick={() => setPending({ kind: "restart", themeId: theme.id, title: theme.title })}
              >
                <span>
                  Restart {theme.title}
                  {progress && (
                    <span className="block text-sm text-ink-soft">
                      Adventure #{progress.sessionNumber} · finished {progress.history.length}×
                    </span>
                  )}
                </span>
                <Icon name="replay" className="size-5" />
              </button>
            );
          })}
          <button type="button" className={`${ROW} text-[#d9507b]`} onClick={() => setPending({ kind: "clear" })}>
            Clear all progress
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <button type="button" className={`${ROW} mt-6`} onClick={signOut}>
          <span className="flex items-center gap-3">
            <Icon name="logout" />
            Sign out
          </span>
        </button>
      </div>

      {pending && (
        <ConfirmDialog
          title={pending.kind === "clear" ? "Clear all progress?" : `Restart ${pending.title}?`}
          message={
            pending.kind === "clear"
              ? "This removes every adventure and its history from this device."
              : "The current adventure starts over from the beginning. Finished adventures are kept."
          }
          confirmLabel={pending.kind === "clear" ? "Clear" : "Restart"}
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
