"use client";

import { useMemo, useState } from "react";

/**
 * Gold Star — Compact Excellence Showcase
 * Scenario: Instructor highlights exemplary student work for a module.
 * - Public recognition to motivate; sets quality bar with rubric hints.
 * - Privacy toggle (anonymize names) and announcement preview.
 * - Compact card (max-w-lg), keyboard/ARIA friendly, no external deps.
 */

type Submission = {
  id: string;
  student: string;
  alias: string; // for anonymized view
  title: string;
  score: number;
  excerpt: string;
  highlights: string[];
  awarded?: boolean;
};

type ModuleId = "algebra" | "biology";
type CourseModule = {
  id: ModuleId;
  name: string;
  rubricTags: string[];
  submissions: Submission[];
};

const MODULES: CourseModule[] = [
  {
    id: "algebra",
    name: "Module: Linear Functions — Assignment 1 (Real-world modeling)",
    rubricTags: ["Clarity", "Accuracy", "Use of Evidence"],
    submissions: [
      {
        id: "s1",
        student: "María González",
        alias: "Student A",
        title: "Modeling a Bus Fare with y = 500 + 150x",
        score: 96,
        excerpt:
          "Explains intercept as base fare and slope as cost per kilometer; includes units and a labeled graph.",
        highlights: ["Clear variable definitions", "Units and labels present", "Graph matches equation"],
      },
      {
        id: "s2",
        student: "Diego López",
        alias: "Student B",
        title: "Cafeteria Pricing: y = 1200 + 800x",
        score: 92,
        excerpt: "Connects slope to price per combo; checks model with two sample points for sanity.",
        highlights: ["Checks with examples", "Readable reasoning"],
      },
      {
        id: "s3",
        student: "Ana Pérez",
        alias: "Student C",
        title: "Phone Plan: y = 3000 + 50x",
        score: 89,
        excerpt: "Discusses limitations (promo caps) and suggests piecewise improvements.",
        highlights: ["Notes assumptions", "Suggests extensions"],
      },
    ],
  },
  {
    id: "biology",
    name: "Module: Cell Division — Lab Sketch",
    rubricTags: ["Scientific Accuracy", "Visual Labeling", "Explanation"],
    submissions: [
      {
        id: "s4",
        student: "Luis Torres",
        alias: "Student A",
        title: "Mitotic Stages: Annotated Diagram",
        score: 95,
        excerpt: "Labels prophase to telophase; relates chromosome alignment to spindle fibers.",
        highlights: ["Accurate labels", "Stage sequencing", "Brief justification"],
      },
      {
        id: "s5",
        student: "Camila Rivas",
        alias: "Student B",
        title: "Errors in Mitosis: Mini-Guide",
        score: 93,
        excerpt: "Connects nondisjunction risk to checkpoint failure; cites textbook page.",
        highlights: ["Uses sources", "Connects to checkpoints"],
      },
      {
        id: "s6",
        student: "Javier Silva",
        alias: "Student C",
        title: "Cytokinesis Sketch",
        score: 90,
        excerpt: "Compares animal cell cleavage furrow vs. plant cell plate formation.",
        highlights: ["Compares contexts", "Concise visuals"],
      },
    ],
  },
];

export default function ExampleGoldStar() {
  const [moduleId, setModuleId] = useState<ModuleId>("algebra");
  const [anonymize, setAnonymize] = useState<boolean>(false);
  const [awards, setAwards] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const mod = useMemo(() => MODULES.find((m) => m.id === moduleId)!, [moduleId]);

  const nominees = mod.submissions.map((s) => ({
    ...s,
    awarded: Boolean(awards[s.id]),
  }));

  const awardedSubs = nominees.filter((n) => n.awarded);
  const starsThisModule = awardedSubs.length;

  const announcement = buildAnnouncement(mod.name, awardedSubs, anonymize);

  async function copyAnnouncement() {
    try {
      await navigator.clipboard.writeText(announcement);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  function toggleAward(id: string) {
    setAwards((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="gs-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Header */}
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="gs-title" className="text-lg font-semibold tracking-tight">
              Gold Star — Showcase Excellence
            </h1>
            <p className="text-xs text-gray-600">
              Highlight exemplary work to set the bar. Recognition is public; grades are unaffected.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800">
            Recognition • No grade change
          </span>
        </header>

        {/* Module & privacy controls */}
        <section className="rounded-md border border-gray-100 p-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-xs font-medium text-gray-800" htmlFor="gs-module">
              Module
            </label>
            <select
              id="gs-module"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value as ModuleId)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <label className="sm:ml-auto inline-flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={anonymize}
                onChange={(e) => setAnonymize(e.target.checked)}
              />
              Anonymize names
            </label>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {mod.rubricTags.map((t) => (
              <Pill key={t} label={t} />
            ))}
          </div>
        </section>

        {/* Nominees list */}
        <section className="mt-2 rounded-md border border-gray-100" aria-labelledby="gs-nominees">
          <h2 id="gs-nominees" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            Nominees (select to award)
          </h2>
          <ul className="divide-y divide-gray-100">
            {nominees.map((n) => (
              <li key={n.id} className="px-3 py-2">
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAward(n.id)}
                    aria-pressed={n.awarded}
                    className={`mt-0.5 rounded-md border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      n.awarded
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <StarIcon filled={n.awarded} />
                    <span className="ml-1">{n.awarded ? "Gold Star" : "Award"}</span>
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {anonymize ? n.alias : n.student}
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-800">{n.title}</span>
                    </p>
                    <p className="text-[11px] text-gray-600">Score: {n.score}</p>
                    <details className="mt-1 rounded border border-gray-200 bg-gray-50 p-2">
                      <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                        View excerpt & highlights
                      </summary>
                      <p className="mt-1 text-[11px] text-gray-800">{n.excerpt}</p>
                      <ul className="mt-1 list-disc pl-5 text-[11px] text-gray-800">
                        {n.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Status + announcement */}
        <section className="mt-2 rounded-md border border-gray-100 p-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${
                starsThisModule > 0
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-gray-300 bg-gray-50 text-gray-700"
              }`}
              aria-live="polite"
            >
              Stars this module: {starsThisModule}
            </span>

            <button
              type="button"
              onClick={copyAnnouncement}
              className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Copy announcement
            </button>
          </div>

          <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded border border-gray-200 bg-white p-2 font-mono text-[11px] text-gray-800">
{announcement}
          </pre>

          {copied && (
            <p className="mt-1 text-[11px] text-green-700" aria-live="polite">
              Announcement copied to clipboard.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ Helpers ------------------------------ */

function buildAnnouncement(moduleName: string, awarded: Submission[], anonymize: boolean): string {
  if (awarded.length === 0) {
    return `Course announcement — ${moduleName}
No Gold Stars yet. Keep pushing! Remember the rubric: focus on clarity, accuracy, and supporting evidence.`;
  }
  const names = awarded
    .map((s) => (anonymize ? s.alias : s.student))
    .join(", ");
  const entries = awarded
    .map(
      (s, i) =>
        `${i + 1}. ${anonymize ? s.alias : s.student} — “${s.title}” (score ${s.score}) — ${s.highlights
          .slice(0, 2)
          .join("; ")}.`
    )
    .join("\n");

  return `Course announcement — ${moduleName}
🎖️ Gold Star awarded to: ${names}

Why this is excellent:
${entries}

What to emulate next time:
• Align your explanation with the rubric criteria (clarity, accuracy, evidence).
• Add units/labels and check an example case.

Congrats to the awardees! This is recognition only (no grade change).`;
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-800">
      {label}
    </span>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-white">
      <path d="M10 2.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15.8 4.8 18.8l1-5.9L1.5 8.7l5.9-.9L10 2.5z" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-amber-500">
      <path
        d="M10 2.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15.8 4.8 18.8l1-5.9L1.5 8.7l5.9-.9L10 2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
