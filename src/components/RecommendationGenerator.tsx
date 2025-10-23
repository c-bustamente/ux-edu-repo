"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Lightbulb, Target, Users, Smartphone, Monitor, Tablet, Eye } from "lucide-react";
import { recommendationRules, Recommendation } from "./recommendationRules";

export function RecommendationGenerator() {
  // Estados principales
  const [evaType, setEvaType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // 🔁 Reinicia resultados al cambiar los parámetros
  useEffect(() => {
    setShowRecommendations(false);
    setExpanded({});
  }, [evaType, targetAudience, platform, features]);

  // ⚙️ Manejador de cambio de features
  const handleFeatureChange = (feature: string, checked: boolean | "indeterminate") => {
    if (checked) setFeatures([...features, feature]);
    else setFeatures(features.filter(f => f !== feature));
  };

  // 🚀 Generar recomendaciones (muestra resultados)
  const generateRecommendations = () => {
    if (evaType && targetAudience && platform) setShowRecommendations(true);
  };

  // 👁️ Alternar ejemplo visible
  const toggleExample = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 🧮 Filtrar recomendaciones (memoizado)
  const filteredRecommendations = useMemo((): Recommendation[] => {
    return recommendationRules.filter(rule => {
      return (
        (!rule.evaType || rule.evaType === evaType) &&
        (!rule.targetAudience || rule.targetAudience === targetAudience) &&
        (!rule.platform || rule.platform === platform) &&
        (!rule.feature || features.includes(rule.feature))
      );
    });
  }, [evaType, targetAudience, platform, features]);

  // 🎨 Colores según prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 🧱 Render principal
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">EVA Recommendation Generator</h1>
        <p className="text-muted-foreground mb-6">
          Get personalized UX and pedagogical design recommendations for your virtual learning environment (EVA).
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              EVA Details
            </CardTitle>
            <CardDescription>Select parameters to generate context-aware recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* EVA Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">EVA Type</label>
              <Select value={evaType} onValueChange={setEvaType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select EVA type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lms">Learning Management System (LMS)</SelectItem>
                  <SelectItem value="mooc">MOOC Platform</SelectItem>
                  <SelectItem value="virtual-classroom">Virtual Classroom</SelectItem>
                  <SelectItem value="corporate-training">Corporate Training EVA</SelectItem>
                  <SelectItem value="blended">Blended Learning EVA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="young-adults">Young Adults (18–30)</SelectItem>
                  <SelectItem value="professionals">Working Professionals</SelectItem>
                  <SelectItem value="elderly">Elderly Users (60+)</SelectItem>
                  <SelectItem value="children">Children</SelectItem>
                  <SelectItem value="tech-savvy">Tech-Savvy Users</SelectItem>
                  <SelectItem value="general">General Audience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" /> Web Desktop
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" /> Mobile App
                    </div>
                  </SelectItem>
                  <SelectItem value="tablet">
                    <div className="flex items-center gap-2">
                      <Tablet className="h-4 w-4" /> Tablet
                    </div>
                  </SelectItem>
                  <SelectItem value="responsive">Responsive Web</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Key Features (Optional)</label>
              <div className="grid grid-cols-2 gap-3">
                {["search", "notifications", "user-profiles", "messaging", "analytics", "file-upload"].map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={features.includes(feature)}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleFeatureChange(feature, checked as boolean)
                      }
                    />
                    <label htmlFor={feature} className="text-sm capitalize">
                      {feature.replace("-", " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón para generar */}
            <Button
              onClick={generateRecommendations}
              className="w-full"
              disabled={!evaType || !targetAudience || !platform}
            >
              <Lightbulb className="mr-2 h-4 w-4" /> Generate Recommendations
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-4">
          {showRecommendations ? (
            <>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> Recommendations
              </h2>

              <div className="space-y-4">
                {filteredRecommendations.length === 0 ? (
                  <p className="text-gray-500 italic">No recommendations found for this configuration.</p>
                ) : (
                  filteredRecommendations.map(rec => (
                    <Card key={rec.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <Badge variant="outline" className="mt-1">{rec.category}</Badge>
                          </div>
                          <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <CardDescription className="mb-3">{rec.description}</CardDescription>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {rec.patterns.map((pattern, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {pattern}
                            </Badge>
                          ))}
                        </div>

                        {/* Ejemplo */}
                        {rec.example && (
                          <div className="mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExample(rec.id)}
                              className="text-sm flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              {expanded[rec.id] ? "Hide Example" : "View Example"}
                            </Button>

                            <AnimatePresence initial={false}>
                              {expanded[rec.id] && (
                                <motion.div
                                  key="example"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 border rounded-md bg-white shadow-inner p-3"
                                >
                                  <div className="flex justify-center">{rec.example}</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* Referencias */}
                        {rec.reference?.length > 0 && (
                          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                            {rec.reference.map((ref, i) => (
                              <li key={i}>
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-blue-600 hover:text-blue-800"
                                >
                                  {ref.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Get Started?</h3>
                <p className="text-muted-foreground">
                  Fill out the EVA details to receive personalized UX recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
