"use client";

import { useMemo, useState } from "react";

/**
 * ExampleReaction
 * ----------------------------------------------------------
 * Education use case:
 * - Students react to posts/resources/chat messages (👍, 💡, ✅, ❓, ❤️).
 * - Optimistic updates, per-user toggle, keyboard accessible.
 * - Optional anonymity for viewers (names hidden, just counts).
 *
 * Replace MOCK with your API. Keep the payload shape to swap easily.
 */

type ReactionKey = "like" | "insight" | "agree" | "question" | "heart";

type ReactionMeta = {
  key: ReactionKey;
  emoji: string;
  label: string;
};

const REACTIONS: ReactionMeta[] = [
  { key: "like",     emoji: "👍", label: "Like" },
  { key: "insight",  emoji: "💡", label: "Insightful" },
  { key: "agree",    emoji: "✅", label: "Agree" },
  { key: "question", emoji: "❓", label: "Question" },
  { key: "heart",    emoji: "❤️", label: "Appreciate" },
];

// Demo users
type UserId = "you" | "ana" | "bruno" | "carla";

// Demo content item
type Item = {
  id: string;
  title: string;
  excerpt: string;
  // map reaction → set of user ids who reacted
  reacts: Record<ReactionKey, Set<UserId>>;
};

// Seed data
const MOCK_ITEMS: Item[] = [
  {
    id: "post-1",
    title: "Chain Rule pitfalls",
    excerpt: "Share common mistakes you’ve seen when differentiating nested functions.",
    reacts: {
      like: new Set<UserId>(["ana", "bruno"]),
      insight: new Set<UserId>(["you"]),
      agree: new Set<UserId>([]),
      question: new Set<UserId>(["carla"]),
      heart: new Set<UserId>([]),
    },
  },
  {
    id: "res-1",
    title: "Pandas Lab Starter (Notebook)",
    excerpt: "Starter notebook for groupby, pivot, and plotting.",
    reacts: {
      like: new Set<UserId>(["ana"]),
      insight: new Set<UserId>([]),
      agree: new Set<UserId>(["bruno", "carla"]),
      question: new Set<UserId>([]),
      heart: new Set<UserId>(["you"]),
    },
  },
];

export default function ExampleReaction() {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [viewer, setViewer] = useState<UserId>("you");
  const [anonymousView, setAnonymousView] = useState(false);

  function toggle(itemId: string, key: ReactionKey) {
    // Optimistic update: toggle viewer in the Set
    setItems(prev =>
      prev.map(it => {
        if (it.id !== itemId) return it;
        const next = cloneItem(it);
        const bucket = next.reacts[key];
        if (bucket.has(viewer)) bucket.delete(viewer);
        else bucket.add(viewer);
        return next;
      })
    );
    // TODO: persist: POST /items/:id/reactions { userId, key, action }
  }

  return (
    <div className="w-full max-w-3xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Reactions</h3>
        <p className="text-sm text-muted-foreground">
          One-click feedback for posts, resources, or chat messages. Keyboard: Tab to focus, Space/Enter to toggle.
        </p>
      </header>

      {/* Viewer + options */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-sm">
          Viewer:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={viewer}
            onChange={(e) => setViewer(e.target.value as UserId)}
          >
            <option value="you">You</option>
            <option value="ana">Ana</option>
            <option value="bruno">Bruno</option>
            <option value="carla">Carla</option>
          </select>
        </label>

        <label className="ml-auto inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={anonymousView}
            onChange={(e) => setAnonymousView(e.target.checked)}
          />
          Anonymous view (hide names)
        </label>
      </div>

      {/* List of content with reactions */}
      <ul className="space-y-4">
        {items.map((it) => (
          <li key={it.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold">{it.title}</h4>
                <p className="text-sm text-gray-600">{it.excerpt}</p>
              </div>
            </div>

            {/* Reaction bar */}
            <ReactionBar
              item={it}
              viewer={viewer}
              anonymous={anonymousView}
              onToggle={toggle}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Reaction bar component ---------------- */

function ReactionBar({
  item,
  viewer,
  anonymous,
  onToggle,
}: {
  item: Item;
  viewer: UserId;
  anonymous: boolean;
  onToggle: (itemId: string, key: ReactionKey) => void;
}) {
  // Aggregate counts and whether the viewer has reacted
  const rows = useMemo(() => {
    return REACTIONS.map(meta => {
      const users = item.reacts[meta.key];
      return {
        ...meta,
        count: users.size,
        mine: users.has(viewer),
        users: Array.from(users),
      };
    }).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [item, viewer]);

  const total = rows.reduce((a, r) => a + r.count, 0);

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        {rows.map((r) => (
          <ReactionPill
            key={r.key}
            ariaLabel={`${r.label}: ${r.count} ${r.count === 1 ? "reaction" : "reactions"}`}
            active={r.mine}
            onClick={() => onToggle(item.id, r.key)}
          >
            <span className="text-base" aria-hidden>{r.emoji}</span>
            <span className="text-xs">{r.count}</span>
          </ReactionPill>
        ))}

        <span className="ml-1 text-xs text-gray-500">{total} total</span>
      </div>

      {/* Who reacted (optional, hides when anonymous) */}
      {!anonymous && (
        <div className="mt-2 text-xs text-gray-500">
          {rows
            .filter(r => r.count > 0)
            .map(r => (
              <span key={r.key} className="mr-3">
                {r.emoji}{" "}
                <span className="text-gray-700">{r.label}</span>:{" "}
                {r.users.slice(0, 3).join(", ")}
                {r.users.length > 3 ? ` +${r.users.length - 3}` : ""}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Small UI helpers ---------------- */

function ReactionPill({
  children,
  active,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1",
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
        "focus:outline-none focus:ring-2 focus:ring-gray-300",
      ].join(" ")}
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
}

/* ---------------- Utilities ---------------- */

function cloneItem(it: Item): Item {
  // Deep-clone Sets to avoid mutating React state
  const next: Item = {
    ...it,
    reacts: {
      like: new Set(it.reacts.like),
      insight: new Set(it.reacts.insight),
      agree: new Set(it.reacts.agree),
      question: new Set(it.reacts.question),
      heart: new Set(it.reacts.heart),
    },
  };
  return next;
}
