"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Toy Box — Compact Sandbox
 * Purpose: give learners simple, scaled-down “toys” from bigger CS ideas so they can explore.
 * Includes two tiny sandboxes:
 *  1) Logic Gates (inputs + gate block) → immediate output (motivates systems thinking)
 *  2) Finite Automaton (string ends with “ab”) → step/run with clear acceptance
 * Fits inside a pattern card; no external deps; keyboard friendly.
 */

type TabKey = "gates" | "dfa";
const STORAGE_KEY = "uxedu.ped.toybox.v1";

/* ------------------------------- Tabs ------------------------------- */
export default function ExampleToyBox() {
  const [tab, setTab] = useState<TabKey>("gates");
  const tablistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTab((JSON.parse(raw) as { tab: TabKey }).tab);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tab }));
    } catch {}
  }, [tab]);

  const handleTabKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs?.length) return;
    const i = Array.from(tabs).indexOf(e.currentTarget);
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
  };

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="toybox-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="toybox-title" className="text-lg font-semibold tracking-tight">Toy Box — Explore by Playing</h1>
          <p className="text-xs text-gray-600">
            Tiny sandboxes with simple building blocks. Learn ideas by trying them.
          </p>
        </header>

        {/* Tabs */}
        <div ref={tablistRef} role="tablist" aria-label="Toy selection" className="flex gap-1.5 rounded-md border border-gray-200 bg-gray-50 p-1">
          {([
            { k: "gates", label: "Logic Gates" },
            { k: "dfa", label: "Finite Automaton" },
          ] as Array<{ k: TabKey; label: string }>).map((t) => {
            const selected = tab === t.k;
            return (
              <button
                key={t.k}
                role="tab"
                aria-selected={selected}
                onKeyDown={handleTabKey}
                onClick={() => setTab(t.k)}
                className={`px-3 py-1.5 rounded text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Panels */}
        {tab === "gates" ? <GatesToy /> : <DfaToy />}
      </div>
    </div>
  );
}

/* -------------------------- Toy 1: Logic Gates -------------------------- */
type GateKind = "AND" | "OR" | "XOR";

function GatesToy() {
  const [a, setA] = useState<boolean>(false);
  const [b, setB] = useState<boolean>(true);
  const [gate, setGate] = useState<GateKind>("XOR");

  const out = useMemo(() => {
    if (gate === "AND") return a && b;
    if (gate === "OR") return a || b;
    return (a ? 1 : 0) ^ (b ? 1 : 0) ? true : false; // XOR
  }, [a, b, gate]);

  return (
    <section className="mt-2" aria-labelledby="gates-title">
      <h2 id="gates-title" className="sr-only">Logic Gates sandbox</h2>

      {/* Building blocks legend = “class library” */}
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2">
        <p className="text-[11px] text-emerald-900">
          Blocks: <Pill tone="emerald">Input A</Pill> <Pill tone="emerald">Input B</Pill>{" "}
          <Pill tone="emerald">Gate</Pill> <Pill tone="emerald">Probe</Pill>
        </p>
      </div>

      {/* Playground */}
      <div className="mt-2 grid grid-cols-1 gap-2">
        <div className="rounded-md border border-gray-200 p-2">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={a}
                onChange={(e) => setA(e.target.checked)}
                aria-label="Toggle input A"
              />
              A
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={b}
                onChange={(e) => setB(e.target.checked)}
                aria-label="Toggle input B"
              />
              B
            </label>

            <fieldset className="ml-auto">
              <legend className="sr-only">Gate</legend>
              <div className="flex items-center gap-2">
                {(["AND", "OR", "XOR"] as GateKind[]).map((g) => (
                  <label key={g} className="inline-flex items-center gap-1 text-xs">
                    <input
                      type="radio"
                      name="gate"
                      className="h-4 w-4"
                      checked={gate === g}
                      onChange={() => setGate(g)}
                      aria-checked={gate === g}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-2 flex items-center justify-between">
            {/* “Probe” output */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                out ? "bg-green-600 text-white border-green-600" : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${out ? "bg-white" : "bg-gray-500"}`} aria-hidden="true" />
              Output: {out ? "1 (true)" : "0 (false)"}
            </div>

            {/* Truth table (tiny) */}
            <table className="text-[11px] text-gray-800">
              <thead>
                <tr className="text-gray-500">
                  <th className="px-1 text-left">A</th>
                  <th className="px-1 text-left">B</th>
                  <th className="px-1 text-left">{gate}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { A: 0, B: 0 },
                  { A: 0, B: 1 },
                  { A: 1, B: 0 },
                  { A: 1, B: 1 },
                ].map((r, i) => {
                  const val =
                    gate === "AND"
                      ? r.A && r.B
                      : gate === "OR"
                      ? r.A || r.B
                      : (r.A ^ r.B) === 1;
                  const highlight = Number(a) === r.A && Number(b) === r.B;
                  return (
                    <tr key={i} className={highlight ? "bg-indigo-50" : ""}>
                      <td className="px-1">{r.A}</td>
                      <td className="px-1">{r.B}</td>
                      <td className="px-1">{val ? 1 : 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-[11px] text-gray-600">
            Try switching inputs and gates. This “toy” mirrors larger digital-logic systems without the wiring details.
          </p>
        </div>
      </div>
    </section>
  );
}

function Pill({ tone, children }: { tone: "emerald"; children: React.ReactNode }) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>{children}</span>;
}

/* ----------------------- Toy 2: Finite Automaton ----------------------- */
/**
 * DFA: Accepts strings over {a,b} that end with “ab”.
 * States: S (start), A (seen 'a'), AC (accept: last two were 'ab').
 * Transitions:
 *   from S:  on 'a' -> A,  on 'b' -> S
 *   from A:  on 'a' -> A,  on 'b' -> AC
 *   from AC: on 'a' -> A,  on 'b' -> S
 */
type State = "S" | "A" | "AC";

function step(state: State, ch: string): State {
  if (state === "S") return ch === "a" ? "A" : "S";
  if (state === "A") return ch === "a" ? "A" : "AC";
  // AC
  return ch === "a" ? "A" : "S";
}

function DfaToy() {
  const [input, setInput] = useState<string>("abab");
  const [idx, setIdx] = useState<number>(0);
  const [state, setState] = useState<State>("S");
  const [announce, setAnnounce] = useState("");

  const sanitized = input.replace(/[^ab]/g, "");
  const accepted = state === "AC" && idx === sanitized.length;

  useEffect(() => {
    // reset when input changes
    setIdx(0);
    setState("S");
  }, [sanitized]);

  const canStep = idx < sanitized.length;

  function doStep() {
    if (!canStep) return;
    const ch = sanitized[idx];
    const next = step(state, ch);
    setState(next);
    setIdx((i) => i + 1);
    setAnnounce(`Read '${ch}', moved to state ${next}.`);
  }

  function runAll() {
    let s: State = "S";
    for (let i = 0; i < sanitized.length; i++) s = step(s, sanitized[i]);
    setState(s);
    setIdx(sanitized.length);
    setAnnounce(`Finished. Final state: ${s}.`);
  }

  function reset() {
    setIdx(0);
    setState("S");
    setAnnounce("Reset automaton.");
  }

  return (
    <section className="mt-2" aria-labelledby="dfa-title">
      <h2 id="dfa-title" className="sr-only">Finite Automaton sandbox</h2>

      {/* Blocks legend = “class library” */}
      <div className="rounded-md border border-teal-200 bg-teal-50 p-2">
        <p className="text-[11px] text-teal-900">
          Blocks: <Pill tone="emerald">State</Pill> <Pill tone="emerald">Transition</Pill>{" "}
          <Pill tone="emerald">Input stream</Pill> <Pill tone="emerald">Probe</Pill>
        </p>
      </div>

      {/* Playground */}
      <div className="mt-2 rounded-md border border-gray-200 p-2">
        <label className="block text-xs">
          <span className="block text-gray-800 mb-1">Input over {'{a,b}'}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="DFA input string"
          />
        </label>

        {/* States row */}
        <div className="mt-2 flex items-center gap-3">
          <StateBubble label="S" state={state} kind="start" />
          <Arrow />
          <StateBubble label="A" state={state} />
          <Arrow />
          <StateBubble label="AC" state={state} kind="accept" />
        </div>

        {/* Controls */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={doStep}
            disabled={!canStep}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Step
          </button>
          <button
            type="button"
            onClick={runAll}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Run
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset
          </button>

          {/* Probe output */}
          <span
            className={`ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] ${
              accepted ? "bg-green-600 text-white border-green-600" : "bg-gray-100 text-gray-800 border-gray-300"
            }`}
            aria-live="polite"
          >
            {accepted ? "Accepted (ends with 'ab')" : canStep ? `Reading ${idx + 1}/${sanitized.length}` : "Not accepted"}
          </span>
        </div>

        {/* Stream view */}
        <div className="mt-2 rounded-md border border-gray-100 bg-gray-50 p-2">
          <p className="text-[11px] text-gray-700">
            Stream:{" "}
            {sanitized.split("").map((c, i) => (
              <span key={i} className={`px-1 py-0.5 rounded ${i < idx ? "bg-indigo-100" : ""}`}>
                {c}
              </span>
            ))}
          </p>
          <p className="mt-1 text-[11px] text-gray-600" aria-live="polite">
            {announce}
          </p>
        </div>

        <p className="mt-2 text-[11px] text-gray-600">
          This “toy” mirrors bigger automata ideas (formal languages) without heavy notation.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- Bits ------------------------------- */
function StateBubble({ label, state, kind }: { label: State | "A" | "S" | "AC"; state: State; kind?: "start" | "accept" }) {
  const active = state === label;
  const ring = active ? "ring-2 ring-indigo-500" : "";
  const extra = kind === "start" ? "border-dashed" : kind === "accept" ? "border-2" : "border";
  return (
    <div
      className={`h-9 min-w-9 px-3 flex items-center justify-center rounded-full bg-white text-sm text-gray-900 ${extra} border-gray-400 ${ring}`}
      aria-current={active ? "step" : undefined}
      aria-label={`State ${label}${kind ? ` (${kind})` : ""}${active ? " — current" : ""}`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gray-400">
      <path d="M7 3l7 7-7 7-1.4-1.4L10.2 10 5.6 4.4 7 3z" />
    </svg>
  );
}
