// src/components/UXPrinciplesLibrary.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type Item = {
  title: string;
  description: string;
  category: "Usability" | "Visual Design" | "Psychology" | "Evaluation";
  difficulty: Difficulty;
  url: string;
  tags: string[];
};

export function UXPrinciplesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");

  const principles: Record<"usability" | "visual" | "psychology" | "evaluation", Item[]> = {
    // ===================== USABILITY =====================
    usability: [
      // Laws of UX (Usability bucket)
      {
        title: "Jakob's Law",
        description:
          "Users prefer your product to behave like other familiar products they already use.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://lawsofux.com/jakobs-law/",
        tags: ["consistency", "familiarity", "mental-models", "navigation"]
      },
      {
        title: "Fitts's Law",
        description:
          "Time to acquire a target depends on its size and distance; larger, closer targets are faster to reach.",
        category: "Usability",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/fittss-law/",
        tags: ["target-size", "interaction", "efficiency", "accessibility"]
      },
      {
        title: "Miller's Law",
        description:
          "Working memory holds about 7±2 items; chunk and group to reduce cognitive load.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://lawsofux.com/millers-law/",
        tags: ["cognitive-load", "memory", "chunking", "simplicity"]
      },
      {
        title: "Hick’s Law",
        description:
          "Decision time increases with number and complexity of choices; simplify and prioritize.",
        category: "Usability",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/hicks-law/",
        tags: ["choice-overload", "decision-making", "simplicity", "navigation"]
      },
      {
        title: "Tesler’s Law",
        description:
          "Complexity is conserved: decide whether the system or the user carries it.",
        category: "Usability",
        difficulty: "Advanced",
        url: "https://lawsofux.com/teslers-law/",
        tags: ["complexity-management", "design-tradeoffs", "efficiency"]
      },
      {
        title: "Doherty Threshold",
        description:
          "Keep system response under ~400ms so neither user nor system is waiting.",
        category: "Usability",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/doherty-threshold/",
        tags: ["performance", "responsiveness", "feedback", "latency"]
      },

      // Nielsen’s 10 Heuristics
      {
        title: "Visibility of System Status",
        description:
          "Always keep users informed about what’s going on with timely and appropriate feedback.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["feedback", "system-status", "visibility", "progress"]
      },
      {
        title: "Match Between System and the Real World",
        description:
          "Use concepts and language familiar to users; follow real-world conventions.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["real-world", "language", "mental-models", "affordances"]
      },
      {
        title: "User Control and Freedom",
        description:
          "Provide clearly marked exits, undo/redo, and easy recovery from unwanted actions.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["undo-redo", "user-control", "freedom", "navigation"]
      },
      {
        title: "Consistency and Standards",
        description:
          "Follow platform and web conventions; be consistent in wording and behavior.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["consistency", "standards", "predictability"]
      },
      {
        title: "Error Prevention",
        description:
          "Prevent problems by design using constraints, confirmations, and sensible defaults.",
        category: "Usability",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["error-prevention", "validation", "defaults", "safety"]
      },
      {
        title: "Recognition Rather Than Recall",
        description:
          "Make options and objects visible; reduce memory load with cues and references.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["recognition", "discoverability", "cognitive-load"]
      },
      {
        title: "Flexibility and Efficiency of Use",
        description:
          "Provide accelerators for experts (shortcuts) without harming novice learnability.",
        category: "Usability",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["shortcuts", "efficiency", "power-users", "personalization"]
      },
      {
        title: "Aesthetic and Minimalist Design",
        description:
          "Remove irrelevant information; keep interfaces clean and focused.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["minimalism", "clarity", "signal-to-noise", "visual-hierarchy"]
      },
      {
        title: "Help Users Recognize, Diagnose, and Recover from Errors",
        description:
          "Use plain-language error messages and suggest constructive solutions.",
        category: "Usability",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["error-recovery", "guidance", "plain-language"]
      },
      {
        title: "Help and Documentation",
        description:
          "Offer searchable, task-focused help and documentation when needed.",
        category: "Usability",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
        tags: ["documentation", "help", "support", "onboarding"]
      }
    ],

    // ===================== VISUAL DESIGN =====================
    visual: [
      {
        title: "Law of Proximity",
        description: "Elements that are close to each other are perceived as a group.",
        category: "Visual Design",
        difficulty: "Beginner",
        url: "https://lawsofux.com/law-of-proximity/",
        tags: ["visual-grouping", "spacing", "gestalt", "layout"]
      },
      {
        title: "Law of Similarity",
        description: "Similar elements are perceived as related or part of the same group.",
        category: "Visual Design",
        difficulty: "Beginner",
        url: "https://lawsofux.com/law-of-similarity/",
        tags: ["visual-similarity", "grouping", "gestalt", "styles"]
      },
      {
        title: "Von Restorff Effect",
        description: "An item that stands out is more likely to be remembered.",
        category: "Visual Design",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/von-restorff-effect/",
        tags: ["salience", "attention", "highlighting", "contrast"]
      },
      {
        title: "Law of Prägnanz",
        description: "People perceive complex images in the simplest form possible.",
        category: "Visual Design",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/law-of-pragnanz/",
        tags: ["simplicity", "gestalt", "visual-processing"]
      },
      {
        title: "Law of Common Region",
        description: "Elements enclosed within the same region are perceived as a group.",
        category: "Visual Design",
        difficulty: "Beginner",
        url: "https://lawsofux.com/law-of-common-region/",
        tags: ["visual-grouping", "regions", "borders", "cards"]
      },
      {
        title: "Law of Continuity",
        description: "Elements aligned on a line or curve are perceived as related.",
        category: "Visual Design",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/law-of-continuity/",
        tags: ["visual-flow", "alignment", "gestalt"]
      }
    ],

    // ===================== PSYCHOLOGY =====================
    psychology: [
      {
        title: "Peak-End Rule",
        description:
          "People judge experiences largely by their peak and end moments, rather than the total sum.",
        category: "Psychology",
        difficulty: "Advanced",
        url: "https://lawsofux.com/peak-end-rule/",
        tags: ["experience-memory", "moments-that-matter", "emotion"]
      },
      {
        title: "Zeigarnik Effect",
        description:
          "Unfinished tasks are remembered better than completed ones; leverage progress cues.",
        category: "Psychology",
        difficulty: "Advanced",
        url: "https://lawsofux.com/zeigarnik-effect/",
        tags: ["incompletion", "engagement", "progress", "motivation"]
      },
      {
        title: "Serial Position Effect",
        description:
          "People remember best the first and last items in a sequence (primacy/recency).",
        category: "Psychology",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/serial-position-effect/",
        tags: ["memory", "primacy", "recency", "ordering"]
      },
      {
        title: "Aesthetic–Usability Effect",
        description:
          "Aesthetically pleasing designs are perceived as more usable and get the benefit of the doubt.",
        category: "Psychology",
        difficulty: "Beginner",
        url: "https://lawsofux.com/aesthetic-usability-effect/",
        tags: ["aesthetics", "perception", "usability-bias"]
      },
      {
        title: "Cognitive Load Theory",
        description:
          "Reduce extraneous load and support germane load to improve learning.",
        category: "Psychology",
        difficulty: "Advanced",
        url: "https://lawsofux.com/cognitive-load/",
        tags: ["cognitive-load", "learning", "simplicity", "scaffolding"]
      },
      {
        title: "Goal-Gradient Effect",
        description:
          "Motivation increases as people feel closer to completing a goal.",
        category: "Psychology",
        difficulty: "Intermediate",
        url: "https://lawsofux.com/goal-gradient-effect/",
        tags: ["motivation", "goals", "progress", "engagement"]
      },
      // Pekrun (Control-Value Theory)
      {
        title: "Control Appraisal (Pekrun)",
        description:
          "Positive achievement emotions arise when learners perceive high control over outcomes and tasks.",
        category: "Psychology",
        difficulty: "Intermediate",
        url: "https://doi.org/10.1016/j.edurev.2006.04.001",
        tags: ["control", "autonomy", "self-efficacy", "achievement-emotions"]
      },
      {
        title: "Value Appraisal (Pekrun)",
        description:
          "Engagement increases when tasks are perceived as valuable, meaningful, or interesting.",
        category: "Psychology",
        difficulty: "Intermediate",
        url: "https://doi.org/10.1016/j.edurev.2006.04.001",
        tags: ["value", "relevance", "intrinsic-motivation", "engagement"]
      }
    ],

    // ===================== EVALUATION =====================
    evaluation: [
      {
        title: "2DES",
        description:
          "Continuous self-report of emotion along valence–arousal while interacting with a stimulus.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/2des/",
        tags: ["self-report", "emotion", "arousal", "valence"]
      },
      {
        title: "3E (Expressing Experiences and Emotions)",
        description:
          "Participants draw/write experiences and emotions on a template during field studies.",
        category: "Evaluation",
        difficulty: "Beginner",
        url: "https://experienceresearchsociety.org/ux-methods/3e-expressing-experiences-and-emotions/",
        tags: ["diary-study", "field", "emotion", "qualitative"]
      },
      {
        title: "AttrakDiff",
        description:
          "Questionnaire measuring pragmatic and hedonic UX qualities via semantic differentials.",
        category: "Evaluation",
        difficulty: "Beginner",
        url: "https://experienceresearchsociety.org/ux-methods/attrakdiff/",
        tags: ["questionnaire", "hedonic", "pragmatic", "measurement"]
      },
      {
        title: "Experience Clip",
        description:
          "Peer-filmed video clips of real-world mobile use to capture authentic experiences.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/experience-clip/",
        tags: ["field-video", "context-of-use", "qualitative"]
      },
      {
        title: "Mental Mapping",
        description:
          "Participants map a design to famous people/films to surface experiential associations.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/mental-mapping/",
        tags: ["projective-technique", "associations", "qualitative"]
      },
      {
        title: "UX Expert Evaluation",
        description:
          "Experts inspect a system and note hedonic/pragmatic findings, often guided by heuristics.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://experienceresearchsociety.org/ux-methods/ux-expert-evaluation/",
        tags: ["expert-review", "heuristics", "inspection"]
      },
      {
        title: "Usability Testing",
        description:
          "Observe representative users performing tasks; measure effectiveness, efficiency, satisfaction.",
        category: "Evaluation",
        difficulty: "Beginner",
        url: "https://www.nngroup.com/articles/usability-testing-101/",
        tags: ["user-testing", "task-performance", "qualitative", "metrics"]
      },
      {
        title: "A/B Testing",
        description:
          "Run controlled experiments comparing design variants to optimize key metrics.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/ab-testing/",
        tags: ["experimentation", "quantitative", "optimization"]
      },
      {
        title: "Cognitive Walkthrough",
        description:
          "Structured expert review focused on learnability for first-time use and task flows.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/cognitive-walkthroughs/",
        tags: ["expert-review", "learnability", "task-analysis"]
      },
      {
        title: "Think-Aloud Protocol",
        description:
          "Participants verbalize thoughts during tasks to reveal reasoning and confusion.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/",
        tags: ["qualitative", "verbalization", "user-research"]
      },
      {
        title: "Tree Testing",
        description:
          "Evaluate findability in an information architecture using text-only navigation trees.",
        category: "Evaluation",
        difficulty: "Intermediate",
        url: "https://www.interaction-design.org/literature/article/tree-testing-ux",
        tags: ["information-architecture", "findability", "navigation"]
      }
    ]
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
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
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
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
            placeholder="Search by title, description, or tag..."
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
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        {(["usability", "visual", "psychology"] as const).map((key) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">
              {key === "visual" ? "Visual Design" : key.charAt(0).toUpperCase() + key.slice(1)}
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
                        <CardTitle className="text-lg text-blue-600 underline">{item.title}</CardTitle>
                        <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="evaluation" className="space-y-4">
          <h2 className="text-xl font-semibold">Evaluation</h2>
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
                      <CardTitle className="text-lg text-blue-600 underline">{method.title}</CardTitle>
                      <Badge className={getDifficultyColor(method.difficulty)}>{method.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{method.category}</Badge>
                      {method.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{method.description}</CardDescription>
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
