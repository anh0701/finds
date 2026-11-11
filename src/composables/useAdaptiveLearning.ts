import { computed } from 'vue'
import { CHALLENGES, SKILLS } from '@/data/challenges'
import { useLearningStore } from '@/stores/learningStore'
import type {
  Challenge,
  LearningSkill,
} from '@/types/learning'

export function useAdaptiveLearning() {
  const store = useLearningStore()

  const skillPriorities = computed(() => {
    return SKILLS
      .map((skill) => {
        const progress = store.state.skillProgress[skill]

        const accuracy = progress.attempts === 0
          ? 0
          : progress.correct / progress.attempts

        const practiceFrequency = Math.min(
          progress.attempts / 10,
          1,
        )

        const weaknessScore = 1 - accuracy
        const lackOfPractice = 1 - practiceFrequency

        return {
          skill,
          score: weaknessScore * 0.65 + lackOfPractice * 0.35,
        }
      })
      .sort((a, b) => b.score - a.score)
  })

  function chooseSkill(): LearningSkill {
    return skillPriorities.value[0]?.skill ?? 'vocabulary'
  }

  function chooseChallenge(): Challenge {
    const skill = chooseSkill()
    const difficulty = store.state.skillProgress[skill].difficulty
    const recentIds = store.state.lastChallengeIds

    let candidates = CHALLENGES.filter(
      (challenge) =>
        challenge.skill === skill &&
        challenge.difficulty === difficulty &&
        !recentIds.includes(challenge.id),
    )

    if (candidates.length === 0) {
      candidates = CHALLENGES.filter(
        (challenge) =>
          challenge.skill === skill &&
          !recentIds.includes(challenge.id),
      )
    }

    if (candidates.length === 0) {
      candidates = CHALLENGES.filter(
        (challenge) => challenge.skill === skill,
      )
    }

    if (candidates.length === 0) {
      candidates = CHALLENGES
    }

    const randomIndex = Math.floor(Math.random() * candidates.length)
    const selected = candidates[randomIndex]

    if (!selected) {
      throw new Error('No learning challenge is available.')
    }

    store.rememberChallenge(selected.id)

    return selected
  }

  return {
    skillPriorities,
    chooseSkill,
    chooseChallenge,
  }
}