import type { LearningSkill } from "@/types/learning";

import { vocabularyChallenges } from "@/data/challenges/vocabulary";
import { grammarChallenges } from "@/data/challenges/grammar";
import { readingChallenges } from "@/data/challenges/reading";
import { listeningChallenges } from "@/data/challenges/listening";
import { writingChallenges } from "@/data/challenges/writing";

export const SKILLS: LearningSkill[] = [
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "writing",
];

export const CHALLENGES = [
  ...vocabularyChallenges,
  ...grammarChallenges,
  ...readingChallenges,
  ...listeningChallenges,
  ...writingChallenges,
];
