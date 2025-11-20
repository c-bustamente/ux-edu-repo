// src/components/pattern-examples/ExampleDashboard.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * ExampleDashboard
 * ------------------------------------------------------------------
 * Education use case (student view):
 * - KPI header cards: Overall Progress, Avg Grade, Upcoming, Participation
 * - Course progress list with per-course completeness meters
 * - Upcoming deadlines (next 7 days)
 * - Grade trend sparkline (SVG)
 * - Time-on-task heat summary (simple streak bar)
 *
 * Notes:
 * - No external libs; all charts as minimal CSS/SVG for easy SSR.
 * - Replace mock data/fetch with your API and keep the same render.
 */

type Course = {
  id: string;
  title: string;
  progressPct: number;       // 0..100
  gradePct?: number;         // 0..100
  nextDue?: { title: string; dateISO: string } | null;
};

type Deadline = {
  id: string;
  whenISO: string;
  course: string;
  title: string;
};

const COURSES: Course[] = [
  { id: "c1", title: "Calculus 101", progressPct: 68, gradePct: 84, nextDue: { title: "Quiz 2 — Derivatives", dateISO: shiftDays(2) } },
  { id: "c2", title: "Linear Algebra", progressPct: 42, gradePct: 78, nextDue: { title: "HW3 — Eigenvalues", dateISO: shiftDays(5) } },
  { id: "c3", title: "Intro to Statistics", progressPct: 55, gradePct: 81, nextDue: null },
  { id: "c4", title: "Python for Data Science", progressPct: 23, gradePct: 0, nextDue: { title: "Lab 1 — Pandas", dateISO: shiftDays(1) } },
];

const DEADLINES: Deadline[] = [
  { id: "d1", whenISO: shiftDays(1), course: "Python for Data Science", title: "Lab 1 — Pandas" },
  { id: "d2", whenISO: shiftDays(2), course: "Calculus 101", title: "Quiz 2 — Derivatives" },
  { id: "d3", whenISO: shiftDays(5), course: "Linear Algebra", title: "HW3 — Eigenvalues" },
].sort((a,b) => (a.whenISO < b.whenISO ? -1 : 1));

const GRADE_TREND: number[] = [72, 75, 78, 81, 84]; // last 5 graded items (percent)
const PARTICIPATION_14D: number[] = [0,1,1,0,2,0,1,1,0,0,2,1,1,0]; // actions per day (last 14d)

export default function ExampleDashboard() {
  const [showAllCourses, setShowAllCourses] = useState(false);

  // KPIs
  const overallProgress = Math.round(
    COURSES.reduce((acc, c) => acc + c.progressPct, 0) / COURSES.length
  );
  const graded = COURSES.filter(c => (c.gradePct ?? 0) > 0);
  const avgGrade = graded.length
    ? Math.round(graded.reduce((a, c) => a + (c.gradePct ?? 0), 0) / graded.length)
    : 0;

  const upcoming7d = DEADLINES.filter(d => daysFromToday(d.whenISO) <= 7);
  const participationSum = PARTICIPATION_14D.reduce((a, b) => a + b, 0);

  const topCourses = useMemo(
    () => (showAllCourses ? COURSES : COURSES.slice(0, 3)),
    [showAllCourses]
  );

  return (
    <div className="w-full max-w-5xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Overview first; drill down as needed. Progress, grades, and upcoming deadlines at a glance.
        </p>
      </header>

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Overall Progress">
          <ProgressBar pct={overallProgress} />
          <KpiValue>{overallProgress}%</KpiValue>
        </KpiCard>

        <KpiCard title="Average Grade">
          <Sparkline values={GRADE_TREND} height={36} strokeWidth={2} />
          <KpiValue>{avgGrade}%</KpiValue>
        </KpiCard>

        <KpiCard title="Upcoming (7d)">
          <div className="text-2xl font-semibold">{upcoming7d.length}</div>
          <div className="text-xs text-gray-500">deadlines</div>
        </KpiCard>

        <KpiCard title="Participation (14d)">
          <StreakBar values={PARTICIPATION_14D} />
          <div className="text-xs text-gray-500 mt-1">{participationSum} actions</div>
        </KpiCard>
      </section>

      {/* Main grid */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Courses & progress */}
        <div className="lg:col-span-2 rounded-lg border">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="text-sm font-semibold">Course Progress</h4>
            <button
              className="text-xs rounded-md border px-2 py-1 hover:bg-gray-50"
              onClick={() => setShowAllCourses(s => !s)}
            >
              {showAllCourses ? "Show top 3" : "Show all"}
            </button>
          </div>

          <ul className="divide-y">
            {topCourses.map((c) => (
              <li key={c.id} className="p-4 flex items-start gap-3">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-gray-800" aria-hidden />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">{c.title}</div>
                    {c.gradePct ? (
                      <span className="text-xs rounded-full bg-gray-900 text-white px-2 py-0.5">
                        {c.gradePct}% grade
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </div>
                  <ProgressBar pct={c.progressPct} />
                  {c.nextDue ? (
                    <div className="text-xs text-gray-600">
                      Next: <span className="font-medium">{c.nextDue.title}</span>{" "}
                      • {relativeFuture(c.nextDue.dateISO)}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No upcoming in the next week</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming deadlines */}
        <div className="rounded-lg border">
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold">Upcoming Deadlines</h4>
          </div>
          <ul className="divide-y">
            {upcoming7d.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">No deadlines within 7 days.</li>
            )}
            {upcoming7d.map((d) => (
              <li key={d.id} className="p-4">
                <div className="text-sm font-medium">{d.title}</div>
                <div className="text-xs text-gray-600">{d.course} • {formatDate(d.whenISO)} ({relativeFuture(d.whenISO)})</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Details on demand */}
      <section className="mt-6 rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h4 className="text-sm font-semibold">Grades — trend detail</h4>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-600 mb-2">Last 5 graded items</div>
          <Sparkline values={GRADE_TREND} height={60} strokeWidth={2.5} showDots />
          <div className="mt-2 text-xs text-gray-500">
            Tip: combine with filters and per-course breakdowns for deeper insight.
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------- Small UI pieces -------------------- */

function KpiCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs font-medium text-gray-600">{title}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function KpiValue({ children }: { children: React.ReactNode }) {
  return <div className="text-2xl font-semibold">{children}</div>;
}

/** Simple progress bar with accessible label */
function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label="progress"
      className="h-2.5 w-full rounded bg-gray-200"
    >
      <div className="h-2.5 rounded bg-gray-900" style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** Minimal sparkline (SVG) for trend */
function Sparkline({
  values,
  height = 36,
  strokeWidth = 2,
  showDots = false,
}: {
  values: number[];
  height?: number;
  strokeWidth?: number;
  showDots?: boolean;
}) {
  if (!values.length) return null;
  const w = 180; // fixed width for demo
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = 4;
  const H = height - pad * 2;
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;

  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - norm(v, min, max)) * H;
    return [x, y] as const;
  });

  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`)).join(" ");

  return (
    <svg width={w} height={height} className="text-gray-900">
      <path d={d} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      {showDots &&
        pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.5} fill="currentColor" />
        ))}
    </svg>
  );
}

/** 14-day streak style bar (tiny multiples) */
function StreakBar({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex gap-1">
      {values.map((v, i) => {
        const pct = v / max; // 0..1
        const tone = pct === 0 ? "bg-gray-200" : pct < 0.5 ? "bg-gray-400" : "bg-gray-900";
        return <div key={i} className={`h-6 w-3 rounded ${tone}`} title={`Day ${i + 1}: ${v} actions`} />;
      })}
    </div>
  );
}

/* -------------------- Tiny utils -------------------- */

function norm(v: number, lo: number, hi: number) {
  if (hi === lo) return 0.5;
  return (v - lo) / (hi - lo);
}

function shiftDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function daysFromToday(iso: string): number {
  const today = new Date();
  const d = new Date(iso);
  const ms = d.getTime() - new Date(today.toISOString().slice(0,10)).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function relativeFuture(iso: string): string {
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  if (diff <= 0) return "now";
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (days <= 1) return "tomorrow";
  return `in ${days} days`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
