// src/components/pattern-examples/ExampleLeaderboard.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * ExampleLeaderboard — fixed typing for `section` ("A" | "B")
 * - Sort, filter by section, anonymize toggle
 * - Highlights current user
 */

type Section = "A" | "B";

type Row = {
  id: string;
  name: string;
  section: Section;   // 👈 literal union, no string suelto
  points: number;
  participation: number;
  isCurrent?: boolean;
};

type SortKey = "rank" | "points" | "participation" | "name";

// 1) Define base data con tipado explícito Row[]
const BASE_DATA: Row[] = [
  { id: "u01", name: "Ana Torres",    section: "A", points: 920, participation: 31 },
  { id: "u02", name: "Bruno Díaz",    section: "A", points: 870, participation: 24 },
  { id: "u03", name: "Carla M.",      section: "B", points: 680, participation: 18 },
  { id: "u04", name: "Diego Pérez",   section: "A", points: 740, participation: 22 },
  { id: "u05", name: "Elena R.",      section: "B", points: 990, participation: 35 },
  { id: "u06", name: "Fabián Soto",   section: "B", points: 510, participation: 12 },
  { id: "u07", name: "Gabriela Q.",   section: "A", points: 830, participation: 19 },
  { id: "u08", name: "Héctor N.",     section: "B", points: 610, participation: 15 },
  { id: "u09", name: "Ivana T.",      section: "A", points: 560, participation: 10, isCurrent: true },
  { id: "u10", name: "Jorge L.",      section: "B", points: 780, participation: 21 },
];

// 2) Crear DATA ordenado SIN romper el tipado (no mutamos BASE_DATA)
const DATA: Row[] = [...BASE_DATA].sort((a, b) => b.points - a.points);

export default function ExampleLeaderboard() {
  const [section, setSection] = useState<"all" | Section>("all");
  const [showNames, setShowNames] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("rank");

  // Filtro por sección
  const filtered = useMemo(
    () => (section === "all" ? DATA : DATA.filter(r => r.section === section)),
    [section]
  );

  // Ranking + ordenamiento
  const ranked = useMemo(() => {
    const copy = filtered.slice().sort((a, b) => {
      if (sortBy === "rank") return cmpRank(a, b);
      if (sortBy === "points")
        return b.points - a.points || b.participation - a.participation || a.name.localeCompare(b.name);
      if (sortBy === "participation")
        return b.participation - a.participation || b.points - a.points || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });

    let lastScore: { p: number; m: number } | null = null;
    let lastRank = 0;
    return copy.map((r, i) => {
      const score = { p: r.points, m: r.participation };
      if (!lastScore || score.p !== lastScore.p || score.m !== lastScore.m) {
        lastRank = i + 1;
        lastScore = score;
      }
      return { ...r, rank: lastRank };
    });
  }, [filtered, sortBy]);

  const currentIdx = ranked.findIndex(r => r.isCurrent);

  return (
    <div className="w-full max-w-3xl rounded-xl border p-5 shadow-sm bg-white" data-leaderboard-root>
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Leaderboard</h3>
        <p className="text-sm text-muted-foreground">Top performers by points and participation.</p>
      </header>

      {/* Controles */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-sm">
          Section:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={section}
            onChange={(e) => setSection(e.target.value as "all" | Section)}
          >
            <option value="all">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </label>

        <label className="text-sm">
          Sort by:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
          >
            <option value="rank">Rank</option>
            <option value="points">Points</option>
            <option value="participation">Participation</option>
            <option value="name">Name</option>
          </select>
        </label>

        <label className="ml-auto inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={showNames}
            onChange={(e) => setShowNames(e.target.checked)}
          />
          Show real names
        </label>
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left">
              <Th className="w-16">Rank</Th>
              <Th>Student</Th>
              <Th className="w-28 text-right">Points</Th>
              <Th className="w-36 text-right">Participation</Th>
              <Th className="w-16 text-center">Sec.</Th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, idx) => {
              const isTop3 = (r as any).rank <= 3;
              const isMe = !!r.isCurrent;
              return (
                <tr
                  key={r.id}
                  className={[
                    "border-t",
                    isMe ? "bg-emerald-50/60" : "bg-white",
                    "hover:bg-gray-50",
                  ].join(" ")}
                >
                  <td className="px-3 py-2">
                    <div className="inline-flex items-center gap-1">
                      <Medal n={(r as any).rank} />
                      <span className={isTop3 ? "font-semibold" : ""}>{(r as any).rank}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar seed={r.id} />
                      <div className="min-w-0">
                        <div className="truncate">
                          {showNames ? r.name : anonymize(r.id)}
                          {isMe && <span className="ml-2 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white">you</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate">ID: {r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className="font-medium">{r.points}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Bar value={r.participation} max={maxParticipation(ranked)} />
                      <span className="tabular-nums">{r.participation}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="rounded bg-gray-900 px-2 py-0.5 text-[10px] text-white">{r.section}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {ranked.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">No students in this section.</div>
        )}
      </div>

      {/* Jump to current */}
      {currentIdx >= 6 && (
        <div className="mt-2">
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              const root = document.querySelector<HTMLDivElement>('[data-leaderboard-root]');
              root?.querySelectorAll<HTMLTableRowElement>("tbody tr")[currentIdx]?.scrollIntoView({ block: "center", behavior: "smooth" });
            }}
          >
            Jump to your rank
          </button>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Tip: allow anonymized or opt-out views to reduce pressure; pair with achievements for positive motivation.
      </p>
    </div>
  );
}

/* -------------- helpers -------------- */

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={["px-3 py-2 text-xs font-semibold text-gray-600", className].join(" ")}>{children}</th>;
}

function Medal({ n }: { n: number }) {
  const tone = n === 1 ? "text-yellow-500" : n === 2 ? "text-gray-400" : n === 3 ? "text-amber-700" : "text-transparent";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className={tone} aria-hidden>
      <path fill="currentColor" d="M12 2L7 6h4v8h2V6h4zM12 22a6 6 0 100-12 6 6 0 000 12z"/>
    </svg>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  return (
    <div className="h-2 w-24 rounded bg-gray-200">
      <div className="h-2 rounded bg-gray-900" style={{ width: `${pct}%` }} aria-hidden />
    </div>
  );
}

function Avatar({ seed }: { seed: string }) {
  const initials = seed.slice(-2).toUpperCase();
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs" aria-hidden>
      {initials}
    </div>
  );
}

function anonymize(id: string) {
  return `Student ${id.slice(-3)}`;
}

function maxParticipation(rows: Array<Row & { rank?: number }>) {
  return rows.reduce((m, r) => Math.max(m, r.participation), 1);
}

function cmpRank(a: Row, b: Row) {
  return b.points - a.points || b.participation - a.participation || a.name.localeCompare(b.name);
}
