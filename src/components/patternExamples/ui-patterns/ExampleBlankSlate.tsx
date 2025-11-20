
/* ========================================================================
    src/components/pattern-examples/ExampleBlankSlate.tsx
   Educational Blank Slate with guidance + CTAs
========================================================================= */
// src/components/pattern-examples/ExampleBlankSlate.tsx
"use client";

import { useMemo, useState } from "react";

type Template = {
  id: string;
  name: string;
  summary: string;
  estMinutes: number;
};

const TEMPLATES: Template[] = [
  { id: "tpl-quiz",   name: "Quick Diagnostic Quiz", summary: "3 questions to gauge prior knowledge.", estMinutes: 5 },
  { id: "tpl-module", name: "Module Starter",        summary: "Intro page + goals + first activity.",  estMinutes: 15 },
  { id: "tpl-syllabus", name: "Syllabus Import",     summary: "Upload CSV and auto-create weeks.",     estMinutes: 10 },
];

export default function ExampleBlankSlate() {
  // Demo app state: toggle to simulate “no content vs content exists”
  const [hasContent, setHasContent] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [picked, setPicked] = useState<Template | null>(null);

  // Progress hint (e.g., onboarding meter could live here)
  const progressHint = useMemo(() => (hasContent ? "You’ve created 1 module — great start!" : "No content yet"), [hasContent]);

  return (
    <div className="w-full max-w-5xl rounded-xl border p-6 shadow-sm bg-white">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Workspace</h3>
          <p className="text-sm text-muted-foreground">{progressHint}</p>
        </div>

        {/* Demo: toggle content to show how blank slate disappears */}
        <button
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => setHasContent((v) => !v)}
          aria-pressed={hasContent}
        >
          {hasContent ? "Reset to Blank" : "Import Sample Course"}
        </button>
      </header>

      {hasContent ? (
        <ContentPreview onAdd={() => setHasContent(true)} />
      ) : (
        <BlankSlate
          onPrimary={() => {
            setHasContent(true);
            setPicked({ id: "tpl-module", name: "Module Starter", summary: "", estMinutes: 15 });
          }}
          onTemplates={() => setShowTemplates(true)}
          onWatchTour={() => alert("Play 60-second tour video…")}
          onImport={() => {
            setHasContent(true);
            alert("Sample imported: Intro page + Quiz + Resource");
          }}
        />
      )}

      {/* Simple Template Picker */}
      {showTemplates && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowTemplates(false)}
        >
          <div
            className="max-w-xl w-full rounded-xl border bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Start from a template</h4>
              <button className="rounded-md border px-2 py-1 text-xs" onClick={() => setShowTemplates(false)}>
                Close
              </button>
            </div>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {TEMPLATES.map((tpl) => (
                <li key={tpl.id} className="rounded-lg border p-3">
                  <div className="text-sm font-medium">{tpl.name}</div>
                  <p className="mt-1 text-sm text-gray-600">{tpl.summary}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">~{tpl.estMinutes} min</span>
                    <button
                      className="rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white"
                      onClick={() => {
                        setPicked(tpl);
                        setHasContent(true);
                        setShowTemplates(false);
                      }}
                    >
                      Use template
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tiny confirmation toast */}
      {picked && (
        <div className="mt-3 rounded-lg border bg-emerald-50 p-3 text-sm text-emerald-900">
          Created from <span className="font-medium">{picked.name}</span>. You can edit details anytime.
        </div>
      )}
    </div>
  );
}

/* ======================= Blank Slate ======================= */

function BlankSlate(props: {
  onPrimary: () => void;
  onTemplates: () => void;
  onWatchTour: () => void;
  onImport: () => void;
}) {
  const { onPrimary, onTemplates, onWatchTour, onImport } = props;

  return (
    <section
      aria-label="Blank state"
      className="rounded-2xl border border-dashed p-8 text-center bg-gray-50"
    >
      <IllustrationNotebook aria-hidden />
      <h4 className="mt-4 text-xl font-semibold">Let’s set up your first learning space</h4>
      <p className="mx-auto mt-2 max-w-prose text-sm text-gray-600">
        Start from a ready-made template or create a blank module. You can import your syllabus to build weeks automatically.
      </p>

      {/* Primary & secondary CTAs */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          onClick={onPrimary}
        >
          Create first module
        </button>
        <button
          className="rounded-md border px-4 py-2 text-sm hover:bg-white"
          onClick={onTemplates}
        >
          Explore templates
        </button>
      </div>

      {/* Supportive actions (examples / help / import) */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
        <button className="underline-offset-4 hover:underline" onClick={onWatchTour}>
          Watch a 60-second tour
        </button>
        <span aria-hidden>·</span>
        <button className="underline-offset-4 hover:underline" onClick={onImport}>
          Import sample content
        </button>
        <span aria-hidden>·</span>
        <a
          className="underline-offset-4 hover:underline"
          href="https://ui-patterns.com/patterns/BlankSlate"
          target="_blank"
          rel="noreferrer"
        >
          See examples
        </a>
      </div>

      {/* First-step checklist (expectation setting) */}
      <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
        <ChecklistCard
          title="Define goals"
          body="Add 2–3 learning goals so students know what to achieve."
        />
        <ChecklistCard
          title="Add activity"
          body="Pick a quiz, assignment, or discussion to kick things off."
        />
        <ChecklistCard
          title="Publish"
          body="Set visibility and a due date. You can adjust later."
        />
      </ul>
    </section>
  );
}

function ChecklistCard({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-lg border bg-white p-3 text-left">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] text-white">1</span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{body}</p>
    </li>
  );
}

/* ======================= Content Preview (post-blank) ======================= */

function ContentPreview({ onAdd }: { onAdd: () => void }) {
  return (
    <section aria-label="Content preview" className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Module 1 — Introduction</div>
          <p className="text-sm text-gray-600">Overview page, a short quiz, and a reading.</p>
        </div>
        <button
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={onAdd}
        >
          Add activity
        </button>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        <li className="rounded-lg border p-3 bg-white">
          <div className="text-xs text-gray-600">Page</div>
          <div className="text-sm font-medium">Welcome & Goals</div>
        </li>
        <li className="rounded-lg border p-3 bg-white">
          <div className="text-xs text-gray-600">Quiz</div>
          <div className="text-sm font-medium">Prior Knowledge (3 Qs)</div>
        </li>
        <li className="rounded-lg border p-3 bg-white">
          <div className="text-xs text-gray-600">Resource</div>
          <div className="text-sm font-medium">Reading: What is a Function?</div>
        </li>
      </ul>
    </section>
  );
}

/* ======================= Tiny Illustration ======================= */

function IllustrationNotebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 160 110"
      className="mx-auto text-gray-400"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="20" y="20" width="120" height="70" rx="8" />
        <rect x="35" y="35" width="90" height="12" rx="3" />
        <rect x="35" y="53" width="60" height="10" rx="3" />
        <rect x="35" y="68" width="40" height="10" rx="3" />
      </g>
    </svg>
  );
}
