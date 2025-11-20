"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** TYPES **/
type Kind = "formative" | "summative";
type Status = "open" | "completed";

interface AssessmentItem {
  id: string;
  kind: Kind;
  title: string;
  weightPct?: number; // only for summative (e.g., 20 = 20% of final grade)
  dueISO?: string; // optional for formative
  attempts: number;
  bestScore?: number; // 0–100
  status: Status;
  feedback?: string; // short comment
}

type FilterKey = "all" | "pending";

/** SEED (education-focused) **/
const SEED: AssessmentItem[] = [
  // Formative (ungraded/low-stakes, ongoing)
  {
    id: "f1",
    kind: "formative",
    title: "Reading Check — Mayer’s Multimedia Principles",
    dueISO: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    attempts: 0,
    status: "open",
  },
  {
    id: "f2",
    kind: "formative",
    title: "Practice Quiz — Usability Heuristics",
    dueISO: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    attempts: 1,
    bestScore: 70,
    status: "open",
    feedback: "Good start — recheck #3 (Consistency).",
  },
  {
    id: "f3",
    kind: "formative",
    title: "Muddiest Point — Week 2 Reflection",
    attempts: 1,
    status: "completed",
    feedback: "Thanks! We’ll address ‘Cognitive Load types’ next session.",
  },
  // Summative (weights & cumulative)
  {
    id: "s1",
    kind: "summative",
    title: "Midterm Exam (Modules 1–3)",
    weightPct: 30,
    dueISO: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    attempts: 0,
    status: "open",
  },
  {
    id: "s2",
    kind: "summative",
    title: "Final Project — UX Evaluation Report",
    weightPct: 40,
    dueISO: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
    attempts: 0,
    status: "open",
  },
  {
    id: "s3",
    kind: "summative",
    title: "Portfolio Presentation",
    weightPct: 30,
    dueISO: new Date(Date.now() + 35 * 24 * 3600 * 1000).toISOString(),
    attempts: 1,
    bestScore: 92,
    status: "completed",
    feedback: "Strong argumentation; tighten your rubric mapping.",
  },
];

const STORAGE_KEY = "uxedu.assessments.v1";

/** UTILS **/
function fmtDue(iso?: string): { label: string; late: boolean } {
  if (!iso) return { label: "No due date", late: false };
  const due = new Date(iso);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (24 * 3600 * 1000));
  const dateLabel = due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (diff < 0) return { label: `Past due • ${dateLabel}`, late: true };
  return { label: `Due in ${days} day${days === 1 ? "" : "s"} • ${dateLabel}`, late: false };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** PERSISTENCE **/
function load(): AssessmentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AssessmentItem[]) : SEED;
  } catch {
    return SEED;
  }
}
function save(items: AssessmentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/** COMPONENT **/
export default function ExampleAssessments() {
  const [items, setItems] = useState<AssessmentItem[]>(SEED);
  const [tab, setTab] = useState<Kind>("formative");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [announce, setAnnounce] = useState<string>("");
  const tablistRef = useRef<HTMLDivElement>(null);

  useEffect(() => setItems(load()), []);
  useEffect(() => save(items), [items]);

  const list = useMemo(() => {
    let out = items.filter((i) => i.kind === tab);
    if (filter === "pending") out = out.filter((i) => i.status !== "completed");
    // sort: earliest due first, then title
    out.sort((a, b) => (a.dueISO && b.dueISO ? a.dueISO.localeCompare(b.dueISO) : 0) || a.title.localeCompare(b.title));
    return out;
  }, [items, tab, filter]);

  const progress = useMemo(() => {
    const pool = items.filter((i) => i.kind === tab);
    const total = pool.length || 1;
    const completed = pool.filter((i) => i.status === "completed").length;
    const pct = Math.round((completed / total) * 100);
    // simple achievement proxy: avg of best scores (if present)
    const withScores = pool.filter((i) => typeof i.bestScore === "number");
    const avg = Math.round(
      withScores.reduce((s, i) => s + (i.bestScore as number), 0) / (withScores.length || 1)
    );
    return { pct, completed, total, avg: isFinite(avg) ? avg : 0 };
  }, [items, tab]);

  const onRecordAttempt = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              attempts: i.attempts + 1,
              bestScore: clamp(Math.max(i.bestScore ?? 0, 80 + Math.round(Math.random() * 15)), 0, 100),
              status: "completed",
            }
          : i
      )
    );
    setAnnounce("Attempt recorded. Progress updated.");
  };

  const onRequestFeedback = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, feedback: i.feedback ?? "Feedback requested — pending review." } : i))
    );
    setAnnounce("Feedback requested.");
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs || tabs.length === 0) return;
    const i = Array.from(tabs).indexOf(e.currentTarget);
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
  };

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="assess-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="assess-title" className="text-lg font-semibold tracking-tight">
            Assessments — Formative & Summative
          </h1>
          <p className="text-xs text-gray-600">
            Combine ongoing checks with cumulative tasks, clear criteria, and feedback.
          </p>
        </header>

        {/* Tabs + Filter */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
          <div ref={tablistRef} role="tablist" aria-label="Assessment type" className="flex gap-1.5">
            {(["formative", "summative"] as Kind[]).map((k) => {
              const selected = tab === k;
              return (
                <button
                  key={k}
                  role="tab"
                  aria-selected={selected}
                  onKeyDown={handleTabKey}
                  onClick={() => setTab(k)}
                  className={`px-3 py-1.5 rounded-md text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {k === "formative" ? "Formative (practice)" : "Summative (graded)"}
                </button>
              );
            })}
            <div className="ml-auto">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={filter === "pending"}
                  onChange={(e) => setFilter(e.target.checked ? "pending" : "all")}
                />
                Pending only
              </label>
            </div>
          </div>

          {/* Completeness meter */}
          <div className="mt-2">
            <div
              className="h-2 w-full rounded-full bg-gray-200"
              role="progressbar"
              aria-label="Completion progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.pct}
            >
              <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${progress.pct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-gray-700">
              {progress.completed}/{progress.total} completed • Avg score: {progress.avg}%
            </p>
          </div>
        </div>

        {/* List (compact, scrollable) */}
        <section className="mt-2 max-h-80 overflow-auto rounded-md border border-gray-100" aria-label="Assessment list">
          {list.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-700">Nothing to show with current filters.</p>
              <p className="text-xs text-gray-500">Switch tab or disable “Pending only”.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {list.map((it) => {
                const due = fmtDue(it.dueISO);
                return (
                  <li key={it.id}>
                    <article className="p-3" aria-labelledby={`item-${it.id}-title`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 id={`item-${it.id}-title`} className="text-sm font-medium text-gray-900">
                            {it.title}
                          </h3>
                          <p className="text-[11px] text-gray-600">
                            {it.kind === "summative" ? (
                              <span className="mr-2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5">
                                {it.weightPct ?? 0}% weight
                              </span>
                            ) : (
                              <span className="mr-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">
                                Practice
                              </span>
                            )}
                            <span className={due.late ? "text-red-600" : "text-gray-600"}>{due.label}</span>
                          </p>
                          <p className="mt-1 text-xs text-gray-700">
                            Attempts: <span className="font-medium">{it.attempts}</span>{" "}
                            {typeof it.bestScore === "number" && (
                              <>
                                • Best: <span className="font-medium">{it.bestScore}%</span>
                              </>
                            )}
                          </p>
                          {it.feedback && (
                            <p className="mt-1 text-xs text-gray-700">
                              <span className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 border border-green-200 text-green-700">
                                <CheckIcon />
                                Feedback
                              </span>{" "}
                              <span className="text-gray-700">{it.feedback}</span>
                            </p>
                          )}
                        </div>

                        <StatusPill status={it.status} />
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {it.status === "open" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onRecordAttempt(it.id)}
                              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              aria-label={`Record attempt for ${it.title}`}
                            >
                              Record attempt
                            </button>
                            <button
                              type="button"
                              onClick={() => onRequestFeedback(it.id)}
                              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              Request feedback
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onRequestFeedback(it.id)}
                              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              View/Request feedback
                            </button>
                            <button
                              type="button"
                              onClick={() => onRecordAttempt(it.id)}
                              className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-800 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              New practice attempt
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Tiny help (criteria transparency) */}
        <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            How we grade & give feedback
          </summary>
          <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
            <li>Formative tasks are low-stakes and can be retried; watch your best score grow.</li>
            <li>Summative tasks use published rubrics; weights appear next to each task.</li>
            <li>Feedback is timely and actionable; request it anytime from the item.</li>
          </ul>
        </details>
      </div>

      {/* Live region for “notifications” */}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}

/** SUB-COMPONENTS **/
function StatusPill({ status }: { status: Status }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border";
  if (status === "completed") {
    return (
      <span className={`${base} bg-green-50 text-green-700 border-green-200`}>
        <Dot className="bg-green-500" />
        Completed
      </span>
    );
  }
  return (
    <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
      <Dot className="bg-amber-500" />
      Open
    </span>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${className}`} aria-hidden="true" />;
}
function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
      <path d="M8 13.2 4.8 10l-1.4 1.4L8 16l8.6-8.6L15.2 6z" />
    </svg>
  );
}
