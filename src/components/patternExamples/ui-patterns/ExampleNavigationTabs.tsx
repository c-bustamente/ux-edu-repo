// src/components/pattern-examples/ExampleNavigationTabs.tsx
"use client";

import { useMemo, useRef, useState } from "react";

/**
 * ExampleNavigationTabs — Education-focused
 * Syllabus · Modules · Discussions · Grades · Analytics · Settings
 * - A11y: role="tablist/tab/tabpanel", aria-selected/controls, keyboard arrows
 * - Scrollable tablist (overflow-x)
 */

type TabKey = "syllabus" | "modules" | "discussions" | "grades" | "analytics" | "settings";

type TabDef = {
  key: TabKey;
  label: string;
  badge?: string;
};

const TABS: TabDef[] = [
  { key: "syllabus", label: "Syllabus" },
  { key: "modules", label: "Modules" },
  { key: "discussions", label: "Discussions", badge: "3" },
  { key: "grades", label: "Grades" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
];

export default function ExampleNavigationTabs() {
  const [active, setActive] = useState<TabKey>("modules");

  // TIPADO: Partial<Record<...>> para no inicializar todas las claves
  const tabRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({});

  // Helper que NO retorna nada (void)
  const setTabRef = (key: TabKey) => (el: HTMLButtonElement | null): void => {
    tabRefs.current[key] = el;
  };

  const activeIndex = useMemo(() => TABS.findIndex((t) => t.key === active), [active]);

  function focusTab(idx: number) {
    const bounded = Math.max(0, Math.min(TABS.length - 1, idx));
    const t = TABS[bounded];
    const el = tabRefs.current[t.key];
    el?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(activeIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(TABS.length - 1);
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Navigation Tabs</h3>
        <p className="text-sm text-muted-foreground">
          Switch between primary course sections; the active tab shows the current context.
        </p>
      </header>

      {/* Tablist */}
      <div role="tablist" aria-label="Course sections" className="relative border-b" onKeyDown={onKeyDown}>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                ref={setTabRef(t.key)} // ✅ no retorna valor
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={isActive}
                aria-controls={`panel-${t.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(t.key)}
                className={[
                  "relative px-3 py-2 text-sm whitespace-nowrap",
                  "border-b-2 -mb-[2px]",
                  isActive ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-600 hover:text-gray-800",
                ].join(" ")}
              >
                <span className="inline-flex items-center gap-2">
                  {t.label}
                  {t.badge && <span className="text-[10px] rounded-full bg-gray-900 text-white px-1.5 py-0.5">{t.badge}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panels */}
      <div className="mt-4">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <section
              key={t.key}
              role="tabpanel"
              id={`panel-${t.key}`}
              aria-labelledby={`tab-${t.key}`}
              hidden={!isActive}
              className="outline-none"
            >
              {isActive && <Panel tab={t.key} />}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Panels ---------- */

function Panel({ tab }: { tab: TabKey }) {
  if (tab === "syllabus") {
    return (
      <div className="space-y-2">
        <h4 className="text-base font-semibold">Syllabus</h4>
        <p className="text-sm text-muted-foreground">Publish your syllabus so students can plan ahead.</p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Upload PDF</button>
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Link to doc</button>
        </div>
      </div>
    );
  }
  if (tab === "modules") {
    return (
      <div className="space-y-2">
        <h4 className="text-base font-semibold">Modules</h4>
        <p className="text-sm text-muted-foreground">Organize content by weeks or topics.</p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">New module</button>
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Add activity</button>
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li>Week 1 — Limits (videos, reading, practice set)</li>
          <li>Week 2 — Derivatives (lecture + quiz)</li>
          <li>Week 3 — Applications (project brief)</li>
        </ul>
      </div>
    );
  }
  if (tab === "discussions") {
    return (
      <div className="space-y-2">
        <h4 className="text-base font-semibold">Discussions</h4>
        <p className="text-sm text-muted-foreground">Engage students with prompts and replies.</p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">New thread</button>
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Moderate</button>
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li>Limit Laws — common pitfalls</li>
          <li>Real-world rates of change</li>
        </ul>
      </div>
    );
  }
  if (tab === "grades") {
    return (
      <div className="space-y-2">
        <h4 className="text-base font-semibold">Grades</h4>
        <p className="text-sm text-muted-foreground">Track scores and provide timely feedback.</p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Export CSV</button>
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Post grades</button>
        </div>
        <p className="text-xs text-gray-500">Tip: Use rubrics for consistency and faster grading.</p>
      </div>
    );
  }
  if (tab === "analytics") {
    return (
      <div className="space-y-2">
        <h4 className="text-base font-semibold">Analytics</h4>
        <p className="text-sm text-muted-foreground">Monitor engagement and identify at-risk students.</p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">View trends</button>
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Download report</button>
        </div>
        <p className="text-xs text-gray-500">Attendance and quiz performance correlate strongly with outcomes.</p>
      </div>
    );
  }
  // settings
  return (
    <div className="space-y-2">
      <h4 className="text-base font-semibold">Settings</h4>
      <p className="text-sm text-muted-foreground">Configure course details and permissions.</p>
      <div className="flex gap-2">
        <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Edit details</button>
        <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Manage roles</button>
      </div>
    </div>
  );
}
