"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Student Design Sprint — Compact Wizard
 * Scenario (education-fit): design an LMS "Quiz Attempt Flow" in rapid cycles.
 * Pattern essence: fast design → tweak → regroup → critique, with tiny artifacts captured per cycle.
 * Includes: stepper, brief & constraints, timer (quick 1–3–5 min), notes, critique prompts, and export.
 * Dimensions: max-w-lg, scroll-limited textareas, mobile friendly, no external deps.
 */

type Cycle = {
  id: number;
  name: string;
  brief: string;
  tweak: string;
  questions: string[]; // critique prompts
};

type Note = { title: string; outline: string };
type SprintState = {
  current: number;
  notes: Record<number, Note>;
  secsLeft: number;
  running: boolean;
  duration: number; // seconds per cycle
};

const STORAGE_KEY = "uxedu.ped.designsprint.v1";

const CYCLES: Cycle[] = [
  {
    id: 1,
    name: "Cycle 1",
    brief:
      "Design a basic Quiz Attempt Flow for an LMS: start → answer items → submit → see score. Focus on clarity and minimal steps.",
    tweak:
      "Constraints: mobile-first; unreliable network must not lose answers; keyboard-only navigation.",
    questions: [
      "Is the main user goal obvious at each step?",
      "How is progress/status visible during the attempt?",
      "What happens on submission failure?",
    ],
  },
  {
    id: 2,
    name: "Cycle 2",
    brief:
      "Modify your design to support accessibility & policy needs: time accommodations, screen readers, and autosave every 20s.",
    tweak:
      "Add: pause with justification, alt text policy for media items, and confirm on leaving the attempt.",
    questions: [
      "Where are accommodations configured and surfaced?",
      "Can a screen reader user complete the attempt without traps?",
      "How are conflicts (pause vs. time limit) resolved?",
    ],
  },
  {
    id: 3,
    name: "Cycle 3",
    brief:
      "Extend for real-world authenticity: proctoring opt-in, offline draft attempts, and post-quiz analytics for instructors.",
    tweak:
      "Add: retry queue for offline submissions and a simple audit trail visible to students and instructors.",
    questions: [
      "Which states are persisted locally vs. server-side?",
      "Where do you show audit history without overloading the UI?",
      "What is the smallest diff to your prior design to add these?",
    ],
  },
];

/* ------------------------------ Utilities ------------------------------ */
function loadPersist(): SprintState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SprintState) : null;
  } catch {
    return null;
  }
}
function savePersist(s: SprintState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}
function fmt(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/* --------------------------------- App --------------------------------- */
export default function ExampleStudentDesignSprint() {
  const persisted = typeof window !== "undefined" ? loadPersist() : null;
  const [state, setState] = useState<SprintState>(
    persisted ?? {
      current: 0,
      notes: { 0: { title: "", outline: "" }, 1: { title: "", outline: "" }, 2: { title: "", outline: "" } },
      secsLeft: 60 * 3, // default 3 minutes
      running: false,
      duration: 60 * 3,
    }
  );
  const tickRef = useRef<number | null>(null);

  const cycle = CYCLES[state.current];

  useEffect(() => {
    savePersist(state);
  }, [state]);

  useEffect(() => {
    if (!state.running) {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
      return;
    }
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.floor((now - last) / 1000);
      if (dt >= 1) {
        setState((s) => {
          const next = Math.max(0, s.secsLeft - dt);
          return { ...s, secsLeft: next, running: next > 0 && s.running };
        });
        last = now;
      }
      tickRef.current = requestAnimationFrame(loop);
    };
    tickRef.current = requestAnimationFrame(loop);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
    };
  }, [state.running]);

  function setDuration(mins: number) {
    setState((s) => ({ ...s, duration: mins * 60, secsLeft: mins * 60, running: false }));
  }
  function startPause() {
    setState((s) => ({ ...s, running: !s.running }));
  }
  function resetTimer() {
    setState((s) => ({ ...s, secsLeft: s.duration, running: false }));
  }

  function updateNote(patch: Partial<Note>) {
    setState((s) => ({
      ...s,
      notes: {
        ...s.notes,
        [s.current]: { ...s.notes[s.current], ...patch },
      },
    }));
  }

  function nextCycle() {
    setState((s) => {
      const next = Math.min(CYCLES.length - 1, s.current + 1);
      return {
        ...s,
        current: next,
        secsLeft: s.duration,
        running: false,
      };
    });
  }
  function prevCycle() {
    setState((s) => {
      const prev = Math.max(0, s.current - 1);
      return {
        ...s,
        current: prev,
        secsLeft: s.duration,
        running: false,
      };
    });
  }

  async function copySummary() {
    const payload = {
      sprint: "Student Design Sprint — Quiz Attempt Flow",
      cycles: CYCLES.map((c, i) => ({
        cycle: c.name,
        brief: c.brief,
        tweak: c.tweak,
        notes: state.notes[i],
        remainingSeconds: i === state.current ? state.secsLeft : undefined,
      })),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      // no-op UI toast to keep compact; visually rely on browser feedback
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="sprint-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Header + stepper */}
        <header className="mb-2">
          <h1 id="sprint-title" className="text-lg font-semibold tracking-tight">
            Student Design Sprint — Rapid Wizard
          </h1>
          <p className="text-xs text-gray-600">Design → tweak → critique, across quick cycles. Keep artifacts short.</p>
        </header>

        <nav aria-label="Progress" className="mb-2">
          <ol className="flex items-center gap-1 text-xs">
            {CYCLES.map((c, i) => {
              const active = i === state.current;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setState((s) => ({ ...s, current: i, running: false, secsLeft: s.duration }))
                    }
                    className={`rounded px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-current={active ? "step" : undefined}
                  >
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Brief + tweak */}
        <section className="rounded-md border border-gray-100 p-2">
          <p className="text-xs font-medium text-gray-800">{cycle.brief}</p>
          <p className="mt-1 text-[11px] text-gray-700">{cycle.tweak}</p>
        </section>

        {/* Timer & controls */}
        <section className="mt-2 rounded-md border border-gray-100 p-2">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <p className="text-sm font-medium text-gray-900" aria-live="polite">
              {fmt(state.secsLeft)}
            </p>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={startPause}
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {state.running ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Reset
              </button>
              <span className="ml-2 text-[11px] text-gray-600">Quick set:</span>
              {[1, 3, 5].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m)}
                  className={`rounded-md px-2 py-1 text-[11px] border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    state.duration === m * 60 ? "bg-indigo-50 border-indigo-400 text-indigo-800" : "bg-white border-gray-300 text-gray-800"
                  }`}
                  aria-pressed={state.duration === m * 60}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notes (title + outline) */}
        <section className="mt-2 rounded-md border border-gray-100 p-2" aria-labelledby="notes-title">
          <h2 id="notes-title" className="text-sm font-medium text-gray-900">Design outline (keep it short)</h2>
          <div className="mt-1 grid grid-cols-1 gap-2">
            <label className="text-xs">
              <span className="sr-only">Design title</span>
              <input
                value={state.notes[state.current].title}
                onChange={(e) => updateNote({ title: e.target.value })}
                placeholder="e.g., 'Minimal 3-step quiz flow with autosave'"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <label className="text-xs">
              <span className="sr-only">Design outline</span>
              <textarea
                value={state.notes[state.current].outline}
                onChange={(e) => updateNote({ outline: e.target.value })}
                placeholder="- Steps\n- Key states\n- Error paths\n- A11y hooks"
                className="w-full h-28 rounded-md border border-gray-300 px-3 py-2 font-mono text-[12px] leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                spellCheck={false}
              />
            </label>
          </div>
          <p className="mt-1 text-[11px] text-gray-600">
            Tip: prioritize states & transitions; defer cosmetics. Use recognition (labels, status) over recall.
          </p>
        </section>

        {/* Critique prompts */}
        <section className="mt-2 rounded-md border border-gray-100">
          <h3 className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">Critique prompts</h3>
          <ul className="px-3 py-2 list-disc pl-5 text-[11px] text-gray-800">
            {cycle.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        {/* Nav + export */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={prevCycle}
            disabled={state.current === 0}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={nextCycle}
            disabled={state.current === CYCLES.length - 1}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Next →
          </button>

          <button
            type="button"
            onClick={copySummary}
            className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Copy Sprint Summary (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Icons -------------------------------- */
function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gray-600">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5v5l3 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
