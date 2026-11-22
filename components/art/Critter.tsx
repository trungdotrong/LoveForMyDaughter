import type { ReactNode } from "react";

/**
 * One shared, parametric animal so every character in every Theme has the
 * same flat picture-book style. Drawn in a 100x120 box, feet at y=118.
 */

export type Species =
  | "bunny"
  | "bear"
  | "fox"
  | "cat"
  | "panda"
  | "frog"
  | "owl"
  | "pig"
  | "mouse"
  | "lion"
  | "raccoon"
  | "duck"
  | "tiger"
  /** A kindly old farmer, drawn in the same round style as the animals. */
  | "farmer";

export type Accessory = "party-hat" | "bow" | "crown" | "flower" | "scarf" | "straw-hat" | "none";
export type Pose = "idle" | "wave" | "bounce" | "clap" | "cheer";
export type Mood = "happy" | "lonely" | "wow";

export const INK = "#4a4359";
const LINE = { stroke: INK, strokeWidth: 2.2, strokeLinejoin: "round" as const };
const CHEEK = "#ff9fb6";

/** `body` and `feet` default to `fur`; the farmer wears overalls and boots. */
const PALETTES: Record<Species, { fur: string; belly: string; inner: string; body?: string; feet?: string }> = {
  farmer: { fur: "#ffd9b8", belly: "#9cc4ee", inner: "#f0a98a", body: "#6f9fd8", feet: "#8a5a3c" },
  bunny: { fur: "#fffaf5", belly: "#ffe9ef", inner: "#ffc2d4" },
  bear: { fur: "#c8956a", belly: "#efcfab", inner: "#a8714a" },
  fox: { fur: "#f6a15b", belly: "#fff4e8", inner: "#fff4e8" },
  cat: { fur: "#cdbdf0", belly: "#f3edff", inner: "#ffc2d4" },
  panda: { fur: "#ffffff", belly: "#ffffff", inner: "#4a4359" },
  frog: { fur: "#9edb8c", belly: "#e6f7d9", inner: "#7cc46a" },
  owl: { fur: "#c4a283", belly: "#f4e6d2", inner: "#8c6f55" },
  pig: { fur: "#f9bfcb", belly: "#ffdbe3", inner: "#f497ab" },
  mouse: { fur: "#c9ccd8", belly: "#eef0f5", inner: "#ffc2d4" },
  lion: { fur: "#f7cd63", belly: "#fff0c4", inner: "#e9913f" },
  tiger: { fur: "#ffa449", belly: "#fff6ea", inner: "#fff6ea" },
  raccoon: { fur: "#b4b6c6", belly: "#eceef4", inner: "#5f6074" },
  duck: { fur: "#ffe27a", belly: "#fff3bf", inner: "#ff9f45" },
};

interface CritterProps {
  species: Species;
  accessory?: Accessory;
  pose?: Pose;
  mood?: Mood;
  /** Offsets idle animations so groups don't move in lockstep. */
  delay?: number;
}

export function Critter({
  species,
  accessory = "none",
  pose = "idle",
  mood = "happy",
  delay = 0,
}: CritterProps) {
  const p = PALETTES[species];
  const armFill = species === "panda" ? INK : species === "owl" ? p.inner : p.fur;
  return (
    <g className={`critter pose-${pose}`} style={{ animationDelay: `${delay}s` }}>
      <g {...LINE}>
        {species === "lion" && <Mane />}
        <Ears species={species} fur={p.fur} inner={p.inner} />
        <ellipse cx="50" cy="96" rx="25" ry="22" fill={species === "panda" ? INK : (p.body ?? p.fur)} />
        <ellipse cx="50" cy="100" rx="15" ry="14" fill={p.belly} stroke="none" />
        {species === "farmer" && <Overalls />}
        <ellipse cx="39" cy="116" rx="9" ry="5" fill={species === "duck" ? p.inner : (p.feet ?? p.fur)} />
        <ellipse cx="61" cy="116" rx="9" ry="5" fill={species === "duck" ? p.inner : (p.feet ?? p.fur)} />
        <g className="critter-arm critter-arm-l" style={{ animationDelay: `${delay}s` }}>
          <ellipse cx="27" cy="92" rx="6.5" ry="12" fill={armFill} />
        </g>
        <g className="critter-arm critter-arm-r" style={{ animationDelay: `${delay}s` }}>
          <ellipse cx="73" cy="92" rx="6.5" ry="12" fill={armFill} />
        </g>
        <circle cx="50" cy="50" r="30" fill={p.fur} />
        {species === "frog" && (
          <>
            <circle cx="36" cy="26" r="11" fill={p.fur} />
            <circle cx="64" cy="26" r="11" fill={p.fur} />
          </>
        )}
      </g>
      <Face species={species} mood={mood} belly={p.belly} inner={p.inner} />
      <AccessoryShape accessory={accessory} />
    </g>
  );
}

/** Bib straps and buttons over the farmer's shirt. */
function Overalls() {
  return (
    <g stroke={INK} strokeWidth="1.8">
      <path d="M38 78 L42 92 M62 78 L58 92" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="92" r="2.2" fill="#ffe27a" />
      <circle cx="58" cy="92" r="2.2" fill="#ffe27a" />
    </g>
  );
}

function Mane() {
  const puffs: ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    puffs.push(
      <circle
        key={i}
        cx={50 + Math.cos(a) * 30}
        cy={50 + Math.sin(a) * 30}
        r="12"
        fill="#ec9a48"
      />,
    );
  }
  return <g>{puffs}</g>;
}

function Ears({ species, fur, inner }: { species: Species; fur: string; inner: string }) {
  switch (species) {
    case "bunny":
      return (
        <>
          <ellipse cx="38" cy="16" rx="8" ry="21" fill={fur} transform="rotate(-8 38 16)" />
          <ellipse cx="62" cy="16" rx="8" ry="21" fill={fur} transform="rotate(8 62 16)" />
          <ellipse cx="38" cy="18" rx="3.5" ry="14" fill={inner} stroke="none" transform="rotate(-8 38 18)" />
          <ellipse cx="62" cy="18" rx="3.5" ry="14" fill={inner} stroke="none" transform="rotate(8 62 18)" />
        </>
      );
    case "bear":
    case "panda":
    case "lion":
    case "tiger":
      return (
        <>
          <circle cx="27" cy="27" r="10" fill={species === "panda" ? INK : fur} />
          <circle cx="73" cy="27" r="10" fill={species === "panda" ? INK : fur} />
          {species !== "panda" && (
            <>
              <circle cx="27" cy="27" r="5" fill={inner} stroke="none" />
              <circle cx="73" cy="27" r="5" fill={inner} stroke="none" />
            </>
          )}
        </>
      );
    case "mouse":
      return (
        <>
          <circle cx="22" cy="30" r="15" fill={fur} />
          <circle cx="78" cy="30" r="15" fill={fur} />
          <circle cx="22" cy="30" r="9" fill={inner} stroke="none" />
          <circle cx="78" cy="30" r="9" fill={inner} stroke="none" />
        </>
      );
    case "fox":
    case "cat":
    case "raccoon":
      return (
        <>
          <path d="M23 40 L27 8 L48 25 Z" fill={fur} />
          <path d="M77 40 L73 8 L52 25 Z" fill={fur} />
          <path d="M29 32 L30 16 L41 25 Z" fill={inner} stroke="none" />
          <path d="M71 32 L70 16 L59 25 Z" fill={inner} stroke="none" />
        </>
      );
    case "pig":
      return (
        <>
          <path d="M26 34 L26 14 L44 24 Z" fill={fur} />
          <path d="M74 34 L74 14 L56 24 Z" fill={fur} />
        </>
      );
    case "owl":
      return (
        <>
          <path d="M28 30 L24 12 L42 22 Z" fill={inner} />
          <path d="M72 30 L76 12 L58 22 Z" fill={inner} />
        </>
      );
    case "duck":
      return <path d="M50 21 Q46 10 52 8 Q50 14 56 12 Q54 18 50 21 Z" fill={fur} />;
    case "frog":
      return null;
    case "farmer":
      // Small round ears with tufts of white hair above them.
      return (
        <>
          <circle cx="20" cy="54" r="7" fill={fur} />
          <circle cx="80" cy="54" r="7" fill={fur} />
          <ellipse cx="24" cy="40" rx="7" ry="9" fill="#f4f1ec" />
          <ellipse cx="76" cy="40" rx="7" ry="9" fill="#f4f1ec" />
        </>
      );
  }
}

function Eye({ x, y, r = 4.2 }: { x: number; y: number; r?: number }) {
  return (
    <g className="critter-eye">
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x + r * 0.3} cy={y - r * 0.35} r={r * 0.33} fill="#fff" />
    </g>
  );
}

function Mouth({ mood, y = 63 }: { mood: Mood; y?: number }) {
  if (mood === "wow") return <ellipse cx="50" cy={y + 2} rx="3.2" ry="4" fill={INK} />;
  if (mood === "lonely")
    return <path d={`M45 ${y + 3} Q50 ${y} 55 ${y + 3}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
  return <path d={`M44 ${y} Q50 ${y + 6} 56 ${y}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
}

function Face({ species, mood, belly, inner }: { species: Species; mood: Mood; belly: string; inner: string }) {
  const brows =
    mood === "lonely" ? (
      <g stroke={INK} strokeWidth="1.8" strokeLinecap="round">
        <path d="M34 42 L42 40" />
        <path d="M66 42 L58 40" />
      </g>
    ) : null;
  const cheeks = (
    <>
      <ellipse cx="32" cy="60" rx="5" ry="3.2" fill={CHEEK} opacity="0.75" />
      <ellipse cx="68" cy="60" rx="5" ry="3.2" fill={CHEEK} opacity="0.75" />
    </>
  );
  const whiskers = (
    <g stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity="0.6">
      <path d="M22 56 L33 58" />
      <path d="M22 62 L33 61" />
      <path d="M78 56 L67 58" />
      <path d="M78 62 L67 61" />
    </g>
  );

  switch (species) {
    case "frog":
      return (
        <g>
          <circle cx="36" cy="26" r="6" fill="#fff" />
          <circle cx="64" cy="26" r="6" fill="#fff" />
          <Eye x={36} y={27} r={3.6} />
          <Eye x={64} y={27} r={3.6} />
          {cheeks}
          {mood === "wow" ? (
            <Mouth mood="wow" y={60} />
          ) : (
            <path d="M34 58 Q50 72 66 58" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          )}
        </g>
      );
    case "owl":
      return (
        <g>
          <circle cx="38" cy="47" r="10" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="62" cy="47" r="10" fill="#fff" stroke={INK} strokeWidth="2" />
          <Eye x={38} y={48} r={5} />
          <Eye x={62} y={48} r={5} />
          <path d="M45 57 L55 57 L50 65 Z" fill="#ffb347" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          {cheeks}
        </g>
      );
    case "duck":
      return (
        <g>
          {brows}
          <Eye x={39} y={47} />
          <Eye x={61} y={47} />
          {cheeks}
          <ellipse cx="50" cy="60" rx="12" ry="6" fill={inner} stroke={INK} strokeWidth="2" />
          <path d="M40 60 Q50 63 60 60" fill="none" stroke={INK} strokeWidth="1.4" />
        </g>
      );
    case "pig":
      return (
        <g>
          {brows}
          <Eye x={38} y={47} />
          <Eye x={62} y={47} />
          {cheeks}
          <ellipse cx="50" cy="59" rx="10" ry="7" fill={inner} stroke={INK} strokeWidth="2" />
          <ellipse cx="46.5" cy="59" rx="1.8" ry="2.6" fill={INK} />
          <ellipse cx="53.5" cy="59" rx="1.8" ry="2.6" fill={INK} />
          <Mouth mood={mood} y={69} />
        </g>
      );
    case "panda":
      return (
        <g>
          <ellipse cx="38" cy="50" rx="7.5" ry="9.5" fill={INK} transform="rotate(20 38 50)" />
          <ellipse cx="62" cy="50" rx="7.5" ry="9.5" fill={INK} transform="rotate(-20 62 50)" />
          <circle cx="38.5" cy="50" r="2.6" fill="#fff" />
          <circle cx="61.5" cy="50" r="2.6" fill="#fff" />
          {cheeks}
          <ellipse cx="50" cy="59" rx="4" ry="3" fill={INK} />
          <Mouth mood={mood} y={64} />
        </g>
      );
    case "raccoon":
      return (
        <g>
          <path d="M22 50 Q36 38 50 48 Q64 38 78 50 Q64 60 50 54 Q36 60 22 50 Z" fill={inner} />
          <circle cx="38" cy="50" r="5" fill="#fff" />
          <circle cx="62" cy="50" r="5" fill="#fff" />
          <Eye x={38} y={50} r={3.4} />
          <Eye x={62} y={50} r={3.4} />
          <ellipse cx="50" cy="60" rx="3.6" ry="2.8" fill={INK} />
          {cheeks}
          <Mouth mood={mood} y={64} />
        </g>
      );
    case "fox":
      return (
        <g>
          <path d="M21 56 Q34 50 50 62 Q66 50 79 56 Q70 80 50 80 Q30 80 21 56 Z" fill={belly} />
          {brows}
          <Eye x={38} y={48} />
          <Eye x={62} y={48} />
          {cheeks}
          <ellipse cx="50" cy="61" rx="3.6" ry="2.8" fill={INK} />
          <Mouth mood={mood} y={66} />
        </g>
      );
    case "farmer":
      return (
        <g>
          {brows}
          <Eye x={39} y={47} r={3.6} />
          <Eye x={61} y={47} r={3.6} />
          {cheeks}
          <ellipse cx="50" cy="56" rx="5.5" ry="4.5" fill={inner} stroke={INK} strokeWidth="1.8" />
          {/* Big friendly white mustache */}
          <path
            d="M50 61 Q42 58 34 63 Q38 69 45 66 Q48 65 50 63 Q52 65 55 66 Q62 69 66 63 Q58 58 50 61 Z"
            fill="#f4f1ec"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {mood === "wow" ? <ellipse cx="50" cy="72" rx="3" ry="3.6" fill={INK} /> : <Mouth mood={mood} y={70} />}
        </g>
      );
    case "bear":
    case "lion":
    case "tiger":
      return (
        <g>
          {species === "tiger" && (
            <g fill={INK} opacity="0.8">
              <path d="M44 22 Q50 30 56 22 Q50 26 44 22 Z" />
              <path d="M38 25 Q42 33 46 27 Z" />
              <path d="M62 25 Q58 33 54 27 Z" />
              <path d="M21 46 Q28 48 30 52 Q26 50 21 50 Z" />
              <path d="M79 46 Q72 48 70 52 Q74 50 79 50 Z" />
            </g>
          )}
          <ellipse cx="50" cy="62" rx="12" ry="9" fill={belly} />
          {brows}
          <Eye x={38} y={47} />
          <Eye x={62} y={47} />
          {cheeks}
          <ellipse cx="50" cy="58" rx="4.2" ry="3.2" fill={INK} />
          <Mouth mood={mood} y={64} />
        </g>
      );
    default:
      // bunny, cat, mouse
      return (
        <g>
          {brows}
          <Eye x={39} y={49} />
          <Eye x={61} y={49} />
          {cheeks}
          {species !== "bunny" && whiskers}
          <path d="M47 56 L53 56 L50 59.5 Z" fill="#ff8fa8" />
          {mood === "happy" ? (
            <path
              d="M44.5 61 Q47.3 65 50 61 Q52.7 65 55.5 61"
              fill="none"
              stroke={INK}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <Mouth mood={mood} y={62} />
          )}
        </g>
      );
  }
}

function AccessoryShape({ accessory }: { accessory: Accessory }) {
  switch (accessory) {
    case "party-hat":
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path d="M37 26 L52 -6 L64 24 Z" fill="#8fd3ff" />
          <circle cx="47" cy="10" r="2.2" fill="#ffe27a" stroke="none" />
          <circle cx="55" cy="16" r="2.2" fill="#ff9fb6" stroke="none" />
          <circle cx="47" cy="20" r="2.2" fill="#fff" stroke="none" />
          <circle cx="52" cy="-7" r="4.5" fill="#ffe27a" />
        </g>
      );
    case "bow":
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round" transform="translate(66 28) rotate(15)">
          <path d="M0 0 L-11 -7 L-11 7 Z" fill="#ff8fb1" />
          <path d="M0 0 L11 -7 L11 7 Z" fill="#ff8fb1" />
          <circle r="3.6" fill="#ffb8cc" />
        </g>
      );
    case "crown":
      return (
        <path
          d="M34 26 L36 8 L44 18 L50 4 L56 18 L64 8 L66 26 Z"
          fill="#ffd84d"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "flower":
      return (
        <g transform="translate(68 26)">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={Math.cos((a * Math.PI) / 180) * 5}
              cy={Math.sin((a * Math.PI) / 180) * 5}
              r="4.2"
              fill="#ffb3c7"
              stroke={INK}
              strokeWidth="1.4"
            />
          ))}
          <circle r="3" fill="#ffe27a" stroke={INK} strokeWidth="1.4" />
        </g>
      );
    case "scarf":
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <rect x="30" y="74" width="40" height="9" rx="4.5" fill="#ff8f8f" />
          <rect x="56" y="78" width="9" height="18" rx="4" fill="#ff8f8f" />
        </g>
      );
    case "straw-hat":
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <ellipse cx="50" cy="26" rx="40" ry="8" fill="#f3cf6b" />
          <path d="M30 26 Q30 2 50 2 Q70 2 70 26 Z" fill="#f7da82" />
          <path d="M31 20 Q50 25 69 20 L69.6 25 Q50 30 30.4 25 Z" fill="#ff7a7a" />
        </g>
      );
    case "none":
      return null;
  }
}

/** Positions a critter inside a larger SVG scene by its feet (x, y). */
/** A one-shot reaction (e.g. to a tap). A new `key` replays the animation. */
export interface CritterReaction {
  key: number;
  className?: string;
  delay?: number;
}

export function PlacedCritter({
  x,
  y,
  scale,
  className,
  reaction,
  tilt = 0,
  ...critter
}: CritterProps & {
  x: number;
  y: number;
  scale: number;
  className?: string;
  reaction?: CritterReaction;
  /** Degrees to lean around the feet; negative leans left (e.g. pulling a rope). */
  tilt?: number;
}) {
  return (
    <g transform={`translate(${x - 50 * scale} ${y - 118 * scale}) scale(${scale}) rotate(${tilt} 50 118)`}>
      <g className={className}>
        <g
          key={reaction?.key ?? 0}
          className={reaction?.className ? `tap-react ${reaction.className}` : undefined}
          style={reaction?.delay ? { animationDelay: `${reaction.delay}s` } : undefined}
        >
          <Critter {...critter} />
        </g>
      </g>
    </g>
  );
}

/** A standalone critter, for use outside scenes. */
export function CritterIcon({ className, ...critter }: CritterProps & { className?: string }) {
  return (
    <svg viewBox="-6 -14 112 136" className={className} aria-hidden="true">
      <Critter {...critter} />
    </svg>
  );
}
