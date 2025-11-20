// src/components/pattern-examples/ExampleSearchFilters.tsx
"use client";

import { useEffect, useId, useMemo, useState } from "react";

/**
 * ExampleSearchFilters
 * -------------------------------------------------------------------
 * Use case: Find learning resources (Courses, Videos, Articles, Practice)
 * - Instant filtering (client-side demo) with query, category, level,
 *   format, duration range, published date, tags, sort.
 * - Accessible: form controls with labels, role="status" for counts.
 * - UX touches: clear-all, clear-individual, result count, empty state.
 * Replace DATA with your API and move filtering server-side as needed.
 */

type Category = "Math" | "CS" | "Statistics" | "Teaching";
type Level = "Intro" | "Intermediate" | "Advanced";
type Format = "Course" | "Video" | "Article" | "Practice";

type Item = {
  id: string;
  title: string;
  category: Category;
  level: Level;
  format: Format;
  minutes: number;       // duration
  published: string;     // ISO date
  tags: string[];
  blurb?: string;
};

const DATA: ReadonlyArray<Item> = [
  { id: "c-calculus-101", title: "Calculus 101", category: "Math", level: "Intro", format: "Course", minutes: 480, published: "2024-02-10", tags: ["limits","derivatives"], blurb: "Foundations of differential calculus." },
  { id: "v-limit-laws", title: "Video: Limit Laws (Quick Recap)", category: "Math", level: "Intro", format: "Video", minutes: 12, published: "2025-03-22", tags: ["limits"], blurb: "Short refresher with examples." },
  { id: "a-derivative-tips", title: "Article: Derivative Problem-Solving Tips", category: "Math", level: "Intermediate", format: "Article", minutes: 8, published: "2023-11-14", tags: ["derivatives","heuristics"] },
  { id: "p-chain-rule", title: "Practice: Chain Rule Set", category: "Math", level: "Intermediate", format: "Practice", minutes: 25, published: "2024-06-01", tags: ["derivatives","practice"] },
  { id: "c-python-ds", title: "Python for Data Science", category: "CS", level: "Intro", format: "Course", minutes: 540, published: "2024-09-30", tags: ["python","pandas"], blurb: "Hands-on with Numpy, Pandas, plots." },
  { id: "c-linear-algebra", title: "Linear Algebra", category: "Math", level: "Intermediate", format: "Course", minutes: 600, published: "2023-08-15", tags: ["vectors","matrices"] },
  { id: "c-statistics-intro", title: "Introduction to Statistics", category: "Statistics", level: "Intro", format: "Course", minutes: 420, published: "2025-01-08", tags: ["probability","inference"] },
  { id: "a-udl-guide", title: "Article: UDL Quick Guide", category: "Teaching", level: "Intro", format: "Article", minutes: 10, published: "2024-12-02", tags: ["udl","accessibility"] },
  { id: "v-product-rule", title: "Video: Product Rule Examples", category: "Math", level: "Intro", format: "Video", minutes: 6, published: "2024-03-12", tags: ["derivatives"] },
  { id: "p-bayes", title: "Practice: Bayes Theorem Drills", category: "Statistics", level: "Advanced", format: "Practice", minutes: 30, published: "2022-04-20", tags: ["probability","bayes"] },
] as const;

type State = {
  q: string;
  categories: Set<Category>;
  levels: Set<Level>;
  formats: Set<Format>;
  minMinutes: number;
  maxMinutes: number;
  publishedAfter: string;    // ISO or ""
  tags: Set<string>;
  sort: "relevance" | "newest" | "duration-asc" | "duration-desc";
};

const ALL_TAGS = Array.from(new Set(DATA.flatMap(d => d.tags))).sort();

export default function ExampleSearchFilters() {
  const listId = useId();

  const [s, setS] = useState<State>({
    q: "",
    categories: new Set<Category>(),
    levels: new Set<Level>(),
    formats: new Set<Format>(),
    minMinutes: 0,
    maxMinutes: 600,
    publishedAfter: "",
    tags: new Set<string>(),
    sort: "relevance",
  });

  const [debouncedQ, setDebouncedQ] = useState(s.q);
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(s.q), 200);
    return () => window.clearTimeout(t);
  }, [s.q]);

  // Derived results
  const results = useMemo(() => {
    const term = debouncedQ.trim().toLowerCase();
    let arr = DATA.filter((it) => {
      if (s.categories.size && !s.categories.has(it.category)) return false;
      if (s.levels.size && !s.levels.has(it.level)) return false;
      if (s.formats.size && !s.formats.has(it.format)) return false;
      if (it.minutes < s.minMinutes || it.minutes > s.maxMinutes) return false;
      if (s.publishedAfter && it.published < s.publishedAfter) return false;
      if (s.tags.size && !Array.from(s.tags).every(t => it.tags.includes(t))) return false;

      if (term) {
        const hay = `${it.title} ${it.blurb ?? ""} ${it.category} ${it.level} ${it.format} ${it.tags.join(" ")}`.toLowerCase();
        return hay.includes(term);
      }
      return true;
    });

    // Sort
    if (s.sort === "newest") {
      arr = arr.slice().sort((a,b) => (b.published > a.published ? 1 : -1));
    } else if (s.sort === "duration-asc") {
      arr = arr.slice().sort((a,b) => a.minutes - b.minutes);
    } else if (s.sort === "duration-desc") {
      arr = arr.slice().sort((a,b) => b.minutes - a.minutes);
    } else {
      // relevance (very simple: term in title first)
      if (term) {
        arr = arr.slice().sort((a,b) => {
          const at = a.title.toLowerCase().includes(term) ? 1 : 0;
          const bt = b.title.toLowerCase().includes(term) ? 1 : 0;
          return bt - at;
        });
      }
    }
    return arr;
  }, [s, debouncedQ]);

  function toggleSet<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    return next;
  }

  function clearAll() {
    setS({
      q: "",
      categories: new Set<Category>(),
      levels: new Set<Level>(),
      formats: new Set<Format>(),
      minMinutes: 0,
      maxMinutes: 600,
      publishedAfter: "",
      tags: new Set<string>(),
      sort: "relevance",
    });
  }

  return (
    <div className="w-full max-w-4xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Search Filters</h3>
        <p className="text-sm text-muted-foreground">
          Refine results instantly by category, level, format, duration, date, and tags.
        </p>
      </header>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="space-y-3">
          <Field label="Search">
            <input
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              placeholder="e.g., derivatives, python, UDL…"
              value={s.q}
              onChange={(e) => setS({ ...s, q: e.target.value })}
            />
          </Field>

          <Field label="Category">
            <PillGroup>
              {(["Math","CS","Statistics","Teaching"] as Category[]).map(c => (
                <Pill
                  key={c}
                  active={s.categories.has(c)}
                  onClick={() => setS({ ...s, categories: toggleSet(s.categories, c) })}
                >
                  {c}
                </Pill>
              ))}
            </PillGroup>
          </Field>

          <Field label="Level">
            <PillGroup>
              {(["Intro","Intermediate","Advanced"] as Level[]).map(l => (
                <Pill
                  key={l}
                  active={s.levels.has(l)}
                  onClick={() => setS({ ...s, levels: toggleSet(s.levels, l) })}
                >
                  {l}
                </Pill>
              ))}
            </PillGroup>
          </Field>
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          <Field label="Format">
            <PillGroup>
              {(["Course","Video","Article","Practice"] as Format[]).map(f => (
                <Pill
                  key={f}
                  active={s.formats.has(f)}
                  onClick={() => setS({ ...s, formats: toggleSet(s.formats, f) })}
                >
                  {f}
                </Pill>
              ))}
            </PillGroup>
          </Field>

          <Field label={`Duration (minutes): ${s.minMinutes}–${s.maxMinutes}`}>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                className="rounded-lg border px-3 py-2 outline-none border-gray-300"
                value={s.minMinutes}
                onChange={(e) => setS({ ...s, minMinutes: Math.max(0, Number(e.target.value || 0)) })}
              />
              <input
                type="number"
                min={0}
                className="rounded-lg border px-3 py-2 outline-none border-gray-300"
                value={s.maxMinutes}
                onChange={(e) => setS({ ...s, maxMinutes: Math.max(s.minMinutes, Number(e.target.value || 0)) })}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Tip: keep ranges reasonable for faster scanning.</p>
          </Field>

          <Field label="Published after">
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 outline-none border-gray-300"
              value={s.publishedAfter}
              onChange={(e) => setS({ ...s, publishedAfter: e.target.value })}
            />
          </Field>
        </div>

        {/* Column 3 */}
        <div className="space-y-3">
          <Field label="Tags (AND)">
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setS({ ...s, tags: toggleSet(s.tags, t) })}
                  className={[
                    "rounded-full border px-3 py-1 text-xs",
                    s.tags.has(t) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 hover:bg-gray-50 border-gray-300",
                  ].join(" ")}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Sort">
            <select
              className="w-full rounded-lg border px-3 py-2 outline-none border-gray-300"
              value={s.sort}
              onChange={(e) => setS({ ...s, sort: e.target.value as State["sort"] })}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="duration-asc">Shortest first</option>
              <option value="duration-desc">Longest first</option>
            </select>
          </Field>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={clearAll}
            >
              Clear all
            </button>
            <span role="status" aria-live="polite" className="text-sm text-gray-600">
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        id={listId}
        className="mt-5 divide-y rounded-md border bg-gray-50"
        role="list"
        aria-label="Filtered results"
      >
        {results.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">No results. Try broadening filters.</div>
        )}
        {results.map((it) => (
          <div key={it.id} role="listitem" className="p-4 flex items-start gap-3 bg-white">
            <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-gray-700" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{it.title}</span>
                <span className="text-[10px] rounded-full bg-gray-900 text-white px-1.5 py-0.5">{it.format}</span>
              </div>
              <p className="text-sm text-gray-600">{it.blurb ?? "—"}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span>{it.category} · {it.level}</span>
                <span>{it.minutes} min</span>
                <span>Published {it.published}</span>
                <span className="flex flex-wrap gap-1">
                  {it.tags.map(t => (
                    <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5">{t}</span>
                  ))}
                </span>
              </div>
            </div>
            {/* quick remove tag filter pill preview */}
            {Array.from(s.tags).length > 0 && (
              <div className="flex flex-col gap-1">
                {it.tags.filter(t => s.tags.has(t)).map(t => (
                  <button
                    key={t}
                    className="text-xs underline text-gray-600"
                    onClick={() => setS({ ...s, tags: toggleSet(s.tags, t) })}
                  >
                    Remove “{t}”
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- small UI helpers ---------------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function PillGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs border",
        active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 hover:bg-gray-50 border-gray-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
