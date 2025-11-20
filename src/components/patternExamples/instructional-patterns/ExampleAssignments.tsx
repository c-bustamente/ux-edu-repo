"use client";

import { useEffect, useMemo, useState } from "react";

type AssignmentStatus = "open" | "submitted" | "graded";

type RubricItem = {
  criterion: string;
  description: string;
};

type Assignment = {
  id: string;
  title: string;
  objectives: string[];
  dueISO: string; // e.g., "2025-11-20T23:59:00Z"
  status: AssignmentStatus;
  grade?: number; // if graded
  rubric: RubricItem[];
  helpHref: string; // forum or DM link
  submitHref: string; // placeholder
};

type SubmissionRecord = {
  fileName: string;
  tsISO: string;
  message?: string;
};

const STORAGE_KEY = "uxedu.example.assignments.v1";

const ASSIGNMENTS_SEED: Assignment[] = [
  {
    id: "a1",
    title: "Assignment 1 — Wireframe Critique",
    objectives: [
      "Apply Nielsen heuristics to a course dashboard.",
      "Write concise issue statements with suggested fixes.",
    ],
    // due in ~7 days from now as a reasonable example
    dueISO: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "open",
    rubric: [
      { criterion: "Clarity", description: "Findings are clearly explained in plain language." },
      { criterion: "Evidence", description: "Each issue references a concrete UI example/screenshot." },
      { criterion: "Actionability", description: "Suggestions are specific and feasible." },
    ],
    helpHref: "#/forum/assignments",
    submitHref: "#/submit/a1",
  },
  {
    id: "a2",
    title: "Assignment 0 — Syllabus Acknowledgment",
    objectives: [
      "Confirm you read the success criteria and grading policy.",
      "Ask one clarifying question about expectations.",
    ],
    // already closed & graded (yesterday)
    dueISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "graded",
    grade: 100,
    rubric: [
      { criterion: "Completion", description: "Acknowledgment submitted by due date." },
      { criterion: "Question Quality", description: "Question shows engagement and specificity." },
    ],
    helpHref: "#/forum/zero-block",
    submitHref: "#/submit/a0",
  },
];

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/zip",
];
const MAX_FILE_MB = 10;

function formatDue(dueISO: string): { label: string; isLate: boolean } {
  const due = new Date(dueISO);
  const now = new Date();
  const ms = due.getTime() - now.getTime();
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const dateLabel = due.toLocaleDateString(undefined, opts);
  if (ms < 0) {
    return { label: `Past due • ${dateLabel}`, isLate: true };
  }
  return { label: `Due in ${days} day${days === 1 ? "" : "s"} • ${dateLabel}`, isLate: false };
}

function loadState(): {
  assignments: Assignment[];
  submissions: Record<string, SubmissionRecord | undefined>;
} {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return { assignments: ASSIGNMENTS_SEED, submissions: {} };
    const parsed = JSON.parse(raw) as { assignments: Assignment[]; submissions: Record<string, SubmissionRecord> };
    // Small guard to avoid schema drift
    if (!Array.isArray(parsed.assignments)) throw new Error("bad");
    return parsed;
  } catch {
    return { assignments: ASSIGNMENTS_SEED, submissions: {} };
  }
}

function saveState(payload: { assignments: Assignment[]; submissions: Record<string, SubmissionRecord | undefined> }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export default function ExampleAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS_SEED);
  const [submissions, setSubmissions] = useState<Record<string, SubmissionRecord | undefined>>({});
  const [expandedRubric, setExpandedRubric] = useState<Record<string, boolean>>({});
  const [announce, setAnnounce] = useState<string>("");

  useEffect(() => {
    const { assignments: a, submissions: s } = loadState();
    setAssignments(a);
    setSubmissions(s);
  }, []);

  useEffect(() => {
    saveState({ assignments, submissions });
  }, [assignments, submissions]);

  const openAssignments = useMemo(() => assignments.filter((a) => a.status === "open"), [assignments]);

  const onSubmit = (a: Assignment, file: File | null, message: string) => {
    if (!file) {
      setAnnounce("Please attach a file before submitting.");
      return { ok: false, error: "no-file" } as const;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setAnnounce("Unsupported file type. Use PDF, DOCX, or ZIP.");
      return { ok: false, error: "bad-type" } as const;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setAnnounce(`File too large. Max ${MAX_FILE_MB} MB.`);
      return { ok: false, error: "too-big" } as const;
    }
    // Save submission and update status
    const rec: SubmissionRecord = { fileName: file.name, tsISO: new Date().toISOString(), message: message || undefined };
    setSubmissions((prev) => ({ ...prev, [a.id]: rec }));
    setAssignments((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "submitted" } : x)));
    setAnnounce(`Submitted “${a.title}” successfully.`);
    return { ok: true } as const;
  };

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="assignments-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="assignments-title" className="text-lg font-semibold tracking-tight">Assignments</h1>
          <p className="text-xs text-gray-600">Clear objectives, rubrics, deadlines, and feedback.</p>
        </header>

        {/* scrollable list, compact height */}
        <div className="max-h-96 overflow-auto rounded-md border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {assignments.map((a) => (
              <li key={a.id} className="p-3">
                <AssignmentCard
                  a={a}
                  submitted={submissions[a.id]}
                  expanded={!!expandedRubric[a.id]}
                  onToggleRubric={() => setExpandedRubric((m) => ({ ...m, [a.id]: !m[a.id] }))}
                  onSubmit={onSubmit}
                />
              </li>
            ))}
          </ul>
        </div>

        <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            Submission standards (quick help)
          </summary>
          <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
            <li>Allowed: PDF, DOCX, ZIP. Max {MAX_FILE_MB} MB.</li>
            <li>Name files <code className="font-mono">lastname_assignmentX.pdf</code>.</li>
            <li>Use the forum for clarifications before the due date.</li>
          </ul>
        </details>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}

function StatusPill({ a }: { a: Assignment }) {
  const { label, isLate } = formatDue(a.dueISO);
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border";
  if (a.status === "graded") {
    return (
      <span className={`${base} bg-green-50 text-green-700 border-green-200`}>
        <Dot colorClass="bg-green-500" />
        Graded {typeof a.grade === "number" ? `• ${a.grade}%` : ""}
      </span>
    );
  }
  if (a.status === "submitted") {
    return (
      <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>
        <Dot colorClass="bg-blue-500" />
        Submitted • {label}
      </span>
    );
  }
  // open
  return (
    <span
      className={`${base} ${isLate ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
    >
      <Dot colorClass={isLate ? "bg-red-500" : "bg-amber-500"} />
      {label}
    </span>
  );
}

function Dot({ colorClass }: { colorClass: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${colorClass}`} aria-hidden="true" />;
}

function AssignmentCard(props: {
  a: Assignment;
  submitted?: SubmissionRecord;
  expanded: boolean;
  onToggleRubric: () => void;
  onSubmit: (a: Assignment, file: File | null, message: string) => { ok: boolean; error?: string };
}) {
  const { a, submitted, expanded, onToggleRubric, onSubmit } = props;
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const { label } = formatDue(a.dueISO);
  const canSubmit = a.status === "open";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(a, file, message);
  };

  return (
    <article aria-labelledby={`a-title-${a.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={`a-title-${a.id}`} className="text-sm font-medium text-gray-900">
            {a.title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-600">{label}</p>
        </div>
        <StatusPill a={a} />
      </div>

      <ul className="mt-2 text-sm text-gray-800 list-disc pl-5 space-y-0.5">
        {a.objectives.map((o, idx) => (
          <li key={idx}>{o}</li>
        ))}
      </ul>

      {/* Rubric toggle */}
      <div className="mt-2">
        <button
          type="button"
          onClick={onToggleRubric}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-expanded={expanded}
          aria-controls={`rubric-${a.id}`}
        >
          {expanded ? "Hide rubric" : "Show rubric"}
        </button>
      </div>

      {expanded && (
        <div
          id={`rubric-${a.id}`}
          className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2"
        >
          <h3 className="text-xs font-medium text-gray-700 mb-1">Rubric</h3>
          <ul className="text-xs text-gray-700 list-disc pl-5 space-y-0.5">
            {a.rubric.map((r, i) => (
              <li key={i}>
                <span className="font-medium">{r.criterion}:</span> {r.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission area */}
      {canSubmit ? (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2" noValidate>
          <label className="block">
            <span className="block text-xs text-gray-700 mb-1">Attach file (PDF, DOCX, or ZIP)</span>
            <input
              type="file"
              accept=".pdf,.docx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
              onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
              className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="block">
            <span className="block text-xs text-gray-700 mb-1">Message to graders (optional)</span>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Anything we should know about your submission?"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
            <a
              href={a.helpHref}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Ask in forum
            </a>
          </div>

          <p className="text-[11px] text-gray-500">
            Max {MAX_FILE_MB} MB • We store your latest submission.
          </p>
        </form>
      ) : (
        <div className="mt-3 rounded-md border border-gray-100 p-2">
          {a.status === "submitted" && (
            <p className="text-xs text-gray-700">
              Latest submission:{" "}
              <span className="font-medium">{submitted?.fileName ?? "—"}</span>{" "}
              <span className="text-gray-500">
                ({submitted ? new Date(submitted.tsISO).toLocaleString() : ""})
              </span>
            </p>
          )}
          {a.status === "graded" && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-800">
                Final grade: <span className="font-semibold">{a.grade}%</span>
              </p>
              <a
                href={a.helpHref}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Discuss feedback
              </a>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
