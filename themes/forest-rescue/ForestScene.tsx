"use client";

import { useEffect, useState } from "react";
import { INK, PlacedCritter, type Pose } from "@/components/art/Critter";
import type { SceneProps } from "../types";
import { OWL_GUIDE, RESCUE_TEAM } from "./characters";
import { Monster } from "./Monster";

/** Team formation slots, in joining order. Front row is bigger. */
const TEAM_SLOTS = [
  { x: 200, y: 304, s: 0.56 },
  { x: 145, y: 304, s: 0.56 },
  { x: 175, y: 262, s: 0.46 },
  { x: 90, y: 304, s: 0.56 },
  { x: 128, y: 262, s: 0.46 },
  { x: 222, y: 262, s: 0.46 },
  { x: 35, y: 304, s: 0.56 },
  { x: 81, y: 262, s: 0.46 },
  { x: 34, y: 262, s: 0.46 },
];

/** Hiding spot for each team member (same index). */
const BUSHES = [
  [262, 244], [306, 240], [350, 246], [284, 274], [334, 278],
  [378, 270], [258, 304], [312, 308], [366, 304],
] as const;

const TREES = [
  { x: 40, y: 128, r: 38, c: "#8fd18a" },
  { x: 130, y: 108, r: 34, c: "#a7dc8f" },
  { x: 300, y: 126, r: 30, c: "#8fd18a" },
  { x: 458, y: 118, r: 36, c: "#a7dc8f" },
];

export function ForestScene({ stage, mode = "normal", className }: SceneProps) {
  const finale = mode === "finale";
  // Finale beats: 0 = team marches, 1 = forest restored + Wobble smiles, 2 = everyone celebrates.
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    if (!finale) return;
    const t1 = setTimeout(() => setBeat(1), 1800);
    const t2 = setTimeout(() => setBeat(2), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [finale]);

  const restored = finale && beat >= 1;
  const together = finale && beat >= 2;

  const pose = (i: number): Pose => {
    if (finale) return beat === 0 ? "bounce" : "cheer";
    if (mode === "arrival" && i === stage - 1) return "wave";
    return "idle";
  };

  const members = TEAM_SLOTS.map((slot, i) => ({ slot, i }))
    .filter(({ i }) => i < stage)
    .sort((a, b) => a.slot.y - b.slot.y);

  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-label="The magic forest">
      <rect width="480" height="320" fill="#d6f2fc" />
      <circle cx="56" cy="48" r="30" fill="#fff6c9" />
      <circle cx="56" cy="48" r="22" fill="#ffe17a" />
      {[[190, 42], [340, 62]].map(([x, y], i) => (
        <g key={x} className="anim-drift" style={{ animationDelay: `${i * 3}s` }} fill="#fff">
          <circle cx={x} cy={y} r="14" />
          <circle cx={x + 16} cy={y - 6} r="17" />
          <circle cx={x + 34} cy={y} r="13" />
          <rect x={x} y={y} width="34" height="13" />
        </g>
      ))}

      <g className="fade" style={{ opacity: restored ? 1 : 0 }}>
        {["#ff9fb6", "#ffc48f", "#ffe27a", "#b9f0a8", "#8fd3ff", "#cdb8ff"].map((c, i) => (
          <path key={c} d={`M${40 + i * 10} 230 A${200 - i * 10} ${170 - i * 10} 0 0 1 ${440 - i * 10} 230`} fill="none" stroke={c} strokeWidth="10" />
        ))}
      </g>

      <path d="M0 190 Q100 140 220 175 T480 160 V320 H0 Z" fill="#c6eab5" />

      {TREES.map((t, i) => (
        <g key={t.x}>
          <rect x={t.x - 7} y={t.y} width="14" height={232 - t.y} rx="5" fill="#c8956a" stroke={INK} strokeWidth="2" />
          <circle cx={t.x} cy={t.y} r={t.r} fill={t.c} stroke={INK} strokeWidth="2" />
          <circle cx={t.x - t.r * 0.35} cy={t.y - t.r * 0.3} r={t.r * 0.25} fill="#fff" opacity="0.25" />
          {/* Wobble's paint splats, cleaned up in the finale */}
          <g className="fade" style={{ opacity: restored ? 0 : 1 }}>
            <circle cx={t.x + 8} cy={t.y + 6} r="7" fill={i % 2 ? "#ff8fb1" : "#b9a3f5"} />
            <circle cx={t.x + 15} cy={t.y + 12} r="3" fill={i % 2 ? "#ff8fb1" : "#b9a3f5"} />
          </g>
        </g>
      ))}

      <PlacedCritter x={130} y={86} scale={0.34} species={OWL_GUIDE.species} pose={finale ? "cheer" : "idle"} />

      <path d="M0 228 Q240 206 480 228 V320 H0 Z" fill="#a8df90" />

      {/* Mess: toppled pots and tangled yarn */}
      <g className="fade" style={{ opacity: restored ? 0 : 1 }} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M404 296 l22 -8 l6 18 l-22 8 Z" fill="#e9a07a" />
        <ellipse cx="398" cy="302" rx="10" ry="4" fill="#9b7653" stroke="none" />
        <path d="M444 262 c-14 -10 8 -18 4 -4 c-4 14 -18 -2 -4 -6 c12 -4 6 14 -4 8" fill="none" stroke="#ff8fb1" strokeWidth="3" />
        <path d="M232 230 l30 6 M240 238 l24 -8" stroke="#9b7653" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="fade" style={{ opacity: restored ? 1 : 0 }}>
        {[[410, 300], [448, 276], [236, 234], [470, 304], [20, 236]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect x="-1" y="0" width="2" height="12" fill="#5fae5a" />
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 4} cy={Math.sin((a * Math.PI) / 180) * 4} r="3.5" fill={["#ffb3c7", "#ffe27a", "#cdb8ff"][i % 3]} />
            ))}
            <circle r="2.4" fill="#fff" />
          </g>
        ))}
      </g>

      {/* Wobble the monster */}
      <g className="slide" style={{ transform: together ? "translateX(-70px)" : "none" }}>
        <g transform={`translate(${425 - 70 * 0.52} ${236 - 136 * 0.52}) scale(0.52)`}>
          <Monster happy={restored} />
        </g>
      </g>

      {/* Bushes: eyes peek out until that animal joins the team */}
      {BUSHES.map(([x, y], i) => (
        <g key={i}>
          <g fill={i % 2 ? "#7fcf7a" : "#74c46f"} stroke={INK} strokeWidth="2">
            <circle cx={x - 12} cy={y - 8} r="12" />
            <circle cx={x + 12} cy={y - 8} r="12" />
            <circle cx={x} cy={y - 15} r="15" />
          </g>
          <rect x={x - 22} y={y - 10} width="44" height="10" fill={i % 2 ? "#7fcf7a" : "#74c46f"} />
          {i >= stage && !finale && (
            <g className="anim-blink" style={{ animationDelay: `${i * 0.45}s` }}>
              <ellipse cx={x - 6} cy={y - 14} rx="4" ry="4.6" fill="#fff" stroke={INK} strokeWidth="1.4" />
              <ellipse cx={x + 6} cy={y - 14} rx="4" ry="4.6" fill="#fff" stroke={INK} strokeWidth="1.4" />
              <circle cx={x - 6} cy={y - 13} r="2" fill={INK} />
              <circle cx={x + 6} cy={y - 13} r="2" fill={INK} />
            </g>
          )}
          {restored && <circle cx={x + 8} cy={y - 22} r="3.5" fill="#ffb3c7" />}
        </g>
      ))}

      {/* The rescue team */}
      <g className="slide" style={{ transform: finale ? "translateX(40px)" : "none" }}>
        {members.map(({ slot, i }) => (
          <PlacedCritter
            key={RESCUE_TEAM[i].id}
            x={slot.x}
            y={slot.y}
            scale={slot.s}
            species={RESCUE_TEAM[i].species}
            accessory={RESCUE_TEAM[i].accessory}
            pose={pose(i)}
            delay={i * 0.25}
            className={mode === "arrival" && i === stage - 1 ? "anim-arrive" : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
