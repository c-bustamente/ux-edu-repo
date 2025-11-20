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
      { title: "NN/g — Faceted Search", url: "https://www.nngroup.com/articles/mobile-faceted-search/" }// no funciona el link ---> existe el mobile facted search pero no el web
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
      { title: "Design patterns for building online courses in a virtual learning environment", url: "https://www.scielo.cl/scielo.php?pid=S0718-33052018000100157&script=sci_abstract&tlng=en" },//corresponde al articulo de pástor
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
      { title: "Five principles for MOOC design: With a case study", url: "https://www.researchgate.net/publication/298712549_Five_principles_for_MOOC_design_With_a_case_study" },// no funciona el link
      { title: "Hew, K. F., Qiao, C., & Tang, Y. (2018). Understanding Student Engagement in Large-Scale Open Online Courses", url: "https://doi.org/10.19173/irrodl.v19i3.3596" }
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
      { title: "Zhao et al. (2021) — Synchronous Online Learning Collaboration", url: "https://doi.org/10.1007/s10639-021-10452-5" },// no funciona el link
      { title: "NN/g — Virtual Classroom UX", url: "https://www.nngroup.com/articles/virtual-classroom-experience/" }// no funciona el link
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
      { title: "NN/g — Dashboards: Making Charts and Graphs Easier to Understand", url: "https://www.nngroup.com/articles/dashboards-preattentive/" },//
      { title: "ASTD — Maximize the Value of Learning Analytics", url: "https://www.td.org/content/talent-development-leader/maximize-the-value-of-learning-analytics" } //es un link general
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
      { title: "Emerging Practice of Blended Learning", url: "https://www.researchgate.net/publication/258477665_Emerging_practice_and_research_in_blended_learning" },
      { title: "Chapter 11. Designing Blended Learning Space to the Student Experience", url: "https://www.educause.edu/research-and-publications/books/learning-spaces/chapter-11-designing-blended-learning-space-student-experience" }// 
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
      { title: "Children Digital Libraries and User Interfaces: Proposing a Set of Criteria", url: "https://www.researchgate.net/publication/287611098_Children_Digital_Libraries_and_User_Interfaces_Proposing_a_Set_of_Criteria" }//

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
      { title: "Supporting Power User Isn’t Enough: 3 Complex-App User Types", url: "https://www.nngroup.com/articles/complex-apps-users//" } //
    ]
  }
];
