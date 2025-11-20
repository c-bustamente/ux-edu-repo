// 3) src/components/pattern-examples/ExampleConsistentMetaphor.tsx (compact FIX)
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Consistent Metaphor — Compact
 * Goal: keep the essence while fitting inside a pattern card.
 * - Pick a familiar base (basis known to students).
 * - Show a SMALL mapping (expandable).
 * - One quick “inference check” to validate the metaphor.
 * - Call out limits to avoid overgeneralization.
 * Distinct color scheme: cyan/sky.
 */

type MetaphorId = "blueprint" | "postal";
type Mapping = { tech: string; meta: string };
type Question = { prompt: string; choices: string[]; correctIdx: number; explain: string };

type Metaphor = {
  id: MetaphorId;
  name: string;
  color: {
    pillBg: string;
    pillText: string;
    pillBorder: string;
    progress: string;
    ring: string;
  };
  mapping: Mapping[]; // ordered by importance
  question: Question; // single compact check
  limits: string[];   // concise limits
  tagline: string;
};

const STORAGE_KEY = "uxedu.ped.consistentMetaphor.compact.v1";

const METAPHORS: Metaphor[] = [
  {
    id: "blueprint",
    name: "Workshop/Blueprint",
    color: {
      pillBg: "bg-sky-50",
      pillText: "text-sky-800",
      pillBorder: "border-sky-200",
      progress: "bg-cyan-600",
      ring: "focus:ring-cyan-500",
    },
    mapping: [
      { tech: "Class",         meta: "Blueprint" },
      { tech: "Object",        meta: "Built item" },
      { tech: "Method",        meta: "Tool operation" },
      { tech: "Message/Call",  meta: "Request to use a tool" },
      { tech: "Encapsulation", meta: "Casing: use it, don’t rewire internals" },
      { tech: "Inheritance",   meta: "Derived blueprint extends a base" },
      { tech: "Polymorphism",  meta: "Same request, specialized tools" },
    ],
    question: {
      prompt: "You send the same request to different items and each uses its own specialized tool. In OO terms that’s…",
      choices: ["Encapsulation", "Polymorphism", "Overloading only"],
      correctIdx: 1,
      explain: "Polymorphism ≈ same request, behavior depends on the receiver’s specialized tool.",
    },
    limits: [
      "Real blueprints don’t update at runtime; code can.",
      "Casing isn’t absolute—access is controlled, not impossible.",
    ],
    tagline: "Classes as blueprints; objects as built items; messages as tool requests.",
  },
  {
    id: "postal",
    name: "Postal Service",
    color: {
      pillBg: "bg-sky-50",
      pillText: "text-sky-800",
      pillBorder: "border-sky-200",
      progress: "bg-cyan-700",
      ring: "focus:ring-cyan-600",
    },
    mapping: [
      { tech: "Object",        meta: "Mailbox + resident (addressable endpoint)" },
      { tech: "Message/Call",  meta: "Letter/request sent to an address" },
      { tech: "Interface",     meta: "Formats the mailbox accepts" },
      { tech: "Method",        meta: "Resident’s routine when opening" },
      { tech: "Encapsulation", meta: "Slot allows delivery, not peeking inside" },
      { tech: "Polymorphism",  meta: "Different homes handle same letter differently" },
    ],
    question: {
      prompt: "You can deliver letters but not see inside the home. This best represents…",
      choices: ["Encapsulation", "Multiple inheritance", "Garbage collection"],
      correctIdx: 0,
      explain: "Encapsulation ≈ interact via the slot; internals remain hidden.",
    },
    limits: [
      "Postal delivery is slow; method calls are immediate (same process).",
      "Addresses in code are references; postal addresses are physical.",
    ],
    tagline: "Objects have addresses; messages are letters; handlers act on delivery.",
  },
];

/** Small helpers */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as { chosen: MetaphorId; answer: number | null; showAll: boolean }) : null;
  } catch { return null; }
}
function save(state: { chosen: MetaphorId; answer: number | null; showAll: boolean }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export default function ExampleConsistentMetaphor() {
  const persisted = load();
  const [familiar, setFamiliar] = useState<MetaphorId>(persisted?.chosen ?? "blueprint"); // “basis known”
  const [chosen, setChosen] = useState<MetaphorId>(persisted?.chosen ?? "blueprint");
  const [answer, setAnswer] = useState<number | null>(persisted?.answer ?? null);
  const [showAll, setShowAll] = useState<boolean>(persisted?.showAll ?? false);

  const m = useMemo(() => METAPHORS.find(x => x.id === chosen)!, [chosen]);

  useEffect(() => { save({ chosen, answer, showAll }); }, [chosen, answer, showAll]);

  const mappingList = useMemo(() => (showAll ? m.mapping : m.mapping.slice(0, 3)), [m, showAll]);
  const isCorrect = answer !== null && answer === m.question.correctIdx;

  return (
    <div className="w-full max-w-md mx-auto" aria-labelledby="cm-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="cm-title" className="text-lg font-semibold tracking-tight">Consistent Metaphor</h1>
            <p className="text-xs text-gray-600">Pick a familiar base; use it consistently to enable valid inferences.</p>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${m.color.pillBg} ${m.color.pillText} ${m.color.pillBorder}`}>
            {m.name}
          </span>
        </header>

        {/* 1) Familiarity → choose metaphor (kept tiny) */}
        <div className="rounded-md border border-gray-100 p-2">
          <fieldset className="text-xs">
            <legend className="mb-1 text-gray-800">Which base is more familiar?</legend>
            <div className="flex flex-wrap gap-3">
              {METAPHORS.map(opt => (
                <label key={opt.id} className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="fam"
                    checked={familiar === opt.id}
                    onChange={() => { setFamiliar(opt.id); setChosen(opt.id); }}
                    className="h-4 w-4"
                  />
                  <span>{opt.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* 2) Small mapping (expandable) */}
        <section className="mt-2 rounded-md border border-gray-100">
          <h2 className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">Mapping (technical → metaphor)</h2>
          <ul className="divide-y divide-gray-100 max-h-36 overflow-auto">
            {mappingList.map(row => (
              <li key={row.tech} className="px-3 py-2 text-sm flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-[11px] text-gray-800">{row.tech}</span>
                <Arrow />
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${m.color.pillBg} ${m.color.pillText} ${m.color.pillBorder}`}>{row.meta}</span>
              </li>
            ))}
          </ul>
          <div className="px-3 py-2 flex items-center justify-between">
            <p className="text-[11px] text-gray-600 truncate">{m.tagline}</p>
            <button
              type="button"
              onClick={() => setShowAll(s => !s)}
              className={`rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 hover:bg-gray-50 ${m.color.ring}`}
            >
              {showAll ? "Show less" : "Show all"}
            </button>
          </div>
        </section>

        {/* 3) One inference check (very compact) */}
        <section className="mt-2 rounded-md border border-gray-100 p-2">
          <h2 className="text-sm font-medium text-gray-900">Inference check</h2>
          <p className="mt-0.5 text-xs text-gray-700">{m.question.prompt}</p>
          <ul className="mt-1 space-y-1">
            {m.question.choices.map((c, i) => {
              const selected = answer === i;
              const tone =
                answer === null ? "border-gray-300 bg-white"
                : selected && isCorrect ? "border-green-600 bg-green-50"
                : selected && !isCorrect ? "border-rose-600 bg-rose-50"
                : "border-gray-300 bg-white";
              return (
                <li key={i}>
                  <label className={`flex items-start gap-2 rounded-md border px-2 py-1 text-sm ${tone}`}>
                    <input
                      type="radio"
                      name="inf"
                      checked={selected}
                      onChange={() => setAnswer(i)}
                      className="mt-0.5 h-4 w-4"
                      aria-checked={selected}
                    />
                    <span className="text-gray-900">{c}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          {/* tiny progress bar */}
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-gray-200" role="progressbar" aria-label="Inference score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={answer === null ? 0 : isCorrect ? 100 : 0}>
              <div className={`h-1.5 rounded-full ${m.color.progress}`} style={{ width: `${answer === null ? 0 : isCorrect ? 100 : 0}%` }} />
            </div>
            {answer !== null && (
              <p className={`mt-1 text-[11px] ${isCorrect ? "text-green-700" : "text-rose-700"}`}>{m.question.explain}</p>
            )}
          </div>
        </section>

        {/* 4) Limits (collapsible, short) */}
        <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-gray-400 rounded">Limits of the metaphor</summary>
          <ul className="mt-1 list-disc pl-5 text-xs text-gray-700">
            {m.limits.map((l, i) => (<li key={i}>{l}</li>))}
          </ul>
          <p className="mt-1 text-[11px] text-gray-600">Use the metaphor for intuition; verify with formal definitions.</p>
        </details>
      </div>
    </div>
  );
}

/** tiny icon */
function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gray-400">
      <path d="M7 3l7 7-7 7-1.4-1.4L10.2 10 5.6 4.4 7 3z" />
    </svg>
  );
}
