"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { INK, PlacedCritter, type CritterReaction, type Pose } from "@/components/art/Critter";
import { useSound } from "@/hooks/useSound";
import type { SceneProps } from "../types";
import { FARMER, HELPERS } from "./characters";
import { GiantFish } from "./GiantFish";

/** Taps needed in the finale before the fish finally comes out. */
export const PULLS_NEEDED = 8;
/** If nobody taps in the finale, the fish comes out by itself after this long. */
const AUTO_CATCH_MS = 25000;

const SURFACE_Y = 232;
const FISH = { x: 384, y: 286 };
const FARMER_SPOT = { x: 282, y: 292, s: 0.66 };
/** Where the farmer's hands hold the rod. */
const HANDS = { x: 297, y: 274 };
const ROD_TIP = { x: 356, y: 138 };
/** Helpers line up behind the farmer along the rope, closest first. */
const helperSpot = (i: number) => ({ x: 248 - i * 27, y: 294, s: i === 8 ? 0.42 : 0.56 });
const HAND_Y = 277;
const LEAN = -14;

const SHOUTS = ["Heave-ho!", "So heavy!", "Almost!", "Pull harder!", "Whoa!"];
const DROPS = [
  [-34, -40], [-16, -58], [0, -66], [18, -56], [34, -38], [-46, -18], [46, -20],
] as const;

const vars = (v: Record<string, string>) => v as CSSProperties;

export function FishScene({ stage, mode = "normal", poke = 0, className }: SceneProps) {
  const finale = mode === "finale";
  const { play } = useSound();

  // Finale: every tap lifts the fish a little; enough taps (or waiting) lands it.
  const [autoCaught, setAutoCaught] = useState(false);
  useEffect(() => {
    if (!finale) return;
    const t = setTimeout(() => setAutoCaught(true), AUTO_CATCH_MS);
    return () => clearTimeout(t);
  }, [finale]);
  const lift = finale ? Math.min(poke, PULLS_NEEDED) : 0;
  const caught = finale && (lift >= PULLS_NEEDED || autoCaught);

  // Before the finale a tap is a big pull: the fish peeks up, then slips back. Splash!
  const tugging = poke > 0 && !caught;
  useEffect(() => {
    if (poke === 0) return;
    play("heave");
    if (finale) return;
    const t = setTimeout(() => play("splash"), 650);
    return () => clearTimeout(t);
  }, [poke, finale, play]);
  useEffect(() => {
    if (!caught) return;
    play("splash");
    const t = setTimeout(() => play("chime"), 300);
    return () => clearTimeout(t);
  }, [caught, play]);

  const helpers = HELPERS.slice(0, finale ? HELPERS.length : stage);
  const newest = mode === "arrival" ? stage - 1 : -1;
  const pose = (i: number): Pose => (caught ? "cheer" : i === newest ? "wave" : "idle");
  const reaction = (order: number): CritterReaction | undefined => {
    if (caught) return { key: -1, className: "react-tumble", delay: order * 0.05 };
    if (poke > 0) return { key: poke, className: "react-heave", delay: order * 0.04 };
    return undefined;
  };
  const tilt = caught ? 0 : LEAN;

  const fishLift = caught ? "translate(-10px, -168px)" : `translateY(${-lift * 7}px)`;
  const ropeStart = helpers.length > 0 ? helperSpot(helpers.length - 1).x - 12 : null;

  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-label="The giant fish pond">
      {/* Sky and hills */}
      <rect width="480" height="320" fill="#d3efff" />
      <circle cx="420" cy="52" r="28" fill="#fff6c9" />
      <circle cx="420" cy="52" r="20" fill="#ffe17a" />
      {[[70, 46], [230, 30]].map(([x, y], i) => (
        <g key={x} className="anim-drift" style={{ animationDelay: `${i * 4}s` }} fill="#fff">
          <circle cx={x} cy={y} r="13" />
          <circle cx={x + 15} cy={y - 6} r="16" />
          <circle cx={x + 32} cy={y} r="12" />
          <rect x={x} y={y} width="32" height="12" />
        </g>
      ))}
      <path d="M0 176 Q90 130 200 168 T480 150 V230 H0 Z" fill="#c6eab5" />

      {/* Pond (behind the fish) */}
      <rect x="250" y={SURFACE_Y} width="230" height="88" fill="#7cc7ee" />

      {/* The giant fish */}
      <g style={{ transform: fishLift, transition: "transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1)" }}>
        <g transform={`translate(${FISH.x} ${FISH.y})`}>
          <g key={caught ? "caught" : poke} className={caught ? "fish-bob" : tugging && !finale ? "fish-tug" : tugging ? "fish-wiggle" : undefined}>
            <GiantFish happy={caught} />
          </g>
        </g>
      </g>

      {/* Water in front of the fish, so it looks submerged */}
      <rect x="250" y={SURFACE_Y} width="230" height="88" fill="#3f9fd8" opacity="0.38" />
      <path
        d={`M250 ${SURFACE_Y} q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0`}
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        opacity="0.85"
      />
      {[[312, 268], [460, 300], [372, 312]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="none" stroke="#fff" strokeWidth="1.6" className="anim-float" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}

      {/* Grassy bank in front */}
      <path d={`M0 222 Q150 212 308 ${SURFACE_Y - 2} Q322 278 312 320 H0 Z`} fill="#a8df90" stroke={INK} strokeWidth="2" />
      {[[310, 248], [318, 276], [16, 240]].map(([x, y], i) => (
        <g key={i} stroke="#5fae5a" strokeWidth="3" strokeLinecap="round">
          <path d={`M${x} ${y} q-4 -14 -2 -24`} fill="none" />
          <path d={`M${x + 5} ${y} q2 -12 6 -20`} fill="none" />
        </g>
      ))}

      {/* Fishing rod: bends harder the more friends pull */}
      {!caught && (
        <>
          <path
            d={`M${HANDS.x} ${HANDS.y} Q${322 + helpers.length * 2} ${180 - helpers.length * 2} ${ROD_TIP.x} ${ROD_TIP.y}`}
            fill="none"
            stroke="#8a5a3c"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line x1={ROD_TIP.x} y1={ROD_TIP.y} x2={FISH.x - 52} y2={SURFACE_Y} stroke="#fff" strokeWidth="1.6" />
        </>
      )}

      {/* The pulling line: helpers behind the farmer */}
      {helpers
        .map((h, i) => ({ h, i, spot: helperSpot(i) }))
        .reverse()
        .map(({ h, i, spot }) => (
          <PlacedCritter
            key={h.id}
            x={spot.x}
            y={spot.y}
            scale={spot.s}
            species={h.species}
            accessory={h.accessory}
            pose={pose(i)}
            delay={i * 0.2}
            tilt={tilt}
            className={i === newest ? "anim-arrive" : undefined}
            reaction={reaction(i + 1)}
          />
        ))}
      <PlacedCritter
        x={FARMER_SPOT.x}
        y={FARMER_SPOT.y}
        scale={FARMER_SPOT.s}
        species={FARMER.species}
        accessory={FARMER.accessory}
        mood={caught ? "happy" : helpers.length === 0 ? "wow" : "happy"}
        pose={caught ? "cheer" : "idle"}
        tilt={tilt}
        reaction={reaction(0)}
      />
      {ropeStart !== null && !caught && (
        <path
          d={`M${ropeStart} ${HAND_Y + 2} Q${(ropeStart + HANDS.x) / 2} ${HAND_Y + 8} ${HANDS.x - 6} ${HANDS.y}`}
          fill="none"
          stroke="#c99a5e"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Splash where the fish slips back (or bursts out) */}
      {(tugging && !finale) || caught ? (
        <g key={`splash-${caught ? "caught" : poke}`} transform={`translate(${FISH.x - 20} ${SURFACE_Y})`}>
          {DROPS.map(([dx, dy], i) => (
            <circle
              key={i}
              r={caught ? 6 : 4.5}
              fill="#bfe6ff"
              stroke="#fff"
              strokeWidth="1.4"
              className={caught ? "splash-drop now" : "splash-drop"}
              style={vars({ "--dx": `${dx * (caught ? 1.6 : 1)}px`, "--dy": `${dy * (caught ? 1.6 : 1)}px` })}
            />
          ))}
        </g>
      ) : null}

      {/* The farmer shouts with each pull */}
      {tugging && !finale && (
        <g key={`shout-${poke}`} className="say-bubble">
          <rect x="214" y="150" width="96" height="26" rx="13" fill="#fff" stroke={INK} strokeWidth="2" />
          <path d="M264 175 l6 10 l4 -10 Z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <text x="262" y="168" textAnchor="middle" fontSize="13" fontWeight="700" fill="#21709f">
            {SHOUTS[(poke - 1) % SHOUTS.length]}
          </text>
        </g>
      )}

      {/* Finale pull meter */}
      {finale && (
        <g>
          <rect x="150" y="12" width="180" height="34" rx="17" fill="#fff" stroke={INK} strokeWidth="2" />
          <rect
            x="156"
            y="18"
            width={168 * (caught ? 1 : lift / PULLS_NEEDED)}
            height="22"
            rx="11"
            fill={caught ? "#4cbf6a" : "#3a9ad9"}
            style={{ transition: "width 0.35s ease" }}
          />
          <text x="240" y="34.5" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
            {caught ? "Hooray! We did it!" : lift === 0 ? "Tap tap tap to pull!" : `Pull! ${lift} / ${PULLS_NEEDED}`}
          </text>
        </g>
      )}

      {caught &&
        [[300, 70], [460, 96], [330, 40], [440, 30]].map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3} Z`}
            fill="#ffe27a"
            className="anim-twinkle"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
    </svg>
  );
}
