import { INK, PlacedCritter } from "@/components/art/Critter";
import {
  ANSWERS_PER_RIVAL,
  PLAYER,
  RIVALS,
  answersToPass,
  currentRival,
  isFinished,
  type RaceState,
  type Racer,
} from "@/lib/race-engine";

const PLAYER_X = 112;
const RIVAL_LANE = 150;
const PLAYER_LANE = 190;

/** A kart with an animal driver. (0,0) is the middle of the kart where the wheels touch the road. */
function Kart({ racer, number }: { racer: Racer; number: number }) {
  return (
    <g className="kart-bounce">
      <PlacedCritter x={-4} y={-12} scale={0.38} species={racer.species} pose="idle" />
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M-40 -4 Q-42 -20 -28 -20 L-14 -20 Q-4 -12 10 -12 L22 -12 Q40 -12 44 -2 L44 2 L-40 2 Z" fill={racer.kart} />
        <rect x="-46" y="-26" width="10" height="16" rx="3" fill={racer.kart} />
        <circle cx="-22" cy="-8" r="7" fill="#fff" strokeWidth="1.8" />
        <text x="-22" y="-4.6" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} stroke="none">
          {number}
        </text>
        <path d="M18 -12 L26 -22" fill="none" strokeLinecap="round" />
      </g>
      {[-26, 28].map((wx) => (
        <g key={wx} transform={`translate(${wx} 6)`}>
          <circle r="10" fill={INK} />
          <g className="wheel-spin">
            <circle r="4.5" fill="#d9d4e3" />
            <path d="M-8 0 L8 0 M0 -8 L0 8" stroke="#8a84a0" strokeWidth="2" />
          </g>
        </g>
      ))}
    </g>
  );
}

export function RaceTrack({ race }: { race: RaceState }) {
  const finished = isFinished(race);
  const rivalIndex = currentRival(race);
  const rival = RIVALS[rivalIndex];
  const { event } = race;
  // Closer with each correct answer; a little further after a wrong one.
  const rivalX = PLAYER_X + 60 + answersToPass(race) * 68 + race.lag * 34;
  const justPassed = (event.kind === "pass" || event.kind === "finish") && rivalIndex > 0 ? RIVALS[rivalIndex - 1] : null;

  return (
    <svg viewBox="0 0 480 230" className="block h-auto w-full" role="img" aria-label="The race track">
      <rect width="480" height="230" fill="#cdeeff" />
      <circle cx="420" cy="40" r="22" fill="#ffe17a" />
      {/* Scrolling hills and trees: two copies side by side loop seamlessly */}
      <g className="scenery-scroll">
        {[0, 480].map((ox) => (
          <g key={ox} transform={`translate(${ox} 0)`}>
            <path d="M0 110 Q60 60 130 100 Q200 70 270 104 Q350 58 420 98 Q450 90 480 110 V122 H0 Z" fill="#b6e3a4" />
            {[40, 175, 330, 445].map((tx) => (
              <g key={tx}>
                <rect x={tx - 3} y="92" width="6" height="22" fill="#a77b57" />
                <circle cx={tx} cy="88" r="13" fill="#8fd18a" stroke={INK} strokeWidth="1.6" />
              </g>
            ))}
            {[90, 260, 400].map((cx) => (
              <g key={cx} fill="#fff">
                <circle cx={cx} cy="36" r="10" />
                <circle cx={cx + 12} cy="31" r="13" />
                <circle cx={cx + 25} cy="36" r="9" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Road with moving lane markings */}
      <rect y="118" width="480" height="92" fill="#9a95ad" />
      <rect y="118" width="480" height="6" fill="#fff" />
      <rect y="206" width="480" height="6" fill="#fff" />
      <line x1="-60" y1="166" x2="540" y2="166" stroke="#fff" strokeWidth="4" strokeDasharray="26 22" className="road-dash" />
      <rect y="212" width="480" height="18" fill="#a8df90" />

      {/* Finish line slides in at the end */}
      {finished && (
        <g className="finish-in">
          <g transform="translate(250 118)">
            {Array.from({ length: 23 }, (_, i) => (
              <rect key={i} x={(i % 2) * 8} y={i * 4} width="8" height="4" fill={i % 2 ? INK : "#fff"} />
            ))}
            {Array.from({ length: 23 }, (_, i) => (
              <rect key={`b${i}`} x={8 - (i % 2) * 8} y={i * 4} width="8" height="4" fill={i % 2 ? "#fff" : INK} />
            ))}
          </g>
          <rect x="248" y="40" width="5" height="80" fill={INK} />
          <path d="M253 42 h46 v28 h-46 Z" fill="#fff" stroke={INK} strokeWidth="2" />
          <text x="276" y="61" textAnchor="middle" fontSize="13" fontWeight="700" fill="#d9507b">FINISH</text>
        </g>
      )}

      {/* Rival just overtaken drops behind */}
      {justPassed && (
        <g key={`passed-${event.n}`} transform={`translate(${PLAYER_X + 60 + 34} ${RIVAL_LANE})`}>
          <g className="kart-exit">
            <Kart racer={justPassed} number={rivalIndex + 1} />
          </g>
        </g>
      )}

      {/* The rival ahead */}
      {rival && !finished && (
        <g style={{ transform: `translate(${rivalX}px, ${RIVAL_LANE}px)`, transition: "transform 0.8s cubic-bezier(0.34, 1.2, 0.64, 1)" }}>
          <g key={`rival-${rivalIndex}`} className={rivalIndex > 0 ? "kart-enter" : undefined}>
            <Kart racer={rival} number={rivalIndex + 2} />
          </g>
        </g>
      )}

      {/* Bunny */}
      <g transform={`translate(${PLAYER_X} ${PLAYER_LANE})`}>
        <g
          key={`player-${event.n}`}
          className={event.kind === "wrong" ? "kart-sputter" : event.kind === "start" ? undefined : "kart-boost"}
        >
          {event.kind !== "wrong" && event.kind !== "start" && (
            <g stroke="#fff" strokeWidth="3" strokeLinecap="round" className="speed-lines">
              <path d="M-64 -14 H-84" />
              <path d="M-60 -2 H-90" />
              <path d="M-64 8 H-80" />
            </g>
          )}
          {event.kind === "wrong" &&
            [0, 1, 2].map((i) => (
              <circle key={i} cx={-50 - i * 10} cy={-4 - i * 6} r={6 + i * 2} fill="#d9d4e3" className="smoke-puff" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          <Kart racer={PLAYER} number={1} />
        </g>
      </g>

      {/* Progress dots: one per rival */}
      <g transform="translate(16 14)">
        <rect width={RIVALS.length * 26 + 8} height="24" rx="12" fill="#fff" opacity="0.9" />
        {RIVALS.map((r, i) => {
          const done = race.correct >= (i + 1) * ANSWERS_PER_RIVAL;
          return (
            <g key={r.name} transform={`translate(${16 + i * 26} 12)`}>
              <circle r="8" fill={done ? "#4cbf6a" : r.kart} stroke={INK} strokeWidth="1.6" />
              {done && <path d="M-4 0 L-1 3 L4 -3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
