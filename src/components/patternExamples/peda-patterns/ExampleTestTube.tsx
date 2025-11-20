// 3) src/components/pattern-examples/ExampleTestTube.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Test Tube — Safe Experiment Sandbox (compact)
 * Scenario: “Grade Policy Simulator” for an LMS course.
 * Learners can tweak policy knobs (weights, drop-lowest, late penalty, rounding) and
 * immediately see outcomes on sample students — with an upfront “no-stakes” guarantee.
 * - Fits in a card (max-w-lg)
 * - Keyboard/ARIA friendly
 * - No persistence unless explicitly copied
 */

type Rounding = "none" | "nearest" | "floor";
type Config = {
  weights: { assignments: number; quizzes: number; exams: number }; // arbitrary totals; we normalize
  dropLowestAssignment: boolean;
  latePenaltyPct: number; // 0–30
  rounding: Rounding;
};

type ScenarioId = "starter" | "improver" | "quizAce";
type Scenario = {
  id: ScenarioId;
  name: string;
  data: { assignments: number[]; quizzes: number[]; exams: number[] };
  note: string;
};

type Breakdown = {
  final: number;
  normalizedWeights: Config["weights"];
  parts: { assignments: number; quizzes: number; exams: number };
};

const SCENARIOS: Scenario[] = [
  {
    id: "starter",
    name: "Balanced learner",
    note: "Consistent performance across categories.",
    data: {
      assignments: [80, 85, 90, 75, 95],
      quizzes: [70, 88, 92],
      exams: [78, 84],
    },
  },
  {
    id: "improver",
    name: "Improves over time",
    note: "Weak start, strong finish (drop-lowest helps).",
    data: {
      assignments: [50, 60, 70, 85, 95],
      quizzes: [55, 60, 65],
      exams: [70, 88],
    },
  },
  {
    id: "quizAce",
    name: "Quiz specialist",
    note: "High quizzes, low exams.",
    data: {
      assignments: [70, 72, 68, 74, 76],
      quizzes: [95, 97, 90],
      exams: [50, 55],
    },
  },
];

const BASELINE: Config = {
  weights: { assignments: 40, quizzes: 20, exams: 40 },
  dropLowestAssignment: false,
  latePenaltyPct: 0,
  rounding: "none",
};

export default function ExampleTestTube() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("starter");
  const [cfg, setCfg] = useState<Config>(BASELINE);

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId)!,
    [scenarioId]
  );

  const baselineResult = useMemo(
    () => compute(BASELINE, scenario.data),
    [scenario]
  );
  const sandboxResult = useMemo(() => compute(cfg, scenario.data), [cfg, scenario]);

  const delta = Math.round((sandboxResult.final - baselineResult.final) * 10) / 10;
  const weightsNormalized =
    sum(BASELINE.weights) !== sum(cfg.weights) ||
    JSON.stringify(normalize(cfg.weights)) !== JSON.stringify(cfg.weights);

  function updateWeight(key: keyof Config["weights"], value: number) {
    setCfg((c) => ({ ...c, weights: { ...c.weights, [key]: clamp(value, 0, 100) } }));
  }

  function quickSet(kind: "dropLowest" | "examHeavy" | "latePenalty") {
    if (kind === "dropLowest") {
      setCfg((c) => ({ ...c, dropLowestAssignment: true }));
    } else if (kind === "examHeavy") {
      setCfg((c) => ({ ...c, weights: { assignments: 30, quizzes: 20, exams: 50 } }));
    } else {
      setCfg((c) => ({ ...c, latePenaltyPct: 10 }));
    }
  }

  async function copyConfig() {
    const payload = {
      pattern: "Test Tube",
      scenario: scenario.name,
      note: scenario.note,
      baseline: BASELINE,
      sandbox: cfg,
      results: {
        baseline: baselineResult.final,
        sandbox: sandboxResult.final,
        delta,
      },
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="tt-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="tt-title" className="text-lg font-semibold tracking-tight">Test Tube — Grade Policy Simulator</h1>
            <p className="text-xs text-gray-600">
              Safe sandbox: experiments here don’t affect real grades. Try what-ifs and observe outcomes.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] text-teal-800">
            No data saved
          </span>
        </header>

        {/* Scenario picker */}
        <section className="rounded-md border border-gray-100 p-2">
          <label className="text-xs font-medium text-gray-800" htmlFor="tt-sel">Sample student</label>
          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center">
            <select
              id="tt-sel"
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value as ScenarioId)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Choose sample student"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-600 sm:ml-2">{scenario.note}</p>
          </div>
        </section>

        {/* Policy knobs */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="tt-knobs">
          <h2 id="tt-knobs" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Policy knobs (normalized weights)
          </h2>
          <div className="px-3 py-2 grid grid-cols-1 gap-3">
            {/* Weights */}
            <div>
              <p className="text-xs font-medium text-gray-800">Category weights</p>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <WeightControl
                  label="Assignments"
                  value={cfg.weights.assignments}
                  onChange={(v) => updateWeight("assignments", v)}
                />
                <WeightControl
                  label="Quizzes"
                  value={cfg.weights.quizzes}
                  onChange={(v) => updateWeight("quizzes", v)}
                />
                <WeightControl
                  label="Exams"
                  value={cfg.weights.exams}
                  onChange={(v) => updateWeight("exams", v)}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-600">
                Sum: {sum(cfg.weights)} (we auto-normalize to 100 for calculations)
                {weightsNormalized && (
                  <span className="ml-2 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-amber-800">
                    Normalized
                  </span>
                )}
              </p>
            </div>

            {/* Rules */}
            <div className="grid grid-cols-1 gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={cfg.dropLowestAssignment}
                  onChange={(e) => setCfg({ ...cfg, dropLowestAssignment: e.target.checked })}
                />
                Drop lowest assignment
              </label>

              <label className="text-xs">
                <span className="text-gray-800">Late penalty</span>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={cfg.latePenaltyPct}
                    onChange={(e) => setCfg({ ...cfg, latePenaltyPct: Number(e.target.value) })}
                    className="w-full"
                    aria-label="Late penalty percent"
                  />
                  <span className="w-10 text-right text-sm text-gray-800">{cfg.latePenaltyPct}%</span>
                </div>
                <p className="mt-0.5 text-[11px] text-gray-600">Applied to the Assignments average (simulated).</p>
              </label>

              <fieldset className="text-xs">
                <legend className="text-gray-800">Rounding</legend>
                <div className="mt-1 flex flex-wrap gap-3">
                  {(["none", "nearest", "floor"] as Rounding[]).map((r) => (
                    <label key={r} className="inline-flex items-center gap-1">
                      <input
                        type="radio"
                        name="rounding"
                        className="h-4 w-4"
                        checked={cfg.rounding === r}
                        onChange={() => setCfg({ ...cfg, rounding: r })}
                        aria-checked={cfg.rounding === r}
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Quick tries */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-gray-600">Try:</span>
              <QuickBtn onClick={() => quickSet("dropLowest")}>Drop lowest</QuickBtn>
              <QuickBtn onClick={() => quickSet("examHeavy")}>Exams 50%</QuickBtn>
              <QuickBtn onClick={() => quickSet("latePenalty")}>Late −10%</QuickBtn>
              <button
                type="button"
                onClick={() => setCfg(BASELINE)}
                className="ml-auto rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Reset to baseline
              </button>
              <button
                type="button"
                onClick={copyConfig}
                className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Copy setup (JSON)
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="tt-results">
          <h2 id="tt-results" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Outcome (baseline vs sandbox)
          </h2>
          <div className="px-3 py-2 grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2">
              <Badge tone="gray">Baseline</Badge>
              <ScorePill value={baselineResult.final} />
              <Arrow />
              <Badge tone="indigo">Sandbox</Badge>
              <ScorePill value={sandboxResult.final} />
              <Delta value={delta} />
            </div>

            {/* Tiny breakdown */}
            <div className="rounded-md border border-gray-100 p-2">
              <p className="text-[11px] text-gray-700">
                Weighted parts (sandbox): A {fmt1(sandboxResult.parts.assignments)} • Q {fmt1(sandboxResult.parts.quizzes)} • E {fmt1(sandboxResult.parts.exams)}.
                Weights normalized to {sandboxResult.normalizedWeights.assignments}/{sandboxResult.normalizedWeights.quizzes}/{sandboxResult.normalizedWeights.exams}.
              </p>
              <p className="mt-1 text-[11px] text-gray-600">
                Use this safely to learn: tweak, observe, explain — no penalties, just insight.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------- UI subcomponents ---------------------------- */

function WeightControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="text-xs">
      <span className="block text-gray-800">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
        aria-label={`${label} weight`}
      />
      <span className="block text-right text-[11px] text-gray-600">{value}</span>
    </label>
  );
}

function Badge({ tone, children }: { tone: "gray" | "indigo"; children: React.ReactNode }) {
  const cls =
    tone === "indigo"
      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>{children}</span>;
}

function ScorePill({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm text-gray-900">
      {value.toFixed(1)}%
    </span>
  );
}

function Delta({ value }: { value: number }) {
  const pos = value > 0;
  const neg = value < 0;
  const tone = pos ? "text-green-700 bg-green-50 border-green-200" : neg ? "text-rose-700 bg-rose-50 border-rose-200" : "text-gray-700 bg-gray-50 border-gray-200";
  return (
    <span className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${tone}`}>
      {value === 0 ? "±0.0" : value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)}
    </span>
  );
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gray-400">
      <path d="M7 3l7 7-7 7-1.4-1.4L10.2 10 5.6 4.4 7 3z" />
    </svg>
  );
}

/** Added: QuickBtn helper to fix missing component error */
function QuickBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </button>
  );
}

/* --------------------------------- Logic --------------------------------- */

function compute(cfg: Config, data: Scenario["data"]): Breakdown {
  // Normalize weights
  const w = normalize(cfg.weights);
  // Averages
  const assign = average(data.assignments, cfg.dropLowestAssignment);
  const quizzes = average(data.quizzes, false);
  const exams = average(data.exams, false);

  // Apply late penalty to assignments (simulated)
  const aAfterPenalty = assign * (1 - clamp(cfg.latePenaltyPct, 0, 100) / 100);

  // Weighted sum
  let raw =
    aAfterPenalty * (w.assignments / 100) +
    quizzes * (w.quizzes / 100) +
    exams * (w.exams / 100);

  raw = clamp(raw, 0, 100);

  const final =
    cfg.rounding === "nearest"
      ? Math.round(raw)
      : cfg.rounding === "floor"
      ? Math.floor(raw)
      : Math.round(raw * 10) / 10; // keep one decimal for readability

  const parts = {
    assignments: aAfterPenalty * (w.assignments / 100),
    quizzes: quizzes * (w.quizzes / 100),
    exams: exams * (w.exams / 100),
  };

  return { final, normalizedWeights: w, parts };
}

function normalize(w: Config["weights"]): Config["weights"] {
  const s = sum(w) || 1;
  return {
    assignments: Math.round((w.assignments / s) * 100),
    quizzes: Math.round((w.quizzes / s) * 100),
    exams: Math.round((w.exams / s) * 100),
  };
}

function sum(w: Config["weights"]): number {
  return Math.round((w.assignments + w.quizzes + w.exams) * 100) / 100;
}

function average(arr: number[], dropLowest: boolean): number {
  if (arr.length === 0) return 0;
  const vals = dropLowest && arr.length > 1 ? [...arr].sort((a, b) => a - b).slice(1) : arr;
  const total = vals.reduce((s, x) => s + x, 0);
  return total / vals.length;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function fmt1(n: number): string {
  return `${(Math.round(n * 10) / 10).toFixed(1)}%`;
}
