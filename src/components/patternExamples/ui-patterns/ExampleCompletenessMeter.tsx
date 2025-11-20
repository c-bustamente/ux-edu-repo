// src/components/pattern-examples/ExampleCompletenessMeter.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * ExampleCompletenessMeter
 * --------------------------------------------------------------
 * Education use case: Course Setup Completeness
 * - Weighted checklist drives % complete
 * - Progress bar + numeric label + next recommended action
 * - Micro-motivation: milestone nudge at 25/50/75/100
 * - Accessible semantics and clear system status
 */
type TaskKey = "syllabus" | "grading" | "module1" | "welcome" | "a11y";

const TASKS: Record<TaskKey, { label: string; weight: number; hint: string }> = {
  syllabus: { label: "Upload syllabus", weight: 0.30, hint: "PDF or link to syllabus helps learners plan." },
  grading:  { label: "Set grading policy", weight: 0.20, hint: "Clarify weighting and any late rules." },
  module1:  { label: "Publish first module", weight: 0.25, hint: "Add content + at least one activity." },
  welcome:  { label: "Post welcome message", weight: 0.15, hint: "Humanize the course and set tone." },
  a11y:     { label: "Run accessibility check", weight: 0.10, hint: "Ensure headings, alt text, contrast." },
};

export default function ExampleCompletenessMeter() {
  const [done, setDone] = useState<Record<TaskKey, boolean>>({
    syllabus: false,
    grading: false,
    module1: false,
    welcome: false,
    a11y: false,
  });

  const percent = useMemo(() => {
    let p = 0;
    (Object.keys(TASKS) as TaskKey[]).forEach((k) => {
      if (done[k]) p += TASKS[k].weight;
    });
    return Math.round(p * 100);
  }, [done]);

  const milestone =
    percent >= 100 ? "🎉 Course is ready!":
    percent >= 75  ? "Almost there — great momentum!" :
    percent >= 50  ? "Halfway — keep going!" :
    percent >= 25  ? "Nice start — build consistency!" :
                     "Let’s kick this off.";

  const nextAction = useMemo(() => {
    // recommend the highest-weight remaining task
    const remaining = (Object.keys(TASKS) as TaskKey[])
      .filter((k) => !done[k])
      .sort((a, b) => TASKS[b].weight - TASKS[a].weight);
    return remaining[0] ?? null;
  }, [done]);

  function toggle(k: TaskKey) {
    setDone((s) => ({ ...s, [k]: !s[k] }));
  }

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Course Setup Completeness</h3>
        <p className="text-sm text-muted-foreground">
          See what’s left to publish your course with confidence.
        </p>
      </header>

      {/* Progress block */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium">Progress</span>
          <span aria-live="polite" className="text-muted-foreground">{percent}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden" role="progressbar"
             aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Course setup completeness">
          <div
            className={`h-full transition-all ${barColor(percent)}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-emerald-700">{milestone}</div>
      </div>

      {/* Next best action */}
      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3">
        <p className="text-sm font-medium text-amber-900">Next best action</p>
        {nextAction ? (
          <div className="mt-1 text-sm text-amber-800">
            {TASKS[nextAction].label}. <span className="text-amber-700/90">{TASKS[nextAction].hint}</span>
          </div>
        ) : (
          <div className="mt-1 text-sm text-amber-800">All tasks are complete.</div>
        )}
      </div>

      {/* Weighted checklist */}
      <section aria-labelledby="checklist-title">
        <h4 id="checklist-title" className="text-base font-semibold">Checklist</h4>
        <ul className="mt-2 space-y-2">
          {(Object.keys(TASKS) as TaskKey[]).map((k) => {
            const { label, weight, hint } = TASKS[k];
            return (
              <li key={k} className="flex items-start gap-3">
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                    checked={done[k]}
                    onChange={() => toggle(k)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{label}</span>
                      <span className="text-[11px] rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                        {Math.round(weight * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                </label>
                {/* Quick action button (mock) */}
                {!done[k] ? (
                  <button
                    className="text-xs rounded-md border px-2 py-1 text-gray-700 hover:bg-gray-50"
                    onClick={() => toggle(k)}
                    aria-label={`Mark ${label} as complete`}
                  >
                    Mark done
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700">Done</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* CTA */}
      <div className="mt-5 flex justify-end">
        <button
          className={[
            "rounded-lg px-3 py-2 text-sm font-medium transition",
            percent >= 80 ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-600 cursor-not-allowed",
          ].join(" ")}
          disabled={percent < 80}
          onClick={() => alert("Great! Your course looks ready to publish.")}
        >
          Publish course
        </button>
      </div>
    </div>
  );
}

/* -------------- helpers -------------- */

function barColor(p: number) {
  if (p >= 80) return "bg-emerald-600";
  if (p >= 50) return "bg-amber-500";
  return "bg-gray-400";
}
