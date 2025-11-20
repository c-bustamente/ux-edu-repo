"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Larger Than Life — Authentic Artifact Tour (compact)
 * Show a real-world scale artifact early, then invite tiny, safe extensions.
 * Fits a card: dropdown to switch artifact, metrics, architecture map, 3 micro-tasks with hints,
 * and a small progress meter. No external deps; fully keyboard/ARIA friendly.
 */

type ArtifactId = "compiler" | "dashboard";

type Metrics = { files: number; modules: number; loc: number };
type Task = {
  id: string;
  label: string;
  rationale: string;         // why this matters in the real world
  before: string;            // tiny snippet
  after: string;             // suggested tiny patch
};
type Artifact = {
  id: ArtifactId;
  name: string;
  domain: string;
  about: string;
  metrics: Metrics;
  architecture: string[];    // high-level parts (big picture)
  tasks: Task[];
  takeaway: string;          // motivation hook
};

const STORAGE_KEY = "uxedu.ped.largerthanlife.v1";

const ARTIFACTS: Artifact[] = [
  {
    id: "compiler",
    name: "Tiny Compiler (Expr → Bytecode)",
    domain: "Systems / Languages",
    about:
      "A small but complete compiler: lexical analysis, parsing, AST, bytecode generation, and VM. You’ll make safe, local changes—just like many real teams do.",
    metrics: { files: 32, modules: 8, loc: 3800 },
    architecture: ["Lexer", "Parser", "AST", "Type Check (basic)", "IR/Bytecode", "VM", "CLI"],
    tasks: [
      {
        id: "t1",
        label: "Add string literals to the lexer",
        rationale: "Extending surface syntax without breaking existing code is a routine maintenance task.",
        before: `// token.ts (before)
export type TokenKind = "num" | "ident" | "plus" | "eof";
// ...`,
        after: `// token.ts (after)
export type TokenKind = "num" | "ident" | "str" | "plus" | "eof";
// lexer.ts (fragment)
if (ch === '"') { readString(); return { kind: "str", lexeme: buf }; }`,
      },
      {
        id: "t2",
        label: "Fix precedence: '*' binds tighter than '+'",
        rationale: "Operator precedence bugs are common and user-visible in language tools.",
        before: `// parser.ts (before)
parseExpr() { return parseLeftAssoc(parsePrimary, ["+", "*"]); }`,
        after: `// parser.ts (after)
parseExpr() { 
  const term = parseLeftAssoc(parsePrimary, ["*"]);
  return parseLeftAssoc(() => term(), ["+"]);
}`,
      },
      {
        id: "t3",
        label: "Emit debug op for VM trace",
        rationale: "Production systems often add diagnostic hooks without changing semantics.",
        before: `// vm.ts (before)
switch(op) { case "ADD": // ... }`,
        after: `// vm.ts (after)
switch(op) {
  case "DBG": console.log("trace", stackTop()); break;
  case "ADD": // ...
}`,
      },
    ],
    takeaway:
      "You rarely ‘build from scratch’—you extend and stabilize existing cores. This mirrors professional workflows.",
  },
  {
    id: "dashboard",
    name: "Learning Analytics Dashboard",
    domain: "Web / Data",
    about:
      "An instructor dashboard with ETL, metrics API, auth, and charts. You will add a tiny filter and an accessible label—small changes with big impact.",
    metrics: { files: 41, modules: 10, loc: 4200 },
    architecture: ["ETL Jobs", "Metrics API", "AuthZ/AuthN", "Caching", "Charts", "Exports", "UI Shell"],
    tasks: [
      {
        id: "d1",
        label: "Add cohort filter to metrics API",
        rationale: "Feature growth usually starts as small, composable filters across layers.",
        before: `// api/metrics.ts (before)
GET /metrics?courseId=...
return query("SELECT * FROM events WHERE course_id = $1", [courseId]);`,
        after: `// api/metrics.ts (after)
GET /metrics?courseId=...&cohort=...
const sql = cohort 
  ? "SELECT * FROM events WHERE course_id = $1 AND cohort = $2"
  : "SELECT * FROM events WHERE course_id = $1";
return query(sql, cohort ? [courseId, cohort] : [courseId]);`,
      },
      {
        id: "d2",
        label: "Expose 'time-on-task' as a new metric",
        rationale: "Surfacing derived metrics expands decision-making without new data collection.",
        before: `// metrics/compute.ts (before)
return { completions, quizScoreAvg };`,
        after: `// metrics/compute.ts (after)
const timeOnTask = sessions.reduce((s,x)=>s+(x.end-x.start),0);
return { completions, quizScoreAvg, timeOnTask };`,
      },
      {
        id: "d3",
        label: "Ensure chart has an accessible name",
        rationale: "A11y fixes are high-value, low-risk changes that ship continuously in real products.",
        before: `// ui/Chart.tsx (before)
<figure><canvas ref={ref} /></figure>`,
        after: `// ui/Chart.tsx (after)
<figure aria-labelledby="chart-title">
  <h3 id="chart-title" className="sr-only">Course engagement over time</h3>
  <canvas ref={ref} role="img" aria-label="Line chart of engagement per week" />
</figure>`,
      },
    ],
    takeaway:
      "Professional dashboards evolve through small, reviewable diffs—filters, derived metrics, and accessibility improvements.",
  },
];

type Persist = { chosen: ArtifactId; done: Record<ArtifactId, string[]> };

export default function ExampleLargerThanLife() {
  const persisted = loadPersist();
  const [chosen, setChosen] = useState<ArtifactId>(persisted?.chosen ?? "compiler");
  const [done, setDone] = useState<Record<ArtifactId, string[]>>(
    persisted?.done ?? { compiler: [], dashboard: [] }
  );
  const art = useMemo(() => ARTIFACTS.find((a) => a.id === chosen)!, [chosen]);

  useEffect(() => savePersist({ chosen, done }), [chosen, done]);

  const total = art.tasks.length;
  const completed = done[art.id].length;
  const pct = Math.round((completed / Math.max(1, total)) * 100);

  function toggleTask(id: string) {
    setDone((prev) => {
      const set = new Set(prev[art.id]);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...prev, [art.id]: Array.from(set) };
    });
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="ltl-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="ltl-title" className="text-lg font-semibold tracking-tight">
              Larger Than Life — Authentic Artifact
            </h1>
            <p className="text-xs text-gray-600">
              Skim a real-scale artifact now; make tiny, safe changes like a pro team would.
            </p>
          </div>
          <select
            value={chosen}
            onChange={(e) => setChosen(e.target.value as ArtifactId)}
            aria-label="Choose artifact"
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ARTIFACTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </header>

        {/* Metrics + progress */}
        <section className="rounded-md border border-gray-100 p-2">
          <p className="text-sm font-medium text-gray-900">{art.name}</p>
          <p className="text-xs text-gray-700">{art.about}</p>

          <ul className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
            <Pill label={`${art.metrics.files} files`} tone="indigo" />
            <Pill label={`${art.metrics.modules} modules`} tone="indigo" />
            <Pill label={`${art.metrics.loc} LOC`} tone="indigo" />
            <Pill label={art.domain} tone="gray" />
          </ul>

          <div
            className="mt-2 h-2 w-full rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Task progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-gray-700">
            {completed}/{total} micro-tasks complete • {art.takeaway}
          </p>
        </section>

        {/* Architecture map (big picture) */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="arch-title">
          <h2 id="arch-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Architecture (big picture)
          </h2>
          <ul className="px-3 py-2 grid grid-cols-1 gap-1 text-[11px] text-gray-800">
            {art.architecture.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* Micro-tasks with hints (progressive disclosure) */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="tasks-title">
          <h2 id="tasks-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Try tiny changes (extend, not rebuild)
          </h2>
          <ul className="divide-y divide-gray-100">
            {art.tasks.map((t) => {
              const checked = done[art.id].includes(t.id);
              return (
                <li key={t.id} className="px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={checked}
                        onChange={() => toggleTask(t.id)}
                        aria-checked={checked}
                      />
                      <span className="text-gray-900">{t.label}</span>
                    </label>
                    <span className="text-[11px] text-gray-600 hidden sm:inline">{t.rationale}</span>
                  </div>
                  <details className="mt-1 rounded border border-gray-200 bg-gray-50 p-2">
                    <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                      See tiny patch (before → after)
                    </summary>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <figure className="rounded border border-gray-200 bg-white">
                        <figcaption className="px-2 py-1 text-[11px] text-gray-600">Before</figcaption>
                        <pre className="max-h-28 overflow-auto px-2 py-1 text-[11px] text-gray-800 whitespace-pre-wrap">
{t.before}
                        </pre>
                      </figure>
                      <figure className="rounded border border-gray-200 bg-white">
                        <figcaption className="px-2 py-1 text-[11px] text-gray-600">After</figcaption>
                        <pre className="max-h-28 overflow-auto px-2 py-1 text-[11px] text-gray-800 whitespace-pre-wrap">
{t.after}
                        </pre>
                      </figure>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Next steps */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <a
            href="#/guides/reading-the-architecture"
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            How to read large codebases
          </a>
          <a
            href="#/assignments/micro-extensions"
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Assignment: micro-extensions →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Utilities ----------------------------- */

function loadPersist(): Persist | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persist) : null;
  } catch {
    return null;
  }
}
function savePersist(p: Persist) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function Pill({ label, tone }: { label: string; tone: "indigo" | "gray" }) {
  const cls =
    tone === "indigo"
      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 ${cls}`}>
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${tone === "indigo" ? "bg-indigo-600" : "bg-gray-500"}`} />
      {label}
    </span>
  );
}
