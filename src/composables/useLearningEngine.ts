import { computed, ref } from 'vue'
import { useAdaptiveLearning } from '@/composables/useAdaptiveLearning'
import { useLearningStore } from '@/stores/learningStore'
import type {
  Challenge,
  ChallengeResult,
} from '@/types/learning'

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase()
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function useLearningEngine() {
  const store = useLearningStore()
  const adaptive = useAdaptiveLearning()

  const currentChallenge = ref<Challenge | null>(null)
  const lastResult = ref<ChallengeResult | null>(null)

  const stats = computed(() => ({
    xp: store.state.xp,
    stars: store.state.stars,
    combo: store.state.combo,
    accuracy: store.accuracy.value,
    learnedWords: store.state.learnedWords.length,
    reviewWords: store.state.reviewQueue.length,
  }))

  function startChallenge(): Challenge {
    currentChallenge.value = adaptive.chooseChallenge()
    lastResult.value = null

    return currentChallenge.value
  }

  function evaluateAnswer(
    challenge: Challenge,
    answer: string,
  ): boolean {
    if (challenge.type === 'multiple-choice') {
      return normalizeAnswer(answer) ===
        normalizeAnswer(challenge.correctAnswer ?? '')
    }

    const normalized = normalizeAnswer(answer)
    const words = countWords(answer)

    const meetsWordCount = words >= (challenge.minWords ?? 1)
    const keywords = challenge.requiredKeywords ?? []

    const meetsKeywords = keywords.every((keyword) =>
      normalized.includes(keyword.toLowerCase()),
    )

    return meetsWordCount && meetsKeywords
  }

  function submitAnswer(answer: string): ChallengeResult | null {
    const challenge = currentChallenge.value

    if (!challenge || lastResult.value) {
      return null
    }

    const isCorrect = evaluateAnswer(challenge, answer)
    const xpEarned = store.recordAttempt(challenge.skill, isCorrect)

    if (isCorrect && challenge.reviewWord) {
      store.addLearnedWord(challenge.reviewWord)
      store.removeReviewWord(challenge.reviewWord)
    }

    if (!isCorrect && challenge.reviewWord) {
      store.addReviewWord(challenge.reviewWord)
    }

    const result: ChallengeResult = {
      isCorrect,
      userAnswer: answer,
      correctAnswer: challenge.correctAnswer
        ?? 'Try writing a longer and clearer answer.',
      explanation: challenge.explanation,
      xpEarned,
    }

    lastResult.value = result

    return result
  }

  function closeChallenge(): void {
    currentChallenge.value = null
    lastResult.value = null
  }

  return {
    currentChallenge,
    lastResult,
    stats,
    skillPriorities: adaptive.skillPriorities,
    startChallenge,
    submitAnswer,
    closeChallenge,
  }
}