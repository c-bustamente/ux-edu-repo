import { ReactNode } from "react";
import {
  MobileBottomNavExample,
  BreadcrumbExample,
  FacetedSearchExample,
  HighContrastExample,
  LmsModularStructureExample,
  MoocForumExample,
  RealTimeCollabExample,
  CorporateDashboardExample,
  BlendedHybridExample,
  ChildrenInterfaceExample,
  TechSavvyShortcutsExample,
  ResponsiveGridExample
} from "./examples";

export type Recommendation = {
  id: string;
  evaType?: "lms" | "mooc" | "virtual-classroom" | "corporate-training" | "blended";
  targetAudience?: "young-adults" | "professionals" | "elderly" | "children" | "tech-savvy" | "general";
  platform?: "web" | "mobile" | "tablet" | "responsive";
  feature?: string;
  category: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  patterns: string[];
  example?: ReactNode;
  reference: { title: string; url: string }[];
};

export const recommendationRules: Recommendation[] = [
  // ======================================================
  // PLATFORM-SPECIFIC
  // ======================================================
  {
    id: "platform-mobile-bottom-nav",
    platform: "mobile",
    category: "Navigation",
    title: "Use bottom navigation for primary actions",
    description:
      "Place key navigation at the bottom of the screen to improve reachability and thumb comfort on smartphones.",
    priority: "High",
    patterns: ["Bottom Navigation", "Tab Bar"],
    example: <MobileBottomNavExample />,
    reference: [
      { title: "Material Design 3 — Navigation Bar", url: "https://m3.material.io/components/navigation-bar/overview" },
      { title: "NN/g — Mobile UX Study Guide", url: "https://www.nngroup.com/articles/mobile-ux-study-guide/" }
    ]
  },
  {
    id: "platform-web-breadcrumbs",
    platform: "web",
    category: "Navigation",
    title: "Use breadcrumbs and course maps for orientation",
    description:
      "Provide breadcrumb navigation and course maps so learners can understand their location within complex course structures.",
    priority: "Medium",
    patterns: ["Breadcrumb Navigation", "Course Map"],
    example: <BreadcrumbExample />,
    reference: [
      { title: "NN/g — Breadcrumbs: 11 Design Guidelines", url: "https://www.nngroup.com/articles/breadcrumbs/" },
      { title: "Material Design — Navigation Overview", url: "https://m3.material.io/foundations/navigation/overview" }
    ]
  },
  {
    id: "platform-web-faceted-search",
    platform: "web",
    category: "Search",
    title: "Implement faceted search with autocomplete and filters",
    description:
      "Improve discoverability with faceted filters, categories, and live suggestions that guide learners through large repositories.",
    priority: "High",
    patterns: ["Autocomplete", "Faceted Search", "Search Filters"],
    example: <FacetedSearchExample />,
    reference: [
      { title: "NN/g — Site Search Suggestions", url: "https://www.nngroup.com/articles/site-search-suggestions/" },
      { title: "NN/g — Faceted Search", url: "https://www.nngroup.com/articles/faceted-search/" }
    ]
  },
  {
    id: "platform-responsive-grid",
    platform: "responsive",
    category: "Layout",
    title: "Ensure full responsiveness across devices",
    description:
      "Design flexible grids and content reflow mechanisms to maintain usability across screens and orientations.",
    priority: "High",
    patterns: ["Responsive Grid", "Fluid Containers", "Content Reflow"],
    example: <ResponsiveGridExample />,
    reference: [
      { title: "WCAG 2.1 — Understanding Reflow", url: "https://www.w3.org/WAI/WCAG21/Understanding/reflow.html" },
      { title: "Material Design 3 — Layout Basics", url: "https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout" }
    ]
  },

  // ======================================================
  // EVA TYPE-SPECIFIC
  // ======================================================
  {
    id: "lms-modular-structure",
    evaType: "lms",
    category: "Organization",
    title: "Structure content into clear learning modules",
    description:
      "Divide courses into sequential, goal-oriented modules with visible progress tracking to support pacing and reduce cognitive load.",
    priority: "High",
    patterns: ["Module Navigation", "Sequential Learning Path"],
    example: <LmsModularStructureExample />,
    reference: [
      { title: "Pástor et al. (2020) — Patterns in Instructional Design", url: "https://www.researchgate.net/publication/343857056_Patterns_in_Instructional_Design" },
      { title: "Instructional Design Models for Digital Learning (2024 Review)", url: "https://www.researchgate.net/publication/379238089_Instructional_Design_Models_for_Digital_Learning_in_Higher_Education" }
    ]
  },
  {
    id: "mooc-forum",
    evaType: "mooc",
    category: "Engagement",
    title: "Enable peer interaction through forums and feedback",
    description:
      "Encourage learner participation with discussion boards, peer reviews, and social features to sustain motivation at scale.",
    priority: "High",
    patterns: ["Discussion Forum", "Peer Review", "Upvoting System"],
    example: <MoocForumExample />,
    reference: [
      { title: "NN/g — Designing for Online Communities", url: "https://www.nngroup.com/articles/online-community-design/" },
      { title: "Hew & Cheung (2014) — Student Engagement in MOOCs", url: "https://doi.org/10.1016/j.iheduc.2014.10.005" }
    ]
  },
  {
    id: "virtualclassroom-collab",
    evaType: "virtual-classroom",
    category: "Interaction",
    title: "Enable real-time collaboration tools",
    description:
      "Provide collaborative whiteboards, breakout rooms, and live polls to foster synchronous interaction.",
    priority: "High",
    patterns: ["Collaborative Whiteboard", "Breakout Rooms", "Live Polls"],
    example: <RealTimeCollabExample />,
    reference: [
      { title: "Zhao et al. (2021) — Synchronous Online Learning Collaboration", url: "https://doi.org/10.1007/s10639-021-10452-5" },
      { title: "NN/g — Virtual Classroom UX", url: "https://www.nngroup.com/articles/virtual-classroom-experience/" }
    ]
  },
  {
    id: "corporate-dashboard",
    evaType: "corporate-training",
    category: "Tracking",
    title: "Provide dashboards for compliance and progress",
    description:
      "Include clear progress tracking and completion metrics for HR managers and employees to monitor compliance learning.",
    priority: "High",
    patterns: ["Progress Dashboard", "Completion Certificates"],
    example: <CorporateDashboardExample />,
    reference: [
      { title: "NN/g — Dashboard Design for Data and Metrics", url: "https://www.nngroup.com/articles/dashboard-design/" },
      { title: "ASTD — Learning Analytics for Workplace Training", url: "https://www.td.org/" }
    ]
  },
  {
    id: "blended-hybrid",
    evaType: "blended",
    category: "Integration",
    title: "Synchronize online and in-person learning experiences",
    description:
      "Offer hybrid scheduling tools and cross-modal communication channels to align physical and virtual learning.",
    priority: "High",
    patterns: ["Hybrid Scheduling", "Attendance Sync", "Discussion Continuity"],
    example: <BlendedHybridExample />,
    reference: [
      { title: "Graham (2013) — Emerging Practice of Blended Learning", url: "https://doi.org/10.1007/978-1-4614-3185-5_2" },
      { title: "Educause — Designing Blended Learning Experiences", url: "https://er.educause.edu/articles/2020/3/designing-effective-blended-learning" }
    ]
  },

  // ======================================================
  // AUDIENCE-SPECIFIC
  // ======================================================
  {
    id: "elderly-accessibility",
    targetAudience: "elderly",
    category: "Accessibility",
    title: "Increase text size and contrast for older adults",
    description:
      "Use large fonts, strong contrast, and simplified layouts to improve readability and reduce visual strain.",
    priority: "High",
    patterns: ["Large Text", "High Contrast Theme", "Simplified Layout"],
    example: <HighContrastExample />,
    reference: [
      { title: "WCAG 2.1 — Contrast & Readability", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" },
      { title: "NN/g — Designing for Senior Citizens", url: "https://www.nngroup.com/articles/usability-for-senior-citizens/" }
    ]
  },
  {
    id: "children-interface",
    targetAudience: "children",
    category: "UX",
    title: "Use playful visuals and large interactive elements",
    description:
      "Adopt colorful visuals, friendly icons, and oversized buttons to accommodate children’s motor and cognitive development.",
    priority: "High",
    patterns: ["Large Buttons", "Immediate Feedback", "Playful Colors"],
    example: <ChildrenInterfaceExample />,
    reference: [
      { title: "NN/g — UX Design for Children", url: "https://www.nngroup.com/reports/children-on-the-web/" },
      { title: "Read (2015) — Designing Digital Interfaces for Kids", url: "https://doi.org/10.1007/978-3-319-20916-6_1" }
    ]
  },
  {
    id: "techsavvy-shortcuts",
    targetAudience: "tech-savvy",
    category: "Efficiency",
    title: "Offer shortcuts and advanced filters for expert users",
    description:
      "Provide command palettes, keyboard shortcuts, and regex or tag-based filters for efficient navigation and data access.",
    priority: "Medium",
    patterns: ["Keyboard Shortcuts", "Advanced Filters", "Progressive Disclosure"],
    example: <TechSavvyShortcutsExample />,
    reference: [
      { title: "NN/g — Progressive Disclosure", url: "https://www.nngroup.com/articles/progressive-disclosure/" },
      { title: "NN/g — UX Patterns for Power Users", url: "https://www.nngroup.com/articles/power-users-ux/" }
    ]
  }
];
