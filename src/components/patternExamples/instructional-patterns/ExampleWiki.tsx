"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Types **/
type Role = "viewer" | "editor" | "moderator";

interface Version {
  id: string;
  tsISO: string;
  author: string;
  summary: string;
  title: string;
  body: string;
}

interface PersistShape {
  versions: Version[];
}

const STORAGE_KEY = "uxedu.wiki.v1";

/** Seed page (education-focused) **/
const SEED_VERSION: Version = {
  id: "v-seed",
  tsISO: new Date().toISOString(),
  author: "Instructor",
  summary: "Initial page scaffold",
  title: "Design Critique Guidelines (Course Wiki)",
  body:
    "- Focus on user tasks tied to learning objectives.\n" +
    "- Reference Nielsen’s heuristics where relevant.\n" +
    "- Offer a concrete fix, not only a problem.\n" +
    "- Keep it constructive and evidence-based (screenshots welcome).",
};

/** Storage helpers **/
function load(): PersistShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { versions: [SEED_VERSION] };
    const parsed = JSON.parse(raw) as PersistShape;
    if (!Array.isArray(parsed.versions) || parsed.versions.length === 0) {
      return { versions: [SEED_VERSION] };
    }
    return parsed;
  } catch {
    return { versions: [SEED_VERSION] };
  }
}
function save(state: PersistShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** Util **/
function fmt(tsISO: string) {
  try {
    const d = new Date(tsISO);
    return d.toLocaleString();
  } catch {
    return tsISO;
  }
}

/** Component **/
export default function ExampleWiki() {
  const [role, setRole] = useState<Role>("viewer");
  const [versions, setVersions] = useState<Version[]>([SEED_VERSION]);
  const latest = versions[0];

  // Draft editor state mirrors latest by default
  const [titleDraft, setTitleDraft] = useState<string>(latest.title);
  const [bodyDraft, setBodyDraft] = useState<string>(latest.body);
  const [summary, setSummary] = useState<string>("");

  // Preview a past version
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = useMemo(
    () => versions.find((v) => v.id === previewId) || null,
    [versions, previewId]
  );

  const [announce, setAnnounce] = useState<string>("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const state = load();
    setVersions(state.versions);
    // initialize draft from latest
    const lt = state.versions[0];
    setTitleDraft(lt.title);
    setBodyDraft(lt.body);
  }, []);

  useEffect(() => {
    save({ versions });
  }, [versions]);

  const changed =
    titleDraft.trim() !== latest.title.trim() ||
    bodyDraft.trim() !== latest.body.trim();

  const canEdit = role !== "viewer";

  function createVersion(custom?: Partial<Version>) {
    const v: Version = {
      id: `v-${Date.now()}`,
      tsISO: new Date().toISOString(),
      author: role === "viewer" ? "Student" : role === "editor" ? "Editor" : "Moderator",
      summary: custom?.summary ?? "(no summary)",
      title: custom?.title ?? titleDraft,
      body: custom?.body ?? bodyDraft,
    };
    setVersions((prev) => [v, ...prev]);
    setAnnounce("New revision saved.");
  }

  function onSaveRevision(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) {
      setAnnounce("You need editor or moderator role to save.");
      return;
    }
    if (!changed) {
      setAnnounce("No changes detected.");
      return;
    }
    if (!summary.trim()) {
      setAnnounce("Please add a short summary for the revision.");
      return;
    }
    createVersion({ summary: summary.trim() });
    setSummary("");
  }

  function usePreviewAsDraft(v: Version) {
    setTitleDraft(v.title);
    setBodyDraft(v.body);
    setPreviewId(null);
    setTimeout(() => titleRef.current?.focus(), 0);
    setAnnounce("Loaded snapshot into draft (not saved yet).");
  }

  function restoreVersion(v: Version) {
    if (!canEdit) {
      setAnnounce("You need editor or moderator role to restore.");
      return;
    }
    createVersion({
      title: v.title,
      body: v.body,
      summary: `Restored ${v.id} (${fmt(v.tsISO)})`,
    });
    setTitleDraft(v.title);
    setBodyDraft(v.body);
    setPreviewId(null);
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="wiki-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="wiki-title" className="text-lg font-semibold tracking-tight">Course Wiki</h1>
          <p className="text-xs text-gray-600">Collaborative page with version history and roles.</p>
        </header>

        {/* Role + Quick status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-xs">
            <span className="sr-only">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select role"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
            </select>
          </label>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${canEdit ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${canEdit ? "bg-indigo-500" : "bg-gray-400"}`} aria-hidden="true" />
            {canEdit ? "Editing enabled" : "Read-only"}
          </span>
        </div>

        {/* Editor (compact) */}
        <form onSubmit={onSaveRevision} className="space-y-2" noValidate>
          <label className="block text-xs">
            <span className="block text-gray-700 mb-1">Page title</span>
            <input
              ref={titleRef}
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            />
          </label>

          <label className="block text-xs">
            <span className="block text-gray-700 mb-1">Page content (Markdown-friendly)</span>
            <textarea
              rows={6}
              value={bodyDraft}
              onChange={(e) => setBodyDraft(e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              placeholder="Short summary of your change…"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={!canEdit}
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
              aria-label="Revision summary"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={!canEdit || !changed || !summary.trim()}
              aria-disabled={!canEdit || !changed || !summary.trim()}
            >
              Save revision
            </button>
          </div>

          <p className="text-[11px] text-gray-600">
            Latest: <span className="font-medium">{latest.author}</span> • {fmt(latest.tsISO)} • “{latest.summary}”
          </p>
        </form>

        {/* Split: History + Preview */}
        <div className="mt-3 grid grid-cols-1 gap-2">
          {/* History */}
          <section aria-labelledby="wiki-history-title" className="rounded-md border border-gray-100">
            <h2 id="wiki-history-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
              Version history
            </h2>
            <ul className="max-h-48 overflow-auto divide-y divide-gray-100">
              {versions.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setPreviewId(v.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      previewId === v.id ? "bg-indigo-50" : ""
                    }`}
                    aria-current={previewId === v.id ? "true" : "false"}
                  >
                    <p className="text-sm text-gray-900 line-clamp-1">{v.title}</p>
                    <p className="text-[11px] text-gray-600">
                      {v.author} • {fmt(v.tsISO)} • “{v.summary}”
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Preview panel */}
          <section aria-labelledby="wiki-preview-title" className="rounded-md border border-gray-100">
            <h2 id="wiki-preview-title" className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
              Snapshot preview
            </h2>
            <div className="p-3">
              {preview ? (
                <>
                  <h3 className="text-sm font-medium text-gray-900">{preview.title}</h3>
                  <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{preview.body}</pre>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => usePreviewAsDraft(preview)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Use as draft
                    </button>
                    <button
                      type="button"
                      onClick={() => restoreVersion(preview)}
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                      disabled={!canEdit}
                    >
                      Restore this version
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-600">Select a version from the history to preview details.</p>
              )}
            </div>
          </section>
        </div>

        {/* Help */}
        <details className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="cursor-pointer text-xs outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            Tips for collaborative writing
          </summary>
          <ul className="mt-1 text-xs text-gray-700 list-disc pl-5">
            <li>Keep summaries short but specific (what changed & why).</li>
            <li>Use headings and bullet points for readability.</li>
            <li>Moderators can restore versions if errors slip in.</li>
          </ul>
        </details>
      </div>

      {/* Live region for announcements */}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
