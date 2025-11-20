// patternRepo.ts
// Unified data model for PatternRepository.tsx

export type UsageLevel = "High" | "Medium" | "Low" | "Unknown";
export type ComplexityLevel = "High" | "Medium" | "Low" | "Unknown";

export type Relationships = {
  ui?: string[];               // IDs of related UI patterns
  instructional?: string[];    // Titles/IDs of instructional patterns
  pedagogical?: string[];      // Titles/IDs of pedagogical patterns
  uxPrinciples?: string[];     // Names of UX principles
};

export type BasePattern = {
  id: string;
  type: "ui" | "instructional" | "pedagogical";
  title: string;
  description: string;
  tags: string[];
  usage?: UsageLevel;
  complexity?: ComplexityLevel;
  relationships?: Relationships;
  sources?: { title: string; url: string }[];
  exampleId?: string;
};

export type UISubcategory =
  | "Getting Input"
  | "Navigation"
  | "Dealing with Data"
  | "Onboarding"
  | "Social";

export type UIPattern = BasePattern & {
  type: "ui";
  subcategory: UISubcategory;
};

export type InstructionalPattern = BasePattern & {
  type: "instructional";
  // frameworkRef?: string; // keep available if you need later
};

export type PedagogicalPattern = BasePattern & {
  type: "pedagogical";
  // frameworkRef?: string; // keep available if you need later
};

export type PatternRepositoryData = {
  ui: Record<UISubcategory, UIPattern[]>;
  instructional: InstructionalPattern[];
  pedagogical: PedagogicalPattern[];
};

export const patterns: PatternRepositoryData = {
  ui: {
    /** ========================== GETTING INPUT ========================== */
    "Getting Input": [
      {
        id: "ui-input-feedback",
        type: "ui",
        subcategory: "Getting Input",
        title: "Input Feedback",
        description:
          "Show immediate feedback when users enter or submit data (clear inline success confirmations or error messages next to fields). Reduces errors and clarifies outcomes.",
        usage: "High",
        complexity: "Low",
        tags: ["immediate-feedback", "data-validation"],
        relationships: {
          instructional: ["Immediate Feedback", "Clear Instructions"],
          pedagogical: ["Behaviorism (Reinforcement)"],
          uxPrinciples: ["Visibility of System Status", "Error Prevention"],
          ui: ["ui-autocomplete", "ui-good-defaults"],
        },
        sources: [{ title: "UI-Patterns: Input Feedback", url: "https://ui-patterns.com/patterns/InputFeedback" }],
        exampleId: "ExampleInputFeedback",
      },
      {
        id: "ui-wizard",
        type: "ui",
        subcategory: "Getting Input",
        title: "Wizard",
        description:
          "A guided multi-step sequence that breaks a complex task into manageable stages. Shows progress and orients the user until completion.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["step-by-step-assistant", "multistep-form"],
        relationships: {
          instructional: ["Modular Structure", "Clear Instructions"],
          pedagogical: ["Scaffolding (Bruner)"],
          uxPrinciples: ["Progressive Disclosure", "Recognition over Recall"],
          ui: ["ui-completeness-meter", "ui-progressive-disclosure"],
        },
        sources: [{ title: "UI-Patterns: Wizard", url: "https://ui-patterns.com/patterns/Wizard" }],
        exampleId: "ExampleWizard",
      },
      {
        id: "ui-inline-help-box",
        type: "ui",
        subcategory: "Getting Input",
        title: "Inline Help Box",
        description:
          "Contextual help embedded near the UI where it is needed. Ideal for onboarding; can be dismissed once understood.",
        usage: "Medium",
        complexity: "Low",
        tags: ["inline-help", "help-text"],
        relationships: {
          instructional: ["Clear Instructions", "Zero Block"],
          pedagogical: ["Guided Practice"],
          uxPrinciples: ["Help and Documentation", "Reduce Frustration"],
          ui: ["ui-coachmarks", "ui-guided-tour"],
        },
        sources: [{ title: "UI-Patterns: Inline Help Box", url: "https://ui-patterns.com/patterns/InlineHelpBox" }],
        exampleId: "ExampleInlineHelpBox",
      },
      {
        id: "ui-completeness-meter",
        type: "ui",
        subcategory: "Getting Input",
        title: "Completeness Meter",
        description:
          "A progress indicator (bar or percentage) that shows how much of a task/profile is complete, motivating users to finish.",
        usage: "High",
        complexity: "Low",
        tags: ["progress-bar", "percent-complete"],
        relationships: {
          instructional: ["Immediate Feedback"],
          pedagogical: ["Goal Setting / Motivation"],
          uxPrinciples: ["Clear Goals", "Visibility of System Status"],
          ui: ["ui-wizard", "ui-dashboard"],
        },
        sources: [{ title: "UI-Patterns: Completeness Meter", url: "https://ui-patterns.com/patterns/CompletenessMeter" }],
        exampleId: "ExampleCompletenessMeter",
      },
      {
        id: "ui-good-defaults",
        type: "ui",
        subcategory: "Getting Input",
        title: "Good Defaults",
        description:
          "Smart default values in fields or settings that speed up completion and reduce initial effort; users can accept or adjust.",
        usage: "High",
        complexity: "Low",
        tags: ["default-values", "preset-configuration"],
        relationships: {
          instructional: ["Clear Instructions"],
          pedagogical: ["Cognitive Load Reduction"],
          uxPrinciples: ["Minimize Cognitive Load", "Flexibility and Efficiency of Use"],
          ui: ["ui-autocomplete"],
        },
        sources: [{ title: "UI-Patterns: Good Defaults", url: "https://ui-patterns.com/patterns/GoodDefaults" }],
        exampleId: "ExampleGoodDefaults",
      },
    ],

    /** ============================ NAVIGATION ============================ */
    Navigation: [
      {
        id: "ui-breadcrumbs",
        type: "ui",
        subcategory: "Navigation",
        title: "Breadcrumbs",
        description:
          "A hierarchical navigation trail that reveals the current location and the path back to parent sections.",
        usage: "High",
        complexity: "Low",
        tags: ["hierarchical-navigation", "breadcrumbs"],
        relationships: {
          instructional: ["Zero Block"],
          pedagogical: ["Advance Organizers"],
          uxPrinciples: ["Navigation", "Match between System and the Real World"],
          ui: ["ui-navigation-tabs"],
        },
        sources: [{ title: "UI-Patterns: Breadcrumbs", url: "https://ui-patterns.com/patterns/Breadcrumbs" }],
        exampleId: "ExampleBreadcrumbs",
      },
      {
        id: "ui-notifications",
        type: "ui",
        subcategory: "Navigation",
        title: "Notifications",
        description:
          "Alerts that inform users about important events (messages, updates, deadlines) across the product. Prompts timely action.",
        usage: "High",
        complexity: "Medium",
        tags: ["notifications", "alerts"],
        relationships: {
          instructional: ["Immediate Feedback"],
          pedagogical: ["Motivational Feedback Loops"],
          uxPrinciples: ["Visibility of System Status", "Timely Information"],
          ui: ["ui-activity-stream", "ui-collectible-achievements"],
        },
        sources: [{ title: "UI-Patterns: Notifications", url: "https://ui-patterns.com/patterns/notifications" }],
        exampleId: "ExampleNotifications",
      },
      {
        id: "ui-navigation-tabs",
        type: "ui",
        subcategory: "Navigation",
        title: "Navigation Tabs",
        description:
          "Labeled tabs that switch among primary sections. The active tab is highlighted to indicate current context.",
        usage: "High",
        complexity: "Low",
        tags: ["navigation-tabs", "flat-navigation"],
        relationships: {
          instructional: ["Resource Diversification"],
          pedagogical: [],
          uxPrinciples: ["Consistency and Standards", "Feedback"],
          ui: ["ui-breadcrumbs"],
        },
        sources: [{ title: "UI-Patterns: Navigation Tabs", url: "https://ui-patterns.com/patterns/NavigationTabs" }],
        exampleId: "ExampleNavigationTabs",
      },
      {
        id: "ui-progressive-disclosure",
        type: "ui",
        subcategory: "Navigation",
        title: "Progressive Disclosure",
        description:
          "Show essentials first and reveal advanced options on demand to avoid overwhelming users and keep focus.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["progressive-disclosure", "show-more"],
        relationships: {
          instructional: ["Modular Structure"],
          pedagogical: ["Scaffolding (Bruner)"],
          uxPrinciples: ["Aesthetic and Minimalist Design", "Progressive Disclosure"],
          ui: ["ui-wizard"],
        },
        sources: [{ title: "UI-Patterns: Progressive Disclosure", url: "https://ui-patterns.com/patterns/ProgressiveDisclosure" }],
        exampleId: "ExampleProgressiveDisclosure",
      },
      {
        id: "ui-adaptable-view",
        type: "ui",
        subcategory: "Navigation",
        title: "Adaptable View",
        description:
          "Controls to adjust content presentation (font size, high-contrast themes, device-specific layouts). Improves accessibility and comfort.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["adaptable-view", "accessibility-options"],
        relationships: {
          instructional: ["Resource Diversification"],
          pedagogical: ["Universal Design for Learning (UDL)"],
          uxPrinciples: ["Accessibility", "Personalization"],
          ui: ["ui-dashboard"],
        },
        sources: [{ title: "UI-Patterns: Adaptable View", url: "https://ui-patterns.com/patterns/AdaptableView" }],
        exampleId: "ExampleAdaptableView",
      },
    ],

    /** ========================= DEALING WITH DATA ======================== */
    "Dealing with Data": [
      {
        id: "ui-autocomplete",
        type: "ui",
        subcategory: "Dealing with Data",
        title: "Autocomplete",
        description:
          "A text field that surfaces suggestions in real time as the user types, reducing effort and typos.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["autocomplete", "dynamic-suggestions"],
        relationships: {
          instructional: [],
          pedagogical: [],
          uxPrinciples: ["Efficiency", "Recognition rather than Recall"],
          ui: ["ui-search-filters", "ui-good-defaults"],
        },
        sources: [{ title: "UI-Patterns: Autocomplete", url: "https://ui-patterns.com/patterns/Autocomplete" }],
        exampleId: "ExampleAutocomplete",
      },
      {
        id: "ui-search-filters",
        type: "ui",
        subcategory: "Dealing with Data",
        title: "Search Filters",
        description:
          "Filtering controls to refine results by criteria (category, date, tag). Ideally updates are immediate.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["search-filters", "advanced-search"],
        relationships: {
          instructional: [],
          pedagogical: [],
          uxPrinciples: ["User Control and Freedom", "Efficiency"],
          ui: ["ui-autocomplete", "ui-dashboard"],
        },
        sources: [{ title: "UI-Patterns: Live Filter", url: "https://ui-patterns.com/patterns/LiveFilter" }],
        exampleId: "ExampleSearchFilters",
      },
      {
        id: "ui-dashboard",
        type: "ui",
        subcategory: "Dealing with Data",
        title: "Dashboard",
        description:
          "A control panel view that aggregates key metrics and status at a glance (progress, grades, deadlines).",
        usage: "High",
        complexity: "High",
        tags: ["dashboard", "control-panel"],
        relationships: {
          instructional: ["Formative and Summative Assessment", "Immediate Feedback"],
          pedagogical: ["Self-Regulated Learning (Zimmerman)"],
          uxPrinciples: ["Overview First, Details on Demand", "Information Prioritization"],
          ui: ["ui-completeness-meter", "ui-search-filters"],
        },
        sources: [{ title: "UI-Patterns: Dashboard", url: "https://ui-patterns.com/patterns/dashboard" }],
        exampleId: "ExampleDashboard",
      },
    ],

    /** =============================== SOCIAL ============================= */
    Social: [
      {
        id: "ui-leaderboard",
        type: "ui",
        subcategory: "Social",
        title: "Leaderboard",
        description:
          "A ranking table that highlights top performers (scores, participation). Adds a competitive element that can motivate.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["leaderboard", "ranking"],
        relationships: {
          instructional: ["Formative and Summative Assessment"],
          pedagogical: ["Motivation / Gamification"],
          uxPrinciples: ["Social Proof", "Rewards"],
          ui: ["ui-collectible-achievements"],
        },
        sources: [{ title: "UI-Patterns: Leaderboard", url: "https://ui-patterns.com/patterns/leaderboard" }],
        exampleId: "ExampleLeaderboard",
      },
      {
        id: "ui-collectible-achievements",
        type: "ui",
        subcategory: "Social",
        title: "Collectible Achievements",
        description:
          "Badges or achievements earned by reaching milestones. Public recognition incentivizes progress and participation.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["achievements", "badges"],
        relationships: {
          instructional: ["Formative and Summative Assessment"],
          pedagogical: ["Behaviorism (Reinforcement)"],
          uxPrinciples: ["Rewards", "Engagement"],
          ui: ["ui-leaderboard", "ui-notifications"],
        },
        sources: [{ title: "UI-Patterns: Collectible Achievements", url: "https://ui-patterns.com/patterns/CollectibleAchievements" }],
        exampleId: "ExampleCollectibleAchievements",
      },
      {
        id: "ui-activity-stream",
        type: "ui",
        subcategory: "Social",
        title: "Activity Stream",
        description:
          "A chronological feed of relevant updates across the platform (posts, new resources, earned badges).",
        usage: "Medium",
        complexity: "Medium",
        tags: ["activity-feed", "news"],
        relationships: {
          instructional: ["Discussion Forum"],
          pedagogical: ["Community of Practice"],
          uxPrinciples: ["Situational Awareness", "Real-Time Information"],
          ui: ["ui-notifications"],
        },
        sources: [{ title: "UI-Patterns: Activity Stream", url: "https://ui-patterns.com/patterns/ActivityStream" }],
        exampleId: "ExampleActivityStream",
      },
      {
        id: "ui-chat",
        type: "ui",
        subcategory: "Social",
        title: "Chat",
        description:
          "Built-in instant messaging for real-time questions, informal discussion, or quick support without leaving the platform.",
        usage: "High",
        complexity: "High",
        tags: ["chat", "messaging"],
        relationships: {
          instructional: ["Discussion Forum"],
          pedagogical: ["Collaborative Learning", "Synchronous Communication"],
          uxPrinciples: ["Immediate Interaction", "Social Presence"],
          ui: ["ui-reaction"],
        },
        sources: [{ title: "UI-Patterns: Direct Messaging", url: "https://ui-patterns.com/patterns/direct-messaging" }],
        exampleId: "ExampleChat",
      },
      {
        id: "ui-reaction",
        type: "ui",
        subcategory: "Social",
        title: "Reaction",
        description:
          "One-click feedback such as like buttons or emoji reactions. Enables lightweight participation and signals content reception.",
        usage: "Medium",
        complexity: "Low",
        tags: ["reactions", "like"],
        relationships: {
          instructional: ["Formative and Summative Assessment"],
          pedagogical: ["Peer Recognition"],
          uxPrinciples: ["Simplicity", "Lightweight Engagement"],
          ui: ["ui-activity-stream"],
        },
        sources: [{ title: "UI-Patterns: Reaction", url: "https://ui-patterns.com/patterns/reaction" }],
        exampleId: "ExampleReaction",
      },
    ],

    /** ============================== ONBOARDING ========================== */
    Onboarding: [
      {
        id: "ui-coachmarks",
        type: "ui",
        subcategory: "Onboarding",
        title: "Coachmarks",
        description:
          "Overlay hints that highlight key UI elements, often on first visit, with brief explanatory text.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["coachmarks", "instructional-overlay"],
        relationships: {
          instructional: ["Zero Block", "Clear Instructions"],
          pedagogical: [],
          uxPrinciples: ["Learnability", "Reduce Learning Curve"],
          ui: ["ui-guided-tour", "ui-inline-help-box"],
        },
        sources: [{ title: "UI-Patterns: Coachmarks", url: "https://ui-patterns.com/patterns/coachmarks" }],
        exampleId: "ExampleCoachmarks",
      },
      {
        id: "ui-guided-tour",
        type: "ui",
        subcategory: "Onboarding",
        title: "Guided Tour",
        description:
          "An interactive walkthrough that provides just-in-time tips as users explore the app for the first time. Skippable.",
        usage: "Medium",
        complexity: "Medium",
        tags: ["guided-tour", "interactive-tutorial"],
        relationships: {
          instructional: ["Zero Block"],
          pedagogical: [],
          uxPrinciples: ["Learnability", "Contextual Assistance"],
          ui: ["ui-coachmarks", "ui-inline-help-box"],
        },
        sources: [{ title: "UI-Patterns: Guided Tour", url: "https://ui-patterns.com/patterns/Guided-tour" }],
        exampleId: "ExampleGuidedTour",
      },
      {
        id: "ui-blank-slate",
        type: "ui",
        subcategory: "Onboarding",
        title: "Blank Slate",
        description:
          "Thoughtful empty-state design with guidance, examples, or calls to action so new users know what to do first.",
        usage: "High",
        complexity: "Low",
        tags: ["empty-state", "first-run-screen"],
        relationships: {
          instructional: ["Zero Block", "Clear Instructions"],
          pedagogical: [],
          uxPrinciples: ["Clarity of Communication", "Expectation Setting"],
          ui: ["ui-guided-tour"],
        },
        sources: [{ title: "UI-Patterns: Blank Slate", url: "https://ui-patterns.com/patterns/BlankSlate" }],
        exampleId: "ExampleBlankSlate",
      },
    ],
  },

  /** =========================== INSTRUCTIONAL =========================== */
  instructional: [
    {
    id: "inst-zero-block", // PD01
    type: "instructional",
    title: "Course Main Screen (Zero Block)",
    description:
      "Welcome, objectives, key links (social/technical forum), and user guides to orient learners from the start.",
    usage: "High",
    complexity: "Low",
    tags: ["onboarding", "orientation", "initial-navigation", "discoverability"],
    relationships: {
      instructional: ["inst-resources", "inst-forum", "inst-evaluations"],
      pedagogical: ["Initial Motivation", "Metacognitive Awareness"],
      uxPrinciples: ["Visibility of System Status", "Match between System and the Real World", "Recognition Rather Than Recall"],
      ui: ["ui-blank-slate", "ui-coachmarks", "ui-inline-help-box"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleZeroBlock",
  },
  {
    id: "inst-resources", // PD02
    type: "instructional",
    title: "Course Resource Design",
    description:
      "Standardize formats, metadata, and accessibility of resources for a consistent learning experience.",
    usage: "High",
    complexity: "Medium",
    tags: ["resources", "consistency", "accessibility", "multimedia"],
    relationships: {
      instructional: ["inst-zero-block", "inst-evaluations"],
      pedagogical: ["Dual Coding (Paivio)", "Multimedia Learning (Mayer)", "UDL"],
      uxPrinciples: ["Consistency and Standards", "Aesthetic and Minimalist Design", "Accessibility"],
      ui: ["ui-adaptable-view", "ui-navigation-tabs"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleResourceDesign",
  },
  {
    id: "inst-glossary", // PD03
    type: "instructional",
    title: "Glossary",
    description:
      "Collaborative construction of terms and examples to consolidate key course vocabulary.",
    usage: "Medium",
    complexity: "Low",
    tags: ["vocabulary", "collaboration", "definitions", "examples"],
    relationships: {
      instructional: ["inst-forum", "inst-wiki"],
      pedagogical: ["Peer Learning", "Social Knowledge Building", "Constructivism"],
      uxPrinciples: ["User Control and Freedom", "Help and Documentation"],
      ui: ["ui-activity-stream"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleGlossary",
  },
  {
    id: "inst-assignments", // PD04
    type: "instructional",
    title: "Assignments",
    description:
      "Tasks with clear objectives, rubrics, deadlines, and feedback channels.",
    usage: "High",
    complexity: "Medium",
    tags: ["assignments", "rubrics", "criteria", "submissions"],
    relationships: {
      instructional: ["inst-evaluations", "inst-zero-block"],
      pedagogical: ["Scaffolding (Bruner)", "Mastery Learning (Bloom)"],
      uxPrinciples: ["Error Prevention", "Help Users Recognize and Recover", "Visibility of System Status"],
      ui: ["ui-inline-help-box", "ui-dashboard", "ui-notifications"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleAssignments",
  },
  {
    id: "inst-forum", // PD05
    type: "instructional",
    title: "Forum",
    description:
      "Moderated discussions and topic threads to foster social and academic interaction.",
    usage: "Medium",
    complexity: "Medium",
    tags: ["discussion", "collaboration", "community", "social-interaction"],
    relationships: {
      instructional: ["inst-glossary", "inst-wiki", "inst-chat"],
      pedagogical: ["Social Constructivism (Vygotsky)", "Peer Interaction"],
      uxPrinciples: ["Flexibility and Efficiency of Use", "Consistency and Standards"],
      ui: ["ui-activity-stream", "ui-reaction", "ui-chat"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleForum",
  },
  {
    id: "inst-evaluations", // PD06
    type: "instructional",
    title: "Assessments (Formative and Summative)",
    description:
      "Combine ongoing and cumulative assessments with transparent criteria and timely feedback.",
    usage: "High",
    complexity: "High",
    tags: ["assessment", "formative", "summative", "feedback"],
    relationships: {
      instructional: ["inst-assignments", "inst-zero-block"],
      pedagogical: ["Mastery Learning (Bloom)", "Feedback Loops"],
      uxPrinciples: ["Visibility of System Status", "User Control and Freedom"],
      ui: ["ui-dashboard", "ui-notifications", "ui-completeness-meter"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleAssessments",
  },
  {
    id: "inst-scorm-objects", // PD07
    type: "instructional",
    title: "SCORM Objects",
    description:
      "Integration of SCORM learning objects with traceability and technical interoperability.",
    usage: "Medium",
    complexity: "High",
    tags: ["scorm", "interoperability", "tracking", "packages"],
    relationships: {
      instructional: ["inst-resources", "inst-evaluations"],
      pedagogical: ["Learning Analytics"],
      uxPrinciples: ["Reliability and Standards", "Visibility of System Status"],
      ui: ["ui-dashboard"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleScormObjects",
  },
  {
    id: "inst-wiki", // PD08
    type: "instructional",
    title: "Wiki",
    description:
      "Collaborative authoring and editing of content with version history and roles.",
    usage: "Medium",
    complexity: "Medium",
    tags: ["co-creation", "documentation", "versioning", "collaboration"],
    relationships: {
      instructional: ["inst-forum", "inst-glossary"],
      pedagogical: ["Collaborative Learning", "Knowledge Building"],
      uxPrinciples: ["User Control and Freedom", "Consistency and Standards"],
      ui: ["ui-activity-stream"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleWiki",
  },
  {
    id: "inst-chat", // PD09
    type: "instructional",
    title: "Chat",
    description:
      "Synchronous communication for quick support and coordination.",
    usage: "Medium",
    complexity: "Low",
    tags: ["synchronous", "messaging", "coordination", "quick-support"],
    relationships: {
      instructional: ["inst-forum", "inst-zero-block"],
      pedagogical: ["Immediate Feedback (social)", "Teacher Presence"],
      uxPrinciples: ["Visibility of System Status", "Flexibility and Efficiency of Use"],
      ui: ["ui-chat", "ui-notifications"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleChatInstructional",
  },
  {
    id: "inst-games", // PD10
    type: "instructional",
    title: "Games",
    description:
      "Playful resources aligned with learning objectives, with clear rules and feedback.",
    usage: "Low",
    complexity: "Medium",
    tags: ["gamification", "motivation", "playful", "clear-objectives"],
    relationships: {
      instructional: ["inst-evaluations"],
      pedagogical: ["Operant Conditioning (Skinner)", "Flow (Csikszentmihalyi)"],
      uxPrinciples: ["Feedback", "Clear System Status"],
      ui: ["ui-reaction", "ui-completeness-meter"]
    },
    sources: [
      {
        title: "Patrones de diseño para la construcción de cursos on-line en un entorno virtual de aprendizaje",
        url: "https://www.scielo.cl/pdf/ingeniare/v26n1/0718-3305-ingeniare-26-01-00157.pdf"
      }
    ],
    exampleId: "ExampleGames",
  }
  ],

  /** =========================== PEDAGOGICAL ============================= */
  pedagogical: [
    {
      id: "ped-early-bird",
      type: "pedagogical",
      title: "Early Bird",
      description:
        "Present key concepts at the very start to foreground them and maintain attention throughout learning.",
      usage: "High",
      complexity: "Low",
      tags: ["orientation", "prioritization", "motivation"],
      relationships: {
        instructional: ["Zero Block", "Modular Structure"],
        pedagogical: ["Advance Organizers"],
        uxPrinciples: ["Jakob's Law", "Goal-Gradient Effect"],
        ui: ["ui-blank-slate"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleEarlyBird",
    },
    {
      id: "ped-spiral",
      type: "pedagogical",
      title: "Spiral",
      description:
        "Revisit core concepts periodically, increasing complexity and depth over time.",
      usage: "High",
      complexity: "Medium",
      tags: ["iteration", "scaffolding", "reinforcement"],
      relationships: {
        instructional: ["Modular Structure", "Exposition–Construction–Verification"],
        pedagogical: ["Spiral Curriculum (Bruner)"],
        uxPrinciples: ["Progressive Disclosure"],
        ui: ["ui-progressive-disclosure"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleSpiral",
    },
    {
      id: "ped-consistent-metaphor",
      type: "pedagogical",
      title: "Consistent Metaphor",
      description:
        "Use a coherent metaphor across the course to aid comprehension and build a stable mental model.",
      usage: "Medium",
      complexity: "Low",
      tags: ["metaphor", "consistency", "clarity"],
      relationships: {
        instructional: ["Zero Block"],
        pedagogical: ["Constructivism"],
        uxPrinciples: ["Match between System and Real World", "Consistency and Standards"],
        ui: [],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleConsistentMetaphor",
    },
    {
      id: "ped-toy-box",
      type: "pedagogical",
      title: "Toy Box",
      description:
        "Offer simple examples and sandbox-style exercises for free exploration and experimentation.",
      usage: "Medium",
      complexity: "Medium",
      tags: ["examples", "exploration", "experiment"],
      relationships: {
        instructional: ["Complementary Resources / Library"],
        pedagogical: ["Discovery Learning"],
        uxPrinciples: ["User Control and Freedom", "Flexibility and Efficiency of Use"],
        ui: ["ui-blank-slate"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleToyBox",
    },
    {
      id: "ped-tool-box",
      type: "pedagogical",
      title: "Tool Box",
      description:
        "Provide students with reusable tools, templates, and resources to support task completion.",
      usage: "High",
      complexity: "Medium",
      tags: ["resources", "support", "reusability"],
      relationships: {
        instructional: ["Complementary Resources / Library"],
        pedagogical: ["Self-Regulated Learning"],
        uxPrinciples: ["Consistency and Standards", "Recognition rather than Recall"],
        ui: ["ui-dashboard"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleToolBox",
    },
    {
      id: "ped-lay-of-the-land",
      type: "pedagogical",
      title: "Lay of the Land",
      description:
        "Present an overview of course structure and learning objectives to orient learners from the outset.",
      usage: "High",
      complexity: "Low",
      tags: ["orientation", "overview", "navigation"],
      relationships: {
        instructional: ["Zero Block"],
        pedagogical: ["Advance Organizers"],
        uxPrinciples: ["Visibility of System Status", "Navigation"],
        ui: ["ui-breadcrumbs"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleLayOfTheLand",
    },
    {
      id: "ped-fixer-upper",
      type: "pedagogical",
      title: "Fixer Upper",
      description:
        "Invite learners to improve or extend partial solutions to deepen understanding by repairing gaps or flaws.",
      usage: "Medium",
      complexity: "Medium",
      tags: ["practice", "revision", "scaffolding"],
      relationships: {
        instructional: ["Clear Instructions"],
        pedagogical: ["Learning by Doing"],
        uxPrinciples: ["Error Prevention", "Help Users Recover from Errors"],
        ui: ["ui-input-feedback"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleFixerUpper",
    },
    {
      id: "ped-larger-than-life",
      type: "pedagogical",
      title: "Larger Than Life",
      description:
        "Frame course topics with inspiring or authentic contexts to capture motivation and highlight real-world importance.",
      usage: "Medium",
      complexity: "Low",
      tags: ["context", "relevance", "motivation"],
      relationships: {
        instructional: ["Zero Block"],
        pedagogical: ["Situated Learning"],
        uxPrinciples: ["Match between System and Real World"],
        ui: [],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleLargerThanLife",
    },
    {
      id: "ped-student-design-sprint",
      type: "pedagogical",
      title: "Student Design Sprint",
      description:
        "Ask students to rapidly design a solution or prototype, encouraging creativity and iteration.",
      usage: "Medium",
      complexity: "Medium",
      tags: ["active-learning", "project-based", "iteration"],
      relationships: {
        instructional: ["Modular Structure", "Exposition–Construction–Verification"],
        pedagogical: ["Project-Based Learning"],
        uxPrinciples: ["Flexibility and Efficiency of Use"],
        ui: ["ui-wizard"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleStudentDesignSprint",
    },
    {
      id: "ped-mistake",
      type: "pedagogical",
      title: "Mistake",
      description:
        "Use errors as learning opportunities; encourage analyzing and correcting mistakes collaboratively.",
      usage: "High",
      complexity: "Medium",
      tags: ["error-analysis", "reflection", "learning-from-errors"],
      relationships: {
        instructional: ["Immediate Feedback"],
        pedagogical: ["Reflective Practice", "Constructivism"],
        uxPrinciples: ["Error Prevention", "Help Users Recover from Errors"],
        ui: ["ui-input-feedback"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleMistake",
    },
    {
      id: "ped-test-tube",
      type: "pedagogical",
      title: "Test Tube",
      description:
        "Provide a safe environment for experimentation where students can try ideas without fear of failure.",
      usage: "Medium",
      complexity: "Medium",
      tags: ["experiment", "safe-space", "exploration"],
      relationships: {
        instructional: ["Complementary Resources / Library"],
        pedagogical: ["Discovery Learning"],
        uxPrinciples: ["User Control and Freedom"],
        ui: ["ui-blank-slate"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleTestTube",
    },
    {
      id: "ped-fill-in-the-blanks",
      type: "pedagogical",
      title: "Fill in the Blanks",
      description:
        "Provide incomplete solutions or texts for learners to complete, reinforcing active learning via guided practice.",
      usage: "High",
      complexity: "Low",
      tags: ["scaffolding", "partial-solution", "practice"],
      relationships: {
        instructional: ["Clear Instructions"],
        pedagogical: ["Scaffolding", "Guided Discovery"],
        uxPrinciples: ["Recognition rather than Recall"],
        ui: [],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleFillInTheBlanks",
    },
    {
      id: "ped-gold-star",
      type: "pedagogical",
      title: "Gold Star",
      description:
        "Recognize and publicly share excellent work to motivate and set quality standards for the class.",
      usage: "Medium",
      complexity: "Low",
      tags: ["feedback", "motivation", "reward"],
      relationships: {
        instructional: ["Formative and Summative Assessment", "Immediate Feedback"],
        pedagogical: ["Behaviorism (Reinforcement)"],
        uxPrinciples: ["Visibility of System Status", "Feedback"],
        ui: ["ui-leaderboard", "ui-collectible-achievements", "ui-notifications"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleGoldStar",
    },
    {
      id: "ped-grade-it-again-sam",
      type: "pedagogical",
      title: "Grade It Again Sam",
      description:
        "Allow students to revise and resubmit work after feedback, fostering reflection and improvement.",
      usage: "High",
      complexity: "Medium",
      tags: ["assessment", "revision", "feedback"],
      relationships: {
        instructional: ["Formative and Summative Assessment"],
        pedagogical: ["Mastery Learning"],
        uxPrinciples: ["Feedback", "User Control and Freedom"],
        ui: ["ui-completeness-meter"],
      },
      sources: [{ title: "Pedagogical Patterns (Bergin)", url: "http://csis.pace.edu/~bergin/PedPat1.3.html" }],
      exampleId: "ExampleGradeItAgainSam",
    },
  ],
};
