"use client";

import { useMemo, useState } from "react";

/**
 * Lay of the Land — Compact Course Overview + Artifact Tour
 * Goal: show the big picture early (modules, objectives) and let learners
 * peek into a “large artifact” they’ll revisit through the course.
 * - Overview with objectives and module roadmap
 * - Breadcrumbs + tiny artifact explorer (parts + trade-offs)
 * - Fits in a card; mobile friendly; keyboard operable
 */

type Module = { id: string; title: string; brief: string };
type Part = { id: string; title: string; summary: string; tradeoffs: string[]; level: "Basic" | "Intermediate" | "Advanced" };
type Artifact = { id: string; name: string; about: string; parts: Part[] };

type View = "overview" | "artifact";

const MODULES: Module[] = [
  { id: "m1", title: "Foundations", brief: "Objectives, glossary, checkpoints" },
  { id: "m2", title: "Design & Prototyping", brief: "Wireframes, patterns, feedback" },
  { id: "m3", title: "Build & Integrate", brief: "Components, data, accessibility" },
  { id: "m4", title: "Evaluate & Iterate", brief: "Heuristics, analytics, revisions" },
];

const ARTIFACT: Artifact = {
  id: "a1",
  name: "Mini LMS Portal",
  about:
    "A small but complete course portal used across the term. We examine structure now, then dive deeper later.",
  parts: [
    {
      id: "p1",
      title: "Auth & Roles",
      summary: "Sign-in, student/instructor roles, protected routes, error states.",
      tradeoffs: ["Simplicity vs. fine-grained permissions", "UX friction vs. security"],
      level: "Basic",
    },
    {
      id: "p2",
      title: "Course Catalog",
      summary: "Browse/search courses, filters, empty states, pagination.",
      tradeoffs: ["Server cost vs. responsiveness", "Card density vs. readability"],
      level: "Intermediate",
    },
    {
      id: "p3",
      title: "Lesson Player",
      summary: "Video/reading, progress save, captions, keyboard control.",
      tradeoffs: ["Engagement vs. cognitive load", "Custom player vs. native controls"],
      level: "Intermediate",
    },
    {
      id: "p4",
      title: "Discussion Thread",
      summary: "Topic threads, moderation, reactions, report flow.",
      tradeoffs: ["Freedom vs. civility", "Real-time vs. simplicity"],
      level: "Advanced",
    },
  ],
};

export default function ExampleLayOfTheLand() {
  const [view, setView] = useState<View>("overview");
  const [activePart, setActivePart] = useState<string>(ARTIFACT.parts[0].id);

  const currentPart = useMemo(
    () => ARTIFACT.parts.find((p) => p.id === activePart) ?? ARTIFACT.parts[0],
    [activePart]
  );

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="lotl-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Breadcrumbs (ui-breadcrumbs) */}
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-1 text-xs text-gray-600">
            <Crumb label="Course" onClick={() => setView("overview")} active={view === "overview"} />
            <Sep />
            <Crumb
              label="Overview"
              onClick={() => setView("overview")}
              active={view === "overview"}
            />
            {view === "artifact" && (
              <>
                <Sep />
                <Crumb label="Artifact" onClick={() => setView("artifact")} active />
                <Sep />
                <li className="truncate text-gray-800" aria-current="page">
                  {currentPart.title}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-2">
          <h1 id="lotl-title" className="text-lg font-semibold tracking-tight">
            Lay of the Land — Big Picture First
          </h1>
          <p className="text-xs text-gray-600">
            See where we’re going, then skim a real artifact we’ll revisit in later modules.
          </p>
        </header>

        {view === "overview" ? (
          <Overview onExplore={() => setView("artifact")} />
        ) : (
          <ArtifactExplorer
            artifact={ARTIFACT}
            activePart={activePart}
            setActivePart={setActivePart}
            onBack={() => setView("overview")}
          />
        )}
      </div>
    </div>
  );
}

/* --------------------------- Overview Panel --------------------------- */
function Overview({ onExplore }: { onExplore: () => void }) {
  return (
    <section aria-labelledby="lotl-overview">
      <h2 id="lotl-overview" className="sr-only">
        Course overview
      </h2>

      {/* Objectives */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
        <p className="text-xs font-medium text-gray-800">Learning objectives (you’ll be able to…)</p>
        <ul className="mt-1 grid grid-cols-1 gap-1 text-[11px] text-gray-700">
          <li>Map UX goals to course modules and artifacts.</li>
          <li>Explain how parts interact (trade-offs, constraints).</li>
          <li>Navigate from overview → details without getting lost.</li>
        </ul>
      </div>

      {/* Module roadmap */}
      <div className="mt-2 rounded-md border border-gray-100 p-2">
        <p className="text-xs font-medium text-gray-800">Module roadmap</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {MODULES.map((m, i) => (
            <li key={m.id}>
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-800">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
                {i + 1}. {m.title}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-[11px] text-gray-600">
          We’ll return to the same artifact each module, revealing more complexity (Spiral).
        </p>
      </div>

      {/* Artifact teaser */}
      <article className="mt-2 rounded-md border border-gray-100 p-3">
        <h3 className="text-sm font-medium text-gray-900">{ARTIFACT.name}</h3>
        <p className="mt-0.5 text-sm text-gray-800">{ARTIFACT.about}</p>
        <ul className="mt-2 grid grid-cols-1 gap-1 text-[11px] text-gray-700">
          {ARTIFACT.parts.slice(0, 3).map((p) => (
            <li key={p.id} className="flex items-start gap-2">
              <LevelBadge level={p.level} />
              <span>
                <span className="font-medium">{p.title}:</span> {p.summary}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={onExplore}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Explore artifact
          </button>
        </div>
      </article>
    </section>
  );
}

/* ------------------------ Artifact Explorer Panel --------------------- */
function ArtifactExplorer({
  artifact,
  activePart,
  setActivePart,
  onBack,
}: {
  artifact: Artifact;
  activePart: string;
  setActivePart: (id: string) => void;
  onBack: () => void;
}) {
  const current = artifact.parts.find((p) => p.id === activePart) ?? artifact.parts[0];

  function onKeyList(e: React.KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
    );
    const idx = items.findIndex((el) => el === document.activeElement);
    if (idx < 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(idx + 1) % items.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length].focus();
    }
  }

  return (
    <section aria-labelledby="lotl-artifact">
      <h2 id="lotl-artifact" className="sr-only">
        Artifact explorer
      </h2>

      <div className="rounded-md border border-gray-100 p-2 bg-gray-50">
        <p className="text-xs text-gray-800">
          We’ll skim key parts now. Details come later—note trade-offs and how parts connect.
        </p>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {/* Left: parts list */}
        <div className="rounded-md border border-gray-100">
          <p className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            {artifact.name} — parts
          </p>
          <ul
            className="max-h-56 overflow-auto p-1"
            role="tablist"
            aria-label="Artifact parts"
            onKeyDown={onKeyList}
          >
            {artifact.parts.map((p) => {
              const selected = p.id === activePart;
              return (
                <li key={p.id} className="p-1">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActivePart(p.id)}
                    className={`w-full text-left rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      selected ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <LevelBadge level={p.level} />
                      <span className="truncate">{p.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: detail */}
        <div
          role="tabpanel"
          aria-label="Part details"
          className="rounded-md border border-gray-100 p-3"
        >
          <h3 className="text-sm font-medium text-gray-900">{current.title}</h3>
          <p className="mt-0.5 text-sm text-gray-800">{current.summary}</p>

          <p className="mt-2 text-xs font-medium text-gray-700">Design trade-offs</p>
          <ul className="mt-1 list-disc pl-5 text-[11px] text-gray-700">
            {current.tradeoffs.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href="#/docs/overview"
              className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              See in docs
            </a>
            <a
              href="#/assignments/map-to-artifact"
              className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Map objectives →
            </a>
            <button
              type="button"
              onClick={onBack}
              className="ml-auto rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              Back to overview
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ UI Bits ------------------------------- */
function Crumb({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`rounded px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          active ? "text-gray-900 font-medium" : "hover:text-gray-800"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </button>
    </li>
  );
}
function Sep() {
  return (
    <li aria-hidden="true" className="text-gray-400">
      /
    </li>
  );
}
function LevelBadge({ level }: { level: Part["level"] }) {
  const tone =
    level === "Advanced"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : level === "Intermediate"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${tone}`}>
      {level}
    </span>
  );
}
