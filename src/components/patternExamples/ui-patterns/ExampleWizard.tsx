// src/components/pattern-examples/ExampleWizard.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * ExampleWizard
 * Education-focused wizard to create a course module:
 * 1) Basics  2) Activities  3) Review & Publish
 * - Progress indicator + step guard (simple validation)
 * - Keyboard accessible buttons
 * - Tailwind-only, no external deps
 */
export default function ExampleWizard() {
  type Basics = { title: string; objective: string; audience: "Undergrad" | "HS" | "Grad" | "" };
  type Activities = { hasReading: boolean; hasQuiz: boolean; hasDiscussion: boolean };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [basics, setBasics] = useState<Basics>({ title: "", objective: "", audience: "" });
  const [acts, setActs] = useState<Activities>({ hasReading: true, hasQuiz: false, hasDiscussion: false });
  const [published, setPublished] = useState(false);

  const totalSteps = 3;
  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  const basicsValid =
    basics.title.trim().length >= 4 &&
    basics.objective.trim().length >= 8 &&
    basics.audience !== "";

  const activitiesValid = acts.hasReading || acts.hasQuiz || acts.hasDiscussion;

  function goNext() {
    if (step === 1 && !basicsValid) return;
    if (step === 2 && !activitiesValid) return;
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  }
  function goPrev() {
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  }

  function publish() {
    // Here you would call an API; we only simulate success
    setPublished(true);
    setTimeout(() => setPublished(false), 2200);
  }

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Create Course Module (Wizard)</h3>
        <p className="text-sm text-muted-foreground">
          Break the task into steps: Basics → Activities → Review.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium">Step {step} of {totalSteps}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          <StepDot n={1} active={step >= 1} label="Basics" />
          <StepDot n={2} active={step >= 2} label="Activities" />
          <StepDot n={3} active={step >= 3} label="Review" />
        </div>
      </div>

      {/* Steps */}
      <div className="min-h-[260px]">
        {step === 1 && (
          <section aria-labelledby="basics-title" className="space-y-3">
            <h4 id="basics-title" className="text-base font-semibold">Module basics</h4>

            <Field label="Module title" htmlFor="mod-title">
              <input
                id="mod-title"
                className={clsInput(basics.title.trim().length >= 4)}
                placeholder="E.g., Introduction to Derivatives"
                value={basics.title}
                onChange={(e) => setBasics({ ...basics, title: e.target.value })}
              />
              <Hint ok={basics.title.trim().length >= 4}>
                At least 4 characters.
              </Hint>
            </Field>

            <Field label="Learning objective" htmlFor="mod-obj">
              <textarea
                id="mod-obj"
                rows={3}
                className={clsInput(basics.objective.trim().length >= 8)}
                placeholder="E.g., Students will be able to explain the concept of derivative as an instantaneous rate of change."
                value={basics.objective}
                onChange={(e) => setBasics({ ...basics, objective: e.target.value })}
              />
              <Hint ok={basics.objective.trim().length >= 8}>
                Describe what students will achieve (≥ 8 chars).
              </Hint>
            </Field>

            <Field label="Audience" htmlFor="aud">
              <select
                id="aud"
                className={clsInput(basics.audience !== "")}
                value={basics.audience}
                onChange={(e) => setBasics({ ...basics, audience: e.target.value as Basics["audience"] })}
              >
                <option value="">Select audience</option>
                <option value="HS">High School</option>
                <option value="Undergrad">Undergraduate</option>
                <option value="Grad">Graduate</option>
              </select>
              <Hint ok={basics.audience !== ""}>Choose the target cohort.</Hint>
            </Field>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="acts-title" className="space-y-3">
            <h4 id="acts-title" className="text-base font-semibold">Activities</h4>
            <p className="text-sm text-muted-foreground">
              Select at least one activity for this module.
            </p>

            <CheckboxRow
              id="act-reading"
              label="Reading (article or textbook section)"
              checked={acts.hasReading}
              onChange={(v) => setActs({ ...acts, hasReading: v })}
            />
            <CheckboxRow
              id="act-quiz"
              label="Quiz (auto-graded)"
              checked={acts.hasQuiz}
              onChange={(v) => setActs({ ...acts, hasQuiz: v })}
            />
            <CheckboxRow
              id="act-disc"
              label="Discussion (forum prompt)"
              checked={acts.hasDiscussion}
              onChange={(v) => setActs({ ...acts, hasDiscussion: v })}
            />

            {!activitiesValid && (
              <p className="text-sm text-red-600">Please select at least one activity.</p>
            )}
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="review-title" className="space-y-3">
            <h4 id="review-title" className="text-base font-semibold">Review & publish</h4>
            <SummaryRow label="Title" value={basics.title || "—"} />
            <SummaryRow label="Objective" value={basics.objective || "—"} />
            <SummaryRow label="Audience" value={basics.audience || "—"} />
            <SummaryRow
              label="Activities"
              value={[
                acts.hasReading && "Reading",
                acts.hasQuiz && "Quiz",
                acts.hasDiscussion && "Discussion",
              ].filter(Boolean).join(", ") || "—"}
            />

            {published ? (
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm">
                Module published! Learners can now access this module.
              </div>
            ) : (
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
                Review the details and click “Publish module”.
              </div>
            )}
          </section>
        )}
      </div>

      {/* Nav */}
      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 1}
          className={`px-3 py-2 rounded-md text-sm border ${step === 1 ? "text-gray-400 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
        >
          Back
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className={`px-4 py-2 rounded-md text-sm font-medium ${ (step === 1 && !basicsValid) || (step === 2 && !activitiesValid)
              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
            disabled={(step === 1 && !basicsValid) || (step === 2 && !activitiesValid)}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={publish}
            className="px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Publish module
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function clsInput(valid: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2 outline-none transition",
    valid ? "border-emerald-400 focus:ring-2 focus:ring-emerald-200" : "border-gray-300 focus:ring-2 focus:ring-gray-200",
  ].join(" ");
}

function Field(props: { label: string; htmlFor: string; children: React.ReactNode }) {
  const { label, htmlFor, children } = props;
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Hint({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p className={`mt-1 text-xs ${ok ? "text-emerald-700" : "text-gray-500"}`}>{children}</p>
  );
}

function StepDot({ n, active, label }: { n: number; active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] ${active ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}>
        {n}
      </span>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

function CheckboxRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="font-medium">{label}:</span>{" "}
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}
