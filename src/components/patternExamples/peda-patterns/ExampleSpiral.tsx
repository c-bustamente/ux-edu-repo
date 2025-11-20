"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Spiral — Progressive Reinforcement Tracker
 * Revisit a core concept in multiple passes, each with deeper activities.
 * Progressive disclosure keeps focus on the current pass; earlier passes remain reviewable.
 * Adapted for online courses (videos/quizzes/mini-projects), compact to sit in a module.
 */

type ActType = "watch" | "quiz" | "apply" | "reflect";
interface Activity {
  id: string;
  label: string;
  type: ActType;
  done: boolean;
}
interface Cycle {
  id: string;
  title: string;
  level: number; // 1..N
  activities: Activity[];
  suggestedAfterDays: number; // when to revisit next pass
}

const STORAGE_KEY = "uxedu.ped.spiral.v1";

const SEED: Cycle[] = [
  {
    id: "pass1",
    title: "Pass 1 — Exposure",
    level: 1,
    suggestedAfterDays: 2,
    activities: [
      { id: "p1-a", type: "watch", label: "Micro-lecture: Feedback Loops in Learning UX (7 min)", done: false },
      { id: "p1-b", type: "quiz", label: "2-question check: identify examples of feedback loops", done: false },
      { id: "p1-c", type: "reflect", label: "Exit ticket: one thing I noticed today", done: false },
    ],
  },
  {
    id: "pass2",
    title: "Pass 2 — Structured Practice",
    level: 2,
    suggestedAfterDays: 4,
    activities: [
      { id: "p2-a", type: "apply", label: "Annotate a course screen with 2 feedback loop improvements", done: false },
      { id: "p2-b", type: "quiz", label: "Short scenario: choose the better design rationale", done: false },
      { id: "p2-c", type: "reflect", label: "Post a 3-sentence critique to the Forum thread", done: false },
    ],
  },
  {
    id: "pass3",
    title: "Pass 3 — Transfer",
    level: 3,
    suggestedAfterDays: 7,
    activities: [
      { id: "p3-a", type: "apply", label: "Mini-project: instrument a page with visible feedback states", done: false },
      { id: "p3-b", type: "quiz", label: "Rubric self-check: clarity, timeliness, actionability", done: false },
      { id: "p3-c", type: "reflect", label: "Write a before/after note with a metric to track", done: false },
    ],
  },
];

function load(): { cycles: Cycle[]; active: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cycles: SEED, active: 0 };
    const parsed = JSON.parse(raw) as { cycles: Cycle[]; active: number };
    return { cycles: parsed.cycles ?? SEED, active: Number.isFinite(parsed.active) ? parsed.active : 0 };
  } catch {
    return { cycles: SEED, active: 0 };
  }
}
function save(state: { cycles: Cycle[]; active: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {/* ignore */}
}

export default function ExampleSpiral() {
  const [cycles, setCycles] = useState<Cycle[]>(SEED);
  const [active, setActive] = useState<number>(0); // index into cycles
  const [announce, setAnnounce] = useState<string>("");
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = load();
    setCycles(s.cycles);
    setActive(Math.min(s.active, s.cycles.length - 1));
  }, []);
  useEffect(() => save({ cycles, active }), [cycles, active]);

  const totalActs = useMemo(() => cycles.reduce((sum, c) => sum + c.activities.length, 0), [cycles]);
  const doneActs = useMemo(
    () => cycles.reduce((sum, c) => sum + c.activities.filter((a) => a.done).length, 0),
    [cycles]
  );
  const depthPct = Math.round(((active + 1) / cycles.length) * 100);
  const allDone = doneActs === totalActs;

  function toggleActivity(cIdx: number, aIdx: number) {
    setCycles((prev) =>
      prev.map((c, i) =>
        i === cIdx
          ? { ...c, activities: c.activities.map((a, j) => (j === aIdx ? { ...a, done: !a.done } : a)) }
          : c
      )
    );
    setAnnounce("Updated activity status.");
  }

  function advance() {
    if (active < cycles.length - 1) {
      setActive((i) => i + 1);
      // move focus to the newly opened pass
      setTimeout(() => {
        const btns = accordionRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
        btns?.[active + 1]?.focus();
      }, 0);
      setAnnounce("Advanced to next pass.");
    }
  }

  function resetSpiral() {
    const fresh = SEED.map((c) => ({ ...c, activities: c.activities.map((a) => ({ ...a, done: false })) }));
    setCycles(fresh);
    setActive(0);
    setAnnounce("Spiral reset.");
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="spiral-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="spiral-title" className="text-lg font-semibold tracking-tight">Spiral — Progressive Reinforcement</h1>
          <p className="text-xs text-gray-600">Revisit the same concept, deepening it on each pass.</p>
        </header>

        {/* Progress + depth meter */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
          <div className="flex items-center justify-between text-[11px] text-gray-700">
            <span>Depth: {active + 1}/{cycles.length}</span>
            <span>Completed: {doneActs}/{totalActs}</span>
          </div>
          <div
            className="mt-1 h-2 w-full rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Depth progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={depthPct}
          >
            <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${depthPct}%` }} />
          </div>
        </div>

        {/* Progressive disclosure accordion */}
        <div ref={accordionRef} className="mt-2" role="tablist" aria-label="Spiral passes">
          {cycles.map((cycle, idx) => {
            const open = idx === active;
            const doneCount = cycle.activities.filter((a) => a.done).length;
            const passDone = doneCount === cycle.activities.length;
            return (
              <div key={cycle.id} className="rounded-md border border-gray-100 mb-2">
                <button
                  role="tab"
                  aria-selected={open}
                  aria-controls={`panel-${cycle.id}`}
                  id={`tab-${cycle.id}`}
                  onClick={() => setActive(idx)}
                  className={`w-full text-left px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    open ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{cycle.title}</p>
                      <p className="text-[11px] text-gray-600">
                        {doneCount}/{cycle.activities.length} done • Suggest revisit in {cycle.suggestedAfterDays} day
                        {cycle.suggestedAfterDays === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${
                        passDone ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      <Dot filled={passDone} />
                      {passDone ? "Pass complete" : "In progress"}
                    </span>
                  </div>
                </button>

                {open && (
                  <div
                    role="tabpanel"
                    id={`panel-${cycle.id}`}
                    aria-labelledby={`tab-${cycle.id}`}
                    className="px-3 pb-3 pt-2"
                  >
                    <ul className="space-y-2">
                      {cycle.activities.map((a, j) => (
                        <li key={a.id} className="flex items-start gap-2">
                          <input
                            id={`${cycle.id}-${a.id}`}
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={a.done}
                            onChange={() => toggleActivity(idx, j)}
                            aria-checked={a.done}
                          />
                          <label htmlFor={`${cycle.id}-${a.id}`} className="text-sm text-gray-900 flex-1">
                            <TypeBadge type={a.type} /> {a.label}
                          </label>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[11px] text-gray-600">
                        Tip: If this feels easy, skim and advance; if not, repeat this pass tomorrow.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="#/guides/spiral-curriculum"
                          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Why spiral?
                        </a>
                        <button
                          type="button"
                          onClick={advance}
                          disabled={!passDone || idx !== active}
                          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-disabled={!passDone || idx !== active}
                        >
                          Advance to next pass
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion / reset */}
        {allDone && (
          <div className="rounded-md border border-green-200 bg-green-50 p-2 mt-1 text-sm text-green-800">
            Spiral complete! Consider a spaced review in one week or integrating this concept into a capstone task.
          </div>
        )}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={resetSpiral}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset spiral
          </button>
        </div>
      </div>

      {/* Live region for AT */}
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}

/** Small UI bits */
function Dot({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 rounded-full ${filled ? "bg-green-500" : "bg-gray-400"}`}
    />
  );
}

function TypeBadge({ type }: { type: ActType }) {
  const map: Record<ActType, string> = {
    watch: "Watch",
    quiz: "Quiz",
    apply: "Apply",
    reflect: "Reflect",
  };
  const tone =
    type === "apply"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : type === "quiz"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : type === "watch"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-teal-50 text-teal-700 border-teal-200";
  return (
    <span className={`mr-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${tone}`}>
      {map[type]}
    </span>
  );
}
