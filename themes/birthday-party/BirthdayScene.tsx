"use client";

import { useEffect } from "react";
import { INK, PlacedCritter, type CritterReaction, type Pose } from "@/components/art/Critter";
import { useSound } from "@/hooks/useSound";
import type { SceneProps } from "../types";
import { BIRTHDAY_FRIENDS, BUNNY } from "./characters";

const PASTELS = ["#8fd3ff", "#ffe27a", "#ff9fb6", "#b9f0a8", "#cdb8ff", "#ffc48f"];

/** Seats behind the table, filled in arrival order (inner seats first). */
const BACK_SEATS = [182, 298, 135, 345, 88, 392, 41, 439];
const BACK_Y = 222;
const FRONT_SEAT = { x: 240, y: 314 };

const BALLOONS = [
  [60, 100], [420, 100], [105, 72], [375, 72], [28, 140],
  [452, 140], [150, 104], [330, 104], [176, 126], [304, 126],
] as const;

const PRESENTS = [
  [72, 300], [408, 300], [122, 309], [358, 309], [28, 306], [452, 306], [168, 313], [312, 313],
] as const;

function bunting(t: number) {
  // Quadratic curve from (0,18) through control (240,78) to (480,18).
  const u = 1 - t;
  return { x: 2 * u * t * 240 + t * t * 480, y: u * u * 18 + 2 * u * t * 78 + t * t * 18 };
}

/** Each tap makes everyone do the next party move. */
const PARTY_MOVES = [
  { className: "react-jump", sound: "boing" },
  { className: "react-spin", sound: "chime" },
  { className: "react-dance", sound: "boing" },
] as const;

export function BirthdayScene({ stage, mode = "normal", poke = 0, className }: SceneProps) {
  const finale = mode === "finale";
  const move = poke > 0 ? PARTY_MOVES[(poke - 1) % PARTY_MOVES.length] : null;
  const { play } = useSound();
  useEffect(() => {
    if (poke > 0) play(PARTY_MOVES[(poke - 1) % PARTY_MOVES.length].sound);
  }, [poke, play]);
  /** Friends react one after another, like a wave around the table. */
  const react = (order: number): CritterReaction | undefined =>
    move ? { key: poke, className: move.className, delay: order * 0.06 } : undefined;
  const flags = finale ? 22 : Math.min(4 + stage * 2, 22);
  const balloons = finale ? BALLOONS.length : Math.min(stage + 1, BALLOONS.length);
  const presents = Math.min(stage, PRESENTS.length);

  const friendPose = (i: number): Pose => {
    if (finale) return "clap";
    if (mode === "arrival" && i === stage - 1) return "wave";
    return "idle";
  };
  const friendClass = (i: number) =>
    mode === "arrival" && i === stage - 1 ? "anim-arrive" : undefined;

  const lion = BIRTHDAY_FRIENDS[8];

  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-label="Bunny's birthday party">
      {/* Room */}
      <rect width="480" height="216" fill="#ffe6ee" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i % 10) * 50 + (Math.floor(i / 10) % 2) * 25 + 12} cy={Math.floor(i / 10) * 50 + 30} r="4" fill="#ffd3e0" />
      ))}
      <rect y="214" width="480" height="106" fill="#ffdcb8" />
      {[236, 262, 290].map((y) => (
        <line key={y} x1="0" x2="480" y1={y} y2={y} stroke="#f5c99c" strokeWidth="2" />
      ))}

      {/* Bunting grows with every friend */}
      <path d="M0 18 Q240 78 480 18" fill="none" stroke={INK} strokeWidth="2" />
      {Array.from({ length: flags }, (_, i) => {
        const { x, y } = bunting((i + 1) / (flags + 1));
        return (
          <path
            key={`${flags}-${i}`}
            d={`M${x - 9} ${y} L${x + 9} ${y} L${x} ${y + 18} Z`}
            fill={PASTELS[i % PASTELS.length]}
            stroke={INK}
            strokeWidth="1.6"
            strokeLinejoin="round"
            className="anim-pop"
          />
        );
      })}

      {/* Balloons */}
      {BALLOONS.slice(0, balloons).map(([x, y], i) => (
        <g key={i} className="anim-float" style={{ animationDelay: `${i * 0.37}s` }}>
          <path d={`M${x} ${y + 17} q-6 12 0 22 q6 10 0 20`} fill="none" stroke={INK} strokeWidth="1.3" />
          <ellipse cx={x} cy={y} rx="13" ry="16" fill={PASTELS[(i + 2) % PASTELS.length]} stroke={INK} strokeWidth="2" />
          <ellipse cx={x - 4} cy={y - 6} rx="3" ry="5" fill="#fff" opacity="0.6" />
          <path d={`M${x - 3} ${y + 17} L${x + 3} ${y + 17} L${x} ${y + 13} Z`} fill={INK} />
        </g>
      ))}

      {finale && (
        <g className="anim-pop">
          <rect x="140" y="58" width="200" height="30" rx="15" fill="#fff" stroke={INK} strokeWidth="2" />
          <text x="240" y="79" textAnchor="middle" fontSize="17" fontWeight="700" fill="#d9507b">
            HAPPY BIRTHDAY
          </text>
        </g>
      )}

      {/* Back row: chairs, friends sit as they arrive */}
      {BACK_SEATS.map((x, i) => (
        <g key={x}>
          <rect x={x - 18} y="168" width="36" height="40" rx="10" fill={PASTELS[i % PASTELS.length]} stroke={INK} strokeWidth="2" />
          {i < stage && (
            <PlacedCritter
              x={x}
              y={BACK_Y}
              scale={0.56}
              species={BIRTHDAY_FRIENDS[i].species}
              accessory={BIRTHDAY_FRIENDS[i].accessory}
              pose={friendPose(i)}
              delay={i * 0.3}
              className={friendClass(i)}
              reaction={react(i + 1)}
            />
          )}
        </g>
      ))}

      {/* Bunny's big chair and Bunny */}
      <rect x="208" y="88" width="64" height="122" rx="16" fill="#ffb3c9" stroke={INK} strokeWidth="2" />
      <path d="M240 108 c-8 -10 -20 0 -10 10 l10 9 l10 -9 c10 -10 -2 -20 -10 -10 Z" fill="#ff7aa2" />
      <PlacedCritter
        x={240}
        y={164}
        scale={0.6}
        species={BUNNY.species}
        accessory={BUNNY.accessory}
        mood={stage === 0 ? "lonely" : "happy"}
        pose={finale ? "cheer" : mode === "arrival" ? "bounce" : "idle"}
        reaction={react(0)}
      />

      {/* Table */}
      <rect x="14" y="204" width="452" height="42" fill="#c9ecff" stroke={INK} strokeWidth="2" />
      {Array.from({ length: 29 }, (_, i) => (
        <circle key={i} cx={14 + 8 + i * 15.6} cy="246" r="7.8" fill="#c9ecff" stroke={INK} strokeWidth="2" />
      ))}
      <rect x="15" y="236" width="450" height="10" fill="#c9ecff" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={30 + i * 32} cy="224" r="3" fill="#fff" />
      ))}

      {/* Cake */}
      <ellipse cx="240" cy="206" rx="46" ry="6" fill="#fff" stroke={INK} strokeWidth="2" />
      <rect x="206" y="182" width="68" height="24" rx="6" fill="#fff3d6" stroke={INK} strokeWidth="2" />
      <path d="M206 188 q8 8 17 0 q8 8 17 0 q8 8 17 0 q8 8 17 0 v-4 h-68 Z" fill="#ff9fb6" />
      <rect x="218" y="166" width="44" height="18" rx="5" fill="#ffd1df" stroke={INK} strokeWidth="2" />
      {[228, 240, 252].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="155" width="4" height="12" rx="1.5" fill={PASTELS[i]} stroke={INK} strokeWidth="1.2" />
          <ellipse cx={x} cy="151" rx="3" ry="4.5" fill="#ffcf4d" className="anim-flicker" style={{ animationDelay: `${i * 0.2}s` }} />
        </g>
      ))}

      {/* Presents brought by friends */}
      {PRESENTS.slice(0, presents).map(([x, y], i) => (
        <g key={i} className="anim-pop">
          <rect x={x - 14} y={y - 22} width="28" height="22" rx="3" fill={PASTELS[(i + 4) % PASTELS.length]} stroke={INK} strokeWidth="2" />
          <rect x={x - 2.5} y={y - 22} width="5" height="22" fill="#fff" />
          <path d={`M${x} ${y - 22} q-9 -9 -10 -1 Z M${x} ${y - 22} q9 -9 10 -1 Z`} fill="#fff" stroke={INK} strokeWidth="1.6" />
        </g>
      ))}

      {/* The last guest stands in front of the table */}
      {stage >= 9 && (
        <PlacedCritter
          x={FRONT_SEAT.x}
          y={FRONT_SEAT.y}
          scale={0.56}
          species={lion.species}
          accessory={lion.accessory}
          pose={friendPose(8)}
          className={friendClass(8)}
          reaction={react(9)}
        />
      )}

      {finale &&
        [[150, 140], [330, 140], [200, 120], [280, 120], [100, 170], [380, 170]].map(([x, y], i) => (
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
