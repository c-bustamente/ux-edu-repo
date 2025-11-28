"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Users, Wrench, Zap, Library } from "lucide-react";

export function MainPage() {
  const features = [
    {
      href: "/principles",
      icon: BookOpen,
      title: "UX Educational Platform",
      description: "Comprehensive collection of fundamental UX design principles and guidelines.",
      color: "text-blue-600",
    },
    {
      href: "/patterns",
      icon: Library,
      title: "Pattern Repository",
      description: "Curated library of proven UI/UX patterns and design solutions.",
      color: "text-green-600",
    },
    {
      href: "/generator",
      icon: Zap,
      title: "Recommendation Generator",
      description: "Get personalized recommendations based on your project needs.",
      color: "text-purple-600",
    },
    {
      href: "/resources",
      icon: Wrench,
      title: "Technical Resources",
      description: "Tools, templates, and technical references for implementation.",
      color: "text-red-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to UX Educational Repository</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your comprehensive platform for learning and mastering user experience design for educational purposes.
          Explore principles, patterns, and best practices that will elevate your design skills.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols- gap-6 mb-12">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4">
          <div className="text-3xl font-bold text-primary">30+</div>
          <div className="text-sm text-muted-foreground">UX Principles</div>
        </div>
        <div className="text-center p-4">
          <div className="text-3xl font-bold text-primary">50+</div>
          <div className="text-sm text-muted-foreground">Design Patterns</div>
        </div>
        <div className="text-center p-4">
          <div className="text-3xl font-bold text-primary">100+</div>
          <div className="text-sm text-muted-foreground">Recommendations</div>
        </div>
        <div className="text-center p-4">
          <div className="text-3xl font-bold text-primary">30+</div>
          <div className="text-sm text-muted-foreground">Tools & Resources</div>
        </div>
      </div>
    </div>
  );
}
