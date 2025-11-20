"use client";

import { useEffect, useId, useState } from "react";

/**
 * ExampleInlineHelpBox
 * ---------------------------------------------------------------------------
 * Education-focused inline help for creating an assignment:
 * - Contextual help sits right beside the controls where confusion often occurs
 *   (grading policy, due date policy).
 * - Dismissible ("Got it") with optional "Remind me later" compact chip.
 * - Accessible semantics (aria-live for helpful hints, aria-controls/expanded).
 * - Tailwind-only; drop-in to your modal preview.
 */
export default function ExampleInlineHelpBox() {
  // persist dismissal in-memory (could be localStorage if desired)
  const [dismissed, setDismissed] = useState<{ grading: boolean; late: boolean }>({
    grading: false,
    late: false,
  });
  const [compact, setCompact] = useState<{ grading: boolean; late: boolean }>({
    grading: false,
    late: false,
  });

  // Example form state (just to make it feel real)
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState<number | "">("");
  const [latePolicy, setLatePolicy] = useState<"none" | "penalty" | "accept-without-penalty">("none");

  // ids for a11y tying help to fields
  const titleId = useId();
  const pointsId = useId();
  const lateId = useId();

  // optional: announce when a help box appears
  useEffect(() => {
    // no-op; kept to show where you'd push analytics/announce to screen readers
  }, [dismissed, compact]);

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Create Assignment</h3>
        <p className="text-sm text-muted-foreground">
          Inline help appears near fields to speed up onboarding and reduce errors.
        </p>
      </header>

      {/* Title */}
      <Field label="Assignment title" htmlFor={titleId}>
        <input
          id={titleId}
          className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
          placeholder="e.g., Limits and Continuity — Practice Set"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      {/* Points + Inline help (GRADING) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-start">
        <Field label="Points" htmlFor={pointsId}>
          <input
            id={pointsId}
            type="number"
            min={0}
            className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
            placeholder="e.g., 100"
            value={points}
            onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
            aria-describedby={!dismissed.grading ? "help-grading" : undefined}
          />
        </Field>

        {/* Inline Help Box: Grading policy */}
        {!dismissed.grading && (
          <InlineHelp
            id="help-grading"
            title="Grading policy tip"
            body={
              <>
                Use <b>100 points</b> for a simple rubric. If you plan to weight assignments later,
                points will scale automatically in the gradebook.
              </>
            }
            links={[
              { label: "Learn about weighted grades", href: "https://support.example.edu/weighted-grades" },
            ]}
            onDismiss={() => setDismissed((s) => ({ ...s, grading: true }))}
            onCompact={() => setCompact((s) => ({ ...s, grading: true }))}
          />
        )}

        {/* Compact chip if user chose "Remind me later" */}
        {compact.grading && dismissed.grading && (
          <CompactChip
            label="Grading tip"
            onRestore={() => {
              setDismissed((s) => ({ ...s, grading: false }));
              setCompact((s) => ({ ...s, grading: false }));
            }}
          />
        )}
      </div>

      {/* Late policy + Inline help (LATE SUBMISSIONS) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-start">
        <Field label="Late submissions" htmlFor={lateId}>
          <select
            id={lateId}
            className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
            value={latePolicy}
            onChange={(e) => setLatePolicy(e.target.value as typeof latePolicy)}
            aria-describedby={!dismissed.late ? "help-late" : undefined}
          >
            <option value="none">Do not accept late work</option>
            <option value="penalty">Accept with penalty</option>
            <option value="accept-without-penalty">Accept without penalty</option>
          </select>
        </Field>

        {!dismissed.late && (
          <InlineHelp
            id="help-late"
            title="Late policy guidance"
            body={
              <>
                For introductory courses, consider <b>Accept with penalty</b> (e.g., −10% per day),
                which balances flexibility and accountability.
              </>
            }
            links={[
              { label: "Late policy best practices", href: "https://teaching.example.edu/late-policy" },
            ]}
            onDismiss={() => setDismissed((s) => ({ ...s, late: true }))}
            onCompact={() => setCompact((s) => ({ ...s, late: true }))}
          />
        )}

        {compact.late && dismissed.late && (
          <CompactChip
            label="Late policy tip"
            onRestore={() => {
              setDismissed((s) => ({ ...s, late: false }));
              setCompact((s) => ({ ...s, late: false }));
            }}
          />
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className={[
            "rounded-lg px-3 py-2 text-sm font-medium transition",
            title && points !== "" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-600 cursor-not-allowed",
          ].join(" ")}
          disabled={!title || points === ""}
          onClick={() => alert("Assignment saved")}
        >
          Save assignment
        </button>
      </div>
    </div>
  );
}

/* ---------- Inline Help UI pieces ---------- */

function InlineHelp(props: {
  id: string;
  title: string;
  body: React.ReactNode;
  links?: { label: string; href: string }[];
  onDismiss: () => void;
  onCompact: () => void;
}) {
  const { id, title, body, links = [], onDismiss, onCompact } = props;

  return (
    <aside
      id={id}
      role="note"
      aria-live="polite"
      className="max-w-xs rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 shadow-sm"
    >
      <div className="font-semibold">{title}</div>
      <div className="mt-1">{body}</div>

      {!!links.length && (
        <ul className="mt-2 list-disc pl-4 space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                target="_blank"
                rel="noreferrer"
                href={l.href}
                className="underline underline-offset-2 hover:text-sky-800"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md border border-sky-300 bg-white px-2.5 py-1 text-xs font-medium text-sky-900 hover:bg-sky-100"
        >
          Got it
        </button>
        <button
          type="button"
          onClick={onCompact}
          className="rounded-md border border-sky-200 px-2.5 py-1 text-xs text-sky-800 hover:bg-sky-100"
          aria-label="Hide for now, keep a compact reminder"
        >
          Remind me later
        </button>
      </div>
    </aside>
  );
}

function CompactChip({ label, onRestore }: { label: string; onRestore: () => void }) {
  return (
    <button
      type="button"
      onClick={onRestore}
      className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs text-sky-900"
      title="Show the help again"
    >
      💡 {label}
    </button>
  );
}

function Field(props: { label: string; htmlFor: string; children: React.ReactNode }) {
  const { label, htmlFor, children } = props;
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
