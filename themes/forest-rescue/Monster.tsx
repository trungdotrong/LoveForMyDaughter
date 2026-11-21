import { INK } from "@/components/art/Critter";

/** Wobble, the silly (never scary) forest monster. Drawn in a 140x140 box, feet at y=136. */
export function Monster({ happy }: { happy: boolean }) {
  return (
    <g className="anim-wobble">
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M44 46 Q30 14 50 24 Z" fill="#ffe9a8" />
        <path d="M96 46 Q110 14 90 24 Z" fill="#ffe9a8" />
        <ellipse cx="52" cy="132" rx="15" ry="7" fill="#a68cf0" />
        <ellipse cx="88" cy="132" rx="15" ry="7" fill="#a68cf0" />
        <ellipse cx="24" cy="94" rx="9" ry="15" fill="#b9a3f5" transform="rotate(20 24 94)" />
        <ellipse cx="116" cy="94" rx="9" ry="15" fill="#b9a3f5" transform="rotate(-20 116 94)" />
        <circle cx="70" cy="82" r="48" fill="#b9a3f5" />
        <path d="M58 36 q4 -12 10 -2 q4 -12 10 -1" fill="#b9a3f5" />
      </g>
      <ellipse cx="70" cy="102" rx="28" ry="22" fill="#d9cbff" />
      <circle cx="36" cy="74" r="4" fill="#a68cf0" />
      <circle cx="104" cy="104" r="5" fill="#a68cf0" />
      <circle cx="110" cy="66" r="3" fill="#a68cf0" />

      <circle cx="54" cy="70" r="13" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <circle cx="86" cy="70" r="13" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <circle cx="51" cy="72" r="6" fill={INK} />
      <circle cx="83" cy="72" r="6" fill={INK} />
      <circle cx="53" cy="69.5" r="2" fill="#fff" />
      <circle cx="85" cy="69.5" r="2" fill="#fff" />

      {happy ? (
        <>
          <ellipse cx="38" cy="90" rx="7" ry="4.5" fill="#ff9fb6" opacity="0.8" />
          <ellipse cx="102" cy="90" rx="7" ry="4.5" fill="#ff9fb6" opacity="0.8" />
          <path d="M52 94 Q70 116 88 94 Z" fill="#8a4a6e" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          {[40, 56, 72, 88, 104].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i % 2 ? 36 : 40})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle
                  key={a}
                  cx={Math.cos((a * Math.PI) / 180) * 4.5}
                  cy={Math.sin((a * Math.PI) / 180) * 4.5}
                  r="3.8"
                  fill={["#ffb3c7", "#ffe27a", "#8fd3ff"][i % 3]}
                  stroke={INK}
                  strokeWidth="1.2"
                />
              ))}
              <circle r="2.6" fill="#fff" />
            </g>
          ))}
        </>
      ) : (
        <>
          <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
            <path d="M42 52 L60 56" />
            <path d="M98 52 L80 56" />
          </g>
          <path d="M54 96 Q70 108 86 96" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M70 101 q0 12 8 12 q8 0 6 -14" fill="#ff8fb1" stroke={INK} strokeWidth="2" />
        </>
      )}
    </g>
  );
}
