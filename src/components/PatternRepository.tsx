"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, ExternalLink, Heart, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export function PatternRepository() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const patterns = [
    // ====== UX / UI PATTERNS ======
    {
      title: "Card Layout",
      description: "Flexible content containers that group related information in a scannable format.",
      category: "Layout",
      usage: "High",
      complexity: "Low",
      preview: "📱",
      tags: ["responsive", "content", "mobile-friendly"],
      relationships: {
        instructional: ["Resource Diversification"],
        pedagogical: ["Cognitive Load Theory", "Multimodal Learning (Mayer)"],
        uxPrinciples: ["Consistency", "Recognition over Recall"]
      }
    },
    {
      title: "Navigation Drawer",
      description: "Off-canvas navigation that slides in from the side, perfect for mobile interfaces.",
      category: "Navigation",
      usage: "High",
      complexity: "Medium",
      preview: "📋",
      tags: ["mobile", "navigation", "space-saving"],
      relationships: {
        instructional: ["Modular Structure"],
        pedagogical: ["Scaffolding (Bruner)"],
        uxPrinciples: ["Flexibility and Efficiency of Use"]
      }
    },
    {
      title: "Infinite Scroll",
      description: "Continuously loads content as users scroll, providing seamless browsing experience.",
      category: "Interaction",
      usage: "Medium",
      complexity: "High",
      preview: "📜",
      tags: ["performance", "engagement", "content-heavy"],
      relationships: {
        instructional: ["Discussion Forum"],
        pedagogical: ["Flow Theory (Csikszentmihalyi)"],
        uxPrinciples: ["Aesthetic and Minimalist Design"]
      }
    },
    {
      title: "Progressive Disclosure",
      description: "Reveals information gradually to reduce cognitive load and improve focus.",
      category: "Information Architecture",
      usage: "High",
      complexity: "Low",
      preview: "📊",
      tags: ["simplicity", "focus", "user-friendly"],
      relationships: {
        instructional: ["Modular Structure"],
        pedagogical: ["Constructivism", "Cognitive Load Management"],
        uxPrinciples: ["User Control and Freedom"]
      }
    },
    {
      title: "Breadcrumb Navigation",
      description: "Shows users their current location within a hierarchical structure.",
      category: "Navigation",
      usage: "Medium",
      complexity: "Low",
      preview: "🍞",
      tags: ["hierarchy", "orientation", "navigation"],
      relationships: {
        instructional: ["Zero Block"],
        pedagogical: ["Metacognition", "Guided Learning"],
        uxPrinciples: ["Visibility of System Status"]
      }
    },
    {
      title: "Modal Dialog",
      description: "Overlay window that requires user interaction before returning to main content.",
      category: "Interaction",
      usage: "High",
      complexity: "Medium",
      preview: "💬",
      tags: ["focus", "confirmation", "interruption"],
      relationships: {
        instructional: ["Immediate Feedback"],
        pedagogical: ["Behaviorism (Skinner)"],
        uxPrinciples: ["Error Prevention", "Feedback Loops"]
      }
    },
    {
      title: "Tab Navigation",
      description: "Organizes related content into separate views accessible via clickable tabs.",
      category: "Navigation",
      usage: "High",
      complexity: "Low",
      preview: "📂",
      tags: ["organization", "space-efficient", "content-switching"],
      relationships: {
        instructional: ["Exposition–Construction–Verification"],
        pedagogical: ["Scaffolding (Bruner)", "Sequential Learning"],
        uxPrinciples: ["Consistency and Standards"]
      }
    },
    {
      title: "Search Autocomplete",
      description: "Provides real-time suggestions as users type, improving search efficiency.",
      category: "Input",
      usage: "Medium",
      complexity: "High",
      preview: "🔍",
      tags: ["search", "efficiency", "suggestions"],
      relationships: {
        instructional: ["Complementary Resources / Library"],
        pedagogical: ["Self-Directed Learning (Knowles)"],
        uxPrinciples: ["Efficiency of Use", "Recognition rather than Recall"]
      }
    },

    // ====== INSTRUCTIONAL DESIGN PATTERNS ======
    {
      title: "Zero Block",
      description: "Welcome and orient the student with course introduction, objectives, social/technical forum, and user guides.",
      category: "Instructional Design",
      usage: "High",
      complexity: "Low",
      preview: "🏠",
      tags: ["orientation", "welcome", "course-intro", "onboarding"],
      relationships: {
        instructional: ["Modular Structure"],
        pedagogical: ["Constructivism", "Metacognitive Awareness"],
        uxPrinciples: ["Match between System and Real World", "User Guidance"]
      }
    },
    {
      title: "Modular Structure",
      description: "Organize the course into coherent modules or units with clear beginning, development, and closing.",
      category: "Instructional Design",
      usage: "High",
      complexity: "Medium",
      preview: "📦",
      tags: ["organization", "modules", "structure", "coherence"],
      relationships: {
        instructional: ["Zero Block"],
        pedagogical: ["Cognitive Load Theory", "Scaffolding (Bruner)"],
        uxPrinciples: ["Consistency and Standards", "Progressive Disclosure"]
      }
    },
    {
      title: "Exposition–Construction–Verification",
      description: "Facilitates pedagogical cycle: exposition (content), construction (activities), verification (assessment).",
      category: "Instructional Design",
      usage: "High",
      complexity: "Medium",
      preview: "🔄",
      tags: ["pedagogy", "learning-cycle", "assessment", "activities"],
      relationships: {
        instructional: ["Formative and Summative Assessment"],
        pedagogical: ["Constructivism", "Learning by Doing (Dewey)"],
        uxPrinciples: ["User Control and Freedom"]
      }
    },
    {
      title: "Clear Instructions",
      description: "Reduce student confusion with step-by-step instructions in each activity and assignment.",
      category: "Instructional Design",
      usage: "High",
      complexity: "Low",
      preview: "📝",
      tags: ["instructions", "clarity", "guidance", "usability"],
      relationships: {
        instructional: ["Zero Block"],
        pedagogical: ["Cognitive Clarity", "Guided Practice"],
        uxPrinciples: ["Error Prevention", "Help Users Recognize and Recover"]
      }
    },
    {
      title: "Resource Diversification",
      description: "Address different learning styles with varied content: texts, images, videos, podcasts, infographics.",
      category: "Instructional Design",
      usage: "High",
      complexity: "Medium",
      preview: "🎭",
      tags: ["multimedia", "learning-styles", "accessibility", "variety"],
      relationships: {
        instructional: ["Complementary Resources / Library"],
        pedagogical: ["Multimodal Learning (Mayer)", "Universal Design for Learning (UDL)"],
        uxPrinciples: ["Aesthetic and Minimalist Design", "Accessibility"]
      }
    },
    {
      title: "Discussion Forum",
      description: "Promote social and academic interaction through thematic forums and moderated debates.",
      category: "Instructional Design",
      usage: "Medium",
      complexity: "Medium",
      preview: "💬",
      tags: ["discussion", "social-learning", "collaboration", "interaction"],
      relationships: {
        instructional: ["Collaborative Glossary"],
        pedagogical: ["Social Constructivism (Vygotsky)", "Peer Interaction"],
        uxPrinciples: ["Flexibility and Efficiency", "Consistency"]
      }
    },
    {
      title: "Collaborative Glossary",
      description: "Encourage collective knowledge construction where students create and validate course term definitions.",
      category: "Instructional Design",
      usage: "Medium",
      complexity: "Low",
      preview: "📚",
      tags: ["collaboration", "vocabulary", "peer-learning", "knowledge-building"],
      relationships: {
        instructional: ["Discussion Forum"],
        pedagogical: ["Peer Learning", "Social Knowledge Building"],
        uxPrinciples: ["User Control and Freedom"]
      }
    },
    {
      title: "Formative and Summative Assessment",
      description: "Combine continuous feedback through short quizzes with comprehensive cumulative evaluations.",
      category: "Instructional Design",
      usage: "High",
      complexity: "High",
      preview: "✅",
      tags: ["assessment", "feedback", "evaluation", "learning-analytics"],
      relationships: {
        instructional: ["Immediate Feedback"],
        pedagogical: ["Mastery Learning (Bloom)", "Feedback Loops"],
        uxPrinciples: ["Visibility of System Status"]
      }
    },
    {
      title: "Immediate Feedback",
      description: "Improve learning through quick automatic feedback in quizzes and personalized comments on assignments.",
      category: "Instructional Design",
      usage: "High",
      complexity: "Medium",
      preview: "⚡",
      tags: ["feedback", "real-time", "personalization", "learning-support"],
      relationships: {
        instructional: ["Formative and Summative Assessment"],
        pedagogical: ["Operant Conditioning (Skinner)", "Motivational Feedback Loops"],
        uxPrinciples: ["Visibility of System Status", "Feedback"]
      }
    },
    {
      title: "Complementary Resources / Library",
      description: "Deepen learning beyond mandatory content with optional readings, external links, and extra videos.",
      category: "Instructional Design",
      usage: "Medium",
      complexity: "Low",
      preview: "📖",
      tags: ["resources", "supplementary", "self-directed", "enrichment"],
      relationships: {
        instructional: ["Resource Diversification"],
        pedagogical: ["Self-Regulated Learning (Zimmerman)", "Autonomous Learning"],
        uxPrinciples: ["Flexibility and Efficiency of Use"]
      }
    },
  ];

  // ====== CATEGORY FILTERS ======
  const categories = ["all", "Layout", "Navigation", "Interaction", "Information Architecture", "Input", "Instructional Design"];

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "bg-blue-100 text-blue-800";
      case "Medium": return "bg-purple-100 text-purple-800";
      case "High": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPatterns = patterns.filter((pattern) => {
    const matchesSearch =
      pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || pattern.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Pattern Repository</h1>
        <p className="text-muted-foreground mb-6">
          Explore interconnected UI/UX, instructional, and pedagogical design patterns.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatterns.map((pattern, index) => (
          <Card key={index} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{pattern.preview}</div>
                  <div>
                    <CardTitle className="text-lg">{pattern.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {pattern.category}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription>{pattern.description}</CardDescription>

              <div className="flex gap-2">
                <Badge className={getUsageColor(pattern.usage)}>
                  Usage: {pattern.usage}
                </Badge>
                <Badge className={getComplexityColor(pattern.complexity)}>
                  {pattern.complexity}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {pattern.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {pattern.relationships && (
                <div className="mt-4 border-t pt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LinkIcon className="h-4 w-4" /> <span>Related Links</span>
                  </div>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li><strong>Instructional:</strong> {pattern.relationships.instructional.join(", ")}</li>
                    <li><strong>Pedagogical:</strong> {pattern.relationships.pedagogical.join(", ")}</li>
                    <li><strong>UX Principles:</strong> {pattern.relationships.uxPrinciples.join(", ")}</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Example
                </Button>
                <Button variant="outline" size="sm">
                  Code
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No patterns found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
