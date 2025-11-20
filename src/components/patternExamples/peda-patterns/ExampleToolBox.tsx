"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Tool Box — Reusable Course Toolkit (compact)
 * Purpose: give students a small, persistent toolkit of templates/snippets/resources
 * they can reuse across assignments and later courses. Emphasizes:
 * - Reusability (add to “My Kit”, generality slider)
 * - Recognition over recall (preview + copy)
 * - Consistency & standards (kinds, suggested paths)
 *
 * Fits within a card; no external deps; keyboard & SR friendly.
 */

type Kind = "Template" | "Snippet" | "Checklist";
type Course = "Foundations" | "Data" | "UX";

interface Tool {
  id: string;
  title: string;
  kind: Kind;
  course: Course;
  tags: string[];
  content: string;       // template/snippet text
  pathHint: string;      // suggested location/naming convention
  generality: number;    // 1–5 (how reusable)
  added: boolean;        // in "My Kit"
}

const STORAGE_KEY = "uxedu.ped.toolbox.v1";

const SEED: Tool[] = [
  {
    id: "t1",
    title: "TS Unit Test Skeleton",
    kind: "Snippet",
    course: "Foundations",
    tags: ["testing", "typescript"],
    pathHint: "src/tests/<feature>.test.ts",
    generality: 4,
    added: false,
    content: `describe("FunctionName", () => {
  it("does what it should", () => {
    // arrange
    // act
    // assert
  });
});`,
  },
  {
    id: "t2",
    title: "SQL Aggregation Template",
    kind: "Template",
    course: "Data",
    tags: ["sql", "analytics"],
    pathHint: "sql/aggregation_<entity>.sql",
    generality: 5,
    added: false,
    content: `SELECT <cols>, COUNT(*) AS n
FROM <table>
WHERE <filters>
GROUP BY <cols>
ORDER BY n DESC;`,
  },
  {
    id: "t3",
    title: "UX Critique Rubric (Markdown)",
    kind: "Checklist",
    course: "UX",
    tags: ["rubric", "markdown"],
    pathHint: "docs/rubrics/critique.md",
    generality: 4,
    added: false,
    content: `# Critique Rubric
- **Clarity**: Plain language; user goal stated.
- **Evidence**: Screenshot/data/trace cited.
- **Actionability**: Specific fix proposed.
Score each 0–3; total 0–9.`,
  },
  {
    id: "t4",
    title: "Experiment Log Template",
    kind: "Template",
    course: "Foundations",
    tags: ["reproducibility", "notebook"],
    pathHint: "logs/exp_<date>.md",
    generality: 5,
    added: false,
    content: `# Experiment Log
**Date**:
**Goal**:
**Setup**:
**Result**:
**Next**:`,
  },
  {
    id: "t5",
    title: "Python Quick Plot Helper",
    kind: "Snippet",
    course: "Data",
    tags: ["python", "matplotlib"],
    pathHint: "utils/plotting.py",
    generality: 3,
    added: false,
    content: `def quick_plot(x, y, title=""):
    import matplotlib.pyplot as plt
    plt.figure()
    plt.plot(x, y)
    plt.title(title)
    plt.xlabel("x"); plt.ylabel("y")
    plt.show()`,
  },
];

function load(): Tool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Tool[];
    // Guard against schema drifts
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED;
    return parsed.map((p) => ({ ...p }));
  } catch {
    return SEED;
  }
}
function save(tools: Tool[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch {
    // ignore
  }
}

export default function ExampleToolBox() {
  const [tools, setTools] = useState<Tool[]>(SEED);
  const [course, setCourse] = useState<"All" | Course>("All");
  const [q, setQ] = useState<string>("");
  const [announce, setAnnounce] = useState<string>("");

  useEffect(() => {
    setTools(load());
  }, []);
  useEffect(() => {
    save(tools);
  }, [tools]);

  const library = useMemo(() => tools.filter((t) => !t.added), [tools]);
  const myKit = useMemo(() => tools.filter((t) => t.added), [tools]);

  const libFiltered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return library.filter((t) => {
      const okCourse = course === "All" ? true : t.course === course;
      const okText =
        text.length === 0 ||
        t.title.toLowerCase().includes(text) ||
        t.tags.join(" ").toLowerCase().includes(text);
      return okCourse && okText;
    });
  }, [library, course, q]);

  function toggleAdd(id: string, add: boolean) {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, added: add } : t)));
    setAnnounce(add ? "Added to My Kit." : "Removed from My Kit.");
  }

  function setGenerality(id: string, g: number) {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, generality: g } : t)));
    setAnnounce("Updated generality.");
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setAnnounce("Copied to clipboard.");
    } catch {
      setAnnounce("Copy failed. Select and copy manually from the preview.");
    }
  }

  async function exportKit() {
    const payload = JSON.stringify(
      myKit.map(({ id, title, kind, pathHint, generality }) => ({
        id,
        title,
        kind,
        pathHint,
        generality,
      })),
      null,
      2
    );
    await copy(payload);
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="tb-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="tb-title" className="text-lg font-semibold tracking-tight">Tool Box — Reusable Tools</h1>
          <p className="text-xs text-gray-600">Build a personal kit of templates/snippets to reuse across courses.</p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-xs w-full sm:w-40">
            <span className="block text-gray-700 mb-1">Filter by course</span>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value as "All" | Course)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by course"
            >
              <option>All</option>
              <option>Foundations</option>
              <option>Data</option>
              <option>UX</option>
            </select>
          </label>
          <label className="text-xs flex-1">
            <span className="block text-gray-700 mb-1">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Title or tag…"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search tools"
            />
          </label>
          <button
            type="button"
            onClick={exportKit}
            className="sm:ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Copy My Kit (JSON)
          </button>
        </div>

        {/* Library */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="lib-title">
          <h2 id="lib-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Library (instructor + prior courses)
          </h2>
          <ul className="max-h-48 overflow-auto divide-y divide-gray-100">
            {libFiltered.map((t) => (
              <li key={t.id} className="px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{t.title}</p>
                    <p className="text-[11px] text-gray-600">
                      <KindBadge kind={t.kind} /> • {t.course} • {t.tags.map((x) => `#${x}`).join(" ")}
                    </p>
                    <details className="mt-1 rounded border border-gray-200 bg-gray-50 p-2">
                      <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                        Preview & path
                      </summary>
                      <p className="mt-1 text-[11px] text-gray-700">Suggested path: <code className="font-mono">{t.pathHint}</code></p>
                      <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap rounded border border-gray-200 bg-white p-2 text-[11px] text-gray-800">
{t.content}
                      </pre>
                    </details>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <label className="text-[11px] text-gray-700">
                      Generality
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={t.generality}
                        onChange={(e) => setGenerality(t.id, Number(e.target.value))}
                        className="block w-28"
                        aria-label="Generality (1–5)"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copy(t.content)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAdd(t.id, true)}
                        className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {libFiltered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-600">No matching tools.</li>
            )}
          </ul>
        </section>

        {/* My Kit */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="kit-title">
          <h2 id="kit-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            My Kit (reusable across assignments)
          </h2>
          <ul className="max-h-40 overflow-auto divide-y divide-gray-100">
            {myKit.map((t) => (
              <li key={t.id} className="px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{t.title}</p>
                    <p className="text-[11px] text-gray-600">
                      <KindBadge kind={t.kind} /> • {t.course} • path <code className="font-mono">{t.pathHint}</code>
                    </p>
                  </div>
                  <div className="shrink-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => copy(t.content)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAdd(t.id, false)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {myKit.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-600">Your kit is empty. Add a tool from the Library.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Live region */}
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}

/* ---------- Small UI bits ---------- */
function KindBadge({ kind }: { kind: Kind }) {
  const tone =
    kind === "Snippet"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : kind === "Template"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${tone}`}>
      {kind}
    </span>
  );
}
