"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Early Bird — Lesson Primer
 * Presents key concepts at the very start of a module to foreground them,
 * with a tiny preview question and a simple completeness meter.
 * Optimized for LMS/MOOC contexts; compact to sit atop a module page.
 */

type Concept = { id: string; title: string; teaser: string; noted: boolean };
type Quiz = {
  prompt: string;
  choices: string[];
  correctIdx: number;
};

const STORAGE_KEY = "uxedu.ped.earlybird.v1";

const SEED_CONCEPTS: Concept[] = [
  {
    id: "c1",
    title: "Learning Goals",
    teaser: "What skills or knowledge you should be able to demonstrate by the end.",
    noted: false,
  },
  {
    id: "c2",
    title: "Key Terms",
    teaser: "Essential vocabulary you will see across videos, readings, and quizzes.",
    noted: false,
  },
  {
    id: "c3",
    title: "Success Criteria",
    teaser: "How your work will be judged (rubrics, examples of good responses).",
    noted: false,
  },
];

const PREVIEW_QUIZ: Quiz = {
  prompt:
    "Which approach best keeps attention on core ideas at the start of an online lesson?",
  choices: [
    "Listing every resource first, then goals at the end",
    "Starting with goals, key terms, and how success will be judged",
    "Hiding goals to avoid biasing learners",
    "Only posting the final project instructions",
  ],
  correctIdx: 1,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      concepts: Concept[];
      acknowledged: boolean;
      quizChoice: number | null;
      pinned: boolean;
    };
  } catch {
    return null;
  }
}
function save(payload: {
  concepts: Concept[];
  acknowledged: boolean;
  quizChoice: number | null;
  pinned: boolean;
}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export default function ExampleEarlyBird() {
  const [concepts, setConcepts] = useState<Concept[]>(SEED_CONCEPTS);
  const [acknowledged, setAcknowledged] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [pinned, setPinned] = useState(true);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const data = load();
    if (data) {
      setConcepts(data.concepts);
      setAcknowledged(data.acknowledged);
      setQuizChoice(data.quizChoice);
      setPinned(data.pinned);
    }
  }, []);
  useEffect(() => {
    save({ concepts, acknowledged, quizChoice, pinned });
  }, [concepts, acknowledged, quizChoice, pinned]);

  const quizCorrect = useMemo(
    () => quizChoice === PREVIEW_QUIZ.correctIdx,
    [quizChoice]
  );
  const progress = useMemo(() => {
    // 25% for acknowledging, 25% for quiz correct, 50% for noting all concepts
    const notedFrac =
      concepts.filter((c) => c.noted).length / Math.max(1, concepts.length);
    const pct = Math.round(
      notedFrac * 50 + (acknowledged ? 25 : 0) + (quizCorrect ? 25 : 0)
    );
    return Math.min(100, Math.max(0, pct));
  }, [concepts, acknowledged, quizCorrect]);

  function toggleNoted(id: string) {
    setConcepts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, noted: !c.noted } : c))
    );
    setAnnounce("Updated noted concepts.");
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="eb-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h1 id="eb-title" className="text-lg font-semibold tracking-tight">
              Early Bird — Lesson Primer
            </h1>
            <p className="text-xs text-gray-600">
              Start with the essentials so your attention stays on what matters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPinned((v) => !v);
              setAnnounce(pinned ? "Unpinned from top." : "Pinned to top.");
            }}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-pressed={pinned}
            aria-label="Pin this primer to the top of the module"
            title="Pin to top"
          >
            {pinned ? "Unpin" : "Pin"}
          </button>
        </header>

        {/* Completeness meter */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
          <div
            className="h-2 w-full rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Early Bird completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-2 rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-700">
            {progress}% complete • Mark concepts, answer preview, and acknowledge focus.
          </p>
        </div>

        {/* Key concepts */}
        <section className="mt-2" aria-labelledby="eb-concepts-title">
          <h2 id="eb-concepts-title" className="sr-only">
            Key concepts
          </h2>
          <ul className="grid grid-cols-1 gap-2">
            {concepts.map((c) => (
              <li key={c.id} className="rounded-md border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{c.title}</p>
                    <p className="mt-0.5 text-sm text-gray-800">{c.teaser}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNoted(c.id)}
                    className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
                      c.noted
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-pressed={c.noted}
                  >
                    {c.noted ? "Noted" : "Mark noted"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Preview question */}
        <section className="mt-2 rounded-md border border-gray-100 p-3" aria-labelledby="eb-quiz-title">
          <h2 id="eb-quiz-title" className="text-sm font-medium text-gray-900">
            Preview question
          </h2>
          <p className="mt-0.5 text-sm text-gray-800">{PREVIEW_QUIZ.prompt}</p>
          <fieldset className="mt-2">
            <legend className="sr-only">Choose one answer</legend>
            <ul className="space-y-1">
              {PREVIEW_QUIZ.choices.map((ch, idx) => {
                const chosen = quizChoice === idx;
                const isCorrect = idx === PREVIEW_QUIZ.correctIdx;
                const showFeedback = quizChoice !== null && chosen;
                const style =
                  showFeedback && isCorrect
                    ? "border-green-600 bg-green-50"
                    : showFeedback && !isCorrect
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300 bg-white";
                return (
                  <li key={idx}>
                    <label
                      className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${style}`}
                    >
                      <input
                        type="radio"
                        name="eb-quiz"
                        className="mt-1 h-4 w-4"
                        checked={chosen}
                        onChange={() => setQuizChoice(idx)}
                        aria-checked={chosen}
                      />
                      <span className="text-gray-900">{ch}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
          {quizChoice !== null && (
            <p
              className={`mt-2 text-xs ${
                quizCorrect ? "text-green-700" : "text-red-700"
              }`}
              role="status"
            >
              {quizCorrect
                ? "Correct — starting with goals, terms, and criteria focuses attention from the outset."
                : "Not quite — check how goals, key terms, and criteria help guide attention early."}
            </p>
          )}
        </section>

        {/* Acknowledge focus */}
        <div className="mt-2 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              aria-label="Acknowledge focus for this lesson"
            />
            I’ll focus on these essentials during the lesson.
          </label>
          <a
            href="#/guides/advance-organizers"
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Why this helps
          </a>
        </div>
      </div>

      {/* Screen reader live updates */}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
