const COLORS = ["#ff9fb6", "#ffe27a", "#8fd3ff", "#b9f0a8", "#cdb8ff", "#ffc48f"];

/** Lightweight CSS confetti. Positions are deterministic so render stays pure. */
export function Confetti({
  count = 36,
  loop = false,
  variant = "confetti",
}: {
  count?: number;
  loop?: boolean;
  variant?: "confetti" | "sparkles";
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const delay = ((i * 53) % 20) / 10;
        const duration = 2.6 + ((i * 17) % 10) / 6;
        const size = 8 + ((i * 7) % 8);
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              width: size,
              height: variant === "sparkles" ? size : size * 0.6,
              background: variant === "sparkles" ? "none" : color,
              color,
              borderRadius: variant === "sparkles" ? 0 : 3,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              animationIterationCount: loop ? "infinite" : 1,
              fontSize: size * 1.6,
              lineHeight: 1,
            }}
          >
            {variant === "sparkles" ? "★" : null}
          </span>
        );
      })}
    </div>
  );
}
