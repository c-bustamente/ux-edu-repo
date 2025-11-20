"use client";

import { useMemo, useState } from "react";

/**
 * Mistake — Intentional Error Lab (compact)
 * Ask learners to PURPOSELY insert a specific error, observe the effect, and reflect on the diagnosis.
 * Fits in a card; small code panes; inline feedback; copyable reflection JSON.
 *
 * Cases included (education context: LMS utilities):
 * 1) Off-by-one average (loop bound)  → NaN/undefined access
 * 2) Missing await in async save      → wrong log order / race
 * 3) Loose vs strict equality         → unexpected matches
 */

type CaseId = "offByOne" | "missingAwait" | "looseEquality";

type MistakeCase = {
  id: CaseId;
  title: string;
  context: string;
  baseCode: string;
  mistakeCode: string;
  testDesc: string;
  expectedOutcome: string;
  observedOutcome: string;
  diagnostics: string[];
  checklist: string[]; // recognition cues
};

const CASES: MistakeCase[] = [
  {
    id: "offByOne",
    title: "Average grades — off-by-one in loop bound",
    context:
      "Utility that averages quiz grades. A common bug iterates one step past the array end.",
    baseCode: `function average(grades: number[]): number {
  if (grades.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < grades.length; i++) { sum += grades[i]; }
  return sum / grades.length;
}`,
    mistakeCode: `function average(grades: number[]): number {
  if (grades.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i <= grades.length; i++) { // <= BUG
    sum += grades[i]; // grades[grades.length] is undefined → NaN
  }
  return sum / (grades.length); // looks fine but avg becomes NaN
}`,
    testDesc: "Input [10, 0] should average to 5.",
    expectedOutcome: "Expected: 5",
    observedOutcome: "Observed with mistake: NaN (added undefined)",
    diagnostics: [
      "Accessing grades[grades.length] returns undefined.",
      "Adding undefined to a number yields NaN.",
      "Symptom: average is NaN; console may not show a thrown error.",
    ],
    checklist: [
      "Look for <= where < is intended.",
      "Undefined creeping into numeric sums.",
      "Unit test on small arrays (len 1–3).",
    ],
  },
  {
    id: "missingAwait",
    title: "Save grade — missing await (floating promise)",
    context:
      "Async save function in LMS; forgetting await yields out-of-order logs and potential data loss on navigation.",
    baseCode: `async function saveGrade(g: number): Promise<void> {
  await saveGradeAsync(g);
  console.log("Saved grade");
}`,
    mistakeCode: `async function saveGrade(g: number): Promise<void> {
  saveGradeAsync(g); // BUG: missing await
  console.log("Saved grade"); // logs before network actually finishes
}`,
    testDesc: `Call saveGrade(90) → expect "Saved grade" AFTER network completes.`,
    expectedOutcome: `Expected log order: [network done] → "Saved grade"`,
    observedOutcome: `Observed with mistake: "Saved grade" → [network still pending]`,
    diagnostics: [
      "Promise not awaited; code continues immediately.",
      "Race on navigation/teardown can cancel the request.",
      "Symptom: logs/firehose show 'Saved' before the request finishes.",
    ],
    checklist: [
      "Search for async calls lacking await.",
      "Confirm with explicit log timestamps.",
      "Use page hide/visibility handlers if needed.",
    ],
  },
  {
    id: "looseEquality",
    title: "Check access — loose vs strict equality",
    context:
      "Gate access to instructor tools by comparing a string id; using == can permit unintended truthy matches.",
    baseCode: `function canAccess(role: string, userId: string) {
  return role === "instructor" && userId === "42";
}`,
    mistakeCode: `function canAccess(role: string, userId: any) {
  // BUG: loose equality allows 42 (number) to match "42"
  return role == "instructor" && userId == "42";
}`,
    testDesc: `Input role = "instructor", userId = 42 (number).`,
    expectedOutcome: `Expected: false (types must match).`,
    observedOutcome: `Observed with mistake: true (coerced equality).`,
    diagnostics: [
      "Loose equality (==) coerces types.",
      "Security/logic risk when ids are compared across types.",
      "Symptom: numeric 42 passes a string check.",
    ],
    checklist: [
      "Prefer '===' and consistent types.",
      "Validate and normalize inputs at boundaries.",
      "Log comparisons in tests with types visible.",
    ],
  },
];

export default function ExampleMistake() {
  const [active, setActive] = useState<CaseId>("offByOne");
  const [makeMistake, setMakeMistake] = useState<boolean>(true);
  const [reflection, setReflection] = useState<string>("");
  const c = useMemo(() => CASES.find((x) => x.id === active)!, [active]);

  const code = makeMistake ? c.mistakeCode : c.baseCode;

  const cues = c.checklist;
  const diag = c.diagnostics;

  function copyReflection() {
    const payload = {
      pattern: "Mistake",
      caseId: c.id,
      title: c.title,
      madeMistake: makeMistake,
      testDesc: c.testDesc,
      expectedOutcome: c.expectedOutcome,
      observedOutcome: c.observedOutcome,
      notes: reflection,
      recognitionCuesChecked: cues,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="mistake-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="mistake-title" className="text-lg font-semibold tracking-tight">
              Mistake — Learn by Making (and Fixing) Errors
            </h1>
            <p className="text-xs text-gray-600">
              Intentionally introduce a specific error, observe the effect, then fix and reflect.
            </p>
          </div>
          <select
            value={active}
            onChange={(e) => setActive(e.target.value as CaseId)}
            aria-label="Choose mistake case"
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="offByOne">Off-by-one</option>
            <option value="missingAwait">Missing await</option>
            <option value="looseEquality">Loose vs strict</option>
          </select>
        </header>

        {/* Context */}
        <section className="rounded-md border border-gray-100 p-2">
          <p className="text-xs font-medium text-gray-800">{c.title}</p>
          <p className="mt-0.5 text-[11px] text-gray-700">{c.context}</p>
        </section>

        {/* Toggle mistake / fix */}
        <section className="mt-2 rounded-md border border-gray-100">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-xs font-medium text-gray-700">Artifact (toggle between mistake and fix)</p>
            <div className="flex items-center gap-2">
              <label className="text-xs inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={makeMistake}
                  onChange={(e) => setMakeMistake(e.target.checked)}
                />
                Make the mistake
              </label>
            </div>
          </div>
          <pre className="mx-3 mb-3 max-h-40 overflow-auto whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-2 font-mono text-[11px] text-gray-800">
{code}
          </pre>
        </section>

        {/* Test & output */}
        <section className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <figure className="rounded-md border border-gray-100 p-2">
            <figcaption className="text-xs font-medium text-gray-700">Test</figcaption>
            <p className="mt-1 text-[11px] text-gray-800">{c.testDesc}</p>
            <p className="mt-1 text-[11px] text-gray-600">{c.expectedOutcome}</p>
          </figure>
          <figure className="rounded-md border border-gray-100 p-2">
            <figcaption className="text-xs font-medium text-gray-700">Observed</figcaption>
            <p
              className={`mt-1 text-[11px] ${
                makeMistake ? "text-rose-700" : "text-green-700"
              }`}
              aria-live="polite"
            >
              {makeMistake ? c.observedOutcome : "Matches expected result"}
            </p>
            <ul className="mt-1 list-disc pl-5 text-[11px] text-gray-700">
              {(makeMistake ? diag : ["Fix applied. Re-run tests: outcome aligns with expectation."]).map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </figure>
        </section>

        {/* Recognition cues (inline feedback) */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="cues-title">
          <h2 id="cues-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Recognition cues (what to look for)
          </h2>
          <ul className="divide-y divide-gray-100">
            {cues.map((item, i) => (
              <li key={i} className="px-3 py-2 text-sm flex items-start gap-2">
                <Dot ok={!makeMistake} />
                <span className="text-gray-900">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Reflection */}
        <section className="mt-2 rounded-md border border-gray-100 p-2">
          <label className="text-xs font-medium text-gray-800" htmlFor="reflect">
            Reflection (what did the error teach you?)
          </label>
          <textarea
            id="reflect"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="mt-1 h-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., I recognized NaN from undefined addition; I’ll add unit tests for length 1 and 2."
          />
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[11px] text-gray-600">{reflection.length} chars</span>
            <button
              type="button"
              onClick={copyReflection}
              className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Copy Reflection (JSON)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ UI bits ------------------------------ */
function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 inline-block h-2 w-2 rounded-full ${ok ? "bg-green-600" : "bg-rose-600"}`}
    />
  );
}
