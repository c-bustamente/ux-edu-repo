// src/components/pattern-examples/ExampleBreadcrumbs.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * ExampleBreadcrumbs
 * ---------------------------------------------------------------------------
 * Education hierarchy demo:
 * Home > Courses > Calculus 101 > Module 2: Limits > Activity: Limit Laws Quiz
 *
 * Features:
 * - Semantic <nav aria-label="Breadcrumb"> with list
 * - Collapses middle crumbs into an overflow ("…") on small screens
 * - Keyboard accessible overflow (Enter/Space to expand)
 * - Current page marked with aria-current="page"
 * - Optional schema.org microdata (BreadcrumbList)
        exampleId: "ExampleBreadcrumbs",
 */
type Crumb = { label: string; href?: string };

export default function ExampleBreadcrumbs() {
  const crumbs = useMemo<Crumb[]>(
    () => [
      { label: "Home", href: "#" },
      { label: "Courses", href: "#" },
      { label: "Calculus 101", href: "#" },
      { label: "Module 2: Limits", href: "#" },
      { label: "Activity: Limit Laws Quiz" }, // current
    ],
    []
  );

  const [expanded, setExpanded] = useState(false);

  // Collapse strategy: show first + last (and maybe second) until expanded
  const visible = useMemo(() => {
    if (expanded || crumbs.length <= 4) return crumbs;
    // collapsed view: [0], "…", [len-2], [len-1]
    return [crumbs[0], { label: "…", href: undefined }, crumbs[crumbs.length - 2], crumbs[crumbs.length - 1]];
  }, [crumbs, expanded]);

  function onOverflowActivate() {
    setExpanded(true);
  }

  // Microdata helpers (optional)
  const itemListElement = (i: number, c: Crumb) =>
    c.href
      ? {
          itemProp: "itemListElement",
          itemScope: true,
          itemType: "https://schema.org/ListItem",
          "aria-hidden": true,
          children: (
            <>
              <meta itemProp="position" content={String(i + 1)} />
              <a href={c.href} itemProp="item">
                <meta itemProp="name" content={c.label} />
              </a>
            </>
          ),
        }
      : {
          itemProp: "itemListElement",
          itemScope: true,
          itemType: "https://schema.org/ListItem",
          "aria-hidden": true,
          children: (
            <>
              <meta itemProp="position" content={String(i + 1)} />
              <span itemProp="name">{c.label}</span>
            </>
          ),
        };

  return (
    <div className="w-full max-w-2xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold">Breadcrumbs</h3>
        <p className="text-sm text-muted-foreground">
          Reveal the user’s location and the path back to parent sections.
        </p>
      </header>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="rounded-md border bg-gray-50 px-3 py-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          {visible.map((c, i) => {
            const isLast = i === visible.length - 1;
            const isOverflow = c.label === "…";

            // Overflow control (only when collapsed)
            if (isOverflow) {
              return (
                <li key={`overflow-${i}`} className="flex items-center">
                  <button
                    type="button"
                    onClick={onOverflowActivate}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOverflowActivate()}
                    className="inline-flex items-center rounded px-2 py-0.5 hover:bg-gray-200"
                    aria-label="Show full path"
                  >
                    …
                  </button>
                  <Separator />
                </li>
              );
            }

            // Regular crumb
            return (
              <li key={`${c.label}-${i}`} className="flex items-center">
                {c.href && !isLast ? (
                  <a
                    href={c.href}
                    className="text-blue-700 hover:underline underline-offset-2"
                  >
                    {c.label}
                  </a>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "font-medium text-gray-900" : "text-gray-700"}
                  >
                    {c.label}
                  </span>
                )}
                {!isLast && <Separator />}
              </li>
            );
          })}
        </ol>

        {/* Microdata (hidden, optional) */}
        <div className="hidden">
          {crumbs.map((c, i) => (
            <div key={`md-${i}`} {...itemListElement(i, c)} />
          ))}
        </div>
      </nav>

      {/* Demo: page title to pair with the current crumb */}
      <div className="mt-4">
        <h4 className="text-base font-semibold">Activity: Limit Laws Quiz</h4>
        <p className="text-sm text-muted-foreground">
          Use breadcrumbs to move back to <a className="underline" href="#">Module 2</a> or <a className="underline" href="#">Calculus 101</a>.
        </p>
      </div>
    </div>
  );
}

function Separator() {
  return <span className="mx-2 text-gray-400">/</span>;
}
