// src/components/pattern-examples/ExampleGoodDefaults.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * ExampleGoodDefaults
 * Education use case: creating a new course with smart defaults.
 */

type Visibility = "Private" | "Students with link" | "Public";
type Grading = "Points (100)" | "Weighted categories" | "Complete/Incomplete";
type LatePolicy = "Do not accept late work" | "Accept with penalty" | "Accept without penalty";

type State = {
  title: string;
  language: string;
  timeZone: string;
  startDate: string; // ISO yyyy-mm-dd
  durationWeeks: number;
  grading: Grading;
  latePolicy: LatePolicy;
  visibility: Visibility;
  readiness: number; // 0–100 (demo only)
};

export default function ExampleGoodDefaults() {
  const defaults = useMemo<State>(() => {
    const lang =
      typeof navigator !== "undefined" && typeof navigator.language === "string"
        ? navigator.language
        : "en-US";

    const tz = (() => {
      try {
        const z = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return typeof z === "string" && z ? z : "UTC";
      } catch {
        return "UTC";
      }
    })();

    return {
      title: "Introduction to Calculus",
      language: lang,
      timeZone: tz,
      startDate: nextMondayISO(),
      durationWeeks: 8,
      grading: "Points (100)",
      latePolicy: "Accept with penalty",
      visibility: "Private",
      readiness: 60,
    };
  }, []);

  const [s, setS] = useState<State>(defaults);
  const [nudged, setNudged] = useState(false);

  const canBePublic = s.readiness >= 80;

  function reset() {
    setS(defaults);
  }
  function set<K extends keyof State>(k: K, v: State[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
  }

  useEffect(() => {
    if (!nudged && s.readiness >= 80 && s.visibility === "Private") {
      setNudged(true);
    }
  }, [s.readiness, s.visibility, nudged]);

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Good Defaults — New Course</h3>
        <p className="text-sm text-muted-foreground">
          We pre-filled sensible values to speed things up. You can adjust anything.
        </p>
      </header>

      {/* Basics */}
      <Section title="Basics">
        <Field label="Course title" htmlFor="title">
          <input
            id="title"
            className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
            value={s.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g., Introduction to Calculus"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Language" htmlFor="lang">
            <select
              id="lang"
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={s.language}
              onChange={(e) => set("language", e.target.value)}
            >
              {languageOptions(s.language).map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Help>Defaulted from your browser setting.</Help>
          </Field>

          <Field label="Time zone" htmlFor="tz">
            <input
              id="tz"
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={s.timeZone}
              onChange={(e) => set("timeZone", e.target.value)}
              list="tz-list"
            />
            <datalist id="tz-list">
              {COMMON_TZS.map((z: string) => (
                <option key={z} value={z} />
              ))}
            </datalist>
            <Help>Defaulted from your device.</Help>
          </Field>
        </div>
      </Section>

      {/* Schedule */}
      <Section title="Schedule">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Start date" htmlFor="start">
            <input
              id="start"
              type="date"
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={s.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
            <Help>Defaulted to next Monday.</Help>
          </Field>

          <Field label="Duration (weeks)" htmlFor="weeks">
            <input
              id="weeks"
              type="number"
              min={1}
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={s.durationWeeks}
              onChange={(e) => set("durationWeeks", clampInt(e.target.value, 1, 52))}
            />
            <Help>Default set to an 8-week module cadence.</Help>
          </Field>
        </div>
      </Section>

      {/* Assessment */}
      <Section title="Assessment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Grading scheme" htmlFor="grading">
            <select
              id="grading"
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={s.grading}
              onChange={(e) => set("grading", e.target.value as State["grading"])}
            >
              <option>Points (100)</option>
              <option>Weighted categories</option>
              <option>Complete/Incomplete</option>
            </select>
            <Help>Defaults to 100-point scale for simplicity.</Help>
          </Field>

          <Field label="Late policy" htmlFor="late">
            <select
              id="late"
              className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
              value={s.latePolicy}
              onChange={(e) => set("latePolicy", e.target.value as State["latePolicy"])}
            >
              <option>Do not accept late work</option>
              <option>Accept with penalty</option>
              <option>Accept without penalty</option>
            </select>
            <Help>Defaults to “Accept with penalty” to balance flexibility and accountability.</Help>
          </Field>
        </div>
      </Section>

      {/* Visibility */}
      <Section title="Visibility">
        <Field label="Course visibility" htmlFor="vis">
          <select
            id="vis"
            className="w-full rounded-lg border px-3 py-2 outline-none transition border-gray-300 focus:ring-2 focus:ring-gray-200"
            value={s.visibility}
            onChange={(e) => set("visibility", e.target.value as State["visibility"])}
          >
            <option>Private</option>
            <option disabled={!canBePublic}>Students with link</option>
            <option disabled={!canBePublic}>Public</option>
          </select>
          <Help>
            {canBePublic
              ? "You can safely make it public now (readiness ≥ 80%)."
              : "Kept Private by default until setup readiness reaches 80%."}
          </Help>
        </Field>

        {/* Readiness slider to demo the gating logic */}
        <Field label="Setup readiness (demo)" htmlFor="ready">
          <input
            id="ready"
            type="range"
            min={0}
            max={100}
            step={5}
            value={s.readiness}
            onChange={(e) => set("readiness", Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600 mt-1">Current readiness: {s.readiness}%</p>
          {nudged && s.visibility === "Private" && s.readiness >= 80 && (
            <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
              Suggestion: switch visibility to <b>Students with link</b> or <b>Public</b> now.
            </div>
          )}
        </Field>
      </Section>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Reset to defaults
        </button>

        <button
          type="button"
          onClick={() => alert("Course created")}
          className="rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Create course
        </button>
      </div>
    </div>
  );
}

/* ---------- helpers & small UI ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h4 className="text-base font-semibold mb-2">{title}</h4>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Help({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-gray-500">{children}</p>;
}

function clampInt(v: string, min: number, max: number) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function nextMondayISO(): string {
  const d = new Date();
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const offset = (8 - (day || 7)) % 7 || 7; // days until next Monday
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/** Return a typed list of language tags — keeps current first and ensures it's present. */
function languageOptions(current: string): string[] {
  const COMMON = [
    "en-US",
    "en-GB",
    "es-CL",
    "es-ES",
    "es-MX",
    "pt-BR",
    "fr-FR",
    "de-DE",
    "it-IT",
  ] as const;

  const base: string[] = Array.from(COMMON);
  if (current && !base.includes(current)) base.unshift(current);
  // Deduplicate while keeping order (current first)
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of base) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

const COMMON_TZS: string[] = [
  "America/Santiago",
  "America/Bogota",
  "America/Mexico_City",
  "America/New_York",
  "Europe/Madrid",
  "Europe/London",
  "UTC",
];
