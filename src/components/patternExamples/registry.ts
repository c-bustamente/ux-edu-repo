import dynamic from "next/dynamic";
import ExampleEarlyBird from "./peda-patterns/ExampleEarlyBird";
import ExampleToyBox from "./peda-patterns/ExampleToyBox";
export const patternExampleRegistry: Record<string, any> = {
  ExampleInputFeedback: dynamic(() => import("./ui-patterns/ExampleInputFeedback")),
   ExampleWizard: dynamic(() => import("./ui-patterns/ExampleWizard")),
   ExampleInlineHelpBox: dynamic(() => import("./ui-patterns/ExampleInlineHelpBox")),
  ExampleCompletenessMeter: dynamic(() => import("./ui-patterns/ExampleCompletenessMeter"), { ssr: false }),
  ExampleGoodDefaults: dynamic(() => import("./ui-patterns/ExampleGoodDefaults")),
  ExampleBreadcrumbs: dynamic(() => import("./ui-patterns/ExampleBreadcrumbs")),
  ExampleNotifications: dynamic(() => import("./ui-patterns/ExampleNotifications")),
  ExampleNavigationTabs: dynamic(() => import("./ui-patterns/ExampleNavigationTabs")),
  ExampleProgressiveDisclosure: dynamic(() => import("./ui-patterns/ExampleProgressiveDisclosure")),
  ExampleAdaptableView: dynamic(() => import("./ui-patterns/ExampleAdaptableView")),
  ExampleAutocomplete: dynamic(() => import("./ui-patterns/ExampleAutocomplete")),
  ExampleSearchFilters: dynamic(() => import("./ui-patterns/ExampleSearchFilters")),
  ExampleDashboard: dynamic(() => import("./ui-patterns/ExampleDashboard")),
  ExampleLeaderboard: dynamic(() => import("./ui-patterns/ExampleLeaderboard")),
  ExampleCollectibleAchievements: dynamic(() => import("./ui-patterns/ExampleCollectibleAchievements")),
  ExampleActivityStream: dynamic(() => import("./ui-patterns/ExampleActivityStream")),
  ExampleChat: dynamic(() => import("./ui-patterns/ExampleChat")),
  ExampleReaction: dynamic(() => import("./ui-patterns/ExampleReaction"), { ssr: false }),
  ExampleCoachmarks: dynamic(() => import("./ui-patterns/ExampleCoachmarks")),
  ExampleGuidedTour: dynamic(() => import("./ui-patterns/ExampleGuidedTour")),
  ExampleBlankSlate: dynamic(() => import("./ui-patterns/ExampleBlankSlate")),
  ExampleZeroBlock: dynamic(() => import("./instructional-patterns/ExampleZeroBlock")),
  ExampleResourceDesign: dynamic(() => import("./instructional-patterns/ExampleResourceDesign")),
  ExampleGlossary: dynamic(() => import("./instructional-patterns/ExampleGlossary")),
  ExampleAssignments: dynamic(() => import("./instructional-patterns/ExampleAssignments")),
  ExampleForum: dynamic(() => import("./instructional-patterns/ExampleForum")),
  ExampleAssessments: dynamic(() => import("./instructional-patterns/ExampleAssessments")),
  ExampleScormObjects: dynamic(() => import("./instructional-patterns/ExampleScormObjects")),
  ExampleWiki: dynamic(() => import("./instructional-patterns/ExampleWiki")),
  ExampleChatInstructional: dynamic(() => import("./instructional-patterns/ExampleChatInstructional")),
  ExampleGames: dynamic(() => import("./instructional-patterns/ExampleGames")),
  ExampleEarlyBird: dynamic(() => import("./peda-patterns/ExampleEarlyBird")),
  ExampleSpiral: dynamic(() => import("./peda-patterns/ExampleSpiral")),
  ExampleConsistentMetaphor: dynamic(() => import("./peda-patterns/ExampleConsistentMetaphor")),
  ExampleToyBox: dynamic(() => import("./peda-patterns/ExampleToyBox")),
  ExampleToolBox: dynamic(() => import("./peda-patterns/ExampleToolBox")),
  ExampleLayOfTheLand: dynamic(() => import("./peda-patterns/ExampleLayOfTheLand")),
  ExampleFixerUpper: dynamic(() => import("./peda-patterns/ExampleFixerUpper")),
  ExampleLargerThanLife: dynamic(() => import("./peda-patterns/ExampleLargerThanLife")),
  ExampleStudentDesignSprint: dynamic(() => import("./peda-patterns/ExampleStudentDesignSprint")),
  ExampleMistake: dynamic(() => import("./peda-patterns/ExampleMistake")),
  ExampleTestTube: dynamic(() => import("./peda-patterns/ExampleTestTube")),
  ExampleFillInTheBlanks: dynamic(() => import("./peda-patterns/ExampleFillInTheBlanks")),
  ExampleGoldStar: dynamic(() => import("./peda-patterns/ExampleGoldStar")),
  ExampleGradeItAgainSam: dynamic(() => import("./peda-patterns/ExampleGradeItAgainSam")),






  //  aquí los demás ExampleXYZ 
};
