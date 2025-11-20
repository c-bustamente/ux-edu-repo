/**
 * RecommendationGenerator.tsx — Enhanced v4
 * Fixes per request:
 * 1) "Add" button restored on each card header (small, rounded, pastel green).
 * 2) Pattern preview dialog can go **fullscreen** (toggle button). Larger default size too.
 * 3) Category Tabs are now **sticky** (top tabs & side tabs).
 * 4) The floating "Selected" button no longer overlaps tabs (tabs z-40; FAB z-30; extra bottom padding).
 * 5) Pattern badge row stays below header in full mode to avoid overflow; includes example if present.
 */

"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui (adjust paths if needed)
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
  evaType?: string; // may appear as eva_type/eva
  eva_type?: string;
  eva?: string;
  audience?: string;
  platform?: string;
  recommendation?: RecInner;
  recomendation?: RecInner; // ES key in some lists
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

type PatternWithType = PatternBase & {
  type: PatternCategory;
};

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

type Html2CanvasOptions = {
  scale?: number;
  useCORS?: boolean;
  backgroundColor?: string;
  windowWidth?: number;
};

type Html2CanvasFn = (el: HTMLElement, opts?: Html2CanvasOptions) => Promise<HTMLCanvasElement>;

/* ===================== Helpers ===================== */
const sourceLabels: Record<string, { label: string; border: string; pill: string }> = {
  PLATFORM_UI_COMBINED: { label: "Platform UI", border: "border-emerald-300", pill: "bg-emerald-100 text-emerald-800" },
  RECOMMENDATIONS_EVA: { label: "EVA Type", border: "border-violet-300", pill: "bg-violet-100 text-violet-800" },
  AUDIENCE_RECOMMENDATIONS: { label: "Audience", border: "border-sky-300", pill: "bg-sky-100 text-sky-800" },
  PLATFORM_MOBILE_UI_RECOMMENDATIONS: { label: "Platform UI", border: "border-emerald-300", pill: "bg-emerald-100 text-emerald-800" },
  PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS: { label: "Platform UI", border: "border-amber-300", pill: "bg-amber-100 text-amber-800" },
  default: { label: "Other", border: "border-zinc-300", pill: "bg-zinc-100 text-zinc-800" },
};
// Desktop column order: Platform → EVA → Audience
const COLUMN_ORDER = ["PLATFORM_UI_COMBINED", "RECOMMENDATIONS_EVA", "AUDIENCE_RECOMMENDATIONS"] as const;

const isBlank = (v?: string | null) => v == null || String(v).trim() === "";
function coalesceEvaType(it: RawItem) { return it.evaType ?? it.eva_type ?? it.eva ?? undefined; }
function uniqStrings(values: Array<string | undefined | null>) {
  const s = new Set<string>();
  for (const v of values) if (typeof v === "string" && v.trim()) s.add(v.trim());
  return Array.from(s);
}
function norm(s?: string) { return (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
// Treat missing value as wildcard → matches any selected facet
function matches(sel: string, val?: string) {
  if (!sel || sel === "all") return true;
  if (isBlank(val)) return true; // wildcard: items without this facet still pass
  const a = norm(sel), b = norm(val);
  return a === b || b.includes(a) || a.includes(b);
}
function compactURLs(sources?: SourceRef[]) { const out: string[] = []; if (!Array.isArray(sources)) return out; for (const s of sources) if (s?.url) out.push(s.url); return out; }
function firstLineOrSentence(s?: string) {
  if (!s) return "";
  const t = s.trim();
  const n = t.indexOf("");
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
function loadAll(): { recs: Rec[]; diag: Array<{ name: string; size: number }> } {
  const diag: Array<{ name: string; size: number }> = [];
  const recs: Rec[] = [];
  if (Array.isArray((recData as any).default)) {
    const arr = (recData as any).default as RawItem[];
    diag.push({ name: "default", size: arr.length });
    arr.forEach((it, i) => { const n = normalizeOne(it, i, "default"); if (n) recs.push(n); });
  }
  for (const [name, value] of Object.entries(recData)) {
    if (name === "default") continue;
    if (Array.isArray(value)) {
      const arr = value as RawItem[];
      diag.push({ name, size: arr.length });
      arr.forEach((it, i) => { const n = normalizeOne(it, i, name); if (n) recs.push(n); });
    }
  }
  return { recs, diag };
}

/* ===================== Component ===================== */
export default function RecommendationGenerator() {
  // Global print-safe CSS (for html2canvas)
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

  // Pattern index with category 'type'
 
const patternIndex = useMemo<Map<string, PatternWithType>>(() => {
  const m = new Map<string, PatternWithType>();
  const data = patterns as PatternRepoData;

  if (data.ui) {
    Object.keys(data.ui).forEach((subcat) => {
      const arr = data.ui?.[subcat] ?? [];
      arr.forEach((p) => {
        if (!p.id) return;
        m.set(p.id, { ...p, type: "ui" });
      });
    });
  }

  (data.instructional ?? []).forEach((p) => {
    if (!p.id) return;
    m.set(p.id, { ...p, type: "instructional" });
  });

  (data.pedagogical ?? []).forEach((p) => {
    if (!p.id) return;
    m.set(p.id, { ...p, type: "pedagogical" });
  });

  return m;
}, []);

  // Pattern preview dialog (modal to avoid scope issues) + fullscreen toggle
  const [previewPatternId, setPreviewPatternId] = useState<string | null>(null);
  const [patternFull, setPatternFull] = useState(false);
  const previewPattern = useMemo(
  () => (previewPatternId ? patternIndex.get(previewPatternId) ?? null : null),
  [previewPatternId, patternIndex]
);
  const openPattern = useCallback((id: string) => { setPreviewPatternId(id); setPatternFull(false); }, []);

  // Load data
  useEffect(() => { const { recs } = loadAll(); setAllRecs(recs); }, []);

  // Close expanded card on filter change
  useEffect(() => setOpenCardId(null), [q, platform, evaType, audience]);

  // Filter options
  const platforms = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.platform))], [allRecs]);
  const evaTypes = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.evaType))], [allRecs]);
  const audiences = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.audience))], [allRecs]);

  // Filtering (missing facets treated as wildcard)
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

  // Group into columns (merge platform arrays → PLATFORM_UI_COMBINED)
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

  // Mobile flyout state (non-modal)
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  // Mobile side tabs toggle
  const [sideTabs, setSideTabs] = useState(false);
  const [tab, setTab] = useState<string>("platform");

  // Arrays for category tabs
  const platformItems = grouped.groups.get("PLATFORM_UI_COMBINED") ?? [];
  const evaItems = grouped.groups.get("RECOMMENDATIONS_EVA") ?? [];
  const audienceItems = grouped.groups.get("AUDIENCE_RECOMMENDATIONS") ?? [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 pb-28">
      {/* Global print-safe CSS */}
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

      {/* Desktop layout: columns + selected panel (visible xl+) */}
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
          <SelectedPanel items={selectedList} onRemove={removeSelected} onClear={clearSelected} patternIndex={patternIndex} />
        </div>
      </div>

      {/* Mobile controls to switch to side tabs */}
      <div className="xl:hidden flex justify-center">
        {!sideTabs ? (
          <Button variant="outline" size="sm" onClick={() => setSideTabs(true)}>View recommendations</Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setSideTabs(false)}>Back</Button>
        )}
      </div>

      {/* Mobile Tabs (top or side) */}
      <div className="xl:hidden space-y-4">
        {!sideTabs ? (
          // Top tabs (default) — Sticky
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
          // Side tabs layout — Sticky left rail
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

      {/* Mobile FAB + non‑modal flyout (starts hidden; button always visible) */}
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
            {/* Close uses underscore symbol */}
            <Button size="sm" variant="ghost" onClick={() => setFlyoutOpen(false)} aria-label="Collapse" title="Collapse">_</Button>
          </div>
          <SelectedPanel items={selectedList} onRemove={removeSelected} onClear={clearSelected} patternIndex={patternIndex} />
        </div>
      </aside>

      {/* Pattern quick view dialog (modal, contained or fullscreen) */}
      <Dialog open={!!previewPattern} onOpenChange={(open) => { if (!open) { setPreviewPatternId(null); setPatternFull(false); } }}>
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
                <DialogTitle className="break-words">{previewPattern?.title || previewPattern?.id || "Pattern"}</DialogTitle>
                <DialogDescription>{previewPattern?.type ? String(previewPattern.type).toUpperCase() : ""}</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPatternFull((v) => !v)} aria-label={patternFull ? "Exit fullscreen" : "Fullscreen"}>
                {patternFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </DialogHeader>
          <div className={`space-y-3 ${patternFull ? "p-4 overflow-y-auto h-[calc(92vh-64px)]" : "p-4 overflow-y-auto"}`}>
            {previewPattern?.subcategory && (<div className="text-xs text-muted-foreground">Subcategory: {previewPattern.subcategory}</div>)}
            {previewPattern?.description && <p className="text-sm break-words">{previewPattern.description}</p>}
            {/* Example block */}
            {(() => {
              const ex = previewPattern && (previewPattern.example || previewPattern.exampleText);
              const img = previewPattern && (previewPattern.exampleImg || previewPattern.exampleImage);

              if (!ex && !img) return null;
              return (
                <div>
                  <div className="text-xs font-semibold mb-1">Example</div>
                  {typeof ex === "string" ? (
                    <div className="rounded border p-2 text-sm whitespace-pre-wrap break-words">{ex}</div>
                  ) : null}
                  {img ? (
                    <div className="mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Pattern example" className="max-h-72 w-auto rounded border" />
                    </div>
                  ) : null}
                </div>
              );
            })()}
            {!!(previewPattern?.tags?.length) && (
              <div className="flex flex-wrap gap-1">
                {previewPattern.tags.map((t: string) => (<Badge key={t} variant="outline">#{t}</Badge>))}
              </div>
            )}
            {!!(previewPattern?.sources?.length) && (
              <div>
                <div className="text-xs font-semibold mb-1">Sources</div>
                <ul className="list-disc pl-5 space-y-1">
                  {previewPattern.sources.slice(0, 5).map((s: SourceRef, i: number) => (
                    <li key={i} className="text-xs break-words">
                      {s.title}
                      {s.url ? (<><span> · </span><a href={s.url} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1 break-all">link <ExternalLink className="w-3 h-3" /></a></>) : null}
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
function MobileList({ items, openCardId, setOpenCardId, isSelected, toggleSelected, openPattern }: { items: Rec[]; openCardId: string | null; setOpenCardId: (id: string | null) => void; isSelected: (id: string) => boolean; toggleSelected: (r: Rec) => void; openPattern: (id: string) => void; }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">No recommendations for this category.</p>;
  return (
    <div className="flex flex-col gap-3">
      {items.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} isOpen={openCardId === rec.id} isSelected={isSelected(rec.id)} onToggleOpen={(id) => setOpenCardId(id === openCardId ? null : id)} onToggleSelect={toggleSelected} onOpenPattern={openPattern} />
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
        <div className="text-base font-semibold">{meta.label} <span className="text-xs text-muted-foreground">({name})</span></div>
      </div>
    </div>
  );
}

type CardProps = { rec: Rec; isOpen: boolean; isSelected: boolean; onToggleOpen: (id: string | null) => void; onToggleSelect: (rec: Rec) => void; onOpenPattern: (id: string) => void; };
function RecommendationCard({ rec, isOpen, isSelected, onToggleOpen, onToggleSelect, onOpenPattern }: CardProps) {
  const meta = sourceLabels[rec.sourceName] ?? sourceLabels.default;
  const preview = firstLineOrSentence(rec.recommendation.why);
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="min-w-0">
      <Card className={`flex flex-col border-2 ${meta.border} shadow-sm hover:shadow-md transition min-w-0`}>
        <CardHeader className="space-y-2">
          <div className="flex items-start gap-2 min-w-0">
            <CardTitle className="text-base leading-snug break-words flex-1 min-w-0">{rec.recommendation.title}</CardTitle>
            {/* Restored Add button */}
            <Button
              size="sm"
              onClick={() => onToggleSelect(rec)}
              className={`rounded-full text-xs shrink-0 ${
                isSelected
                  ? "bg-emerald-200 text-emerald-900 hover:bg-emerald-300 border border-emerald-300"
                  : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-200"
              }`}
            >
              {isSelected ? (<><Check className="w-4 h-4 mr-1" /> Added</>) : (<><Plus className="w-4 h-4 mr-1" /> Add</>)}
            </Button>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded-full ${meta.pill}`}>{meta.label}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 overflow-hidden">
          {/* Pattern row BELOW header and only in full mode */}
          {isOpen && rec.patternRef ? (
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <Badge variant="outline" className="break-all">Pattern: {rec.patternRef}</Badge>
              <Button size="sm" variant="outline" onClick={() => onOpenPattern(rec.patternRef!)} className="rounded-full shrink-0">
                <Eye className="w-4 h-4 mr-1" /> View pattern
              </Button>
            </div>
          ) : null}

          {/* WHY preview */}
          {preview ? (
            <div className="relative">
              <div className="text-sm text-muted-foreground max-h-14 overflow-hidden pr-2"><span className="break-words">{preview}</span></div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
            </div>
          ) : null}

          {/* Toggle details */}
          <button onClick={() => onToggleOpen(isOpen ? null : rec.id)} className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2"><ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />{isOpen ? "Hide details" : "View details"}</button>

          {isOpen ? (
            <div className="space-y-3 min-w-0">
              {rec.platform ? (<div className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Platform:</span> {rec.platform}</div>) : null}
              {rec.evaType ? (<div className="text-sm text-muted-foreground"><span className="font-medium text-foreground">EVA:</span> {rec.evaType}</div>) : null}
              {rec.audience ? (<div className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Audience:</span> {rec.audience}</div>) : null}
              {rec.recommendation.how ? (<div className="text-sm break-words"><span className="font-medium">How:</span> {rec.recommendation.how}</div>) : null}
              {rec.recommendation.why ? (<div className="text-sm break-words"><span className="font-medium">Why:</span> {rec.recommendation.why}</div>) : null}
              {Array.isArray(rec.sources) && rec.sources.length > 0 ? (
                <div className="text-sm">
                  <div className="font-medium mb-1">Sources</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {rec.sources.slice(0, 4).map((s, i) => (
                      <li key={i} className="break-words">{s.title} {s.venue ? `— ${s.venue}` : ""}{s.url ? (<a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline break-all ml-1"><LinkIcon className="w-3 h-3" /> link</a>) : null}</li>
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
};
function SelectedPanel({ items, onRemove, onClear, patternIndex }: SelectedPanelProps) {
  const [copied, setCopied] = useState<"json" | "md" | null>(null);
  const [exporting, setExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const toJSON = useCallback(() => JSON.stringify(items.map((r) => ({ id: r.id, section: (sourceLabels[r.sourceName] ?? sourceLabels.default).label, title: r.recommendation.title, pattern: r.patternRef, platform: r.platform, evaType: r.evaType, audience: r.audience, how: r.recommendation.how, why: r.recommendation.why, sources: r.sources?.map((s) => ({ title: s.title, venue: s.venue, url: s.url })) ?? [], })), null, 2), [items]);
  const toMarkdown = useCallback(() => { const lines: string[] = []; lines.push(`# Selected recommendations (${items.length})`); for (const r of items) { lines.push(`
## ${r.recommendation.title}`); const meta = [r.patternRef ? `Pattern: ${r.patternRef}` : "", r.platform ? `Platform: ${r.platform}` : "", r.evaType ? `EVA: ${r.evaType}` : "", r.audience ? `Audience: ${r.audience}` : ""].filter(Boolean).join(" · "); if (meta) lines.push(meta); if (r.recommendation.how) lines.push(`**How**: ${r.recommendation.how}`); if (r.recommendation.why) lines.push(`**Why**: ${r.recommendation.why}`); if (r.sources?.length) { lines.push("**Sources**:"); for (const s of r.sources.slice(0, 4)) lines.push(`- ${s.title}${s.venue ? ` — ${s.venue}` : ""}${s.url ? ` · ${s.url}` : ""}`); } } return lines.join(""); }, [items]);
  function copy(text: string, kind: "json" | "md") { navigator.clipboard.writeText(text).then(() => setCopied(kind)); setTimeout(() => setCopied(null), 1500); }

  // Associated patterns by category (for PDF)
const assoc: AssocMaps = useMemo(() => {
  const out: AssocMaps = {
    ui: new Map<string, PatternWithType>(),
    instructional: new Map<string, PatternWithType>(),
    pedagogical: new Map<string, PatternWithType>(),
  };

  for (const r of items) {
    const id = r.patternRef;
    if (!id) continue;

    const p = patternIndex.get(id);
    if (!p) continue;

    out[p.type].set(id, p);
  }

  return out;
}, [items, patternIndex]);


  const handleExportPDF = async () => {
    if (!pdfRef.current) return; setExporting(true); const node = pdfRef.current as HTMLElement; node.classList.add("print-safe"); await new Promise<void>((r) => requestAnimationFrame(() => r()));
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas: Html2CanvasFn = (await import("html2canvas")).default as Html2CanvasFn;
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: node.scrollWidth });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth; const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight; let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST"); heightLeft -= pageHeight;
      while (heightLeft > 0) { pdf.addPage(); position = -(imgHeight - heightLeft); pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST"); heightLeft -= pageHeight; }
      pdf.save("UX-Selections.pdf");
    } finally { node.classList.remove("print-safe"); setExporting(false); }
  };

  const grouped = useMemo(() => { const m = new Map<string, Rec[]>(); for (const r of items) { const key = (sourceLabels[r.sourceName] ?? sourceLabels.default).label; if (!m.has(key)) m.set(key, []); m.get(key)!.push(r); } return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0])); }, [items]);

  return (
    <Card className="max-h-[80vh] overflow-hidden flex flex-col">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-base">My selections ({items.length})</CardTitle>
        <CardDescription>Copy, clear, or export a PDF with references.</CardDescription>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => copy(toJSON(), "json")}>{copied === "json" ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />} Copy JSON</Button>
          <Button size="sm" variant="secondary" onClick={() => copy(toMarkdown(), "md")}>{copied === "md" ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />} Copy Markdown</Button>
          <Button size="sm" variant="destructive" onClick={onClear} disabled={!items.length}><Trash2 className="w-4 h-4 mr-1" /> Clear</Button>
          <Button size="sm" variant="default" onClick={handleExportPDF} disabled={!items.length || exporting}><FileDown className="w-4 h-4 mr-1" /> {exporting ? "Exporting…" : "Export PDF"}</Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations yet.</p>
        ) : (
          <>
            {/* ===== PDF content (hidden container to capture cleanly) ===== */}
            <div ref={pdfRef} className="space-y-10 p-2">
              <section className="space-y-2">
                <h3 className="text-base font-semibold">Selected recommendations (with references)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {items.map((r) => (
                    <li key={r.id} className="text-sm">
                      <div className="font-medium break-words">{r.recommendation.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {r.patternRef ? (<>Pattern: <span className="font-mono">{r.patternRef}</span></>) : null}
                        {r.platform ? <> · Platform: {r.platform}</> : null}
                        {r.evaType ? <> · EVA: {r.evaType}</> : null}
                        {r.audience ? <> · Audience: {r.audience}</> : null}
                      </div>
                      {Array.isArray(r.sources) && r.sources.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {r.sources.slice(0, 6).map((s, i) => (<li key={i} className="text-xs break-words">{s.title}{s.venue ? ` — ${s.venue}` : ""}{s.url ? ` · ${s.url}` : ""}</li>))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold">Associated patterns (by category)</h3>
                <div className="space-y-3">
                 {(["ui", "instructional", "pedagogical"] as const).map((cat) => {
                    const arr: PatternWithType[] = Array.from(assoc[cat].values());
                    const label = cat === "ui" ? "UI" : cat[0].toUpperCase() + cat.slice(1);

                    return (
                      <div key={cat} className="border rounded p-3">
                        <div className="font-semibold mb-2">{label}</div>
                        {arr.length === 0 ? (
                          <div className="text-xs text-muted-foreground">—</div>
                        ) : (
                          <div className="space-y-2">
                            {arr.map((p) => (
                              <div key={p.id}>
                                <div className="text-sm font-medium break-words">{p.title || p.id}</div>
                                {p.description ? (
                                  <div className="text-xs text-muted-foreground break-words">
                                    {p.description}
                                  </div>
                                ) : null}

                                {Array.isArray(p.sources) && p.sources.length > 0 ? (
                                  <ul className="list-disc pl-5 mt-1">
                                    {p.sources.slice(0, 6).map((s: SourceRef, i: number) => (
                                      <li key={i} className="text-xs break-words">
                                        {s.title}
                                        {s.url ? ` · ${s.url}` : ""}
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              </section>
            </div>

            {/* ===== On-screen list (interactive) ===== */}
            {grouped.map(([section, arr]) => (
              <div key={section} className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">{section}</div>
                <div className="flex flex-col gap-2">
                  {arr.map((r) => (
                    <div key={r.id} className="p-2 rounded border flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium break-words">{r.recommendation.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.patternRef ? (<>Pattern: <span className="font-mono">{r.patternRef}</span></>) : null}
                          {r.platform ? <> · Platform: {r.platform}</> : null}
                          {r.evaType ? <> · EVA: {r.evaType}</> : null}
                          {r.audience ? <> · Audience: {r.audience}</> : null}
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0" onClick={() => onRemove(r.id)} aria-label="Remove"><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
