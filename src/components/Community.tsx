"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageSquare, Heart, Share2, TrendingUp, Users, Clock, Plus } from "lucide-react";

export function Community() {
  const discussions = [
    {
      id: 1,
      title: "Best practices for mobile navigation design",
      author: "Sarah Chen",
      avatar: "SC",
      timeAgo: "2 hours ago",
      category: "Mobile UX",
      replies: 12,
      likes: 24,
      tags: ["mobile", "navigation", "best-practices"],
      preview: "I've been working on a mobile app and struggling with the navigation structure. What are your go-to patterns for..."
    },
    {
      id: 2,
      title: "Accessibility considerations for color-blind users",
      author: "Marcus Johnson",
      avatar: "MJ",
      timeAgo: "5 hours ago",
      category: "Accessibility",
      replies: 8,
      likes: 31,
      tags: ["accessibility", "color", "inclusive-design"],
      preview: "Recently learned that 8% of men have some form of color blindness. What strategies do you use to ensure your designs..."
    },
    {
      id: 3,
      title: "Typography hierarchy in dashboard design",
      author: "Elena Rodriguez",
      avatar: "ER",
      timeAgo: "1 day ago",
      category: "Visual Design",
      replies: 15,
      likes: 18,
      tags: ["typography", "dashboard", "hierarchy"],
      preview: "Working on a complex dashboard and having trouble establishing a clear typography hierarchy that doesn't feel overwhelming..."
    }
  ];

  const trendingTopics = [
    { name: "Dark Mode Design", posts: 45 },
    { name: "Micro-interactions", posts: 32 },
    { name: "Design Systems", posts: 28 },
    { name: "User Research", posts: 24 },
    { name: "Accessibility", posts: 19 }
  ];

  const featuredMembers = [
    { name: "Alex Kim", role: "Senior UX Designer", company: "Google", avatar: "AK", contributions: 142 },
    { name: "Maya Patel", role: "Design System Lead", company: "Airbnb", avatar: "MP", contributions: 98 },
    { name: "David Wilson", role: "UX Researcher", company: "Microsoft", avatar: "DW", contributions: 76 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Community Hub</h1>
        <p className="text-muted-foreground mb-6">
          Connect with fellow designers, share insights, and learn from the community.
        </p>
        <Button className="mb-6">
          <Plus className="mr-2 h-4 w-4" />
          Start New Discussion
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback>{discussion.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight">{discussion.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>{discussion.author}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {discussion.timeAgo}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{discussion.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3 line-clamp-2">
                      {discussion.preview}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {discussion.likes}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Trending Discussions</h3>
                <p className="text-muted-foreground">
                  Discover the hottest topics and most active discussions in the community.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="unanswered" className="space-y-4">
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Help Others</h3>
                <p className="text-muted-foreground">
                  These discussions are looking for answers. Share your expertise!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Members</span>
                <span className="font-medium">12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Today</span>
                <span className="font-medium">342</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discussions</span>
                <span className="font-medium">2,156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Solved Questions</span>
                <span className="font-medium">1,892</span>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{topic.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {topic.posts}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Featured Members */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Members</CardTitle>
              <CardDescription>Top contributors this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredMembers.map((member, index) => (
                <div key={index}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.role} at {member.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.contributions}
                    </Badge>
                  </div>
                  {index < featuredMembers.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}