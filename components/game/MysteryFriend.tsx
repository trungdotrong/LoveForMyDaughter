import { CritterIcon } from "@/components/art/Critter";
import type { Character, ThemeColors } from "@/themes/types";
import { Icon } from "../ui/Icon";

/** The friend drawn as a dark shape; `clarity` 0–1 makes it easier to make out. */
export function FriendSilhouette({
  character,
  clarity = 0,
  className = "",
}: {
  character: Character;
  clarity?: number;
  className?: string;
}) {
  return (
    <div
      className={`transition-[filter,opacity] duration-700 ${className}`}
      style={{ filter: `brightness(0) blur(${(1 - clarity) * 1.5}px)`, opacity: 0.22 + clarity * 0.3 }}
    >
      <CritterIcon species={character.species} accessory={character.accessory} className="size-full" />
    </div>
  );
}

export function LockBadge({ colors, className = "" }: { colors: ThemeColors; className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-full text-white ${className}`}
      style={{ background: colors.accent, boxShadow: `0 4px 0 ${colors.accentDark}` }}
    >
      <Icon name="lock" className="size-3/5" />
    </span>
  );
}

/** Shown while hunting letters: who the child is about to unlock. */
export function MysteryFriendCard({
  character,
  mission,
  found,
  total,
  colors,
}: {
  character: Character;
  mission: string;
  found: number;
  total: number;
  colors: ThemeColors;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-3 pr-4 shadow-[0_6px_0_#efe3d3]">
      <div className="relative h-28 w-24 shrink-0 rounded-2xl" style={{ background: colors.soft }}>
        <FriendSilhouette character={character} clarity={found / total} className="absolute inset-1" />
        <span className="absolute inset-0 grid place-items-center text-4xl font-bold text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]">
          ?
        </span>
        <LockBadge colors={colors} className="absolute -bottom-2 -right-2 size-10" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: colors.accentDark }}>
          Mystery friend
        </p>
        <p className="mt-0.5 text-lg leading-snug">{mission}</p>
        <div className="mt-2 flex gap-1.5" aria-label={`${found} of ${total} letters found`}>
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className="h-2.5 flex-1 rounded-full transition-colors duration-500"
              style={{ background: i < found ? colors.accent : "#efe3d3" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
