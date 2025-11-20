// PatternRepository.tsx — con botón “Ver ejemplo” y modal para renderizar ejemplos
// - Agrega soporte a `exampleId?: string` en el tipo BasePattern.
// - Importa un registry de ejemplos (carga dinámica) y muestra un <Dialog> con la demo.
// - Elimina el render de relationships (chips), como pediste.

"use client";

import { useMemo, useState } from "react";
import { patterns } from "./patternRepo"; // <-- tu data (debe tener exampleId cuando corresponda)
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Search, Play } from "lucide-react";

// 🔗 Registry de ejemplos (ver: ./pattern-examples/registry.ts)
//   export const patternExampleRegistry: Record<string, React.ComponentType<any>>
import { patternExampleRegistry } from "./patternExamples/registry";

/** --- Tipado local (refleja tu modelo; aquí añadimos exampleId) ------------------------ */
type UsageLevel = "High" | "Medium" | "Low" | "Unknown";
type ComplexityLevel = "High" | "Medium" | "Low" | "Unknown";

type BasePattern = {
  id: string;
  type: "ui" | "instructional" | "pedagogical";
  title: string;
  description: string;
  tags: string[];
  usage?: UsageLevel;
  complexity?: ComplexityLevel;
  sources?: { title: string; url: string }[];
  /** NUEVO: ID del ejemplo para abrir en el modal */
  exampleId?: string;
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

/** Búsqueda simple por título/desc/tags */
function matchesQuery(q: string, p: AnyPattern) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    p.title.toLowerCase().includes(needle) ||
    p.description.toLowerCase().includes(needle) ||
    (p.tags ?? []).some((t) => t.toLowerCase().includes(needle))
  );
}

/** Pill reusables para uso/complexity */
function Pill({ label, value }: { label: "usage" | "complexity"; value?: string }) {
  return (
    <Badge variant="outline">
      {label}: {value && value !== "Unknown" ? value : "—"}
    </Badge>
  );
}

export default function PatternRepository() {
  const data = patterns as PatternRepositoryData; // asume que tu data sigue el modelo
  const uiSubcats = Object.keys(data.ui) as UISubcategory[];

  const [tab, setTab] = useState("ui");
  const [query, setQuery] = useState("");

  // Estado del modal de ejemplo
  const [openExampleId, setOpenExampleId] = useState<string | null>(null);
  const [openExampleTitle, setOpenExampleTitle] = useState<string>("");

  const filtered: PatternRepositoryData = useMemo(() => {
    if (!query) return data;
    const filterUI = (arr: UIPattern[]) => arr.filter((p) => matchesQuery(query, p));
    const uiFiltered = Object.fromEntries(
      uiSubcats.map((sc) => [sc, filterUI(data.ui[sc])])
    ) as PatternRepositoryData["ui"];
    const instructional = data.instructional.filter((p) => matchesQuery(query, p));
    const pedagogical = data.pedagogical.filter((p) => matchesQuery(query, p));
    return { ui: uiFiltered, instructional, pedagogical };
  }, [data, query, uiSubcats]);

  // Abre el modal con el ejemplo indicado
  function openExample(p: AnyPattern) {
    if (!p.exampleId) return;
    setOpenExampleId(p.exampleId);
    setOpenExampleTitle(p.title);
  }

  // Componente del ejemplo (si existe en el registry)
  const ExampleCmp = openExampleId ? patternExampleRegistry[openExampleId] : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">Pattern Repository</h1>
        <p className="text-muted-foreground mb-4">
          UI, instructional, and pedagogical patterns. Click “Ver ejemplo” to preview a pattern demo.
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            placeholder="Search by title or tag…"
            aria-label="Search patterns"
          />
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v)} className="space-y-6">
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
                      <CardContent className="space-y-4">
                        <CardDescription>{p.description}</CardDescription>

                        {/* Botón para abrir el ejemplo (si hay exampleId) */}
                        {p.exampleId ? (
                          <div>
                            <Button size="sm" onClick={() => openExample(p)}>
                              <Play className="w-4 h-4 mr-1" />
                              Ver ejemplo
                            </Button>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Sin ejemplo aún.</div>
                        )}

                        {/* (El render de relationships fue retirado a tu pedido) */}
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
                <CardContent className="space-y-4">
                  <CardDescription>{p.description}</CardDescription>

                  {p.exampleId ? (
                    <div>
                      <Button size="sm" onClick={() => openExample(p)}>
                        <Play className="w-4 h-4 mr-1" />
                        Ver ejemplo
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Sin ejemplo aún.</div>
                  )}
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
                <CardContent className="space-y-4">
                  <CardDescription>{p.description}</CardDescription>

                  {p.exampleId ? (
                    <div>
                      <Button size="sm" onClick={() => openExample(p)}>
                        <Play className="w-4 h-4 mr-1" />
                        Ver ejemplo
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Sin ejemplo aún.</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para renderizar el ejemplo seleccionado */}
      <Dialog open={!!openExampleId} onOpenChange={(open) => !open && setOpenExampleId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ejemplo — {openExampleTitle || "Patrón"}</DialogTitle>
            <DialogDescription>Vista previa del patrón en uso.</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {ExampleCmp ? (
              <ExampleCmp />
            ) : (
              <p className="text-sm text-muted-foreground">Ejemplo no disponible.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
