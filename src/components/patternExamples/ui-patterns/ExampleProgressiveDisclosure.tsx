// src/components/pattern-examples/ExampleProgressiveDisclosure.tsx
"use client";

import { useId, useState } from "react";

/**
 * ExampleProgressiveDisclosure
 * ------------------------------------------------------------
 * Use case: Create Quiz
 * - Essentials: title, due date, points
 * - Advanced (on demand): time limit, attempts, shuffling, access window
 * - Expert (nested): scoring method, per-question penalty
 * - Keyboard accessible toggles, aria-controls/expanded, focus management
 */

export default function ExampleProgressiveDisclosure() {
  // essential
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [points, setPoints] = useState<number | "">("");

  // progressive sections
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExpert, setShowExpert] = useState(false);

  // advanced
  const [timeLimit, setTimeLimit] = useState<number | "">("");
  const [attempts, setAttempts] = useState<number>(1);
  const [shuffle, setShuffle] = useState(true);
  const [openWindow, setOpenWindow] = useState(false);
  const [openFrom, setOpenFrom] = useState("");
  const [openUntil, setOpenUntil] = useState("");

  // expert
  const [scoring, setScoring] = useState<"latest" | "highest" | "average">("highest");
  const [penalty, setPenalty] = useState<number | "">("");

  // ids for a11y
  const advId = useId();
  const expId = useId();

  const essentialsValid = title.trim().length >= 4 && points !== "" && Number(points) >= 0;

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Progressive Disclosure — Create Quiz</h3>
        <p className="text-sm text-muted-foreground">
          Show the essentials first; reveal advanced options only if needed.
        </p>
      </header>

      {/* Essentials */}
      <section className="space-y-3">
        <Field label="Quiz title" htmlFor="q-title">
          <input
            id="q-title"
            className={clsInput(title.trim().length >= 4)}
            placeholder="e.g., Derivatives — Quiz 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Hint ok={title.trim().length >= 4}>At least 4 characters.</Hint>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Due date" htmlFor="q-due">
            <input
              id="q-due"
              type="datetime-local"
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
            <Help>Optional — learners will see the deadline and reminders.</Help>
          </Field>

          <Field label="Total points" htmlFor="q-pts">
            <input
              id="q-pts"
              type="number"
              min={0}
              className={clsInput(points !== "" && Number(points) >= 0)}
              value={points}
              onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <Hint ok={points !== "" && Number(points) >= 0}>Keep it simple (e.g., 100).</Hint>
          </Field>
        </div>
      </section>

      {/* Advanced toggle */}
      <DisclosureToggle
        id={advId}
        open={showAdvanced}
        onToggle={() => setShowAdvanced((s) => !s)}
        label="Advanced options"
        summary={!showAdvanced ? shortAdvancedSummary({ timeLimit, attempts, shuffle, openWindow }) : undefined}
      />

      {/* Advanced content */}
      {showAdvanced && (
        <section
          id={advId}
          aria-live="polite"
          className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Time limit (minutes)" htmlFor="q-time">
              <input
                id="q-time"
                type="number"
                min={0}
                className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Leave blank for no limit"
              />
              <Help>Blank = no limit; recommended 20–30 for short quizzes.</Help>
            </Field>

            <Field label="Attempts allowed" htmlFor="q-attempts">
              <input
                id="q-attempts"
                type="number"
                min={1}
                className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
                value={attempts}
                onChange={(e) => setAttempts(Math.max(1, Number(e.target.value)))}
              />
              <Help>Common defaults: 1, 2, or 3 attempts.</Help>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={shuffle}
              onChange={(e) => setShuffle(e.target.checked)}
            />
            Shuffle questions
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={openWindow}
              onChange={(e) => setOpenWindow(e.target.checked)}
            />
            Restrict access to a specific time window
          </label>

          {openWindow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Opens at" htmlFor="q-open-from">
                <input
                  id="q-open-from"
                  type="datetime-local"
                  className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
                  value={openFrom}
                  onChange={(e) => setOpenFrom(e.target.value)}
                />
              </Field>
              <Field label="Closes at" htmlFor="q-open-until">
                <input
                  id="q-open-until"
                  type="datetime-local"
                  className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
                  value={openUntil}
                  onChange={(e) => setOpenUntil(e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* Nested disclosure: Expert */}
          <DisclosureToggle
            id={expId}
            open={showExpert}
            onToggle={() => setShowExpert((s) => !s)}
            label="Expert scoring settings"
            small
            summary={!showExpert ? `Scoring: ${labelForScoring(scoring)}${penalty !== "" ? ` • Penalty: ${penalty}%` : ""}` : undefined}
          />

          {showExpert && (
            <div
              id={expId}
              className="mt-2 rounded-md border border-gray-200 bg-white p-3 space-y-3"
            >
              <Field label="Scoring method" htmlFor="q-scoring">
                <select
                  id="q-scoring"
                  className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
                  value={scoring}
                  onChange={(e) => setScoring(e.target.value as typeof scoring)}
                >
                  <option value="latest">Latest attempt</option>
                  <option value="highest">Highest score</option>
                  <option value="average">Average of attempts</option>
                </select>
                <Help>“Highest” is a common pedagogical choice to encourage practice.</Help>
              </Field>

              <Field label="Wrong answer penalty (%)" htmlFor="q-penalty">
                <input
                  id="q-penalty"
                  type="number"
                  min={0}
                  max={100}
                  className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
                  placeholder="Optional"
                  value={penalty}
                  onChange={(e) => setPenalty(e.target.value === "" ? "" : Math.max(0, Math.min(100, Number(e.target.value))))}
                />
                <Help>Optional; avoid excessive penalties for formative assessments.</Help>
              </Field>
            </div>
          )}
        </section>
      )}

      {/* Actions */}
      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() => {
            setShowAdvanced(false);
            setShowExpert(false);
            setTitle("");
            setDue("");
            setPoints("");
            setTimeLimit("");
            setAttempts(1);
            setShuffle(true);
            setOpenWindow(false);
            setOpenFrom("");
            setOpenUntil("");
            setScoring("highest");
            setPenalty("");
          }}
        >
          Reset
        </button>
        <button
          type="button"
          disabled={!essentialsValid}
          className={[
            "rounded-md px-4 py-2 text-sm font-medium",
            essentialsValid ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-600 cursor-not-allowed",
          ].join(" ")}
          onClick={() => alert("Quiz created")}
        >
          Create quiz
        </button>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function DisclosureToggle({
  id,
  open,
  onToggle,
  label,
  summary,
  small = false,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  label: string;
  summary?: string;
  small?: boolean;
}) {
  return (
    <div className="mt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className={[
          "w-full text-left rounded-md border px-3 py-2 transition",
          open ? "bg-gray-100 border-gray-300" : "bg-white hover:bg-gray-50 border-gray-300",
          small ? "text-sm" : "",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{label}</span>
          <span className="text-xs text-gray-600">{open ? "Hide" : "Show"}</span>
        </div>
        {!open && summary && (
          <div className="mt-1 text-xs text-gray-500 line-clamp-1">{summary}</div>
        )}
      </button>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Hint({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return <p className={`mt-1 text-xs ${ok ? "text-emerald-700" : "text-gray-500"}`}>{children}</p>;
}

function Help({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-gray-500">{children}</p>;
}

function clsInput(valid: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2 outline-none transition",
    valid ? "border-emerald-400 focus:ring-2 focus:ring-emerald-200" : "border-gray-300 focus:ring-2 focus:ring-gray-200",
  ].join(" ");
}

function shortAdvancedSummary(args: {
  timeLimit: number | "";
  attempts: number;
  shuffle: boolean;
  openWindow: boolean;
}) {
  const parts: string[] = [];
  if (args.timeLimit !== "") parts.push(`${args.timeLimit}m limit`);
  if (args.attempts !== 1) parts.push(`${args.attempts} attempts`);
  if (!args.shuffle) parts.push("no shuffle");
  if (args.openWindow) parts.push("window set");
  return parts.length ? parts.join(" • ") : "Default advanced settings";
}

function labelForScoring(v: "latest" | "highest" | "average") {
  return v === "latest" ? "Latest attempt" : v === "highest" ? "Highest score" : "Average of attempts";
}
