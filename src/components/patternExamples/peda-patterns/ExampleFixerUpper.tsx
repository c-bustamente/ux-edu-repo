"use client";

import { useMemo, useState } from "react";

/**
 * Fixer Upper — Compact Repair Exercise
 * Give learners a generally sound artifact with purposeful flaws; ask them to repair it.
 * This example uses a tiny TypeScript utility from an LMS context (“grade summary”).
 * Learners edit the code, run static checks (no external deps), reveal hints, and compare to a suggested patch.
 * Dimensions: compact card, scroll-limited code areas.
 */

type Check = {
  id: string;
  title: string;
  desc: string;
  pass: boolean | null; // null before running
};

const FLAWED = `// calculateGradeSummary.ts (flawed starter)
// Goal: return average grade and pass/fail for a course
// NOTE: Intentionally contains issues to fix.

function calculateGradeSummary(grades: number[]) {
  // TODO: handle empty input properly?
  let sum = 0;
  for (const g of grades) { sum += g; }

  // TEMP: ensure non-empty to avoid division by zero
  grades.push(0); // <- mutate input (bad)

  const avg = sum / (grades.length + 1); // <- off-by-one denominator
  const pass = avg >= 60; // <- magic number threshold

  return { avg, pass };
}

export { calculateGradeSummary };`;

const FIXED = `// calculateGradeSummary.ts (suggested patch)
export type GradeSummary = { avg: number; pass: boolean };

/**
 * Calculate course grade summary.
 * - No input mutation
 * - Safe empty handling
 * - Explicit return type
 * - Configurable pass threshold (default 60)
 */
function calculateGradeSummary(
  grades: number[],
  passThreshold = 60
): GradeSummary {
  if (grades.length === 0) {
    return { avg: 0, pass: false };
  }
  let sum = 0;
  for (const g of grades) { sum += g; }
  const avg = sum / grades.length;
  const pass = avg >= passThreshold;
  return { avg, pass };
}

export { calculateGradeSummary };`;

export default function ExampleFixerUpper() {
  const [code, setCode] = useState<string>(FLAWED);
  const [ran, setRan] = useState(false);
  const checks = useMemo(() => runChecks(code), [code]);

  const passedAll = checks.every((c) => c.pass === true);
  const passCount = checks.filter((c) => c.pass).length;

  function onRun() {
    setRan(true);
  }
  function onReset() {
    setCode(FLAWED);
    setRan(false);
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="fx-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="fx-title" className="text-lg font-semibold tracking-tight">
            Fixer Upper — Repair the Flaws
          </h1>
          <p className="text-xs text-gray-600">
            Edit the code to pass the checklist. Then compare with the suggested patch and discuss trade-offs.
          </p>
        </header>

        {/* 1) The artifact (editable) */}
        <section className="rounded-md border border-gray-100" aria-labelledby="fx-artifact">
          <h2 id="fx-artifact" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Artifact: grade summary utility (editable)
          </h2>
          <div className="p-2">
            <label htmlFor="fx-editor" className="sr-only">Code editor</label>
            <textarea
              id="fx-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-48 rounded-md border border-gray-300 px-3 py-2 font-mono text-[12px] leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              spellCheck={false}
              aria-describedby="fx-editor-help"
            />
            <p id="fx-editor-help" className="mt-1 text-[11px] text-gray-600">
              Fix issues without changing overall intent. Keep it readable and reusable.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 px-2 pb-2">
            <button
              type="button"
              onClick={onRun}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Run checks
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset to flawed
            </button>
            <span
              className={`ml-auto inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] ${
                passedAll && ran
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              aria-live="polite"
            >
              {ran ? `${passCount}/${CHECK_TITLES.length} checks` : "Not evaluated"}
            </span>
          </div>
        </section>

        {/* 2) Checklist results */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="fx-checks">
          <h2 id="fx-checks" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Checks (static analysis)
          </h2>
          <ul className="divide-y divide-gray-100">
            {checks.map((c) => (
              <li key={c.id} className="px-3 py-2 text-sm flex items-start gap-2">
                <StatusIcon status={!ran ? "idle" : c.pass ? "pass" : "fail"} />
                <div className="min-w-0">
                  <p className="text-gray-900">{c.title}</p>
                  <p className="text-[11px] text-gray-600">{c.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 3) Hints & Suggested Patch (progressive disclosure) */}
        <div className="mt-2 grid grid-cols-1 gap-2">
          <details className="rounded-md border border-amber-200 bg-amber-50 p-2">
            <summary className="cursor-pointer text-xs font-medium text-amber-900 outline-none focus:ring-2 focus:ring-amber-400 rounded">
              Hints (open if you’re stuck)
            </summary>
            <ul className="mt-1 list-disc pl-5 text-[11px] text-amber-900">
              <li>Don’t change <em>what</em> it does—fix <em>how</em> it does it (safety, reusability).</li>
              <li>Guard for empty input before computing the average.</li>
              <li>Never mutate parameters passed in (no <code>grades.push</code>).</li>
              <li>Make pass/fail configurable; avoid magic numbers.</li>
              <li>Declare a return type; aim for a small typed object.</li>
            </ul>
          </details>

          <details className="rounded-md border border-gray-200 bg-gray-50 p-2">
            <summary className="cursor-pointer text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-gray-400 rounded">
              Suggested patch (one of many valid fixes)
            </summary>
            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded border border-gray-200 bg-white p-2 font-mono text-[11px] text-gray-800">
{FIXED}
            </pre>
          </details>

          <details className="rounded-md border border-teal-200 bg-teal-50 p-2">
            <summary className="cursor-pointer text-xs font-medium text-teal-900 outline-none focus:ring-2 focus:ring-teal-400 rounded">
              Debrief prompts
            </summary>
            <ul className="mt-1 list-disc pl-5 text-[11px] text-teal-900">
              <li>Which flaws were “surface” (compiler-catchable) vs. “semantic”?</li>
              <li>What trade-offs did you make for readability vs. flexibility?</li>
              <li>How would you extend checks to include performance or accessibility?</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Logic ------------------------------- */

const CHECK_TITLES = [
  "No input mutation",
  "Correct average denominator",
  "Safe empty-input handling",
  "Explicit return type",
  "Configurable pass threshold",
] as const;

function runChecks(code: string): Check[] {
  // Normalize whitespace a bit for simpler regex matching
  const src = code.replace(/\s+/g, " ");

  const noMutation = !/\bgrades\.(push|pop|splice|shift|unshift|sort)\s*\(/.test(src);
  const correctDenom = !/grades\.length\s*\+\s*1/.test(src) && /\/\s*grades\.length\b/.test(src);
  const emptyGuard = /\bif\s*\(\s*grades\.length\s*===?\s*0\s*\)/.test(src);
  const explicitReturn =
    /function\s+calculateGradeSummary\s*\([\s\S]*\)\s*:\s*\{/.test(code) ||
    /:\s*GradeSummary/.test(code) ||
    /export\s+type\s+GradeSummary/.test(code);
  const configurableThreshold = /\bpassThreshold\b/.test(code) || /\boptions\s*:\s*\{[^}]*threshold/.test(code);

  const results: Check[] = [
    {
      id: "mut",
      title: CHECK_TITLES[0],
      desc: "Function should not modify the input array (no grades.push/pop/splice/sort…).",
      pass: noMutation,
    },
    {
      id: "den",
      title: CHECK_TITLES[1],
      desc: "Average must divide by grades.length (no off-by-one fixes).",
      pass: correctDenom,
    },
    {
      id: "emp",
      title: CHECK_TITLES[2],
      desc: "Handle empty input (return neutral summary instead of dividing by zero).",
      pass: emptyGuard,
    },
    {
      id: "ret",
      title: CHECK_TITLES[3],
      desc: "Use an explicit TypeScript return type (e.g., GradeSummary).",
      pass: explicitReturn,
    },
    {
      id: "thr",
      title: CHECK_TITLES[4],
      desc: "Avoid magic number 60; make the pass threshold configurable.",
      pass: configurableThreshold,
    },
  ];

  return results;
}

/* ------------------------------ UI bits ------------------------------ */

function StatusIcon({ status }: { status: "idle" | "pass" | "fail" }) {
  if (status === "pass") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 text-green-600">
        <path d="M7.5 13.5 3.8 9.8l1.4-1.4 2.3 2.3 6.3-6.3 1.4 1.4-7.7 7.7Z" />
      </svg>
    );
  }
  if (status === "fail") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 text-rose-600">
        <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 text-gray-400">
      <circle cx="10" cy="10" r="4" />
    </svg>
  );
}
