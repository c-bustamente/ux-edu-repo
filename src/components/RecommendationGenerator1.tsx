/**
 * RecommendationGenerator.tsx — columnas por campo con fusión de Platform, dropdown por card,
 * preview con fading, headers sticky y scroll por columna. Case-insensitive + soft-AND.
 */

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui (ajusta si tus rutas difieren)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { Link as LinkIcon, Search, Filter, AlertTriangle, ChevronDown, Columns } from "lucide-react";

// ⚠️ Ajusta esta ruta si es necesario
import * as recData from "./recomendacionesEnglish";

/* ===================== Tipos ===================== */
type SourceRef = {
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
  status?: string;
  patternRef?: string;
  evaType?: string; eva_type?: string; eva?: string;
  audience?: string;
  platform?: string;
  recommendation?: RecInner;
  recomendation?: RecInner;
  sources?: SourceRef[];
  tags?: string[];
};

type Rec = {
  id: string;
  patternRef?: string;
  evaType?: string;
  audience?: string;
  platform?: string;
  recommendation: { title: string; how?: string; why?: string };
  sources: SourceRef[];
  sourceName: string; // nombre del array de origen
};

/* ===================== Helpers ===================== */
const sourceLabels: Record<string, { label: string; border: string }> = {
  AUDIENCE_RECOMMENDATIONS: { label: "Audience", border: "border-sky-300" },
  PLATFORM_MOBILE_UI_RECOMMENDATIONS: { label: "Platform UI", border: "border-emerald-300" },
  PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS: { label: "Platform UI", border: "border-amber-300" },
  PLATFORM_UI_COMBINED: { label: "Platform UI", border: "border-emerald-300" }, // columna fusionada
  RECOMMENDATIONS_EVA: { label: "EVA Type", border: "border-violet-300" },
  default: { label: "Other", border: "border-zinc-300" },
};

const COLUMN_ORDER = [
  "AUDIENCE_RECOMMENDATIONS",
  "PLATFORM_UI_COMBINED", // 👈 siempre una sola columna Platform si filtro = all
  "RECOMMENDATIONS_EVA",
];

function coalesceEvaType(it: RawItem) {
  return it.evaType ?? it.eva_type ?? it.eva ?? undefined;
}
function uniqStrings(values: Array<string | undefined | null>): string[] {
  const s = new Set<string>();
  for (const v of values) if (typeof v === "string" && v.trim()) s.add(v.trim());
  return Array.from(s);
}
function normToken(v?: string) {
  if (!v) return "";
  return v.toString().trim().toLowerCase().replace(/[\s\-_]/g, "");
}
function compactURLs(sources?: SourceRef[]) {
  if (!Array.isArray(sources)) return [];
  const out: string[] = [];
  for (const s of sources) if (s?.url && typeof s.url === "string") out.push(s.url);
  return out;
}
function prettyURL(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, "");
    const shortPath = path.length > 18 ? path.slice(0, 18) + "…" : path;
    return `${u.host}${shortPath}${u.search ? "?" : ""}`;
  } catch {
    return url.length > 26 ? url.slice(0, 26) + "…" : url;
  }
}
function firstLineOrSentence(text?: string) {
  if (!text) return "";
  const byNewline = text.split(/\r?\n/)[0];
  const m = byNewline.match(/(.+?[.!?])(\s|$)/);
  return (m ? m[1] : byNewline).slice(0, 160); // recorte amistoso
}

/* ===================== Normalización y carga ===================== */
function normalizeOne(item: RawItem, idx: number, sourceName: string): Rec | null {
  const r = (item.recommendation ?? item.recomendation ?? {}) as Partial<RecInner>;
  const id = item.inputID ?? (item.patternRef ? `${item.patternRef}-${idx}` : `rec-${sourceName}-${idx}`);
  return {
    id,
    patternRef: item.patternRef,
    evaType: coalesceEvaType(item),
    audience: item.audience,
    platform: item.platform,
    recommendation: { title: r.title ?? "Recommendation", how: r.how, why: r.why },
    sources: Array.isArray(item.sources) ? item.sources : [],
    sourceName,
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

/* ===================== Subcomponentes UI ===================== */
function SourcesList({ sources }: { sources: SourceRef[] }) {
  const urls = compactURLs(sources);
  if (urls.length === 0) return null;
  return (
    <div className="mt-1 space-y-1">
      <div className="text-xs font-medium">Sources</div>
      <ul className="pl-4 space-y-1">
        {urls.map((u, i) => (
          <li key={i} className="text-xs">
            <a
              href={u}
              target="_blank"
              rel="noreferrer"
              title={u}
              className="inline-flex items-center gap-1 underline underline-offset-2 break-all"
            >
              <LinkIcon className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[18rem]">{prettyURL(u)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  onToggle: (id: string) => void;
};
function RecommendationCard({ rec, isOpen, onToggle }: CardProps) {
  const meta = sourceLabels[rec.sourceName] ?? sourceLabels.default;
  const preview = firstLineOrSentence(rec.recommendation.why);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
    >
      <Card className={`flex flex-col border-2 ${meta.border} shadow-sm hover:shadow-md transition`}>
        <CardHeader className="space-y-2">
          <CardTitle className="text-base leading-snug break-words">{rec.recommendation.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{meta.label}</Badge>
            {rec.patternRef && <Badge variant="outline">Pattern: {rec.patternRef}</Badge>}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Preview WHY con fading */}
          {preview && (
            <div className="relative">
              <div className="text-sm text-muted-foreground max-h-14 overflow-hidden pr-2">
                {preview}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
            </div>
          )}

          {/* Toggle detalles (solo esta card) */}
          <button
            onClick={() => onToggle(rec.id)}
            className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            {isOpen ? "Ocultar detalles" : "Ver detalles"}
          </button>

          {isOpen && (
            <div className="space-y-3">
              {rec.platform && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Platform:</span> {rec.platform}
                </div>
              )}
              {rec.evaType && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">EVA:</span> {rec.evaType}
                </div>
              )}
              {rec.audience && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Audience:</span> {rec.audience}
                </div>
              )}

              {rec.recommendation.how && (
                <div>
                  <div className="text-sm font-semibold mb-0.5">How</div>
                  <p className="text-sm text-muted-foreground break-words">{rec.recommendation.how}</p>
                </div>
              )}
              {rec.recommendation.why && (
                <div>
                  <div className="text-sm font-semibold mb-0.5">Why</div>
                  <p className="text-sm text-muted-foreground break-words">{rec.recommendation.why}</p>
                </div>
              )}
              <SourcesList sources={rec.sources} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ===================== Componente principal ===================== */
export default function RecommendationGenerator() {
  // Datos + diagnóstico
  const [allRecs, setAllRecs] = useState<Rec[]>([]);
  const [diag, setDiag] = useState<Array<{ name: string; size: number }>>([]);

  // Filtros
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string>("all");          // all | mobile | web-responsive
  const [evaType, setEvaType] = useState<string>("all");
  const [audience, setAudience] = useState<string>("all");

  // Card abierta (solo una a la vez; si quieres múltiples, cambia a Set<string>)
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const handleToggle = useCallback((id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const { recs, diag } = loadAll();
    setAllRecs(recs);
    setDiag(diag);
  }, []);

  // Cerrar card abierta al cambiar filtros/búsqueda
  useEffect(() => setOpenCardId(null), [q, platform, evaType, audience]);

  // Opciones selects
  const platforms = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.platform))], [allRecs]);
  const evaTypes = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.evaType))], [allRecs]);
  const audiences = useMemo(() => ["all", ...uniqStrings(allRecs.map((r) => r.audience))], [allRecs]);

  // Filtrado soft-AND + búsqueda case-insensitive
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const selPlat = normToken(platform);
    const selEva = normToken(evaType);
    const selAud = normToken(audience);

    return allRecs.filter((r) => {
      const itPlat = normToken(r.platform);
      const itEva = normToken(r.evaType);
      const itAud = normToken(r.audience);

      const okPlat = selPlat === "all" || itPlat === "" || itPlat === selPlat;
      const okEva  = selEva  === "all" || itEva  === "" || itEva  === selEva;
      const okAud  = selAud  === "all" || itAud  === "" || itAud  === selAud;

      const haystack = [
        r.recommendation.title, r.recommendation.how, r.recommendation.why,
        r.patternRef, r.platform, r.evaType, r.audience, ...compactURLs(r.sources),
      ].join(" ").toLowerCase();

      const okSearch = needle === "" || haystack.includes(needle);
      return okPlat && okEva && okAud && okSearch;
    });
  }, [allRecs, q, platform, evaType, audience]);

  // === AGRUPACIÓN EN COLUMNAS ===
  // Regla: si Platform=all → fusionar mobile + web-responsive en una sola columna "PLATFORM_UI_COMBINED".
  // Si Platform es específico → dejar sólo esa columna específica.
  const grouped = useMemo(() => {
    const groups = new Map<string, Rec[]>();

    // 1) Partimos con todo por sourceName
    for (const rec of filtered) {
      const key = rec.sourceName ?? "default";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(rec);
    }

    // 2) Lógica de Platform
    const mobileKey = "PLATFORM_MOBILE_UI_RECOMMENDATIONS";
    const webKey = "PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS";

    if (platform === "all") {
      // Fusionar ambos en "PLATFORM_UI_COMBINED"
      const merged = [
        ...(groups.get(mobileKey) ?? []),
        ...(groups.get(webKey) ?? []),
      ];
      // eliminar las columnas originales
      groups.delete(mobileKey); groups.delete(webKey);
      if (merged.length) groups.set("PLATFORM_UI_COMBINED", merged);
    } else {
      // Filtra para dejar solo la columna elegida
      const keepKey = platform === "mobile" ? mobileKey : webKey;
      const toRemove = platform === "mobile" ? webKey : mobileKey;
      if (groups.has(toRemove)) groups.delete(toRemove);
      // no hacer nada más: mantenemos sólo la sub-sección elegida
    }

    return groups;
  }, [filtered, platform]);

  const presentColumns = useMemo(() => {
    const keys = Array.from(grouped.keys());
    const ordered: string[] = [];

    // respeta el orden deseado
    for (const k of COLUMN_ORDER) if (keys.includes(k)) ordered.push(k);

    // añade otras columnas no previstas (si existieran)
    for (const k of keys) if (!ordered.includes(k)) ordered.push(k);

    return ordered;
  }, [grouped]);

  return (
    <div className="space-y-6">
      {/* Diagnóstico (puedes quitarlo si no lo necesitas) */}
      <Card>
        <CardContent className="py-3">
          <div className="text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600" />
            <div>
              <div>Arrays detectados: {diag.map(d => `${d.name} (${d.size})`).join(", ")}</div>
              <div className="text-xs text-muted-foreground">Resultados: <b>{filtered.length}</b></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" /> Filtros</CardTitle>
          <CardDescription>Soft-AND + búsqueda case-insensitive</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en título, how/why, pattern, URLs…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          {/* Platform */}
          <div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {["all", ...uniqStrings(allRecs.map(r => r.platform))].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "all" ? "All platforms" : p === "web-responsive" ? "Responsive Web" : p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* EVA type */}
          <div>
            <Select value={evaType} onValueChange={setEvaType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="EVA type" />
              </SelectTrigger>
              <SelectContent>
                {["all", ...uniqStrings(allRecs.map(r => r.evaType))].map((e) => (
                  <SelectItem key={e} value={e}>{e === "all" ? "All EVA types" : e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audience */}
          <div>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                {["all", ...uniqStrings(allRecs.map(r => r.audience))].map((a) => (
                  <SelectItem key={a} value={a}>{a === "all" ? "All audiences" : a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Columnas por campo (con fusión de Platform cuando corresponde) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {presentColumns.map((groupKey) => {
          const items = grouped.get(groupKey) ?? [];
          const labelMeta = sourceLabels[groupKey] ?? sourceLabels.default;

          return (
            <div key={groupKey} className="flex flex-col">
              <ColumnHeader name={groupKey} />
              <div className="mt-3 overflow-y-auto pr-2 rounded-lg" style={{ maxHeight: "78vh" }}>
                {/* IMPORTANTE: NO usamos grid con [grid-auto-rows:1fr] para que
                    al abrir una card, NO obligue a que todas las filas tengan esa altura. */}
                <AnimatePresence mode="popLayout">
                  <div className="flex flex-col gap-3">
                    {items.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        rec={rec.sourceName.startsWith("PLATFORM_") && platform === "all"
                          ? { ...rec, sourceName: "PLATFORM_UI_COMBINED" } // color único en columna fusionada
                          : rec}
                        isOpen={openCardId === rec.id}
                        onToggle={handleToggle}
                      />
                    ))}
                    {items.length === 0 && (
                      <Card className={`border-2 ${labelMeta.border} border-dashed`}>
                        <CardContent className="py-6 text-sm text-muted-foreground">
                          Sin resultados para esta sección con los filtros actuales.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
