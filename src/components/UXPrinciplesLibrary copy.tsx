"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function UXPrinciplesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");

  const principles = {
    usability: [
    {
      title: "Jakob's Law",
      description:
        "Users spend most of their time on other sites, so they prefer your site to work the same way as all the other sites they already know.",
      category: "Navigation",
      difficulty: "Beginner",
      url: "https://lawsofux.com/jakobs-law/"
    },
    {
      title: "Fitts's Law",
      description:
        "The time to acquire a target is a function of the distance to and size of the target.",
      category: "Interaction",
      difficulty: "Intermediate",
      url: "https://lawsofux.com/fittss-law/"
    },
    {
      title: "Miller's Rule",
      description:
        "The average person can only keep 7 (±2) items in their working memory.",
      category: "Information Architecture",
      difficulty: "Beginner",
      url: "https://lawsofux.com/millers-law/"
    }
  ],
     visual: [
    {
      title: "Law of Proximity",
      description:
        "Objects that are near, or proximate to each other, tend to be grouped together.",
      category: "Visual Hierarchy",
      difficulty: "Beginner",
      url: "https://lawsofux.com/law-of-proximity/"
    },
    {
      title: "Law of Similarity",
      description:
        "Elements that share similar visual characteristics are perceived as more related than elements that don't share those characteristics.",
      category: "Visual Hierarchy",
      difficulty: "Beginner",
      url: "https://lawsofux.com/law-of-similarity/"
    },
    {
      title: "Von Restorff Effect",
      description:
        "When multiple similar objects are present, the one that differs from the rest is most likely to be remembered.",
      category: "Attention",
      difficulty: "Intermediate",
      url: "https://lawsofux.com/von-restorff-effect/"
    }
  ],
  psychology: [
    {
      title: "Peak-End Rule",
      description:
        "People judge an experience largely based on how they felt at its peak and at its end.",
      category: "User Experience",
      difficulty: "Advanced",
      url: "https://lawsofux.com/peak-end-rule/"
    },
    {
      title: "Zeigarnik Effect",
      description:
        "People remember uncompleted or interrupted tasks better than completed tasks.",
      category: "Motivation",
      difficulty: "Advanced",
      url: "https://lawsofux.com/zeigarnik-effect/"
    },
    {
      title: "Serial Position Effect",
      description:
        "Users have a propensity to best remember the first and last items in a series.",
      category: "Memory",
      difficulty: "Intermediate",
      url: "https://lawsofux.com/serial-position-effect/"
    }
  ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterPrinciples = (principlesList: any[]) => {
    if (!searchTerm) return principlesList;
    return principlesList.filter(principle =>
      principle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      principle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      principle.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">UX Principles Library</h1>
        <p className="text-muted-foreground mb-6">
          Discover fundamental principles that guide effective user experience design.
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search principles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="usability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usability">Usability</TabsTrigger>
          <TabsTrigger value="visual">Visual Design</TabsTrigger>
          <TabsTrigger value="psychology">Psychology</TabsTrigger>
        </TabsList>

        <TabsContent value="usability" className="space-y-4">
          <h2 className="text-xl font-semibold">Usability Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterPrinciples(principles.usability).map((principle, index) => (
              
            <a
                key={index}
                href={principle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-blue-600 underline">
                    {principle.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(principle.difficulty)}>
                    {principle.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline">{principle.category}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {principle.description}
                </CardDescription>
              </CardContent>
            </Card>
            </a>

            ))}
          </div>
        </TabsContent>

        <TabsContent value="visual" className="space-y-4">
          <h2 className="text-xl font-semibold">Visual Design Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterPrinciples(principles.visual).map((principle, index) => (
              <a
                key={index}
                href={principle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-blue-600 underline">
                    {principle.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(principle.difficulty)}>
                    {principle.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline">{principle.category}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {principle.description}
                </CardDescription>
              </CardContent>
            </Card>
            </a>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="psychology" className="space-y-4">
          <h2 className="text-xl font-semibold">Psychology Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterPrinciples(principles.psychology).map((principle, index) => (
              <a
                key={index}
                href={principle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-blue-600 underline">
                    {principle.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(principle.difficulty)}>
                    {principle.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline">{principle.category}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {principle.description}
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