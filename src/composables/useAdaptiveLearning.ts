import { computed, ref } from "vue";
import { CHALLENGES, SKILLS } from "@/data/challenges";
import { useLearningStore } from "@/stores/learningStore";
import type { Challenge, LearningSkill } from "@/types/learning";

const TEST_QUESTION_COUNT = 10;
const QUESTIONS_PER_SKILL = 2;

export function useAdaptiveLearning() {
  const store = useLearningStore();

  const previousSkill = ref<LearningSkill | null>(null);

  const skillPriorities = computed(() => {
    return SKILLS.map((skill) => {
      const progress = store.state.skillProgress[skill];

      const accuracy =
        progress.attempts === 0 ? 0 : progress.correct / progress.attempts;

      const practiceFrequency = Math.min(progress.attempts / 10, 1);

      return {
        skill,
        score: (1 - accuracy) * 0.65 + (1 - practiceFrequency) * 0.35,
      };
    }).sort((a, b) => b.score - a.score);
  });

  function randomItem<T>(items: T[]): T | undefined {
    if (items.length === 0) return undefined;

    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle<T>(items: T[]): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));

      [result[i], result[j]] = [result[j]!, result[i]!];
    }

    return result;
  }

  function chooseSkill(): LearningSkill {
    const availableSkills = SKILLS.filter((skill) =>
      CHALLENGES.some((challenge) => challenge.skill === skill),
    );

    if (availableSkills.length === 0) {
      throw new Error("No learning skills are available.");
    }

    const eligibleSkills =
      availableSkills.length > 1
        ? availableSkills.filter((skill) => skill !== previousSkill.value)
        : availableSkills;

    const priorities = skillPriorities.value.filter((item) =>
      eligibleSkills.includes(item.skill),
    );

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

    const selected = randomItem(candidates);

    if (!selected) {
      throw new Error(`No challenges available for skill: ${skill}`);
    }

    store.rememberChallenge(selected.id);

    return selected;
  }

  /**
   * Select 10 questions for a level test.
   * Each learning skill contributes exactly 2 questions.
   */
  function chooseLevelTestChallenges(): Challenge[] {
    const selected: Challenge[] = [];
    const selectedIds = new Set<string>();
    const recentIds = store.state.lastChallengeIds;

    function selectForSkill(skill: LearningSkill): void {
      const available = CHALLENGES.filter(
        (challenge) =>
          challenge.skill === skill && !selectedIds.has(challenge.id),
      );

      if (available.length < QUESTIONS_PER_SKILL) {
        throw new Error(
          `Level test requires at least ${QUESTIONS_PER_SKILL} challenges for ${skill}. Available: ${available.length}.`,
        );
      }

      const progress = store.state.skillProgress[skill];

      // Prefer the current adaptive difficulty.
      const matchingDifficulty = available.filter(
        (challenge) => challenge.difficulty === progress.difficulty,
      );

      // Avoid recently used questions when possible.
      const fresh = available.filter(
        (challenge) => !recentIds.includes(challenge.id),
      );

      const preferredFresh = fresh.filter(
        (challenge) => challenge.difficulty === progress.difficulty,
      );

      let pool =
        preferredFresh.length >= QUESTIONS_PER_SKILL
          ? preferredFresh
          : matchingDifficulty.length >= QUESTIONS_PER_SKILL
            ? matchingDifficulty
            : fresh.length >= QUESTIONS_PER_SKILL
              ? fresh
              : available;

      pool = shuffle(pool);

      const questions = pool.slice(0, QUESTIONS_PER_SKILL);

      questions.forEach((challenge) => {
        selected.push(challenge);
        selectedIds.add(challenge.id);
        store.rememberChallenge(challenge.id);
      });
    }

    // Every skill must appear in the test.
    SKILLS.forEach(selectForSkill);

    if (selected.length !== TEST_QUESTION_COUNT) {
      throw new Error(
        `Expected ${TEST_QUESTION_COUNT} questions, got ${selected.length}.`,
      );
    }

    return shuffle(selected);
  }

  return {
    skillPriorities,
    chooseSkill,
    chooseChallenge,
    chooseLevelTestChallenges,
  };
}
