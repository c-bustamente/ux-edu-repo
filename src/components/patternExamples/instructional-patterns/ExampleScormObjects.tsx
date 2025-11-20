"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** ---------- Types ---------- **/
type ScormVersion = "1.2" | "2004";

interface ScormPackageMeta {
  id: string;
  title: string;
  version: ScormVersion;
  estDurationMin: number;
}

interface RuntimeStore {
  [element: string]: string;
}

interface AttemptSnapshot {
  pkgId: string;
  version: ScormVersion;
  store: RuntimeStore;
  savedAtISO: string;
}

type LogEntry = { t: string; msg: string };

/** ---------- Demo packages (education-focused) ---------- **/
const PACKS: ScormPackageMeta[] = [
  { id: "ux-heuristics-intro", title: "SCO: Usability Heuristics (Interactive)", version: "2004", estDurationMin: 12 },
  { id: "a11y-contrast-check", title: "SCO: Accessibility — Contrast Exercise", version: "1.2", estDurationMin: 8 },
];

const STORAGE_PREFIX = "uxedu.scorm.pkg.";

/** ---------- Utilities ---------- **/
function nowTime(): string {
  return new Date().toLocaleTimeString();
}

function toHHMMSS(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSec / 3600).toString().padStart(2, "0");
  const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function persistAttempt(id: string, data: AttemptSnapshot) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(data));
  } catch {/* ignore */}
}

function loadAttempt(id: string): AttemptSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    return raw ? (JSON.parse(raw) as AttemptSnapshot) : null;
  } catch {
    return null;
  }
}

/** ---------- Minimal SCORM runtime (mock) ---------- **/
class MockScormRuntime {
  version: ScormVersion;
  store: RuntimeStore;
  initialized = false;
  startMs = 0;

  constructor(version: ScormVersion, seed?: RuntimeStore) {
    this.version = version;
    this.store = seed ? { ...seed } : {};
  }

  Initialize(): boolean {
    if (this.initialized) return true;
    this.initialized = true;
    this.startMs = Date.now();
    // ensure required fields exist
    if (this.version === "1.2") {
      this.store["cmi.core.lesson_status"] ??= "not attempted";
      this.store["cmi.core.score.raw"] ??= "0";
      this.store["cmi.core.total_time"] ??= "00:00:00";
    } else {
      this.store["cmi.completion_status"] ??= "unknown";
      this.store["cmi.success_status"] ??= "unknown";
      this.store["cmi.score.scaled"] ??= "0";
      this.store["cmi.total_time"] ??= "PT0H0M0S"; // ISO-ish
    }
    return true;
  }

  GetValue(el: string): string {
    return this.store[el] ?? "";
  }

  SetValue(el: string, val: string): boolean {
    if (!this.initialized) return false;
    this.store[el] = val;
    return true;
  }

  private addSessionTime() {
    const session = Date.now() - this.startMs;
    if (this.version === "1.2") {
      const prev = this.store["cmi.core.total_time"] || "00:00:00";
      const [ph, pm, ps] = prev.split(":").map(Number);
      const prevMs = ((ph || 0) * 3600 + (pm || 0) * 60 + (ps || 0)) * 1000;
      this.store["cmi.core.total_time"] = toHHMMSS(prevMs + session);
    } else {
      // naive sum for demo
      const label = this.store["cmi.total_time"] || "PT0H0M0S";
      const m = /PT(\d+)H(\d+)M(\d+)S/.exec(label) || [];
      const prevSec = ((Number(m[1]) || 0) * 3600) + ((Number(m[2]) || 0) * 60) + (Number(m[3]) || 0);
      const total = prevSec * 1000 + session;
      const h = Math.floor(total / 3600000);
      const rem = total % 3600000;
      const min = Math.floor(rem / 60000);
      const sec = Math.floor((rem % 60000) / 1000);
      this.store["cmi.total_time"] = `PT${h}H${min}M${sec}S`;
    }
  }

  Commit(): boolean {
    if (!this.initialized) return false;
    // Commit is no-op here; persistence happens outside via caller using .store
    return true;
  }

  Terminate(): boolean {
    if (!this.initialized) return false;
    this.addSessionTime();
    this.initialized = false;
    return true;
  }
}

/** ---------- Component ---------- **/
export default function ExampleScormObjects() {
  const [pkgId, setPkgId] = useState<string>(PACKS[0].id);
  const selected = useMemo(() => PACKS.find((p) => p.id === pkgId)!, [pkgId]);
  const [runtime, setRuntime] = useState<MockScormRuntime>(() => {
    const prev = loadAttempt(PACKS[0].id);
    return new MockScormRuntime(PACKS[0].version, prev?.store);
  });
  const [connected, setConnected] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // when package changes, load its last snapshot
    const snap = loadAttempt(selected.id);
    const rt = new MockScormRuntime(selected.version, snap?.store);
    setRuntime(rt);
    setConnected(false);
    setScore(getCurrentScore(rt));
    pushLog(`Loaded package “${selected.title}” (${selected.version}).`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  useEffect(() => {
    // keep log scrolled
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  function pushLog(msg: string) {
    setLog((prev) => [...prev, { t: nowTime(), msg }]);
  }

  function connect() {
    const ok = runtime.Initialize();
    setConnected(ok);
    pushLog(ok ? "LMSInitialize() → true" : "LMSInitialize() → false");
    // ensure score slider reflects store
    setScore(getCurrentScore(runtime));
  }

  function startAttempt() {
    if (!connected) return;
    if (selected.version === "1.2") {
      runtime.SetValue("cmi.core.lesson_status", "incomplete");
      pushLog('SetValue("cmi.core.lesson_status","incomplete")');
    } else {
      runtime.SetValue("cmi.completion_status", "incomplete");
      runtime.SetValue("cmi.success_status", "unknown");
      pushLog('SetValue("cmi.completion_status","incomplete")');
    }
  }

  function getCurrentScore(rt: MockScormRuntime): number {
    if (rt.version === "1.2") {
      const raw = Number(rt.GetValue("cmi.core.score.raw") || 0);
      return isNaN(raw) ? 0 : Math.max(0, Math.min(100, raw));
    } else {
      const scaled = Number(rt.GetValue("cmi.score.scaled") || 0);
      return Math.round(Math.max(0, Math.min(1, scaled)) * 100);
    }
  }

  function setScoreOnRuntime(val: number) {
    if (!connected) return;
    const pass = val >= 80;
    if (selected.version === "1.2") {
      runtime.SetValue("cmi.core.score.raw", String(val));
      runtime.SetValue("cmi.core.lesson_status", pass ? "passed" : "failed");
      pushLog(`SetValue("cmi.core.score.raw","${val}")`);
      pushLog(`SetValue("cmi.core.lesson_status","${pass ? "passed" : "failed"}")`);
    } else {
      const scaled = (val / 100).toFixed(2);
      runtime.SetValue("cmi.score.scaled", scaled);
      runtime.SetValue("cmi.success_status", pass ? "passed" : "failed");
      pushLog(`SetValue("cmi.score.scaled","${scaled}")`);
      pushLog(`SetValue("cmi.success_status","${pass ? "passed" : "failed"}")`);
    }
  }

  function markComplete() {
    if (!connected) return;
    if (selected.version === "1.2") {
      runtime.SetValue("cmi.core.lesson_status", "completed");
      pushLog('SetValue("cmi.core.lesson_status","completed")');
    } else {
      runtime.SetValue("cmi.completion_status", "completed");
      pushLog('SetValue("cmi.completion_status","completed")');
    }
  }

  function commit() {
    if (!connected) return;
    const ok = runtime.Commit();
    const snap: AttemptSnapshot = {
      pkgId: selected.id,
      version: selected.version,
      store: { ...runtime.store },
      savedAtISO: new Date().toISOString(),
    };
    persistAttempt(selected.id, snap);
    pushLog(`Commit() → ${ok ? "true" : "false"} • saved snapshot`);
  }

  function terminate() {
    const ok = runtime.Terminate();
    setConnected(false);
    const snap: AttemptSnapshot = {
      pkgId: selected.id,
      version: selected.version,
      store: { ...runtime.store },
      savedAtISO: new Date().toISOString(),
    };
    persistAttempt(selected.id, snap);
    pushLog(`Terminate() → ${ok ? "true" : "false"} • total_time updated`);
  }

  /** Derived UI values **/
  const statusSummary = useMemo(() => {
    if (selected.version === "1.2") {
      const status = runtime.GetValue("cmi.core.lesson_status") || "not attempted";
      const raw = runtime.GetValue("cmi.core.score.raw") || "0";
      const t = runtime.GetValue("cmi.core.total_time") || "00:00:00";
      return { status, scoreLabel: `${raw}%`, timeLabel: t };
    } else {
      const comp = runtime.GetValue("cmi.completion_status") || "unknown";
      const succ = runtime.GetValue("cmi.success_status") || "unknown";
      const scaled = Number(runtime.GetValue("cmi.score.scaled") || 0);
      const t = runtime.GetValue("cmi.total_time") || "PT0H0M0S";
      return { status: `${comp} / ${succ}`, scoreLabel: `${Math.round(scaled * 100)}%`, timeLabel: t };
    }
  }, [runtime, selected.version, connected, pkgId, score, log]);

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="scorm-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="scorm-title" className="text-lg font-semibold tracking-tight">
            SCORM Objects (traceable player)
          </h1>
          <p className="text-xs text-gray-600">
            Initialize, set progress/score, commit, and terminate — with a saved attempt snapshot.
          </p>
        </header>

        {/* Package selector */}
        <div className="flex gap-2 items-end">
          <label className="flex-1 text-xs">
            <span className="block text-gray-700 mb-1">SCORM package</span>
            <select
              value={pkgId}
              onChange={(e) => setPkgId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select SCORM package"
            >
              {PACKS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} • {p.version} • ~{p.estDurationMin} min
                </option>
              ))}
            </select>
          </label>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${
              connected ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
            aria-live="polite"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`} aria-hidden="true" />
            {connected ? "Connected" : "Not connected"}
          </span>
        </div>

        {/* Player placeholder */}
        <div className="mt-2 rounded-md border border-dashed border-gray-300 p-3 bg-gray-50">
          <p className="text-xs text-gray-700">
            SCO preview area (placeholder). In production, render the SCO (e.g., iframe) and map its JS calls to the SCORM API.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-2 grid grid-cols-1 gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={connect}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Initialize
            </button>
            <button
              type="button"
              onClick={startAttempt}
              disabled={!connected}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Start attempt
            </button>
            <button
              type="button"
              onClick={markComplete}
              disabled={!connected}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Mark complete
            </button>
            <button
              type="button"
              onClick={commit}
              disabled={!connected}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Commit
            </button>
            <button
              type="button"
              onClick={terminate}
              disabled={!connected}
              className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Terminate
            </button>
          </div>

          {/* Score control */}
          <label className="block">
            <span className="block text-xs text-gray-700 mb-1">
              Report score ({score}%)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={score}
              onChange={(e) => {
                const v = Number(e.target.value);
                setScore(v);
                setScoreOnRuntime(v);
              }}
              disabled={!connected}
              className="w-full"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
            />
          </label>
        </div>

        {/* Status summary */}
        <div className="mt-2 rounded-md border border-gray-200 bg-white p-2">
          <h2 className="text-xs font-medium text-gray-700">Runtime status</h2>
          <dl className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <dt className="text-gray-500">Version</dt>
              <dd className="font-medium text-gray-900">{selected.version}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{selected.version === "1.2" ? "Lesson status" : "Completion/Success"}</dt>
              <dd className="font-medium text-gray-900">{statusSummary.status}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Score</dt>
              <dd className="font-medium text-gray-900">{statusSummary.scoreLabel}</dd>
            </div>
            <div className="col-span-3">
              <dt className="text-gray-500">Total time</dt>
              <dd className="font-medium text-gray-900">{statusSummary.timeLabel}</dd>
            </div>
          </dl>
        </div>

        {/* Event log */}
        <section className="mt-2">
          <h2 className="text-xs font-medium text-gray-700 mb-1">Trace log</h2>
          <ul
            ref={logRef}
            className="max-h-40 overflow-auto rounded-md border border-gray-100 bg-gray-50 p-2 text-[11px] text-gray-800 space-y-1"
            aria-live="polite"
          >
            {log.map((l, i) => (
              <li key={i}>
                <span className="text-gray-500">{l.t}</span> — {l.msg}
              </li>
            ))}
            {log.length === 0 && <li className="text-gray-500">No events yet.</li>}
          </ul>
        </section>

        {/* Help */}
        <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            How this demo maps to SCORM
          </summary>
          <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
            <li><code className="font-mono">Initialize()</code>, <code className="font-mono">Commit()</code>, <code className="font-mono">Terminate()</code> mimic LMS calls.</li>
            <li>Score & status set <code className="font-mono">cmi.core.*</code> (1.2) or <code className="font-mono">cmi.*</code> (2004).</li>
            <li>Snapshots persist per package in <span className="font-mono">localStorage</span> to simulate traceability.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
