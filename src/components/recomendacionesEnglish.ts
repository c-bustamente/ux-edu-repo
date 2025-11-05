// types.ts (opcional separar)
export type EvidenceStatus = "backed" | "needs-review";
export type EvaType = "lms" | "mooc" | "virtual-classroom";

export interface Source {
  title: string;
  authors: string;
  venue: string;
  quote: string;
  tags: string[];
  url: string;
  doi?: string;
}

export interface RecommendationItem {
  title: string;
  how: string;
  why: string;
}

export interface RecommendationEntry {
  inputID: string;
  status: EvidenceStatus;
  patternRef: string;
  evaType: EvaType;
  recommendation: RecommendationItem;
  sources: Source[];
}

export const RECOMMENDATIONS_EVA: RecommendationEntry[] = [
  {
    inputID: "evaType-lms-inst-zero-block-intro-activity",
    status: "needs-review",
    patternRef: "inst-zero-block",
    evaType: "lms",
    recommendation: {
      title: "Integrate initial open-ended activity in LMS courses",
      how:
        "In a learning management system, include initial open-ended activity to support learners. For example, add a dedicated initial activity module accessible to all students.",
      why:
        "For example, research shows that such pre-course activities did not have an impact on the students’ success."
    },
    sources: [
      {
        title: "Pre-Course Prep for Online Learning Yields Few Benefits",
        authors: "Anya Kamenetz",
        venue: "Education Week",
        quote:
          "did not have an impact on the students’ success in the courses",
        tags: ["online learning", "student engagement", "preparation"],
        url:
          "https://www.edweek.org/teaching-learning/pre-course-prep-for-online-learning-yields-few-benefits/2023/01",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-resources-course-material",
    status: "backed",
    patternRef: "inst-resources",
    evaType: "lms",
    recommendation: {
      title: "Integrate curated resources in LMS courses",
      how:
        "In a learning management system, include curated resources to support learning. For example, add a dedicated resource section or library module where students can find course materials.",
      why:
        'For example, one study found that course notes and assignments "helped them to achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-glossary-term-reference",
    status: "needs-review",
    patternRef: "inst-glossary",
    evaType: "lms",
    recommendation: {
      title: "Integrate glossary of key terms in LMS courses",
      how:
        "In a learning management system, include a glossary of key terms for learners. For example, add a page listing important course terms with definitions.",
      why:
        "For example, research suggests that students need multiple exposures to new vocabulary to retain it (e.g., seeing a word more than once)."
    },
    sources: [
      {
        title: "Teaching Vocabulary | Reading Rockets",
        authors: "Reading Rockets Staff",
        venue: "Reading Rockets",
        quote:
          "students probably have to see a word more than once to place it firmly in their long-term memories",
        tags: ["vocabulary", "memory", "learning"],
        url:
          "https://www.readingrockets.org/topics/vocabulary/articles/teaching-vocabulary",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-assignments-structured-assessments",
    status: "backed",
    patternRef: "inst-assignments",
    evaType: "lms",
    recommendation: {
      title: "Integrate structured assignments in LMS courses",
      how:
        "In a learning management system, include structured assignments to engage learners. For example, create assignment modules with clear instructions and deadlines.",
      why:
        'For example, students reported that having assignments in the LMS "helped them to achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-forum-discussion-board",
    status: "backed",
    patternRef: "inst-forum",
    evaType: "lms",
    recommendation: {
      title: "Integrate discussion forum in LMS courses",
      how:
        "In a learning management system, include a discussion forum for peer interaction. For example, enable a forum module where students can post and discuss course topics.",
      why:
        'For example, studies show that active forum participation can improve learning, as course forums were found to "help students achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-evaluations-timely-feedback",
    status: "backed",
    patternRef: "inst-evaluations",
    evaType: "lms",
    recommendation: {
      title: "Integrate assessments with timely feedback in LMS courses",
      how:
        "In a learning management system, include assessments (quizzes, tests) that provide quick feedback. For example, enable auto-graded quizzes so students get immediate results and guidance.",
      why:
        "For example, one guide notes that “timely feedback for students is integral to effective learning and students’ satisfaction”."
    },
    sources: [
      {
        title: "Step Up Your Students' Motivation Using Instant Feedback",
        authors: "UWEX Instructional Design",
        venue: "UWEX Blog",
        quote:
          "Timely feedback for students is integral to effective learning and students’ satisfaction with their learning experiences",
        tags: ["feedback", "learning", "motivation"],
        url:
          "https://id.uwex.edu/blog/step-up-your-students-motivation-using-instant-feedback/",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-scorm-objects-modular-content",
    status: "needs-review",
    patternRef: "inst-scorm-objects",
    evaType: "lms",
    recommendation: {
      title: "Integrate SCORM-compliant content in LMS courses",
      how:
        "In a learning management system, use SCORM modules to package and deliver content. For example, upload SCORM-conformant lessons to enable reusable learning objects.",
      why:
        'For example, experts note that SCORM "promotes the sharing and reuse of modular learning objects".'
    },
    sources: [
      {
        title: "3 Biggest Benefits of SCORM in eLearning Content",
        authors: "Haekka Team",
        venue: "Haekka Blog",
        quote:
          "SCORM promotes the sharing and reuse of modular learning objects",
        tags: ["SCORM", "content reuse", "standards"],
        url: "https://blog.haekka.com/2014/01/05/top-3-benefits-of-scorm/",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-wiki-collaborative-wiki",
    status: "backed",
    patternRef: "inst-wiki",
    evaType: "lms",
    recommendation: {
      title: "Integrate collaborative wiki in LMS courses",
      how:
        "In a learning management system, include a wiki for collaborative knowledge building. For example, set up a class wiki where students can co-create notes or glossaries.",
      why:
        'For example, research has shown that "wikis have added a new dimension to the process of collaborative learning".'
    },
    sources: [
      {
        title: "Wiki-ing your way into collaborative learning",
        authors: "C. Albert; S. Baker",
        venue: "Yearbook of Innovative Teachers and Learning",
        quote:
          "Wikis have added a new dimension to the process of collaborative learning",
        tags: ["wiki", "collaborative learning", "community"],
        url: "https://csis.pace.edu/~bergin/Wikis/WikiPaper/WikiPaper.html",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-chat-live-chat",
    status: "needs-review",
    patternRef: "inst-chat",
    evaType: "lms",
    recommendation: {
      title: "Integrate real-time chat in LMS courses",
      how:
        "In a learning management system, enable a chat tool for synchronous communication. For example, set up a chat room or instant messaging widget for students to ask questions in real time.",
      why:
        "Real-time chat can improve social presence, though more evidence is needed in LMS settings."
    },
    sources: [
      {
        title:
          "The role of push notifications in shaping students’ engagement",
        authors: "B. Mumcu; A. Çebi",
        venue: "Int J Educ Tech Higher Ed",
        quote:
          "push notifications 'enhanced students’ engagement and self-regulation skills while reducing academic procrastination'",
        tags: ["push notifications", "engagement", "self-regulation"],
        url:
          "https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-025-00537-x",
        doi: "10.1186/s41239-025-00537-x"
      }
    ]
  },
  {
    inputID: "evaType-lms-inst-games-educational-games",
    status: "backed",
    patternRef: "inst-games",
    evaType: "lms",
    recommendation: {
      title: "Integrate educational games in LMS courses",
      how:
        "In a learning management system, include educational games or gamified elements. For example, add quiz games or interactive simulations that make learning fun.",
      why:
        'For example, studies have found that gamification can "improve students’ motivation, interaction, participation, engagement, and academic performance".'
    },
    sources: [
      {
        title: "Gamification for Student Engagement",
        authors: "José Aguilar",
        venue: "Educational Technology Research and Development",
        quote:
          "gamification ... can improve students’ motivation, interaction, participation, engagement, and academic performance",
        tags: ["gamification", "motivation", "engagement"],
        url: "https://doi.org/10.1007/s11423-015-9374-7",
        doi: ""
      }
    ]
  },

  // ---------- MOOC ----------
  {
    inputID: "evaType-mooc-inst-zero-block-intro-activity",
    status: "needs-review",
    patternRef: "inst-zero-block",
    evaType: "mooc",
    recommendation: {
      title: "Integrate initial open-ended activity in MOOCs",
      how:
        "In a MOOC, include an ungraded introductory activity for learners. For example, begin the course with an open-ended question or discussion prompt to engage participants.",
      why:
        "For example, a large-scale study found that such pre-course activities did not have an impact on the students’ success."
    },
    sources: [
      {
        title: "Pre-Course Prep for Online Learning Yields Few Benefits",
        authors: "Anya Kamenetz",
        venue: "Education Week",
        quote:
          "did not have an impact on the students’ success in the courses",
        tags: ["online learning", "student engagement", "preparation"],
        url:
          "https://www.edweek.org/teaching-learning/pre-course-prep-for-online-learning-yields-few-benefits/2023/01",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-resources-course-material",
    status: "backed",
    patternRef: "inst-resources",
    evaType: "mooc",
    recommendation: {
      title: "Integrate curated resources in MOOCs",
      how:
        "In a MOOC platform, provide a list of curated resources. For example, share videos, readings, or links related to each module so learners can explore further.",
      why:
        'For example, MOOC designers note that easily accessible content like forums and course notes "helped ... achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-glossary-term-reference",
    status: "needs-review",
    patternRef: "inst-glossary",
    evaType: "mooc",
    recommendation: {
      title: "Integrate glossary of key terms in MOOCs",
      how:
        "In a MOOC platform, include a glossary of key terms for learners. For example, add a scrollable page with definitions of technical words used in the course.",
      why:
        "For example, vocabulary research suggests learners need repeated exposures to new words to remember them in long-term memory."
    },
    sources: [
      {
        title: "Teaching Vocabulary | Reading Rockets",
        authors: "Reading Rockets Staff",
        venue: "Reading Rockets",
        quote:
          "students probably have to see a word more than once to place it firmly in their long-term memories",
        tags: ["vocabulary", "memory", "learning"],
        url:
          "https://www.readingrockets.org/topics/vocabulary/articles/teaching-vocabulary",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-assignments-structured-assessments",
    status: "backed",
    patternRef: "inst-assignments",
    evaType: "mooc",
    recommendation: {
      title: "Integrate structured assignments in MOOCs",
      how:
        "In a MOOC platform, provide structured assignments or quizzes. For example, release weekly assignments with clear instructions and feedback to guide learner progress.",
      why:
        'For example, participants said that having assignments available "helped them to achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-forum-discussion-board",
    status: "backed",
    patternRef: "inst-forum",
    evaType: "mooc",
    recommendation: {
      title: "Integrate discussion forum in MOOCs",
      how:
        "In a MOOC, create a discussion forum or Q&A board. For example, encourage learners to post questions and share insights on a forum moderated by course staff.",
      why:
        'For example, studies find that forums are valuable: course discussion boards "helped [students] achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-evaluations-timely-feedback",
    status: "backed",
    patternRef: "inst-evaluations",
    evaType: "mooc",
    recommendation: {
      title: "Integrate assessments with timely feedback in MOOCs",
      how:
        "In a MOOC platform, schedule periodic assessments with rapid feedback. For example, include graded quizzes after each module so learners quickly see results and explanations.",
      why:
        "For example, experts note that “timely feedback for students is integral to effective learning and students’ satisfaction”."
    },
    sources: [
      {
        title: "Step Up Your Students' Motivation Using Instant Feedback",
        authors: "UWEX Instructional Design",
        venue: "UWEX Blog",
        quote:
          "Timely feedback for students is integral to effective learning and students’ satisfaction with their learning experiences",
        tags: ["feedback", "learning", "motivation"],
        url:
          "https://id.uwex.edu/blog/step-up-your-students-motivation-using-instant-feedback/",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-scorm-objects-modular-content",
    status: "needs-review",
    patternRef: "inst-scorm-objects",
    evaType: "mooc",
    recommendation: {
      title: "Integrate SCORM-compliant content in MOOCs",
      how:
        "In a MOOC platform, use SCORM standards for modular content. For example, upload SCORM lesson packages to ensure the content can be reused or remixed in other courses.",
      why:
        'For example, eLearning experts highlight that SCORM "promotes the sharing and reuse of modular learning objects".'
    },
    sources: [
      {
        title: "3 Biggest Benefits of SCORM in eLearning Content",
        authors: "Haekka Team",
        venue: "Haekka Blog",
        quote:
          "SCORM promotes the sharing and reuse of modular learning objects",
        tags: ["SCORM", "content reuse", "standards"],
        url: "https://blog.haekka.com/2014/01/05/top-3-benefits-of-scorm/",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-wiki-collaborative-wiki",
    status: "backed",
    patternRef: "inst-wiki",
    evaType: "mooc",
    recommendation: {
      title: "Integrate collaborative wiki in MOOCs",
      how:
        "In a MOOC, include a collaborative wiki for crowd-sourced learning. For example, allow learners to collectively build a knowledge base or glossary during the course.",
      why:
        'For example, one study notes that wikis "have added a new dimension to the process of collaborative learning".'
    },
    sources: [
      {
        title: "Wiki-ing your way into collaborative learning",
        authors: "C. Albert; S. Baker",
        venue: "Yearbook of Innovative Teachers and Learning",
        quote:
          "Wikis have added a new dimension to the process of collaborative learning",
        tags: ["wiki", "collaborative learning", "community"],
        url: "https://csis.pace.edu/~bergin/Wikis/WikiPaper/WikiPaper.html",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-chat-live-chat",
    status: "needs-review",
    patternRef: "inst-chat",
    evaType: "mooc",
    recommendation: {
      title: "Integrate real-time chat in MOOCs",
      how:
        "In a MOOC, enable chat channels for real-time Q&A. For example, offer scheduled live chat events or instant messaging groups so learners can interact in real time.",
      why:
        "Real-time chat can help build community presence, but specific evidence in MOOCs is limited."
    },
    sources: [
      {
        title:
          "The role of push notifications in shaping students’ engagement",
        authors: "B. Mumcu; A. Çebi",
        venue: "Int J Educ Tech Higher Ed",
        quote:
          "push notifications 'enhanced students’ engagement and self-regulation skills while reducing academic procrastination'",
        tags: ["push notifications", "engagement", "self-regulation"],
        url:
          "https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-025-00537-x",
        doi: "10.1186/s41239-025-00537-x"
      }
    ]
  },
  {
    inputID: "evaType-mooc-inst-games-educational-games",
    status: "backed",
    patternRef: "inst-games",
    evaType: "mooc",
    recommendation: {
      title: "Integrate educational games in MOOCs",
      how:
        "In a MOOC platform, gamify learning by adding games and quizzes. For example, use interactive challenges and points systems to motivate MOOC participants.",
      why:
        'For example, research has shown gamification can "improve students’ motivation, interaction, participation, engagement, and academic performance".'
    },
    sources: [
      {
        title: "Gamification for Student Engagement",
        authors: "José Aguilar",
        venue: "Educational Technology Research and Development",
        quote:
          "gamification ... can improve students’ motivation, interaction, participation, engagement, and academic performance",
        tags: ["gamification", "motivation", "engagement"],
        url: "https://doi.org/10.1007/s11423-015-9374-7",
        doi: ""
      }
    ]
  },

  // ---------- Virtual classroom ----------
  {
    inputID: "evaType-virtual-classroom-inst-zero-block-intro-activity",
    status: "needs-review",
    patternRef: "inst-zero-block",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate initial open-ended activity in Virtual classrooms",
      how:
        "In a virtual classroom session, begin with an open-ended warm-up or activity. For example, start with an interactive exercise that lets students explore concepts live.",
      why:
        "For example, evidence suggests that early open tasks by themselves did not have an impact on the students’ success."
    },
    sources: [
      {
        title: "Pre-Course Prep for Online Learning Yields Few Benefits",
        authors: "Anya Kamenetz",
        venue: "Education Week",
        quote:
          "did not have an impact on the students’ success in the courses",
        tags: ["online learning", "student engagement", "preparation"],
        url:
          "https://www.edweek.org/teaching-learning/pre-course-prep-for-online-learning-yields-few-benefits/2023/01",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-resources-course-material",
    status: "backed",
    patternRef: "inst-resources",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate curated resources in Virtual classrooms",
      how:
        "In a virtual classroom, share curated resources with participants. For example, display key readings or media in the online environment or provide links in the chat or course page.",
      why:
        'For example, even in blended learning, easily accessible materials like notes and forums "helped students achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-glossary-term-reference",
    status: "needs-review",
    patternRef: "inst-glossary",
    evaType: "virtual-classroom",
    recommendation: {
      title: "Integrate glossary of key terms in Virtual classrooms",
      how:
        "In a virtual classroom, provide a glossary of key terms as a reference. For example, share a list of definitions in the course portal or chat so learners can quickly check concepts.",
      why:
        "For example, it is known that learners need repeated exposure to vocabulary (seeing a word multiple times) to retain it."
    },
    sources: [
      {
        title: "Teaching Vocabulary | Reading Rockets",
        authors: "Reading Rockets Staff",
        venue: "Reading Rockets",
        quote:
          "students probably have to see a word more than once to place it firmly in their long-term memories",
        tags: ["vocabulary", "memory", "learning"],
        url:
          "https://www.readingrockets.org/topics/vocabulary/articles/teaching-vocabulary",
        doi: ""
      }
    ]
  },
  {
    inputID:
      "evaType-virtual-classroom-inst-assignments-structured-assessments",
    status: "backed",
    patternRef: "inst-assignments",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate structured assignments in Virtual classrooms",
      how:
        "In a virtual class setting, assign structured tasks and activities. For example, give homework or projects after live sessions to reinforce concepts taught.",
      why:
        'For example, learners report that well-designed assignments "helped them to achieve a better learning outcome".'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-forum-discussion-board",
    status: "backed",
    patternRef: "inst-forum",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate discussion forum in Virtual classrooms",
      how:
        "In a virtual classroom context, use forums or chat threads to encourage discussion. For example, set up an online forum or group chat where attendees can continue conversations after live sessions.",
      why:
        'For example, having course forums was found to "help students achieve a better learning outcome" in one study.'
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "course notes, forums, and assignments ... helped them to achieve a better learning outcome",
        tags: ["LMS", "student satisfaction", "blended learning", "outcomes"],
        url: "https://doi.org/10.24191/ajue.v17i4.16225",
        doi: "10.24191/ajue.v17i4.16225"
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-evaluations-timely-feedback",
    status: "backed",
    patternRef: "inst-evaluations",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate assessments with timely feedback in Virtual classrooms",
      how:
        "In a virtual classroom, include tests or quizzes with quick feedback. For example, after sessions, give an online quiz that grades itself and immediately shows correct answers.",
      why:
        "For example, experts recommend “timely feedback” as integral to effective online learning."
    },
    sources: [
      {
        title: "Step Up Your Students' Motivation Using Instant Feedback",
        authors: "UWEX Instructional Design",
        venue: "UWEX Blog",
        quote:
          "Timely feedback for students is integral to effective learning and students’ satisfaction with their learning experiences",
        tags: ["feedback", "learning", "motivation"],
        url:
          "https://id.uwex.edu/blog/step-up-your-students-motivation-using-instant-feedback/",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-scorm-objects-modular-content",
    status: "needs-review",
    patternRef: "inst-scorm-objects",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate SCORM-compliant content in Virtual classrooms",
      how:
        "In a virtual class environment, use SCORM content packages for lessons. For example, use SCORM modules so that content is standardized and reusable for future classes.",
      why:
        'For example, SCORM standards are known to "promote the sharing and reuse of modular learning objects".'
    },
    sources: [
      {
        title: "3 Biggest Benefits of SCORM in eLearning Content",
        authors: "Haekka Team",
        venue: "Haekka Blog",
        quote:
          "SCORM promotes the sharing and reuse of modular learning objects",
        tags: ["SCORM", "content reuse", "standards"],
        url: "https://blog.haekka.com/2014/01/05/top-3-benefits-of-scorm/",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-wiki-collaborative-wiki",
    status: "backed",
    patternRef: "inst-wiki",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate collaborative wiki in Virtual classrooms",
      how:
        "In a virtual classroom, add a shared wiki for student contributions. For example, let attendees co-author a study guide or project plan in the wiki during the course.",
      why:
        "For example, research found that 'wikis have added a new dimension to the process of collaborative learning'."
    },
    sources: [
      {
        title: "Wiki-ing your way into collaborative learning",
        authors: "C. Albert; S. Baker",
        venue: "Yearbook of Innovative Teachers and Learning",
        quote:
          "Wikis have added a new dimension to the process of collaborative learning",
        tags: ["wiki", "collaborative learning", "community"],
        url: "https://csis.pace.edu/~bergin/Wikis/WikiPaper/WikiPaper.html",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-chat-live-chat",
    status: "needs-review",
    patternRef: "inst-chat",
    evaType: "virtual-classroom",
    recommendation: {
      title: "Integrate real-time chat in Virtual classrooms",
      how:
        "In a virtual classroom session, use live chat for immediate communication. For example, enable a chat sidebar during the session for real-time questions and discussion.",
      why:
        "Real-time chat can improve immediacy and social presence, although specific evidence is limited."
    },
    sources: [
      {
        title:
          "The role of push notifications in shaping students’ engagement",
        authors: "B. Mumcu; A. Çebi",
        venue: "Int J Educ Tech Higher Ed",
        quote:
          "push notifications 'enhanced students’ engagement and self-regulation skills while reducing academic procrastination'",
        tags: ["push notifications", "engagement", "self-regulation"],
        url:
          "https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-025-00537-x",
        doi: "10.1186/s41239-025-00537-x"
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-games-educational-games",
    status: "backed",
    patternRef: "inst-games",
    evaType: "virtual-classroom",
    recommendation: {
      title:
        "Integrate educational games in Virtual classrooms",
      how:
        "In a virtual classroom, incorporate game-based learning elements. For example, use competitive quizzes or interactive simulations during live sessions.",
      why:
        'For example, gamified activities have been shown to "improve students’ motivation, interaction, participation, engagement, and academic performance".'
    },
    sources: [
      {
        title: "Gamification for Student Engagement",
        authors: "José Aguilar",
        venue: "Educational Technology Research and Development",
        quote:
          "gamification ... can improve students’ motivation, interaction, participation, engagement, and academic performance",
        tags: ["gamification", "motivation", "engagement"],
        url: "https://doi.org/10.1007/s11423-015-9374-7",
        doi: ""
      }
    ]
  }
];

export const AUDIENCE_RECOMMENDATIONS = [
  {
    inputID: "audience-k12-ped-early-bird-start-early",
    status: "backed",
    patternRef: "ped-early-bird",
    audience: "k12",
    recommendation: {
      title: "Encourage early participation in the course",
      how: `Start the course with accessible tasks (simple quizzes or introductory discussions) that students complete in the first days. Provide guidance to younger students and parents so they can engage quickly and form good habits.`,
      why: `Research shows that early participation in online course activities is linked to better student performance. Engaging K-12 students from the start builds momentum and confidence in the course content.`
    },
    sources: [
      {
        title: "Does the Early Bird Catch the Worm? A Large-Scale Examination of the Effects of Early Participation in Online Learning",
        authors: "Wanli Xing",
        venue: "Distance Education",
        quote: `Results show that early participation in online course activities is significantly correlated with student final performance.`,
        tags: ["online learning", "early participation", "student performance", "engagement"],
        url: "https://doi.org/10.1080/01587919.2022.2088476",
        doi: "10.1080/01587919.2022.2088476"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-spiral-spiral-review",
    status: "needs-review",
    patternRef: "ped-spiral",
    audience: "k12",
    recommendation: {
      title: "Use spiral review of topics",
      how: `Plan the curriculum so key concepts (like math skills or vocabulary) reappear with increasing complexity. Provide weekly spiral reviews where students revisit previous lessons through new exercises or games, reinforcing their learning.`,
      why: `A spiral curriculum reinforces learning by frequently revisiting topics so that students can fortify fundamental concepts in their memory. This incremental repetition aids retention and mastery for K-12 learners.`
    },
    sources: [
      {
        title: "What Is a Spiral Curriculum and How Does It Help Healthcare Students Learn?",
        authors: "Steph Stevens",
        venue: "Osmosis blog",
        quote: `A spiral curriculum reinforces that learning by frequently revisiting topics so that students can fortify fundamental concepts in their memory.`,
        tags: ["spiral curriculum", "spaced learning", "retention", "memory"],
        url: "https://www.osmosis.org/blog/what-is-a-spiral-curriculum-and-how-does-it-help-healthcare-students-learn"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-consistent-metaphor-metaphor-learning",
    status: "backed",
    patternRef: "ped-consistent-metaphor",
    audience: "k12",
    recommendation: {
      title: "Teach using consistent metaphors",
      how: `Choose a simple, familiar metaphor (like a journey or building blocks) and use it consistently when explaining new topics. For example, compare science or math concepts to everyday experiences children know.`,
      why: `Metaphors allow students to make associations and connections they would not otherwise make, gaining insights into relationships between ideas that in turn provide a deeper understanding of the new learning
ctlonline.org
. This helps K-12 students make abstract ideas concrete.`
    },
    sources: [
      {
        title: "Making Meaning with Metaphor - CTL - Collaborative for Teaching and Learning",
        authors: "Collaborative for Teaching & Learning",
        venue: "CTL Blog",
        quote: `Through metaphor, students make associations and connections they would not otherwise make, gaining insights into relationships between ideas that in turn provide a deeper understanding of the new learning
ctlonline.org
.`,
        tags: ["metaphors", "analogies", "concept understanding", "cognitive connections"],
        url: "https://ctlonline.org/making-meaning-with-metaphor/"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-toy-box-interactive-practice",
    status: "backed",
    patternRef: "ped-toy-box",
    audience: "k12",
    recommendation: {
      title: "Offer short, interactive exercises",
      how: `Provide a 'toy box' of short interactive tasks (educational games, mini-simulations, quizzes) that students can explore. Ensure each activity is slightly more difficult than the last, and give instructor-provided hints or videos alongside.`,
      why: `Interactive exercises significantly boost learning gains in large classes. By letting students practice in a playful, incremental way, you increase engagement and mastery of each skill.`
    },
    sources: [
      {
        title: "Learn before lecture: A strategy that improves learning outcomes in a large introductory biology class",
        authors: "Marin Moravec et al.",
        venue: "CBE Life Sciences Education",
        quote: `Our results demonstrate that lecture-based learning combined with interactive exercises (LBL + IE) significantly increases learning gains in large classes.`,
        tags: ["interactive exercises", "active learning", "biology education", "learning gains"],
        url: "https://doi.org/10.1187/cbe.10-04-0063",
        doi: "10.1187/cbe.10-04-0063"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-tool-box-provide-tools",
    status: "backed",
    patternRef: "ped-tool-box",
    audience: "k12",
    recommendation: {
      title: "Provide educational tools",
      how: `Equip young learners with appropriate educational tools (calculators, manipulatives, educational software). Introduce each tool gradually and show how to use it to solve problems or visualize ideas.`,
      why: `The quality of learning tools strongly influences student engagement and performance. K-12 students using supportive tools can access information more easily and stay motivated.`
    },
    sources: [
      {
        title: "Impact of online learning on student's performance and engagement: a systematic review",
        authors: "Catherine N. Akpen, Stephen Asaolu, Sunday Atobatele, Hilary Okagbue, Sidney Sampson",
        venue: "Discover Education",
        quote: `Effective strategies to improve student engagement such as interactive elements like discussion forums and multimedia resources were critical in improving both engagement and performance.`,
        tags: ["digital tools", "engagement", "performance", "online learning"],
        url: "https://doi.org/10.1007/s44217-024-00253-0",
        doi: "10.1007/s44217-024-00253-0"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-lay-of-the-land-course-overview",
    status: "needs-review",
    patternRef: "ped-lay-of-the-land",
    audience: "k12",
    recommendation: {
      title: "Present a course overview",
      how: `Begin with a clear guide to the course, including topics and schedule. Use a friendly 'Welcome' page or video to explain learning goals, tools used, and how to navigate the class so that students and parents know what to expect.`,
      why: `Providing structure and a sense of community helps keep students engaged and satisfied. A well-organized introduction reduces confusion and helps K-12 learners feel prepared to participate.`
    },
    sources: [
      {
        title: "Power Up Your Online Course: Proven Tools for Student Engagement",
        authors: "Nanak Hikmatullah",
        venue: "EdTech IDEAS Digest",
        quote: `Research highlights that building a strong sense of community is crucial for sustaining enrollment and improving student satisfaction.`,
        tags: ["orientation", "community", "engagement", "satisfaction"],
        url: "https://www.umass.edu/ideas/news/power-your-online-course-proven-tools-student-engagement"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-fixer-upper-error-correction",
    status: "backed",
    patternRef: "ped-fixer-upper",
    audience: "k12",
    recommendation: {
      title: "Let students correct errors",
      how: `Give students examples or peer work with deliberate errors and ask them to find and correct the mistakes, offering hints or partial feedback. This hands-on revision reinforces concepts and shows that errors can be resolved.`,
      why: `When students feel safe to make and fix errors, they build confidence and understanding. Correcting mistakes turns errors into learning opportunities for K-12 students.`
    },
    sources: [
      {
        title: "Turning mistakes into memory: the power of getting it wrong",
        authors: "Ilyssa Alagon",
        venue: "LearnSci Blog",
        quote: `Mistakes are not failures of understanding, they’re essential steps in the learning process. When students feel safe to make errors, they build genuine confidence in their abilities and engage more with the subject.`,
        tags: ["error-based learning", "confidence", "trial and error", "mastery"],
        url: "https://www.learnsci.com/post/turning-mistakes-into-memory-the-power-of-getting-it-wrong"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-larger-than-life-narrative-engagement",
    status: "backed",
    patternRef: "ped-larger-than-life",
    audience: "k12",
    recommendation: {
      title: "Use engaging stories and characters",
      how: `Incorporate engaging stories or animated characters into lessons. For example, teach math through a character's adventure. Use vivid, relatable examples to make content memorable for children.`,
      why: `Engaging narratives and relatable, larger-than-life characters are proven to be perfect vehicles for learning. Lovable characters improve engagement with – and retention of – educational content. Children pay more attention and remember concepts better when they care about the characters.`
    },
    sources: [
      {
        title: "The benefits of learning through characters and narrative",
        authors: "Eleni Savva",
        venue: "Mrs Wordsmith Blog",
        quote: `Engaging narratives and relatable, larger-than-life characters are proven to be perfect vehicles for learning. Lovable characters improve engagement with - and retention of - educational content.`,
        tags: ["storytelling", "narrative learning", "engagement", "retention"],
        url: "https://mrswordsmith.com/blogs/research/the-benefits-of-learning-through-characters-and-narrative"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-student-design-sprint-mini-projects",
    status: "backed",
    patternRef: "ped-student-design-sprint",
    audience: "k12",
    recommendation: {
      title: "Use short collaborative projects",
      how: `Organize a short collaborative design project where small teams of students tackle a problem (e.g., building a simple model) within a limited time. Encourage rapid prototyping and presentations, so students learn by doing.`,
      why: `Design Sprints encourage collaboration and build critical problem-solving skills. Short projects engage students by allowing them to create and test their ideas.`
    },
    sources: [
      {
        title: "Design Sprint in Education",
        authors: "",
        venue: "Design Sprint Co.",
        quote: `The Design Sprint format encourages collaboration among students from various disciplines, allowing the development of skills such as critical thinking, problem-solving, communication, and leadership.`,
        tags: ["design thinking", "collaborative learning", "innovation", "skill development"],
        url: "https://design-sprint.com/education/"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-mistake-embrace-mistakes",
    status: "backed",
    patternRef: "ped-mistake",
    audience: "k12",
    recommendation: {
      title: "Teach that it's okay to be wrong",
      how: `Encourage students to try new challenges and frame errors as normal. Use quizzes highlighting common mistakes, then discuss why they occur and how to fix them. Celebrate improvement rather than penalizing errors.`,
      why: `Allowing students to make mistakes and correct them with a positive attitude builds their understanding and solidifies accurate learning connections. K-12 students learn that errors strengthen their learning.`
    },
    sources: [
      {
        title: "Guiding Students to Harness Mistakes for Learning",
        authors: "Judy Willis",
        venue: "Edutopia",
        quote: `Allowing students to make mistakes and correct them with a positive attitude builds their understanding and solidifies accurate learning connections.`,
        tags: ["errors", "growth mindset", "learning process", "metacognition"],
        url: "https://www.edutopia.org/article/power-learning-mistakes/"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-test-tube-virtual-labs",
    status: "backed",
    patternRef: "ped-test-tube",
    audience: "k12",
    recommendation: {
      title: "Include safe experiments or simulations",
      how: `Set up hands-on experiments or virtual labs where children can test ideas in a controlled way. Use simulations and interactive activities so K-12 students actively explore concepts (with guidance).`,
      why: `Hands-on learning increases student engagement and knowledge retention. When students do experiments, they learn more deeply than by passive listening.`
    },
    sources: [
      {
        title: "Hands-On Learning",
        authors: "Paul Main",
        venue: "Structural Learning Blog",
        quote: `Hands-on learning increases student engagement and knowledge retention.`,
        tags: ["experiential learning", "hands-on activities", "engagement", "retention"],
        url: "https://www.structural-learning.com/post/hands-on-learning"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-fill-in-the-blanks-guided-notes",
    status: "backed",
    patternRef: "ped-fill-in-the-blanks",
    audience: "k12",
    recommendation: {
      title: "Use guided notes and exercises",
      how: `Give scaffolded worksheets or cloze exercises where students fill in key information (with word banks if needed). Provide partially completed notes they can complete during lessons, focusing them on essential concepts.`,
      why: `Guided notes keep students engaged and improve retention of material
modernclassrooms.org
. For K-12 learners, this structured support aids note-taking and reinforces learning.`
    },
    sources: [
      {
        title: "Guided Notes in a Modern Classroom — Modern Classrooms Project",
        authors: "",
        venue: "Modern Classrooms Project",
        quote: `Guided notes keep students engaged, help students retain what they see, and improve students’ academic performance
modernclassrooms.org
.`,
        tags: ["guided notes", "educational scaffolding", "note-taking", "retention"],
        url: "https://www.modernclassrooms.org/guided-notes"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-gold-star-positive-reinforcement",
    status: "backed",
    patternRef: "ped-gold-star",
    audience: "k12",
    recommendation: {
      title: "Use positive reinforcement and rewards",
      how: `Praise student efforts and achievements regularly. Use gold stars, badges, or small rewards for participation and progress. Give specific positive feedback to reinforce behaviors and build motivation.`,
      why: `Positive reinforcement motivates students and boosts focus. When K-12 learners are recognized, they are more likely to engage and repeat good study habits.`
    },
    sources: [
      {
        title: "The Impact of Using Positive Reinforcement in the Classroom",
        authors: "Rachel Kauffman",
        venue: "Veracross Blog",
        quote: `When teachers used positive reinforcement in the classroom, the students focused on tasks up to 30% more.`,
        tags: ["positive reinforcement", "motivation", "focus", "participation"],
        url: "https://www.veracross.com/resources/positive-reinforcement-classroom/"
      }
    ]
  },
  {
    inputID: "audience-k12-ped-grade-it-again-sam-resubmit-work",
    status: "backed",
    patternRef: "ped-grade-it-again-sam",
    audience: "k12",
    recommendation: {
      title: "Allow students to revise assignments",
      how: `Give K-12 students the chance to redo assignments or tests after feedback. Encourage them to identify mistakes and improve their answers. This can be done with resubmission policies or revision workshops.`,
      why: `Allowing revisions is far more effective for learning than meaningless busywork. K-12 students who reflect on feedback and resubmit demonstrate better understanding.`
    },
    sources: [
      {
        title: "Use Revise and Resubmit Instead of Extra Credit",
        authors: "John Orlando",
        venue: "Faculty Focus",
        quote: `For these reasons having students revise and resubmit work is a far more effective way to produce learning than extra credit.`,
        tags: ["feedback", "revision", "learning improvement", "mastery"],
        url: "https://www.facultyfocus.com/articles/educational-assessment/use-revise-and-resubmit-instead-of-extra-credit/"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-early-bird-boost-participation",
    status: "backed",
    patternRef: "ped-early-bird",
    audience: "HigherEd",
    recommendation: {
      title: "Encourage early participation in the course",
      how: `Design initial modules and discussion forums that students can complete in the first week. Send reminders or orientation videos to college students to motivate them to log in early and start engaging with content.`,
      why: `Studies find that early activity in online courses correlates with higher final grades. Motivating students to start tasks early can improve retention and performance.`
    },
    sources: [
      {
        title: "Does the Early Bird Catch the Worm? A Large-Scale Examination of the Effects of Early Participation in Online Learning",
        authors: "Wanli Xing",
        venue: "Distance Education",
        quote: `Results show that early participation in online course activities is significantly correlated with student final performance.`,
        tags: ["online learning", "early participation", "student performance", "engagement"],
        url: "https://doi.org/10.1080/01587919.2022.2088476",
        doi: "10.1080/01587919.2022.2088476"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-spiral-cumulative-learning",
    status: "needs-review",
    patternRef: "ped-spiral",
    audience: "HigherEd",
    recommendation: {
      title: "Implement spiral learning",
      how: `Structure lessons so that core ideas are introduced and then revisited later. For example, return to an earlier case study or theory in advanced topics, allowing college students to connect new information to prior knowledge.`,
      why: `Repeatedly cycling through material helps reinforce understanding. A spiral approach strengthens memory by revisiting topics over time, which benefits college-level learning.`
    },
    sources: [
      {
        title: "What Is a Spiral Curriculum and How Does It Help Healthcare Students Learn?",
        authors: "Steph Stevens",
        venue: "Osmosis blog",
        quote: `A spiral curriculum reinforces that learning by frequently revisiting topics so that students can fortify fundamental concepts in their memory.`,
        tags: ["spiral curriculum", "spaced learning", "retention", "memory"],
        url: "https://www.osmosis.org/blog/what-is-a-spiral-curriculum-and-how-does-it-help-healthcare-students-learn"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-consistent-metaphor-use-metaphors",
    status: "backed",
    patternRef: "ped-consistent-metaphor",
    audience: "HigherEd",
    recommendation: {
      title: "Use metaphors to clarify complex concepts",
      how: `Introduce and maintain a clear metaphor throughout the course. For example, explain software architecture using a city map analogy. Keep the metaphor consistent when covering related topics so college students can build on it.`,
      why: `Metaphors help learners form connections and gain insights that yield a deeper understanding
ctlonline.org
. Using familiar analogies throughout a course can help higher-education students grasp advanced content.`
    },
    sources: [
      {
        title: "Making Meaning with Metaphor - CTL - Collaborative for Teaching and Learning",
        authors: "Collaborative for Teaching & Learning",
        venue: "CTL Blog",
        quote: `Through metaphor, students make associations and connections they would not otherwise make, gaining insights into relationships between ideas that in turn provide a deeper understanding of the new learning
ctlonline.org
.`,
        tags: ["metaphors", "analogies", "concept understanding", "cognitive connections"],
        url: "https://ctlonline.org/making-meaning-with-metaphor/"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-toy-box-practice-modules",
    status: "backed",
    patternRef: "ped-toy-box",
    audience: "HigherEd",
    recommendation: {
      title: "Provide interactive practice modules",
      how: `Create a collection of practice quizzes, simulations, or mini-projects that complement lectures. College students can explore these at their own pace, using provided resources (like code snippets or hints) to work through progressively harder problems.`,
      why: `Guided interactive exercises lead to significant learning improvements. These ‘toy box’ activities allow higher-ed learners to apply concepts actively and build confidence.`
    },
    sources: [
      {
        title: "Learn before lecture: A strategy that improves learning outcomes in a large introductory biology class",
        authors: "Marin Moravec et al.",
        venue: "CBE Life Sciences Education",
        quote: `Our results demonstrate that lecture-based learning combined with interactive exercises (LBL + IE) significantly increases learning gains in large classes.`,
        tags: ["interactive exercises", "active learning", "biology education", "learning gains"],
        url: "https://doi.org/10.1187/cbe.10-04-0063",
        doi: "10.1187/cbe.10-04-0063"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-tool-box-resource-toolkit",
    status: "backed",
    patternRef: "ped-tool-box",
    audience: "HigherEd",
    recommendation: {
      title: "Provide key tools and resources",
      how: `Share key resources like software libraries, reference materials, and collaboration platforms. Encourage college students to use these tools for projects or research, and offer tutorials or workshops on any new tools introduced.`,
      why: `Effective online learning relies on quality digital tools. Equipping students with the right applications and resources improves engagement and helps them learn more efficiently.`
    },
    sources: [
      {
        title: "Impact of online learning on student's performance and engagement: a systematic review",
        authors: "Catherine N. Akpen, Stephen Asaolu, Sunday Atobatele, Hilary Okagbue, Sidney Sampson",
        venue: "Discover Education",
        quote: `Effective strategies to improve student engagement such as interactive elements like discussion forums and multimedia resources were critical in improving both engagement and performance.`,
        tags: ["digital tools", "engagement", "performance", "online learning"],
        url: "https://doi.org/10.1007/s44217-024-00253-0",
        doi: "10.1007/s44217-024-00253-0"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-lay-of-the-land-roadmap-expectations",
    status: "needs-review",
    patternRef: "ped-lay-of-the-land",
    audience: "HigherEd",
    recommendation: {
      title: "Provide a course roadmap",
      how: `Begin with a detailed syllabus or orientation module that lays out the course structure, deadlines, and objectives. Explain how each unit connects to the overall goals, using diagrams or learning maps to give college students a clear 'lay of the land.'`,
      why: `Clarity and community support are key for sustained engagement. Outlining the big picture early helps college students connect content and stay motivated throughout the course.`
    },
    sources: [
      {
        title: "Power Up Your Online Course: Proven Tools for Student Engagement",
        authors: "Nanak Hikmatullah",
        venue: "EdTech IDEAS Digest",
        quote: `Research highlights that building a strong sense of community is crucial for sustaining enrollment and improving student satisfaction.`,
        tags: ["orientation", "community", "engagement", "satisfaction"],
        url: "https://www.umass.edu/ideas/news/power-your-online-course-proven-tools-student-engagement"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-fixer-upper-review-errors",
    status: "backed",
    patternRef: "ped-fixer-upper",
    audience: "HigherEd",
    recommendation: {
      title: "Have students review errors",
      how: `Provide college students with a flawed solution or algorithm and ask them to critique and improve it. Encourage group discussion on the errors and allow resubmission of corrected work with feedback.`,
      why: `Guided correction of mistakes fosters deeper understanding and confidence. College students learn effectively by actively identifying and fixing problems in their work.`
    },
    sources: [
      {
        title: "Turning mistakes into memory: the power of getting it wrong",
        authors: "Ilyssa Alagon",
        venue: "LearnSci Blog",
        quote: `Mistakes are not failures of understanding, they’re essential steps in the learning process. When students feel safe to make errors, they build genuine confidence in their abilities and engage more with the subject.`,
        tags: ["error-based learning", "confidence", "trial and error", "mastery"],
        url: "https://www.learnsci.com/post/turning-mistakes-into-memory-the-power-of-getting-it-wrong"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-larger-than-life-storytelling",
    status: "backed",
    patternRef: "ped-larger-than-life",
    audience: "HigherEd",
    recommendation: {
      title: "Use real-world examples to illustrate concepts",
      how: `Frame abstract concepts in concrete case studies or examples. Tell the 'story' behind a problem (e.g., a real engineering challenge) to illustrate ideas. Use detailed scenarios to capture college students’ interest.`,
      why: `Engaging stories and relatable examples increase interest and memory of new information. Telling a compelling story around a concept helps students stay focused and recall content.`
    },
    sources: [
      {
        title: "The benefits of learning through characters and narrative",
        authors: "Eleni Savva",
        venue: "Mrs Wordsmith Blog",
        quote: `Engaging narratives and relatable, larger-than-life characters are proven to be perfect vehicles for learning. Lovable characters improve engagement with - and retention of - educational content.`,
        tags: ["storytelling", "narrative learning", "engagement", "retention"],
        url: "https://mrswordsmith.com/blogs/research/the-benefits-of-learning-through-characters-and-narrative"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-student-design-sprint-design-projects",
    status: "backed",
    patternRef: "ped-student-design-sprint",
    audience: "HigherEd",
    recommendation: {
      title: "Implement intensive design sprints",
      how: `Set aside a few days where student teams rapidly design and prototype a solution to a real problem. Provide structure (timelines, roles) so college students focus on collaborative ideation and feedback during the sprint.`,
      why: `A structured design sprint develops teamwork, critical thinking, and innovation. College learners gain practical experience by quickly iterating on ideas.`
    },
    sources: [
      {
        title: "Design Sprint in Education",
        authors: "",
        venue: "Design Sprint Co.",
        quote: `The Design Sprint format encourages collaboration among students from various disciplines, allowing the development of skills such as critical thinking, problem-solving, communication, and leadership.`,
        tags: ["design thinking", "collaborative learning", "innovation", "skill development"],
        url: "https://design-sprint.com/education/"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-mistake-learning-through-errors",
    status: "backed",
    patternRef: "ped-mistake",
    audience: "HigherEd",
    recommendation: {
      title: "Encourage learning through errors",
      how: `Use formative quizzes and immediately review wrong answers. Ask college students to reflect on errors and work out correct solutions. Praise effort and strategy rather than just correct answers to foster a growth mindset.`,
      why: `Allowing students to correct mistakes with guidance builds understanding and solidifies learning. College learners benefit by viewing errors as steps toward mastery.`
    },
    sources: [
      {
        title: "Guiding Students to Harness Mistakes for Learning",
        authors: "Judy Willis",
        venue: "Edutopia",
        quote: `Allowing students to make mistakes and correct them with a positive attitude builds their understanding and solidifies accurate learning connections.`,
        tags: ["errors", "growth mindset", "learning process", "metacognition"],
        url: "https://www.edutopia.org/article/power-learning-mistakes/"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-test-tube-hands-on-experiments",
    status: "backed",
    patternRef: "ped-test-tube",
    audience: "HigherEd",
    recommendation: {
      title: "Offer interactive labs or simulations",
      how: `Offer in-person lab sessions or online simulations for complex concepts (like coding environments or scientific experiments). Encourage students to manipulate variables and observe outcomes in a safe space.`,
      why: `Experiential learning significantly boosts engagement and helps students retain knowledge. College students learn effectively by doing and testing theories directly.`
    },
    sources: [
      {
        title: "Hands-On Learning",
        authors: "Paul Main",
        venue: "Structural Learning Blog",
        quote: `Hands-on learning increases student engagement and knowledge retention.`,
        tags: ["experiential learning", "hands-on activities", "engagement", "retention"],
        url: "https://www.structural-learning.com/post/hands-on-learning"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-fill-in-the-blanks-scaffold-notes",
    status: "backed",
    patternRef: "ped-fill-in-the-blanks",
    audience: "HigherEd",
    recommendation: {
      title: "Provide guided notes or templates",
      how: `Supply college students with templates or outlines that have missing terms (e.g., lecture notes with blanks). Ask them to fill these in during class or readings. This active process helps them identify and record key points.`,
      why: `Structured note-taking, such as guided notes, improves engagement and academic performance
modernclassrooms.org
. By actively filling in the blanks, college learners better encode information.`
    },
    sources: [
      {
        title: "Guided Notes in a Modern Classroom — Modern Classrooms Project",
        authors: "",
        venue: "Modern Classrooms Project",
        quote: `Guided notes keep students engaged, help students retain what they see, and improve students’ academic performance
modernclassrooms.org
.`,
        tags: ["guided notes", "educational scaffolding", "note-taking", "retention"],
        url: "https://www.modernclassrooms.org/guided-notes"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-gold-star-reward-engagement",
    status: "backed",
    patternRef: "ped-gold-star",
    audience: "HigherEd",
    recommendation: {
      title: "Give positive feedback",
      how: `Acknowledge student progress and contributions. Offer constructive praise for effort and improvement. Consider giving badges, certificates, or sharing exemplary work, emphasizing growth rather than just grades.`,
      why: `Students focus more and feel more motivated when positive behaviors are reinforced. In higher ed, highlighting achievements can increase engagement and confidence.`
    },
    sources: [
      {
        title: "The Impact of Using Positive Reinforcement in the Classroom",
        authors: "Rachel Kauffman",
        venue: "Veracross Blog",
        quote: `When teachers used positive reinforcement in the classroom, the students focused on tasks up to 30% more.`,
        tags: ["positive reinforcement", "motivation", "focus", "participation"],
        url: "https://www.veracross.com/resources/positive-reinforcement-classroom/"
      }
    ]
  },
  {
    inputID: "audience-HigherEd-ped-grade-it-again-sam-revise-resubmit",
    status: "backed",
    patternRef: "ped-grade-it-again-sam",
    audience: "HigherEd",
    recommendation: {
      title: "Offer assignment resubmissions",
      how: `Implement a revise-and-resubmit policy for assignments. After giving feedback, allow college students to correct and turn in their work again (within a deadline), focusing on learning rather than penalizing initial errors.`,
      why: `Revising work directly addresses learning gaps and is more effective for learning than extra credit. Students improve understanding by correcting their previous mistakes.`
    },
    sources: [
      {
        title: "Use Revise and Resubmit Instead of Extra Credit",
        authors: "John Orlando",
        venue: "Faculty Focus",
        quote: `For these reasons having students revise and resubmit work is a far more effective way to produce learning than extra credit.`,
        tags: ["feedback", "revision", "learning improvement", "mastery"],
        url: "https://www.facultyfocus.com/articles/educational-assessment/use-revise-and-resubmit-instead-of-extra-credit/"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-early-bird-early-engagement",
    status: "backed",
    patternRef: "ped-early-bird",
    audience: "Adults",
    recommendation: {
      title: "Promote early participation in the course",
      how: `Invite adult learners to start course materials or icebreaker activities as soon as possible. Offer short introductory videos or surveys so they can immediately connect with the topic and feel prepared.`,
      why: `Early participation in online courses often leads to better academic outcomes. Adult learners who engage at the outset can build confidence and momentum for the rest of the course.`
    },
    sources: [
      {
        title: "Does the Early Bird Catch the Worm? A Large-Scale Examination of the Effects of Early Participation in Online Learning",
        authors: "Wanli Xing",
        venue: "Distance Education",
        quote: `Results show that early participation in online course activities is significantly correlated with student final performance.`,
        tags: ["online learning", "early participation", "student performance", "engagement"],
        url: "https://doi.org/10.1080/01587919.2022.2088476",
        doi: "10.1080/01587919.2022.2088476"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-spiral-revisit-prior-knowledge",
    status: "needs-review",
    patternRef: "ped-spiral",
    audience: "Adults",
    recommendation: {
      title: "Apply spiral learning for adults",
      how: `Design modules where foundational ideas are reintroduced at intervals, each time deepening in complexity. Encourage adult learners to recall previous lessons when approaching advanced content, building a robust knowledge base.`,
      why: `A spiral curriculum strengthens fundamental concepts by revisiting them, aiding long-term retention. Revisiting prior knowledge helps adult learners integrate new material effectively.`
    },
    sources: [
      {
        title: "What Is a Spiral Curriculum and How Does It Help Healthcare Students Learn?",
        authors: "Steph Stevens",
        venue: "Osmosis blog",
        quote: `A spiral curriculum reinforces that learning by frequently revisiting topics so that students can fortify fundamental concepts in their memory.`,
        tags: ["spiral curriculum", "spaced learning", "retention", "memory"],
        url: "https://www.osmosis.org/blog/what-is-a-spiral-curriculum-and-how-does-it-help-healthcare-students-learn"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-consistent-metaphor-relatable-analogies",
    status: "backed",
    patternRef: "ped-consistent-metaphor",
    audience: "Adults",
    recommendation: {
      title: "Use metaphors to clarify complex ideas",
      how: `Present complex or unfamiliar material by tying it to a metaphor relevant to adults (e.g., project management as a recipe). Use the same metaphor when covering related concepts so adult learners can transfer their understanding easily.`,
      why: `Consistent metaphors help adults relate new content to known ideas, forming connections that deepen understanding
ctlonline.org
. This strategy aids comprehension in professional and self-directed learning contexts.`
    },
    sources: [
      {
        title: "Making Meaning with Metaphor - CTL - Collaborative for Teaching and Learning",
        authors: "Collaborative for Teaching & Learning",
        venue: "CTL Blog",
        quote: `Through metaphor, students make associations and connections they would not otherwise make, gaining insights into relationships between ideas that in turn provide a deeper understanding of the new learning
ctlonline.org
.`,
        tags: ["metaphors", "analogies", "concept understanding", "cognitive connections"],
        url: "https://ctlonline.org/making-meaning-with-metaphor/"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-toy-box-skill-practice",
    status: "backed",
    patternRef: "ped-toy-box",
    audience: "Adults",
    recommendation: {
      title: "Create self-paced practice modules",
      how: `Assemble a toolkit of short, relevant practice modules (case scenarios, problem sets, simulations) that adult learners can try voluntarily. Offer supporting resources (guides, examples) so they can explore concepts in a safe, incremental environment.`,
      why: `Structured interactive exercises have been shown to enhance learning outcomes. Adult learners can benefit from experimenting with material through guided practice, reinforcing their understanding.`
    },
    sources: [
      {
        title: "Learn before lecture: A strategy that improves learning outcomes in a large introductory biology class",
        authors: "Marin Moravec et al.",
        venue: "CBE Life Sciences Education",
        quote: `Our results demonstrate that lecture-based learning combined with interactive exercises (LBL + IE) significantly increases learning gains in large classes.`,
        tags: ["interactive exercises", "active learning", "biology education", "learning gains"],
        url: "https://doi.org/10.1187/cbe.10-04-0063",
        doi: "10.1187/cbe.10-04-0063"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-tool-box-learning-tools",
    status: "backed",
    patternRef: "ped-tool-box",
    audience: "Adults",
    recommendation: {
      title: "Provide useful tools for adults",
      how: `Gather and recommend the tools or apps that adults will need (e.g. industry software, calculators, productivity apps). Provide clear instructions or training on each tool so learners can focus on concepts rather than struggling with unfamiliar technology.`,
      why: `Research indicates that interactive tools and multimedia resources are critical for boosting engagement and learning. Ensuring adult learners have the right tools supports better outcomes.`
    },
    sources: [
      {
        title: "Impact of online learning on student's performance and engagement: a systematic review",
        authors: "Catherine N. Akpen, Stephen Asaolu, Sunday Atobatele, Hilary Okagbue, Sidney Sampson",
        venue: "Discover Education",
        quote: `Effective strategies to improve student engagement such as interactive elements like discussion forums and multimedia resources were critical in improving both engagement and performance.`,
        tags: ["digital tools", "engagement", "performance", "online learning"],
        url: "https://doi.org/10.1007/s44217-024-00253-0",
        doi: "0.1007/s44217-024-00253-0"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-lay-of-the-land-orientation-overview",
    status: "needs-review",
    patternRef: "ped-lay-of-the-land",
    audience: "Adults",
    recommendation: {
      title: "Describe the course structure",
      how: `Provide a clear introduction to the course, including goals, schedule, and available support. Present an overview of lessons and resources, perhaps via an orientation video or handbook, so adult learners understand the context before diving in.`,
      why: `Providing structure and a sense of belonging can improve learner satisfaction and commitment. When adult learners know the roadmap, they can navigate the content more confidently.`
    },
    sources: [
      {
        title: "Power Up Your Online Course: Proven Tools for Student Engagement",
        authors: "Nanak Hikmatullah",
        venue: "EdTech IDEAS Digest",
        quote: `Research highlights that building a strong sense of community is crucial for sustaining enrollment and improving student satisfaction.`,
        tags: ["orientation", "community", "engagement", "satisfaction"],
        url: "https://www.umass.edu/ideas/news/power-your-online-course-proven-tools-student-engagement"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-fixer-upper-identify-fix-errors",
    status: "backed",
    patternRef: "ped-fixer-upper",
    audience: "Adults",
    recommendation: {
      title: "Encourage diagnosing and fixing errors",
      how: `Give adults tasks where they must troubleshoot or debug issues (e.g., fixing a broken process or analysis). Provide immediate feedback and allow reattempts, reinforcing the error-correction process.`,
      why: `Allowing learners to make mistakes and then correct them strengthens understanding and confidence. This approach helps adult learners feel empowered and learn from challenges.`
    },
    sources: [
      {
        title: "Turning mistakes into memory: the power of getting it wrong",
        authors: "Ilyssa Alagon",
        venue: "LearnSci Blog",
        quote: `Mistakes are not failures of understanding, they’re essential steps in the learning process. When students feel safe to make errors, they build genuine confidence in their abilities and engage more with the subject.`,
        tags: ["error-based learning", "confidence", "trial and error", "mastery"],
        url: "https://www.learnsci.com/post/turning-mistakes-into-memory-the-power-of-getting-it-wrong"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-larger-than-life-contextual-examples",
    status: "backed",
    patternRef: "ped-larger-than-life",
    audience: "Adults",
    recommendation: {
      title: "Provide real-world contexts",
      how: `Use compelling scenarios or analogies relevant to adult experiences (like a business case or societal issue) when teaching concepts. Incorporate narratives that frame the material as part of a bigger picture.`,
      why: `Contextualizing learning in narrative helps learners remember and engage. Adults see new concepts as meaningful when tied to stories, enhancing both understanding and retention.`
    },
    sources: [
      {
        title: "The benefits of learning through characters and narrative",
        authors: "Eleni Savva",
        venue: "Mrs Wordsmith Blog",
        quote: `Engaging narratives and relatable, larger-than-life characters are proven to be perfect vehicles for learning. Lovable characters improve engagement with - and retention of - educational content.`,
        tags: ["storytelling", "narrative learning", "engagement", "retention"],
        url: "https://mrswordsmith.com/blogs/research/the-benefits-of-learning-through-characters-and-narrative"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-student-design-sprint-rapid-prototyping",
    status: "backed",
    patternRef: "ped-student-design-sprint",
    audience: "Adults",
    recommendation: {
      title: "Engage adults in rapid prototyping",
      how: `Facilitate a workshop where adult learners form small teams to address a complex issue, prototype solutions, and get quick feedback. Keep the sprint short and goal-focused to simulate real-world project cycles.`,
      why: `Collaborative sprints help adults apply skills like leadership and problem-solving under time constraints. Hands-on, goal-oriented projects increase learning by doing.`
    },
    sources: [
      {
        title: "Design Sprint in Education",
        authors: "",
        venue: "Design Sprint Co.",
        quote: `The Design Sprint format encourages collaboration among students from various disciplines, allowing the development of skills such as critical thinking, problem-solving, communication, and leadership.`,
        tags: ["design thinking", "collaborative learning", "innovation", "skill development"],
        url: "https://design-sprint.com/education/"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-mistake-growth-mindset",
    status: "backed",
    patternRef: "ped-mistake",
    audience: "Adults",
    recommendation: {
      title: "Emphasize mistakes as opportunities",
      how: `Discuss real examples of setbacks in the field. Give adults challenging problems where initial attempts may fail, then debrief how errors were fixed. Highlight that mistakes can reveal areas to strengthen.`,
      why: `Recognizing and correcting errors helps learners revise misconceptions and construct durable knowledge. Adult learners become more resilient and reflective through this process.`
    },
    sources: [
      {
        title: "Guiding Students to Harness Mistakes for Learning",
        authors: "Judy Willis",
        venue: "Edutopia",
        quote: `Allowing students to make mistakes and correct them with a positive attitude builds their understanding and solidifies accurate learning connections.`,
        tags: ["errors", "growth mindset", "learning process", "metacognition"],
        url: "https://www.edutopia.org/article/power-learning-mistakes/"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-test-tube-safe-practice",
    status: "backed",
    patternRef: "ped-test-tube",
    audience: "Adults",
    recommendation: {
      title: "Offer practical simulations",
      how: `Use simulations, role-plays, or case studies where adult learners can experiment without real consequences. For example, simulation software or scenario-based drills let them practice new skills safely.`,
      why: `Active, hands-on learning fosters deeper understanding and recall. Adult learners absorb concepts better when they can 'try out' ideas in a controlled, supportive setting.`
    },
    sources: [
      {
        title: "Hands-On Learning",
        authors: "Paul Main",
        venue: "Structural Learning Blog",
        quote: `Hands-on learning increases student engagement and knowledge retention.`,
        tags: ["experiential learning", "hands-on activities", "engagement", "retention"],
        url: "https://www.structural-learning.com/post/hands-on-learning"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-fill-in-the-blanks-structured-guidance",
    status: "backed",
    patternRef: "ped-fill-in-the-blanks",
    audience: "Adults",
    recommendation: {
      title: "Offer structured guides",
      how: `Provide adult learners with outlines, flowcharts, or fill-in-the-blank guides for new material. As they go through content, they complete the missing pieces, ensuring they focus on and internalize the key concepts.`,
      why: `Scaffolded materials like guided notes help students retain information and stay involved in learning
modernclassrooms.org
. Adult learners similarly benefit by engaging actively with content and clarifying understanding.`
    },
    sources: [
      {
        title: "Guided Notes in a Modern Classroom — Modern Classrooms Project",
        authors: "",
        venue: "Modern Classrooms Project",
        quote: `Guided notes keep students engaged, help students retain what they see, and improve students’ academic performance
modernclassrooms.org
.`,
        tags: ["guided notes", "educational scaffolding", "note-taking", "retention"],
        url: "https://www.modernclassrooms.org/guided-notes"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-gold-star-acknowledge-effort",
    status: "backed",
    patternRef: "ped-gold-star",
    audience: "Adults",
    recommendation: {
      title: "Acknowledge learner achievements",
      how: `Provide professional recognition or feedback for milestones (e.g., certificates, endorsements, or public commendations). Focus praise on learners' efforts and strategies. Ensure adult learners know their progress is noted and valued.`,
      why: `Studies show positive reinforcement leads students to engage more with tasks. Adult learners are similarly motivated when their successes are recognized, improving persistence and learning.`
    },
    sources: [
      {
        title: "The Impact of Using Positive Reinforcement in the Classroom",
        authors: "Rachel Kauffman",
        venue: "Veracross Blog",
        quote: `When teachers used positive reinforcement in the classroom, the students focused on tasks up to 30% more.`,
        tags: ["positive reinforcement", "motivation", "focus", "participation"],
        url: "https://www.veracross.com/resources/positive-reinforcement-classroom/"
      }
    ]
  },
  {
    inputID: "audience-Adults-ped-grade-it-again-sam-improve-assessments",
    status: "backed",
    patternRef: "ped-grade-it-again-sam",
    audience: "Adults",
    recommendation: {
      title: "Encourage reworking assignments",
      how: `Allow adult learners to revise projects or tests after feedback to improve their grade. Frame it as a professional development exercise: they learn more by refining work than by moving on without fixing misunderstandings.`,
      why: `Allowing revisions is a powerful learning tool. Adult learners benefit when they can correct errors and deepen their understanding before final evaluation.`
    },
    sources: [
      {
        title: "Use Revise and Resubmit Instead of Extra Credit",
        authors: "John Orlando",
        venue: "Faculty Focus",
        quote: `For these reasons having students revise and resubmit work is a far more effective way to produce learning than extra credit.`,
        tags: ["feedback", "revision", "learning improvement", "mastery"],
        url: "https://www.facultyfocus.com/articles/educational-assessment/use-revise-and-resubmit-instead-of-extra-credit/"
      }
    ]
  }
];

export const PLATFORM_MOBILE_UI_RECOMMENDATIONS = [
  {
    inputID: "platform-mobile-ui-input-feedback-inline-validation",
    status: "backed",
    patternRef: "ui-input-feedback",
    platform: "mobile",
    recomendation: {
      title: "Provide immediate inline feedback on user input",
      how: `When users enter data on mobile forms, validate inputs in real time. Display success or error indicators next to the field immediately after typing (e.g. green checkmarks or red error text). Use clear language and colors to differentiate errors, and update messages as users correct them.`,
      why: `Inline validation helps mobile users correct mistakes on the spot. It reduces their effort and frustration by letting them fix errors before proceeding
nngroup.com
.`,
    },
    sources: [
      {
        title: "10 Design Guidelines for Reporting Errors in Forms",
        authors: "Rachel Krause",
        venue: "Nielsen Norman Group",
        quote: `Ideally, all validation should be inline; ... an indicator should appear nearby if the field contains an error
nngroup.com
.`,
        tags: ["form design", "validation", "user input", "error handling", "mobile UX"],
        url: "https://www.nngroup.com/articles/reporting-form-errors/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-wizard-stepflow",
    status: "backed",
    patternRef: "ui-wizard",
    platform: "mobile",
    recomendation: {
      title: "Use clear step indicators in multi-step flows",
      how: `Break complex tasks into a linear wizard. On each mobile screen, show only a few fields or steps. Include a progress bar or step list at the top to indicate the current step. Label the Next/Back buttons clearly and allow users to save or resume the process.`,
      why: `Showing users their progress helps them understand how much is left. A clear mental model – with the current step highlighted – prevents confusion about the process length
nngroup.com
.`,
    },
    sources: [
      {
        title: "Wizards: Definition and Design Recommendations",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Communicate a clear mental model of the process by displaying a list or a diagram of the steps involved and highlighting the current step
nngroup.com
.`,
        tags: ["wizard", "progress", "user guidance", "multi-step", "mobile UX"],
        url: "https://www.nngroup.com/articles/wizards-definition-and-recommendations/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-inline-help-box-tooltips",
    status: "backed",
    patternRef: "ui-inline-help-box",
    platform: "mobile",
    recomendation: {
      title: "Provide on-demand inline help with tooltips",
      how: `Add context-sensitive help icons (e.g. “?” or info) beside inputs or features. When tapped, show a brief tooltip or hint describing the element. On mobile, keep these tips short and avoid overlays that obstruct content. Use modal pop-ups or slide-over panels for longer explanations if needed.`,
      why: `Inline help (tooltips or hints) offers guidance without leaving the app. Studies show inline tips can cut user errors substantially (e.g. by up to 35%), especially on mobile where users dislike switching contexts
medium.com
.`,
    },
    sources: [
      {
        title: "User Guides vs. Inline Help: When Is Each More Appropriate for Assisting Users?",
        authors: "atkabaloch",
        venue: "Medium (UX Planet)",
        quote: `Inline hints speed up adoption... Baymard study shows inline tooltips reduce user error rates by up to 35% during onboarding. On mobile apps, users don’t want to switch between the app and a PDF guide. Inline tooltips and short hints provide real-time help without breaking flow
medium.com
.`,
        tags: ["inline help", "tooltips", "user assistance", "mobile UX", "error reduction"],
        url: "https://medium.com/@atkabaloch64/user-guides-vs-inline-help-when-is-each-more-appropriate-for-assisting-users-f47a415aef7a",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-completeness-meter-progressbar",
    status: "backed",
    patternRef: "ui-completeness-meter",
    platform: "mobile",
    recomendation: {
      title: "Show a concise progress bar to indicate completion",
      how: `When tracking progress or profile completeness, display a horizontal bar or percentage indicator on mobile. Update it dynamically as tasks or fields are completed. Consider using encouraging labels (e.g. “45% complete – 5 steps to go”) and animate the bar to show progress.`,
      why: `Visible progress indicators motivate mobile users by showing how close they are to a goal. Research finds that users are most likely to finish a task if initial progress is shown quickly (e.g. fast-starting progress bars)
uxdesign.cc
.`,
    },
    sources: [
      {
        title: "From RPGs to UX: How User Progress Bars Actually Affect Completion",
        authors: "Anthony Perrotta",
        venue: "UX Collective (Medium)",
        quote: `Users were most likely to complete the task when the progress feedback started off fast and then slowed towards the end... with a breakoff rate of 11.3%
uxdesign.cc
.`,
        tags: ["progress bar", "gamification", "user engagement", "task completion", "mobile UX"],
        url: "https://uxdesign.cc/from-rpgs-to-ux-how-user-progress-bars-actually-affect-completion-ec64245dd3df",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-good-defaults-presets",
    status: "backed",
    patternRef: "ui-good-defaults",
    platform: "mobile",
    recomendation: {
      title: "Provide sensible defaults and autofill suggestions",
      how: `On mobile, pre-populate fields when possible. For example, default country code by locale, suggest previously used values, or use device features (GPS for address, voice for dictation). Show most common options at top of lists. Use autocomplete dropdowns to match user input.`,
      why: `Good defaults reduce typing on tiny keyboards and speed up tasks. Input guidelines recommend using history or frequent values as defaults and leveraging phone features to auto-fill data
nngroup.com
.`,
    },
    sources: [
      {
        title: "A Checklist for Designing Mobile Input Fields",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Do you have any good defaults for this field? Any history available? Frequently used values?
nngroup.com
.`,
        tags: ["default values", "autofill", "form design", "mobile input", "UX"],
        url: "https://www.nngroup.com/articles/mobile-input-checklist/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-breadcrumbs-minimal",
    status: "backed",
    patternRef: "ui-breadcrumbs",
    platform: "mobile",
    recomendation: {
      title: "Keep breadcrumbs minimal or skip them on mobile",
      how: `On mobile screens, avoid long breadcrumb trails. If you use them, show only the parent and current page (e.g. “Category > Current Page”), or use a shorter label or icon. Otherwise rely on a back button or a menu. Ensure any breadcrumb text wraps only to one line and is tappable.`,
      why: `Breadcrumbs can quickly consume space on mobile. Studies note they often wrap or become hard to tap. It’s best to shorten the trail or omit it on mobile to save space
nngroup.com
.`,
    },
    sources: [
      {
        title: "Breadcrumbs: 11 Design Guidelines for Desktop and Mobile",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote: `On mobile, breadcrumbs can take up too much space or be hard to tap; consider shortening the breadcrumb trail if your users’ tasks allow it
nngroup.com
.`,
        tags: ["breadcrumbs", "navigation", "mobile UX", "wayfinding", "usability"],
        url: "https://www.nngroup.com/articles/breadcrumbs-navigation/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-notifications-contextual",
    status: "backed",
    patternRef: "ui-notifications",
    platform: "mobile",
    recomendation: {
      title: "Send relevant, timely mobile notifications",
      how: `For mobile apps, use push or in-app notifications sparingly. Ensure each notification is clearly relevant (e.g. mention the user or context) and has a clear action or value. Batch similar updates and let users opt in to categories. Use concise text and proper timing.`,
      why: `Users are easily annoyed by irrelevant pings. Studies (e.g. Facebook) show that fewer, targeted notifications improve user satisfaction and retention. Always aim for “fewer but better” notifications
smashingmagazine.com
.`,
    },
    sources: [
      {
        title: "The (Enticing) Overwhelm: The Mental Side of Notifications",
        authors: "Aza Raskin",
        venue: "Smashing Magazine",
        quote: `Fewer but better notifications are often better for engagement and retention
smashingmagazine.com
.`,
        tags: ["notifications", "user retention", "engagement", "mobile UX", "push"],
        url: "https://www.smashingmagazine.com/2019/08/notifications-overwhelm-ux/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-navigation-tabs-accordion",
    status: "backed",
    patternRef: "ui-navigation-tabs",
    platform: "mobile",
    recomendation: {
      title: "Limit and optimize tab navigation",
      how: `Use a small number of main tabs (3–5) with clear icons/text and place them where easy to reach (often bottom navigation). Avoid horizontal scroll tabs. If you have more sections, consider nested menus or collapsible accordion menus. Use concise labels and include an active-state indicator.`,
      why: `Too many tabs on mobile cause discoverability issues. Nielsen notes that accordions often work better than full tab lists on small screens. Keeping tabs few and touch-friendly improves usability
nngroup.com
.`,
    },
    sources: [
      {
        title: "Tabs, Used Right",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Accordions are particularly useful on mobile devices, where they work better than tabs due to the limited screen space
nngroup.com
.`,
        tags: ["navigation", "tabs", "accordions", "mobile design", "UX"],
        url: "https://www.nngroup.com/articles/tabs-used-right/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-progressive-disclosure-reveal",
    status: "backed",
    patternRef: "ui-progressive-disclosure",
    platform: "mobile",
    recomendation: {
      title: "Use progressive disclosure to reduce clutter",
      how: `Show only essential elements on first view. Hide advanced or rarely-used features under “More”, “Details”, or collapsible sections. Allow users to tap to reveal additional controls or information (e.g. expand panels, dropdowns).`,
      why: `Hiding secondary content initially keeps mobile screens clean. Progressive disclosure is recommended to avoid overwhelming users. Nielsen notes it is a key guideline for mobile to defer noncritical information
nngroup.com
.`,
    },
    sources: [
      {
        title: "Progressive Disclosure: Avoiding Information Overload",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote: `Deferring secondary material is also a key guideline for mobile design
nngroup.com
.`,
        tags: ["progressive disclosure", "mobile design", "UX", "information hierarchy", "simplicity"],
        url: "https://www.nngroup.com/articles/progressive-disclosure/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-adaptable-view-fullsite",
    status: "backed",
    patternRef: "ui-adaptable-view",
    platform: "mobile",
    recomendation: {
      title: "Allow switching to full-view or alternate layouts",
      how: `Give users control over view modes. For example, include a “Full Site” link or toggle to show the desktop version on mobile browsers. Offer alternate layouts (e.g. list vs grid view). Respect orientation changes (support both portrait and landscape).`,
      why: `Some users need the full functionality or different layout. Nielsen advises providing a clear link to the full desktop site from mobile when advanced features exist only
nngroup.com
.`,
    },
    sources: [
      {
        title: "Mobile: Dedicated Site vs. Responsive Design",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote: `Offer a clear link from your mobile site to the full site for users who need special features only found on the full site.`,
        tags: ["responsive design", "mobile web", "full site", "UX", "adaptable"],
        url: "https://www.nngroup.com/articles/mobile-dedicated-vs-responsive/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-autocomplete-suggestions",
    status: "backed",
    patternRef: "ui-autocomplete",
    platform: "mobile",
    recomendation: {
      title: "Enable autocomplete for form and search fields",
      how: `Provide real-time suggestions as users type on mobile. Use data from prior entries or common choices to populate a dropdown. Avoid auto-correcting names or addresses unexpectedly. Allow users to tap a suggestion to fill.`,
      why: `Autocomplete reduces typing effort on small keyboards. Mobile input guidelines encourage offering suggestions based on the first letters typed to speed data entry
nngroup.com
.`,
    },
    sources: [
      {
        title: "A Checklist for Designing Mobile Input Fields",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Can you make suggestions/autocomplete based on the first letters typed?`,
        tags: ["autocomplete", "search", "input fields", "mobile UX", "forms"],
        url: "https://www.nngroup.com/articles/mobile-input-checklist/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-search-filters-panel",
    status: "backed",
    patternRef: "ui-search-filters",
    platform: "mobile",
    recomendation: {
      title: "Place filters in a full-screen or slide-out panel",
      how: `On mobile, trigger filters with a button or icon. Open a full-screen overlay or side panel containing filter options. Use large checkboxes, sliders, or toggles. Include an Apply button and an easy way to clear selections.`,
      why: `A full-screen filter interface makes many options usable on a small display. It lets you display and organize filter controls clearly using the entire screen
logrocket.com
.`,
    },
    sources: [
      {
        title: "Best practices for mobile search filter UX",
        authors: "DTE Systems",
        venue: "LogRocket Blog",
        quote: `The fullscreen filtering approach allows you to display and organize filter options in a clear and accessible way.`,
        tags: ["filters", "search", "mobile UX", "UX design", "UI patterns"],
        url: "https://blog.logrocket.com/ux-design/best-practices-mobile-search-filter/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-dashboard-cards",
    status: "backed",
    patternRef: "ui-dashboard",
    platform: "mobile",
    recomendation: {
      title: "Create a simple, focused dashboard layout",
      how: `Show only the key metrics and charts on the mobile dashboard. Use a vertical list of cards or tiles, each with a clear title and large text. Prefer simple visuals (icons, gauges, basic charts) and ensure everything is readable. Offer drill-down actions for details.`,
      why: `Mobile dashboards should minimize clutter. One guideline is to include only the most important metrics, which improves clarity and usability
anoda.mobi
.`,
    },
    sources: [
      {
        title: "Effective Mobile Dashboard Design: Best Tips",
        authors: "ANODA UX Agency",
        venue: "ANODA",
        quote: `Limit elements: Only include the most important metrics and data visualizations. This minimizes clutter and improves usability.`,
        tags: ["dashboard", "data visualization", "mobile UX", "metrics", "usability"],
        url: "https://www.anoda.mobi/ux-blog/effective-mobile-dashboard-design-tips",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-leaderboard-clear-layout",
    status: "backed",
    patternRef: "ui-leaderboard",
    platform: "mobile",
    recomendation: {
      title: "Use a clean, concise leaderboard design",
      how: `Display a vertical list of ranks with usernames, avatars, and scores. Keep the layout simple and centered. Highlight the current user’s row. Use consistent typography and plenty of whitespace. Ensure touch targets (e.g. profile names) are large enough.`,
      why: `A simple, intuitive layout lets users quickly see rankings. Leaderboards should be clean and easy to scan, allowing users to find their standing and progress at a glance
medium.com
.`,
    },
    sources: [
      {
        title: "Climbing the Ranks: A Guide to Leaderboards in Mobile Gaming",
        authors: "Ali Dursun",
        venue: "Medium",
        quote: `Designed with user experience in mind. It should be clean and simple, with easily identifiable player rankings... Users should find their standings and see their progress quickly.`,
        tags: ["leaderboard", "mobile gaming", "ranking", "UX", "usability"],
        url: "https://medium.com/@alidrsn/climbing-the-ranks-a-guide-to-leaderboards-in-mobile-gaming",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-collectible-achievements-gamification",
    status: "backed",
    patternRef: "ui-collectible-achievements",
    platform: "mobile",
    recomendation: {
      title: "Show collectible badges and progress toward them",
      how: `Display achievement badges in a profile or achievements page. Indicate locked vs unlocked status (e.g. grayscale vs color). Provide a short description and a progress counter (e.g. 3/10 tasks completed) for each badge. Celebrate new achievements with a small animation or notification.`,
      why: `Achievements motivate users by rewarding milestones. For example, granting a collectible achievement at a specific milestone gives users an incentive to reach that point
interaction-design.org
.`,
    },
    sources: [
      {
        title: "Personalization and Gamification of Loyalty Programs",
        authors: "Valentin Stoychev",
        venue: "Interaction-Design.org",
        quote: `Providing them with a collectible achievement on the tenth purchase gives them a small enticement to make the extra purchases necessary for reaching this point.`,
        tags: ["gamification", "achievements", "user engagement", "motivation", "UX"],
        url: "https://www.interaction-design.org/literature/article/personalization-and-gamification-of-loyalty-programs",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-activity-stream-feed",
    status: "backed",
    patternRef: "ui-activity-stream",
    platform: "mobile",
    recomendation: {
      title: "Present a chronological activity feed",
      how: `Implement a vertical scrolling feed with recent events (posts, likes, comments, etc.) in chronological order. Include timestamps and icons for each entry. Optionally combine related events into aggregated messages. Provide filters or separate tabs for notifications vs content feed.`,
      why: `A scrolling activity feed is intuitive on mobile. Many apps use flat or aggregated feeds to display user activities; often a separate notifications feed and an activity feed coexist
getstream.io
.`,
    },
    sources: [
      {
        title: "How Activity Feeds Work (Blog Post)",
        authors: "Kirill Danilov (Stream)",
        venue: "GetStream.io",
        quote: `Flat feeds contain a simple list of activities... Aggregated feeds combine the actions of a user... Many apps have both a notification feed and a flat feed.`,
        tags: ["activity stream", "feed", "notifications", "social UI", "mobile UX"],
        url: "https://getstream.io/blog/activity-feeds-work/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-chat-bubbles",
    status: "backed",
    patternRef: "ui-chat",
    platform: "mobile",
    recomendation: {
      title: "Design a clear chat interface with distinct bubbles",
      how: `Use alternating chat bubbles (left vs right alignment and different colors) for each participant. Keep the text input fixed at the bottom with a clear send button. Show avatars or initials and timestamps. Allow long-press on messages for actions (copy, react).`,
      why: `Users find it easier to follow conversations when messages from different participants are visually distinct. Studies found coloring user vs. agent messages differently made chats easier to read
nngroup.com
.`,
    },
    sources: [
      {
        title: "The User Experience of Customer-Service Chat: 20 Guidelines",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `"I like the layout on the screen with different colors — my reply and their reply, it’s really easy to see".`,
        tags: ["chat", "messaging", "UX", "conversation", "mobile"],
        url: "https://www.nngroup.com/articles/chat-ux/",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-reaction-buttons",
    status: "backed",
    patternRef: "ui-reaction",
    platform: "mobile",
    recomendation: {
      title: "Provide interactive like/reaction buttons",
      how: `Place prominent reaction icons (thumbs-up, heart, etc.) next to content items. Make the icons large enough to tap and provide immediate visual feedback (color change or animation) on tap. Consider a pop-up emoji picker for additional reactions.`,
      why: `Animated reaction buttons engage users by making interactions fun and noticeable. They encourage feedback, as studies note animated reaction buttons are visually appealing and increase engagement when liking content
zigpoll.com
.`,
    },
    sources: [
      {
        title: "Mastering UX Design to Maximize User Engagement on Social Media Platforms",
        authors: "Zigpoll Team",
        venue: "Zigpoll Blog",
        quote: `Animated Reaction Buttons: Fun, visually appealing actions when liking, commenting, or sharing content.`,
        tags: ["reactions", "microinteractions", "social UI", "mobile"],
        url: "http://www.zigpoll.com/content/what-specific-ux-design-strategies-have-you-found-most-effective-in-increasing-user-engagement-on-social-media-platforms",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-coachmarks-instructions",
    status: "backed",
    patternRef: "ui-coachmarks",
    platform: "mobile",
    recomendation: {
      title: "Use coachmarks to guide new users",
      how: `On first launch or after updates, overlay coachmarks—highlighted callouts with arrows and short tips—pointing to key UI elements. Provide one tip per step, dimming the rest of the screen. Include a skip option.`,
      why: `Coachmarks serve as visual step-by-step guides during onboarding. They show users how to use features contextually, making the onboarding experience smoother and more intuitive
plotline.so
.`,
    },
    sources: [
      {
        title: "How to Use Coachmarks and Spotlight UI in Mobile Apps",
        authors: "Ananya Vairavarajan",
        venue: "Plotline Blog",
        quote: `They act as visual guides, providing step-by-step instructions for new app users, making the onboarding process smooth and intuitive.`,
        tags: ["onboarding", "coachmarks", "UX", "tutorial", "mobile"],
        url: "https://www.plotline.so/blog/coachmarks-and-spotlight-ui-mobile-apps",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-guided-tour-tooltips",
    status: "backed",
    patternRef: "ui-guided-tour",
    platform: "mobile",
    recomendation: {
      title: "Provide a brief interactive product tour",
      how: `Implement a multi-step tour with tooltips or overlay screens that guide users through key features. Require a user action (such as tapping a highlighted element) to advance each step. Include a step indicator and allow users to skip or revisit the tour.`,
      why: `Interactive guided tours keep users engaged and ensure they learn important features. Action-driven tooltips have been shown to create highly engaging and informative onboarding experiences
appcues.com
.`,
    },
    sources: [
      {
        title: "Product tour UI/UX: Best onboarding flow patterns",
        authors: "Appcues Team",
        venue: "Appcues Blog",
        quote: `Action-driven tooltips can create a highly engaging and interactive experience.`,
        tags: ["onboarding", "tooltips", "UX", "interactive", "mobile"],
        url: "https://www.appcues.com/blog/product-tours-ui-patterns",
        doi: "",
      },
    ],
  },
  {
    inputID: "platform-mobile-ui-blank-slate-illustration",
    status: "backed",
    patternRef: "ui-blank-slate",
    platform: "mobile",
    recomendation: {
      title: "Turn empty states into helpful screens",
      how: `When a screen has no user data (e.g. first app launch or no search results), display a friendly illustration or message. Include a clear call-to-action (e.g. “Add your first item”) or guidance. Keep the UI clean and guide users on the next step.`,
      why: `A well-designed blank slate reduces confusion. It can showcase product value and set expectations. For example, a useful blank-slate can reduce frustration and accelerate time to value
userpilot.com
.`,
    },
    sources: [
      {
        title: "Blank Slate UI Design - 20 Best Examples to Replace Boring Empty States",
        authors: "Sophie Grigoryan",
        venue: "Userpilot Blog",
        quote: `Take advantage of the blank slate to showcase your product and set expectations, reduce user frustration, and decrease time to value.`,
        tags: ["empty state", "onboarding", "mobile UX", "user guidance", "UI design"],
        url: "https://userpilot.com/blog/blank-slate-ui-design-examples/",
        doi: "",
      },
    ],
  },
];

export const PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS = [
  {
    inputID: "platform-web-responsive-ui-input-feedback-inline-validation",
    status: "backed",
    patternRef: "ui-input-feedback",
    platform: "web-responsive",
    recomendation: {
      title: "Provide inline real-time validation",
      how:
        "On responsive web forms, validate fields as users type and show inline feedback (e.g., error messages or success indicators) immediately.",
      why:
        "Inline, real-time feedback prevents frustration and improves completion rates. Don’t wait for submission—give feedback as data is entered.",
    },
    sources: [
      {
        title: "Best Practices For Mobile Form Design",
        authors: "Nick Babich",
        venue: "Smashing Magazine",
        quote:
          "Don’t wait until users finish the form; provide feedback as data is being entered. Use inline validation with real-time feedback.",
        tags: ["forms", "validation", "responsive", "mobile"],
        url: "https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-wizard-single-step-focus",
    status: "backed",
    patternRef: "ui-wizard",
    platform: "web-responsive",
    recomendation: {
      title: "Focus on one step at a time",
      how:
        "Hide or collapse all but the current step in a wizard on small screens, showing only its title or position indicator.",
      why:
        "Multi-step forms are easier to navigate on mobile if users concentrate on one step at a time. If not all steps are shown, condense the interface to display only the current step title.",
    },
    sources: [
      {
        title: "mobile view of a wizard",
        authors: "adamsoh",
        venue: "UX StackExchange (Q&A)",
        quote:
          "If showing all the steps is not important, condense all the steps and just show the title of the current step.",
        tags: ["wizard", "forms", "mobile", "ux"],
        url: "https://ux.stackexchange.com/questions/91284/mobile-view-of-a-wizard",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-inline-help-box-tap-tooltip",
    status: "backed",
    patternRef: "ui-inline-help-box",
    platform: "web-responsive",
    recomendation: {
      title: "Use tap-triggered tooltips",
      how:
        "Add a tappable help icon or link next to elements; on mobile, trigger a concise inline tooltip or help overlay when tapped instead of hover.",
      why:
        "Mobile designs cannot rely on hover. Tooltips should appear when users tap an icon, providing supplemental info on demand.",
    },
    sources: [
      {
        title: "Designing Better Tooltips For Mobile User Interfaces",
        authors: "Eric Olive",
        venue: "Smashing Magazine",
        quote:
          "A tooltip provides supplemental information when users tap an icon, image, hyperlink, or other element in a mobile user interface.",
        tags: ["tooltip", "mobile", "accessibility", "help"],
        url: "https://www.smashingmagazine.com/2018/04/better-tooltips-mobile-ux/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-completeness-meter-compact-progress",
    status: "backed",
    patternRef: "ui-completeness-meter",
    platform: "web-responsive",
    recomendation: {
      title: "Use compact progress indicators",
      how:
        "Show a progress bar or dots at the top of the form; on narrow screens, use minimal indicators (like a small progress line or dot sequence) that fit without clutter.",
      why:
        "Progress indicators guide users through tasks and boost completion. On small screens, simpler indicators (e.g., dots) ensure clarity without overwhelming space.",
    },
    sources: [
      {
        title: "Multi-Step Form Navigation: Best Practices",
        authors: "Reform.app",
        venue: "Reform UX Blog",
        quote:
          "Progress indicators act as a guide and encourage users to complete forms.",
        tags: ["forms", "progress", "mobile", "ux"],
        url: "https://blog.reform.app/multi-step-form-navigation-best-practices",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-good-defaults-autofill",
    status: "backed",
    patternRef: "ui-good-defaults",
    platform: "web-responsive",
    recomendation: {
      title: "Auto-populate common fields",
      how:
        "Use contextual data (like user profile or geolocation) to prefill fields on responsive forms.",
      why:
        "Prefilled defaults reduce user effort and errors. Reusing known address or profile data prevents retyping and minimizes slips.",
    },
    sources: [
      {
        title:
          "Good Defaults in UX design — UX Knowledge Piece #39",
        authors: "Krisztina Szerovay",
        venue: "UX Knowledge (Medium)",
        quote:
          "You can prevent errors by prepopulating form fields or offering premade answers.",
        tags: ["defaults", "forms", "ux", "mobile"],
        url: "https://medium.com/ux-knowledge-piece-sketch/good-defaults-in-ux-design-39b8b07ee367",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-breadcrumbs-short-trail",
    status: "backed",
    patternRef: "ui-breadcrumbs",
    platform: "web-responsive",
    recomendation: {
      title: "Shorten breadcrumb trail",
      how:
        "Display a truncated breadcrumb on mobile (e.g., only the last level or two) instead of a full path.",
      why:
        "Full breadcrumb trails can occupy too much space on small screens. Showing only the last levels maintains context without clutter.",
    },
    sources: [
      {
        title:
          "Breadcrumbs: 11 Design Guidelines for Desktop and Mobile",
        authors: "Page Laubheimer",
        venue: "Nielsen Norman Group",
        quote:
          "Consider shortening the breadcrumb trail to include only the last level(s).",
        tags: ["breadcrumbs", "navigation", "mobile", "ux"],
        url: "https://www.nngroup.com/articles/breadcrumbs/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-notifications-snackbar",
    status: "backed",
    patternRef: "ui-notifications",
    platform: "web-responsive",
    recomendation: {
      title: "Use auto-dismissing snackbars or toasts",
      how:
        "Show unobtrusive notification banners (toasts/snackbars) near the screen edges; ensure they auto-dismiss and don’t block other content.",
      why:
        "Mobile snackbars should time out and not block interaction. Snackbars should not be persistent or stacked.",
    },
    sources: [
      {
        title: "Snackbar - Material Design",
        authors: "Material Design Team",
        venue: "Material Design Guidelines",
        quote:
          "Snackbars automatically time out from the screen and should not be persistent or stacked.",
        tags: ["notification", "snackbar", "mobile", "usability"],
        url: "https://m3.material.io/components/snackbar",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-navigation-tabs-scrollable",
    status: "backed",
    patternRef: "ui-navigation-tabs",
    platform: "web-responsive",
    recomendation: {
      title: "Enable a scrollable tab bar",
      how:
        "On narrow screens, allow tab navigation to scroll horizontally or collapse excess tabs into a dropdown; ensure each tab label remains large enough.",
      why:
        "Tabs often won’t fit on small screens. A horizontally scrollable container lets users swipe to hidden tabs on limited devices.",
    },
    sources: [
      {
        title:
          "Tabbed navigation in UX: Where and when to use it",
        authors: "LogRocket Blog",
        venue: "LogRocket",
        quote:
          "If you can’t fit all tabs horizontally, use a horizontally scrollable container; on mobile, host tabs in a scrollable container.",
        tags: ["tabs", "navigation", "responsive"],
        url: "https://blog.logrocket.com/ux-design/tabs-ux-best-practices/",
      },
    ],
  },
  {
    inputID:
      "platform-web-responsive-ui-progressive-disclosure-secondary",
    status: "backed",
    patternRef: "ui-progressive-disclosure",
    platform: "web-responsive",
    recomendation: {
      title: "Delay advanced options to secondary views",
      how:
        "Show only core options by default. Hide or move less-used settings to a secondary screen or menu.",
      why:
        "Deferring secondary functions aligns with progressive disclosure, simplifying the interface and keeping the UI focused.",
    },
    sources: [
      {
        title: "Progressive Disclosure",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote:
          "Deferring secondary material is a key guideline for mobile design.",
        tags: ["progressive disclosure", "mobile", "simplicity", "ux"],
        url: "https://www.nngroup.com/articles/progressive-disclosure/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-adaptable-view-switch",
    status: "backed",
    patternRef: "ui-adaptable-view",
    platform: "web-responsive",
    recomendation: {
      title: "Let users switch view modes",
      how:
        "Provide an option (e.g., a toggle or link) to switch between the mobile-optimized view and the full desktop layout on responsive sites.",
      why:
        "Not all mobile users want a simplified view. Offering a view toggle caters to different preferences and needs.",
    },
    sources: [
      {
        title: "Adaptable View",
        authors: "UI-Patterns.com",
        venue: "UI Patterns",
        quote:
          "Provide a manual control to allow users to switch the default style of a page so it better fits their specific needs.",
        tags: ["adaptive design", "view switching", "accessibility"],
        url: "https://ui-patterns.com/patterns/AdaptableView",
      },
    ],
  },
  {
    inputID:
      "platform-web-responsive-ui-autocomplete-scroll-into-view",
    status: "backed",
    patternRef: "ui-autocomplete",
    platform: "web-responsive",
    recomendation: {
      title: "Bring input into view on focus",
      how:
        "When an autocomplete field is focused on mobile, scroll or reposition it to the top of the screen so its suggestions are not obscured by the keyboard.",
      why:
        "Mobile keyboards can cover dropdown suggestions. Ensuring the focused autocomplete is visible keeps the suggestions in view.",
    },
    sources: [
      {
        title:
          "Creating user friendly autocomplete inputs for mobile devices",
        authors: "A.R. Nirjhor",
        venue: "UX StackExchange (Answer)",
        quote:
          "Highlight the autocomplete input when focused on mobile devices, bringing it to the top of the screen and hiding everything else.",
        tags: ["autocomplete", "mobile", "ux"],
        url: "https://ux.stackexchange.com/questions/141228/creating-user-friendly-autocomplete-inputs-for-mobile-devices",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-search-filters-drawer",
    status: "backed",
    patternRef: "ui-search-filters",
    platform: "web-responsive",
    recomendation: {
      title: "Use a toggleable filter panel",
      how:
        "Place filters behind a button/icon that opens an overlay panel (e.g., a slide-out or drawer) on mobile.",
      why:
        "This keeps the main content clear. A bottom drawer or overlay for filters is thumb-friendly and avoids clutter.",
    },
    sources: [
      {
        title:
          "Mobile Filter UX Design Patterns & Best Practices",
        authors: "Fanny Vassilatos, Ceara Crawshaw",
        venue: "Pencil & Paper",
        quote:
          "With a bottom drawer the filter button overlaps on top of users’ data and it’s easier to reach with thumbs.",
        tags: ["filters", "mobile", "drawer", "ux"],
        url: "https://www.pencilandpaper.io/articles/ux-pattern-analysis-mobile-filters",
      },
    ],
  },
  {
    inputID:
      "platform-web-responsive-ui-dashboard-horizontal-carousel",
    status: "backed",
    patternRef: "ui-dashboard",
    platform: "web-responsive",
    recomendation: {
      title: "Use horizontal carousel for key widgets",
      how:
        "Allow main dashboard cards or charts to swipe horizontally on mobile, and move secondary info into menus or collapsible sections.",
      why:
        "Space is limited on phones; primary items should scroll horizontally. Secondary information can be tucked into menus for a cleaner mobile UX.",
    },
    sources: [
      {
        title:
          "Mastering Responsive Design for a SaaS Dashboard",
        authors: "Drizzleshine",
        venue: "Medium",
        quote:
          "On the mobile version, other information was hidden behind the hamburger menu; cards scrolled horizontally from left to right.",
        tags: ["dashboard", "mobile", "cards"],
        url: "https://medium.com/@drizzleshine/mastering-responsive-design-for-a-saas-dashboard-a-design-challenge-c8401df0eb13",
      },
    ],
  },
  {
    inputID:
      "platform-web-responsive-ui-leaderboard-horizontal-scroll",
    status: "backed",
    patternRef: "ui-leaderboard",
    platform: "web-responsive",
    recomendation: {
      title: "Enable horizontal scrolling for tables",
      how:
        "If the leaderboard has many columns that exceed screen width, allow the table to scroll horizontally or collapse extra data into expandable rows.",
      why:
        "Making hidden columns evident avoids confusion. Use visual cues (like arrows or cut-off columns) so users know there is more data.",
    },
    sources: [
      {
        title:
          "Mobile Tables: Comparisons and Other Data Tables",
        authors: "Amy Schade",
        venue: "Nielsen Norman Group",
        quote:
          "When data doesn’t fit the width of a mobile screen, it must be apparent that there is more data beyond the horizontal fold.",
        tags: ["tables", "mobile", "ux"],
        url: "https://www.nngroup.com/articles/mobile-tables/",
      },
    ],
  },
  {
    inputID:
      "platform-web-responsive-ui-collectible-achievements-visible",
    status: "backed",
    patternRef: "ui-collectible-achievements",
    platform: "web-responsive",
    recomendation: {
      title: "Display achievements prominently",
      how:
        "Show the user’s badges or achievements on the dashboard/profile (e.g., a visible grid of icons) immediately after they are earned.",
      why:
        "Achievements should be immediately visible; hiding them reduces their motivational value.",
    },
    sources: [
      {
        title:
          "Display Achievements to Encourage Website Usage",
        authors: "Interaction Design Foundation",
        venue: "IxDF",
        quote:
          "Display the user’s achievements so they are immediately apparent upon attaining each collectible; if hidden, their value is greatly decreased.",
        tags: ["achievements", "gamification", "motivation"],
        url: "https://www.interaction-design.org/literature/article/display-achievements-to-encourage-website-usage",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-activity-stream-infinite-scroll",
    status: "backed",
    patternRef: "ui-activity-stream",
    platform: "web-responsive",
    recomendation: {
      title: "Use infinite scrolling for feeds",
      how:
        "Implement endless scroll on the activity feed so new items load as the user scrolls down.",
      why:
        "Users expect a continuous content stream in social or news feeds. Infinite scroll keeps users engaged without requiring clicks.",
    },
    sources: [
      {
        title:
          "Infinite scroll design: best practices and examples",
        authors: "Justinmind Team",
        venue: "Justinmind Blog",
        quote:
          "Social media users expect a constant stream of content without effort; infinite scroll makes it easy to stay engaged without clicking.",
        tags: ["infinite scroll", "feed", "social", "mobile"],
        url: "https://www.justinmind.com/ui-design/infinite-scroll",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-chat-input-bottom",
    status: "backed",
    patternRef: "ui-chat",
    platform: "web-responsive",
    recomendation: {
      title: "Anchor input at the bottom",
      how:
        "Fix the message input field to the bottom of the chat view so it remains visible just above the on-screen keyboard.",
      why:
        "Chat messages flow top-to-bottom, with newest at the bottom. On mobile, the keyboard is at the bottom, so placing the input right above it is logical.",
    },
    sources: [
      {
        title:
          "Why is the input field always at the bottom of a chat window?",
        authors: "Paul van den Dool, Kweamod",
        venue: "UX StackExchange (Q&A)",
        quote:
          "On mobile devices the keyboard is always at the bottom, so it makes sense to have the input field right above it.",
        tags: ["chat", "input", "mobile", "ux"],
        url: "https://ux.stackexchange.com/questions/51974/why-is-the-input-field-always-at-the-bottom-of-a-chat-window",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-reaction-large-taps",
    status: "backed",
    patternRef: "ui-reaction",
    platform: "web-responsive",
    recomendation: {
      title: "Ensure large tap targets",
      how:
        "Use large, well-spaced buttons or icons for reaction actions (likes, emojis) to make tapping easy on small screens.",
      why:
        "Interactive elements should be about 1 cm² on touchscreens to avoid fat-finger errors; smaller targets cause slowdowns and mistakes.",
    },
    sources: [
      {
        title: "Touch Targets on Touchscreens",
        authors: "Aurora Harley",
        venue: "Nielsen Norman Group",
        quote:
          "Interactive elements must be at least 1 cm × 1 cm (0.4 in × 0.4 in) to support adequate selection time and prevent fat-finger errors.",
        tags: ["touch targets", "accessibility", "mobile", "ux"],
        url: "https://www.nngroup.com/articles/touch-target-size/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-coachmarks-short-tips",
    status: "backed",
    patternRef: "ui-coachmarks",
    platform: "web-responsive",
    recomendation: {
      title: "Use concise, single-tip overlays",
      how:
        "Show one focused hint or coach mark at a time, highlighting a single UI element with minimal text.",
      why:
        "Mobile users rarely read lengthy instructions. Showing too many tips at once increases cognitive load; short, focused hints on one feature are more likely to be read.",
    },
    sources: [
      {
        title:
          "Instructional Overlays and Coach Marks for Mobile Apps",
        authors: "Aurora Harley",
        venue: "Nielsen Norman Group",
        quote:
          "Showing too many instructions at once increases cognitive load; focus on a single feature rather than explaining everything.",
        tags: ["onboarding", "coach marks", "mobile", "ux"],
        url: "https://www.nngroup.com/articles/mobile-instructional-overlay/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-guided-tour-limit",
    status: "backed",
    patternRef: "ui-guided-tour",
    platform: "web-responsive",
    recomendation: {
      title: "Keep guided tours short and optional",
      how:
        "Limit the steps in any onboarding tour and always allow users to skip it if desired.",
      why:
        "Users have limited short-term memory; too many sequential instructions overwhelm and discourage use.",
    },
    sources: [
      {
        title:
          "Instructional Overlays and Coach Marks for Mobile Apps",
        authors: "Aurora Harley",
        venue: "Nielsen Norman Group",
        quote:
          "Showing multiple coach marks in a row can make an app appear complicated and dissuade use; keep guidance concise.",
        tags: ["onboarding", "tours", "ux"],
        url: "https://www.nngroup.com/articles/mobile-instructional-overlay/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-blank-slate-clue-action",
    status: "backed",
    patternRef: "ui-blank-slate",
    platform: "web-responsive",
    recomendation: {
      title: "Provide clear context and actions",
      how:
        "Replace empty screens with a brief message explaining the absence of content and include a direct action (like a “Create Item” button).",
      why:
        "Empty states should convey system status and next steps. A plain “No records” message without context confuses users; adding explanatory text and a call-to-action clarifies the state and builds trust.",
    },
    sources: [
      {
        title:
          "Designing Empty States in Complex Applications: 3 Guidelines",
        authors: "Nielsen Norman Group",
        venue: "Nielsen Norman Group",
        quote:
          "A brief message such as “There are no records to display” communicates the state of the system and increases user confidence.",
        tags: ["empty state", "guidance", "ux"],
        url: "https://www.nngroup.com/articles/empty-state-interface-design/",
      },
    ],
  },
];
