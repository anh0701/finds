import { computed, ref } from 'vue'
import { useAdaptiveLearning } from '@/composables/useAdaptiveLearning'
import { useLearningStore } from '@/stores/learningStore'
import { gradeWriting } from '@/services/writingGrader'
import type {
  Challenge,
  ChallengeResult,
} from '@/types/learning'

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase()
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

  function submitAnswer(answer: string): ChallengeResult | null {
    const challenge = currentChallenge.value

    if (!challenge || lastResult.value) {
      return null
    }

    let isCorrect = false
    let writingGrade: ChallengeResult['writingGrade']

    if (challenge.type === 'multiple-choice') {
      isCorrect =
        normalizeAnswer(answer) ===
        normalizeAnswer(challenge.correctAnswer ?? '')
    } else {
      writingGrade = gradeWriting(challenge, answer)
      isCorrect = writingGrade.passed
    }

    const xpEarned = store.recordAttempt(
      challenge.skill,
      isCorrect,
    )

    if (isCorrect && challenge.reviewWord) {
      store.addLearnedWord(challenge.reviewWord)
      store.removeReviewWord(challenge.reviewWord)
    }

    if (!isCorrect && challenge.reviewWord) {
      store.addReviewWord(challenge.reviewWord)
    }

    const writingExplanation = writingGrade
      ? writingGrade.errors
          .map((error) => {
            return error.suggestion
              ? `${error.message} ${error.suggestion}`
              : error.message
          })
          .join('\n')
      : ''

    const result: ChallengeResult = {
      isCorrect,
      userAnswer: answer,
      correctAnswer:
        challenge.correctAnswer ??
        'Try writing a longer and clearer answer.',
      explanation: writingGrade
        ? writingExplanation || challenge.explanation
        : challenge.explanation,
      xpEarned,
      writingGrade,
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