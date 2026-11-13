import { computed, ref } from "vue";

import { useAdaptiveLearning } from "@/composables/useAdaptiveLearning";
import { useLearningStore } from "@/stores/learningStore";
import { gradeWriting } from "@/services/writingGrader";

import type { Challenge, ChallengeResult } from "@/types/learning";

const TEST_QUESTION_COUNT = 10;
const TEST_PASS_SCORE = 5;

export type LevelTestStatus = "idle" | "in-progress" | "passed" | "failed";

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

export function useLearningEngine() {
  const store = useLearningStore();
  const adaptive = useAdaptiveLearning();

  // Normal challenge state.
  const currentChallenge = ref<Challenge | null>(null);
  const lastResult = ref<ChallengeResult | null>(null);

  // Level test state.
  const testChallenges = ref<Challenge[]>([]);
  const testAnswers = ref<ChallengeResult[]>([]);
  const testQuestionIndex = ref(0);
  const lastTestResult = ref<ChallengeResult | null>(null);
  const testStatus = ref<LevelTestStatus>("idle");

  const stats = computed(() => ({
    xp: store.state.xp,
    stars: store.state.stars,
    combo: store.state.combo,
    accuracy: store.accuracy.value,
    learnedWords: store.state.learnedWords.length,
    reviewWords: store.state.reviewQueue.length,
  }));

  const currentTestQuestion = computed(
    () => testChallenges.value[testQuestionIndex.value] ?? null,
  );

  const testCorrectCount = computed(
    () => testAnswers.value.filter((result) => result.isCorrect).length,
  );

  const testWrongCount = computed(
    () => testAnswers.value.filter((result) => !result.isCorrect).length,
  );

  const testProgress = computed(
    () => (testAnswers.value.length / TEST_QUESTION_COUNT) * 100,
  );

  const testPassed = computed<boolean | null>(() => {
    if (testStatus.value === "passed") return true;
    if (testStatus.value === "failed") return false;

    return null;
  });

  const isTestCompleted = computed(
    () => testStatus.value === "passed" || testStatus.value === "failed",
  );

  /**
   * Evaluate an answer and update learning progress.
   * Used by both normal challenges and level tests.
   */
  function evaluateAnswer(
    challenge: Challenge,
    answer: string,
  ): ChallengeResult {
    let isCorrect = false;
    let writingGrade: ChallengeResult["writingGrade"];

    if (challenge.type === "multiple-choice") {
      isCorrect =
        normalizeAnswer(answer) ===
        normalizeAnswer(challenge.correctAnswer ?? "");
    } else {
      writingGrade = gradeWriting(challenge, answer);
      isCorrect = writingGrade.passed;
    }

    const xpEarned = store.recordAttempt(challenge.skill, isCorrect);

    if (isCorrect && challenge.reviewWord) {
      store.addLearnedWord(challenge.reviewWord);
      store.removeReviewWord(challenge.reviewWord);
    }

    if (!isCorrect && challenge.reviewWord) {
      store.addReviewWord(challenge.reviewWord);
    }

    const writingExplanation = writingGrade
      ? writingGrade.errors
          .map((error) =>
            error.suggestion
              ? `${error.message} ${error.suggestion}`
              : error.message,
          )
          .join("\n")
      : "";

    return {
      isCorrect,
      userAnswer: answer,
      correctAnswer:
        challenge.correctAnswer ??
        challenge.sampleAnswer ??
        "Try writing a longer and clearer answer.",
      explanation: writingGrade
        ? writingExplanation || challenge.explanation
        : challenge.explanation,
      xpEarned,
      writingGrade,
    };
  }

  // ------------------------------------
  // Normal challenge
  // ------------------------------------

  function startChallenge(): Challenge {
    currentChallenge.value = adaptive.chooseChallenge();
    lastResult.value = null;

    return currentChallenge.value;
  }

  function submitAnswer(answer: string): ChallengeResult | null {
    const challenge = currentChallenge.value;

    if (!challenge || lastResult.value) {
      return null;
    }

    const result = evaluateAnswer(challenge, answer);

    lastResult.value = result;

    return result;
  }

  function closeChallenge(): void {
    currentChallenge.value = null;
    lastResult.value = null;
  }

  // ------------------------------------
  // Level test
  // ------------------------------------

  /**
   * Start a new 10-question level test.
   * A new randomized set is generated on every attempt.
   */
  function startLevelTest(): Challenge[] {
    testChallenges.value = adaptive.chooseLevelTestChallenges();

    testAnswers.value = [];
    testQuestionIndex.value = 0;
    lastTestResult.value = null;

    testStatus.value = "in-progress";

    return testChallenges.value;
  }

  /**
   * Submit the current test answer.
   * The next question is displayed only after advanceTest().
   */
  function submitTestAnswer(answer: string): ChallengeResult | null {
    const challenge = currentTestQuestion.value;

    if (
      testStatus.value !== "in-progress" ||
      !challenge ||
      lastTestResult.value
    ) {
      return null;
    }

    const result = evaluateAnswer(challenge, answer);

    testAnswers.value.push(result);
    lastTestResult.value = result;

    return result;
  }

  /**
   * Move to the next question.
   * After question 10, calculate PASS or FAIL.
   */
  function advanceTest(): void {
    if (testStatus.value !== "in-progress" || !lastTestResult.value) {
      return;
    }

    if (testAnswers.value.length >= TEST_QUESTION_COUNT) {
      testStatus.value =
        testCorrectCount.value >= TEST_PASS_SCORE ? "passed" : "failed";

      return;
    }

    testQuestionIndex.value += 1;
    lastTestResult.value = null;
  }

  /**
   * Close the test and clear its temporary state.
   * Does not modify the player's level.
   */
  function closeLevelTest(): void {
    testChallenges.value = [];
    testAnswers.value = [];
    testQuestionIndex.value = 0;
    lastTestResult.value = null;

    testStatus.value = "idle";
  }

  return {
    // Normal learning.
    currentChallenge,
    lastResult,
    stats,
    skillPriorities: adaptive.skillPriorities,
    startChallenge,
    submitAnswer,
    closeChallenge,

    // Level test.
    testChallenges,
    testAnswers,
    testQuestionIndex,
    currentTestQuestion,
    lastTestResult,
    testStatus,
    testCorrectCount,
    testWrongCount,
    testProgress,
    testPassed,
    isTestCompleted,
    startLevelTest,
    submitTestAnswer,
    advanceTest,
    closeLevelTest,

    // Constants.
    TEST_QUESTION_COUNT,
    TEST_PASS_SCORE,
  };
}
