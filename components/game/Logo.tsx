const BLOCKS = [
  { ch: "A", bg: "#ff9fb6", rot: -8 },
  { ch: "B", bg: "#8fd3ff", rot: 5 },
  { ch: "C", bg: "#ffe27a", rot: -4 },
];

export function Logo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        {BLOCKS.map((b, i) => (
          <span key={b.ch} className="ui-float block" style={{ animationDelay: `${i * 0.4}s` }}>
            <span
              className="grid size-16 place-items-center rounded-2xl text-5xl font-bold text-ink shadow-[0_6px_0_rgba(74,67,89,0.2)] sm:size-20 sm:text-6xl"
              style={{ background: b.bg, transform: `rotate(${b.rot}deg)` }}
            >
              {b.ch}
            </span>
          </span>
        ))}
      </div>
      <h1 className="mt-3 text-4xl font-bold tracking-wide text-ink sm:text-5xl">Adventure</h1>
    </div>
  );
}
