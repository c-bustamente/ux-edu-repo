// src/components/pattern-examples/ExampleActivityStream.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------- Literal unions compatibles con TS < 4.9 ---------- */
const KINDS = ["post", "resource", "badge", "grade", "comment"] as const;
type Kind = typeof KINDS[number];

const COURSES = ["Calculus 101", "Linear Algebra", "Intro to Statistics", "Python DS"] as const;
type Course = typeof COURSES[number];

/* ---------- Tipos ---------- */
type FeedItem = {
  id: string;
  kind: Kind;
  course?: Course;
  title: string;
  text?: string;
  whenISO: string;
  actor: string;
  meta?: string;
  unread?: boolean;
};

/* ---------- Datos mock (tipados explícitamente) ---------- */
const NOW = Date.now();
const T = (mins: number) => new Date(NOW - mins * 60 * 1000).toISOString();

const MOCK_BASE: FeedItem[] = [
  { id: "e1",  kind: "badge",    course: "Calculus 101",        title: "Achievement earned",   text: "7-Day Streak",                 actor: "You",         meta: "+50 pts",          whenISO: T(10),   unread: true },
  { id: "e2",  kind: "post",     course: "Calculus 101",        title: "New discussion: Chain Rule pitfalls",                          actor: "Prof. Smith",                          whenISO: T(25),   unread: true },
  { id: "e3",  kind: "grade",    course: "Linear Algebra",      title: "HW3 graded",            text: "Eigenvalues — rubric posted",  actor: "Auto-grader", meta: "Score 82%",        whenISO: T(60) },
  { id: "e4",  kind: "resource", course: "Python DS",           title: "Notebook uploaded",     text: "Pandas lab starter",           actor: "TA Julia",    meta: "IPYNB • 180 KB",   whenISO: T(95) },
  { id: "e5",  kind: "comment",  course: "Intro to Statistics", title: "Reply on ‘Bayes intuition’", text: "Check this 2-step tree",  actor: "Mateo N.",                                whenISO: T(120) },
  { id: "e6",  kind: "post",     course: "Python DS",           title: "Q&A: ‘groupby vs pivot’",                                     actor: "Lia R.",                                  whenISO: T(170) },
  { id: "e7",  kind: "grade",    course: "Calculus 101",        title: "Quiz 2 graded",         text: "Derivatives",                  actor: "Auto-grader", meta: "Score 91%",        whenISO: T(280) },
  { id: "e8",  kind: "resource", course: "Intro to Statistics", title: "Article added",         text: "p-values myths",               actor: "Prof. Lee",   meta: "PDF • 1.2 MB",     whenISO: T(1440) },
  { id: "e9",  kind: "badge",    course: "Python DS",           title: "Achievement progress",  text: "Module Master (25)",           actor: "You",         meta: "40%",              whenISO: T(2000) },
  { id: "e10", kind: "comment",  course: "Linear Algebra",      title: "Comment on HW3",        text: "Shortcut for 2x2 eigenvalues", actor: "Rita",                                   whenISO: T(2600) },
];

// Ordenado (sin readonly): mantenemos tipo FeedItem[]
const MOCK: FeedItem[] = [...MOCK_BASE].sort((a, b) => (a.whenISO < b.whenISO ? 1 : -1));

/* ---------- Filtros ---------- */
type Filters = {
  course: "all" | Course;
  kind: "all" | Kind;
  unreadOnly: boolean;
};

const PAGE = 6;

/* ---------- Componente ---------- */
export default function ExampleActivityStream() {
  const [filters, setFilters] = useState<Filters>({ course: "all", kind: "all", unreadOnly: false });
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<FeedItem[]>(MOCK);

  // Simula “tiempo real”: agrega un nuevo item a los 5s
  useEffect(() => {
    const t = window.setTimeout(() => {
      const newItem: FeedItem = {
        id: "e-new",
        kind: "post",
        course: "Calculus 101",
        title: "Office hours today",
        text: "Bring your derivative questions",
        actor: "Prof. Smith",
        whenISO: new Date().toISOString(),
        unread: true,
      };
      setItems((prev) => [newItem, ...prev]);
    }, 5000);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filters.course !== "all" && it.course !== filters.course) return false;
      if (filters.kind !== "all" && it.kind !== filters.kind) return false;
      if (filters.unreadOnly && !it.unread) return false;
      return true;
    });
  }, [items, filters]);

  const paged = filtered.slice(0, PAGE * page);
  const grouped = useMemo(() => groupByDay(paged), [paged]);

  function markAllRead() {
    setItems((prev) => prev.map((x) => ({ ...x, unread: false })));
  }

  return (
    <div className="w-full max-w-3xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Activity Stream</h3>
        <p className="text-sm text-muted-foreground">
          Latest updates across your courses. New events appear at the top.
        </p>
      </header>

      {/* Controles */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-sm">
          Course:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value as Filters["course"] })}
          >
            <option value="all">All</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Type:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={filters.kind}
            onChange={(e) => setFilters({ ...filters, kind: e.target.value as Filters["kind"] })}
          >
            <option value="all">All</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </label>

        <label className="inline-flex items-center gap-2 text-sm ml-auto">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={filters.unreadOnly}
            onChange={(e) => setFilters({ ...filters, unreadOnly: e.target.checked })}
          />
          Unread only
        </label>

        <button
          type="button"
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={markAllRead}
        >
          Mark all read
        </button>
      </div>

      {/* Feed */}
      <div role="feed" aria-busy="false" className="mt-2">
        {Object.entries(grouped).map(([day, arr]) => (
          <section key={day} aria-label={day} className="mb-4">
            <h4 className="sticky top-0 z-10 -mx-5 bg-white/80 px-5 py-2 text-xs font-semibold text-gray-500 backdrop-blur">
              {day}
            </h4>
            <ul className="space-y-2">
              {arr.map((it) => (
                <li key={it.id}>
                  <article
                    role="article"
                    aria-label={it.title}
                    className={[
                      "rounded-lg border p-3 bg-white shadow-sm",
                      it.unread ? "border-emerald-300" : "border-gray-200",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <KindIcon kind={it.kind} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-sm font-medium">{it.title}</div>
                          {it.unread && (
                            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white">new</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{it.text ?? "—"}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          {it.course && <span>{it.course}</span>}
                          {it.meta && <span>{it.meta}</span>}
                          <span>by {it.actor}</span>
                          <span>• {relativeTime(it.whenISO)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {paged.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No activity matches your filters.
          </div>
        )}
      </div>

      {/* Load more */}
      {paged.length < filtered.length && (
        <div className="mt-3 flex justify-center">
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setPage((p) => p + 1)}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Utils ---------- */

function groupByDay(list: FeedItem[]) {
  const out: Record<string, FeedItem[]> = {};
  for (const it of list) {
    const d = new Date(it.whenISO);
    const label = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    (out[label] ||= []).push(it);
  }
  return out;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}

function KindIcon({ kind }: { kind: Kind }) {
  const tone =
    kind === "badge" ? "text-emerald-600"
    : kind === "grade" ? "text-indigo-600"
    : kind === "resource" ? "text-amber-600"
    : kind === "post" ? "text-gray-900"
    : "text-gray-500";
  const path =
    kind === "badge" ? "M12 2l3 4h-2v6h-2V6H9l3-4Zm0 20a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
    : kind === "grade" ? "M5 4h14v4H5V4zm0 6h14v10H5V10zm3 2v2h8v-2H8z"
    : kind === "resource" ? "M6 2h9l5 5v15H6V2zm9 1.5V8h5"
    : kind === "post" ? "M4 5h16v4H4V5zm0 6h10v2H4v-2zm0 4h13v2H4v-2z"
    : "M4 6h16v2H4V6zm0 4h12v2H4v-2zm0 4h8v2H4v-2z";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={tone} aria-hidden>
      <path fill="currentColor" d={path} />
    </svg>
  );
}
