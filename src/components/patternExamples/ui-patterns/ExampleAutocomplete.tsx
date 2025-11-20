// src/components/pattern-examples/ExampleAutocomplete.tsx
"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * ExampleAutocomplete
 * --------------------------------------------------------------------
 * Education use case: quickly find courses/resources by name, code, or topic.
 * - Debounced "fetch" (mocked with a timeout) with max results.
 * - Highlights matching substrings.
 * - Keyboard accessible (ARIA combobox + listbox).
 * - Recent searches when query is empty.
 */

type Item = {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string; // e.g., Course, Video, Article
};

const DATASET: ReadonlyArray<Item> = [
  { id: "c-calculus-101", title: "Calculus 101", subtitle: "Limits, derivatives, applications", tag: "Course" },
  { id: "c-calculus-201", title: "Calculus 201", subtitle: "Integrals and series", tag: "Course" },
  { id: "v-limit-laws", title: "Video: Limit Laws", subtitle: "12 min — quick recap", tag: "Video" },
  { id: "a-derivative-tips", title: "Article: Derivative Problem-Solving Tips", subtitle: "Reading — 8 min", tag: "Article" },
  { id: "p-chain-rule", title: "Practice: Chain Rule Set", subtitle: "10 items — auto-graded", tag: "Practice" },
  { id: "c-linear-algebra", title: "Linear Algebra", subtitle: "Vectors, matrices, eigenvalues", tag: "Course" },
  { id: "c-statistics-intro", title: "Introduction to Statistics", subtitle: "Descriptive, probability, inference", tag: "Course" },
  { id: "c-python-ds", title: "Python for Data Science", subtitle: "Numpy, Pandas, Matplotlib", tag: "Course" },
  { id: "v-product-rule", title: "Video: Product Rule", subtitle: "6 min — examples", tag: "Video" },
  { id: "a-udl-guide", title: "Article: UDL Quick Guide", subtitle: "Universal Design for Learning", tag: "Article" },
  // add more as needed
] as const;

const RECENTS_DEFAULT: Item[] = [
  DATASET[0],
  DATASET[8],
  DATASET[6],
];

export default function ExampleAutocomplete() {
  const comboId = useId();
  const listboxId = useId();

  // query / results
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Item[]>([]);
  const [recents, setRecents] = useState<Item[]>(RECENTS_DEFAULT);

  // interaction state
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxResults = 8;

  // Debounced search (mock async)
  useEffect(() => {
    let alive = true;
    const handle = window.setTimeout(() => {
      if (!alive) return;
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      mockSearch(query, maxResults).then((items) => {
        if (!alive) return;
        setResults(items);
        setLoading(false);
        setActiveIndex(items.length ? 0 : -1);
      });
    }, 220); // debounce

    return () => {
      alive = false;
      window.clearTimeout(handle);
    };
  }, [query]);

  // open/close behavior
  useEffect(() => {
    if (query.trim() || recents.length) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query, recents]);

  // derived
  const showRecents = !query.trim() && !loading && open;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    const list = showRecents ? recents : results;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!list.length) return;
      setActiveIndex((i) => (i + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!list.length) return;
      setActiveIndex((i) => (i - 1 + list.length) % list.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (!list.length) return;
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (!list.length) return;
      setActiveIndex(list.length - 1);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && list[activeIndex]) {
        e.preventDefault();
        onSelect(list[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      (inputRef.current as HTMLInputElement | null)?.blur();
    }
  }

  function onSelect(item: Item) {
    setQuery(item.title);
    setOpen(false);
    setActiveIndex(-1);
    // update recents (dedupe)
    setRecents((prev) => {
      const next = [item, ...prev.filter((r) => r.id !== item.id)];
      return next.slice(0, 5);
    });
    // mock navigation
    alert(`Open: ${item.title}`);
  }

  const match = useMemo(() => query.trim().toLowerCase(), [query]);
  const highlight = (text: string) => {
    if (!match) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(match);
    if (idx === -1) return <>{text}</>;
    const before = text.slice(0, idx);
    const mid = text.slice(idx, idx + match.length);
    const after = text.slice(idx + match.length);
    return (
      <>
        {before}
        <mark className="bg-yellow-200">{mid}</mark>
        {after}
      </>
    );
  };

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Autocomplete</h3>
        <p className="text-sm text-muted-foreground">
          Type to search courses and resources. Use ↑/↓ and Enter to pick.
        </p>
      </header>

      {/* Combobox */}
      <div className="relative">
        <label htmlFor={comboId} className="sr-only">Search</label>
        <input
          ref={inputRef}
          id={comboId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
          className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
          placeholder="Search by title or topic…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
        />

        {/* Panel */}
        {open && (
          <div
            className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg"
            onMouseDown={(e) => e.preventDefault()} // keep input focus
          >
            {/* Loading */}
            {loading && (
              <div className="p-3 text-sm text-muted-foreground">Searching…</div>
            )}

            {/* Recents */}
            {showRecents && (
              <div
                role="listbox"
                id={listboxId}
                aria-label="Recent"
                className="max-h-64 overflow-auto"
              >
                <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500">Recent</div>
                {recents.map((it, i) => (
                  <OptionRow
                    key={it.id}
                    id={`${listboxId}-opt-${i}`}
                    item={it}
                    active={i === activeIndex}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => onSelect(it)}
                  />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && !!query.trim() && (
              <div role="listbox" id={listboxId} className="max-h-64 overflow-auto">
                {results.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No results</div>
                ) : (
                  results.map((it, i) => (
                    <OptionRow
                      key={it.id}
                      id={`${listboxId}-opt-${i}`}
                      item={it}
                      active={i === activeIndex}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => onSelect(it)}
                      highlightFn={highlight}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <p className="mt-3 text-xs text-gray-500">
        Tip: prefetch suggestions from your API, cache locally, and cap to {maxResults} items to keep it fast.
      </p>
    </div>
  );
}

/* ---------- row + mock search ---------- */

function OptionRow(props: {
  id: string;
  item: Item;
  active: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  highlightFn?: (text: string) => React.ReactNode;
}) {
  const { id, item, active, onMouseEnter, onClick, highlightFn } = props;
  const title = highlightFn ? highlightFn(item.title) : item.title;
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      className={[
        "cursor-pointer px-3 py-2 text-sm",
        active ? "bg-gray-100" : "bg-white",
      ].join(" ")}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate">{title}</div>
          {item.subtitle && <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>}
        </div>
        {item.tag && (
          <span className="text-[10px] shrink-0 rounded-full bg-gray-900 px-1.5 py-0.5 text-white">
            {item.tag}
          </span>
        )}
      </div>
    </div>
  );
}

function mockSearch(q: string, cap: number): Promise<Item[]> {
  const s = q.trim().toLowerCase();
  if (!s) return Promise.resolve([]);
  // simulate latency
  return new Promise((resolve) => {
    const t = window.setTimeout(() => {
      window.clearTimeout(t);
      const scored = DATASET.map((it) => ({
        item: it,
        score: score(it, s),
      }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, cap)
        .map((x) => x.item);
      resolve(scored);
    }, 280);
  });
}

function score(it: Item, s: string): number {
  // simple scoring: title match x2 + subtitle match
  let sc = 0;
  const title = it.title.toLowerCase();
  const sub = (it.subtitle || "").toLowerCase();
  if (title.includes(s)) sc += 2;
  if (sub.includes(s)) sc += 1;
  return sc;
}
