import { TOTAL_SETS } from "@/lib/alphabet";

/** One dot per Set; filled dots are completed Sets. */
export function ProgressIndicator({
  completed,
  color,
  className = "",
}: {
  completed: number;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={TOTAL_SETS}
      aria-valuenow={completed}
      aria-label={`${completed} of ${TOTAL_SETS} sets done`}
    >
      {Array.from({ length: TOTAL_SETS }, (_, i) => (
        <span
          key={i}
          className="h-3 flex-1 rounded-full"
          style={{ background: i < completed ? color : "#efe6da" }}
        />
      ))}
    </div>
  );
}
