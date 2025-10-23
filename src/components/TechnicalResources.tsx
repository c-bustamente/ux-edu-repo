"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { 
  Code, 
  Palette, 
  FileText, 
  Download, 
  ExternalLink, 
  Search,
  Smartphone,
  Monitor,
  Figma,
  Zap,
  Book,
  Settings
} from "lucide-react";
import { JSX, useState } from "react";

interface Tool {
  name: string;
  description: string;
  category: string;
  type: string;
  price: string;
  rating: number;
  icon: JSX.Element;
  tags: string[];
}

interface Template {
  name: string;
  description: string;
  category: string;
  format: string;
  downloads: number;
  tags: string[];
}

interface Guide {
  title: string;
  description: string;
  category: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}




export function TechnicalResources() {
  const [searchTerm, setSearchTerm] = useState("");

  const tools: Tool[] = [
    {
      name: "Figma",
      description: "Collaborative interface design tool for teams",
      category: "Design",
      type: "Web App",
      price: "Free/Paid",
      rating: 4.8,
      icon: <Figma className="h-6 w-6" />,
      tags: ["prototyping", "collaboration", "design-systems"]
    },
    {
      name: "Framer",
      description: "Interactive prototyping tool with code components",
      category: "Prototyping",
      type: "Web App",
      price: "Free/Paid",
      rating: 4.6,
      icon: <Zap className="h-6 w-6" />,
      tags: ["prototyping", "animation", "interactive"]
    },
    {
      name: "Adobe XD",
      description: "All-in-one UX/UI solution for designing websites and mobile apps",
      category: "Design",
      type: "Desktop App",
      price: "Free/Paid",
      rating: 4.4,
      icon: <Palette className="h-6 w-6" />,
      tags: ["prototyping", "design", "collaboration"]
    },
    {
      name: "Sketch",
      description: "Vector-based design tool for digital design",
      category: "Design",
      type: "Desktop App",
      price: "Paid",
      rating: 4.5,
      icon: <Settings className="h-6 w-6" />,
      tags: ["design", "vector", "mac-only"]
    }
  ];

  const templates : Template[]  = [
    {
      name: "Mobile App Wireframe Kit",
      description: "Complete set of mobile wireframe components and screens",
      category: "Wireframes",
      format: "Figma",
      downloads: 2450,
      tags: ["mobile", "wireframes", "components"]
    },
    {
      name: "Dashboard UI Kit",
      description: "Modern dashboard components and layouts",
      category: "UI Kits",
      format: "Sketch/Figma",
      downloads: 1890,
      tags: ["dashboard", "admin", "charts"]
    },
    {
      name: "E-commerce Design System",
      description: "Complete design system for e-commerce applications",
      category: "Design Systems",
      format: "Figma",
      downloads: 3200,
      tags: ["ecommerce", "design-system", "components"]
    },
    {
      name: "Landing Page Templates",
      description: "Collection of high-converting landing page designs",
      category: "Templates",
      format: "HTML/CSS",
      downloads: 1560,
      tags: ["landing-page", "conversion", "responsive"]
    }
  ];

  const guides: Guide[]= [
    {
      title: "Complete Guide to Design Systems",
      description: "Learn how to create and maintain scalable design systems",
      category: "Design Systems",
      readTime: "25 min",
      difficulty: "Intermediate",
      tags: ["design-systems", "components", "documentation"]
    },
    {
      title: "Mobile UX Design Principles",
      description: "Essential principles for designing mobile user experiences",
      category: "Mobile Design",
      readTime: "15 min",
      difficulty: "Beginner",
      tags: ["mobile", "ux-principles", "best-practices"]
    },
    {
      title: "Accessibility in Digital Design",
      description: "How to create inclusive designs for all users",
      category: "Accessibility",
      readTime: "30 min",
      difficulty: "Intermediate",
      tags: ["accessibility", "inclusive-design", "wcag"]
    },
    {
      title: "User Research Methods",
      description: "Comprehensive overview of user research techniques",
      category: "Research",
      readTime: "40 min",
      difficulty: "Advanced",
      tags: ["user-research", "methods", "analysis"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterItems = (items: any[], searchTerm: string) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Technical Resources</h1>
        <p className="text-muted-foreground mb-6">
          Essential tools, templates, and guides to accelerate your design workflow.
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="tools" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
        </TabsList>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          <h2 className="text-xl font-semibold">Design Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterItems(tools, searchTerm).map((tool: Tool, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {tool.icon}
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">★ {tool.rating}</div>
                      <div className="text-xs text-muted-foreground">{tool.price}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{tool.description}</CardDescription>
                  
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Site
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <h2 className="text-xl font-semibold">Design Templates & Kits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterItems(templates, searchTerm).map((template: Template, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{template.description}</CardDescription>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Format:</span>
                    <Badge variant="secondary">{template.format}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-4">
          <h2 className="text-xl font-semibold">Learning Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {filterItems(guides, searchTerm).map((guide: Guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {guide.category}
                      </Badge>
                    </div>
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{guide.description}</CardDescription>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Book className="h-4 w-4" />
                      {guide.readTime} read
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {guide.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button size="sm" className="w-full">
                    <Book className="mr-2 h-4 w-4" />
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Checklists Tab */}
        <TabsContent value="checklists" className="space-y-4">
          <h2 className="text-xl font-semibold">Design Checklists</h2>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Checklists Coming Soon</h3>
            <p className="text-muted-foreground">
              We're working on comprehensive design checklists to help you deliver quality work.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}