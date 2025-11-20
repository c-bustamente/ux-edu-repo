"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** TYPES **/
type UserRole = "student" | "moderator";
type FilterKey = "all" | "unanswered" | "mine";

interface Reply {
  id: string;
  author: string;
  body: string;
  tsISO: string;
  up: number;
  accepted?: boolean;
}

interface Topic {
  id: string;
  title: string;
  body: string;
  tags: string[];
  locked?: boolean;
  pinned?: boolean;
  replies: Reply[];
}

const STORAGE_KEY = "uxedu.forum.v1";
const VOTES_KEY = "uxedu.forum.votes.v1";
const ME = "You";

/** SEED DATA **/
const SEED: Topic[] = [
  {
    id: "t1",
    title: "Week 1: Heuristic Evaluation tips?",
    body:
      "What’s a practical way to write concise issue statements for our dashboard critique?",
    tags: ["heuristics", "assignment-1"],
    pinned: true,
    replies: [
      {
        id: "r1",
        author: "Instructor",
        body:
          "Use a ‘Because’ pattern: “Issue + Where + Why (heuristic) + Suggested fix.” Keep it < 3 sentences.",
        tsISO: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        up: 6,
        accepted: true,
      },
      {
        id: "r2",
        author: ME,
        body:
          "I tried that with the navigation bar: cited ‘Consistency’ and proposed aligning labels across pages.",
        tsISO: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        up: 2,
      },
    ],
  },
  {
    id: "t2",
    title: "Trouble uploading PDF larger than 10MB",
    body:
      "My wireframe export is 18MB. Any advice to compress without losing too much quality?",
    tags: ["technical-help", "files"],
    replies: [
      {
        id: "r3",
        author: "Marta",
        body:
          "In your editor, export as grayscale and reduce DPI to ~150. That usually keeps text readable.",
        tsISO: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        up: 3,
      },
    ],
    locked: false,
  },
];

/** UTILS **/
function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function loadState(): { topics: Topic; list: Topic[]; votes: Set<string> } {
  // returns current selected topic too (first item by default)
  let list: Topic[] = SEED;
  let votes = new Set<string>();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) list = JSON.parse(raw) as Topic[];
    const vraw = localStorage.getItem(VOTES_KEY);
    if (vraw) votes = new Set<string>(JSON.parse(vraw) as string[]);
  } catch {
    // ignore
  }
  return { topics: list[0], list, votes };
}

function saveList(list: Topic[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function saveVotes(v: Set<string>) {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(Array.from(v)));
  } catch {
    // ignore
  }
}

/** COMPONENT **/
export default function ExampleForum() {
  const [topics, setTopics] = useState<Topic[]>(SEED);
  const [selectedId, setSelectedId] = useState<string>(SEED[0].id);
  const [role, setRole] = useState<UserRole>("student");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState<string>("");

  const [announce, setAnnounce] = useState<string>("");
  const [votes, setVotes] = useState<Set<string>>(new Set());
  const replyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const { list, votes: v } = loadState();
    setTopics(list);
    setVotes(v);
  }, []);

  useEffect(() => {
    saveList(topics);
  }, [topics]);

  useEffect(() => {
    saveVotes(votes);
  }, [votes]);

  const selected = useMemo(
    () => topics.find((t) => t.id === selectedId) ?? topics[0],
    [topics, selectedId]
  );

  const filteredTopics = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().trim();
    const nq = norm(q);
    let list = topics;
    if (filter === "unanswered") {
      list = list.filter((t) => !t.replies.some((r) => r.accepted));
    } else if (filter === "mine") {
      list = list.filter((t) => t.replies.some((r) => r.author === ME));
    }
    if (nq) {
      list = list.filter(
        (t) =>
          norm(t.title).includes(nq) ||
          norm(t.body).includes(nq) ||
          t.tags.some((tag) => norm(tag).includes(nq))
      );
    }
    // pinned first, then recent activity (latest reply)
    const lastTs = (t: Topic) =>
      t.replies.length ? t.replies[t.replies.length - 1].tsISO : new Date(0).toISOString();
    return [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(lastTs(b)).getTime() - new Date(lastTs(a)).getTime();
    });
  }, [topics, filter, q]);

  const topicCounts = (t: Topic) => {
    const replies = t.replies.length;
    const up = t.replies.reduce((acc, r) => acc + r.up, 0);
    const accepted = t.replies.some((r) => r.accepted);
    return { replies, up, accepted };
  };

  const toggleVote = (replyId: string) => {
    setVotes((prev) => {
      const next = new Set(prev);
      if (next.has(replyId)) next.delete(replyId);
      else next.add(replyId);
      return next;
    });
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        replies: t.replies.map((r) =>
          r.id === replyId ? { ...r, up: r.up + (votes.has(replyId) ? -1 : 1) } : r
        ),
      }))
    );
  };

  const addReply = (text: string) => {
    const body = text.trim();
    if (!body || !selected) return;
    const newReply: Reply = {
      id: `r-${Date.now()}`,
      author: ME,
      body,
      tsISO: new Date().toISOString(),
      up: 0,
    };
    setTopics((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, replies: [...t.replies, newReply] } : t))
    );
    setAnnounce("Reply posted.");
  };

  const markAccepted = (replyId: string) => {
    if (role !== "moderator" || !selected) return;
    setTopics((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? {
              ...t,
              replies: t.replies.map((r) => ({ ...r, accepted: r.id === replyId })),
            }
          : t
      )
    );
    setAnnounce("Answer marked as accepted.");
  };

  const toggleLock = () => {
    if (role !== "moderator" || !selected) return;
    setTopics((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, locked: !t.locked } : t))
    );
    setAnnounce(selected.locked ? "Thread unlocked." : "Thread locked.");
  };

  const togglePin = () => {
    if (role !== "moderator" || !selected) return;
    setTopics((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, pinned: !t.pinned } : t))
    );
    setAnnounce(selected.pinned ? "Unpinned from top." : "Pinned to top.");
  };

  /** RENDER **/
  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="forum-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="forum-title" className="text-lg font-semibold tracking-tight">
            Course Forum
          </h1>
          <p className="text-xs text-gray-600">
            Moderated threads to foster social and academic interaction.
          </p>
        </header>

        {/* CONTROLS */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <label className="text-xs">
              <span className="sr-only">Filter</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterKey)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter topics"
              >
                <option value="all">All</option>
                <option value="unanswered">Unanswered</option>
                <option value="mine">My posts</option>
              </select>
            </label>
            <label className="text-xs">
              <span className="sr-only">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Current role for moderation"
              >
                <option value="student">Student</option>
                <option value="moderator">Moderator</option>
              </select>
            </label>
          </div>

          <label className="flex-1 text-xs">
            <span className="sr-only">Search topics</span>
            <input
              type="search"
              placeholder="Search by title, body, or tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        {/* TOPIC LIST (compact, scrollable) */}
        <div className="mt-2 grid grid-cols-1 gap-2">
          <section
            aria-label="Topic list"
            className="rounded-md border border-gray-100 max-h-56 overflow-auto"
          >
            {filteredTopics.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-700">No topics match your query.</p>
                <p className="text-xs text-gray-500">Try another keyword or filter.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredTopics.map((t) => {
                  const { replies, up, accepted } = topicCounts(t);
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => setSelectedId(t.id)}
                        className={`w-full text-left p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          selected?.id === t.id ? "bg-indigo-50" : "hover:bg-gray-50"
                        }`}
                        aria-current={selected?.id === t.id ? "true" : "false"}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              {t.pinned && <PinIcon className="text-amber-600" />}
                              {t.locked && <LockIcon className="text-gray-500" />}
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {t.title}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{t.body}</p>
                            <p className="mt-1 text-[11px] text-gray-600">
                              {t.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="mr-1 rounded border border-gray-200 bg-white px-1.5 py-0.5"
                                >
                                  {tag}
                                </span>
                              ))}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs text-gray-700">{replies} repl{replies === 1 ? "y" : "ies"}</p>
                            <p className="text-[11px] text-gray-600">{up} upvotes</p>
                            {accepted && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700 border border-green-200">
                                <CheckIcon />
                                answered
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* THREAD VIEW (selected topic) */}
          {selected && (
            <section
              aria-labelledby={`topic-${selected.id}-title`}
              className="rounded-md border border-gray-100"
            >
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2
                      id={`topic-${selected.id}-title`}
                      className="text-sm font-medium text-gray-900"
                    >
                      {selected.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-700">{selected.body}</p>
                    <p className="mt-1 text-[11px] text-gray-600">
                      {selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="mr-1 rounded border border-gray-200 bg-white px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>
                  {role === "moderator" && (
                    <div className="shrink-0 flex gap-2">
                      <button
                        type="button"
                        onClick={togglePin}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {selected.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        type="button"
                        onClick={toggleLock}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {selected.locked ? "Unlock" : "Lock"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies list */}
              <div className="max-h-64 overflow-auto">
                <ul className="divide-y divide-gray-100">
                  {selected.replies.map((r) => {
                    const voted = votes.has(r.id);
                    return (
                      <li key={r.id} className="p-3">
                        <article>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium text-gray-800">{r.author}</span>{" "}
                                • {timeSince(r.tsISO)}
                              </p>
                              <p className="mt-1 text-sm text-gray-800">{r.body}</p>
                              {r.accepted && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700 border border-green-200">
                                  <CheckIcon />
                                  accepted answer
                                </span>
                              )}
                            </div>

                            <div className="shrink-0 text-right">
                              <button
                                type="button"
                                onClick={() => toggleVote(r.id)}
                                aria-pressed={voted}
                                className={`inline-flex items-center justify-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  voted
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-300 text-gray-800 hover:bg-gray-50"
                                }`}
                              >
                                <ThumbIcon filled={voted} />
                                {r.up}
                              </button>
                              {role === "moderator" && !r.accepted && !selected.locked && (
                                <div className="mt-1">
                                  <button
                                    type="button"
                                    onClick={() => markAccepted(r.id)}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    Mark as answer
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Add reply */}
              <div className="p-3 border-t border-gray-100">
                {selected.locked ? (
                  <p className="text-xs text-gray-600">This thread is locked by a moderator.</p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = replyRef.current?.value ?? "";
                      addReply(val);
                      if (replyRef.current) replyRef.current.value = "";
                    }}
                    className="space-y-2"
                  >
                    <label className="block text-xs">
                      <span className="block text-gray-700 mb-1">Add a reply</span>
                      <textarea
                        ref={replyRef}
                        rows={2}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Share an idea, cite a heuristic, or attach a short tip…"
                        required
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Post reply
                      </button>
                      <a
                        href="#/guides/forum-community-rules"
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Community rules
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Announce updates for AT */}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}

/** INLINE ICONS **/
function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 ${className}`}>
      <path d="M6 2h8l-2 5v4l2 2v1H6v-1l2-2V7L6 2zM9 18h2v-3H9v3z" />
    </svg>
  );
}
function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 ${className}`}>
      <path d="M6 8V6a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v9H4V9a1 1 0 0 1 1-1h1Zm2-2a2 2 0 1 1 4 0v2H8V6Z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
      <path d="M8 13.2 4.8 10l-1.4 1.4L8 16l8.6-8.6L15.2 6z" />
    </svg>
  );
}
function ThumbIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
      {filled ? (
        <path d="M2 11h4v7H2v-7Zm6 7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l1-3-1-1-4 5v11Z" />
      ) : (
        <path d="M2 10h4v8H2v-8Zm6 8h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l1-3-1-1-4 5v11Z" />
      )}
    </svg>
  );
}
