// src/components/pattern-examples/ExampleNotifications.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ExampleNotifications — Education-focused
 * - Inbox panel + filters + bell badge
 * - Mark read/unread, snooze 1h, simulate incoming
 * - A11y: role="status" toast, aria-live
 */

type NType = "deadline" | "message" | "update";
type Notification = {
  id: string;
  type: NType;
  title: string;
  body: string;
  ts: number;      // epoch ms
  read: boolean;
  link?: string;
  dueAt?: number;
  snoozedUntil?: number | null;
};

const seed: Notification[] = [
  {
    id: "n1",
    type: "deadline",
    title: "Assignment 1 due tomorrow",
    body: "Calculus 101 · Limit Laws Problem Set closes in 24 hours.",
    ts: Date.now() - 1000 * 60 * 30,
    read: false,
    link: "#",
    dueAt: Date.now() + 1000 * 60 * 60 * 24,
  },
  {
    id: "n2",
    type: "message",
    title: "New reply in your forum thread",
    body: "Ana replied to: ‘Clarifying L’Hôpital’s rule exercise’.",
    ts: Date.now() - 1000 * 60 * 60 * 5,
    read: false,
    link: "#",
  },
  {
    id: "n3",
    type: "update",
    title: "Grades posted for Quiz 1",
    body: "Your score is available in Calculus 101 → Grades.",
    ts: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    link: "#",
  },
];

export default function ExampleNotifications() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [filter, setFilter] = useState<"all" | "unread" | NType>("all");
  const [toast, setToast] = useState<string | null>(null);

  // ⚠️ Tipado correcto para timers en browser (número)
  const toastTimer = useRef<number | undefined>(undefined);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read && !isSnoozed(n)).length,
    [items]
  );

  const filtered = useMemo(() => {
    const now = Date.now();
    return items
      .filter((n) => !n.snoozedUntil || n.snoozedUntil <= now)
      .filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.type === filter;
      })
      .sort((a, b) => b.ts - a.ts);
  }, [items, filter]);

  // --- Helpers (dentro del componente) ---
  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current !== undefined) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = undefined;
    }
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = undefined;
    }, 2200);
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  }

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  function snooze(id: string, ms: number) {
    const until = Date.now() + ms;
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozedUntil: until } : n))
    );
    showToast(`Snoozed for ${Math.round(ms / (1000 * 60))} minutes`);
  }

  function simulateIncoming() {
    const candidates: Notification[] = [
      {
        id: rand(),
        type: "deadline",
        title: "Project proposal due this week",
        body: "Capstone · Submit your 1-page proposal by Friday 5pm.",
        ts: Date.now(),
        read: false,
        link: "#",
        dueAt: Date.now() + 1000 * 60 * 60 * 24 * 3,
      },
      {
        id: rand(),
        type: "message",
        title: "TA replied to your private question",
        body: "‘Can we use symbolic calculators on Quiz 2?’",
        ts: Date.now(),
        read: false,
        link: "#",
      },
      {
        id: rand(),
        type: "update",
        title: "Module 3 published",
        body: "New videos and practice sets are now available.",
        ts: Date.now(),
        read: false,
        link: "#",
      },
    ];
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setItems((prev) => [pick, ...prev]);
    showToast("New notification");
  }

  // Cleanup SIEMPRE devuelve void
  useEffect(() => {
    return () => {
      if (toastTimer.current !== undefined) {
        window.clearTimeout(toastTimer.current);
        toastTimer.current = undefined;
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Notifications
            <BellBadge count={unreadCount} />
          </h3>
          <p className="text-sm text-muted-foreground">
            Stay on top of deadlines, replies, and updates.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            aria-label="Mark all notifications as read"
          >
            Mark all read
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={simulateIncoming}
            aria-label="Simulate incoming notification"
          >
            Simulate incoming
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        <FilterPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterPill label={`Unread (${unreadCount})`} active={filter === "unread"} onClick={() => setFilter("unread")} />
        <FilterPill label="Deadlines" active={filter === "deadline"} onClick={() => setFilter("deadline")} />
        <FilterPill label="Messages" active={filter === "message"} onClick={() => setFilter("message")} />
        <FilterPill label="Updates" active={filter === "update"} onClick={() => setFilter("update")} />
      </div>

      {/* List */}
      <ul className="divide-y rounded-md border bg-gray-50">
        {filtered.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">No notifications here.</li>
        )}
        {filtered.map((n) => (
          <li key={n.id} className={`p-4 flex items-start gap-3 ${!n.read ? "bg-white" : ""}`}>
            <TypeDot type={n.type} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${!n.read ? "font-medium" : "text-gray-700"}`}>{n.title}</span>
                {!n.read && (
                  <span className="text-[10px] rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">
                    new
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{n.body}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span>{relativeTime(n.ts)}</span>
                {n.type === "deadline" && n.dueAt && <span>Due {relativeFuture(n.dueAt)}</span>}
                {n.link && (
                  <a href={n.link} className="underline underline-offset-2">
                    Open
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                onClick={() => toggleRead(n.id)}
                aria-label={n.read ? "Mark as unread" : "Mark as read"}
              >
                {n.read ? "Unread" : "Read"}
              </button>
              <button
                className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                onClick={() => snooze(n.id, 60 * 60 * 1000)}
                aria-label="Snooze for 1 hour"
              >
                Snooze 1h
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Toast */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 right-6">
        {toast && (
          <div className="pointer-events-auto rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 shadow">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- small UI bits ---------- */

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs border",
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-800 hover:bg-gray-50 border-gray-300",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function BellBadge({ count }: { count: number }) {
  return (
    <span className="relative inline-flex items-center">
      <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-700">
        <path
          fill="currentColor"
          d="M12 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 6 14h12a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-[10px] px-1.5 py-0.5">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

function TypeDot({ type }: { type: NType }) {
  const color =
    type === "deadline" ? "bg-rose-500" : type === "message" ? "bg-sky-500" : "bg-amber-500";
  return <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}

/* ---------- utils ---------- */

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}

function relativeFuture(ts: number): string {
  const diff = ts - Date.now();
  if (diff <= 0) return "now";
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `in ${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `in ${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `in ${hr}h`;
  const d = Math.round(hr / 24);
  return `in ${d}d`;
}

function isSnoozed(n: Notification) {
  return !!(n.snoozedUntil && n.snoozedUntil > Date.now());
}

function rand() {
  return Math.random().toString(36).slice(2, 9);
}
