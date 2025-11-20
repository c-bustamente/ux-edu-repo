// 3) src/components/pattern-examples/ExampleCourseResources.tsx
"use client";

import { useMemo, useRef, useState } from "react";

type ResourceType = "video" | "pdf" | "slides" | "article" | "quiz";
type SortKey = "module" | "type" | "title";

interface A11yMeta {
  captions?: boolean;
  transcript?: boolean;
  altText?: boolean;
  taggedPdf?: boolean;
}

interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  module: string;
  durationMin?: number;
  pages?: number;
  slides?: number;
  readMin?: number;
  questions?: number;
  a11y: A11yMeta;
  href: string;
}

const DATA: ResourceItem[] = [
  {
    id: "r1",
    title: "Orientation Video: How This Course Works",
    type: "video",
    module: "Week 0",
    durationMin: 4,
    a11y: { captions: true, transcript: true },
    href: "#/video/orientation",
  },
  {
    id: "r2",
    title: "Syllabus & Grading Policy (PDF)",
    type: "pdf",
    module: "Week 0",
    pages: 6,
    a11y: { taggedPdf: true },
    href: "#/docs/syllabus",
  },
  {
    id: "r3",
    title: "Module 1 Slides: Introduction to UX",
    type: "slides",
    module: "Week 1",
    slides: 18,
    a11y: { altText: true },
    href: "#/slides/ux-intro",
  },
  {
    id: "r4",
    title: "Article: Dual Coding in Interface Learning",
    type: "article",
    module: "Week 1",
    readMin: 7,
    a11y: { transcript: true },
    href: "#/articles/dual-coding",
  },
  {
    id: "r5",
    title: "Demo Video: Annotating Wireframes",
    type: "video",
    module: "Week 2",
    durationMin: 6,
    a11y: { captions: true },
    href: "#/video/wireframe-annot",
  },
  {
    id: "r6",
    title: "Practice Quiz: Accessibility Basics",
    type: "quiz",
    module: "Week 2",
    questions: 10,
    a11y: { altText: true },
    href: "#/quiz/a11y-basics",
  },
  {
    id: "r7",
    title: "Reading: Mayer’s Principles (Summary PDF)",
    type: "pdf",
    module: "Week 2",
    pages: 3,
    a11y: { taggedPdf: true },
    href: "#/docs/mayer-summary",
  },
];

const TABS: Array<{ key: "all" | ResourceType; label: string }> = [
  { key: "all", label: "All" },
  { key: "video", label: "Video" },
  { key: "pdf", label: "PDF" },
  { key: "slides", label: "Slides" },
  { key: "article", label: "Article" },
  { key: "quiz", label: "Quiz" },
];

function isAccessible(a: A11yMeta): boolean {
  return Boolean(a.captions || a.transcript || a.altText || a.taggedPdf);
}

function TypeIcon({ type }: { type: ResourceType }) {
  const common = "h-4 w-4";
  switch (type) {
    case "video":
      return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={common}>
          <path d="M2 5h10a2 2 0 0 1 2 2v1l4-2v8l-4-2v1a2 2 0 0 1-2 2H2z" />
        </svg>
      );
    case "pdf":
      return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={common}>
          <path d="M4 2h7l5 5v11H4zM11 2v5h5" />
        </svg>
      );
    case "slides":
      return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={common}>
          <path d="M2 4h16v10H2zM5 16h10v2H5z" />
        </svg>
      );
    case "article":
      return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={common}>
          <path d="M3 3h14v14H3zM6 6h8M6 9h8M6 12h5" />
        </svg>
      );
    case "quiz":
      return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={common}>
          <path d="M3 4h14v12H3zM6 8h8M6 11h5" />
        </svg>
      );
  }
}

function A11yBadges({ a }: { a: A11yMeta }) {
  const items: Array<{ label: string; ok: boolean }> = [
    { label: "Captions", ok: !!a.captions },
    { label: "Transcript", ok: !!a.transcript },
    { label: "Alt text", ok: !!a.altText },
    { label: "Tagged PDF", ok: !!a.taggedPdf },
  ];
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((it) => (
        <li
          key={it.label}
          className={`rounded px-2 py-0.5 text-[11px] border ${
            it.ok ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
          aria-label={`${it.label}: ${it.ok ? "available" : "not available"}`}
        >
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export default function ExampleResourceDesign() {
  const [activeTab, setActiveTab] = useState<"all" | ResourceType>("all");
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("module");
  const tablistRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let out = DATA.filter((r) => (activeTab === "all" ? true : r.type === activeTab));
    if (accessibleOnly) out = out.filter((r) => isAccessible(r.a11y));
    return [...out].sort((a, b) => {
      if (sortKey === "module") return a.module.localeCompare(b.module);
      if (sortKey === "type") return a.type.localeCompare(b.type);
      return a.title.localeCompare(b.title);
    });
  }, [activeTab, accessibleOnly, sortKey]);

  const handleTabKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs || tabs.length === 0) return;
    const idx = Array.from(tabs).indexOf(e.currentTarget);
    const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
  };

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="res-title">
      {/* Single compact card container */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="res-title" className="text-lg font-semibold tracking-tight">
            Course Resources
          </h1>
          <p className="text-xs text-gray-600">
            Standardized labels, metadata, and accessibility.
          </p>
        </header>

        {/* Controls: tabs, a11y toggle, sort (compact) */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
          <div ref={tablistRef} role="tablist" aria-label="Filter by type" className="flex flex-wrap gap-1.5">
            {TABS.map((t) => {
              const selected = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={selected}
                  onKeyDown={handleTabKey}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-2.5 py-1.5 rounded-md text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    selected
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={accessibleOnly}
                onChange={(e) => setAccessibleOnly(e.target.checked)}
                aria-label="Show accessible resources only"
              />
              Accessible only
            </label>

            <label className="text-xs flex items-center gap-2">
              <span className="text-gray-700">Sort</span>
              <select
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                aria-label="Sort resources"
              >
                <option value="module">Module</option>
                <option value="type">Type</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>

          <p className="mt-1 text-[11px] text-gray-600" aria-live="polite">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"} shown
          </p>
        </div>

        {/* Scrollable list area (compact height) */}
        <section className="mt-2 max-h-72 overflow-auto rounded-md border border-gray-100" aria-label="Resource list">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gray-500">
                  <path d="M10 2a8 8 0 1 0 .001 16.001A8 8 0 0 0 10 2Zm1 11H9v2h2v-2Zm0-7H9v6h2V6Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">No resources match your filters.</p>
              <p className="text-xs text-gray-500">Try disabling “Accessible only” or switching tabs.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const titleId = `res-title-${r.id}`;
                return (
                  <li key={r.id}>
                    <article className="p-3" aria-labelledby={titleId}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-gray-700" aria-hidden="true">
                          <TypeIcon type={r.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 id={titleId} className="text-sm font-medium text-gray-900">
                            {r.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span className="inline-flex items-center gap-1">
                              <span className="sr-only">Type: </span>
                              <span className="rounded border border-gray-200 px-1.5 py-0.5 text-[11px] bg-white">
                                {r.type}
                              </span>
                            </span>
                            <span>
                              <span className="sr-only">Module: </span>
                              {r.module}
                            </span>
                            <span aria-label="Resource details">
                              {r.type === "video" && `${r.durationMin ?? 0} min`}
                              {r.type === "pdf" && `${r.pages ?? 0} pages`}
                              {r.type === "slides" && `${r.slides ?? 0} slides`}
                              {r.type === "article" && `${r.readMin ?? 0} min read`}
                              {r.type === "quiz" && `${r.questions ?? 0} questions`}
                            </span>
                          </p>

                          <div className="mt-1">
                            <A11yBadges a={r.a11y} />
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <a
                              href={r.href}
                              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              aria-label={`Open ${r.title}`}
                            >
                              Open
                            </a>
                            <a
                              href="#/guides/resource-standards"
                              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              Standards guide
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Tiny help block (optional, collapsible) */}
        <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            What’s standardized?
          </summary>
          <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
            <li>Type labels (Video, PDF, Slides, Article, Quiz)</li>
            <li>Predictable metadata (module and length)</li>
            <li>Accessibility flags (captions, alt text, transcript, tagged PDF)</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
