import { computed, ref } from "vue";
import { CHALLENGES, SKILLS } from "@/data/challenges";
import { useLearningStore } from "@/stores/learningStore";
import type { Challenge, LearningSkill } from "@/types/learning";

export function useAdaptiveLearning() {
  const store = useLearningStore();

  // Remember the skill selected in the previous challenge.
  const previousSkill = ref<LearningSkill | null>(null);

  const skillPriorities = computed(() => {
    return SKILLS.map((skill) => {
      const progress = store.state.skillProgress[skill];

      const accuracy =
        progress.attempts === 0 ? 0 : progress.correct / progress.attempts;

      const practiceFrequency = Math.min(progress.attempts / 10, 1);

      const weaknessScore = 1 - accuracy;
      const lackOfPractice = 1 - practiceFrequency;

      return {
        skill,
        score: weaknessScore * 0.65 + lackOfPractice * 0.35,
      };
    }).sort((a, b) => b.score - a.score);
  });

  function chooseSkill(): LearningSkill {
    const availableSkills = SKILLS.filter((skill) =>
      CHALLENGES.some((challenge) => challenge.skill === skill),
    );

    if (availableSkills.length === 0) {
      throw new Error("No learning skills are available.");
    }

    // Avoid selecting the same skill in consecutive challenges.
    const eligibleSkills =
      availableSkills.length > 1
        ? availableSkills.filter((skill) => skill !== previousSkill.value)
        : availableSkills;

    const priorities = skillPriorities.value.filter((item) =>
      eligibleSkills.includes(item.skill),
    );

    // Use weighted random selection instead of always choosing
    // the skill with the highest priority.
    const weightedSkills = priorities.map((item) => ({
      skill: item.skill,
      weight: Math.max(item.score, 0.1) ** 2,
    }));

    const totalWeight = weightedSkills.reduce(
      (total, item) => total + item.weight,
      0,
    );

    let random = Math.random() * totalWeight;

    for (const item of weightedSkills) {
      random -= item.weight;

      if (random <= 0) {
        previousSkill.value = item.skill;
        return item.skill;
      }
    }

    const selected = weightedSkills[weightedSkills.length - 1];

    if (!selected) {
      throw new Error("Unable to select a learning skill.");
    }

    previousSkill.value = selected.skill;

    return selected.skill;
  }

  function chooseChallenge(): Challenge {
    const skill = chooseSkill();
    const difficulty = store.state.skillProgress[skill].difficulty;
    const recentIds = store.state.lastChallengeIds;

    let candidates = CHALLENGES.filter(
      (challenge) =>
        challenge.skill === skill &&
        challenge.difficulty === difficulty &&
        !recentIds.includes(challenge.id),
    );

    if (candidates.length === 0) {
      candidates = CHALLENGES.filter(
        (challenge) =>
          challenge.skill === skill && !recentIds.includes(challenge.id),
      );
    }

    if (candidates.length === 0) {
      candidates = CHALLENGES.filter((challenge) => challenge.skill === skill);
    }

    if (candidates.length === 0) {
      throw new Error(`No challenges available for skill: ${skill}`);
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];

    if (!selected) {
      throw new Error("No learning challenge is available.");
    }

    store.rememberChallenge(selected.id);

    return selected;
  }

  return {
    skillPriorities,
    chooseSkill,
    chooseChallenge,
  };
}
