import { Icon } from "../ui/Icon";

export function LetterCard({
  letter,
  found,
  review = false,
  accent,
}: {
  letter: string;
  found: boolean;
  review?: boolean;
  accent: string;
}) {
  return (
    <div
      className={`relative flex aspect-[4/5] flex-1 flex-col items-center justify-center rounded-3xl bg-white transition-colors ${found ? "ui-bounce-in" : ""}`}
      style={{
        background: found ? "#e3f8dc" : "#fff",
        border: review && !found ? `4px dashed ${accent}` : "4px solid #fff",
        boxShadow: `0 7px 0 ${found ? "#bfe6b2" : "#efe3d3"}`,
      }}
      aria-label={`${letter}${found ? ", found" : ""}${review ? ", memory letter" : ""}`}
    >
      {review && (
        <span className="absolute -top-3 rounded-full px-2.5 py-0.5 text-sm font-semibold text-white" style={{ background: accent }}>
          ★ Memory
        </span>
      )}
      <span className="text-7xl font-bold leading-none sm:text-8xl" style={{ color: found ? "#3f9a52" : accent }}>
        {letter}
      </span>
      <span className="mt-1 text-2xl font-medium text-ink-soft">{letter.toLowerCase()}</span>
      {found && (
        <span className="absolute -right-2 -top-2 grid size-10 place-items-center rounded-full bg-[#4cbf6a] text-white shadow ui-bounce-in">
          <Icon name="check" className="size-6" />
        </span>
      )}
    </div>
  );
}
