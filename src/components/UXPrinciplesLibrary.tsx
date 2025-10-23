"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Item = {
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  url: string;
  source?: "ERS" | "NN/g" | "IxDF";
};

export function UXPrinciplesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");

  const principles: Record<"usability" | "visual" | "psychology" | "evaluation", Item[]> = {
    usability: [
      {
        title: "Jakob's Law",
        description:
          "Users spend most of their time on other sites, so they prefer your site to work the same way as all the other sites they already know.",
        category: "Navigation",
        difficulty: "Beginner",
        url: "https://lawsofux.com/jakobs-law/",
      },
      {
        title: "Fitts's Law",
        description:
          "The time to acquire a target is a function of the distance to and size of the target.",
        category: "Interaction",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/fittss-law/",
      },
      {
        title: "Miller's Rule",
        description:
          "The average person can only keep 7 (±2) items in their working memory.",
        category: "Information Architecture",
        difficulty: "Beginner",
        url: "https://lawsofux.com/millers-law/",
      },
      {
        title: "Hick’s Law",
        description:
          "The time it takes to make a decision increases with the number and complexity of choices.",
        category: "Decision Making",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/hicks-law/",
      },
      {
        title: "Tesler’s Law (Law of Conservation of Complexity)",
        description:
          "Every application has an irreducible amount of complexity; the question is who handles it — user or developer.",
        category: "Design Efficiency",
        difficulty: "Advanced",
        url: "https://lawsofux.com/teslers-law/",
      },
      {
        title: "Doherty Threshold",
        description:
          "Productivity improves when system and user interact at a pace (<400 ms) where neither waits on the other.",
        category: "Interaction Speed",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/doherty-threshold/",
      },
    ],

    visual: [
      {
        title: "Law of Proximity",
        description:
          "Objects near each other are perceived as grouped.",
        category: "Visual Hierarchy",
        difficulty: "Beginner",
        url: "https://lawsofux.com/law-of-proximity/",
      },
      {
        title: "Law of Similarity",
        description:
          "Elements sharing visual characteristics are perceived as related.",
        category: "Visual Hierarchy",
        difficulty: "Beginner",
        url: "https://lawsofux.com/law-of-similarity/",
      },
      {
        title: "Von Restorff Effect",
        description:
          "Among similar items, the one that differs is more likely to be remembered.",
        category: "Attention",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/von-restorff-effect/",
      },
      {
        title: "Law of Prägnanz",
        description:
          "People interpret complex images in the simplest forms possible.",
        category: "Gestalt Principles",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/law-of-pragnanz/",
      },
      {
        title: "Law of Common Region",
        description:
          "Elements enclosed within the same region are perceived as grouped.",
        category: "Visual Grouping",
        difficulty: "Beginner",
        url: "https://lawsofux.com/law-of-common-region/",
      },
      {
        title: "Law of Continuity",
        description:
          "Elements arranged on a line or curve are perceived as more related.",
        category: "Visual Flow",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/law-of-continuity/",
      },
    ],

    psychology: [
      {
        title: "Peak-End Rule",
        description:
          "People judge experiences largely by their peak and end moments.",
        category: "User Experience",
        difficulty: "Advanced",
        url: "https://lawsofux.com/peak-end-rule/",
      },
      {
        title: "Zeigarnik Effect",
        description:
          "Unfinished tasks are remembered better than completed ones.",
        category: "Motivation",
        difficulty: "Advanced",
        url: "https://lawsofux.com/zeigarnik-effect/",
      },
      {
        title: "Serial Position Effect",
        description:
          "Users best remember the first and last items in a series.",
        category: "Memory",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/serial-position-effect/",
      },
      {
        title: "Aesthetic–Usability Effect",
        description:
          "Aesthetically pleasing designs are often perceived as more usable.",
        category: "Perception",
        difficulty: "Beginner",
        url: "https://lawsofux.com/aesthetic-usability-effect/",
      },
      {
        title: "Cognitive Load Theory",
        description:
          "Learning improves when unnecessary mental effort is reduced.",
        category: "Learning",
        difficulty: "Advanced",
        url: "https://lawsofux.com/cognitive-load/",
      },
      {
        title: "Goal-Gradient Effect",
        description:
          "Behavior accelerates as users feel closer to a goal.",
        category: "Motivation",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/goal-gradient-effect/",
      },
    ],

    evaluation: [
      // ---------- ERS / EXPRESSO methods (verified) ----------
      {
        title: "2DES",
        description:
          "Continuous self-report of emotion along valence–arousal while interacting with a stimulus.",
        category: "Self-report / Emotions",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/2des/",
        source: "ERS",
      },
      {
        title: "3E (Expressing Experiences and Emotions)",
        description:
          "Participants draw/write experiences and emotions on a template during field studies.",
        category: "Diary / Field",
        difficulty: "Beginner",
        url: "https://experienceresearchsociety.org/ux-methods/3e-expressing-experiences-and-emotions/",
        source: "ERS",
      },
      {
        title: "AttrakDiff",
        description:
          "Questionnaire measuring pragmatic and hedonic UX qualities via semantic differentials.",
        category: "Questionnaire",
        difficulty: "Beginner",
        url: "https://experienceresearchsociety.org/ux-methods/attrakdiff/",
        source: "ERS",
      },
      {
        title: "Experience Clip",
        description:
          "Peer-filmed video clips of real-world mobile use to capture authentic experiences.",
        category: "Field / Video",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/experience-clip/",
        source: "ERS",
      },
      {
        title: "Mental Mapping",
        description:
          "Participants map a design to famous people/films to surface experiential associations.",
        category: "Projective Technique",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/mental-mapping/",
        source: "ERS",
      },
      {
        title: "UX Expert Evaluation",
        description:
          "Experts inspect a system and note hedonic/pragmatic findings, often guided by heuristics.",
        category: "Expert Review",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/ux-expert-evaluation/",
        source: "ERS",
      },

      // ---------- Widely used UX methods (external, verified) ----------
      {
        title: "Usability Testing",
        description:
          "Observe representative users performing tasks; measure effectiveness, efficiency, satisfaction.",
        category: "User-Based",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/usability-testing-101/",
        source: "NN/g",
      },
      {
        title: "A/B Testing",
        description:
          "Run controlled experiments comparing design variants with live users to optimize key metrics.",
        category: "Quantitative",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/ab-testing/",
        source: "NN/g",
      },
      {
        title: "Cognitive Walkthrough",
        description:
          "Structured, task-based expert review focused on learnability for first-time users.",
        category: "Expert Review",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/cognitive-walkthroughs/",
        source: "NN/g",
      },
      {
        title: "Think-Aloud Protocol",
        description:
          "Participants verbalize thoughts during tasks to reveal reasoning and confusion.",
        category: "Qualitative",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/",
        source: "NN/g",
      },
      {
        title: "Tree Testing",
        description:
          "Evaluate findability in an IA by testing whether users can locate items in a text-only hierarchy.",
        category: "Information Architecture",
        difficulty: "Intermediate",
        url: "https://www.interaction-design.org/literature/article/tree-testing-ux",
        source: "IxDF",
      },
    ],
  };

  const getDifficultyColor = (difficulty: Item["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterItems = (list: Item[]) => {
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.source ?? "").toLowerCase().includes(q)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">UX Principles Library</h1>
        <p className="text-muted-foreground mb-6">
          Discover foundational principles and methods that guide effective user experience design.
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search (e.g., “Quantitative”, “ERS”, “Expert Review”)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="usability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usability">Usability</TabsTrigger>
          <TabsTrigger value="visual">Visual Design</TabsTrigger>
          <TabsTrigger value="psychology">Psychology</TabsTrigger>
          <TabsTrigger value="evaluation">UX Evaluation Methods</TabsTrigger>
        </TabsList>

        {/* USABILITY / VISUAL / PSYCHOLOGY */}
        {(["usability", "visual", "psychology"] as const).map((key) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">
              {key.charAt(0).toUpperCase() + key.slice(1)} Principles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterItems(principles[key]).map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-3">
                        <CardTitle className="text-lg text-blue-600 underline">
                          {item.title}
                        </CardTitle>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </TabsContent>
        ))}

        {/* EVALUATION */}
        <TabsContent value="evaluation" className="space-y-4">
          <h2 className="text-xl font-semibold">UX Evaluation Methods</h2>
          <p className="text-muted-foreground">
            This section integrates methods from the{" "}
            <a
              href="https://experienceresearchsociety.org/ux/evaluation-methods/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Experience Research Society (EXPRESSO)
            </a>{" "}
            and widely used UX research methods with authoritative references.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterItems(principles.evaluation).map((method, index) => (
              <a
                key={index}
                href={method.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-3">
                      <CardTitle className="text-lg text-blue-600 underline">
                        {method.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(method.difficulty)}>
                        {method.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{method.category}</Badge>
                      {method.source && (
                        <Badge variant="outline">
                          Source: {method.source}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {method.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
