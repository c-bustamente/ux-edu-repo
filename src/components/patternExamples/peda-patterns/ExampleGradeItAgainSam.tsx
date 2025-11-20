"use client";

import { useMemo, useState } from "react";

/**
 * Grade It Again, Sam — Simple Revision Flow (compact)
 * Scenario: students can revise an assignment after feedback; best score counts toward mastery.
 * Includes: attempt list, mastery progress meter, small revision form (check addressed feedback + reflection),
 * predicted score preview, and submit (adds a new attempt). Fits in a card (max-w-lg), mobile-friendly.
 */

type FeedbackItem = { id: string; text: string; weight: number }; // weight contributes to improvement if addressed
type Attempt = {
  id: number;
  score: number; // 0–100
  addressed: string[]; // feedback ids addressed in this attempt (first attempt empty)
  reflection?: string;
  submittedAt: string;
};

const FEEDBACK: FeedbackItem[] = [
  { id: "rubric-clarity", text: "Clarify your thesis statement in the introduction.", weight: 8 },
  { id: "rubric-evidence", text: "Add at least one cited example supporting your claim.", weight: 10 },
  { id: "rubric-structure", text: "Improve paragraph transitions for flow.", weight: 6 },
];

const INITIAL_ATTEMPT: Attempt = {
  id: 1,
  score: 62,
  addressed: [],
  reflection: undefined,
  submittedAt: isoNow(),
};

const ATTEMPT_LIMIT = 3;
const MASTERY_TARGET = 85;

export default function ExampleGradeItAgainSam() {
  const [attempts, setAttempts] = useState<Attempt[]>([INITIAL_ATTEMPT]);
  const [openRevise, setOpenRevise] = useState<boolean>(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [reflection, setReflection] = useState<string>("");

  const bestScore = useMemo(() => Math.max(...attempts.map((a) => a.score)), [attempts]);
  const progressPct = clamp(Math.round((bestScore / MASTERY_TARGET) * 100), 0, 100);
  const attemptsLeft = ATTEMPT_LIMIT - attempts.length;

  const predicted = useMemo(() => {
    const last = attempts[attempts.length - 1];
    let bump = 0;
    FEEDBACK.forEach((f) => {
      if (checked[f.id]) bump += f.weight;
    });
    if (reflection.trim().length >= 40) bump += 2; // small bonus for substantive reflection
    return clamp(last.score + bump, 0, 100);
  }, [attempts, checked, reflection]);

  function toggleCheck(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  function startRevision() {
    setOpenRevise(true);
    setChecked({});
    setReflection("");
  }

  function submitRevision() {
    const addressed = Object.keys(checked).filter((k) => checked[k]);
    const next: Attempt = {
      id: attempts.length + 1,
      score: predicted,
      addressed,
      reflection: reflection.trim() || undefined,
      submittedAt: isoNow(),
    };
    setAttempts((a) => [...a, next]);
    setOpenRevise(false);
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="giags-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Header */}
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="giags-title" className="text-lg font-semibold tracking-tight">Grade It Again, Sam — Revision</h1>
            <p className="text-xs text-gray-600">
              Revise after feedback; best score counts. Mastery target: {MASTERY_TARGET}%.
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800"
            aria-live="polite"
          >
            Best: {bestScore}%
          </span>
        </header>

        {/* Mastery progress */}
        <section className="rounded-md border border-gray-100 p-2">
          <p className="text-xs font-medium text-gray-800">Mastery progress</p>
          <div
            className="mt-1 h-2 w-full rounded-full bg-gray-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={MASTERY_TARGET}
            aria-valuenow={bestScore}
            aria-label="Progress to mastery target"
          >
            <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-gray-700">
            {bestScore}% of {MASTERY_TARGET}% • Attempts left: {attemptsLeft}
          </p>
        </section>

        {/* Attempts list */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="giags-attempts">
          <h2 id="giags-attempts" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Attempts (best score counts)
          </h2>
          <ul className="divide-y divide-gray-100">
            {attempts.map((a) => (
              <li key={a.id} className="px-3 py-2 flex items-start gap-2">
                <ScoreBadge value={a.score} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-900">
                    Attempt {a.id} <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-600">{formatFriendly(a.submittedAt)}</span>
                  </p>
                  {a.id === 1 ? (
                    <ul className="mt-1 list-disc pl-5 text-[11px] text-gray-800">
                      {FEEDBACK.map((f) => (
                        <li key={f.id}>{f.text}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[11px] text-gray-700">
                      Addressed:{" "}
                      {a.addressed.length > 0 ? a.addressed.map((id) => findFeedbackText(id)).join("; ") : "—"}
                    </p>
                  )}
                  {a.reflection && (
                    <details className="mt-1 rounded border border-gray-200 bg-gray-50 p-2">
                      <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                        Reflection
                      </summary>
                      <p className="mt-1 text-[11px] text-gray-800">{a.reflection}</p>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Revise action */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startRevision}
            disabled={openRevise || attemptsLeft <= 0 || bestScore >= MASTERY_TARGET}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {bestScore >= MASTERY_TARGET ? "Mastery reached" : attemptsLeft > 0 ? "Revise now" : "No attempts left"}
          </button>
          <span className="text-[11px] text-gray-600">
            Policy: best-of attempts; feedback-driven improvement.
          </span>
        </div>

        {/* Revision form */}
        {openRevise && (
          <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="giags-revise">
            <h3 id="giags-revise" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
              Submit a revision (check what you improved)
            </h3>
            <div className="px-3 py-2 grid grid-cols-1 gap-2">
              <fieldset className="text-xs">
                <legend className="text-gray-800">Addressed feedback</legend>
                <div className="mt-1 grid grid-cols-1 gap-2">
                  {FEEDBACK.map((f) => (
                    <label key={f.id} className="inline-flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={!!checked[f.id]}
                        onChange={() => toggleCheck(f.id)}
                      />
                      <span className="text-gray-900">{f.text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="text-xs">
                <span className="text-gray-800">Reflection (what changed & why)</span>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="mt-1 h-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="In 2–3 sentences, explain the revision (≥ 40 chars for a small bonus)."
                />
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-600">Predicted score:</span>
                <ScoreBadge value={predicted} />
                <span className="text-[11px] text-gray-600">
                  (from last {attempts[attempts.length - 1].score}% + improvements)
                </span>
                <button
                  type="button"
                  onClick={submitRevision}
                  className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit revision
                </button>
                <button
                  type="button"
                  onClick={() => setOpenRevise(false)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ UI helpers ------------------------------ */

function ScoreBadge({ value }: { value: number }) {
  const tone =
    value >= MASTERY_TARGET
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-gray-50 text-gray-800 border-gray-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm ${tone}`}>
      {value.toFixed(0)}%
    </span>
  );
}

/* ------------------------------- utils ------------------------------- */

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
function isoNow() {
  return new Date().toISOString();
}
function formatFriendly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" });
}
function findFeedbackText(id: string) {
  const f = FEEDBACK.find((x) => x.id === id);
  return f ? f.text : id;
}
