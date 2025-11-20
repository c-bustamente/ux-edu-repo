// src/components/pattern-examples/ExampleGuidedTour.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ExampleGuidedTour — Task-driven "Tour Dock"
 * -------------------------------------------------------------
 * What makes it different from coachmarks:
 * - Bottom "Tour Dock" with checklist, progress, and just-in-time tips.
 * - No fullscreen overlay; instead, subtle pulsing hotspots on targets.
 * - Steps advance only when the user completes real actions.
 * - Skippable and restartable; persists completion.
 *
 * How to adapt:
 * - Keep the `data-tour-id="..."` attributes on your real UI elements.
 * - Define steps with `waitFor` predicates that observe real state changes.
 * - Use `highlight="pulse"` to draw attention without blocking interaction.
 */

const STORE_KEY = "demo-guided-tour-complete-v2";

type StepId = "open-filters" | "change-theme" | "start-quiz";
type Placement = "left" | "right" | "top" | "bottom" | "none";

type Step = {
  id: StepId;
  title: string;
  tip: string;             // Dock tip
  target: string;          // CSS selector to highlight (data-tour-id="...")
  placement?: Placement;   // Dock mini-pointer toward target (optional)
  highlight?: "pulse" | "ring" | "none";
  waitFor: () => boolean;  // when true, step is considered complete
};

export default function ExampleGuidedTour() {
  // --- demo state (replace these with your real app state) ---
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [quizStarted, setQuizStarted] = useState(false);

  // Persisted completion
  const [done, setDone] = useState<boolean>(() => !!safeLocalGet(STORE_KEY));

  // Steps definition — each "waitFor" hooks into demo state
  const steps: Step[] = useMemo(
    () => [
      {
        id: "open-filters",
        title: "Open course filters",
        tip: "Click Filters to reveal options (e.g., topic, difficulty, due soon).",
        target: '[data-tour-id="btn-filters"]',
        placement: "top",
        highlight: "pulse",
        waitFor: () => filtersOpen === true,
      },
      {
        id: "change-theme",
        title: "Switch theme",
        tip: "Toggle Light/Dark to see comfortable reading options.",
        target: '[data-tour-id="toggle-theme"]',
        placement: "top",
        highlight: "pulse",
        waitFor: () => theme === "dark",
      },
      {
        id: "start-quiz",
        title: "Start a quick quiz",
        tip: "Kick off a 3-question self-check. You can exit any time.",
        target: '[data-tour-id="btn-start-quiz"]',
        placement: "top",
        highlight: "pulse",
        waitFor: () => quizStarted === true,
      },
    ],
    [filtersOpen, theme, quizStarted]
  );

  // Current step index (first incomplete)
  const currentIndex = useMemo(() => {
    if (done) return steps.length; // tour completed
    const idx = steps.findIndex((s) => !s.waitFor());
    return idx === -1 ? steps.length : idx;
  }, [steps, done]);

  const current = steps[currentIndex];

  // Auto-complete detection: when last step passes, mark tour done
  useEffect(() => {
    if (!done && currentIndex >= steps.length) {
      setDone(true);
      safeLocalSet(STORE_KEY, "1");
    }
  }, [currentIndex, steps.length, done]);

  // Smooth-scroll highlighted target into view when step changes
  useEffect(() => {
    if (!current) return;
    const el = document.querySelector<HTMLElement>(current.target);
    if (el && !isMostlyInViewport(el.getBoundingClientRect())) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [currentIndex]); // run on step change

  function skipTour() {
    setDone(true);
    safeLocalSet(STORE_KEY, "1");
  }

  function restartTour() {
    setDone(false);
    safeLocalRemove(STORE_KEY);
    // reset demo state to allow re-doing steps
    setFiltersOpen(false);
    setTheme("light");
    setQuizStarted(false);
  }

  const progressPct = Math.min(100, Math.round(((currentIndex) / steps.length) * 100));

  return (
    <div className="w-full max-w-5xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Guided Tour</h3>
          <p className="text-sm text-muted-foreground">
            Do these quick actions to learn the basics. You can skip or restart anytime.
          </p>
        </div>
        <button
          onClick={restartTour}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Restart
        </button>
      </header>

      {/* Demo surface — replace with your UI, keep data-tour-id attributes */}
      <DemoSurface
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        theme={theme}
        setTheme={setTheme}
        quizStarted={quizStarted}
        setQuizStarted={setQuizStarted}
      />

      {/* Pulsing hotspot on current target */}
      {!done && current && <Hotspot selector={current.target} mode={current.highlight ?? "pulse"} />}

      {/* Dock (fixed to bottom of card) */}
      <div className="relative mt-4">
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-sm font-semibold">Tour</div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>{progressPct}%</span>
              <div className="h-1.5 w-24 rounded bg-gray-200">
                <div className="h-1.5 rounded bg-gray-900" style={{ width: `${progressPct}%` }} />
              </div>
              {!done ? (
                <button
                  onClick={skipTour}
                  className="rounded-md border px-2 py-1 text-[11px] hover:bg-gray-50"
                >
                  Skip
                </button>
              ) : (
                <span className="text-emerald-600 font-medium">Completed</span>
              )}
            </div>
          </div>

          {/* Checklist */}
          <ol className="divide-y">
            {steps.map((s, i) => {
              const completed = s.waitFor();
              const isCurrent = i === currentIndex && !done;
              return (
                <li key={s.id} className="flex items-start gap-3 px-4 py-3">
                  <StatusDot done={completed} current={isCurrent} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">{s.title}</div>
                      {isCurrent && !completed && (
                        <Pointer toward={s.placement ?? "none"} />
                      )}
                    </div>
                    {/* Tip shown only for current, incomplete step */}
                    {isCurrent && !completed && (
                      <p className="mt-1 text-sm text-gray-600">{s.tip}</p>
                    )}
                    {/* Tiny hint for what to click */}
                    {isCurrent && !completed && (
                      <MiniHint selector={s.target} />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {completed ? "Done" : isCurrent ? "Do this" : "Pending"}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Demo UI (replace with real app UI) ---------------- */

function DemoSurface(props: {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  quizStarted: boolean;
  setQuizStarted: (v: boolean) => void;
}) {
  const { filtersOpen, setFiltersOpen, theme, setTheme, quizStarted, setQuizStarted } = props;

  return (
    <div className={["rounded-lg border p-4 transition-colors", theme === "dark" ? "bg-gray-900 text-white" : "bg-white"].join(" ")}>
      {/* toolbar */}
      <div className="mb-3 flex items-center gap-3">
        <button
          data-tour-id="btn-filters"
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>

        <label className="inline-flex items-center gap-2 text-sm">
          <span>Theme</span>
          <button
            data-tour-id="toggle-theme"
            className={[
              "rounded-full border px-3 py-1 text-xs",
              theme === "dark" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-gray-50",
            ].join(" ")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </label>

        <div className="ml-auto">
          <button
            data-tour-id="btn-start-quiz"
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
            onClick={() => setQuizStarted(true)}
          >
            {quizStarted ? "Quiz Running…" : "Start Quiz"}
          </button>
        </div>
      </div>

      {/* filters panel */}
      {filtersOpen && (
        <div className="mb-3 rounded-lg border p-3 bg-white text-gray-900">
          <div className="text-xs font-semibold text-gray-600 mb-2">Filters</div>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm">
              Topic
              <select className="mt-1 w-full rounded-md border px-2 py-1 text-sm">
                <option>Derivatives</option>
                <option>Integrals</option>
                <option>Limits</option>
              </select>
            </label>
            <label className="text-sm">
              Difficulty
              <select className="mt-1 w-full rounded-md border px-2 py-1 text-sm">
                <option>All</option>
                <option>Intro</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label className="text-sm">
              Due soon
              <select className="mt-1 w-full rounded-md border px-2 py-1 text-sm">
                <option>Any</option>
                <option>Next 3 days</option>
                <option>Next 7 days</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* content cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border p-3 bg-white text-gray-900">
          <div className="text-xs text-gray-600">Overview</div>
          <div className="mt-1 text-2xl font-semibold">Calculus 101</div>
          <p className="mt-1 text-sm text-gray-600">Next: Chain rule practice set</p>
        </div>
        <div className="rounded-lg border p-3 bg-white text-gray-900">
          <div className="text-xs text-gray-600">Average Grade</div>
          <div className="mt-1 text-2xl font-semibold">81%</div>
        </div>
        <div className="rounded-lg border p-3 bg-white text-gray-900">
          <div className="text-xs text-gray-600">Upcoming (7d)</div>
          <div className="mt-1 text-2xl font-semibold">3</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Tour Dock helpers ---------------- */

function StatusDot({ done, current }: { done: boolean; current: boolean }) {
  const tone = done ? "bg-emerald-600" : current ? "bg-indigo-600" : "bg-gray-300";
  return (
    <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${tone}`} aria-hidden />
  );
}

function Pointer({ toward }: { toward: Placement }) {
  if (toward === "none") return null;
  const map: Record<Placement, string> = {
    top: "before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-b-8 before:border-b-gray-300 before:content-['']",
    bottom: "before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:border-x-8 before:border-x-transparent before:border-t-8 before:border-t-gray-300 before:content-['']",
    left: "before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-gray-300 before:content-['']",
    right: "before:absolute before:top-1/2 before:-right-2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-l-8 before:border-l-gray-300 before:content-['']",
    none: "",
  };
  return <span className={`relative inline-block ${map[toward]}`} aria-hidden />;
}

function MiniHint({ selector }: { selector: string }) {
  const el = typeof window !== "undefined" ? document.querySelector<HTMLElement>(selector) : null;
  const label = el?.getAttribute("aria-label") || el?.textContent?.trim() || "this control";
  return <div className="mt-1 text-xs text-gray-500">Hint: click {label.toLowerCase()}.</div>;
}

/* ---------------- Hotspot (non-blocking highlight) ---------------- */

function Hotspot({ selector, mode }: { selector: string; mode: "pulse" | "ring" | "none" }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    const tick = () => { update(); rafRef.current = requestAnimationFrame(tick); };
    tick();

    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    ro.observe(document.body);
    ro.observe(el);

    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [selector]);

  if (!rect || mode === "none") return null;

  // Non-blocking fixed layers over target
  return (
    <>
      {/* Static ring */}
      <div
        className="pointer-events-none fixed z-[900] rounded-lg ring-4 ring-indigo-400/70"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      />
      {/* Pulsing aura */}
      <div
        className="pointer-events-none fixed z-[899] rounded-[14px] border-2 border-indigo-400/0"
        style={{
          top: rect.top - 14,
          left: rect.left - 14,
          width: rect.width + 28,
          height: rect.height + 28,
          boxShadow:
            mode === "pulse"
              ? "0 0 0 0 rgba(99,102,241,0.35)"
              : "none",
          animation: mode === "pulse" ? "tour-pulse 1.6s ease-out infinite" : "none",
        }}
      />
      <style jsx global>{`
        @keyframes tour-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
          70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
      `}</style>
    </>
  );
}

/* ---------------- Utilities ---------------- */

function safeLocalGet(k: string) {
  try { return localStorage.getItem(k); } catch { return null; }
}
function safeLocalSet(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch {}
}
function safeLocalRemove(k: string) {
  try { localStorage.removeItem(k); } catch {}
}
function isMostlyInViewport(r: DOMRect) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const visibleW = Math.min(r.right, vw) - Math.max(r.left, 0);
  const visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  return visibleW >= r.width * 0.6 && visibleH >= r.height * 0.6;
}
