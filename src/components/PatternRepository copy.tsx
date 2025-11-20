// PatternRepository.tsx
"use client";

import { useMemo, useState } from "react";
import { patterns } from "./patternRepo"; // <-- your updated data file
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

/** --- Minimal local typing mirrors the proposed model (no need to import extra files) --- */
type UsageLevel = "High" | "Medium" | "Low" | "Unknown";
type ComplexityLevel = "High" | "Medium" | "Low" | "Unknown";

type Relationships = {
  ui?: string[];
  instructional?: string[];
  pedagogical?: string[];
  uxPrinciples?: string[];
};

type BasePattern = {
  id: string;
  type: "ui" | "instructional" | "pedagogical";
  title: string;
  description: string;
  tags: string[];
  usage?: UsageLevel;
  complexity?: ComplexityLevel;
  relationships?: Relationships;
  sources?: { title: string; url: string }[];
};

type UISubcategory =
  | "Getting Input"
  | "Navigation"
  | "Dealing with Data"
  | "Onboarding"
  | "Social";

type UIPattern = BasePattern & {
  type: "ui";
  subcategory: UISubcategory;
  sourceUrl?: string;
};

type InstructionalPattern = BasePattern & { type: "instructional"; frameworkRef?: string };
type PedagogicalPattern = BasePattern & { type: "pedagogical"; frameworkRef?: string };

type PatternRepositoryData = {
  ui: Record<UISubcategory, UIPattern[]>;
  instructional: InstructionalPattern[];
  pedagogical: PedagogicalPattern[];
};
/** -------------------------------------------------------------------------------------- */

type AnyPattern = UIPattern | InstructionalPattern | PedagogicalPattern;

/** Basic search matcher across title/description/tags/relationships */
function matchesQuery(q: string, p: AnyPattern) {
  if (!q) return true;
  const needle = q.toLowerCase();
  const inText =
    p.title.toLowerCase().includes(needle) ||
    p.description.toLowerCase().includes(needle) ||
    (p.tags ?? []).some((t) => t.toLowerCase().includes(needle));
  if (inText) return true;
  const rels = p.relationships ?? {};
  return Object.values(rels)
    .flat()
    .some((v) => (v || "").toLowerCase().includes(needle));
}

function Pill({ label, value }: { label: "usage" | "complexity"; value?: string }) {
  return (
    <Badge variant="outline">
      {label}: {value && value !== "Unknown" ? value : "—"}
    </Badge>
  );
}

/** Small helper to render relationship chips consistently */
function RelationshipsChips({ rel }: { rel?: Relationships }) {
  if (!rel) return null;
  const chips: { key: string; text: string }[] = [];
  rel.ui?.forEach((r) => chips.push({ key: `ui:${r}`, text: `ui:${r}` }));
  rel.instructional?.forEach((r) => chips.push({ key: `inst:${r}`, text: `inst:${r}` }));
  rel.pedagogical?.forEach((r) => chips.push({ key: `ped:${r}`, text: `ped:${r}` }));
  rel.uxPrinciples?.forEach((r) => chips.push({ key: `ux:${r}`, text: `ux:${r}` }));
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {chips.map((c) => (
        <Badge key={c.key} variant="secondary">
          {c.text}
        </Badge>
      ))}
    </div>
  );
}

export function PatternRepository() {
  const data = patterns as PatternRepositoryData; // assumes your data file follows the model
  const uiSubcats = Object.keys(data.ui) as UISubcategory[];

  const [tab, setTab] = useState<"ui" | "instructional" | "pedagogical">("ui");
  const [query, setQuery] = useState("");

  const filtered: PatternRepositoryData = useMemo(() => {
    if (!query) return data;
    const filterUI = (arr: UIPattern[]) => arr.filter((p) => matchesQuery(query, p));
    const uiFiltered = Object.fromEntries(
      uiSubcats.map((sc) => [sc, filterUI(data.ui[sc])])
    ) as PatternRepositoryData["ui"];
    const instructional = data.instructional.filter((p) => matchesQuery(query, p));
    const pedagogical = data.pedagogical.filter((p) => matchesQuery(query, p));
    return { ui: uiFiltered, instructional, pedagogical };
  }, [data, query]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">Pattern Repository</h1>
        <p className="text-muted-foreground mb-4">
          UI, instructional, and pedagogical patterns with cross-links via tags and relationships.
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            placeholder="Search by title, tag, or relationship…"
            aria-label="Search patterns"
          />
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ui">UI</TabsTrigger>
          <TabsTrigger value="instructional">Instructional</TabsTrigger>
          <TabsTrigger value="pedagogical">Pedagogical</TabsTrigger>
        </TabsList>

        {/* UI tab (grouped by subcategory) */}
        <TabsContent value="ui" className="space-y-8">
          {uiSubcats.map((subcat) => {
            const list = filtered.ui[subcat] || [];
            if (!list.length) return null;
            return (
              <section key={subcat} className="space-y-3">
                <h2 className="text-xl font-semibold">{subcat}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((p) => (
                    <Card key={p.id} className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-lg">{p.title}</CardTitle>
                          <div className="flex gap-2">
                            <Pill label="usage" value={p.usage} />
                            <Pill label="complexity" value={p.complexity} />
                          </div>
                        </div>
                        {!!p.tags?.length && (
                          <div className="flex gap-2 flex-wrap">
                            {p.tags.map((t) => (
                              <Badge key={t} variant="outline">
                                #{t}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription>{p.description}</CardDescription>
                        <RelationshipsChips rel={p.relationships} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </TabsContent>

        {/* Instructional tab */}
        <TabsContent value="instructional">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.instructional.map((p) => (
              <Card key={p.id} className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <div className="flex gap-2">
                      <Pill label="usage" value={p.usage} />
                      <Pill label="complexity" value={p.complexity} />
                    </div>
                  </div>
                  {!!p.tags?.length && (
                    <div className="flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="outline">
                          #{t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription>{p.description}</CardDescription>
                  <RelationshipsChips rel={p.relationships} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pedagogical tab */}
        <TabsContent value="pedagogical">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.pedagogical.map((p) => (
              <Card key={p.id} className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <div className="flex gap-2">
                      <Pill label="usage" value={p.usage} />
                      <Pill label="complexity" value={p.complexity} />
                    </div>
                  </div>
                  {!!p.tags?.length && (
                    <div className="flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="outline">
                          #{t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription>{p.description}</CardDescription>
                  <RelationshipsChips rel={p.relationships} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PatternRepository;
