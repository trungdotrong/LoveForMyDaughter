/** Soft sky, clouds and hills behind the Home and Login screens. */
export function Backdrop() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 -z-10 size-full"
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <rect width="400" height="800" fill="#e4f6ff" />
      <circle cx="330" cy="90" r="42" fill="#fff4c4" />
      <circle cx="330" cy="90" r="30" fill="#ffe27a" />
      {[[40, 140], [230, 220], [90, 330]].map(([x, y], i) => (
        <g key={i} className="anim-drift" fill="#fff" style={{ animationDelay: `${i * 4}s` }}>
          <circle cx={x} cy={y} r="18" />
          <circle cx={x + 22} cy={y - 8} r="22" />
          <circle cx={x + 46} cy={y} r="16" />
          <rect x={x} y={y} width="46" height="16" />
        </g>
      ))}
      <path d="M0 640 Q120 560 240 620 T400 590 V800 H0 Z" fill="#c6eab5" />
      <path d="M0 700 Q200 640 400 700 V800 H0 Z" fill="#a8df90" />
    </svg>
  );
}
