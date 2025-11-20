// src/components/pattern-examples/ExampleAdaptableView.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * ExampleAdaptableView
 * --------------------------------------------------------------------
 * Education use case: let learners/instructors tailor how content is displayed.
 * Controls:
 * - Theme: System / Light / Dark / High Contrast
 * - Font size: 90%–130%
 * - Line height: Normal / Relaxed / Loose
 * - Reading mode: Narrow column (reader) on/off
 * - Layout density: Comfortable / Compact
 * - Dyslexia-friendly toggles: increased letter spacing + gentle emphasis
 *
 * Notes:
 * - Pure Tailwind; no external fonts required. If your app loads a dyslexia font,
 *   you can conditionally add it via a class on the preview container.
 * - Preferences persist to localStorage (per browser).
 */

type Theme = "system" | "light" | "dark" | "high-contrast";
type Line = "normal" | "relaxed" | "loose";
type Density = "comfortable" | "compact";

type Prefs = {
  theme: Theme;
  fontPct: number;      // 90..130
  line: Line;
  reader: boolean;      // narrow column
  density: Density;
  dyslexiaAids: boolean;
};

const LS_KEY = "uxedu.adaptableView.prefs";

export default function ExampleAdaptableView() {
  const [prefs, setPrefs] = useState<Prefs>(() => {
    if (typeof window === "undefined") {
      return { theme: "system", fontPct: 100, line: "relaxed", reader: true, density: "comfortable", dyslexiaAids: false };
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw
        ? (JSON.parse(raw) as Prefs)
        : { theme: "system", fontPct: 100, line: "relaxed", reader: true, density: "comfortable", dyslexiaAids: false };
    } catch {
      return { theme: "system", fontPct: 100, line: "relaxed", reader: true, density: "comfortable", dyslexiaAids: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  // Apply theme to a sandboxed preview container (not global <html>)
  const themeClasses = useMemo(() => {
    if (prefs.theme === "light") return "bg-white text-gray-900";
    if (prefs.theme === "dark") return "bg-gray-900 text-gray-100";
    if (prefs.theme === "high-contrast") return "bg-black text-white";
    // system: approximate by prefers-color-scheme
    return "bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100";
  }, [prefs.theme]);

  const lineClass = prefs.line === "relaxed" ? "leading-relaxed" : prefs.line === "loose" ? "leading-loose" : "leading-normal";
  const readerClass = prefs.reader ? "max-w-prose" : "max-w-none";
  const densityPad = prefs.density === "compact" ? "p-3" : "p-5";
  const listGap = prefs.density === "compact" ? "space-y-1.5" : "space-y-2.5";
  const dyslexiaClasses = prefs.dyslexiaAids
    ? "tracking-wide [word-spacing:.12em] font-medium underline-offset-4"
    : "tracking-normal [word-spacing:normal]";

  // Inline style for scalable font size (percent)
  const fontStyle: React.CSSProperties = { fontSize: `${prefs.fontPct}%` };

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Adaptable View</h3>
        <p className="text-sm text-muted-foreground">
          Adjust presentation for comfort and accessibility. Preferences persist in this browser.
        </p>
      </header>

      {/* Controls */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Theme">
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={prefs.theme}
            onChange={(e) => setPrefs({ ...prefs, theme: e.target.value as Theme })}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="high-contrast">High contrast</option>
          </select>
        </Field>

        <Field label={`Font size (${prefs.fontPct}%)`}>
          <input
            type="range"
            min={90}
            max={130}
            step={5}
            value={prefs.fontPct}
            onChange={(e) => setPrefs({ ...prefs, fontPct: Number(e.target.value) })}
            className="w-full"
          />
        </Field>

        <Field label="Line height">
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={prefs.line}
            onChange={(e) => setPrefs({ ...prefs, line: e.target.value as Line })}
          >
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
            <option value="loose">Loose</option>
          </select>
        </Field>

        <Field label="Reading mode (narrow column)">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={prefs.reader}
              onChange={(e) => setPrefs({ ...prefs, reader: e.target.checked })}
            />
            Enable
          </label>
        </Field>

        <Field label="Layout density">
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={prefs.density}
            onChange={(e) => setPrefs({ ...prefs, density: e.target.value as Density })}
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </Field>

        <Field label="Dyslexia-friendly aids">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={prefs.dyslexiaAids}
              onChange={(e) => setPrefs({ ...prefs, dyslexiaAids: e.target.checked })}
            />
            Increase letter/word spacing & emphasize headings/links
          </label>
        </Field>
      </section>

      {/* Preview sandbox */}
      <section
        aria-live="polite"
        className={[
          "mt-5 rounded-xl border",
          themeClasses,
          densityPad,
          readerClass,
          lineClass,
          dyslexiaClasses,
          "transition-colors",
        ].join(" ")}
        style={fontStyle}
      >
        <h4 className="text-xl font-semibold underline">Week 2 — Derivatives: Concept & Rules</h4>
        <p className="mt-2">
          In this module you’ll <em>define</em> the derivative as an instantaneous rate of change,
          connect it to limits, and practice common rules (power, product, quotient, chain).
        </p>

        <div className={["mt-4 grid gap-3", prefs.density === "compact" ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"].join(" ")}>
          <Card title="Required reading">
            <ul className={listGap + " list-disc pl-5"}>
              <li>Textbook §3.1–3.3</li>
              <li>Article: “Rates of Change in Motion”</li>
            </ul>
          </Card>
          <Card title="Activities">
            <ul className={listGap + " list-disc pl-5"}>
              <li>Video: “Derivative as Limit” (12 min)</li>
              <li>Practice set: 10 items (auto-graded)</li>
            </ul>
          </Card>
        </div>

        <blockquote className="mt-4 border-l-4 pl-3 italic opacity-90">
          Tip: try sketching the function to predict the sign of the derivative before computing it.
        </blockquote>

        <code className="mt-4 block rounded bg-black/10 px-3 py-2 text-sm">
          f'(x) = lim<span className="mx-1">h→0</span> ( f(x+h) − f(x) ) / h
        </code>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-white/10">Open module</button>
          <a href="#" className="rounded-md border px-3 py-2 text-sm underline underline-offset-4 hover:bg-white/10">Download notes</a>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() =>
            setPrefs({ theme: "system", fontPct: 100, line: "relaxed", reader: true, density: "comfortable", dyslexiaAids: false })
          }
        >
          Reset defaults
        </button>
        <p className="text-xs text-muted-foreground">
          Saved locally. Consider syncing preferences to user profile in your app.
        </p>
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200/60 bg-white/40 p-3 shadow-sm dark:bg-white/5 dark:border-white/10">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
