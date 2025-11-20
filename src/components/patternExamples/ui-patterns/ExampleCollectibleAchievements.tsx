// src/components/pattern-examples/ExampleCollectibleAchievements.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * ExampleCollectibleAchievements
 * ------------------------------------------------------------------
 * Education use case:
 * - Earn badges by completing learning milestones (streaks, grades, help peers).
 * - Rarity tiers; progress ring for partial progress; claim flow with toast.
 * - Filters (earned/locked), sorting, and “pin to profile”.
 *
 * Notes:
 * - No external libs; pure Tailwind + inline SVG.
 * - Replace MOCK data/fns with your API; emit a notification on claim if desired.
 */

type Tier = "bronze" | "silver" | "gold" | "platinum";
type Status = "locked" | "progress" | "earned";

type Badge = {
  id: string;
  title: string;
  tier: Tier;
  points: number;       // points value toward leaderboard
  status: Status;
  pct?: number;         // 0..100 only for "progress"
  category: "Learning" | "Engagement" | "Performance";
  desc: string;
};

const MOCK: Badge[] = [
  { id: "b-streak-7",    title: "7-Day Streak",            tier: "bronze",   points: 50,  status: "earned",   pct: 100, category: "Engagement", desc: "Logged learning activity 7 days in a row." },
  { id: "b-streak-30",   title: "30-Day Streak",           tier: "gold",     points: 180, status: "progress", pct: 60,  category: "Engagement", desc: "Consistent activity across a month." },
  { id: "b-helpful-5",   title: "Helpful x5",              tier: "silver",   points: 120, status: "earned",   pct: 100, category: "Engagement", desc: "Received 5 ‘helpful’ marks in discussions." },
  { id: "b-avg-85",      title: "Solid Grades (85%+)",     tier: "silver",   points: 140, status: "progress", pct: 80,  category: "Performance", desc: "Maintain average grade of 85% or higher." },
  { id: "b-avg-95",      title: "Excellence (95%+)",       tier: "platinum", points: 300, status: "locked",           category: "Performance", desc: "Maintain average grade of 95% or higher." } as Badge,
  { id: "b-modules-10",  title: "Module Master (10)",      tier: "bronze",   points: 80,  status: "earned",   pct: 100, category: "Learning",   desc: "Completed 10 learning modules." },
  { id: "b-modules-25",  title: "Module Master (25)",      tier: "gold",     points: 220, status: "progress", pct: 40,  category: "Learning",   desc: "Completed 25 learning modules." },
];

/* --------------------------- Component --------------------------- */

export default function ExampleCollectibleAchievements() {
  const [filter, setFilter] = useState<"all" | "earned" | "locked" | "progress">("all");
  const [sort, setSort] = useState<"tier" | "points" | "title">("tier");
  const [pinned, setPinned] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    let arr = MOCK.slice();

    if (filter !== "all") {
      arr = arr.filter((b) => b.status === filter);
    }

    if (sort === "tier") {
      const order: Tier[] = ["platinum", "gold", "silver", "bronze"];
      arr.sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier) || b.points - a.points);
    } else if (sort === "points") {
      arr.sort((a, b) => b.points - a.points);
    } else {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    }

    // keep pinned first within the chosen sort
    const pin = Array.from(pinned);
    if (pin.length) {
      arr = [...arr.filter((x) => pinned.has(x.id)), ...arr.filter((x) => !pinned.has(x.id))];
    }

    return arr;
  }, [filter, sort, pinned]);

  function togglePin(id: string) {
    setPinned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function claim(id: string) {
    // In real app: POST /achievements/claim, then refresh
    alert(`Achievement claimed: ${id}`);
  }

  return (
    <div className="w-full max-w-4xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Collectible Achievements</h3>
        <p className="text-sm text-muted-foreground">
          Earn badges for learning milestones. Pin favorites to your profile.
        </p>
      </header>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-sm">
          Filter:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All</option>
            <option value="earned">Earned</option>
            <option value="progress">In Progress</option>
            <option value="locked">Locked</option>
          </select>
        </label>

        <label className="text-sm">
          Sort:&nbsp;
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
          >
            <option value="tier">Tier</option>
            <option value="points">Points</option>
            <option value="title">Title</option>
          </select>
        </label>

        <span className="ml-auto text-sm text-gray-600">
          {items.length} badge{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b) => (
          <article
            key={b.id}
            className={[
              "relative rounded-xl border p-4 shadow-sm bg-white",
              b.status === "earned" ? "border-emerald-300" : b.status === "progress" ? "border-amber-300" : "border-gray-200",
            ].join(" ")}
          >
            {/* Tier glyph */}
            <div className="absolute right-3 top-3">
              <TierMedal tier={b.tier} />
            </div>

            <h4 className="pr-8 text-sm font-semibold">{b.title}</h4>
            <p className="mt-1 text-xs text-gray-500">{b.desc}</p>

            {/* Progress / earned status */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ProgressRing status={b.status} pct={b.pct ?? (b.status === "earned" ? 100 : 0)} />
                <div className="text-xs text-gray-600">
                  <div className="font-medium capitalize">{b.status}</div>
                  <div className="text-[11px]">+{b.points} pts</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={[
                    "rounded-md border px-2 py-1 text-xs",
                    b.status === "earned"
                      ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                      : b.status === "progress"
                      ? "bg-amber-100 border-amber-300 text-amber-900"
                      : "bg-gray-100 border-gray-300 text-gray-700",
                  ].join(" ")}
                  disabled={b.status === "locked"}
                  onClick={() => claim(b.id)}
                >
                  {b.status === "earned" ? "Claim" : b.status === "progress" ? "Keep going" : "Locked"}
                </button>

                <button
                  className={[
                    "rounded-md border px-2 py-1 text-xs",
                    pinned.has(b.id) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 hover:bg-gray-50 border-gray-300",
                  ].join(" ")}
                  aria-pressed={pinned.has(b.id)}
                  onClick={() => togglePin(b.id)}
                >
                  {pinned.has(b.id) ? "Pinned" : "Pin"}
                </button>
              </div>
            </div>

            {/* Category pill */}
            <div className="mt-3">
              <span className="rounded-full bg-gray-900 text-white text-[10px] px-2 py-0.5">{b.category}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Tip */}
      <p className="mt-4 text-xs text-gray-500">
        Tip: pair badges with a leaderboard and gentle notifications; allow private mode to reduce social pressure.
      </p>
    </div>
  );
}

/* ---------------------- small UI bits ---------------------- */

function TierMedal({ tier }: { tier: Tier }) {
  const tone =
    tier === "platinum" ? "text-gray-900"
    : tier === "gold"     ? "text-yellow-500"
    : tier === "silver"   ? "text-gray-400"
    :                       "text-amber-700";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={tone} aria-hidden>
      <path fill="currentColor" d="M12 2l3 4h-2v6h-2V6H9l3-4Zm0 20a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
    </svg>
  );
}

function ProgressRing({ status, pct }: { status: Status; pct: number }) {
  const size = 32;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const dash = (clamped / 100) * c;

  const track = "stroke-gray-200";
  const color =
    status === "earned" ? "stroke-emerald-600"
    : status === "progress" ? "stroke-amber-500"
    : "stroke-gray-400";

  return (
    <svg width={size} height={size} className="shrink-0" role="img" aria-label={`Progress ${clamped}%`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" className={track} strokeWidth={stroke} />
      <circle
        cx={size/2}
        cy={size/2}
        r={r}
        fill="none"
        className={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-[10px] fill-gray-700">
        {clamped}%
      </text>
    </svg>
  );
}
