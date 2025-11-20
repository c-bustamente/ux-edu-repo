
// 3) src/components/pattern-examples/ExampleGlossary.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EntryStatus = "approved" | "pending";
type FilterKey = "all" | "approved" | "pending";

interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  example?: string;
  status: EntryStatus;
}

const STORAGE_KEY = "uxedu.glossary.v1.compact";

const SEED: GlossaryEntry[] = [
  {
    id: "g-ux-heuristics",
    term: "Heuristic Evaluation",
    definition:
      "A usability inspection method where experts review an interface against recognized heuristics to find issues.",
    example:
      "Teams assess a course dashboard using Nielsen’s heuristics to spot visibility or consistency problems.",
    status: "approved",
  },
  {
    id: "g-dual-coding",
    term: "Dual Coding",
    definition:
      "Learning benefits from combining verbal and visual information to strengthen memory and understanding.",
    example:
      "A key term is explained with a short text and an accompanying diagram in the module slides.",
    status: "approved",
  },
  {
    id: "g-lms-thread",
    term: "Threaded Discussion",
    definition:
      "A structured conversation where replies are nested, helping learners follow topic sub-threads.",
    example:
      "Students reply to a prompt and then respond under peers to keep sub-topics organized.",
    status: "pending",
  },
];

function save(entries: GlossaryEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

function load(): GlossaryEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as GlossaryEntry[];
    if (!Array.isArray(parsed)) return SEED;
    return parsed.map((e) => ({
      id: String(e.id),
      term: String(e.term),
      definition: String(e.definition),
      example: e.example ? String(e.example) : undefined,
      status: e.status === "approved" ? "approved" : "pending",
    }));
  } catch {
    return SEED;
  }
}

export default function ExampleGlossary() {
  // data
  const [entries, setEntries] = useState<GlossaryEntry[]>(SEED);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  const [announce, setAnnounce] = useState("");
  const [error, setError] = useState("");

  // add form
  const [showForm, setShowForm] = useState(false);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const termRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setEntries(load()), []);
  useEffect(() => save(entries), [entries]);

  // filter + search + sort
  const filtered = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().trim();
    let list = entries.filter((e) => (filter === "all" ? true : e.status === filter));
    if (q.trim()) {
      const nq = norm(q);
      list = list.filter(
        (e) =>
          norm(e.term).includes(nq) ||
          norm(e.definition).includes(nq) ||
          (e.example ? norm(e.example).includes(nq) : false)
      );
    }
    list.sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));
    return list;
  }, [entries, filter, q]);

  const onAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const t = term.trim();
    const d = definition.trim();
    if (!t || !d) {
      setError("Please provide at least a term and a definition.");
      return;
    }
    const exists = entries.some((en) => en.term.toLowerCase() === t.toLowerCase());
    if (exists) {
      setError("This term already exists. Consider editing the existing entry.");
      return;
    }
    const newEntry: GlossaryEntry = {
      id: `g-${Date.now()}`,
      term: t,
      definition: d,
      example: example.trim() || undefined,
      status: "pending",
    };
    setEntries((prev) => [...prev, newEntry]);
    setAnnounce(`Added term "${t}" as pending.`);
    setTerm("");
    setDefinition("");
    setExample("");
    setShowForm(false);
    searchRef.current?.focus();
  };

  const toggleStatus = (id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === "approved" ? "pending" : "approved" } : e
      )
    );
    const updated = entries.find((e) => e.id === id);
    if (updated) {
      const to = updated.status === "approved" ? "pending" : "approved";
      setAnnounce(`Marked "${updated.term}" as ${to}.`);
    }
  };

  const removeEntry = (id: string) => {
    const target = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (target) setAnnounce(`Removed "${target.term}".`);
  };

  return (
    <div
      className="w-full max-w-lg mx-auto"
      aria-labelledby="glossary-title"
    >
      {/* single compact card container */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="glossary-title" className="text-lg font-semibold tracking-tight">
            Collaborative Glossary
          </h1>
          <p className="text-xs text-gray-600">
            Build shared vocabulary with concise definitions and examples.
          </p>
        </header>

        {/* Controls (compact) */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex-1 text-xs">
            <span className="sr-only">Search terms</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search term, definition, or example…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="text-xs">
            <span className="sr-only">Filter</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterKey)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter glossary entries"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v);
              setTimeout(() => termRef.current?.focus(), 0);
            }}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-expanded={showForm}
            aria-controls="add-form"
          >
            {showForm ? "Close" : "Add term"}
          </button>
        </div>

        <p className="mt-1 text-[11px] text-gray-600" aria-live="polite">
          {filtered.length} entr{filtered.length === 1 ? "y" : "ies"} shown
        </p>

        {/* Scrollable list area (compact height) */}
        <section
          className="mt-2 max-h-64 overflow-auto rounded-md border border-gray-100"
          aria-label="Glossary list"
        >
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gray-500">
                  <path d="M10 2a8 8 0 1 0 .001 16.001A8 8 0 0 0 10 2Zm1 11H9v2h2v-2Zm0-7H9v6h2V6Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">No entries match your search.</p>
              <p className="text-xs text-gray-500">Try a different keyword or add a new term.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <li key={e.id} className="p-3">
                  <article aria-labelledby={`term-title-${e.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          id={`term-title-${e.id}`}
                          className="text-sm font-medium text-gray-900"
                        >
                          {e.term}
                          {e.status === "pending" && (
                            <span className="ml-2 align-middle rounded px-1.5 py-0.5 text-[10px] border bg-amber-50 text-amber-700 border-amber-200">
                              pending
                            </span>
                          )}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-800 line-clamp-3">
                          {e.definition}
                        </p>
                        {e.example && (
                          <p className="mt-0.5 text-xs text-gray-600">
                            <span className="font-medium text-gray-700">Example: </span>
                            {e.example}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStatus(e.id)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={
                            e.status === "approved"
                              ? `Mark ${e.term} as pending`
                              : `Approve ${e.term}`
                          }
                        >
                          {e.status === "approved" ? "Mark pending" : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeEntry(e.id)}
                          className="inline-flex items-center justify-center rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label={`Remove ${e.term}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Collapsible Add Form (compact) */}
        {showForm && (
          <section
            id="add-form"
            aria-labelledby="add-term-title"
            className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3"
          >
            <h2 id="add-term-title" className="text-sm font-medium">
              Suggest a new term
            </h2>
            <p className="text-[11px] text-gray-600">
              Submissions are added as <span className="font-medium">pending</span> for review.
            </p>

            <form onSubmit={onAdd} className="mt-2 space-y-2" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="text-sm">
                  <span className="block text-gray-700 mb-1">Term *</span>
                  <input
                    ref={termRef}
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-invalid={!!error && !term.trim()}
                  />
                </label>
                <label className="text-sm">
                  <span className="block text-gray-700 mb-1">Example (optional)</span>
                  <input
                    type="text"
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Definition *</span>
                <textarea
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-invalid={!!error && !definition.trim()}
                />
              </label>

              {error && (
                <p className="text-xs text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add term
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTerm("");
                    setDefinition("");
                    setExample("");
                    setError("");
                    termRef.current?.focus();
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Clear
                </button>
              </div>
              <p className="text-[11px] text-gray-500">Fields marked * are required.</p>
            </form>
          </section>
        )}
      </div>

      {/* SR-only announcements */}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}