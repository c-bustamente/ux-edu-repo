"use client";

import { useMemo, useState } from "react";

/**
 * Fill in the Blanks — Guided Practice (compact)
 * Scenario: quick cloze items across intro topics (statistics, physics, programming).
 * - Recognition over recall: focused hints, minimal UI.
 * - Inline feedback with keyboard-friendly inputs.
 * - Compact card (max-w-lg), mobile-friendly.
 */

type FieldKind = "text" | "number";
type Field = {
  id: string;
  kind: FieldKind;
  placeholder?: string;
  answers: string[];       // accepted answers (normalized)
  aliases?: string[];      // additional accepted values
};
type StemToken = string | { field: string };
type ClozeItem = {
  id: string;
  title: string;
  stem: StemToken[];
  fields: Field[];
  hint?: string;
};

const ITEMS: ClozeItem[] = [
  {
    id: "stats-mean",
    title: "Mean of a small set",
    stem: ["The mean of 2, 4, 6 is ", { field: "mean" }, "."],
    fields: [
      { id: "mean", kind: "number", placeholder: "?", answers: ["4"] },
    ],
    hint: "Add them up and divide by how many values there are.",
  },
  {
    id: "physics-newton2",
    title: "Newton’s Second Law",
    stem: ["Newton’s second law: F = m × ", { field: "accel" }, "."],
    fields: [
      { id: "accel", kind: "text", placeholder: "symbol or term", answers: ["a"], aliases: ["acceleration"] },
    ],
    hint: "Think of the symbol often paired with mass in basic dynamics.",
  },
  {
    id: "js-strict-eq",
    title: "JavaScript strict equality",
    stem: ["In JavaScript, strict equality is written as ", { field: "op" }, "."],
    fields: [
      { id: "op", kind: "text", placeholder: "operator", answers: ["==="] },
    ],
    hint: "It compares both value and type.",
  },
];

type ValuesMap = Record<string, string>;
type ResultMap = Record<string, boolean | null>;

export default function ExampleFillInTheBlanks() {
  const [activeId, setActiveId] = useState<string>(ITEMS[0].id);
  const [values, setValues] = useState<ValuesMap>({});
  const [results, setResults] = useState<ResultMap>({});
  const [checked, setChecked] = useState(false);

  const item = useMemo(() => ITEMS.find((i) => i.id === activeId)!, [activeId]);

  function normalize(s: string, kind: FieldKind): string {
    if (kind === "number") {
      const n = Number(String(s).trim().replace(",", "."));
      return Number.isFinite(n) ? String(n) : String(s).trim();
    }
    return String(s).trim().toLowerCase();
  }

  function isCorrect(field: Field, raw: string): boolean {
    const v = normalize(raw, field.kind);
    const accepted = new Set([
      ...field.answers.map((a) => normalize(a, field.kind)),
      ...(field.aliases ?? []).map((a) => normalize(a, field.kind)),
    ]);
    return accepted.has(v);
  }

  function onType(fieldId: string, v: string) {
    setChecked(false);
    setValues((prev) => ({ ...prev, [fieldId]: v }));
    setResults((prev) => ({ ...prev, [fieldId]: null }));
  }

  function onCheck() {
    const r: ResultMap = {};
    item.fields.forEach((f) => {
      r[f.id] = isCorrect(f, values[f.id] ?? "");
    });
    setResults(r);
    setChecked(true);
  }

  function onReset() {
    setValues({});
    setResults({});
    setChecked(false);
  }

  function onShowSolutions() {
    const filled: ValuesMap = {};
    item.fields.forEach((f) => {
      filled[f.id] = f.answers[0];
    });
    setValues(filled);
    const r: ResultMap = {};
    item.fields.forEach((f) => (r[f.id] = true));
    setResults(r);
    setChecked(true);
  }

  const numCorrect = item.fields.filter((f) => results[f.id] === true).length;
  const total = item.fields.length;

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="fib-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Header */}
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="fib-title" className="text-lg font-semibold tracking-tight">
              Fill in the Blanks — Guided Practice
            </h1>
            <p className="text-xs text-gray-600">Complete each prompt; check answers and review hints as needed.</p>
          </div>
          <select
            value={activeId}
            onChange={(e) => {
              setActiveId(e.target.value);
              onReset();
            }}
            aria-label="Choose exercise"
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ITEMS.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
        </header>

        {/* Prompt */}
        <section className="rounded-md border border-gray-100 p-2" aria-labelledby="fib-prompt">
          <h2 id="fib-prompt" className="sr-only">Prompt</h2>
          <p className="text-sm text-gray-900">
            {item.stem.map((t, idx) =>
              typeof t === "string" ? (
                <span key={idx}>{t}</span>
              ) : (
                <InlineField
                  key={t.field}
                  field={item.fields.find((f) => f.id === t.field)!}
                  value={values[t.field] ?? ""}
                  result={results[t.field] ?? null}
                  onChange={(v) => onType(t.field, v)}
                />
              )
            )}
          </p>
          {item.hint && (
            <details className="mt-2 rounded border border-amber-200 bg-amber-50 p-2">
              <summary className="cursor-pointer text-xs font-medium text-amber-900 outline-none focus:ring-2 focus:ring-amber-400 rounded">
                Need a hint?
              </summary>
              <p className="mt-1 text-[11px] text-amber-900">{item.hint}</p>
            </details>
          )}
        </section>

        {/* Actions */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCheck}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Check answers
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onShowSolutions}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Show solution
          </button>

          <span
            className={`ml-auto inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] ${
              checked && numCorrect === total
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-100 text-gray-800 border-gray-300"
            }`}
            aria-live="polite"
          >
            {checked ? `${numCorrect}/${total} correct` : "Not checked"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- UI bits ------------------------------- */

function InlineField({
  field,
  value,
  result,
  onChange,
}: {
  field: Field;
  value: string;
  result: boolean | null;
  onChange: (v: string) => void;
}) {
  // Visual feedback icon
  const Icon =
    result === null ? DotNeutral : result ? DotOk : DotErr;

  return (
    <span className="inline-flex items-center gap-1 align-baseline">
      <label className="sr-only" htmlFor={`fld-${field.id}`}>
        {field.id}
      </label>
      <input
        id={`fld-${field.id}`}
        inputMode={field.kind === "number" ? "decimal" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? "?"}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-invalid={result === false}
        aria-describedby={result === false ? `err-${field.id}` : undefined}
      />
      <Icon />
      {result === false && (
        <span id={`err-${field.id}`} className="sr-only">
          Incorrect value
        </span>
      )}
    </span>
  );
}

function DotOk() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-green-600">
      <path d="M7.5 13.5 3.8 9.8l1.4-1.4 2.3 2.3 6.3-6.3 1.4 1.4-7.7 7.7Z" />
    </svg>
  );
}
function DotErr() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-rose-600">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function DotNeutral() {
  return <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-gray-400" />;
}
