/**
 * RecommendationGenerator.tsx — Enhanced v4 (Vector PDF, refined)
 * - Export PDF: vector text con márgenes estables, sin solapes y fuentes consistentes.
 * - Heading restaurado: "Selected recommendations (with references)" con numeración.
 * - Sección restaurada: "Associated patterns (by category)" (muestra "—" si no hay match).
 * - Envoltura robusta de URLs/tokens largos para evitar desbordes.
 */

"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

import {
  Link as LinkIcon,
  Search,
  ChevronDown,
  Columns,
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  ExternalLink,
  FileDown,
  Eye,
  ListChecks,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { patterns } from "./patternRepo";
import * as recData from "./recomendacionesEnglish";

/* ===================== Types ===================== */
export type EvidenceStatus = "backed" | "needs-review";
export type SourceRef = {
  url?: string;
  title?: string;
  authors?: string;
  venue?: string;
  quote?: string;
  tags?: string[];
  doi?: string;
};

type RecInner = { title: string; how?: string; why?: string; example?: string };

type RawItem = {
  inputID?: string;
  status?: EvidenceStatus | string;
  patternRef?: string;
  evaType?: string;
  eva_type?: string;
  eva?: string;
  audience?: string;
  platform?: string;
  recommendation?: RecInner;
  recomendation?: RecInner;
  sources?: SourceRef[];
  tags?: string[];
};

type Rec = {
  id: string;
  sourceName: string;
  patternRef?: string;
  evaType?: string;
  audience?: string;
  platform?: string;
  recommendation: { title: string; how?: string; why?: string };
  sources: SourceRef[];
};

type PatternCategory = "ui" | "instructional" | "pedagogical";

type PatternBase = {
  id: string;
  title?: string;
  subcategory?: string;
  description?: string;
  tags?: string[];
  sources?: SourceRef[];
  example?: string;
  exampleText?: string;
  exampleImg?: string;
  exampleImage?: string;
};

type PatternWithType = PatternBase & { type: PatternCategory };

type PatternRepoData = {
  ui?: Record<string, PatternBase[]>;
  instructional?: PatternBase[];
  pedagogical?: PatternBase[];
};

type AssocMaps = {
  ui: Map<string, PatternWithType>;
  instructional: Map<string, PatternWithType>;
  pedagogical: Map<string, PatternWithType>;
};

/* ===================== Helpers ===================== */
const sourceLabels: Record<string, { label: string; border: string; pill: string }> = {
  PLATFORM_UI_COMBINED: { label: "Platform UI", border: "border-emerald-300", pill: "bg-emerald-100 text-emerald-800" },
  RECOMMENDATIONS_EVA: { label: "EVA Type", border: "border-violet-300", pill: "bg-violet-100 text-violet-800" },
  AUDIENCE_RECOMMENDATIONS: { label: "Audience", border: "border-sky-300", pill: "bg-sky-100 text-sky-800" },
  PLATFORM_MOBILE_UI_RECOMMENDATIONS: { label: "Platform UI", border: "border-emerald-300", pill: "bg-emerald-100 text-emerald-800" },
  PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS: { label: "Platform UI", border: "border-amber-300", pill: "bg-amber-100 text-amber-800" },
  default: { label: "Other", border: "border-zinc-300", pill: "bg-zinc-100 text-zinc-800" },
};

const COLUMN_ORDER = ["PLATFORM_UI_COMBINED", "RECOMMENDATIONS_EVA", "AUDIENCE_RECOMMENDATIONS"] as const;

const isBlank = (v?: string | null) => v == null || String(v).trim() === "";
const coalesceEvaType = (it: RawItem) => it.evaType ?? it.eva_type ?? it.eva ?? undefined;
const uniqStrings = (values: Array<string | undefined | null>) => {
  const s = new Set<string>();
  for (const v of values) if (typeof v === "string" && v.trim()) s.add(v.trim());
  return Array.from(s);
};
const norm = (s?: string) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
function matches(sel: string, val?: string) {
  if (!sel || sel === "all") return true;
  if (isBlank(val)) return true;
  const a = norm(sel), b = norm(val);
  return a === b || b.includes(a) || a.includes(b);
}
const compactURLs = (sources?: SourceRef[]) =>
  (Array.isArray(sources) ? sources : []).flatMap((s) => (s?.url ? [s.url] : []));
function firstLineOrSentence(s?: string) {
  if (!s) return "";
  const t = s.trim();
  const n = t.indexOf("\n");
  if (n >= 0) return t.slice(0, n);
  const m = t.match(/[^.!?]+[.!?]/);
  return m ? m[0] : t;
}

/* ===================== Normalize ===================== */
function normalizeOne(it: RawItem, i: number, sourceName: string): Rec | null {
  const recommendation = it.recommendation ?? it.recomendation;
  if (!recommendation?.title) return null;
  const id = `${sourceName}__${i}`;
  return {
    id,
    sourceName,
    patternRef: typeof it.patternRef === "string" ? it.patternRef : undefined,
    evaType: coalesceEvaType(it),
    audience: it.audience,
    platform: it.platform,
    recommendation: { title: recommendation.title, how: recommendation.how, why: recommendation.why },
    sources: Array.isArray(it.sources) ? it.sources : [],
  };
}
function loadAll(): { recs: Rec[] } {
  const recs: Rec[] = [];
  if (Array.isArray((recData as any).default)) {
    const arr = (recData as any).default as RawItem[];
    arr.forEach((it, i) => { const n = normalizeOne(it, i, "default"); if (n) recs.push(n); });
  }
  for (const [name, value] of Object.entries(recData)) {
    if (name === "default") continue;
    if (Array.isArray(value)) {
      const arr = value as RawItem[];
      arr.forEach((it, i) => { const n = normalizeOne(it, i, name); if (n) recs.push(n); });
    }
  }
  return { recs };
}

/* ===================== Component ===================== */
export default function RecommendationGenerator() {
  const printSafeCSS = `
    .print-safe, .print-safe * { background-image: none !important; box-shadow: none !important; filter: none !important; backdrop-filter: none !important; color: #111 !important; background-color: #ffffff !important; border-color: #e5e7eb !important; }
  `;

  const [allRecs, setAllRecs] = useState<Rec[]>([]);
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [evaType, setEvaType] = useState<string>("all");
  const [audience, setAudience] = useState<string>("all");

  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const [selected, setSelected] = useState<Record<string, Rec>>({});
  const selectedList = useMemo(() => Object.values(selected), [selected]);

  // Restore selections
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recgen:selected");
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        if (Array.isArray(ids) && ids.length && allRecs.length) {
          const index = new Map(allRecs.map((r) => [r.id, r] as const));
          const next: Record<string, Rec> = {};
          ids.forEach((id) => { const r = index.get(id); if (r) next[id] = r; });
          setSelected(next);
        }
      }
    } catch {}
  }, [allRecs.length]);
  useEffect(() => { try { const ids = Object.keys(selected); localStorage.setItem("recgen:selected", JSON.stringify(ids)); } catch {} }, [selected]);

  // Pattern index with category
  const patternIndex = useMemo<Map<string, PatternWithType>>(() => {
    const m = new Map<string, PatternWithType>();
    const data = patterns as PatternRepoData;

    if (data.ui) {
      Object.keys(data.ui).forEach((subcat) => {
        (data.ui?.[subcat] ?? []).forEach((p) => { if (!p.id) return; m.set(p.id, { ...p, type: "ui" }); });
      });
    }
    (data.instructional ?? []).forEach((p) => { if (!p.id) return; m.set(p.id, { ...p, type: "instructional" }); });
    (data.pedagogical ?? []).forEach((p) => { if (!p.id) return; m.set(p.id, { ...p, type: "pedagogical" }); });

    return m;
  }, []);

  // Extra index by lowercased title (fallback cuando patternRef coincide con título y no con id)
  const patternByTitleLC = useMemo<Map<string, PatternWithType>>(() => {
    const m = new Map<string, PatternWithType>();
    patternIndex.forEach((p) => {
      const k = (p.title ?? p.id ?? "").toLowerCase().trim();
      if (k) m.set(k, p);
    });
    return m;
  }, [patternIndex]);

  // Pattern preview dialog
  const [previewPatternId, setPreviewPatternId] = useState<string | null>(null);
  const [patternFull, setPatternFull] = useState(false);
  const previewPattern = useMemo(() => (previewPatternId ? patternIndex.get(previewPatternId) ?? null : null), [previewPatternId, patternIndex]);
  const openPattern = useCallback((id: string) => { setPreviewPatternId(id); setPatternFull(false); }, []);

  // Data
  useEffect(() => { const { recs } = loadAll(); setAllRecs(recs); }, []);
  useEffect(() => setOpenCardId(null), [q, platform, evaType, audience]);

  // Options
  const platforms = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.platform))], [allRecs]);
  const evaTypes = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.evaType))], [allRecs]);
  const audiences = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.audience))], [allRecs]);

  // Filtered records
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allRecs.filter((r) => {
      const okPlat = matches(platform, r.platform);
      const okEva = matches(evaType, r.evaType);
      const okAud = matches(audience, r.audience);
      const haystack = [r.recommendation.title, r.recommendation.how, r.recommendation.why, r.patternRef, r.platform, r.evaType, r.audience, ...compactURLs(r.sources)].filter(Boolean).join(" ").toLowerCase();
      const okSearch = !needle || haystack.includes(needle);
      return okPlat && okEva && okAud && okSearch;
    });
  }, [allRecs, q, platform, evaType, audience]);

  // Grouping (merge platform arrays → PLATFORM_UI_COMBINED)
  const grouped = useMemo(() => {
    const groups = new Map<string, Rec[]>();
    for (const rec of filtered) { const key = rec.sourceName ?? "default"; if (!groups.has(key)) groups.set(key, []); groups.get(key)!.push(rec); }
    const mobileKey = "PLATFORM_MOBILE_UI_RECOMMENDATIONS";
    const webKey = "PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS";
    const merged = [...(groups.get(mobileKey) ?? []), ...(groups.get(webKey) ?? [])];
    groups.set("PLATFORM_UI_COMBINED", merged);
    groups.delete(mobileKey); groups.delete(webKey);
    const present = Array.from(groups.keys());
    const ordered = (COLUMN_ORDER as readonly string[]).filter((k) => present.includes(k));
    const remaining = present.filter((k) => !ordered.includes(k));
    return { groups, present: [...ordered, ...remaining] as string[] };
  }, [filtered]);

  const presentColumns: string[] = grouped.present;

  // Selection helpers
  const isSelected = useCallback((id: string) => !!selected[id], [selected]);
  const toggleSelected = useCallback((r: Rec) => setSelected((prev) => { const next = { ...prev }; if (next[r.id]) delete next[r.id]; else next[r.id] = r; return next; }), []);
  const removeSelected = useCallback((id: string) => setSelected((prev) => { const n = { ...prev }; delete n[id]; return n; }), []);
  const clearSelected = useCallback(() => setSelected({}), []);

  // Mobile flyout state
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  // Side tabs toggle
  const [sideTabs, setSideTabs] = useState(false);
  const [tab, setTab] = useState<string>("platform");

  const platformItems = grouped.groups.get("PLATFORM_UI_COMBINED") ?? [];
  const evaItems = grouped.groups.get("RECOMMENDATIONS_EVA") ?? [];
  const audienceItems = grouped.groups.get("AUDIENCE_RECOMMENDATIONS") ?? [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 pb-28">
      <style jsx global>{printSafeCSS}</style>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Recommendation Generator</h1>
        <p className="text-muted-foreground">Filter by Platform / Audience / EVA, add recommendations, and export a PDF with selections and associated patterns.</p>
      </header>

      {/* Filters */}
      <Card>
        <CardContent className="py-4 grid md:grid-cols-[1fr_200px_200px_200px] gap-3">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
          <div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>{platforms.map((p) => (<SelectItem key={p} value={p}>{p === "all" ? "All platforms" : p}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div>
            <Select value={evaType} onValueChange={setEvaType}>
              <SelectTrigger className="w-full"><SelectValue placeholder="EVA type" /></SelectTrigger>
              <SelectContent>{evaTypes.map((e) => (<SelectItem key={e} value={e}>{e === "all" ? "All EVAs" : e}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Audience" /></SelectTrigger>
              <SelectContent>{audiences.map((a) => (<SelectItem key={a} value={a}>{a === "all" ? "All audiences" : a}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Desktop layout */}
      <div className="hidden xl:grid xl:grid-cols-[1fr_1fr_1fr_360px] gap-6">
        {presentColumns.map((groupKey: string) => {
          const items = grouped.groups.get(groupKey) ?? [];
          return (
            <div key={groupKey} className="flex flex-col min-w-0">
              <ColumnHeader name={groupKey} />
              <div className="mt-3 overflow-y-auto pr-2 rounded-lg" style={{ maxHeight: "78vh" }}>
                <AnimatePresence mode="popLayout">
                  <div className="flex flex-col gap-3 min-w-0">
                    {items.map((rec) => {
                      const cardRec = groupKey === "PLATFORM_UI_COMBINED" && rec.sourceName.startsWith("PLATFORM_") ? { ...rec, sourceName: "PLATFORM_UI_COMBINED" } : rec;
                      return (
                        <RecommendationCard key={cardRec.id} rec={cardRec} isOpen={openCardId === cardRec.id} isSelected={isSelected(cardRec.id)} onToggleOpen={(id) => setOpenCardId(id === openCardId ? null : id)} onToggleSelect={toggleSelected} onOpenPattern={openPattern} />
                      );
                    })}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
        <div className="xl:col-start-4">
          <SelectedPanel items={selectedList} onRemove={removeSelected} onClear={clearSelected} patternIndex={patternIndex} patternByTitleLC={patternByTitleLC} />
        </div>
      </div>

      {/* Mobile side tabs toggle */}
      <div className="xl:hidden flex justify-center">
        {!sideTabs ? (
          <Button variant="outline" size="sm" onClick={() => setSideTabs(true)}>View recommendations</Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setSideTabs(false)}>Back</Button>
        )}
      </div>

      {/* Mobile Tabs */}
      <div className="xl:hidden space-y-4">
        {!sideTabs ? (
          <Tabs value={tab} onValueChange={setTab}>
            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2">
              <TabsList className="mx-auto max-w-md w-full grid grid-cols-3 gap-2 bg-transparent">
                <TabsTrigger value="platform" className="rounded-full py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white">Platform</TabsTrigger>
                <TabsTrigger value="eva" className="rounded-full py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white">EVA</TabsTrigger>
                <TabsTrigger value="audience" className="rounded-full py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white">Audience</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="platform" className="mt-3"><MobileList items={platformItems} openCardId={openCardId} setOpenCardId={setOpenCardId} isSelected={isSelected} toggleSelected={toggleSelected} openPattern={openPattern} /></TabsContent>
            <TabsContent value="eva" className="mt-3"><MobileList items={evaItems} openCardId={openCardId} setOpenCardId={setOpenCardId} isSelected={isSelected} toggleSelected={toggleSelected} openPattern={openPattern} /></TabsContent>
            <TabsContent value="audience" className="mt-3"><MobileList items={audienceItems} openCardId={openCardId} setOpenCardId={setOpenCardId} isSelected={isSelected} toggleSelected={toggleSelected} openPattern={openPattern} /></TabsContent>
          </Tabs>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <div className="grid grid-cols-[minmax(120px,34vw)_1fr] gap-3 items-start">
              <div className="sticky top-16 z-40">
                <TabsList className="flex flex-col items-stretch gap-2 bg-transparent">
                  <TabsTrigger value="platform" className="justify-start rounded-md py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white">Platform</TabsTrigger>
                  <TabsTrigger value="eva" className="justify-start rounded-md py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white">EVA</TabsTrigger>
                  <TabsTrigger value="audience" className="justify-start rounded-md py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white">Audience</TabsTrigger>
                </TabsList>
              </div>
              <div className="min-w-0">
                <TabsContent value="platform"><MobileList items={platformItems} openCardId={openCardId} setOpenCardId={setOpenCardId} isSelected={isSelected} toggleSelected={toggleSelected} openPattern={openPattern} /></TabsContent>
                <TabsContent value="eva"><MobileList items={evaItems} openCardId={openCardId} setOpenCardId={setOpenCardId} isSelected={isSelected} toggleSelected={toggleSelected} openPattern={openPattern} /></TabsContent>
                <TabsContent value="audience"><MobileList items={audienceItems} openCardId={openCardId} setOpenCardId={setOpenCardId} isSelected={isSelected} toggleSelected={toggleSelected} openPattern={openPattern} /></TabsContent>
              </div>
            </div>
          </Tabs>
        )}
      </div>

      {/* Mobile FAB + flyout */}
      <button
        type="button"
        onClick={() => setFlyoutOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-30 xl:hidden inline-flex items-center gap-2 rounded-full px-4 py-2 border shadow bg-white"
        aria-label="Selected recommendations"
      >
        <ListChecks className="w-5 h-5" />
        <span className="text-sm font-medium">Selected ({selectedList.length})</span>
      </button>

      <aside
        className={`xl:hidden fixed z-40 bottom-20 right-4 w-[min(420px,92vw)] max-h-[70vh] border bg-white rounded-2xl shadow-lg transition-all ${
          flyoutOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible pointer-events-none"
        }`}
        aria-hidden={!flyoutOpen}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-base">My selections</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFlyoutOpen(false)}
              aria-label="Collapse"
              title="Collapse"
            >
              _
            </Button>
          </div>
          <SelectedPanel
            items={selectedList}
            onRemove={removeSelected}
            onClear={clearSelected}
            patternIndex={patternIndex}
            patternByTitleLC={patternByTitleLC}
          />
        </div>
      </aside>

      {/* Pattern dialog */}
      <Dialog
        open={!!previewPattern}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewPatternId(null);
            setPatternFull(false);
          }
        }}
      >
        <DialogContent
          className={
            patternFull
              ? "w-[96vw] max-w-[96vw] h-[92vh] p-0"
              : "sm:max-w-[900px] max-w-[95vw] max-h-[85vh]"
          }
        >
          <DialogHeader className="px-4 pt-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <DialogTitle className="break-words">
                  {previewPattern?.title || previewPattern?.id || "Pattern"}
                </DialogTitle>
                <DialogDescription>
                  {previewPattern?.type ? String(previewPattern.type).toUpperCase() : ""}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPatternFull((v) => !v)}
                aria-label={patternFull ? "Exit fullscreen" : "Fullscreen"}
              >
                {patternFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </DialogHeader>
          <div
            className={
              patternFull
                ? "p-4 overflow-y-auto h-[calc(92vh-64px)] space-y-3"
                : "p-4 overflow-y-auto space-y-3"
            }
          >
            {previewPattern?.subcategory && (
              <div className="text-xs text-muted-foreground">
                Subcategory: {previewPattern.subcategory}
              </div>
            )}
            {previewPattern?.description && (
              <p className="text-sm break-words">{previewPattern.description}</p>
            )}
            {/* Example */}
            {(() => {
              const ex =
                previewPattern && (previewPattern.example || previewPattern.exampleText);
              const img =
                previewPattern && (previewPattern.exampleImg || previewPattern.exampleImage);
              if (!ex && !img) return null;
              return (
                <div>
                  <div className="text-xs font-semibold mb-1">Example</div>
                  {typeof ex === "string" ? (
                    <div className="rounded border p-2 text-sm whitespace-pre-wrap break-words">
                      {ex}
                    </div>
                  ) : null}
                  {img ? (
                    <div className="mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt="Pattern example"
                        className="max-h-72 w-auto rounded border"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })()}
            {!!(previewPattern?.tags?.length) && (
              <div className="flex flex-wrap gap-1">
                {previewPattern.tags.map((t: string) => (
                  <Badge key={t} variant="outline">
                    #{t}
                  </Badge>
                ))}
              </div>
            )}
            {!!(previewPattern?.sources?.length) && (
              <div>
                <div className="text-xs font-semibold mb-1">Sources</div>
                <ul className="list-disc pl-5 space-y-1">
                  {previewPattern.sources.slice(0, 5).map((s: SourceRef, i: number) => (
                    <li key={i} className="text-xs break-words">
                      {s.title}
                      {s.url ? (
                        <>
                          <span> · </span>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline inline-flex items-center gap-1 break-all"
                          >
                            link <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------- Mobile list wrapper -------------------- */
function MobileList({
  items,
  openCardId,
  setOpenCardId,
  isSelected,
  toggleSelected,
  openPattern,
}: {
  items: Rec[];
  openCardId: string | null;
  setOpenCardId: (id: string | null) => void;
  isSelected: (id: string) => boolean;
  toggleSelected: (r: Rec) => void;
  openPattern: (id: string) => void;
}) {
  if (!items.length)
    return <p className="text-sm text-muted-foreground">No recommendations for this category.</p>;
  return (
    <div className="flex flex-col gap-3">
      {items.map((rec) => (
        <RecommendationCard
          key={rec.id}
          rec={rec}
          isOpen={openCardId === rec.id}
          isSelected={isSelected(rec.id)}
          onToggleOpen={(id) => setOpenCardId(id === openCardId ? null : id)}
          onToggleSelect={toggleSelected}
          onOpenPattern={openPattern}
        />
      ))}
    </div>
  );
}

/* -------------------- Sub-components -------------------- */
function ColumnHeader({ name }: { name: string }) {
  const meta = sourceLabels[name] ?? sourceLabels.default;
  return (
    <div className="sticky top-0 z-10 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 border-b">
      <div className="flex items-center gap-2 px-1">
        <Columns className="w-4 h-4" />
        <div className="text-base font-semibold">
          {meta.label} <span className="text-xs text-muted-foreground">({name})</span>
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  rec: Rec;
  isOpen: boolean;
  isSelected: boolean;
  onToggleOpen: (id: string | null) => void;
  onToggleSelect: (rec: Rec) => void;
  onOpenPattern: (id: string) => void;
};
function RecommendationCard({
  rec,
  isOpen,
  isSelected,
  onToggleOpen,
  onToggleSelect,
  onOpenPattern,
}: CardProps) {
  const meta = sourceLabels[rec.sourceName] ?? sourceLabels.default;
  const preview = firstLineOrSentence(rec.recommendation.why);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="min-w-0"
    >
      <Card className={`flex flex-col border-2 ${meta.border} shadow-sm hover:shadow-md transition min-w-0`}>
        <CardHeader className="space-y-2">
          <div className="flex items-start gap-2 min-w-0">
            <CardTitle className="text-base leading-snug break-words flex-1 min-w-0">
              {rec.recommendation.title}
            </CardTitle>
            {/* Add button (restaurado) */}
            <Button
              size="sm"
              onClick={() => onToggleSelect(rec)}
              className={`rounded-full text-xs shrink-0 ${
                isSelected
                  ? "bg-emerald-200 text-emerald-900 hover:bg-emerald-300 border border-emerald-300"
                  : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-200"
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-1" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded-full ${meta.pill}`}>{meta.label}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 overflow-hidden">
          {/* Pattern row (solo al expandir) */}
          {isOpen && rec.patternRef ? (
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <Badge variant="outline" className="break-all">
                Pattern: {rec.patternRef}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenPattern(rec.patternRef!)}
                className="rounded-full shrink-0"
              >
                <Eye className="w-4 h-4 mr-1" /> View pattern
              </Button>
            </div>
          ) : null}

          {/* WHY preview */}
          {preview ? (
            <div className="relative">
              <div className="text-sm text-muted-foreground max-h-14 overflow-hidden pr-2">
                <span className="break-words">{preview}</span>
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
            </div>
          ) : null}

          {/* Toggle details */}
          <button
            onClick={() => onToggleOpen(isOpen ? null : rec.id)}
            className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            {isOpen ? "Hide details" : "View details"}
          </button>

          {isOpen ? (
            <div className="space-y-3 min-w-0">
              {rec.platform ? (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Platform:</span> {rec.platform}
                </div>
              ) : null}
              {rec.evaType ? (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">EVA:</span> {rec.evaType}
                </div>
              ) : null}
              {rec.audience ? (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Audience:</span> {rec.audience}
                </div>
              ) : null}
              {rec.recommendation.how ? (
                <div className="rounded-md bg-slate-50 border border-transparent border-l-4 pl-3 pr-2 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide mr-2">HOW</span>
                  <span className="text-sm break-words">{rec.recommendation.how}</span>
                </div>
              ) : null}

              {rec.recommendation.why ? (
                <div className="rounded-md bg-slate-50 border border-transparent border-l-4 pl-3 pr-2 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide mr-2">WHY</span>
                  <span className="text-sm break-words">{rec.recommendation.why}</span>
                </div>
              ) : null}
              {Array.isArray(rec.sources) && rec.sources.length > 0 ? (
                <div className="text-sm">
                  <div className="font-medium mb-1">Sources</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {rec.sources.slice(0, 4).map((s, i) => (
                      <li key={i} className="break-words">
                        {s.title} {s.venue ? `— ${s.venue}` : ""}
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 underline break-all ml-1"
                          >
                            <LinkIcon className="w-3 h-3" /> link
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* -------- Selected Panel (desktop + mobile flyout reuse) -------- */
type SelectedPanelProps = {
  items: Rec[];
  onRemove: (id: string) => void;
  onClear: () => void;
  patternIndex: Map<string, PatternWithType>;
  patternByTitleLC: Map<string, PatternWithType>;
};

function SelectedPanel({
  items,
  onRemove,
  onClear,
  patternIndex,
  patternByTitleLC,
}: SelectedPanelProps) {
  const [copied, setCopied] = useState<"json" | "md" | null>(null);
  const [exporting, setExporting] = useState(false);
  const [detail, setDetail] = useState<Rec | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Colores por tipo de patrón (UI / Instructional / Pedagogical)
  const PATTERN_COLORS = {
    ui:            { cssBorder: "border-emerald-400",  pdfRGB: [16, 185, 129]  as [number, number, number] },
    instructional: { cssBorder: "border-violet-400",   pdfRGB: [139, 92, 246]  as [number, number, number] },
    pedagogical:   { cssBorder: "border-sky-400",      pdfRGB: [56, 189, 248]  as [number, number, number] },
    none:          { cssBorder: "border-zinc-300",     pdfRGB: [156, 163, 175] as [number, number, number] },
  } as const;

  // Helper: tipo de patrón de una recomendación
  const getPatternType = (r: Rec): "ui" | "instructional" | "pedagogical" | "none" => {
    const raw = (r.patternRef ?? "").trim().toLowerCase();
    if (!raw) return "none";
    const p =
      patternIndex.get(raw) ||
      patternIndex.get((r.patternRef ?? "").trim()) ||
      patternByTitleLC.get(raw);
    if (!p) return "none";
    return p.type ?? "none";
  };

  // ==== Export helpers ====
  const toJSON = useCallback(
    () =>
      JSON.stringify(
        items.map((r) => ({
          id: r.id,
          section: (sourceLabels[r.sourceName] ?? sourceLabels.default).label,
          title: r.recommendation.title,
          pattern: r.patternRef,
          platform: r.platform,
          evaType: r.evaType,
          audience: r.audience,
          how: r.recommendation.how,
          why: r.recommendation.why,
          sources:
            r.sources?.map((s) => ({ title: s.title, venue: s.venue, url: s.url })) ?? [],
        })),
        null,
        2
      ),
    [items]
  );

  const toMarkdown = useCallback(() => {
    const lines: string[] = [];
    lines.push(`# Selected recommendations (${items.length})`);
    for (const r of items) {
      lines.push(`\n## ${r.recommendation.title}`);
      const meta = [
        r.patternRef ? `Pattern: ${r.patternRef}` : "",
        r.platform ? `Platform: ${r.platform}` : "",
        r.evaType ? `EVA: ${r.evaType}` : "",
        r.audience ? `Audience: ${r.audience}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      if (meta) lines.push(meta);
      if (r.recommendation.how) lines.push(`**How**: ${r.recommendation.how}`);
      if (r.recommendation.why) lines.push(`**Why**: ${r.recommendation.why}`);
      if (r.sources?.length) {
        lines.push("**Sources**:");
        for (const s of r.sources.slice(0, 4))
          lines.push(`- ${s.title}${s.venue ? ` — ${s.venue}` : ""}${s.url ? ` · ${s.url}` : ""}`);
      }
    }
    return lines.join("");
  }, [items]);

  function copy(text: string, kind: "json" | "md") {
    navigator.clipboard.writeText(text).then(() => setCopied(kind));
    setTimeout(() => setCopied(null), 1500);
  }

  // === Índices para referencias cruzadas (patterns -> recomendaciones) ===
  const indexById = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((r, i) => m.set(r.id, i + 1));
    return m;
  }, [items]);

  const matchPattern = (r: Rec, p: PatternWithType) => {
    const ref = (r.patternRef ?? "").trim().toLowerCase();
    if (!ref) return false;
    if (ref === (p.id ?? "").toLowerCase()) return true;
    const titleLC = (p.title ?? "").toLowerCase();
    return !!titleLC && ref === titleLC;
  };

  const assoc = useMemo(() => {
    const out: AssocMaps = { ui: new Map(), instructional: new Map(), pedagogical: new Map() };
    for (const r of items) {
      const raw = (r.patternRef ?? "").trim();
      if (!raw) continue;
      const lc = raw.toLowerCase();
      let p = patternIndex.get(raw) || patternIndex.get(lc) || patternByTitleLC.get(lc);
      if (p) out[p.type].set(p.id, p);
    }
    return out;
  }, [items, patternIndex, patternByTitleLC]);

  const referencedBy = useMemo(() => {
    const m = new Map<string, number[]>(); // patternId -> [idx...]
    const all = [
      ...Array.from(assoc.ui.values()),
      ...Array.from(assoc.instructional.values()),
      ...Array.from(assoc.pedagogical.values()),
    ];
    for (const p of all) {
      const arr: number[] = [];
      items.forEach((r, i) => {
        if (matchPattern(r, p)) arr.push(i + 1);
      });
      m.set(p.id, arr);
    }
    return m;
  }, [assoc, items]);

  // ===== PDF: helpers (envolver tokens y links azules subrayados) =====
  const wrapLongTokens = (text: string, chunk = 34) =>
    text
      .split(/\s+/)
      .map((tok) => (tok.length > chunk ? tok.match(new RegExp(`.{1,${chunk}}`, "g"))!.join(" ") : tok))
      .join(" ");
  const normLine = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim();
  const host = (u?: string) => {
    try {
      return u ? new URL(u).hostname.replace(/^www\./, "") : "";
    } catch {
      return "link";
    }
  };

// ======== REEMPLAZO COMPLETO DE handleExportPDF EN SelectedPanel ========
// === REEMPLAZO COMPLETO DE handleExportPDF (con HOW/WHY callouts) ===
const handleExportPDF = async () => {
  if (!items.length) return;
  setExporting(true);
  // cierra el modal de detalles si estuviera abierto (evita solapes en capturas DOM antiguas)
  setDetail?.(null);
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  const node = pdfRef.current as HTMLElement | null;
  if (node) node.classList.add("print-safe");
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  try {
    const { default: JsPDF } = (await import("jspdf/dist/jspdf.umd.min.js")) as {
      default: typeof import("jspdf").jsPDF;
    };
    const doc = new JsPDF({ unit: "pt", format: "a4" });

    // ---------- helpers locales (auto-contenidos) ----------
    const wrapLongTokens = (text: string, chunk = 34) =>
      (text ?? "")
        .split(/\s+/)
        .map((tok) => (tok.length > chunk ? tok.match(new RegExp(`.{1,${chunk}}`, "g"))!.join(" ") : tok))
        .join(" ");
    const normLine = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim();
    const host = (u?: string) => {
      try {
        return u ? new URL(u).hostname.replace(/^www\./, "") : "";
      } catch {
        return "link";
      }
    };

    // Colores por tipo (locales al PDF)
    const COLOR_RGB = {
      ui:            [16, 185, 129] as [number, number, number],   // emerald-500 aprox.
      instructional: [139, 92, 246] as [number, number, number],   // violet-500
      pedagogical:   [56, 189, 248] as [number, number, number],   // sky-400
      none:          [156, 163, 175] as [number, number, number],  // zinc-400
    };
    const CALLOUT = { PADY: 6, LEFT: 10 }; // padding vertical y sangría de contenido
    const CALLOUT_BG = [248, 250, 252] as [number, number, number]; // slate-50

    // ---------- layout ----------
    const M = 56;
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const CW = W - 2 * M;

    const FS = { cover: 22, header: 14, title: 12, meta: 10, body: 10, small: 9 };
    const LH = { title: 18, meta: 13, body: 13 };
    const GAP = { afterItem: 12, afterBlock: 8 };
    const PAD = { boxTop: 10, boxBottom: 10 };
    const SG = { beforeHow: 6, betweenHowWhy: 6, beforeSources: 6 };



    const addHeader = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(FS.header);
      doc.text(title, M, M - 8);
      doc.setLineWidth(0.5);
      doc.line(M, M, W - M, M);
    };
    let y = M + 84;
    let currentTitle = "";
    const newPage = (title: string) => {
      doc.addPage();
      y = M + 10;
      addHeader(title);
      y += 10;
    };
    const room = () => H - M - y;

    // writers sin salto (se usan dentro de marcos ya medidos)
    const writeLinesNoBreak = (
      lines: string[],
      fs: number,
      lh: number,
      indent = 0,
      font: "normal" | "bold" | "italic" = "normal",
      color?: [number, number, number]
    ) => {
      if (!lines.length) return;
      doc.setFont("helvetica", font);
      doc.setFontSize(fs);
      if (color) doc.setTextColor(...color);
      for (const line of lines) {
        doc.text(line, M + indent, y);
        y += lh;
      }
      if (color) doc.setTextColor(0, 0, 0);
    };

    const linkInlineNoBreak = (label: string, url: string, fs = FS.body, indent = 0) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fs);
      doc.setTextColor(0, 102, 204);
      const x = M + indent;
      const wtxt = doc.getTextWidth(label);
      doc.text(label, x, y);
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(x, y + 1.2, x + wtxt, y + 1.2);
      (doc as any).link(x, y - fs, Math.max(wtxt, 24), fs + 4, { url });
      doc.setTextColor(0, 0, 0);
      y += LH.body;
    };

    // medir y dibujar callout HOW/WHY
    const drawCallout = (
      label: "HOW" | "WHY",
      color: [number, number, number],
      lines: string[],
      blockH: number
    ) => {
      if (!lines.length) return;
      // fondo y barra izquierda
      doc.setFillColor(...CALLOUT_BG);
      doc.roundedRect(M, y - 6, CW, blockH, 4, 4, "F");
      doc.setFillColor(...color);
      doc.rect(M, y - 6, 4, blockH, "F");

      // chip + texto
      y += CALLOUT.PADY;
      writeLinesNoBreak([label], FS.meta, LH.meta, CALLOUT.LEFT, "bold");
      if (lines.length) {
        writeLinesNoBreak(lines, FS.body, LH.body, CALLOUT.LEFT);
      }
      y += CALLOUT.PADY;
    };

    // medir recomendación (con callouts)
    const measureRecommendation = (r: Rec) => {
      const titleLines = doc.splitTextToSize(wrapLongTokens(r.recommendation.title), CW);

      const metaParts: string[] = [];
      if (r.patternRef) metaParts.push(`Pattern: ${r.patternRef}`);
      if (r.platform) metaParts.push(`Platform: ${r.platform}`);
      if (r.evaType) metaParts.push(`EVA: ${r.evaType}`);
      if (r.audience) metaParts.push(`Audience: ${r.audience}`);
      const metaLines = metaParts.length
        ? doc.splitTextToSize(wrapLongTokens(metaParts.join("  ·  ")), CW)
        : [];

      const howText = normLine(r.recommendation.how ?? "");
      const whyText = normLine(r.recommendation.why ?? "");
      const howLines = howText ? doc.splitTextToSize(wrapLongTokens(howText), CW - (CALLOUT.LEFT + 6)) : [];
      const whyLines = whyText ? doc.splitTextToSize(wrapLongTokens(whyText), CW - (CALLOUT.LEFT + 6)) : [];

      const howInner = howLines.length ? (LH.meta + howLines.length * LH.body) : 0;
      const whyInner = whyLines.length ? (LH.meta + whyLines.length * LH.body) : 0;
      const howBlockH = howInner ? (CALLOUT.PADY * 2 + howInner) : 0;
      const whyBlockH = whyInner ? (CALLOUT.PADY * 2 + whyInner) : 0;

      const src = (r.sources ?? []).slice(0, 6);
      let srcLineCount = 0;
      if (src.length) {
        srcLineCount += 1; // "Sources:"
        for (const s of src) {
          const bullet = `• ${s.title ?? ""}${s.venue ? ` — ${s.venue}` : ""}`.trim();
          srcLineCount += doc.splitTextToSize(wrapLongTokens(bullet), CW - 16).length;
          if (s.url) srcLineCount += 1; // host(url)
        }
      }

      const hasHow = !!howBlockH;
      const hasWhy = !!whyBlockH;
      const hasSrc = (r.sources ?? []).slice(0, 6).length > 0;

      const contentHeight =
        titleLines.length * LH.title +
        metaLines.length * LH.meta +
        (hasHow ? SG.beforeHow : 0) + howBlockH +
        (hasWhy ? SG.betweenHowWhy : 0) + whyBlockH +
        (hasSrc ? SG.beforeSources : 0) +
        srcLineCount * LH.body;


      const totalHeight = PAD.boxTop + contentHeight + PAD.boxBottom + GAP.afterItem + 12; // + borde

      return { titleLines, metaLines, howLines, whyLines, howBlockH, whyBlockH, src, totalHeight };
    };

    // determinar tipo de patrón por recomendación (id/título)
    const typeForRec = (r: Rec): keyof typeof COLOR_RGB => {
      const raw = (r.patternRef ?? "").trim().toLowerCase();
      if (!raw) return "none";
      const p =
        patternIndex.get(raw) ||
        patternIndex.get((r.patternRef ?? "").trim()) ||
        patternByTitleLC.get(raw);
      return (p?.type as any) ?? "none";
    };

    // medir patrón (para "Associated patterns")
    const measurePattern = (p: PatternWithType, refs: number[]) => {
      const headLines = doc.splitTextToSize(wrapLongTokens(`${p.title || p.id}`), CW - 12);
      const refsLines = refs.length
        ? doc.splitTextToSize(`Referenced by: #${refs.join(", #")}`, CW - 12)
        : [];
      const descLines = p.description
        ? doc.splitTextToSize(wrapLongTokens(p.description), CW - 12)
        : [];
      const ps = (p.sources ?? []).slice(0, 4);

      let srcLineCount = 0;
      if (ps.length) {
        srcLineCount += 1; // "Sources:"
        for (const s of ps) {
          const bullet = `• ${s.title ?? ""}`.trim();
          srcLineCount += doc.splitTextToSize(wrapLongTokens(bullet), CW - 28).length;
          if (s.url) srcLineCount += 1;
        }
      }

      const contentHeight =
        headLines.length * LH.meta +
        refsLines.length * LH.meta +
        descLines.length * LH.body +
        srcLineCount * LH.body;

      const totalHeight = PAD.boxTop + contentHeight + PAD.boxBottom + GAP.afterBlock + 12;

      return { headLines, refsLines, descLines, ps, totalHeight };
    };

    // dibujar marco no-breakeable
    const drawFramed = (
      colorRGB: [number, number, number],
      totalHeight: number,
      drawContent: () => void
    ) => {
      if (room() < totalHeight) newPage(currentTitle);
      const top = y;
      doc.setDrawColor(...colorRGB);
      doc.setLineWidth(1);
      doc.roundedRect(M - 4, top - 6, CW + 8, totalHeight - GAP.afterItem, 6, 6, "S");
      y = top + PAD.boxTop; // padding top
      drawContent();
      y = top + totalHeight; // saltamos al final del marco
    };

    // ========= portada =========
    const now = new Date();
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const nowLabel = now.toLocaleString();
    const fileDate = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}_${pad2(
      now.getHours()
    )}-${pad2(now.getMinutes())}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(FS.cover);
    doc.text("UX Recommendations Report", M, 140);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FS.meta);
    doc.text("Project: UX Educational Platform", M, 170);
    doc.text("Author: Cristian Bustamante", M, 186);
    doc.text(`Exported: ${nowLabel}`, M, 202);
    doc.setFontSize(FS.small);
    doc.text(
      "This report includes selected UX recommendations (with references) and associated patterns grouped by category.",
      M,
      230
    );

    // ========= recomendaciones =========
    currentTitle = `Selected recommendations (with references) — ${items.length}`;
    newPage(currentTitle);

    items.forEach((r, idx) => {
      const measured = measureRecommendation(r);
      const type = typeForRec(r);
      const color = COLOR_RGB[type];

      drawFramed(color, measured.totalHeight, () => {
        // título numerado
        writeLinesNoBreak([`${idx + 1}. ${measured.titleLines[0]}`], FS.title, LH.title, 0, "bold");
        if (measured.titleLines.length > 1) {
          writeLinesNoBreak(measured.titleLines.slice(1), FS.title, LH.title);
        }
        // meta
        if (measured.metaLines.length) {
          writeLinesNoBreak(measured.metaLines, FS.meta, LH.meta);
        }
        // HOW (callout) con separación previa
        if (measured.howLines.length) {
          y += SG.beforeHow;
          drawCallout("HOW", color, measured.howLines, measured.howBlockH);
        }

        // WHY (callout) con separación respecto de HOW
        if (measured.whyLines.length) {
          y += SG.betweenHowWhy;
          drawCallout("WHY", color, measured.whyLines, measured.whyBlockH);
        }

        // SOURCES con separación previa
        if (measured.src.length) {
          y += SG.beforeSources;
          writeLinesNoBreak(["Sources:"], FS.body, LH.body);
          for (const s of measured.src) {
            const bullet = `• ${s.title ?? ""}${s.venue ? ` — ${s.venue}` : ""}`.trim();
            const L = doc.splitTextToSize(wrapLongTokens(bullet), CW - 16);
            writeLinesNoBreak(L, FS.body, LH.body, 16);
            if (s.url) linkInlineNoBreak(host(s.url), s.url, FS.body, 28);
          }
        }
      });
    });

    // ========= associated patterns =========
    // reconstruimos assoc y referencedBy localmente (auto-contenido)
    const assocLocal: AssocMaps = { ui: new Map(), instructional: new Map(), pedagogical: new Map() };
    const patternByIdOrTitle = (key: string) =>
      patternIndex.get(key) || patternIndex.get(key.toLowerCase()) || patternByTitleLC.get(key.toLowerCase());

    items.forEach((r) => {
      const ref = (r.patternRef ?? "").trim();
      if (!ref) return;
      const p = patternByIdOrTitle(ref);
      if (p) assocLocal[p.type].set(p.id, p);
    });

    const referencedBy = new Map<string, number[]>(); // patternId -> [#rec...]
    const allP = [
      ...Array.from(assocLocal.ui.values()),
      ...Array.from(assocLocal.instructional.values()),
      ...Array.from(assocLocal.pedagogical.values()),
    ];
    allP.forEach((p) => {
      const arr: number[] = [];
      items.forEach((r, i) => {
        const ref = (r.patternRef ?? "").trim().toLowerCase();
        if (!ref) return;
        if (ref === (p.id ?? "").toLowerCase() || ref === (p.title ?? "").toLowerCase()) arr.push(i + 1);
      });
      referencedBy.set(p.id, arr);
    });

    currentTitle = "Associated patterns (by category)";
    newPage(currentTitle);
    y += 6; // respiro

    const renderCat = (
      label: "UI" | "Instructional" | "Pedagogical",
      arr: PatternWithType[],
      color: [number, number, number]
    ) => {
      // título de categoría (en color)
      writeLinesNoBreak([label], FS.title, LH.title, 0, "bold", color);
      y += 8;

      if (!arr.length) {
        writeLinesNoBreak(["—"], FS.body, LH.body, 12);
        y += GAP.afterBlock;
        return;
      }

      arr.forEach((p) => {
        const measure = measurePattern(p, referencedBy.get(p.id) ?? []);
        if (room() < measure.totalHeight) newPage(currentTitle);

        const top = y;
        doc.setDrawColor(...color);
        doc.setLineWidth(1);
        doc.roundedRect(M - 4, top - 6, CW + 8, measure.totalHeight - GAP.afterBlock, 6, 6, "S");
        y = top + PAD.boxTop;

        writeLinesNoBreak(measure.headLines, FS.meta, LH.meta, 12, "bold");

        if (measure.refsLines.length) {
          writeLinesNoBreak(measure.refsLines, FS.small, LH.meta, 12);
        }
        if (measure.descLines.length) {
          writeLinesNoBreak(measure.descLines, FS.body, LH.body, 12);
        }
        if (measure.ps.length) {
          writeLinesNoBreak(["Sources:"], FS.body, LH.body, 12);
          for (const s of measure.ps) {
            const bullet = `• ${s.title ?? ""}`.trim();
            const L = doc.splitTextToSize(wrapLongTokens(bullet), CW - 28);
            writeLinesNoBreak(L, FS.body, LH.body, 28);
            if (s.url) linkInlineNoBreak(host(s.url), s.url, FS.body, 40);
          }
        }

        y = top + measure.totalHeight; // salto al final del marco
      });
    };

    renderCat("UI", Array.from(assocLocal.ui.values()), COLOR_RGB.ui);
    renderCat("Instructional", Array.from(assocLocal.instructional.values()), COLOR_RGB.instructional);
    renderCat("Pedagogical", Array.from(assocLocal.pedagogical.values()), COLOR_RGB.pedagogical);

    // ---------- footer páginas ----------
    const pages = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(FS.small);
      doc.text(`Page ${i} / ${pages}`, W - M, doc.internal.pageSize.getHeight() - 18, { align: "right" });
    }

    doc.save(`UX-Recommendations_${fileDate}.pdf`);
  } finally {
    if (node) node.classList.remove("print-safe");
    setExporting(false);
  }
};



   // ====== UI (en pantalla) con marcos coloreados + botón Details + Remove a la derecha ======
  const grouped = useMemo(() => {
    const m = new Map<string, Rec[]>();
    for (const r of items) {
      const key = (sourceLabels[r.sourceName] ?? sourceLabels.default).label;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(r);
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  return (
    <>
      <Card className="max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-base">My selections ({items.length})</CardTitle>
          <CardDescription>Copy, clear, or export a PDF with references.</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => copy(toJSON(), "json")}>
              {copied === "json" ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              Copy JSON
            </Button>
            <Button size="sm" variant="secondary" onClick={() => copy(toMarkdown(), "md")}>
              {copied === "md" ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              Copy Markdown
            </Button>
            <Button size="sm" variant="destructive" onClick={onClear} disabled={!items.length}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
            <Button size="sm" onClick={handleExportPDF} disabled={!items.length || exporting}>
              <FileDown className="w-4 h-4 mr-1" /> {exporting ? "Exporting…" : "Export PDF"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-2 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations yet.</p>
          ) : (
            <div className="space-y-8">
              {/* ===== En pantalla: Selected recommendations (with references) ===== */}
              <section>
                <h3 className="text-sm font-semibold mb-2">
                  Selected recommendations (with references)
                </h3>

                <ol className="list-decimal pl-5 space-y-3">
                  {items.map((r, idx) => {
                    const type = getPatternType(r);
                    const borderCls = PATTERN_COLORS[type].cssBorder;
                    return (
                      <li key={r.id} className="text-sm">
                        <div className={`p-3 rounded border ${borderCls}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium break-words">{r.recommendation.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {r.patternRef ? (
                                  <>
                                    Pattern: <span className="font-mono">{r.patternRef}</span>
                                  </>
                                ) : null}
                                {r.platform ? <> · Platform: {r.platform}</> : null}
                                {r.evaType ? <> · EVA: {r.evaType}</> : null}
                                {r.audience ? <> · Audience: {r.audience}</> : null}
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDetail(r)}
                                className="rounded-full"
                                title="View details"
                              >
                                <Eye className="w-4 h-4 mr-1" /> Details
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onRemove(r.id)}
                                aria-label="Remove"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* nodo para estilos print-safe si hiciera falta */}
                <div ref={pdfRef} className="hidden" />
              </section>

              {/* ===== En pantalla: Associated patterns (by category) con colores ===== */}
              <section>
                <h3 className="text-sm font-semibold mb-2">Associated patterns (by category)</h3>

                {(["ui", "instructional", "pedagogical"] as const).map((cat) => {
                  const arr = Array.from(assoc[cat].values());
                  const label = cat === "ui" ? "UI" : cat[0].toUpperCase() + cat.slice(1);
                  const borderCls = PATTERN_COLORS[cat].cssBorder;

                  return (
                    <div key={cat} className={`border rounded p-3 mb-3 ${borderCls}`}>
                      <div className="font-semibold mb-2">{label}</div>
                      {arr.length === 0 ? (
                        <div className="text-xs text-muted-foreground">—</div>
                      ) : (
                        <div className="space-y-2">
                          {arr.map((p) => {
                            const refs = referencedBy.get(p.id) ?? [];
                            return (
                              <div key={p.id} className="rounded">
                                <div className="text-sm font-medium break-words">
                                  {p.title || p.id}
                                </div>
                                {refs.length ? (
                                  <div className="text-[11px] text-muted-foreground mb-1">
                                    Referenced by:{" "}
                                    {refs.map((n) => (
                                      <span
                                        key={n}
                                        className="inline-block rounded px-1 py-0.5 border mr-1"
                                      >
                                        #{n}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                                {p.description ? (
                                  <div className="text-xs text-muted-foreground break-words">
                                    {p.description}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Modal de detalles ===== */}
     {/* ===== Modal de detalles ===== */}
    <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="break-words">{detail?.recommendation.title}</DialogTitle>
          <DialogDescription>
            {detail?.patternRef ? (
              <>
                Pattern: <span className="font-mono">{detail.patternRef}</span>
              </>
            ) : (
              "—"
            )}
            {detail?.platform ? <> · Platform: {detail.platform}</> : null}
            {detail?.evaType ? <> · EVA: {detail.evaType}</> : null}
            {detail?.audience ? <> · Audience: {detail.audience}</> : null}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {(() => {
            // Usa tu helper existente; si no lo tienes dentro de SelectedPanel, pégalo ahí mismo:
            // const getPatternType = (r: Rec): "ui" | "instructional" | "pedagogical" | "none" => { ... }
            const t = detail ? getPatternType(detail) : "none";
            const borderMap: Record<string, string> = {
              ui: "border-emerald-400",
              instructional: "border-violet-400",
              pedagogical: "border-sky-400",
              none: "border-zinc-300",
            };
            const borderCls = borderMap[t] ?? "border-zinc-300";

            return (
              <>
                {detail?.recommendation.how ? (
                  <div
                    className={`rounded-md bg-slate-50 border border-transparent border-l-4 ${borderCls} pl-3 pr-2 py-2`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wide mr-2">HOW</span>
                    <span className="text-sm">{detail.recommendation.how}</span>
                  </div>
                ) : null}

                {detail?.recommendation.why ? (
                  <div
                    className={`rounded-md bg-slate-50 border border-transparent border-l-4 ${borderCls} pl-3 pr-2 py-2`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wide mr-2">WHY</span>
                    <span className="text-sm">{detail.recommendation.why}</span>
                  </div>
                ) : null}
              </>
            );
          })()}

          {Array.isArray(detail?.sources) && detail!.sources.length > 0 ? (
            <div className="text-sm">
              <div className="font-medium mb-1">Sources</div>
              <ul className="list-disc pl-5 space-y-1">
                {detail!.sources.slice(0, 6).map((s, i) => (
                  <li key={i} className="break-words">
                    {s.title} {s.venue ? `— ${s.venue}` : ""}
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 underline break-all ml-1"
                      >
                        link
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}


