import { INK } from "@/components/art/Critter";

/** The giant (friendly) fish. Centered on 0,0, facing left; mouth at about (-56, 4). */
export function GiantFish({ happy }: { happy: boolean }) {
  return (
    <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
      <path d="M48 0 L88 -28 Q78 0 88 28 Z" fill="#ff8a3d" />
      <path d="M-14 -28 Q6 -56 32 -26 Z" fill="#ff8a3d" />
      <path d="M2 28 Q12 44 24 26 Z" fill="#ff8a3d" />
      <ellipse cx="0" cy="0" rx="58" ry="33" fill="#ffad5c" />
      <ellipse cx="-6" cy="13" rx="40" ry="14" fill="#ffe2bd" stroke="none" />
      <g fill="none" strokeWidth="1.8" opacity="0.55">
        {[4, 18, 32].map((x) => (
          <g key={x}>
            <path d={`M${x} -18 q8 7 0 14`} />
            <path d={`M${x + 7} -6 q8 7 0 14`} />
          </g>
        ))}
      </g>
      <path d="M-10 4 Q2 20 16 6 Z" fill="#ff9a4d" strokeWidth="2" />
      <circle cx="-32" cy="-9" r="9" fill="#fff" />
      <circle cx="-34" cy="-8" r="4.6" fill={INK} stroke="none" />
      <circle cx="-32.5" cy="-10" r="1.6" fill="#fff" stroke="none" />
      <ellipse cx="-24" cy="9" rx="6" ry="3.6" fill="#ff9fb6" stroke="none" opacity="0.8" />
      {happy ? (
        <path d="M-56 0 Q-48 16 -36 6 Z" fill="#8a4a6e" strokeWidth="2" />
      ) : (
        <ellipse cx="-55" cy="4" rx="4" ry="5" fill="#ff7a7a" strokeWidth="2" />
      )}
    </g>
  );
}
