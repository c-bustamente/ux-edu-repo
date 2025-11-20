// src/components/pattern-examples/ExampleCoachmarks.tsx
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * ExampleCoachmarks — robust step transitions
 * - Portal to body, SVG spotlight mask (stable on large screens)
 * - RAF rect syncing + Resize/Scroll observers
 * - Auto-flip placement
 * - NEW: `goToStep` waits for target, scrolls into view, disables Next while resolving
 */

type Step = {
  id: string; // matches [data-coach-id="<id>"]
  title: string;
  body: string;
  placement?: "right" | "left" | "top" | "bottom";
};

const STEPS: Step[] = [
  { id: "nav-courses",  title: "Your courses",                body: "Jump into any course from here. This menu stays consistent across the platform.", placement: "right" },
  { id: "kpi-progress",  title: "Overall progress",            body: "Track your learning progress at a glance. Click to see course-level details.",    placement: "bottom" },
  { id: "cta-continue",  title: "Continue where you left off", body: "Resume the last activity instantly. Great for short study sessions.",             placement: "left" },
];

const STORE_KEY = "demo-coachmarks-dismissed";

export default function ExampleCoachmarks() {
  const [open, setOpen] = useState<boolean>(() => !safeLocalGet(STORE_KEY));
  const [index, setIndex] = useState(0);
  const [advancing, setAdvancing] = useState(false); // 👈 avoid "stuck" feeling while resolving next target
  const step = STEPS[index];

  const targetRef = useRef<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Track current step target rect
  useLayoutEffect(() => {
    if (!open) return;
    const el = document.querySelector<HTMLElement>(`[data-coach-id="${step.id}"]`);
    targetRef.current = el || null;

    const update = () => {
      setRect(el ? el.getBoundingClientRect() : null);
    };

    let raf = 0;
    const tick = () => { update(); raf = requestAnimationFrame(tick); };
    tick();

    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    ro.observe(document.body);
    if (el) ro.observe(el);

    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [open, step]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
      if (e.key === "Enter" || e.key === " ") void goToStep(index + 1);
      if (e.key === "ArrowRight") void goToStep(index + 1);
      if (e.key === "ArrowLeft") void goToStep(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index]);

  function dismiss() {
    setOpen(false);
    safeLocalSet(STORE_KEY, "1");
  }
  function restart() {
    safeLocalRemove(STORE_KEY);
    setIndex(0);
    setOpen(true);
  }

  // 🚀 Robust navigation that waits for the next target
  async function goToStep(nextIdx: number) {
    if (advancing) return;
    if (nextIdx < 0 || nextIdx >= STEPS.length) {
      if (nextIdx >= STEPS.length) dismiss();
      return;
    }
    setAdvancing(true);
    setIndex(nextIdx);

    // Wait for next step element to appear & be measurable
    const nextId = STEPS[nextIdx].id;
    const el = await waitForTarget(`[data-coach-id="${nextId}"]`, 1500);
    if (el) {
      // If mostly off-screen, bring it into view first
      if (!isMostlyInViewport(el.getBoundingClientRect())) {
        el.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
        await nextAnimationFrame(); // allow layout settle
        await nextAnimationFrame();
      }
    }
    setAdvancing(false);
  }

  // Compute tooltip placement with auto-flip & clamping
  const floating = useMemo(() => {
    if (!rect) return null;
    const gap = 12;
    const cardW = 300;
    const cardH = 160;

    let placement: NonNullable<Step["placement"]> = step.placement ?? "right";

    const fitsRight  = rect.right + gap + cardW <= window.innerWidth - 12;
    const fitsLeft   = rect.left  - gap - cardW >= 12;
    const fitsTop    = rect.top   - gap - cardH >= 12;
    const fitsBottom = rect.bottom + gap + cardH <= window.innerHeight - 12;

    if (placement === "right"  && !fitsRight)  placement = fitsLeft ? "left" : (fitsBottom ? "bottom" : "top");
    if (placement === "left"   && !fitsLeft)   placement = fitsRight ? "right" : (fitsBottom ? "bottom" : "top");
    if (placement === "top"    && !fitsTop)    placement = fitsBottom ? "bottom" : (fitsRight ? "right" : "left");
    if (placement === "bottom" && !fitsBottom) placement = fitsTop ? "top" : (fitsRight ? "right" : "left");

    let top = rect.top;
    let left = rect.left;

    if (placement === "right") {
      top  = clamp(rect.top + rect.height / 2 - cardH / 2, 12, window.innerHeight - cardH - 12);
      left = clamp(rect.right + gap, 12, window.innerWidth - cardW - 12);
    } else if (placement === "left") {
      top  = clamp(rect.top + rect.height / 2 - cardH / 2, 12, window.innerHeight - cardH - 12);
      left = clamp(rect.left - cardW - gap, 12, window.innerWidth - cardW - 12);
    } else if (placement === "top") {
      top  = clamp(rect.top - cardH - gap, 12, window.innerHeight - cardH - 12);
      left = clamp(rect.left + rect.width / 2 - cardW / 2, 12, window.innerWidth - cardW - 12);
    } else {
      top  = clamp(rect.bottom + gap, 12, window.innerHeight - cardH - 12);
      left = clamp(rect.left + rect.width / 2 - cardW / 2, 12, window.innerWidth - cardW - 12);
    }

    return { top, left, w: cardW, h: cardH, placement };
  }, [rect, step]);

  return (
    <div className="w-full max-w-5xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Coachmarks</h3>
        </div>
        <button onClick={restart} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Restart tour
        </button>
      </header>

      {/* Demo content — replace with your UI; keep data-coach-id attributes */}
      <DemoSurface />

      {/* Overlay + tooltip rendered to body */}
      {open && rect && floating && createPortal(
        <>
          {/* Spotlight mask */}
          <svg className="fixed inset-0 z-[1000] pointer-events-none" aria-hidden>
            <defs>
              <mask id="coachmark-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={rect.left - 8}
                  y={rect.top - 8}
                  width={rect.width + 16}
                  height={rect.height + 16}
                  rx="12"
                  ry="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.45)" mask="url(#coachmark-mask)" />
          </svg>

          {/* Focus ring */}
          <div
            className="fixed z-[1001] rounded-xl ring-4 ring-emerald-400/80"
            style={{
              top: rect.top - 6,
              left: rect.left - 6,
              width: rect.width + 12,
              height: rect.height + 12,
              pointerEvents: "none",
            }}
          />

          {/* Tooltip */}
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Coachmark"
            className="fixed z-[1002] max-w-xs rounded-xl border bg-white p-4 shadow-lg"
            style={{ top: floating.top, left: floating.left, width: floating.w }}
          >
            <div className="text-xs font-semibold text-gray-600">
              Step {index + 1} of {STEPS.length}
            </div>
            <h4 className="mt-1 text-sm font-semibold">{step.title}</h4>
            <p className="mt-1 text-sm text-gray-700">{step.body}</p>

            <div className="mt-3 flex items-center justify-between">
              <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" onClick={dismiss}>
                Skip
              </button>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                  disabled={index === 0 || advancing}
                  onClick={() => void goToStep(index - 1)}
                >
                  Prev
                </button>
                <button
                  className={[
                    "rounded-md px-2 py-1 text-xs text-white disabled:opacity-50",
                    advancing ? "bg-gray-400" : "bg-gray-900",
                  ].join(" ")}
                  onClick={() => void goToStep(index + 1)}
                  disabled={advancing}
                >
                  {index + 1 < STEPS.length ? (advancing ? "Locating…" : "Next") : "Finish"}
                </button>
              </div>
            </div>
          </section>
        </>,
        document.body
      )}
    </div>
  );
}

/* ---------------- Demo surface (replace with your UI) ---------------- */
function DemoSurface() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left nav */}
      <aside className="col-span-3 rounded-lg border p-3">
        <div className="mb-2 text-xs font-semibold text-gray-600">Navigation</div>
        <nav className="space-y-1">
          <a className="block rounded px-2 py-1 text-sm hover:bg-gray-50" href="#">Dashboard</a>
          <a className="block rounded px-2 py-1 text-sm hover:bg-gray-50" href="#" data-coach-id="nav-courses">
            Courses
          </a>
          <a className="block rounded px-2 py-1 text-sm hover:bg-gray-50" href="#">Grades</a>
          <a className="block rounded px-2 py-1 text-sm hover:bg-gray-50" href="#">Messages</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="col-span-9 space-y-4">
        <section className="rounded-lg border p-4">
          <div className="mb-2 text-xs font-semibold text-gray-600">Overview</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3" data-coach-id="kpi-progress">
              <div className="text-xs text-gray-600">Overall Progress</div>
              <div className="mt-1 h-2 w-full rounded bg-gray-200">
                <div className="h-2 rounded bg-gray-900" style={{ width: "62%" }} />
              </div>
              <div className="mt-1 text-xs text-gray-600">62%</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-600">Average Grade</div>
              <div className="mt-1 text-2xl font-semibold">81%</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-600">Upcoming (7d)</div>
              <div className="mt-1 text-2xl font-semibold">3</div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <div className="text-sm font-semibold">Python for Data Science</div>
            <div className="text-xs text-gray-600">Last activity: Pandas lab</div>
          </div>
          <button data-coach-id="cta-continue" className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white">
            Continue
          </button>
        </section>
      </main>
    </div>
  );
}

/* ---------------- tiny utils ---------------- */
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function safeLocalGet(k: string) {
  try { return localStorage.getItem(k); } catch { return null; }
}
function safeLocalSet(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch {}
}
function safeLocalRemove(k: string) {
  try { localStorage.removeItem(k); } catch {}
}

function nextAnimationFrame() {
  return new Promise<void>((res) => requestAnimationFrame(() => res()));
}

function isMostlyInViewport(r: DOMRect) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const visibleW = Math.min(r.right, vw) - Math.max(r.left, 0);
  const visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  return visibleW >= r.width * 0.6 && visibleH >= r.height * 0.6;
}

async function waitForTarget(selector: string, timeoutMs = 1500): Promise<HTMLElement | null> {
  const t0 = performance.now();
  return new Promise<HTMLElement | null>((resolve) => {
    const tryFind = () => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) return resolve(el);
      if (performance.now() - t0 > timeoutMs) return resolve(null);
      requestAnimationFrame(tryFind);
    };
    tryFind();
  });
}
