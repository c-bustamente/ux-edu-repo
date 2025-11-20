import { useEffect, useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

const STORAGE_KEY = "uxedu.zeroBlock.checklist.v1";

const initialChecklist: ChecklistItem[] = [
  { id: "profile", label: "Update your profile and time zone", done: false },
  { id: "syllabus", label: "Read the course syllabus (objectives & grading)", done: false },
  { id: "intro", label: "Introduce yourself in the Social Forum", done: false },
  { id: "diagnostic", label: "Take the diagnostic quiz (ungraded)", done: false },
];

function loadChecklist(): ChecklistItem[] {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return initialChecklist;
    const parsed = JSON.parse(raw) as ChecklistItem[];
    // reconcile in case of future item changes
    const map = new Map(parsed.map((i) => [i.id, i.done]));
    return initialChecklist.map((i) => ({ ...i, done: map.get(i.id) ?? i.done }));
  } catch {
    return initialChecklist;
  }
}

function saveChecklist(items: ChecklistItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export default function ExampleZeroBlock() {
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklist);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  useEffect(() => {
    setItems(loadChecklist());
  }, []);

  useEffect(() => {
    saveChecklist(items);
  }, [items]);

  const progress = useMemo(() => {
    const done = items.filter((i) => i.done).length;
    return Math.round((done / items.length) * 100);
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  };

  const resetChecklist = () => setItems(initialChecklist);

  return (
    <div
      className="w-full max-w-3xl mx-auto p-4 sm:p-6"
      aria-labelledby="course-welcome-title"
    >
      <header className="mb-4 sm:mb-6">
        <h1 id="course-welcome-title" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Welcome to “Foundations of Data & UX”
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Start here to understand objectives, key links, and your first steps.
        </p>
      </header>

      {/* Objectives & status (Zero Block essentials) */}
      <section
        aria-labelledby="objectives-title"
        className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-4"
      >
        <h2 id="objectives-title" className="text-lg font-medium">
          Course objectives (week 0)
        </h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-800 space-y-1">
          <li>Identify how the course is organized and how to succeed.</li>
          <li>Locate the Social Forum and Technical Help channels.</li>
          <li>Review assessment weights and success criteria.</li>
        </ul>

        {/* Inline help box (no overlay) */}
        <details
          className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
          open={helpOpen}
          onToggle={(e) => setHelpOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary
            className="cursor-pointer select-none outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            aria-controls="helpbox-content"
            aria-expanded={helpOpen}
          >
            Need a quick tour?
          </summary>
          <div id="helpbox-content" className="mt-2 text-sm text-gray-700">
            This “Zero Block” gives you orientation before any graded task:
            objectives, key links, and a short checklist. Complete the steps
            below and you’ll be ready for Week 1.
          </div>
        </details>
      </section>

      {/* Key Links */}
      <nav
        aria-labelledby="key-links-title"
        className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-4"
      >
        <h2 id="key-links-title" className="text-lg font-medium">
          Key links
        </h2>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <li>
            <a
              href="#/syllabus"
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open syllabus and grading policy"
            >
              Syllabus & Grading
            </a>
          </li>
          <li>
            <a
              href="#/social-forum"
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open social forum"
            >
              Social Forum
            </a>
          </li>
          <li>
            <a
              href="#/technical-help"
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open technical help"
            >
              Technical Help
            </a>
          </li>
          <li>
            <a
              href="#/guides"
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open learner guides"
            >
              Learner Guides
            </a>
          </li>
        </ul>
      </nav>

      {/* Quick-start Checklist with Progress */}
      <section
        aria-labelledby="checklist-title"
        className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 id="checklist-title" className="text-lg font-medium">
            First steps checklist
          </h2>
          <div className="min-w-[200px]" aria-live="polite">
            <div
              className="h-2 w-full rounded-full bg-gray-200"
              role="progressbar"
              aria-label="Checklist progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 text-right">{progress}%</p>
          </div>
        </div>

        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  item.done ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"
                }`}
                aria-pressed={item.done}
                aria-label={item.done ? `Mark "${item.label}" as not done` : `Mark "${item.label}" as done`}
              >
                {/* simple inline check icon */}
                {item.done && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-white">
                    <path d="M7.6 13.2 4.8 10.4l-1.4 1.4 4.2 4.2 9-9-1.4-1.4z" />
                  </svg>
                )}
              </button>
              <label
                htmlFor={`chk-${item.id}`}
                className={`text-sm ${item.done ? "text-gray-500 line-through" : "text-gray-800"}`}
              >
                {item.label}
              </label>
              {/* hidden checkbox purely for semantics/ATs */}
              <input
                id={`chk-${item.id}`}
                type="checkbox"
                className="sr-only"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <a
            href="#/start-here"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Start here
          </a>
          <button
            type="button"
            onClick={resetChecklist}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset checklist
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Tip: You can revisit this Zero Block anytime. Progress saves in your browser.
        </p>
      </section>
    </div>
  );
}