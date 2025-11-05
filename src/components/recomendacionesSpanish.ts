// types.ts (opcional, si no lo tienes ya)
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
  recommendation: RecommendationItem; // Normalizo a 'recommendation'
  sources: Source[];
}

// recommendations.es.ts
export const RECOMMENDATIONS_EVA_ES: RecommendationEntry[] = [
  {
    inputID: "evaType-lms-inst-zero-block-intro-activity",
    status: "needs-review",
    patternRef: "inst-zero-block",
    evaType: "lms",
    recommendation: {
      title: "Integra actividad inicial abierta en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye una actividad inicial abierta para apoyar a los estudiantes. Por ejemplo, agrega un módulo dedicado a una actividad introductoria accesible para todos.",
      why:
        "Por ejemplo, la investigación indica que no tuvo impacto en el éxito de los estudiantes (edweek.org)."
    },
    sources: [
      {
        title: "Pre-Course Prep for Online Learning Yields Few Benefits",
        authors: "Anya Kamenetz",
        venue: "Education Week",
        quote:
          "no tuvo impacto en el éxito de los estudiantes en los cursos (edweek.org)",
        tags: ["aprendizaje en línea", "compromiso estudiantil", "preparación"],
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
      title: "Integra recursos curados en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye recursos curados para apoyar el aprendizaje. Por ejemplo, agrega una sección o biblioteca de recursos donde los estudiantes puedan encontrar materiales del curso.",
      why:
        `Por ejemplo, un estudio encontró que notas del curso y tareas "les ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra glosario de términos clave en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye un glosario de términos clave para los estudiantes. Por ejemplo, agrega una página con definiciones de los conceptos principales del curso.",
      why:
        "Por ejemplo, investigaciones muestran que los estudiantes necesitan ver una palabra repetidas veces para retenerla."
    },
    sources: [
      {
        title: "Teaching Vocabulary | Reading Rockets",
        authors: "Reading Rockets Staff",
        venue: "Reading Rockets",
        quote:
          "los estudiantes probablemente tienen que ver una palabra más de una vez para fijarla en su memoria a largo plazo",
        tags: ["vocabulario", "memoria", "aprendizaje"],
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
      title: "Integra tareas estructuradas en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye tareas estructuradas para involucrar a los estudiantes. Por ejemplo, crea módulos de tarea con instrucciones claras y fechas de entrega.",
      why:
        `Por ejemplo, los estudiantes informaron que las tareas en el LMS "les ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra foro de discusión en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, habilita un foro de discusión para la interacción entre estudiantes. Por ejemplo, permite que los estudiantes publiquen preguntas y debatan temas del curso en un foro.",
      why:
        `Por ejemplo, estudios encuentran que la participación activa en foros puede mejorar el aprendizaje; un informe notó que los foros de curso "les ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra evaluaciones con retroalimentación oportuna en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye evaluaciones (cuestionarios, pruebas) que brinden retroalimentación rápida. Por ejemplo, habilita cuestionarios auto-corregibles para que los estudiantes reciban resultados e indicaciones inmediatamente.",
      why:
        `Por ejemplo, una guía señala que "el feedback oportuno es fundamental para el aprendizaje efectivo y la satisfacción de los estudiantes".`
    },
    sources: [
      {
        title: "Step Up Your Students' Motivation Using Instant Feedback",
        authors: "UWEX Instructional Design",
        venue: "UWEX Blog",
        quote:
          "el feedback oportuno para los estudiantes es fundamental para el aprendizaje efectivo y la satisfacción de los estudiantes",
        tags: ["retroalimentación", "aprendizaje", "motivación"],
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
      title: "Integra contenido SCORM en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, utiliza lecciones en formato SCORM. Por ejemplo, sube módulos SCORM para que el contenido sea reutilizable y estandarizado.",
      why:
        `Por ejemplo, especialistas observan que SCORM "promueve el intercambio y la reutilización de objetos de aprendizaje modulares".`
    },
    sources: [
      {
        title: "3 Biggest Benefits of SCORM in eLearning Content",
        authors: "Haekka Team",
        venue: "Haekka Blog",
        quote:
          "SCORM promueve el intercambio y la reutilización de objetos de aprendizaje modulares",
        tags: ["SCORM", "reutilización de contenidos", "estándares"],
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
      title: "Integra wiki colaborativo en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye un wiki para creación colaborativa de conocimientos. Por ejemplo, configura un wiki de clase donde los estudiantes puedan co-crear apuntes o glosarios.",
      why:
        `Por ejemplo, se ha encontrado que "los wikis han agregado una nueva dimensión al aprendizaje colaborativo".`
    },
    sources: [
      {
        title: "Wiki-ing your way into collaborative learning",
        authors: "C. Albert; S. Baker",
        venue: "Yearbook of Innovative Teachers and Learning",
        quote:
          "Wikis han agregado una nueva dimensión al aprendizaje colaborativo",
        tags: ["wiki", "aprendizaje colaborativo", "comunidad"],
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
      title: "Integra chat en tiempo real en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, habilita una herramienta de chat para comunicación síncrona. Por ejemplo, crea una sala de chat donde los estudiantes puedan hacer preguntas y responderlas al momento.",
      why:
        "Por ejemplo, la mensajería instantánea puede aumentar la presencia social, aunque se dispone de poca evidencia directa en entornos LMS."
    },
    sources: [
      {
        title: "The role of push notifications in shaping students’ engagement",
        authors: "B. Mumcu; A. Çebi",
        venue: "Int J Educ Tech Higher Ed",
        quote:
          `las notificaciones push "aumentaron el compromiso y la autorregulación de los estudiantes mientras reducían la procrastinación académica"`,
        tags: ["notificaciones push", "compromiso", "autorregulación"],
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
      title: "Integra juegos educativos en cursos LMS",
      how:
        "En un sistema de gestión de aprendizaje, incluye juegos o elementos gamificados. Por ejemplo, agrega cuestionarios lúdicos o simulaciones interactivas que hagan que el aprendizaje sea entretenido.",
      why:
        `Por ejemplo, se ha comprobado que la gamificación puede "mejorar la motivación, interacción, participación, compromiso y rendimiento académico de los estudiantes".`
    },
    sources: [
      {
        title: "Gamification for Student Engagement",
        authors: "José Aguilar",
        venue: "Educational Technology Research and Development",
        quote:
          `la gamificación puede "mejorar la motivación, interacción, participación, compromiso y rendimiento académico de los estudiantes"`,
        tags: ["gamificación", "motivación", "compromiso"],
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
      title: "Integra actividad inicial abierta en MOOCs",
      how:
        "En un MOOC, incluye una actividad introductoria no calificada para los participantes. Por ejemplo, inicia el curso con una pregunta abierta o debate para atraer la atención de los aprendices.",
      why:
        "Por ejemplo, un estudio a gran escala observó que tales actividades de inicio no tuvieron impacto en el éxito de los estudiantes (edweek.org)."
    },
    sources: [
      {
        title: "Pre-Course Prep for Online Learning Yields Few Benefits",
        authors: "Anya Kamenetz",
        venue: "Education Week",
        quote:
          "no tuvieron impacto en el éxito de los estudiantes en los cursos (edweek.org)",
        tags: ["aprendizaje en línea", "compromiso", "preparación"],
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
      title: "Integra recursos curados en MOOCs",
      how:
        "En una plataforma MOOC, ofrece una lista de recursos curados. Por ejemplo, comparte videos, lecturas o enlaces relevantes para cada módulo para que los participantes puedan profundizar.",
      why:
        `Por ejemplo, diseñadores de MOOCs destacan que recursos fácilmente accesibles como apuntes y foros "ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra glosario de términos clave en MOOCs",
      how:
        "En un MOOC, incluye un glosario de términos clave para los participantes. Por ejemplo, agrega una página desplazable con definiciones de vocabulario técnico usado en el curso.",
      why:
        "Por ejemplo, se sabe que los estudiantes necesitan exposiciones repetidas a nuevas palabras para recordarlas (ver más de una vez)."
    },
    sources: [
      {
        title: "Teaching Vocabulary | Reading Rockets",
        authors: "Reading Rockets Staff",
        venue: "Reading Rockets",
        quote:
          "los estudiantes probablemente tienen que ver una palabra más de una vez para fijarla en su memoria a largo plazo",
        tags: ["vocabulario", "memoria", "aprendizaje"],
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
      title: "Integra tareas estructuradas en MOOCs",
      how:
        "En una plataforma MOOC, proporciona tareas o cuestionarios estructurados. Por ejemplo, lanza tareas semanales con instrucciones claras y retroalimentación para guiar el progreso de los aprendices.",
      why:
        `Por ejemplo, se observó que los participantes mencionaban que las tareas disponibles "les ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra foro de discusión en MOOCs",
      how:
        "En un MOOC, crea un foro de discusión o sección de preguntas y respuestas. Por ejemplo, anima a los aprendices a compartir dudas e ideas en un foro moderado por el equipo del curso.",
      why:
        `Por ejemplo, investigaciones indican que los foros son valiosos: los foros de discusión del curso "les ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra evaluaciones con retroalimentación oportuna en MOOCs",
      how:
        "En una plataforma MOOC, programa evaluaciones periódicas con retroalimentación rápida. Por ejemplo, incluye cuestionarios después de cada módulo para que los aprendices vean inmediatamente los resultados y explicaciones.",
      why:
        `Por ejemplo, expertos señalan que el "feedback oportuno" es integral para el aprendizaje efectivo en línea.`
    },
    sources: [
      {
        title: "Step Up Your Students' Motivation Using Instant Feedback",
        authors: "UWEX Instructional Design",
        venue: "UWEX Blog",
        quote:
          "el feedback oportuno para los estudiantes es fundamental para el aprendizaje efectivo y la satisfacción de los estudiantes",
        tags: ["retroalimentación", "aprendizaje", "motivación"],
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
      title: "Integra contenido SCORM en MOOCs",
      how:
        "En una plataforma MOOC, utiliza estándares SCORM para contenido modular. Por ejemplo, sube paquetes de lecciones en formato SCORM para que el contenido se pueda reutilizar en otros cursos.",
      why:
        `Por ejemplo, los especialistas en eLearning destacan que SCORM "promueve el intercambio y la reutilización de objetos de aprendizaje modulares".`
    },
    sources: [
      {
        title: "3 Biggest Benefits of SCORM in eLearning Content",
        authors: "Haekka Team",
        venue: "Haekka Blog",
        quote:
          "SCORM promueve el intercambio y la reutilización de objetos de aprendizaje modulares",
        tags: ["SCORM", "reutilización de contenidos", "estándares"],
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
      title: "Integra wiki colaborativo en MOOCs",
      how:
        "En un MOOC, incluye un wiki colaborativo para aprendizaje colectivo. Por ejemplo, permite que los aprendices construyan en conjunto una base de conocimientos o glosario durante el curso.",
      why:
        `Por ejemplo, un estudio menciona que los wikis "han agregado una nueva dimensión al aprendizaje colaborativo".`
    },
    sources: [
      {
        title: "Wiki-ing your way into collaborative learning",
        authors: "C. Albert; S. Baker",
        venue: "Yearbook of Innovative Teachers and Learning",
        quote:
          "los wikis han agregado una nueva dimensión al aprendizaje colaborativo",
        tags: ["wiki", "aprendizaje colaborativo", "comunidad"],
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
      title: "Integra chat en tiempo real en MOOCs",
      how:
        "En un MOOC, habilita canales de chat para preguntas en tiempo real. Por ejemplo, ofrece eventos de chat programados o grupos de mensajería instantánea para que los aprendices interactúen en vivo.",
      why:
        "Por ejemplo, el chat en tiempo real puede ayudar a construir comunidad, aunque la evidencia específica en MOOCs es limitada."
    },
    sources: [
      {
        title: "The role of push notifications in shaping students’ engagement",
        authors: "B. Mumcu; A. Çebi",
        venue: "Int J Educ Tech Higher Ed",
        quote:
          `las notificaciones push "aumentaron el compromiso y la autorregulación de los estudiantes mientras reducían la procrastinación académica"`,
        tags: ["notificaciones push", "compromiso", "autorregulación"],
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
      title: "Integra juegos educativos en MOOCs",
      how:
        "En una plataforma MOOC, gamifica el aprendizaje añadiendo juegos y cuestionarios. Por ejemplo, usa desafíos interactivos y sistemas de puntos para motivar a los participantes del MOOC.",
      why:
        `Por ejemplo, se ha demostrado que la gamificación puede "mejorar la motivación, interacción, participación, compromiso y rendimiento académico de los estudiantes".`
    },
    sources: [
      {
        title: "Gamification for Student Engagement",
        authors: "José Aguilar",
        venue: "Educational Technology Research and Development",
        quote:
          `la gamificación puede "mejorar la motivación, interacción, participación, compromiso y rendimiento académico de los estudiantes"`,
        tags: ["gamificación", "motivación", "compromiso"],
        url: "https://doi.org/10.1007/s11423-015-9374-7",
        doi: ""
      }
    ]
  },

  // ---------- Aulas virtuales ----------
  {
    inputID: "evaType-virtual-classroom-inst-zero-block-intro-activity",
    status: "needs-review",
    patternRef: "inst-zero-block",
    evaType: "virtual-classroom",
    recommendation: {
      title: "Integra actividad inicial abierta en aulas virtuales",
      how:
        "En una sesión de aula virtual, comienza con un ejercicio interactivo. Por ejemplo, inicia con una actividad en la que los estudiantes puedan explorar conceptos en vivo.",
      why:
        "Por ejemplo, la evidencia sugiere que actividades tempranas de este tipo no tuvieron impacto en el éxito de los estudiantes (edweek.org)."
    },
    sources: [
      {
        title: "Pre-Course Prep for Online Learning Yields Few Benefits",
        authors: "Anya Kamenetz",
        venue: "Education Week",
        quote:
          "no tuvieron impacto en el éxito de los estudiantes en los cursos (edweek.org)",
        tags: ["aprendizaje en línea", "compromiso", "preparación"],
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
      title: "Integra recursos curados en aulas virtuales",
      how:
        "En un aula virtual, comparte recursos curados con los participantes. Por ejemplo, muestra lecturas o medios clave en el entorno en línea o proporciona enlaces en el chat o la página del curso.",
      why:
        `Por ejemplo, incluso en un entorno mixto, materiales como apuntes y foros accesibles "ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra glosario de términos clave en aulas virtuales",
      how:
        "En un aula virtual, proporciona un glosario de términos clave como referencia. Por ejemplo, comparte una lista de definiciones en el portal del curso o en el chat para que los estudiantes puedan consultar conceptos rápidamente.",
      why:
        "Por ejemplo, se sabe que los estudiantes necesitan exposiciones repetidas a vocabulario nuevo para recordarlo (ver la misma palabra varias veces)."
    },
    sources: [
      {
        title: "Teaching Vocabulary | Reading Rockets",
        authors: "Reading Rockets Staff",
        venue: "Reading Rockets",
        quote:
          "los estudiantes probablemente tienen que ver una palabra más de una vez para fijarla en su memoria a largo plazo",
        tags: ["vocabulario", "memoria", "aprendizaje"],
        url:
          "https://www.readingrockets.org/topics/vocabulary/articles/teaching-vocabulary",
        doi: ""
      }
    ]
  },
  {
    inputID: "evaType-virtual-classroom-inst-assignments-structured-assessments",
    status: "backed",
    patternRef: "inst-assignments",
    evaType: "virtual-classroom",
    recommendation: {
      title: "Integra tareas estructuradas en aulas virtuales",
      how:
        "En un entorno de aula virtual, asigna actividades estructuradas. Por ejemplo, entrega tareas o proyectos después de las sesiones en vivo para reforzar los conceptos enseñados.",
      why:
        `Por ejemplo, los estudiantes informaron que asignaciones bien diseñadas "les ayudaron a lograr un mejor resultado de aprendizaje".`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra foro de discusión en aulas virtuales",
      how:
        "En un entorno de aula virtual, utiliza foros o hilos de chat para fomentar la discusión. Por ejemplo, configura un foro en línea o un chat grupal donde los participantes puedan continuar las conversaciones después de las sesiones en vivo.",
      why:
        `Por ejemplo, tener foros de curso ayudó a los estudiantes a "lograr un mejor resultado de aprendizaje" en un estudio.`
    },
    sources: [
      {
        title:
          "Student Satisfaction in Using a Learning Management System (LMS) for Blended Learning Courses for Tertiary Education",
        authors:
          "F. D. Nasir; M. A. M. Hussain; H. Mohamed; M. A. M. Mokhtar; N. A. Karim",
        venue: "Asian Journal of University Education",
        quote:
          "notas del curso, foros y tareas ... les ayudaron a lograr un mejor resultado de aprendizaje",
        tags: ["LMS", "satisfacción del estudiante", "aprendizaje combinado", "resultados"],
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
      title: "Integra evaluaciones con retroalimentación oportuna en aulas virtuales",
      how:
        "En un aula virtual, incluye pruebas o cuestionarios con retroalimentación rápida. Por ejemplo, después de las sesiones, realiza un quiz en línea que califique automáticamente y muestre de inmediato las respuestas correctas.",
      why:
        `Por ejemplo, los expertos recomiendan el "feedback oportuno" como integral para el aprendizaje efectivo en línea.`
    },
    sources: [
      {
        title: "Step Up Your Students' Motivation Using Instant Feedback",
        authors: "UWEX Instructional Design",
        venue: "UWEX Blog",
        quote:
          "el feedback oportuno para los estudiantes es fundamental para el aprendizaje efectivo y la satisfacción de los estudiantes",
        tags: ["retroalimentación", "aprendizaje", "motivación"],
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
      title: "Integra contenido SCORM en aulas virtuales",
      how:
        "En un entorno de aula virtual, utiliza paquetes SCORM para las clases. Por ejemplo, utiliza módulos SCORM para que el contenido sea estandarizado y reutilizable en futuras sesiones.",
      why:
        `Por ejemplo, los expertos indican que SCORM "promueve el intercambio y la reutilización de objetos de aprendizaje modulares".`
    },
    sources: [
      {
        title: "3 Biggest Benefits of SCORM in eLearning Content",
        authors: "Haekka Team",
        venue: "Haekka Blog",
        quote:
          "SCORM promueve el intercambio y la reutilización de objetos de aprendizaje modulares",
        tags: ["SCORM", "reutilización de contenidos", "estándares"],
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
      title: "Integra wiki colaborativo en aulas virtuales",
      how:
        "En un aula virtual, agrega un wiki compartido para la contribución de estudiantes. Por ejemplo, permite que los participantes coautoricen una guía de estudio o plan de proyecto en el wiki durante el curso.",
      why:
        `Por ejemplo, en un estudio se halló que "los wikis han agregado una nueva dimensión al proceso de aprendizaje colaborativo".`
    },
    sources: [
      {
        title: "Wiki-ing your way into collaborative learning",
        authors: "C. Albert; S. Baker",
        venue: "Yearbook of Innovative Teachers and Learning",
        quote:
          "los wikis han agregado una nueva dimensión al proceso de aprendizaje colaborativo",
        tags: ["wiki", "aprendizaje colaborativo", "comunidad"],
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
      title: "Integra chat en tiempo real en aulas virtuales",
      how:
        "En una sesión de aula virtual, usa chat en vivo para comunicación inmediata. Por ejemplo, habilita una opción de chat durante la sesión para preguntas y discusión en tiempo real.",
      why:
        "Por ejemplo, el chat en tiempo real puede mejorar la cercanía social y la participación, aunque la evidencia específica es limitada."
    },
    sources: [
      {
        title: "The role of push notifications in shaping students’ engagement",
        authors: "B. Mumcu; A. Çebi",
        venue: "Int J Educ Tech Higher Ed",
        quote:
          `las notificaciones push "aumentaron el compromiso y la autorregulación de los estudiantes mientras reducían la procrastinación académica"`,
        tags: ["notificaciones push", "compromiso", "autorregulación"],
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
      title: "Integra juegos educativos en aulas virtuales",
      how:
        "En un aula virtual, incorpora elementos basados en juegos. Por ejemplo, realiza cuestionarios competitivos o simulaciones interactivas durante la sesión en vivo.",
      why:
        `Por ejemplo, actividades gamificadas pueden "mejorar la motivación, interacción, participación, compromiso y rendimiento académico de los estudiantes".`
    },
    sources: [
      {
        title: "Gamification for Student Engagement",
        authors: "José Aguilar",
        venue: "Educational Technology Research and Development",
        quote:
          `la gamificación puede "mejorar la motivación, interacción, participación, compromiso y rendimiento académico de los estudiantes"`,
        tags: ["gamificación", "motivación", "compromiso"],
        url: "https://doi.org/10.1007/s11423-015-9374-7",
        doi: ""
      }
    ]
  }
];

export const AUDIENCE_RECOMMENDATIONS_ES = [
  {
    inputID: "audience-k12-ped-early-bird-start-early",
    status: "backed",
    patternRef: "ped-early-bird",
    audience: "k12",
    recommendation: {
      title: "Fomente la participación temprana en el curso",
      how: `Comience el curso con tareas accesibles (cuestionarios simples o debates introductorios) que los estudiantes completen en los primeros días. Brinde orientación a los estudiantes más jóvenes y a sus padres para que puedan involucrarse rápidamente y formar buenos hábitos.`,
      why: `La investigación muestra que la participación temprana en actividades de cursos en línea se asocia con un mejor rendimiento estudiantil. Involucrar a estudiantes K-12 desde el comienzo genera impulso y confianza en el contenido del curso.`
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
      title: "Utilice revisión espiral de los temas",
      how: `Planifique el currículo de modo que los conceptos clave (como habilidades matemáticas o vocabulario) reaparezcan con creciente complejidad. Ofrezca revisiones espirales semanales donde el estudiantado retome lecciones previas mediante nuevos ejercicios o juegos, reforzando su aprendizaje.`,
      why: `Un currículo en espiral refuerza el aprendizaje al revisar con frecuencia los temas, de forma que el estudiantado consolide conceptos fundamentales en su memoria. Esta repetición incremental favorece la retención y el dominio en K-12.`
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
      title: "Enseñe usando metáforas consistentes",
      how: `Elija una metáfora simple y familiar (como un viaje o bloques de construcción) y úsela de forma consistente al explicar temas nuevos. Por ejemplo, compare conceptos de ciencias o matemáticas con experiencias cotidianas que conozcan los niños.`,
      why: `Las metáforas permiten que los estudiantes establezcan asociaciones y conexiones que no harían de otro modo, obteniendo ideas sobre relaciones entre conceptos que conducen a una comprensión más profunda del nuevo aprendizaje. Esto ayuda a concretar ideas abstractas en K-12.`
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
      title: "Ofrezca ejercicios cortos e interactivos",
      how: `Proporcione una “caja de juguetes” con tareas interactivas breves (juegos educativos, mini-simulaciones, cuestionarios) para que el estudiantado las explore. Asegúrese de que cada actividad sea un poco más difícil que la anterior y entregue pistas o videos de apoyo del docente.`,
      why: `Los ejercicios interactivos aumentan significativamente las ganancias de aprendizaje en cursos numerosos. Al permitir la práctica lúdica e incremental, se incrementa la participación y el dominio de cada habilidad.`
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
      title: "Proporcione herramientas educativas",
      how: `Equípese a los estudiantes con herramientas adecuadas (calculadoras, manipulativos, software educativo). Introduzca cada herramienta de manera gradual y muestre cómo usarla para resolver problemas o visualizar ideas.`,
      why: `La calidad de las herramientas de aprendizaje influye fuertemente en la participación y el desempeño. Con herramientas de apoyo, los estudiantes K-12 acceden más fácilmente a la información y se mantienen motivados.`
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
      title: "Presente una visión general del curso",
      how: `Comience con una guía clara del curso, incluyendo temas y calendario. Use una página o video de bienvenida para explicar metas de aprendizaje, herramientas y cómo navegar la clase, de modo que estudiantes y familias sepan qué esperar.`,
      why: `Brindar estructura y sentido de comunidad ayuda a mantener la participación y satisfacción. Una introducción bien organizada reduce la confusión y prepara al estudiantado K-12 para participar.`
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
      title: "Permita que el estudiantado corrija errores",
      how: `Entregue ejemplos o trabajos de pares con errores deliberados y pida detectarlos y corregirlos, ofreciendo pistas o retroalimentación parcial. Esta revisión práctica refuerza conceptos y demuestra que los errores se pueden resolver.`,
      why: `Cuando el estudiantado se siente seguro para equivocarse y corregirse, desarrolla confianza y comprensión. Corregir errores los convierte en oportunidades de aprendizaje en K-12.`
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
      title: "Use historias y personajes atractivos",
      how: `Incorpore historias cautivadoras o personajes animados en las lecciones. Por ejemplo, enseñe matemáticas a través de la aventura de un personaje. Use ejemplos vívidos y cercanos para hacer el contenido memorable.`,
      why: `Las narrativas atractivas y los personajes memorables son vehículos eficaces para aprender. Los personajes “queribles” mejoran la participación y la retención de contenido educativo; los niños prestan más atención y recuerdan mejor cuando se implican con los personajes.`
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
      title: "Use proyectos colaborativos cortos",
      how: `Organice un proyecto breve de diseño colaborativo donde equipos pequeños aborden un problema (p. ej., construir un modelo simple) en tiempo acotado. Fomente el prototipado rápido y las presentaciones para aprender haciendo.`,
      why: `Los Design Sprints fomentan la colaboración y desarrollan habilidades críticas de resolución de problemas. Los proyectos cortos involucran al estudiantado al permitirles crear y probar sus ideas.`
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
      title: "Enseñe que equivocarse está bien",
      how: `Anime a asumir desafíos nuevos y normalice los errores. Use cuestionarios que destaquen fallos comunes y luego analicen por qué ocurren y cómo corregirlos. Celebre la mejora en lugar de penalizar el error.`,
      why: `Permitir que el estudiantado cometa y corrija errores con una actitud positiva fortalece la comprensión y consolida conexiones de aprendizaje precisas. En K-12, los errores pueden fortalecer el aprendizaje.`
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
      title: "Incluya experimentos seguros o simulaciones",
      how: `Implemente experimentos prácticos o laboratorios virtuales donde los niños prueben ideas en un entorno controlado. Use simulaciones y actividades interactivas para que exploren conceptos activamente (con guía).`,
      why: `El aprendizaje práctico aumenta la participación y la retención. Cuando el estudiantado experimenta, aprende con mayor profundidad que con la escucha pasiva.`
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
      title: "Use apuntes y ejercicios guiados",
      how: `Entregue guías con andamiaje o ejercicios de completar espacios donde los estudiantes rellenen información clave (con bancos de palabras si es necesario). Proporcione apuntes parcialmente completos para terminar durante la clase, enfocando la atención en lo esencial.`,
      why: `Los apuntes guiados mantienen la participación y mejoran la retención del material
modernclassrooms.org
. En K-12, este soporte estructurado ayuda a la toma de apuntes y refuerza el aprendizaje.`
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
      title: "Use refuerzo positivo y recompensas",
      how: `Elogie con regularidad el esfuerzo y los logros. Use estrellas doradas, insignias o pequeñas recompensas por participación y progreso. Brinde retroalimentación positiva específica para reforzar conductas y motivación.`,
      why: `El refuerzo positivo motiva y mejora el enfoque. Cuando se reconoce al estudiantado K-12, es más probable que se involucre y repita buenos hábitos de estudio.`
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
      title: "Permita revisar y reenviar tareas",
      how: `Brinde la oportunidad de rehacer tareas o pruebas tras la retroalimentación. Anime a identificar errores y mejorar las respuestas. Puede implementarse con políticas de reentrega o talleres de revisión.`,
      why: `Permitir revisiones es más efectivo para aprender que actividades sin propósito. El estudiantado K-12 que reflexiona sobre la retroalimentación y reenvía demuestra mejor comprensión.`
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
      title: "Fomente la participación temprana en el curso",
      how: `Diseñe módulos iniciales y foros de discusión que el estudiantado complete en la primera semana. Envíe recordatorios o videos de orientación para motivar a iniciar sesión temprano e interactuar con el contenido.`,
      why: `Los estudios encuentran que la actividad temprana en cursos en línea se correlaciona con calificaciones finales más altas. Motivar a comenzar antes puede mejorar retención y desempeño.`
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
      title: "Implemente aprendizaje en espiral",
      how: `Estructure las clases para introducir ideas nucleares y revisarlas más adelante. Por ejemplo, retome un caso o teoría anterior en temas avanzados, conectando nueva información con conocimientos previos.`,
      why: `Revisitar material de forma periódica refuerza la comprensión. El enfoque en espiral fortalece la memoria a lo largo del tiempo, beneficiando el aprendizaje a nivel universitario.`
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
      title: "Use metáforas para aclarar conceptos complejos",
      how: `Introduzca y mantenga una metáfora clara durante el curso. Por ejemplo, explique arquitectura de software con la analogía de un mapa de ciudad. Mantenga la metáfora al cubrir temas relacionados para facilitar la construcción conceptual.`,
      why: `Las metáforas ayudan a formar conexiones y obtener perspectivas que conducen a una comprensión más profunda. Usar analogías familiares a lo largo del curso ayuda a asimilar contenido avanzado.`
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
      title: "Proporcione módulos de práctica interactiva",
      how: `Cree una colección de cuestionarios, simulaciones o mini-proyectos que complementen las clases. El estudiantado puede explorarlos a su ritmo con recursos de apoyo (snippets de código, pistas) para resolver problemas cada vez más complejos.`,
      why: `Los ejercicios interactivos guiados producen mejoras significativas en el aprendizaje. Estas actividades tipo “caja de juguetes” permiten aplicar conceptos activamente y ganar confianza.`
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
      title: "Brinde herramientas y recursos clave",
      how: `Comparta recursos esenciales como librerías de software, materiales de referencia y plataformas de colaboración. Promueva su uso en proyectos o investigación y ofrezca tutoriales o talleres sobre las herramientas nuevas.`,
      why: `El aprendizaje en línea efectivo depende de herramientas digitales de calidad. Dotar al estudiantado de aplicaciones y recursos adecuados mejora la participación y la eficiencia en el aprendizaje.`
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
      title: "Proporcione un mapa del curso",
      how: `Comience con un sílabo detallado o un módulo de orientación que presente estructura, fechas límite y objetivos. Explique cómo cada unidad se conecta con las metas generales, usando diagramas o mapas de aprendizaje para dar una visión de conjunto clara.`,
      why: `Claridad y apoyo comunitario son claves para mantener la participación. Describir el panorama general desde el inicio ayuda a conectar contenidos y sostener la motivación.`
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
      title: "Haga que el estudiantado revise errores",
      how: `Entregue una solución o algoritmo con fallas y pida criticarlo y mejorarlo. Promueva la discusión en grupo sobre los errores y permita reentregas corregidas con retroalimentación.`,
      why: `La corrección guiada de errores fomenta una comprensión más profunda y confianza. Se aprende eficazmente al identificar y arreglar problemas activamente.`
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
      title: "Use ejemplos del mundo real para ilustrar conceptos",
      how: `Enmarque conceptos abstractos en estudios de caso o ejemplos concretos. Cuente la “historia” detrás de un problema (p. ej., un desafío ingenieril real) para ilustrar ideas. Use escenarios detallados para captar el interés.`,
      why: `Las historias y ejemplos cercanos incrementan el interés y la memoria de la información nueva. Un relato convincente alrededor de un concepto ayuda a mantener el foco y recordar el contenido.`
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
  }
];

export const PLATFORM_MOBILE_UI_RECOMMENDATIONS_ES = [
  {
    inputID: "platform-mobile-ui-input-feedback-inline-validation",
    status: "backed",
    patternRef: "ui-input-feedback",
    platform: "mobile",
    recomendation: {
      title: "Proporciona retroalimentación en línea inmediata",
      how: `Cuando las personas ingresen datos en formularios móviles, valida la entrada en tiempo real. Muestra indicadores de éxito o error junto al campo inmediatamente después de escribir (por ejemplo, marcas verdes o texto de error rojo). Usa lenguaje claro y colores distinguibles y actualiza los mensajes conforme corrijan.`,
      why: `La validación en línea permite corregir errores al instante. Reduce esfuerzo y frustración al resolver los fallos antes de avanzar.`,
    },
    sources: [
      {
        title: "10 Design Guidelines for Reporting Errors in Forms",
        authors: "Rachel Krause",
        venue: "Nielsen Norman Group",
        quote: `Idealmente, toda validación debería ser en línea; si un campo contiene un error, debería aparecer un indicador cerca.`,
        tags: ["formularios", "validación", "entrada de datos", "manejo de errores", "UX móvil"],
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
      title: "Usa indicadores claros en flujos de múltiples pasos",
      how: `Divide tareas complejas en un asistente lineal. En cada pantalla móvil, muestra pocos campos. Incluye una barra de progreso o lista de pasos en la parte superior. Etiqueta claramente “Siguiente” y “Atrás” y permite guardar o reanudar.`,
      why: `Mostrar el progreso ayuda a entender cuánto falta. Un modelo mental claro —con el paso actual destacado— evita confusiones sobre la longitud del proceso.`,
    },
    sources: [
      {
        title: "Wizards: Definition and Design Recommendations",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Comunica un modelo mental claro mostrando los pasos e indicando el paso actual.`,
        tags: ["asistente", "progreso", "múltiples pasos", "navegación", "UX móvil"],
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
      title: "Ofrece ayuda contextual mediante tooltips",
      how: `Agrega íconos de ayuda (p. ej., “?” o info) junto a campos o funciones. Al tocarlos, muestra un tooltip breve. En móvil, mantén estos consejos cortos y evita superposiciones que obstruyan contenido. Para explicaciones extensas, usa modales o paneles laterales.`,
      why: `La ayuda contextual guía sin salir de la app. Los tooltips en línea pueden reducir considerablemente los errores, especialmente en móvil donde cambiar de contexto es molesto.`,
    },
    sources: [
      {
        title: "User Guides vs. Inline Help: When Is Each More Appropriate for Assisting Users?",
        authors: "atkabaloch",
        venue: "Medium (UX Planet)",
        quote: `Los tooltips en línea pueden reducir las tasas de error durante el onboarding.`,
        tags: ["ayuda contextual", "tooltips", "asistencia", "UX móvil", "reducción de errores"],
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
      title: "Muestra una barra de progreso concisa",
      how: `Para indicar progreso o completitud de perfil/tareas, muestra una barra horizontal o porcentaje. Actualízala dinámicamente conforme se completan pasos. Usa etiquetas motivadoras (p. ej., “45% completo — faltan 5 pasos”) y anima el avance.`,
      why: `Los indicadores de progreso motivan mostrando cuán cerca está la meta. Un inicio “rápido” de progreso suele incrementar la finalización de tareas.`,
    },
    sources: [
      {
        title: "From RPGs to UX: How User Progress Bars Actually Affect Completion",
        authors: "Anthony Perrotta",
        venue: "UX Collective (Medium)",
        quote: `La finalización aumenta cuando la retroalimentación de progreso inicia rápida y luego se ralentiza.`,
        tags: ["barra de progreso", "gamificación", "compromiso", "finalización de tareas", "UX móvil"],
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
      title: "Proporciona valores predeterminados adecuados y autofill",
      how: `En móvil, precompleta campos cuando sea posible: predetermina código de país por región, sugiere valores usados antes o usa funciones del dispositivo (GPS, dictado). Muestra opciones comunes al inicio. Usa autocompletado para coincidir la entrada.`,
      why: `Los buenos predeterminados reducen tipeo y aceleran tareas. Aprovecha historial, valores frecuentes y capacidades del dispositivo para autocompletar.`,
    },
    sources: [
      {
        title: "A Checklist for Designing Mobile Input Fields",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `¿Tienes predeterminados razonables, historial disponible o valores frecuentes para este campo?`,
        tags: ["valores predeterminados", "autocompletar", "formularios", "entrada móvil", "UX"],
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
      title: "Minimiza o evita los breadcrumbs en móvil",
      how: `En pantallas pequeñas, evita rutas largas. Si usas breadcrumbs, muestra solo el nivel padre y la página actual (p. ej., “Categoría > Actual”). De lo contrario, confía en el botón Atrás o el menú. Asegura que el texto no envuelva a múltiples líneas y sea tocable.`,
      why: `Los breadcrumbs consumen espacio y pueden ser difíciles de tocar en móvil. Acórtalos u omítelos para ahorrar espacio.`,
    },
    sources: [
      {
        title: "Breadcrumbs: 11 Design Guidelines for Desktop and Mobile",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote: `En móvil, los breadcrumbs pueden ocupar demasiado espacio o ser difíciles de pulsar.`,
        tags: ["navegación", "breadcrumbs", "UX móvil", "orientación", "usabilidad"],
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
      title: "Envía notificaciones relevantes y oportunas",
      how: `Usa notificaciones push o in-app con moderación. Cada notificación debe ser claramente relevante y accionable. Agrupa actualizaciones similares y ofrece suscripción por categorías. Redacta mensajes concisos y selecciona el momento adecuado.`,
      why: `Las notificaciones irrelevantes molestan. Menos, pero mejor dirigidas, suelen mejorar satisfacción y retención.`,
    },
    sources: [
      {
        title: "The (Enticing) Overwhelm: The Mental Side of Notifications",
        authors: "Aza Raskin",
        venue: "Smashing Magazine",
        quote: `“Menos, pero mejores” notificaciones suelen mejorar el compromiso y la retención.`,
        tags: ["notificaciones", "retención", "engagement", "UX móvil", "push"],
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
      title: "Limita y optimiza la navegación por pestañas",
      how: `Usa pocas pestañas principales (3–5) con iconos/etiquetas claras y colócalas al alcance del pulgar (frecuentemente abajo). Evita pestañas con scroll horizontal. Si hay muchas secciones, considera menús anidados o acordeones. Indica claramente el estado activo.`,
      why: `Demasiadas pestañas dificultan el descubrimiento en móvil. Los acordeones a menudo funcionan mejor que largas listas de pestañas.`,
    },
    sources: [
      {
        title: "Tabs, Used Right",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Los acordeones son especialmente útiles en dispositivos móviles por el espacio limitado.`,
        tags: ["navegación", "pestañas", "acordeones", "diseño móvil", "UX"],
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
      title: "Usa divulgación progresiva para reducir el desorden",
      how: `Muestra primero lo esencial. Oculta funciones avanzadas o poco frecuentes bajo “Más”, “Detalles” o secciones plegables. Permite tocar para revelar controles o información adicional (paneles expandibles, desplegables).`,
      why: `Diferir contenido secundario mantiene la pantalla limpia y evita sobrecarga en móvil.`,
    },
    sources: [
      {
        title: "Progressive Disclosure: Avoiding Information Overload",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote: `Diferir el material secundario es una pauta clave para diseño móvil.`,
        tags: ["divulgación progresiva", "diseño móvil", "UX", "jerarquía de información", "simplicidad"],
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
      title: "Permite cambiar a vista completa o diseños alternativos",
      how: `Ofrece control sobre modos de vista: incluye enlace “Sitio completo” para cargar la versión de escritorio en navegadores móviles. Ofrece alternar entre lista y cuadrícula. Respeta cambios de orientación (vertical y horizontal).`,
      why: `Algunas funciones avanzadas solo existen en la versión completa. Proporciona un enlace claro al sitio completo cuando sea necesario.`,
    },
    sources: [
      {
        title: "Mobile: Dedicated Site vs. Responsive Design",
        authors: "Jakob Nielsen",
        venue: "Nielsen Norman Group",
        quote: `Ofrece un enlace visible desde el sitio móvil al sitio completo para quien lo necesite.`,
        tags: ["diseño adaptable", "web móvil", "sitio completo", "UX", "responsive"],
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
      title: "Activa autocompletar en campos y búsquedas",
      how: `Ofrece sugerencias en tiempo real mientras se escribe. Usa datos previos o opciones comunes en un desplegable. Evita autocorregir nombres/direcciones de forma inesperada. Permite completar con un toque.`,
      why: `El autocompletar reduce el tipeo en teclados pequeños y acelera la entrada.`,
    },
    sources: [
      {
        title: "A Checklist for Designing Mobile Input Fields",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Haz sugerencias/autocompletar basadas en las primeras letras tecleadas.`,
        tags: ["autocompletar", "búsqueda", "campos de entrada", "UX móvil", "formularios"],
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
      title: "Coloca los filtros en panel de pantalla completa o lateral",
      how: `Activa los filtros con un botón. Abre un overlay a pantalla completa o un panel lateral con las opciones. Usa casillas, deslizadores e interruptores grandes. Incluye “Aplicar” y una forma clara de limpiar selección.`,
      why: `Un panel de filtros a pantalla completa permite organizar muchas opciones de forma clara y usable en pantallas pequeñas.`,
    },
    sources: [
      {
        title: "Best practices for mobile search filter UX",
        authors: "DTE Systems",
        venue: "LogRocket Blog",
        quote: `El filtrado a pantalla completa muestra y organiza opciones de forma clara y accesible.`,
        tags: ["filtros", "búsqueda", "UX móvil", "patrones UI", "panel"],
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
      title: "Diseña un tablero móvil compacto y enfocado",
      how: `Muestra solo métricas y gráficos clave. Usa una lista vertical de tarjetas con títulos claros y tipografía legible. Prefiere visualizaciones simples (iconos, indicadores, gráficos básicos) y ofrece acciones de “ver detalles”.`,
      why: `Minimizar el desorden en tableros móviles mejora claridad y usabilidad: incluye únicamente lo más importante.`,
    },
    sources: [
      {
        title: "Effective Mobile Dashboard Design: Best Tips",
        authors: "ANODA UX Agency",
        venue: "ANODA",
        quote: `Limita elementos: incluye solo las métricas y visualizaciones más importantes para reducir el desorden.`,
        tags: ["tablero", "visualización de datos", "UX móvil", "métricas", "usabilidad"],
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
      title: "Usa un diseño limpio e intuitivo para el leaderboard",
      how: `Muestra una lista vertical de posiciones con usuario, avatar y puntaje. Mantén el diseño simple. Resalta la fila de la persona actual. Asegura objetivos táctiles amplios y tipografía consistente.`,
      why: `Un layout claro permite encontrar rápidamente la posición y el progreso propio.`,
    },
    sources: [
      {
        title: "Climbing the Ranks: A Guide to Leaderboards in Mobile Gaming",
        authors: "Ali Dursun",
        venue: "Medium",
        quote: `Debe ser limpio y sencillo, con posiciones fácilmente identificables; la gente debería hallar su lugar y progreso rápidamente.`,
        tags: ["leaderboard", "juegos móviles", "clasificación", "UX", "usabilidad"],
        url: "https://medium.com/@alidrsn/climbing-the-ranks-a-guide-to-leaderboards-in-mobile-gaming-67f4f808e147",
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
      title: "Muestra insignias coleccionables y el progreso",
      how: `En la sección de logros, muestra insignias bloqueadas vs. desbloqueadas (gris vs. color). Añade una descripción breve y un contador de progreso (p. ej., 3/10). Celebra nuevos logros con una animación o notificación ligera.`,
      why: `Los logros motivan al recompensar hitos y ofrecen un incentivo adicional para alcanzarlos.`,
    },
    sources: [
      {
        title: "Personalization and Gamification of Loyalty Programs",
        authors: "Valentin Stoychev",
        venue: "Interaction-Design.org",
        quote: `Ofrecer una insignia coleccionable en un hito específico incentiva a completar los pasos necesarios.`,
        tags: ["gamificación", "logros", "compromiso", "motivación", "UX"],
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
      title: "Presenta un feed de actividad cronológico",
      how: `Implementa un feed vertical con eventos recientes (publicaciones, “me gusta”, comentarios) en orden temporal. Incluye sellos de tiempo e iconos. Considera mensajes agregados para eventos relacionados. Ofrece filtros o pestañas separadas para notificaciones vs. contenido.`,
      why: `Un feed desplazable es intuitivo en móvil. Muchas apps usan feeds planos o agregados; a menudo coexisten feed de notificaciones y feed de actividad.`,
    },
    sources: [
      {
        title: "How Activity Feeds Work (Blog Post)",
        authors: "Kirill Danilov (Stream)",
        venue: "GetStream.io",
        quote: `Los feeds planos listan actividades; los agregados combinan acciones. Muchas apps tienen feed de notificaciones y feed plano.`,
        tags: ["feed", "actividad", "notificaciones", "social UI", "UX móvil"],
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
      title: "Diseña un chat claro con burbujas diferenciadas",
      how: `Usa burbujas alternas (alineación/color) para cada participante. Fija el input en la parte inferior con un botón de enviar claro. Muestra avatares/iniciales y hora. Permite pulsación larga para acciones (copiar, reaccionar).`,
      why: `Distinguir visualmente mensajes de cada participante facilita seguir la conversación y mejora la legibilidad.`,
    },
    sources: [
      {
        title: "The User Experience of Customer-Service Chat: 20 Guidelines",
        authors: "Raluca Budiu",
        venue: "Nielsen Norman Group",
        quote: `Colorear de forma diferente los mensajes del agente y del usuario hace el chat más fácil de leer.`,
        tags: ["chat", "mensajería", "UX", "conversación", "móvil"],
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
      title: "Proporciona botones de reacción interactivos",
      how: `Coloca iconos de reacción (pulgar, corazón, etc.) junto al contenido. Asegura objetivos táctiles grandes y feedback inmediato (cambio de color o microanimación). Considera selector de emojis para reacciones adicionales.`,
      why: `Las microinteracciones animadas aumentan el atractivo y fomentan la participación al hacer visible y gratificante la acción de reaccionar.`,
    },
    sources: [
      {
        title: "Mastering UX Design Strategies to Maximize User Engagement on Social Media Platforms",
        authors: "Zigpoll Team",
        venue: "Zigpoll Blog",
        quote: `Los botones de reacción animados son acciones divertidas y visualmente atractivas para interactuar con el contenido.`,
        tags: ["reacciones", "microinteracciones", "participación", "UX", "social"],
        url: "http://www.zigpoll.com/content/what-specific-ux-design-strategies-have-you-found-most-effective-in-in-increasing-user-engagement-on-social-media-platforms",
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
      title: "Usa coachmarks para guiar a nuevos usuarios",
      how: `En el primer inicio o tras actualizaciones, superpone coachmarks —llamadas resaltadas con flechas y textos breves— apuntando a elementos clave. Una pista por paso, con el resto de la pantalla atenuada. Incluye opción de omitir.`,
      why: `Los coachmarks actúan como guías paso a paso y enseñan funciones en contexto, suavizando el onboarding.`,
    },
    sources: [
      {
        title: "How to Use Coachmarks and Spotlight UI in Mobile Apps",
        authors: "Ananya Vairavarajan",
        venue: "Plotline Blog",
        quote: `Funcionan como guías visuales con instrucciones paso a paso para un onboarding fluido e intuitivo.`,
        tags: ["onboarding", "coachmarks", "UX", "tutorial", "móvil"],
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
      title: "Ofrece un tour interactivo breve",
      how: `Implementa un recorrido de varios pasos con tooltips o pantallas superpuestas que guíen por funciones clave. Exige una acción del usuario para avanzar (tocar el elemento destacado). Muestra indicador de pasos y permite omitir o repetir.`,
      why: `Los tours interactivos mantienen la atención y aseguran que se aprendan funciones importantes; los tooltips accionados por el usuario suelen ser altamente atractivos.`,
    },
    sources: [
      {
        title: "Product tour UI/UX: Best onboarding flow patterns",
        authors: "Appcues Team",
        venue: "Appcues Blog",
        quote: `Los tooltips accionados por el usuario crean experiencias de onboarding muy atractivas e interactivas.`,
        tags: ["onboarding", "tour", "tooltips", "UX", "interactivo"],
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
      title: "Convierte estados vacíos en guías útiles",
      how: `Cuando no haya datos (primer uso o sin resultados), muestra una ilustración o mensaje amigable. Incluye un llamado claro a la acción (p. ej., “Añade tu primer ítem”) o instrucciones. Mantén la UI limpia y orienta el siguiente paso.`,
      why: `Un estado vacío bien diseñado reduce confusión, muestra el valor del producto y acorta el tiempo hasta alcanzar valor.`,
    },
    sources: [
      {
        title: "Blank Slate UI Design - 20 Best Examples to Replace Boring Empty States",
        authors: "Sophie Grigoryan",
        venue: "Userpilot Blog",
        quote: `Aprovecha el estado vacío para presentar el producto, establecer expectativas, reducir frustración y disminuir el tiempo hasta el valor.`,
        tags: ["estado vacío", "onboarding", "UX", "primer uso", "móvil"],
        url: "https://userpilot.com/blog/blank-slate-ui-design-examples/",
        doi: "",
      },
    ],
  },
];
export const PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS_ES = [
  {
    inputID: "platform-web-responsive-ui-input-feedback-inline-validation",
    status: "backed",
    patternRef: "ui-input-feedback",
    platform: "web-responsive",
    recomendation: {
      title: "Validación en tiempo real en línea",
      how:
        "En formularios adaptativos, valide los campos mientras el usuario escribe y muestre mensajes de error o éxito junto al campo inmediatamente.",
      why:
        "La retroalimentación inmediata en línea previene la frustración y mejora las tasas de éxito. No espere al envío; dé feedback mientras se ingresan los datos.",
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
      title: "Enfoque en un solo paso a la vez",
      how:
        "Oculte o colapse todos los pasos excepto el actual en wizards en pantallas pequeñas, mostrando sólo el título o indicador del paso presente.",
      why:
        "Los formularios multi-paso son más fáciles de completar en móvil si el usuario se concentra en un paso a la vez. Condense la interfaz para mostrar sólo el paso actual.",
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
      title: "Ayuda en línea activada por toque",
      how:
        "Agregue íconos o enlaces de ayuda junto a los elementos; en móvil, al tocar se debe mostrar un tooltip breve o superposición de ayuda en lugar de depender de hover.",
      why:
        "En dispositivos móviles no existe el hover. Los tooltips deben aparecer cuando los usuarios tocan un ícono, brindando información adicional bajo demanda.",
    },
    sources: [
      {
        title: "Designing Better Tooltips For Mobile User Interfaces",
        authors: "Eric Olive",
        venue: "Smashing Magazine",
        quote:
          "A tooltip provides this supplemental information when users tap an icon, image, hyperlink, or other element in a mobile user interface.",
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
      title: "Indicadores de progreso compactos",
      how:
        "Muestre una barra de progreso o indicadores (puntos, porcentajes) en la parte superior. En pantallas pequeñas, use versiones mínimas (por ejemplo, puntos o una barra reducida) que quepan sin saturar la vista.",
      why:
        "Los indicadores de progreso orientan al usuario y aumentan la completitud. En móviles, opciones simplificadas (como puntos) mantienen la claridad sin ocupar mucho espacio.",
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
      title: "Autocompletar campos comunes",
      how:
        "Use datos contextuales (como perfil de usuario o ubicación) para rellenar automáticamente campos en formularios adaptativos.",
      why:
        "Los valores por defecto prellenados reducen esfuerzo y errores. Se recomienda prellenar campos o sugerir respuestas comunes cuando ya se dispone de esos datos.",
    },
    sources: [
      {
        title: "Good Defaults in UX design — UX Knowledge Piece #39",
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
      title: "Acortar la ruta de navegación",
      how:
        "Muestre una versión reducida del breadcrumb (por ejemplo, solo el nivel actual o los últimos niveles) en pantallas pequeñas.",
      why:
        "Las migas de pan completas ocupan mucho espacio en móvil; mostrar sólo los niveles finales mantiene el contexto sin saturar la pantalla.",
    },
    sources: [
      {
        title: "Breadcrumbs: 11 Design Guidelines for Desktop and Mobile",
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
      title: "Notificaciones tipo snackbar desechables",
      how:
        "Use banners o notificaciones emergentes no intrusivas en los bordes de la pantalla; asegure que desaparezcan solos y no bloqueen la interacción.",
      why:
        "Los snackbars móviles deben caducar automáticamente y no ser persistentes. No deben apilarse ni bloquear la interacción.",
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
      title: "Pestañas navegables horizontalmente",
      how:
        "En pantallas estrechas, permita que la fila de pestañas se desplace horizontalmente o agrupe pestañas extras en un menú desplegable.",
      why:
        "Cuando no caben todas las pestañas en pantallas pequeñas, un contenedor desplazable horizontalmente asegura acceso a todas.",
    },
    sources: [
      {
        title: "Tabbed navigation in UX: Where and when to use it",
        authors: "LogRocket Blog",
        venue: "LogRocket",
        quote:
          "If you can’t fit all tabs horizontally, use a horizontally scrollable container; on mobile, host the tabs in a scrollable container.",
        tags: ["tabs", "navigation", "responsive"],
        url: "https://blog.logrocket.com/ux-design/tabs-ux-best-practices/",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-progressive-disclosure-secondary",
    status: "backed",
    patternRef: "ui-progressive-disclosure",
    platform: "web-responsive",
    recomendation: {
      title: "Retrasar opciones avanzadas",
      how:
        "Muestre solo las opciones más importantes inicialmente; oculte características avanzadas en pantallas o menús secundarios.",
      why:
        "Retrasar contenido secundario simplifica la interfaz y mantiene el foco, alineado con la divulgación progresiva en diseño móvil.",
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
      title: "Permitir cambio de vista",
      how:
        "Ofrezca un control (por ejemplo, un enlace o conmutador) para alternar entre la vista móvil y la versión de escritorio completa.",
      why:
        "No todos los usuarios móviles prefieren la versión simplificada; ofrecer el cambio de vista atiende preferencias y necesidades distintas.",
    },
    sources: [
      {
        title: "Adaptable View",
        authors: "UI-Patterns.com",
        venue: "UI Patterns",
        quote:
          "Provide a manual control to allow users to switch/alter the default style of a page so that it better fits their specific needs.",
        tags: ["adaptive design", "view switching", "accessibility"],
        url: "https://ui-patterns.com/patterns/AdaptableView",
      },
    ],
  },
  {
    inputID: "platform-web-responsive-ui-autocomplete-scroll-into-view",
    status: "backed",
    patternRef: "ui-autocomplete",
    platform: "web-responsive",
    recomendation: {
      title: "Desplazar campo de autocompletar",
      how:
        "Al enfocar un campo de autocompletar en móvil, desplácelo al inicio de la pantalla (encima del teclado) para que las sugerencias no queden ocultas.",
      why:
        "El teclado virtual puede tapar el desplegable de sugerencias. Asegurar que el campo y la lista estén visibles mantiene la usabilidad.",
    },
    sources: [
      {
        title:
          "Creating user friendly autocomplete inputs for mobile devices",
        authors: "A.R. Nirjhor",
        venue: "UX StackExchange (Answer)",
        quote:
          "Highlight the autocomplete input when it is focused on mobile devices, bringing it to the top of the screen and hiding everything else.",
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
      title: "Panel de filtros colapsable",
      how:
        "Coloque los filtros detrás de un botón o icono que abra un panel (por ejemplo, un drawer) al pulsarlo en móviles.",
      why:
        "Ubicar los filtros en un drawer evita saturar la interfaz y mejora el alcance con el pulgar en pantallas pequeñas.",
    },
    sources: [
      {
        title: "Mobile Filter UX Design Patterns & Best Practices",
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
    inputID: "platform-web-responsive-ui-dashboard-horizontal-carousel",
    status: "backed",
    patternRef: "ui-dashboard",
    platform: "web-responsive",
    recomendation: {
      title: "Carrusel horizontal de widgets",
      how:
        "Permita que los elementos principales del dashboard (tarjetas, gráficos) se deslicen horizontalmente; mueva información secundaria a menús o secciones colapsables.",
      why:
        "En móvil el espacio es limitado; desplazar horizontalmente los elementos clave y ocultar lo secundario en menús mejora la experiencia.",
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
    inputID: "platform-web-responsive-ui-leaderboard-horizontal-scroll",
    status: "backed",
    patternRef: "ui-leaderboard",
    platform: "web-responsive",
    recomendation: {
      title: "Permitir scroll horizontal en tablas",
      how:
        "Si la tabla de clasificación tiene muchas columnas, habilite el desplazamiento horizontal o oculte columnas extra en detalles expandibles.",
      why:
        "En tablas anchas, debe ser evidente que hay más contenido. Use pistas visuales (flechas o columnas cortadas) para indicar que se puede desplazar.",
    },
    sources: [
      {
        title: "Mobile Tables: Comparisons and Other Data Tables",
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
    inputID: "platform-web-responsive-ui-collectible-achievements-visible",
    status: "backed",
    patternRef: "ui-collectible-achievements",
    platform: "web-responsive",
    recomendation: {
      title: "Mostrar logros prominentemente",
      how:
        "Exhiba las insignias/logros del usuario en su perfil o dashboard de manera visible (por ejemplo, en una rejilla de íconos).",
      why:
        "Los logros deben verse inmediatamente al obtenerlos; si se ocultan, disminuye su valor motivacional.",
    },
    sources: [
      {
        title: "Display Achievements to Encourage Website Usage",
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
      title: "Uso de scroll infinito",
      how:
        "Implemente desplazamiento infinito en el feed de actividades para cargar más contenido a medida que el usuario baja.",
      why:
        "En redes sociales y sitios de noticias, los usuarios esperan un flujo continuo de contenido. El scroll infinito mantiene la navegación fluida sin interrupciones.",
    },
    sources: [
      {
        title: "Infinite scroll design: best practices and examples",
        authors: "Justinmind Team",
        venue: "Justinmind Blog",
        quote:
          "Social media users expect a constant stream of content without effort; infinite scroll websites make it easy to stay engaged without clicking.",
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
      title: "Fijar el campo de entrada abajo",
      how:
        "Bloquee el campo de texto en la parte inferior del chat, justo encima del teclado virtual.",
      why:
        "En chat, los mensajes más recientes van al final y el teclado virtual ocupa la base de la pantalla. Ubicar el campo de entrada sobre el teclado es lo más lógico.",
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
      title: "Objetivos táctiles grandes",
      how:
        "Use botones o íconos de reacción grandes y bien espaciados para facilitar el toque.",
      why:
        "Los elementos interactivos deben ser de al menos 1 cm × 1 cm en pantallas táctiles para evitar errores y ralentizaciones.",
    },
    sources: [
      {
        title: "Touch Targets on Touchscreens",
        authors: "Aurora Harley",
        venue: "Nielsen Norman Group",
        quote:
          "Interactive elements must be at least 1cm × 1cm (0.4in × 0.4in) to support adequate selection time and prevent fat-finger errors.",
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
      title: "Pistas breves y enfocadas",
      how:
        "Muestre un solo hint o coachmark enfocado en un elemento a la vez, con texto mínimo.",
      why:
        "Los usuarios móviles rara vez leen instrucciones largas. Dar demasiada información a la vez aumenta la carga cognitiva; pistas cortas y focalizadas son más efectivas.",
    },
    sources: [
      {
        title:
          "Instructional Overlays and Coach Marks for Mobile Apps",
        authors: "Aurora Harley",
        venue: "Nielsen Norman Group",
        quote:
          "Showing too many instructions at once increases users’ cognitive load; focus on a single feature rather than explaining everything.",
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
      title: "Visitas guiadas cortas y opcionales",
      how:
        "Limite los pasos en cualquier tour introductorio y ofrezca siempre la opción de omitirlo.",
      why:
        "La memoria a corto plazo es limitada; demasiadas instrucciones seguidas abruman y desincentivan el uso. Mantenga el tour breve y opcional.",
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
      title: "Estado vacío informativo",
      how:
        "En lugar de pantalla en blanco, muestre un mensaje claro que explique la ausencia de contenido y provea un botón o enlace de acción relevante (p. ej., “Crear nuevo elemento”).",
      why:
        "Los estados vacíos deben comunicar el estado y orientar al usuario. Un simple mensaje sin contexto confunde; agregar texto explicativo y una llamada a la acción genera confianza.",
    },
    sources: [
      {
        title:
          "Designing Empty States in Complex Applications: 3 Guidelines",
        authors: "Nielsen Norman Group",
        venue: "Nielsen Norman Group",
        quote:
          "A brief message (like “There are no records to display”) communicates the state of the system and increases user confidence.",
        tags: ["empty state", "guidance", "ux"],
        url: "https://www.nngroup.com/articles/empty-state-interface-design/",
      },
    ],
  },
];


