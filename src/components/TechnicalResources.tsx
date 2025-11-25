"use client";

import { JSX, useState } from "react";
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
  Monitor,
  Figma,
  Zap,
  Book,
  Settings,
  GraduationCap,
  Building2,
  Globe,
  Users,
} from "lucide-react";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type ElearningAudience = "universities" | "corporate" | "creators";

interface Tool {
  name: string;
  description: string;
  category: string;
  type: string;
  price: string;
  rating: number;
  website: string;
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
  href?: string;
}

interface Guide {
  title: string;
  description: string;
  category: string;
  readTime: string;
  difficulty: Difficulty;
  tags: string[];
  href?: string;
}

interface ElearningPlatform {
  name: string;
  description: string;
  type: string;
  audience: ElearningAudience[];
  bestFor: string;
  website: string;
  source: "EvolMind" | "Comparapps";
  tags: string[];
}

interface UXSite {
  name: string;
  description: string;
  focus: string;
  url: string;
  tags: string[];
}

interface CommunityLink {
  name: string;
  description: string;
  url: string;
  tags: string[];
}

interface CommunityCategory {
  id: string;
  label: string;
  description: string;
  accentClass: string;
  icon: JSX.Element;
  links: CommunityLink[];
}

const GUIDE_BASE_PATH = "/guides";

/* ========= Shared helpers ========= */

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-50 text-emerald-800 border-0";
    case "Intermediate":
      return "bg-amber-50 text-amber-800 border-0";
    case "Advanced":
      return "bg-rose-50 text-rose-800 border-0";
    default:
      return "bg-slate-50 text-slate-800 border-0";
  }
};

const filterItems = (items: any[], term: string) => {
  if (!term.trim()) return items;
  const lowered = term.toLowerCase();
  return items.filter((item) => {
    const haystack =
      (item.name ?? "") +
      (item.title ?? "") +
      (item.description ?? "") +
      (item.category ?? "") +
      (item.bestFor ?? "") +
      (item.focus ?? "");
    const inMain = haystack.toLowerCase().includes(lowered);
    const inTags = (item.tags ?? []).some((tag: string) =>
      tag.toLowerCase().includes(lowered)
    );
    return inMain || inTags;
  });
};

/* ========= Data: tools, templates, guides ========= */

const tools: Tool[] = [
  {
    name: "Figma",
    description: "Collaborative interface design tool for teams.",
    category: "Design",
    type: "Web App",
    price: "Free / Paid",
    rating: 4.8,
    website: "https://www.figma.com",
    icon: <Figma className="h-6 w-6 text-pink-500" />,
    tags: ["prototyping", "collaboration", "design-systems"],
  },
  {
    name: "Framer",
    description: "Interactive prototyping tool with code components.",
    category: "Prototyping",
    type: "Web App",
    price: "Free / Paid",
    rating: 4.6,
    website: "https://www.framer.com",
    icon: <Zap className="h-6 w-6 text-violet-500" />,
    tags: ["prototyping", "animation", "interactive"],
  },
  {
    name: "Miro",
    description: "Online whiteboard for user journeys, flows and workshops.",
    category: "Collaboration",
    type: "Web App",
    price: "Free / Paid",
    rating: 4.7,
    website: "https://miro.com",
    icon: <Monitor className="h-6 w-6 text-amber-500" />,
    tags: ["workshops", "user-journeys", "remote-collaboration"],
  },
  {
    name: "Notion",
    description: "All-in-one workspace for documentation and product specs.",
    category: "Product",
    type: "Web App",
    price: "Free / Paid",
    rating: 4.6,
    website: "https://www.notion.so",
    icon: <FileText className="h-6 w-6 text-sky-500" />,
    tags: ["documentation", "specs", "knowledge-base"],
  },
  {
    name: "Adobe XD",
    description: "UX/UI design tool for websites and mobile apps.",
    category: "Design",
    type: "Desktop App",
    price: "Free / Paid",
    rating: 4.3,
    website: "https://www.adobe.com/products/xd.html",
    icon: <Palette className="h-6 w-6 text-fuchsia-500" />,
    tags: ["design", "prototyping"],
  },
  {
    name: "Sketch",
    description: "Vector-based design tool for digital products.",
    category: "Design",
    type: "Desktop App (macOS)",
    price: "Paid",
    rating: 4.5,
    website: "https://www.sketch.com",
    icon: <Settings className="h-6 w-6 text-lime-500" />,
    tags: ["design", "vector", "mac-only"],
  },
];

const templates: Template[] = [
  {
    name: "Mobile App Wireframe Kit",
    description:
      "A starter kit with mobile wireframes for typical screens (onboarding, dashboard, course view, etc.).",
    category: "Wireframes",
    format: "Figma",
    downloads: 2450,
    tags: ["mobile", "wireframes", "components"],
    href: "https://www.figma.com/community?tab=files&query=mobile%20wireframe",
  },
  {
    name: "Dashboard UI Kit",
    description: "Modern dashboard components for analytics, tasks and progress tracking.",
    category: "UI Kits",
    format: "Figma / Sketch",
    downloads: 1890,
    tags: ["dashboard", "admin", "charts"],
    href: "https://www.figma.com/community?tab=files&query=dashboard%20ui%20kit",
  },
  {
    name: "Learning Platform Landing Page",
    description:
      "Landing page templates for universities or course creators promoting online programs.",
    category: "Marketing",
    format: "Figma",
    downloads: 1320,
    tags: ["landing-page", "education", "responsive"],
    href: "https://www.figma.com/community?tab=files&query=e-learning%20landing%20page",
  },
  {
    name: "UX Research Plan",
    description: "A simple Notion / Google Docs template to plan research for your EVA.",
    category: "Research",
    format: "Notion / Docs",
    downloads: 980,
    tags: ["research", "eva", "planning"],
    href: "https://www.notion.so/templates/search?query=ux%20research%20plan",
  },
];

const guides: Guide[] = [
  {
    title: "Complete Guide to Design Systems",
    description: "How to create and maintain a scalable design system for your product or EVA.",
    category: "Design Systems",
    readTime: "25 min",
    difficulty: "Intermediate",
    tags: ["design-systems", "components", "documentation"],
    href: `${GUIDE_BASE_PATH}/design-systems-intro`,
  },
  {
    title: "Mobile UX Design Principles",
    description: "Key principles for designing mobile-first learning experiences.",
    category: "Mobile Design",
    readTime: "15 min",
    difficulty: "Beginner",
    tags: ["mobile", "ux-principles", "best-practices"],
    href: `${GUIDE_BASE_PATH}/mobile-ux-principles`,
  },
  {
    title: "Accessibility in Digital Learning",
    description:
      "How to design inclusive online learning experiences that meet WCAG recommendations.",
    category: "Accessibility",
    readTime: "30 min",
    difficulty: "Intermediate",
    tags: ["a11y", "wcag", "inclusive-design"],
    href: `${GUIDE_BASE_PATH}/accessibility-basics`,
  },
  {
    title: "Designing EVAs (Virtual Learning Environments)",
    description:
      "From LMS structure to student flows: UX patterns for virtual learning environments.",
    category: "E-learning UX",
    readTime: "35 min",
    difficulty: "Intermediate",
    tags: ["eva", "lms", "ux-patterns"],
    href: `${GUIDE_BASE_PATH}/eva-ux-foundations`,
  },
  {
    title: "User Research Methods for Education",
    description:
      "An overview of qualitative and quantitative methods tailored to learning contexts.",
    category: "Research",
    readTime: "40 min",
    difficulty: "Advanced",
    tags: ["user-research", "interviews", "surveys"],
    href: `${GUIDE_BASE_PATH}/user-research-methods`,
  },
];

/* ========= Data: e-learning platforms ========= */

const elearningPlatforms: ElearningPlatform[] = [
  // Universities & schools (EvolMind)
  {
    name: "Moodle",
    description:
      "Open-source LMS widely used by universities and schools worldwide; highly customisable but requires technical administration.",
    type: "Open-source LMS",
    audience: ["universities"],
    bestFor:
      "Universities or institutions with an internal IT team who want full control and extensibility.",
    website: "https://moodle.org",
    source: "EvolMind",
    tags: ["open-source", "lms", "universities"],
  },
  {
    name: "Open edX",
    description:
      "Open-source platform co-founded by MIT and Harvard, designed for large-scale MOOCs and professional programs.",
    type: "Open-source LMS / MOOC",
    audience: ["universities"],
    bestFor:
      "Universities that want to run MOOCs or large online programs with strong analytics.",
    website: "https://openedx.org",
    source: "EvolMind",
    tags: ["open-source", "mooc", "universities"],
  },
  {
    name: "Canvas LMS",
    description:
      "Cloud and open-source options with a modern interface and a very active higher-education community.",
    type: "Commercial + open-source LMS",
    audience: ["universities"],
    bestFor:
      "Universities and colleges that value usability, integrations and a strong community.",
    website: "https://www.instructure.com/canvas",
    source: "EvolMind",
    tags: ["lms", "universities", "integrations"],
  },
  {
    name: "Blackboard Learn",
    description:
      "Enterprise LMS focused on large universities and institutions, robust but usually licensed at a higher cost.",
    type: "Commercial LMS",
    audience: ["universities"],
    bestFor: "Large universities or institutions that need a robust, enterprise-level LMS.",
    website: "https://www.anthology.com/blackboard-learn",
    source: "EvolMind",
    tags: ["enterprise", "universities", "assessment"],
  },
  {
    name: "Google Classroom",
    description:
      "Lightweight classroom tool included in Google Workspace for Education, suitable for blended learning.",
    type: "Classroom tool",
    audience: ["universities"],
    bestFor:
      "Schools and universities already using Google Workspace who need simple virtual classrooms.",
    website: "https://classroom.google.com",
    source: "EvolMind",
    tags: ["schools", "google-workspace", "blended-learning"],
  },
  // Corporate & organisations (EvolMind)
  {
    name: "evolCampus",
    description:
      "Cloud-based commercial LMS focused on companies and training centres, with quick setup and FUNDAE compliance.",
    type: "Commercial LMS (SaaS)",
    audience: ["corporate"],
    bestFor:
      "Training centres, consultancies and organisations that need a turnkey LMS in Spanish.",
    website: "https://www.evolmind.com",
    source: "EvolMind",
    tags: ["corporate", "smb", "spanish"],
  },
  {
    name: "Docebo",
    description:
      "Enterprise SaaS LMS with strong reputation for corporate training and AI-powered experiences.",
    type: "Commercial LMS",
    audience: ["corporate"],
    bestFor:
      "Medium and large companies that need advanced features for employee, partner or customer training.",
    website: "https://www.docebo.com",
    source: "EvolMind",
    tags: ["enterprise", "ai", "corporate"],
  },
  {
    name: "Cornerstone LMS",
    description:
      "Talent experience platform that combines LMS and LXP, oriented to large organisations and skills development.",
    type: "Commercial LMS / TXP",
    audience: ["corporate"],
    bestFor:
      "Large organisations that want to link learning with talent management and performance.",
    website: "https://www.cornerstoneondemand.com",
    source: "EvolMind",
    tags: ["enterprise", "talent", "lxp"],
  },
  // Independent creators & academies (Comparapps)
  {
    name: "Thinkific",
    description:
      "All-in-one platform to create, sell and manage online courses with templates, quizzes and memberships.",
    type: "Online course platform",
    audience: ["creators"],
    bestFor:
      "Independent course creators or small academies that want to sell courses under their own brand.",
    website: "https://www.thinkific.com",
    source: "Comparapps",
    tags: ["creators", "memberships", "ecommerce"],
  },
  {
    name: "Podia",
    description:
      "Platform for courses, memberships, digital products and webinars, aimed at solo creators.",
    type: "Online course platform",
    audience: ["creators"],
    bestFor:
      "Creators who want to sell courses and digital products without many technical complications.",
    website: "https://www.podia.com",
    source: "Comparapps",
    tags: ["creators", "digital-products", "memberships"],
  },
  {
    name: "Teachable",
    description:
      "Course platform with a large creator base and built-in payments, coupons and sales pages.",
    type: "Online course platform",
    audience: ["creators"],
    bestFor:
      "Instructors who want to launch and validate courses quickly with integrated payments.",
    website: "https://teachable.com",
    source: "Comparapps",
    tags: ["creators", "payments", "landing-pages"],
  },
  {
    name: "LearnWorlds",
    description:
      "Highly customisable platform for academies with interactive video and detailed learner analytics.",
    type: "Online course platform",
    audience: ["creators", "corporate"],
    bestFor: "Online schools that want more control over branding and learner analytics.",
    website: "https://www.learnworlds.com",
    source: "Comparapps",
    tags: ["academies", "analytics", "interactive-video"],
  },
  {
    name: "LearnDash",
    description:
      "Premium WordPress LMS plugin to build courses directly on your own website.",
    type: "WordPress LMS plugin",
    audience: ["creators", "corporate"],
    bestFor: "Teams already on WordPress who want full control over the site and checkout.",
    website: "https://www.learndash.com",
    source: "Comparapps",
    tags: ["wordpress", "plugin", "creators"],
  },
  {
    name: "Tutor LMS",
    description:
      "WordPress LMS plugin with a generous free tier and features for running an online academy.",
    type: "WordPress LMS plugin",
    audience: ["creators"],
    bestFor:
      "WordPress-based academies that need a flexible LMS with a free starting plan.",
    website: "https://www.themeum.com/product/tutor-lms/",
    source: "Comparapps",
    tags: ["wordpress", "plugin", "academies"],
  },
];

/* ========= Data: UX “serious” sites + communities ========= */

const recognizedUxSites: UXSite[] = [
  {
    name: "Nielsen Norman Group (NN/g)",
    description:
      "In-depth UX research articles, evidence-based guidelines and classic UX literature used worldwide.",
    focus: "Research-based UX guidelines and evaluation methods.",
    url: "https://www.nngroup.com",
    tags: ["ux-research", "usability", "evaluation"],
  },
  {
    name: "Interaction Design Foundation",
    description:
      "Online UX education, with structured courses, encyclopedic articles and a strong design community.",
    focus: "UX education, theory and design foundations.",
    url: "https://www.interaction-design.org",
    tags: ["ux-education", "theory", "community"],
  },
  {
    name: "Baymard Institute",
    description:
      "Large-scale UX benchmarking focused on e-commerce, checkout flows and form usability.",
    focus: "E-commerce UX audits and best practices.",
    url: "https://baymard.com",
    tags: ["ecommerce", "forms", "research"],
  },
  {
    name: "Smashing Magazine (UX & Design)",
    description:
      "Practical articles on UX, UI, front-end and accessibility written by practitioners.",
    focus: "Applied UX, front-end and accessibility.",
    url: "https://www.smashingmagazine.com/category/uxdesign",
    tags: ["ux", "frontend", "accessibility"],
  },
  {
    name: "A List Apart",
    description:
      "Essays and articles exploring the design, development and meaning of the web.",
    focus: "Web design, standards and content.",
    url: "https://alistapart.com",
    tags: ["web-design", "content", "standards"],
  },
  {
    name: "UXPA International",
    description:
      "Professional association for UX practitioners, with conferences, resources and career support.",
    focus: "Professional UX practice and networking.",
    url: "https://uxpa.org",
    tags: ["professional", "events", "career"],
  },
];

const communityCategories: CommunityCategory[] = [
  {
    id: "ux",
    label: "UX & Product Design communities",
    description: "Spaces focused on UX, UI and product design discussions.",
    accentClass:
      "border-indigo-100 bg-gradient-to-b from-indigo-50/80 via-white to-white",
    icon: <Users className="h-5 w-5 text-indigo-600" />,
    links: [
      {
        name: "UX Collective (Medium)",
        description:
          "One of the largest design publications on Medium, with case studies, patterns and essays on UX and product.",
        url: "https://uxdesign.cc/",
        tags: ["ux", "product-design", "case-studies"],
      },
      {
        name: "UX Planet",
        description:
          "Publication focused on UX practice, interaction design and product thinking.",
        url: "https://uxplanet.org/",
        tags: ["ux", "ux-writing", "research"],
      },
      {
        name: "Bootcamp (by UX Collective)",
        description:
          "Content aimed at growing designers: portfolios, hiring, and early-career advice.",
        url: "https://bootcamp.uxdesign.cc/",
        tags: ["career", "portfolio", "mentoring"],
      },
      {
        name: "Medium.Design",
        description:
          "Landing page that collects several design publications on Medium (UX Collective, UX Planet, and others).",
        url: "https://medium.design/",
        tags: ["design", "medium", "articles"],
      },
    ],
  },
  {
    id: "instructional-design",
    label: "Instructional Design & eLearning communities",
    description: "Communities for instructional designers and eLearning practitioners.",
    accentClass:
      "border-emerald-100 bg-gradient-to-b from-emerald-50/80 via-white to-white",
    icon: <Book className="h-5 w-5 text-emerald-600" />,
    links: [
      {
        name: "Instructional Design Central (IDC)",
        description:
          "Global community with resources, templates and forums for instructional designers.",
        url: "https://www.instructionaldesigncentral.com/instructionaldesigncommunity",
        tags: ["instructional-design", "community"],
      },
      {
        name: "Articulate E-Learning Heroes",
        description:
          "Forums and resources for building courses with Articulate and sharing best practices.",
        url: "https://community.articulate.com/",
        tags: ["elearning", "articulate", "storyline"],
      },
      {
        name: "eLearning Academy Community",
        description: "Community for new instructional designers and eLearning developers.",
        url: "https://community.elearningacademy.io/home",
        tags: ["elearning", "career", "networking"],
      },
      {
        name: "The Learning Guild",
        description:
          "Community of practice focused on learning design, strategy and organizational learning.",
        url: "https://www.learningguild.com/",
        tags: ["learning-design", "events", "conference"],
      },
    ],
  },
  {
    id: "edtech-eva",
    label: "Pedagogy, EdTech & EVA communities",
    description:
      "Communities around LMS, MOOCs and pedagogical design for virtual learning environments (EVAs).",
    accentClass: "border-rose-100 bg-gradient-to-b from-rose-50/80 via-white to-white",
    icon: <Globe className="h-5 w-5 text-rose-600" />,
    links: [
      {
        name: "Moodle Community",
        description:
          "Official Moodle forums and community spaces to discuss plugins, best practices and support.",
        url: "https://moodle.org/community/",
        tags: ["lms", "moodle", "community"],
      },
      {
        name: "Instructure Community (Canvas LMS)",
        description:
          "Official Canvas community with product ideas, forums and resources for teachers.",
        url: "https://community.canvaslms.com/",
        tags: ["canvas", "lms", "edtech"],
      },
      {
        name: "Open edX Community",
        description:
          "Open community for people designing courses and platforms based on Open edX.",
        url: "https://openedx.org/community/",
        tags: ["open-edx", "moocs", "open-source"],
      },
      {
        name: "Online Learning Consortium (OLC)",
        description:
          "Professional network focused on quality in online education and faculty development.",
        url: "https://onlinelearningconsortium.org/professional-learning/",
        tags: ["online-learning", "quality"],
      },
    ],
  },
];

/* ========= Main component ========= */

export function TechnicalResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAudience, setActiveAudience] = useState<ElearningAudience | "all">("all");

  const filteredTools = filterItems(tools, searchTerm) as Tool[];
  const filteredTemplates = filterItems(templates, searchTerm) as Template[];
  const filteredGuides = filterItems(guides, searchTerm) as Guide[];
  const filteredElearning = filterItems(
    elearningPlatforms.filter(
      (p) => activeAudience === "all" || p.audience.includes(activeAudience)
    ),
    searchTerm
  ) as ElearningPlatform[];
  const filteredUxSites = filterItems(recognizedUxSites, searchTerm) as UXSite[];

  const audienceLabel = (aud: ElearningAudience | "all") => {
    switch (aud) {
      case "universities":
        return "Universities & schools";
      case "corporate":
        return "Corporate & NGOs";
      case "creators":
        return "Independent creators & academies";
      default:
        return "All profiles";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Technical resources & e-learning platforms
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            A curated toolbox for UX, instructional design and virtual learning environments
            (EVAs): tools, templates, UX foundations, recognised sites, communities, and
            recommended LMS / course platforms.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources, platforms or communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="tools" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="foundations">UX Foundations</TabsTrigger>
          <TabsTrigger value="elearning">E-learning</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>

        {/* Tools tab */}
        <TabsContent value="tools" className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code className="h-5 w-5 text-sky-500" />
            Design & prototyping tools
          </h2>
          <p className="text-sm text-muted-foreground">
            Core tools to sketch, prototype and document your EVAs and digital products.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Card
                key={tool.name}
                className="h-full hover:shadow-md transition-shadow border-slate-100"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-50 p-2">{tool.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge className="mt-1 bg-sky-50 text-sky-800 border-0">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div className="font-medium">{tool.type}</div>
                      <div>
                        Rating:{" "}
                        <span className="font-semibold">{tool.rating.toFixed(1)}</span>/5
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {tool.price}
                    </Badge>
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-slate-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild size="sm" className="w-full justify-center gap-2 mt-1">
                    <a href={tool.website} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Visit site
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates tab */}
        <TabsContent value="templates" className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-pink-500" />
            Templates & starter kits
          </h2>
          <p className="text-sm text-muted-foreground">
            Reusable templates to speed up wireframing, dashboards and UX documentation for
            learning platforms.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.name}
                className="h-full hover:shadow-md transition-shadow border-pink-50"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center justify-between mt-1">
                    <Badge className="bg-pink-50 text-pink-800 border-0">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.format}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {template.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                  {template.href && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full justify-center gap-2 mt-1"
                    >
                      <a href={template.href} target="_blank" rel="noreferrer">
                        <FileText className="h-4 w-4" />
                        Open template
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* UX Foundations tab (full section) */}
        <TabsContent value="foundations" className="space-y-6">
          {/* Block 1: Recognised UX sites */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              UX Research & Design Foundations
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Recognised websites and organisations in the UX field that you can use as
              references for research, design and evaluation. These are solid sources when
              you need to justify decisions in your thesis or when documenting UX patterns
              for EVAs.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUxSites.map((site) => (
                <Card
                  key={site.url}
                  className="h-full hover:shadow-md transition-shadow border-slate-100"
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Book className="h-5 w-5 text-sky-600" />
                      {site.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {site.focus}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-sm">
                      {site.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {site.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-slate-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full justify-center gap-2 mt-1">
                      <a href={site.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Visit website
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Block 2: Guidelines / guides */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Guidelines & learning guides</h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Internal guides that synthesise UX and instructional design guidelines for
              designing and evaluating EVAs.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((guide) => (
                <Card
                  key={guide.title}
                  className="h-full hover:shadow-md transition-shadow border-violet-50"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {guide.readTime}
                      </span>
                      <Badge className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {guide.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-violet-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {guide.href && (
                      <Button asChild size="sm" className="w-full justify-center gap-2 mt-1">
                        <a href={guide.href}>
                          <ExternalLink className="h-4 w-4" />
                          Open guide
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* E-learning platforms tab */}
        <TabsContent value="elearning" className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              E-learning platforms (LMS & course platforms)
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Platforms recommended in specialised reviews (EvolMind &amp; Comparapps) for
              delivering online courses and EVAs. Use the filters to focus on universities,
              organisations or independent course creators.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "universities", "corporate", "creators"] as const).map((aud) => (
              <Button
                key={aud}
                variant={activeAudience === aud ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setActiveAudience(aud as ElearningAudience | "all")}
              >
                {audienceLabel(aud as ElearningAudience | "all")}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredElearning.map((platform) => (
              <Card
                key={platform.name}
                className="h-full hover:shadow-md transition-shadow border-emerald-50 bg-gradient-to-b from-white to-emerald-50/40"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                        {platform.name}
                      </CardTitle>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {platform.audience.includes("universities") && (
                          <Badge className="bg-emerald-50 text-emerald-800 border-0 text-xs">
                            Universities & schools
                          </Badge>
                        )}
                        {platform.audience.includes("corporate") && (
                          <Badge className="bg-sky-50 text-sky-800 border-0 text-xs">
                            Corporate & NGOs
                          </Badge>
                        )}
                        {platform.audience.includes("creators") && (
                          <Badge className="bg-rose-50 text-rose-800 border-0 text-xs">
                            Independent creators
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[11px]">
                        {platform.type}
                      </Badge>
                      <div className="mt-1 text-[11px]">Source: {platform.source}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">{platform.description}</CardDescription>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Best for:</span> {platform.bestFor}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {platform.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-emerald-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild size="sm" className="w-full justify-center gap-2 mt-1">
                    <a href={platform.website} target="_blank" rel="noreferrer">
                      <Globe className="h-4 w-4" />
                      Visit website
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Communities tab */}
        <TabsContent value="communities" className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Communities & networks</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Communities where you can ask questions, share experiences and learn from
              other practitioners working on UX, instructional design and EVAs.
            </p>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {communityCategories.map((category) => {
                const hasSearch = searchTerm.trim().length > 0;
                const links = hasSearch
                  ? (filterItems(category.links, searchTerm) as CommunityLink[])
                  : category.links;

                if (hasSearch && links.length === 0) {
                  return null;
                }

                return (
                  <Card
                    key={category.id}
                    className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm ${category.accentClass}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-base">
                          {category.icon}
                          <span>{category.label}</span>
                        </span>
                        <Badge variant="outline" className="text-[11px]">
                          {links.length} links
                        </Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block rounded-xl border border-transparent bg-white/60 px-3 py-2 text-sm transition-colors hover:border-current/10 hover:bg-white"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium leading-snug group-hover:underline">
                              {link.name}
                            </span>
                            <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                          </div>
                          <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                            {link.description}
                          </p>
                          {link.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {link.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-[10px] font-normal"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ========= Small local icon ========= */

function ClockIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={props.className}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7.5v4.25l2.25 2.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
