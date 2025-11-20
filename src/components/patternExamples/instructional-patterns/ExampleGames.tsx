"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Learning Game: Heuristic Dash
 * Small, focused game aligned with a learning objective:
 * Recognize UX/learning concepts from short definitions. 5 rounds, instant feedback,
 * simple scoring, clear progress, and a quick restart. Compact to fit a pattern card.
 */

type Item = { term: string; definition: string };
type Phase = "ready" | "playing" | "done";

const DATA: Item[] = [
  {
    term: "Visibility of System Status",
    definition: "The system keeps learners informed of progress and what is happening, in real time.",
  },
  {
    term: "Match with the Real World",
    definition: "Content uses familiar language and concepts that mirror the learner’s domain.",
  },
  {
    term: "Consistency and Standards",
    definition: "Similar things look and behave the same across modules and activities.",
  },
  {
    term: "Error Prevention",
    definition: "The design reduces the chance of mistakes before they happen.",
  },
  {
    term: "Recognition over Recall",
    definition: "Choices and key info are visible so learners don’t have to remember from scratch.",
  },
  {
    term: "Feedback",
    definition: "Learners quickly see the result of their actions, including correctness and next steps.",
  },
  {
    term: "Clear Rules",
    definition: "Goals, allowed actions, and scoring are explicit before starting an activity.",
  },
  {
    term: "Completeness Meter",
    definition: "A simple indicator shows how much of the task or module is finished.",
  },
];

const ROUNDS = 5;
const BEST_KEY = "uxedu.games.heuristicdash.best.v1";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(correctIdx: number, poolSize: number): number[] {
  const indices = [...Array(poolSize).keys()].filter((i) => i !== correctIdx);
  const distractors = shuffle(indices).slice(0, 2);
  return shuffle([correctIdx, ...distractors]);
}

export default function ExampleGames() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [roundOrder, setRoundOrder] = useState<number[]>([]);
  const [round, setRound] = useState<number>(0); // 0..ROUNDS-1
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [tries, setTries] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [best, setBest] = useState<number>(0);
  const [announce, setAnnounce] = useState<string>("");

  useEffect(() => {
    const b = Number(localStorage.getItem(BEST_KEY) || 0);
    setBest(isNaN(b) ? 0 : b);
  }, []);

  const currentIdx = useMemo(() => roundOrder[round] ?? 0, [roundOrder, round]);
  const current = DATA[currentIdx];

  function start() {
    const order = shuffle([...Array(DATA.length).keys()]).slice(0, ROUNDS);
    setRoundOrder(order);
    setRound(0);
    setScore(0);
    setSelected(null);
    setTries(0);
    setOptions(pickOptions(order[0], DATA.length));
    setPhase("playing");
    setAnnounce("Game started.");
  }

  function onChoose(idx: number) {
    if (selected !== null) return; // locked for this round
    setSelected(idx);
    const isCorrect = idx === currentIdx;
    if (isCorrect) {
      const gained = tries === 0 ? 2 : 1; // first try = 2pts, later = 1pt
      setScore((s) => s + gained);
      setAnnounce(`Correct! +${gained} point${gained === 1 ? "" : "s"}.`);
    } else {
      // allow a second try; after that, reveal Next
      setTries((t) => t + 1);
      setAnnounce("Not quite. You can try once more.");
    }
  }

  function nextRound() {
    if (round + 1 >= ROUNDS) {
      setPhase("done");
      const final = score;
      if (final > best) {
        localStorage.setItem(BEST_KEY, String(final));
        setBest(final);
      }
      setAnnounce("Game finished.");
      return;
    }
    const next = round + 1;
    setRound(next);
    setOptions(pickOptions(roundOrder[next], DATA.length));
    setSelected(null);
    setTries(0);
  }

  const progressPct = useMemo(() => Math.round(((round + (phase === "done" ? 1 : 0)) / ROUNDS) * 100), [round, phase]);

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="game-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="game-title" className="text-lg font-semibold tracking-tight">Learning Game — Heuristic Dash</h1>
          <p className="text-xs text-gray-600">
            Objective: Recognize the correct concept from its definition. 5 rounds, instant feedback.
          </p>
        </header>

        {/* Progress / status */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
          <div
            className="h-2 w-full rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Completion progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPct}
          >
            <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-gray-700">
            Score: <span className="font-medium">{score}</span> / {ROUNDS * 2} • Best: {best}
          </p>
        </div>

        {/* Ready screen */}
        {phase === "ready" && (
          <div className="mt-3">
            <Rules />
            <button
              type="button"
              onClick={start}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Start game
            </button>
          </div>
        )}

        {/* Playing */}
        {phase === "playing" && (
          <div className="mt-3">
            {/* Definition card */}
            <article className="rounded-md border border-gray-100 bg-white p-3">
              <h2 className="text-sm font-medium text-gray-900">Which concept matches this definition?</h2>
              <p className="mt-1 text-sm text-gray-800">{current.definition}</p>
            </article>

            {/* Options */}
            <ul className="mt-2 grid grid-cols-1 gap-2" role="listbox" aria-label="Answer choices">
              {options.map((idx) => {
                const isChosen = selected === idx;
                const isCorrect = idx === currentIdx;
                // visual feedback only after a selection
                const style =
                  selected === null
                    ? "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    : isChosen && isCorrect
                    ? "border-green-600 bg-green-600 text-white"
                    : isChosen && !isCorrect
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-300 bg-white text-gray-900";
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isChosen}
                      onClick={() => onChoose(idx)}
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${style}`}
                      disabled={selected !== null && (isChosen ? false : tries >= 1 && !isCorrect)} // after a wrong pick, allow one more try on other options
                    >
                      {DATA[idx].term}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Next / hint */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-gray-600" aria-live="polite">
                {announce}
              </p>
              <div className="flex gap-2">
                {/* Show a subtle hint if one wrong try occurred */}
                {tries >= 1 && selected !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800 border border-amber-200">
                    <LightIcon /> second try: +1
                  </span>
                )}
                {/* Advance when correct OR after two tries */}
                {(selected === currentIdx || tries >= 2) && (
                  <button
                    type="button"
                    onClick={nextRound}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Done */}
        {phase === "done" && (
          <div className="mt-3">
            <Result score={score} best={best} />
            <button
              type="button"
              onClick={start}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Play again
            </button>
            <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
              <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                What to review next?
              </summary>
              <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
                <li>Revisit terms you missed in the <span className="font-medium">Glossary</span>.</li>
                <li>Try a <span className="font-medium">formative quiz</span> to reinforce concepts.</li>
              </ul>
            </details>
          </div>
        )}
      </div>

      {/* SR-only live region */}
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}

/** Subcomponents */
function Rules() {
  return (
    <details className="rounded-md border border-gray-200 bg-gray-50 p-2">
      <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
        Rules & scoring
      </summary>
      <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
        <li>5 rounds. Pick the concept that matches the definition.</li>
        <li>+2 on first try, +1 on second try. Immediate feedback.</li>
        <li>Progress bar shows completion. Aim to beat your best score!</li>
      </ul>
    </details>
  );
}

function Result({ score, best }: { score: number; best: number }) {
  const max = ROUNDS * 2;
  const pct = Math.round((score / max) * 100);
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  return (
    <div className="rounded-md border border-gray-100 p-3 text-center">
      <p className="text-sm text-gray-900">
        Final score: <span className="font-semibold">{score}</span> / {max} ({pct}%)
      </p>
      <div className="mt-1 flex items-center justify-center gap-1" aria-label={`${stars} star rating`}>
        {[0, 1, 2].map((i) => (
          <Star key={i} filled={i < stars} />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-gray-600">Best: {best}</p>
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        className={filled ? "fill-yellow-500" : "fill-gray-300"}
        d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.5L10 14.9 5.2 17l.9-5.5L2.2 7.7l5.4-.8L10 2z"
      />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
      <path d="M10 2a6 6 0 0 0-3 11.2V16h6v-2.8A6 6 0 0 0 10 2Zm-1 15h2v1H9v-1Z" />
    </svg>
  );
}
